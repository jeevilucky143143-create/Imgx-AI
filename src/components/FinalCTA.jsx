import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Scan, ShieldCheck, Zap } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 to-[#0d0f17] border border-violet-500/30 p-8 sm:p-16 text-center text-white shadow-2xl shadow-violet-950/40">
        
        {/* Background Ambient Glow & Grid */}
        <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Decorative HUD brackets */}
        <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-violet-400 opacity-60"></div>
        <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-violet-400 opacity-60"></div>
        <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-violet-400 opacity-60"></div>
        <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-violet-400 opacity-60"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 text-xs font-mono font-semibold tracking-wider uppercase">
            <Scan className="w-3.5 h-3.5" />
            Neural Inference Engine
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-tight">
            READY TO SEE WHAT <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">AI SEES?</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto font-normal leading-relaxed">
            Turn pixels into intelligent predictions. Upload an image and let imgx.ai discover what the model sees.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/classify"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-600/40 hover:shadow-violet-600/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>TRY IMAGE CLASSIFICATION</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <a
              href="#pipeline"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
            >
              <span>EXPLORE THE SYSTEM</span>
            </a>
          </div>

          {/* Quick stats strip */}
          <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10 text-xs font-mono text-slate-400 max-w-md mx-auto">
            <div>
              <div className="text-white font-bold text-sm">1,000+</div>
              <div>CLASSES</div>
            </div>
            <div>
              <div className="text-white font-bold text-sm">&lt; 20ms</div>
              <div>LATENCY</div>
            </div>
            <div>
              <div className="text-white font-bold text-sm">97.4%</div>
              <div>CONFIDENCE</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
