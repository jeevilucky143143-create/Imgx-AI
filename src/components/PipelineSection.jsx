import React, { useState } from 'react';
import { 
  Upload, 
  Sliders, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Zap,
  Code
} from 'lucide-react';

export default function PipelineSection() {
  const [activeStep, setActiveStep] = useState(0);

  const pipelineStages = [
    {
      id: '01',
      title: 'UPLOAD IMAGE',
      subtitle: 'Image Acquisition',
      icon: Upload,
      description: 'Accepts raw raster images in standard formats (JPEG, PNG, WebP). Verifies file integrity, color channels, and dimensionality.',
      tensorSpec: 'Tensor Shape: [H, W, 3] RGB',
      techDetail: 'Color space conversion to sRGB, dynamic range clamping [0, 255].',
      metrics: 'Format: sRGB / Channels: 3',
    },
    {
      id: '02',
      title: 'PREPROCESS',
      subtitle: 'Tensor Standardization',
      icon: Sliders,
      description: 'Bilinear spatial rescaling to 224×224px. Normalizes pixel intensities with ImageNet mean (μ=[0.485, 0.456, 0.406]) and std (σ=[0.229, 0.224, 0.225]).',
      tensorSpec: 'Tensor Shape: [1, 3, 224, 224] Float32',
      techDetail: 'Standardized zero-centered tensor distribution for neural numerical stability.',
      metrics: 'Range: [-2.1, 2.6] / Batch: 1',
    },
    {
      id: '03',
      title: 'FEATURE EXTRACTION',
      subtitle: 'Hierarchical Representations',
      icon: Layers,
      description: 'Sequential convolutional filters capture geometric edges in early layers, textural compositions in mid layers, and semantic shapes in deep blocks.',
      tensorSpec: 'Feature Tensor: [1, 2048, 7, 7]',
      techDetail: 'Multi-scale receptive fields with bottleneck residual skip-connections.',
      metrics: 'Filters: 2048 / Depth: 50 layers',
    },
    {
      id: '04',
      title: 'MODEL',
      subtitle: 'Deep Neural Backbone',
      icon: Cpu,
      description: 'Global Average Pooling (GAP) condenses the spatial 7×7 feature map into a dense 2048-dimensional semantic embedding vector.',
      tensorSpec: 'Latent Vector: [1, 2048]',
      techDetail: 'Dropout regularization (p=0.2) applied prior to linear projection.',
      metrics: 'Params: 25.6M / Latency: 12ms',
    },
    {
      id: '05',
      title: 'CLASSIFICATION',
      subtitle: 'Softmax Probability',
      icon: CheckCircle2,
      description: 'Fully connected linear transformation mapped to class logits, passed through Softmax function to yield normalized confidence probabilities (0% - 100%).',
      tensorSpec: 'Class Scores: [1, 1000] Σ=1.00',
      techDetail: 'Top-1 and Top-5 class labels ranked with confidence interval validation.',
      metrics: 'Accuracy: 97.4% / Top-K: 5',
    },
  ];

  return (
    <section id="pipeline" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 text-xs font-mono font-semibold tracking-wider uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          Neural Inference Flow
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
          FROM PIXELS TO PREDICTION
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
          How imgx.ai decodes visual signals across deep convolutional neural hierarchies in real time.
        </p>
      </div>

      {/* Interactive Pipeline Step Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
        {pipelineStages.map((stage, idx) => {
          const Icon = stage.icon;
          const isSelected = activeStep === idx;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStep(idx)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-500 shadow-md shadow-violet-500/10 ring-1 ring-violet-500'
                  : 'bg-white dark:bg-[#0f1118] border-slate-200 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-mono font-bold ${isSelected ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`}>
                  STAGE {stage.id}
                </span>
                <Icon className={`w-4 h-4 ${isSelected ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`} />
              </div>
              <span className={`text-xs sm:text-sm font-bold font-mono tracking-tight leading-tight ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                {stage.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Focused Stage Detail Display */}
      {(() => {
        const stage = pipelineStages[activeStep];
        const Icon = stage.icon;
        return (
          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0d0f17] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-violet-950/20 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Stage Explanation */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/30">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
                      STAGE {stage.id} // {stage.subtitle}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      {stage.title}
                    </h3>
                  </div>
                </div>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                  {stage.description}
                </p>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#07080c] border border-slate-200 dark:border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-violet-600 dark:text-violet-400 font-semibold">
                    <Zap className="w-4 h-4" />
                    <span>TECHNICAL OPERATION</span>
                  </div>
                  <p className="text-xs font-mono text-slate-700 dark:text-slate-400">
                    {stage.techDetail}
                  </p>
                </div>
              </div>

              {/* Right Column: High-tech Telemetry Card */}
              <div className="lg:col-span-5">
                <div className="p-6 rounded-2xl bg-slate-900 text-slate-200 border border-violet-500/30 shadow-2xl relative overflow-hidden font-mono text-xs space-y-4">
                  
                  {/* Background grid accent */}
                  <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none"></div>

                  <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
                    <span className="text-violet-400 font-bold flex items-center gap-1.5">
                      <Code className="w-4 h-4" />
                      TENSOR_TELEMETRY
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                      VERIFIED
                    </span>
                  </div>

                  <div className="space-y-2 relative z-10">
                    <div className="text-slate-400 text-[11px]">TENSOR SIGNATURE:</div>
                    <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-emerald-400 text-xs break-all">
                      {stage.tensorSpec}
                    </div>
                  </div>

                  <div className="space-y-2 relative z-10">
                    <div className="text-slate-400 text-[11px]">RUNTIME METRICS:</div>
                    <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-violet-300 text-xs">
                      {stage.metrics}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 relative z-10">
                    <span>DEVICE: CUDA:0 / WEBGPU</span>
                    <span>LATENCY: ~1.8ms</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        );
      })()}

    </section>
  );
}
