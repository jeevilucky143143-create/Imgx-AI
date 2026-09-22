import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Scan, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Eye, 
  Network, 
  Zap, 
  Activity, 
  Binary, 
  ShieldCheck, 
  Boxes, 
  Code2, 
  CheckCircle2, 
  Sliders, 
  Target, 
  Globe, 
  Terminal,
  Compass,
  FileCode2
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20 sm:space-y-28">
      
      {/* ========================================================================= */}
      {/* 1. HERO — PROJECT IDENTITY                                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4 pb-12 border-b border-slate-200/80 dark:border-white/10">
        
        {/* Left Typography */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400">
            <Compass className="w-3.5 h-3.5" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase">
              ABOUT IMGX.AI
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-[0.92]">
            <span className="block">WE BUILT A MACHINE</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-500 to-violet-400 dark:from-violet-400 dark:via-purple-300 dark:to-indigo-300 drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              THAT LEARNS TO SEE.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
            imgx.ai is an image classification system that uses deep learning to transform visual information into meaningful predictions.
          </p>

          {/* Key Identity Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-mono text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
              <span>Computer Vision Research</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Explainable Inference</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              <span>Modern Web AI Architecture</span>
            </div>
          </div>

        </div>

        {/* Right Transformative Technical Visual */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-3xl bg-slate-900 dark:bg-[#0c0e17] border border-violet-500/30 p-6 flex flex-col items-center justify-between shadow-2xl dark:shadow-violet-950/40 overflow-hidden group">
            
            {/* Background Grid Mesh */}
            <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none"></div>
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header HUD */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-violet-400 border-b border-white/10 pb-3 z-10">
              <span className="flex items-center gap-1.5">
                <Scan className="w-3.5 h-3.5" />
                <span>SYSTEM / IDENTIFIER</span>
              </span>
              <span className="text-emerald-400">STATUS: ACTIVE</span>
            </div>

            {/* Center Neural Constellation Node Visual */}
            <div className="relative w-full flex-1 flex items-center justify-center my-6 z-10">
              
              {/* Center imgx.ai Core Orb */}
              <div className="relative w-28 h-28 rounded-2xl bg-gradient-to-tr from-violet-700 via-purple-600 to-violet-500 p-[1px] shadow-[0_0_35px_rgba(139,92,246,0.5)] z-20">
                <div className="w-full h-full bg-slate-950 rounded-[15px] flex flex-col items-center justify-center p-3 text-center">
                  <Scan className="w-8 h-8 text-violet-400 animate-pulse mb-1" />
                  <span className="text-xs font-black font-mono tracking-tight text-white">imgx<span className="text-violet-400">.ai</span></span>
                  <span className="text-[8px] font-mono text-violet-300/70 uppercase">Inference</span>
                </div>
              </div>

              {/* Satellite Node: Pixels */}
              <div className="absolute top-2 left-6 p-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-mono text-slate-300 backdrop-blur-sm -rotate-6">
                [PIXELS 224²]
              </div>

              {/* Satellite Node: ResNet-50 */}
              <div className="absolute bottom-2 left-4 p-2 rounded-xl bg-white/5 border border-violet-500/30 text-[9px] font-mono text-violet-300 backdrop-blur-sm rotate-3">
                [RESNET-50]
              </div>

              {/* Satellite Node: Latent Vector */}
              <div className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 border border-cyan-500/30 text-[9px] font-mono text-cyan-300 backdrop-blur-sm rotate-6">
                [2048-D LATENT]
              </div>

              {/* Satellite Node: Prediction Softmax */}
              <div className="absolute bottom-3 right-4 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-300 backdrop-blur-sm -rotate-3">
                [P = 97.4%]
              </div>

              {/* Connecting Vector Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 300 300">
                <line x1="60" y1="50" x2="150" y2="150" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="60" y1="250" x2="150" y2="150" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="240" y1="50" x2="150" y2="150" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="240" y1="250" x2="150" y2="150" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>

            </div>

            {/* Footer HUD */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 pt-3 border-t border-white/10 z-10">
              <span>Deep Vision Architecture</span>
              <span className="text-violet-400">Core Neural Engine</span>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. "WHY IMGX.AI?" — ASYMMETRIC EDITORIAL STATEMENT                        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Big Typography (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 block">
            MISSION & PHILOSOPHY
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase leading-[1.0] tracking-tight">
            <span>Images contain information. </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-500 to-violet-400 dark:from-violet-400 dark:via-purple-300 dark:to-indigo-300">
              Deep learning learns how to interpret it.
            </span>
          </h2>
        </div>

        {/* Right Narrative Card (5 Cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            imgx.ai explores how convolutional neural networks can learn visual patterns and use those learned representations to classify previously unseen images.
          </p>
          <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Pattern Recognition</span>
            <span className="text-violet-500">Spatial Invariance</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. PROJECT DNA (4 ASYMMETRIC CORE PRINCIPLES)                             */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 block mb-1">
            CORE FOUNDATIONS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            PROJECT DNA
          </h2>
        </div>

        {/* 4 Distinct Asymmetric Visual Modules */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Element 01: VISUAL (7 Cols Wide Card) */}
          <div className="md:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-lg flex flex-col justify-between space-y-4 group hover:border-violet-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-4xl font-black font-mono text-violet-600 dark:text-violet-400">01</span>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20 font-bold">
                PERCEPTION
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white">
                VISUAL EXTRACTION
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Understand images through learned features — capturing multi-scale edges, textures, contours, and complex visual geometries.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-400">
              <Eye className="w-4 h-4 text-violet-500" />
              <span>Hierarchical Receptive Fields</span>
            </div>
          </div>

          {/* Element 02: LEARNING (5 Cols Compact Card) */}
          <div className="md:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-lg flex flex-col justify-between space-y-4 group hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-4xl font-black font-mono text-purple-600 dark:text-purple-400">02</span>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 font-bold">
                NETWORK
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white">
                DEEP LEARNING
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Use deep neural networks with residual bottleneck skip connections to identify high-order representations.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-400">
              <Network className="w-4 h-4 text-purple-500" />
              <span>Residual Backpropagation</span>
            </div>
          </div>

          {/* Element 03: PREDICTION (5 Cols Compact Card) */}
          <div className="md:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-lg flex flex-col justify-between space-y-4 group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400">03</span>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 font-bold">
                PROBABILITY
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white">
                PREDICTION
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Convert learned representations into calibrated class probabilities using Softmax normalization.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-400">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>Confidence Distribution</span>
            </div>
          </div>

          {/* Element 04: EXPLAINABILITY (7 Cols Wide Card) */}
          <div className="md:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-lg flex flex-col justify-between space-y-4 group hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-4xl font-black font-mono text-cyan-600 dark:text-cyan-400">04</span>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20 font-bold">
                TELEMETRY
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black uppercase text-slate-900 dark:text-white">
                EXPLAINABILITY
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Present the classification process in a way users can understand — providing alternative rank scores, inference latency, and multi-stage pipeline flow.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-400">
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
              <span>Transparent AI Inference</span>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. ARCHITECTURE SNAPSHOT (BLUEPRINT FLOW)                                 */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-xl space-y-8">
        
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 block mb-1">
            DATA TOPOLOGY
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            ARCHITECTURE SNAPSHOT
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            End-to-end data transmission pipeline from client input ingestion to evaluated class prediction.
          </p>
        </div>

        {/* Technical Blueprint Flow */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {[
            { step: '01', title: 'USER', desc: 'Asset Ingestion' },
            { step: '02', title: 'INTERFACE', desc: 'DOM Drag & Drop' },
            { step: '03', title: 'IMAGE INPUT', desc: 'RGB Pixel Array' },
            { step: '04', title: 'PREPROCESS', desc: '224x224 Normalize' },
            { step: '05', title: 'DEEP MODEL', desc: 'Residual ConvNet' },
            { step: '06', title: 'SOFTMAX', desc: 'Class Probability' },
            { step: '07', title: 'RESULT', desc: 'Visual Telemetry' },
          ].map((node, i) => (
            <div
              key={node.step}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                i === 6
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-slate-50 dark:bg-[#121524] border-slate-200 dark:border-white/10'
              }`}
            >
              <span className={`text-[10px] font-mono font-bold ${i === 6 ? 'text-emerald-500' : 'text-violet-500'}`}>
                {node.step}
              </span>
              <div>
                <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-tight">
                  {node.title}
                </h4>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block mt-0.5">
                  {node.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. WHAT MAKES IT USEFUL? (UPLOAD / ANALYZE / UNDERSTAND)                  */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 block mb-1">
            CORE WORKFLOWS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            WHAT MAKES IT USEFUL?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Statement 1: UPLOAD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
            <span className="text-3xl sm:text-4xl font-black font-mono text-violet-600 dark:text-violet-400 block">
              UPLOAD
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Instant drag-and-drop or test sample selection with zero setup required. Standard image formats are ingested and validated automatically.
            </p>
          </div>

          {/* Statement 2: ANALYZE */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
            <span className="text-3xl sm:text-4xl font-black font-mono text-purple-600 dark:text-purple-400 block">
              ANALYZE
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Real-time deep convolutional forward pass processing images across 50 residual bottleneck layers in milliseconds.
            </p>
          </div>

          {/* Statement 3: UNDERSTAND */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4">
            <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400 block">
              UNDERSTAND
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Transparent telemetry results, multi-class candidate distributions, and interactive educational architecture breakdowns.
            </p>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 8. FINAL STATEMENT & CTA                                                  */}
      {/* ========================================================================= */}
      <div className="text-center space-y-6 pt-4 pb-8">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            <span>TEACHING MACHINES </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500 dark:from-violet-400 dark:to-indigo-300">
              TO SEE.
            </span>
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            imgx.ai turns visual data into intelligent predictions — one image at a time.
          </p>
        </div>

        <Link
          to="/classify"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold tracking-wide uppercase text-white bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 hover:from-violet-500 hover:to-purple-500 shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <span>START CLASSIFYING</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
