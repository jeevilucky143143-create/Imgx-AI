import React from 'react';
import { Link } from 'react-router-dom';
import { Scan, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#07080c] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Tagline */}
          <div className="md:col-span-6 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-700 to-purple-500 p-[1px]">
                <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center">
                  <Scan className="w-4 h-4 text-violet-400 group-hover:rotate-90 transition-transform duration-500" />
                </div>
              </div>
              <span className="font-black tracking-tight text-xl text-slate-900 dark:text-white">
                imgx<span className="text-violet-500">.ai</span>
              </span>
            </Link>
            
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300 italic">
              "Teaching machines to see."
            </p>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              State-of-the-art image classification powered by deep convolutional neural networks and transformer backbones.
            </p>
          </div>

          {/* Links Section */}
          <div className="md:col-span-6 flex flex-col sm:flex-row justify-end gap-10 sm:gap-16">
            
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-sm font-medium">
                <li>
                  <Link 
                    to="/classify" 
                    className="text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    Classify
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/history" 
                    className="text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    History
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/how-it-works" 
                    className="text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className="text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} imgx.ai — Image Classification Using Deep Learning.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All Systems Operational
            </span>
            <span>v1.0.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
