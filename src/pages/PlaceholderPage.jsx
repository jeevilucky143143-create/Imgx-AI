import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles, Scan, Terminal, Cpu, Clock, HelpCircle, Info, CheckCircle2 } from 'lucide-react';

const routeDetails = {
  '/classify': {
    title: 'Image Classifier Interface',
    subtitle: 'Upload and test images with neural inference',
    icon: Scan,
    badge: 'MODULE 01',
    description: 'The interactive inference workspace is currently being prepared. In the next phase, you will be able to upload real images, drag-and-drop files, inspect classification heatmaps, and test confidence scores.',
    specs: [
      { label: 'Supported Formats', value: 'PNG, JPEG, WEBP, TIFF' },
      { label: 'Max File Size', value: '15 MB' },
      { label: 'Resolution Scaling', value: 'Auto 224x224 Bilinear' },
      { label: 'Inference Device', value: 'Local PyTorch / WebGPU' },
    ]
  },
  '/result': {
    title: 'Inference Results & Visualizations',
    subtitle: 'Detailed prediction metrics and attention maps',
    icon: Sparkles,
    badge: 'TELEMETRY',
    description: 'The prediction result inspector will render multi-class softmax probability distributions, Grad-CAM activation heatmaps, and bounding box visual overlays.',
    specs: [
      { label: 'Metrics', value: 'Top-1 & Top-5 Confidence' },
      { label: 'Interpretability', value: 'Grad-CAM Saliency Maps' },
      { label: 'Inference Latency', value: '11.8ms on GPU' },
      { label: 'Export Format', value: 'JSON & Annotated Image' },
    ]
  },
  '/history': {
    title: 'Classification History',
    subtitle: 'Browse and compare prior inference logs',
    icon: Clock,
    badge: 'MODULE 03',
    description: 'Historical session gallery with saved predictions, class frequencies, timestamp telemetry, and comparative confidence benchmarks.',
    specs: [
      { label: 'Storage', value: 'Local IndexedDB / SQLite' },
      { label: 'Retention', value: 'Last 100 Classifications' },
      { label: 'Filter By', value: 'Class Label, Confidence, Date' },
      { label: 'Export', value: 'CSV / Telemetry Archive' },
    ]
  },
  '/how-it-works': {
    title: 'Architecture & Theory',
    subtitle: 'Follow the journey from pixels to prediction',
    icon: HelpCircle,
    badge: 'MODULE 02',
    description: 'An interactive deep dive explaining how convolutional neural networks, residual bottleneck blocks, activation maps, and softmax probabilities function under the hood.',
    specs: [
      { label: 'Backbone', value: 'ResNet-50 / ViT-Base' },
      { label: 'Layers', value: '50 Deep Conv Blocks' },
      { label: 'Feature Space', value: '2048-Dimensional Latent' },
      { label: 'Training Set', value: 'ImageNet-1K (1.2M Images)' },
    ]
  },
  '/about': {
    title: 'About imgx.ai',
    subtitle: 'Model, technology, and project specifications',
    icon: Info,
    badge: 'MODULE 04',
    description: 'imgx.ai is a modern computer-vision research and classification framework created to make deep learning explainable, fast, and accessible.',
    specs: [
      { label: 'Framework', value: 'React + Vite + Tailwind + PyTorch' },
      { label: 'Version', value: 'imgx.ai v1.0.0' },
      { label: 'Author', value: 'imgx.ai Deep Learning Team' },
      { label: 'License', value: 'Open Source MIT' },
    ]
  },
};

export default function PlaceholderPage() {
  const location = useLocation();
  const detail = routeDetails[location.pathname] || {
    title: 'Route In Staging',
    subtitle: 'Deep learning workspace ready',
    icon: Cpu,
    badge: 'STAGE',
    description: 'This route is configured and ready for component mounting.',
    specs: []
  };

  const Icon = detail.icon;

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Back button - links to authenticated /home */}
      <div className="mb-8">
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-sm font-mono text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO HOME</span>
        </Link>
      </div>

      {/* Main card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-violet-950/20 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-md shadow-violet-500/10">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                  {detail.badge}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ROUTE: {location.pathname}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {detail.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ROUTE CONNECTED
          </div>
        </div>

        {/* Description */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {detail.description}
        </p>

        {/* Specs Table */}
        {detail.specs.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
              Planned Interface Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {detail.specs.map((spec, i) => (
                <div 
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090a10] border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-slate-500 dark:text-slate-400">{spec.label}:</span>
                  <span className="font-semibold text-slate-800 dark:text-violet-300">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Quick Links */}
        <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-600/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO HOME</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">JUMP TO:</span>
            {['/classify', '/result', '/history', '/how-it-works', '/about'].map((path) => (
              <Link
                key={path}
                to={path}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  location.pathname === path
                    ? 'bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 border-violet-400'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-transparent hover:border-slate-300 dark:hover:border-white/10'
                }`}
              >
                {path}
              </Link>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
