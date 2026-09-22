import React, { useState } from 'react';
import { 
  Scan, 
  Sparkles, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Activity, 
  Crosshair, 
  ArrowRight,
  Maximize2
} from 'lucide-react';

export default function VisionPipelineComposition() {
  const [hoveredTile, setHoveredTile] = useState(null);

  return (
    <section className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-violet-600/10 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 text-xs font-mono font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
            Visual Intelligence Flow
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
            FROM PIXELS TO PREDICTION
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            See how raw visual data travels through the model and becomes an intelligent classification.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP LAYERED FLOATING COMPOSITION (lg and up)                          */}
        {/* ========================================================================= */}
        <div className="hidden lg:block relative h-[680px] w-full max-w-6xl mx-auto">
          
          {/* Subtle Connecting Flow SVG Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#c084fc" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.6" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Path: Tile 1 (Image) -> Tile 2 (Features) */}
            <path 
              d="M 290 180 C 340 220, 240 320, 310 380" 
              fill="none" 
              stroke="url(#flowGradient)" 
              strokeWidth="2" 
              strokeDasharray="6 4"
              className="animate-pulse"
            />

            {/* Path: Tile 2 (Features) -> Tile 3 (Model) */}
            <path 
              d="M 480 360 C 580 340, 600 240, 680 180" 
              fill="none" 
              stroke="url(#flowGradient)" 
              strokeWidth="2" 
              strokeDasharray="6 4"
            />

            {/* Path: Tile 3 (Model) -> Tile 4 (Prediction) */}
            <path 
              d="M 800 240 C 820 300, 810 350, 830 400" 
              fill="none" 
              stroke="#8b5cf6" 
              strokeWidth="2.5" 
              strokeDasharray="4 4"
              filter="url(#glow)"
            />
          </svg>

          {/* ------------------------------------------------------------------- */}
          {/* TILE 1 — IMAGE INPUT                                                */}
          {/* ------------------------------------------------------------------- */}
          <div 
            onMouseEnter={() => setHoveredTile(1)}
            onMouseLeave={() => setHoveredTile(null)}
            className="absolute left-4 top-6 w-[310px] z-10 transition-all duration-500 hover:z-40 -rotate-2 hover:rotate-0 hover:scale-[1.04] hover:-translate-y-2 group"
          >
            <div className="rounded-2xl bg-white/90 dark:bg-[#0f1118]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 group-hover:border-violet-500/60 shadow-xl group-hover:shadow-2xl group-hover:shadow-violet-950/30 overflow-hidden transition-all duration-300">
              
              {/* Header */}
              <div className="px-4 py-2.5 bg-slate-100/80 dark:bg-[#090b12] border-b border-slate-200 dark:border-white/5 flex items-center justify-between font-mono text-[11px]">
                <span className="text-violet-600 dark:text-violet-400 font-bold tracking-wider">
                  TILE 01 // IMAGE INPUT
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-semibold">
                  RAW PIXELS
                </span>
              </div>

              {/* Visual Frame */}
              <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=80" 
                  alt="Golden Retriever Input" 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Reticle brackets */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-violet-400"></div>
                <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-violet-400"></div>
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-violet-400"></div>
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-violet-400"></div>

                {/* Viewfinder crosshair */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                  <Crosshair className="w-8 h-8 text-white/70 stroke-1" />
                </div>

                {/* Dimension Badge */}
                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-white/20 text-white font-mono text-[10px] font-bold">
                  1024 × 768
                </div>

                <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-violet-600/90 text-white font-mono text-[9px] font-bold">
                  RGB // 24-BIT
                </div>
              </div>

              {/* Bottom detail strip */}
              <div className="px-4 py-2 bg-white dark:bg-[#0d0f17] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span>CHANNELS: 3 [R,G,B]</span>
                <span className="text-violet-600 dark:text-violet-400 font-semibold">STAGE 1 →</span>
              </div>

            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* TILE 2 — FEATURE EXTRACTION                                         */}
          {/* ------------------------------------------------------------------- */}
          <div 
            onMouseEnter={() => setHoveredTile(2)}
            onMouseLeave={() => setHoveredTile(null)}
            className="absolute left-56 top-72 w-[340px] z-20 transition-all duration-500 hover:z-40 rotate-1 hover:rotate-0 hover:scale-[1.04] hover:-translate-y-2 group"
          >
            <div className="rounded-2xl bg-white/90 dark:bg-[#0f1118]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 group-hover:border-cyan-500/60 shadow-xl group-hover:shadow-2xl group-hover:shadow-cyan-950/20 p-5 space-y-4 transition-all duration-300">
              
              {/* Header */}
              <div className="flex items-center justify-between font-mono text-[11px]">
                <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-bold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>TILE 02 // FEATURE EXTRACTION</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 font-mono text-[10px] font-bold">
                  2048-D VECTOR
                </span>
              </div>

              {/* Abstract Computer-Vision Visualization Canvas */}
              <div className="relative h-36 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden p-3 flex flex-col justify-between">
                
                {/* Background coordinate grid */}
                <div className="absolute inset-0 bg-grid-dark opacity-40"></div>

                {/* SVG Feature Points & Graph */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Connection lines */}
                  <line x1="40" y1="30" x2="110" y2="70" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.6" />
                  <line x1="110" y1="70" x2="190" y2="40" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.6" />
                  <line x1="110" y1="70" x2="140" y2="105" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.5" />
                  <line x1="190" y1="40" x2="270" y2="80" stroke="#8b5cf6" strokeWidth="1.5" strokeOpacity="0.6" />
                  <line x1="140" y1="105" x2="230" y2="95" stroke="#06b6d4" strokeWidth="1.5" strokeOpacity="0.5" />

                  {/* Pulsing Feature Nodes */}
                  <circle cx="40" cy="30" r="3.5" fill="#06b6d4" className="animate-ping opacity-75" />
                  <circle cx="40" cy="30" r="3" fill="#06b6d4" />

                  <circle cx="110" cy="70" r="4" fill="#a855f7" />
                  <circle cx="190" cy="40" r="3.5" fill="#06b6d4" />
                  <circle cx="140" cy="105" r="3" fill="#06b6d4" />
                  <circle cx="270" cy="80" r="4.5" fill="#8b5cf6" className="animate-pulse" />
                  <circle cx="230" cy="95" r="3" fill="#38bdf8" />
                </svg>

                {/* Floating telemetry labels inside canvas */}
                <div className="relative z-10 flex justify-between text-[9px] font-mono text-cyan-300">
                  <span className="bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    SIFT_KEYPOINTS: 1,428
                  </span>
                  <span className="bg-black/70 px-1.5 py-0.5 rounded border border-violet-500/30 text-violet-300">
                    CONV_KERNELS: 7×7
                  </span>
                </div>

                <div className="relative z-10 flex justify-between text-[9px] font-mono text-slate-400">
                  <span className="bg-black/60 px-1 py-0.5 rounded">LAYER: 4_RESIDUAL</span>
                  <span className="text-cyan-400 font-semibold">ACTIVATION: RELU</span>
                </div>

              </div>

              {/* Vector Bar Meter */}
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>EMBEDDING DENSITY</span>
                  <span className="text-cyan-500 font-bold">2048 FLOATS</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-cyan-500 w-1/3"></div>
                  <div className="h-full bg-violet-500 w-1/2"></div>
                  <div className="h-full bg-purple-400 w-1/6"></div>
                </div>
              </div>

            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* TILE 3 — DEEP LEARNING MODEL                                        */}
          {/* ------------------------------------------------------------------- */}
          <div 
            onMouseEnter={() => setHoveredTile(3)}
            onMouseLeave={() => setHoveredTile(null)}
            className="absolute right-32 top-8 w-[320px] z-10 transition-all duration-500 hover:z-40 -rotate-1 hover:rotate-0 hover:scale-[1.04] hover:-translate-y-2 group"
          >
            <div className="rounded-2xl bg-white/90 dark:bg-[#0f1118]/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 group-hover:border-purple-500/60 shadow-xl group-hover:shadow-2xl group-hover:shadow-purple-950/20 p-5 space-y-4 transition-all duration-300">
              
              {/* Header */}
              <div className="flex items-center justify-between font-mono text-[11px]">
                <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>TILE 03 // DEEP LEARNING</span>
                </div>
                <span className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  INFERENCE ACTIVE
                </span>
              </div>

              {/* Model Spec Badge */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#090a10] border border-slate-200 dark:border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                    BACKBONE ARCHITECTURE
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                    RESNET-50 v2
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                    PARAMETERS
                  </div>
                  <div className="text-xs font-mono font-bold text-purple-500">
                    25.6M WEIGHTS
                  </div>
                </div>
              </div>

              {/* Neural Node Schematic */}
              <div className="space-y-1.5 py-1">
                <div className="text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>RESIDUAL BOTTLENECK BLOCKS</span>
                  <span className="text-purple-400 font-bold">16 STACKS</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {['Conv1', 'Stage 2', 'Stage 3', 'Stage 4'].map((stage, i) => (
                    <div 
                      key={stage}
                      className="py-2 px-1 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-center font-mono text-[9px] text-purple-700 dark:text-purple-300 font-semibold"
                    >
                      {stage}
                    </div>
                  ))}
                </div>
              </div>

              {/* Skip connection badge */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>IDENTITY SHORTCUTS: 3×3</span>
                <span className="text-emerald-500 font-semibold">GRADIENT PRESERVED</span>
              </div>

            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* TILE 4 — PREDICTION (STRONGEST / FOCAL TILE)                        */}
          {/* ------------------------------------------------------------------- */}
          <div 
            onMouseEnter={() => setHoveredTile(4)}
            onMouseLeave={() => setHoveredTile(null)}
            className="absolute right-4 top-60 w-[380px] z-30 transition-all duration-500 hover:z-40 rotate-2 hover:rotate-0 hover:scale-[1.04] hover:-translate-y-2 group"
          >
            {/* Focal glowing ambient ring */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative rounded-3xl bg-white dark:bg-[#0f1118] border-2 border-violet-500/70 shadow-2xl shadow-violet-950/40 p-6 space-y-5 transition-all duration-300">
              
              {/* Header */}
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-violet-600 dark:text-violet-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  TILE 04 // PREDICTION
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-mono font-bold text-[10px]">
                  VERIFIED ACCURACY
                </span>
              </div>

              {/* Primary Label */}
              <div>
                <span className="text-[11px] font-mono tracking-widest uppercase text-slate-500 dark:text-slate-400 block mb-1">
                  TOP-1 CLASSIFICATION RESULT
                </span>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  GOLDEN RETRIEVER
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  CLASS ID: #207 • CANIS LUPUS FAMILIARIS
                </span>
              </div>

              {/* Circular Confidence Meter & Score Block */}
              <div className="p-4 rounded-2xl bg-violet-50/70 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/50 flex items-center justify-between gap-4">
                
                {/* SVG Circular Confidence Ring */}
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Background track */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      className="stroke-slate-200 dark:stroke-slate-800"
                      strokeWidth="3.2"
                    />
                    {/* Glowing progress ring (97.4% of 94.2 circumference) */}
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      className="stroke-violet-500"
                      strokeWidth="3.2"
                      strokeDasharray="94.2"
                      strokeDashoffset="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold text-violet-600 dark:text-violet-400">
                    97.4%
                  </div>
                </div>

                <div className="space-y-1 flex-1">
                  <div className="text-xs font-mono font-bold text-violet-700 dark:text-violet-300">
                    97.4% CONFIDENCE
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-violet-600 to-purple-400 h-full rounded-full w-[97.4%] transition-all duration-1000"></div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex justify-between">
                    <span>LOSS: 0.026</span>
                    <span>SOFTMAX RANK: #1</span>
                  </div>
                </div>

              </div>

              {/* Alternative Top-K Candidates */}
              <div className="space-y-1.5 text-[10px] font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Labrador Retriever</span>
                  <span className="text-slate-500">1.8%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Cocker Spaniel</span>
                  <span className="text-slate-500">0.4%</span>
                </div>
              </div>

            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* TILE 5 — SMALL FLOATING STATUS TILE                                 */}
          {/* ------------------------------------------------------------------- */}
          <div className="absolute right-[46%] bottom-10 z-30 transition-all duration-500 hover:scale-105 rotate-3 hover:rotate-0">
            <div className="px-4 py-2.5 rounded-xl bg-white/95 dark:bg-[#090a10]/95 backdrop-blur-xl border border-slate-200 dark:border-emerald-500/40 shadow-xl shadow-black/10 dark:shadow-emerald-950/20 flex items-center gap-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-slate-800 dark:text-white font-bold">MODEL ONLINE</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                LATENCY &lt; 15ms
              </span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RESPONSIVE TABLET & MOBILE COMPOSITION (<lg)                              */}
        {/* ========================================================================= */}
        <div className="lg:hidden space-y-6">
          
          {/* TILE 1: Image Input */}
          <div className="rounded-2xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-white/10 shadow-lg overflow-hidden">
            <div className="px-4 py-2 bg-slate-100 dark:bg-[#090b12] border-b border-slate-200 dark:border-white/5 flex justify-between font-mono text-xs">
              <span className="text-violet-600 dark:text-violet-400 font-bold">01 // IMAGE INPUT</span>
              <span className="text-slate-500">1024 × 768</span>
            </div>
            <div className="relative aspect-[16/9] bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=80" 
                alt="Golden Retriever Input" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-white font-mono text-[10px]">
                RAW PIXELS
              </div>
            </div>
          </div>

          <div className="flex justify-center text-violet-500">↓</div>

          {/* TILE 2: Feature Extraction */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-white/10 shadow-lg space-y-3">
            <div className="flex justify-between items-center font-mono text-xs">
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">02 // FEATURE EXTRACTION</span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 font-bold text-[10px]">
                2048-D VECTOR
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Spatial multi-scale convolutional feature maps and keypoint extractions.
            </p>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-cyan-500 w-1/3"></div>
              <div className="h-full bg-violet-500 w-1/2"></div>
              <div className="h-full bg-purple-400 w-1/6"></div>
            </div>
          </div>

          <div className="flex justify-center text-violet-500">↓</div>

          {/* TILE 3: Deep Learning */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-white/10 shadow-lg space-y-3">
            <div className="flex justify-between items-center font-mono text-xs">
              <span className="text-purple-600 dark:text-purple-400 font-bold">03 // DEEP LEARNING</span>
              <span className="text-emerald-500 font-bold text-[10px]">INFERENCE ACTIVE</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-800 dark:text-white font-bold">RESNET-50</span>
              <span className="text-purple-500">25.6M WEIGHTS</span>
            </div>
          </div>

          <div className="flex justify-center text-violet-500">↓</div>

          {/* TILE 4: Prediction (Focal) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0f1118] border-2 border-violet-500 shadow-xl shadow-violet-950/20 space-y-4">
            <div className="flex justify-between items-center font-mono text-xs">
              <span className="text-violet-600 dark:text-violet-400 font-bold">04 // CLASSIFICATION</span>
              <span className="text-emerald-500 font-bold text-[10px]">VERIFIED</span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 dark:text-white uppercase">
                GOLDEN RETRIEVER
              </div>
              <div className="text-xs font-mono text-slate-500 mt-0.5">
                CLASS ID: #207
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold text-violet-600 dark:text-violet-400">
                <span>CONFIDENCE</span>
                <span>97.4%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-violet-600 to-purple-400 h-full rounded-full w-[97.4%]"></div>
              </div>
            </div>
          </div>

          {/* TILE 5: Status */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-[#090a10] border border-slate-200 dark:border-emerald-500/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-slate-800 dark:text-white">MODEL ONLINE</span>
            </div>
            <span className="text-emerald-500 font-bold">LATENCY &lt; 15ms</span>
          </div>

        </div>

      </div>

    </section>
  );
}
