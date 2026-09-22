import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function AuthenticatedLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#08090d] text-slate-900 dark:text-slate-100 selection:bg-violet-500 selection:text-white transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
