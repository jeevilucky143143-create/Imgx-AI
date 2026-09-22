import React from 'react';
import { ArrowRight, Image as ImageIcon, Sparkles, Cpu, Target } from 'lucide-react';

export default function ProcessStrip() {
  const steps = [
    { label: 'IMAGE', sub: 'RGB 3-Channel Input', icon: ImageIcon },
    { label: 'FEATURES', sub: 'Convolutions & Edges', icon: Sparkles },
    { label: 'DEEP LEARNING', sub: 'Residual Network Layers', icon: Cpu },
    { label: 'PREDICTION', sub: 'Softmax Class Scores', icon: Target },
  ];

  return (
    <div className="w-full py-8 border-y border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-[#0b0d14]/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between overflow-x-auto pb-2 sm:pb-0 scrollbar-none gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.label}>
                <div className="flex items-center gap-3 shrink-0 group">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#151824] border border-slate-200 dark:border-white/10 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-sm group-hover:border-violet-500/50 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-mono font-bold tracking-wider text-slate-800 dark:text-white group-hover:text-violet-500 transition-colors">
                      {step.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {step.sub}
                    </span>
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <div className="shrink-0 flex items-center text-slate-400 dark:text-slate-600">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
