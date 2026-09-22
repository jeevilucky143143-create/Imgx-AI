import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  Scan, 
  ArrowRight, 
  Sun, 
  Moon, 
  Sparkles,
  Lock
} from 'lucide-react';
import VisionPipelineComposition from '../components/VisionPipelineComposition';

export default function PublicLandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-slate-50 dark:bg-[#08090d] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Subtle Computer Vision Background Details */}
      <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark opacity-25 pointer-events-none"></div>
      
      {/* Subtle Violet Ambient Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-600/10 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Elegant Computer Vision Reticles & Keypoints (Faint & Non-distracting) */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-violet-500/30"></div>
        <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-violet-500/30"></div>
        <div className="hidden md:flex items-center gap-1.5 absolute top-[20%] left-[12%] text-[10px] font-mono text-violet-500/40">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500/40"></span>
          <span>CV_KEYPOINT // (x: 104, y: 72)</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 absolute top-[40%] right-[14%] text-[10px] font-mono text-violet-500/40">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500/40"></span>
          <span>FEATURE_VECTOR // (2048-D)</span>
        </div>
      </div>

      {/* Minimal Public Navigation Bar */}
      <header className="relative z-10 w-full px-6 sm:px-12 py-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2.5 group focus:outline-none"
          aria-label="imgx.ai"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-700 via-violet-600 to-purple-400 p-[1px] shadow-sm shadow-violet-500/20 transition-transform group-hover:scale-105 duration-200">
            <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center">
              <Scan className="w-4 h-4 text-violet-400" />
            </div>
          </div>
          <span className="font-black tracking-tight text-xl leading-none text-slate-900 dark:text-white">
            imgx<span className="text-violet-500">.ai</span>
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-200/50 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all duration-200"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <Link
            to="/login"
            className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 px-3 py-2 rounded-xl transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col">
        
        {/* ===================================================================== */}
        {/* 1. MAIN PUBLIC HERO SECTION                                           */}
        {/* ===================================================================== */}
        <section className="max-w-4xl mx-auto px-6 sm:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center flex flex-col items-center justify-center">
          
          {/* Subtle AI Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100/80 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/40 shadow-sm mb-6 animate-in fade-in duration-500">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-widest text-violet-700 dark:text-violet-300 uppercase">
              COMPUTER VISION PLATFORM
            </span>
          </div>

          {/* Display Prominently: IMGX.AI */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
            IMGX<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-400">.AI</span>
          </h1>

          {/* Prominently: "Teaching Machines to See." */}
          <div className="mt-4 sm:mt-6 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-violet-600 dark:text-violet-400 italic">
            “Teaching Machines to See.”
          </div>

          {/* Short description */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl font-normal leading-relaxed">
            An intelligent image classification system powered by deep learning. Upload an image and discover what the model sees.
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto">
            {/* Primary button: "LOGIN →" */}
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>LOGIN</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Secondary button: "REGISTER →" */}
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-300 dark:border-white/15 hover:border-violet-400 dark:hover:border-violet-500/40 shadow-sm transition-all duration-200"
            >
              <span>REGISTER</span>
              <ArrowRight className="w-5 h-5 text-violet-500" />
            </Link>
          </div>

        </section>

        {/* ===================================================================== */}
        {/* 2. VISION PIPELINE COMPOSITION (LAYERED FLOATING TILES)               */}
        {/* ===================================================================== */}
        <VisionPipelineComposition />

        {/* ===================================================================== */}
        {/* 3. BOTTOM SECTION: "SEE WHAT THE MODEL SEES."                         */}
        {/* ===================================================================== */}
        <section className="py-16 sm:py-24 px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
              SEE WHAT THE MODEL SEES.
            </h3>
            
            <p className="text-base sm:text-lg font-mono text-violet-600 dark:text-violet-400 font-semibold tracking-wider">
              Upload. Analyze. Classify.
            </p>

            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 border border-slate-200 dark:border-white/10 hover:border-violet-500 shadow-sm transition-all duration-200 group"
              >
                <span>LOGIN TO START</span>
                <ArrowRight className="w-4 h-4 text-violet-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Minimal Public Footer */}
      <footer className="relative z-10 w-full px-6 sm:px-12 py-6 border-t border-slate-200/70 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-400">imgx.ai</span>
          <span>•</span>
          <span>Teaching machines to see.</span>
        </div>
        <div>
          © {new Date().getFullYear()} imgx.ai Framework
        </div>
      </footer>

    </div>
  );
}
