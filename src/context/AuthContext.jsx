import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getToken, setToken, removeToken } from '../services/api';

const AuthContext = createContext(null);

const USER_SESSION_KEY = 'imgx_session_user';

const getInitialStoredUser = () => {
  try {
    const stored = localStorage.getItem(USER_SESSION_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed === 'object' && parsed.email) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialStoredUser);
  const [loading, setLoading] = useState(true);

  // Validate / restore session from backend on mount if token exists
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const token = getToken();
      if (!token) {
        if (isMounted) {
          setUser(null);
          localStorage.removeItem(USER_SESSION_KEY);
          setLoading(false);
        }
        return;
      }

      try {
        const userData = await api.auth.getMe();
        if (isMounted) {
          setUser(userData);
          localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
        }
      } catch (err) {
        console.warn('[AuthContext] Session token expired or invalid:', err.message);
        if (isMounted) {
          removeToken();
          localStorage.removeItem(USER_SESSION_KEY);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Real backend Login
  const login = async (email, password) => {
    const data = await api.auth.login({
      email: email.trim().toLowerCase(),
      password,
    });

    const sessionUser = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
    };

    setToken(data.access_token);
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return sessionUser;
  };

  // Real backend Register (does NOT auto-login)
  const register = async (name, email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    await api.auth.register({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    return { success: true, email: normalizedEmail };
  };

  // Logout - clears token and user state
  const logout = () => {
    removeToken();
    localStorage.removeItem(USER_SESSION_KEY);
    sessionStorage.removeItem(USER_SESSION_KEY);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
