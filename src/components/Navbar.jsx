import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sun, 
  Moon, 
  Scan, 
  Menu, 
  X, 
  ArrowRight, 
  LogOut, 
  User,
  Activity 
} from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Classify', path: '/classify' },
    { name: 'History', path: '/history' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About', path: '/about' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-xl bg-white/75 dark:bg-[#0b0d14]/80 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-lg shadow-black/5 dark:shadow-violet-950/20 px-4 sm:px-6 h-16 flex items-center justify-between transition-colors duration-300">
          
          {/* Brand Logo - Links to /home for authenticated users */}
          <Link 
            to="/home" 
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="imgx.ai Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-700 via-violet-600 to-purple-400 p-[1px] shadow-sm shadow-violet-500/30 transition-transform group-hover:scale-105 duration-200">
              <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center">
                <Scan className="w-5 h-5 text-violet-400 group-hover:rotate-90 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tight text-lg leading-tight text-slate-900 dark:text-white flex items-center gap-1">
                imgx<span className="text-violet-500">.ai</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 dark:text-violet-400/70">
                Neural Vision
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Live Model Online Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono tracking-wider font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              MODEL ONLINE
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all duration-200 focus:outline-none"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Get Started Button */}
            <Link
              to="/classify"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-sm shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>GET STARTED</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Authenticated User & Logout */}
            {isAuthenticated && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-white/10">
                <div 
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-medium max-w-[130px] truncate"
                  title={user?.email}
                >
                  <User className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                  <span className="truncate">{user?.name || 'User'}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-transparent hover:border-rose-200 dark:hover:border-rose-800/40 transition-all duration-200"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-2 p-4 backdrop-blur-xl bg-white/95 dark:bg-[#0f1118]/95 border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                MODEL ONLINE
              </div>
              {user && (
                <span className="text-xs font-mono text-violet-500 truncate max-w-[150px]">
                  {user.name}
                </span>
              )}
            </div>

            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex flex-col gap-2">
              <Link
                to="/classify"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 shadow-md shadow-violet-600/30"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {isAuthenticated && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>LOGOUT</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
