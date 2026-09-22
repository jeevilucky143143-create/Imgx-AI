import React, { useState, useEffect } from 'react';
import { 
  Scan, 
  Cpu, 
  Crosshair, 
  Layers, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Maximize2 
} from 'lucide-react';

export default function HeroVisual() {
  const [activeTab, setActiveTab] = useState('detection'); // 'detection' | 'features' | 'tensor'
  const [pulseCount, setPulseCount] = useState(0);

  // Periodic heartbeat to animate micro-metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount(prev => (prev + 1) % 100);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto select-none group">
      
      {/* Background ambient glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-600/30 via-purple-600/20 to-indigo-600/30 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

      {/* Main HUD Container */}
      <div className="relative bg-[#0d0f17] border border-violet-500/30 dark:border-violet-500/25 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden text-slate-200">
        
        {/* HUD Top Bar */}
        <div className="px-4 py-2.5 bg-[#090a10]/90 border-b border-white/10 flex items-center justify-between text-[11px] font-mono tracking-wider">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
            <span className="text-violet-400 font-bold">SYSTEM // VISION_CORE_V4</span>
            <span className="text-slate-500 hidden sm:inline">| RAW_INPUT: 1024×768</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-400 flex items-center gap-1">
              <Activity className="w-3 h-3 animate-pulse" />
              60 FPS
            </span>
            <span className="text-slate-400 hidden sm:inline">LATENCY: 12.4ms</span>
            <span className="px-2 py-0.5 rounded bg-violet-500/20 border border-violet-500/40 text-violet-300 font-semibold text-[10px]">
              INFERENCE ACTIVE
            </span>
          </div>
        </div>

        {/* Central Visual Stage */}
        <div className="relative aspect-[16/10] sm:aspect-[16/10] overflow-hidden bg-slate-950">
          
          {/* Base visual: High contrast architectural & tech photography with dual tone overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-85 transition-transform duration-700 group-hover:scale-[1.02]"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1507146426996-ef0538888a70?auto=format&fit=crop&w=1200&q=80')`,
            }}
          >
            {/* Color grading overlay to match deep charcoal and purple styling */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-slate-950/40 to-[#0d0f17]/60 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-violet-950/20 mix-blend-color"></div>
          </div>

          {/* Computer Vision Scanning Grid Overlay */}
          <div className="absolute inset-0 bg-grid-dark opacity-35 pointer-events-none"></div>

          {/* Crosshairs at grid points */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner guide brackets */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-violet-400/80"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-violet-400/80"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-violet-400/80"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-violet-400/80"></div>

            {/* Feature Points (Crosshairs + coordinate dots) */}
            <div className="absolute top-[28%] left-[32%] flex items-center gap-1 text-[9px] font-mono text-violet-300">
              <span className="w-2 h-2 rounded-full bg-violet-400 ring-4 ring-violet-500/20 animate-ping"></span>
              <span className="bg-black/60 px-1 py-0.5 rounded border border-violet-500/40">FP_01 (142, 89)</span>
            </div>

            <div className="absolute top-[42%] left-[65%] flex items-center gap-1 text-[9px] font-mono text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="bg-black/60 px-1 py-0.5 rounded border border-cyan-500/40">FP_02 (298, 144)</span>
            </div>

            <div className="absolute bottom-[35%] left-[24%] flex items-center gap-1 text-[9px] font-mono text-violet-300">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
              <span className="bg-black/60 px-1 py-0.5 rounded border border-violet-500/40">FP_03 (98, 240)</span>
            </div>

            <div className="absolute bottom-[28%] left-[58%] flex items-center gap-1 text-[9px] font-mono text-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-400 ring-4 ring-purple-500/20"></span>
              <span className="bg-black/60 px-1 py-0.5 rounded border border-purple-500/40">FP_04 (260, 218)</span>
            </div>
          </div>

          {/* SVG Neural Connections & Detection Bounding Boxes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="scanGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Neural connection lines */}
            <path 
              d="M 160 100 L 260 150 L 380 130 L 320 220 Z" 
              fill="rgba(139, 92, 246, 0.05)" 
              stroke="url(#lineGrad)" 
              strokeWidth="1.5" 
              strokeDasharray="4 3" 
            />
            <line x1="260" y1="150" x2="130" y2="230" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <line x1="380" y1="130" x2="330" y2="270" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          </svg>

          {/* Detection Rectangle 1: Main Subject Detection */}
          <div className="absolute top-[22%] left-[28%] w-[48%] h-[58%] border-2 border-violet-500/80 bg-violet-500/10 rounded-sm shadow-[0_0_15px_rgba(139,92,246,0.25)] transition-all duration-300">
            {/* Corner Reticle Accents */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-violet-400"></div>
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-violet-400"></div>
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-violet-400"></div>
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-violet-400"></div>

            {/* Detection Tag */}
            <div className="absolute -top-7 left-0 flex items-center gap-1.5 bg-violet-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-sm">
              <Scan className="w-3 h-3" />
              <span>[01] GOLDEN RETRIEVER • 97.4%</span>
            </div>

            {/* Internal Center Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <Crosshair className="w-8 h-8 text-violet-400 stroke-1" />
            </div>
          </div>

          {/* Detection Rectangle 2: Secondary ROI / Feature Extraction */}
          <div className="absolute top-[52%] left-[12%] w-[22%] h-[32%] border border-dashed border-cyan-400/60 bg-cyan-500/5 rounded-sm">
            <div className="absolute -top-5 left-0 bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 text-[9px] font-mono px-1.5 py-0.5 rounded">
              ROI: TEXTURE_CONV
            </div>
          </div>

          {/* Animated Laser Scanning Line */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-[0_0_15px_#8b5cf6] animate-scanline pointer-events-none z-10">
            <div className="h-14 -mt-14 bg-gradient-to-b from-transparent to-violet-500/20"></div>
          </div>

          {/* 5 FLOATING ANNOTATION LABELS (As specified in prompt) */}
          
          {/* Label 1: OBJECT DETECTED */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#090b12]/85 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold shadow-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>OBJECT DETECTED</span>
          </div>

          {/* Label 2: 97.4% CONFIDENCE */}
          <div className="absolute top-4 right-4 z-20 flex flex-col items-end px-3 py-1.5 rounded-lg bg-[#090b12]/85 backdrop-blur-md border border-violet-500/40 shadow-lg">
            <div className="flex items-center gap-1.5 text-violet-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>97.4% CONFIDENCE</span>
            </div>
            <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full w-[97.4%]"></div>
            </div>
          </div>

          {/* Label 3: FEATURE EXTRACTION */}
          <div className="absolute bottom-14 left-4 z-20 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#090b12]/85 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium shadow-lg">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>FEATURE EXTRACTION</span>
            <span className="text-[10px] text-slate-400">2048-D</span>
          </div>

          {/* Label 4: MODEL READY */}
          <div className="absolute bottom-14 right-4 z-20 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#090b12]/85 backdrop-blur-md border border-violet-500/40 text-violet-300 text-xs font-mono font-medium shadow-lg">
            <Cpu className="w-3.5 h-3.5 text-violet-400" />
            <span>MODEL READY</span>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping"></span>
          </div>

          {/* Label 5: IMAGE ANALYSIS */}
          <div className="absolute bottom-3 inset-x-0 mx-auto w-fit z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-slate-700/80 text-slate-300 text-[11px] font-mono tracking-wider shadow-md">
            <Eye className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-white font-semibold">IMAGE ANALYSIS</span>
            <span className="text-slate-500">•</span>
            <span className="text-violet-400">SOFTMAX APPLIED</span>
          </div>

        </div>

        {/* HUD Bottom Telemetry Strip */}
        <div className="px-4 py-2.5 bg-[#090a10] border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
          <div className="flex flex-col">
            <span className="text-slate-500">BACKBONE</span>
            <span className="text-slate-200 font-semibold">ResNet-50 v2</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500">ACTIVATION</span>
            <span className="text-slate-200 font-semibold">ReLU + Softmax</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500">INPUT TENSOR</span>
            <span className="text-violet-300 font-semibold">[1, 3, 224, 224]</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500">PREDICTION CLASS</span>
            <span className="text-emerald-400 font-semibold">#207 Canine</span>
          </div>
        </div>

      </div>

      {/* Decorative side accent elements */}
      <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 text-[9px] font-mono text-slate-600 dark:text-violet-500/40 rotate-90 origin-center pointer-events-none tracking-widest">
        CONV_LAYER_OUTPUT_NORM_v2
      </div>
    </div>
  );
}
