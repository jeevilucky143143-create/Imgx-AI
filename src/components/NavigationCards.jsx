import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  UploadCloud, 
  Layers, 
  BarChart3, 
  Cpu, 
  Check, 
  Scan, 
  Database,
  Sliders
} from 'lucide-react';

export default function NavigationCards() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="text-xs font-mono font-bold tracking-widest text-violet-600 dark:text-violet-400 uppercase mb-2">
            System Modules
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Explore imgx.ai
          </h2>
        </div>
        <p className="mt-2 md:mt-0 text-sm font-medium text-slate-500 dark:text-slate-400 max-w-md">
          A modular deep learning framework designed to inspect, explain, and evaluate neural image classifiers.
        </p>
      </div>

      {/* 4 Visually Distinct Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARD 01 — CLASSIFY */}
        <Link 
          to="/classify"
          className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-white/10 hover:border-violet-500/50 dark:hover:border-violet-500/50 shadow-sm hover:shadow-xl hover:shadow-violet-950/20 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="space-y-4">
            {/* Header / Number */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50">
                01
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-violet-500 group-hover:bg-violet-50 dark:group-hover:bg-violet-500/10 transition-colors">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                CLASSIFY
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Upload an image and discover what the model sees.
              </p>
            </div>

            {/* Distinct Visual Composition 1: Interactive Dropzone Radar */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090a10] border border-dashed border-violet-300 dark:border-violet-500/30 flex flex-col items-center justify-center py-6 group-hover:border-violet-500 transition-colors">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                </span>
              </div>
              <span className="mt-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                DROP IMAGE OR BROWSE
              </span>
              <span className="text-[9px] font-mono text-violet-600 dark:text-violet-400 font-semibold mt-0.5">
                PNG, JPG, WEBP • MAX 15MB
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-violet-600 dark:text-violet-400 font-semibold">
            <span>START INFERENCE</span>
            <span>→</span>
          </div>
        </Link>

        {/* CARD 02 — HOW IT WORKS */}
        <Link 
          to="/how-it-works"
          className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-white/10 hover:border-violet-500/50 dark:hover:border-violet-500/50 shadow-sm hover:shadow-xl hover:shadow-violet-950/20 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="space-y-4">
            {/* Header / Number */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50">
                02
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-purple-500 group-hover:bg-purple-50 dark:group-hover:bg-purple-500/10 transition-colors">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                HOW IT WORKS
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Follow the journey from pixels to prediction.
              </p>
            </div>

            {/* Distinct Visual Composition 2: Neural Tensor Stack & Flow */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090a10] border border-slate-200 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>CONVOLUTIONAL MAPS</span>
                <span className="text-purple-400">4 STAGES</span>
              </div>
              
              <div className="flex items-center justify-between gap-1 py-2">
                <div className="flex-1 h-8 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
                  INPUT
                </div>
                <div className="text-violet-400 font-mono text-xs">→</div>
                <div className="flex-1 h-8 rounded bg-violet-100 dark:bg-violet-950/60 border border-violet-300 dark:border-violet-500/40 flex items-center justify-center text-[10px] font-mono font-bold text-violet-700 dark:text-violet-300">
                  CONV
                </div>
                <div className="text-violet-400 font-mono text-xs">→</div>
                <div className="flex-1 h-8 rounded bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/40 flex items-center justify-center text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300">
                  DENSE
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200 dark:border-white/5">
                <span>TENSOR SHAPE:</span>
                <span className="text-slate-700 dark:text-slate-300">[224, 224, 3]</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-purple-600 dark:text-purple-400 font-semibold">
            <span>PIPELINE OVERVIEW</span>
            <span>→</span>
          </div>
        </Link>

        {/* CARD 03 — HISTORY */}
        <Link 
          to="/history"
          className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-white/10 hover:border-violet-500/50 dark:hover:border-violet-500/50 shadow-sm hover:shadow-xl hover:shadow-violet-950/20 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="space-y-4">
            {/* Header / Number */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/50">
                03
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-cyan-500 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-500/10 transition-colors">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                HISTORY
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Explore previous classifications and confidence scores.
              </p>
            </div>

            {/* Distinct Visual Composition 3: Confidence Score Distribution Bars */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090a10] border border-slate-200 dark:border-white/5 space-y-2.5">
              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-700 dark:text-slate-300">
                  <span>Golden Retriever</span>
                  <span className="font-bold text-emerald-500">98.4%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-emerald-500 h-full rounded-full w-[98.4%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-700 dark:text-slate-300">
                  <span>Sports Car</span>
                  <span className="font-bold text-cyan-500">96.1%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-cyan-500 h-full rounded-full w-[96.1%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-700 dark:text-slate-300">
                  <span>Monarch Butterfly</span>
                  <span className="font-bold text-violet-500">91.8%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-violet-500 h-full rounded-full w-[91.8%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
            <span>INSPECTION LOGS</span>
            <span>→</span>
          </div>
        </Link>

        {/* CARD 04 — ABOUT */}
        <Link 
          to="/about"
          className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-white/10 hover:border-violet-500/50 dark:hover:border-violet-500/50 shadow-sm hover:shadow-xl hover:shadow-violet-950/20 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="space-y-4">
            {/* Header / Number */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
                04
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                ABOUT
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Explore the model, technology and project.
              </p>
            </div>

            {/* Distinct Visual Composition 4: Tech Spec Matrix & Badges */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090a10] border border-slate-200 dark:border-white/5 grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="p-2 rounded bg-white dark:bg-[#151824] border border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 block">BACKEND</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">PyTorch v2</span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-[#151824] border border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 block">LATENCY</span>
                <span className="font-bold text-emerald-500">&lt; 15 ms</span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-[#151824] border border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 block">CLASSES</span>
                <span className="font-bold text-violet-400">1,000 Cat</span>
              </div>
              <div className="p-2 rounded bg-white dark:bg-[#151824] border border-slate-200/60 dark:border-white/5">
                <span className="text-slate-500 block">PRECISION</span>
                <span className="font-bold text-purple-400">FP16 / INT8</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
            <span>SPECIFICATIONS</span>
            <span>→</span>
          </div>
        </Link>

      </div>
    </section>
  );
}
