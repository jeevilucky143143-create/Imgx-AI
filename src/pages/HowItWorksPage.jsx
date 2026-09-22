import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Cpu, 
  Layers, 
  Sliders, 
  Image as ImageIcon, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Activity, 
  Eye, 
  Network, 
  Maximize2, 
  Grid, 
  Binary, 
  Filter, 
  BarChart3, 
  HelpCircle,
  ChevronRight,
  Code2,
  Boxes
} from 'lucide-react';

const PIPELINE_STAGES = [
  {
    id: '01',
    name: 'IMAGE INPUT',
    shortDesc: 'Raw pixels enter the system.',
    icon: ImageIcon,
    badge: 'STAGE 01',
    heading: 'Raw 3-Channel RGB Matrix',
    deepExplanation: 'Digital images arrive as a grid of discrete pixels where each pixel contains Red, Green, and Blue intensity values (0–255). A standard photo is represented as an H × W × 3 tensor before computational transformation.',
    details: [
      { label: 'Color Format', value: 'RGB 3-Channel Tensor' },
      { label: 'Pixel Bit-Depth', value: '8-bit per channel (0-255)' },
      { label: 'Initial Dimension', value: 'Variable Width × Height' },
      { label: 'Tensor Shape', value: '[Batch, 3, H, W]' },
    ],
    visualizationType: 'rgb_matrix',
  },
  {
    id: '02',
    name: 'PREPROCESSING',
    shortDesc: 'Resize, normalize and prepare the image.',
    icon: Sliders,
    badge: 'STAGE 02',
    heading: 'Spatial Resizing & Z-Score Normalization',
    deepExplanation: 'To feed uniformly into convolutional neural layers, images are bilinearly interpolated to 224×224 pixels and normalized with ImageNet mean (μ) and standard deviation (σ): x_norm = (x/255 - μ) / σ.',
    details: [
      { label: 'Target Canvas', value: '224 × 224 Pixels' },
      { label: 'Interpolation', value: 'Bilinear Anti-Aliased' },
      { label: 'Mean Subtraction', value: 'μ = [0.485, 0.456, 0.406]' },
      { label: 'Std Scaling', value: 'σ = [0.229, 0.224, 0.225]' },
    ],
    visualizationType: 'normalization',
  },
  {
    id: '03',
    name: 'FEATURE EXTRACTION',
    shortDesc: 'The network identifies edges, textures and visual patterns.',
    icon: Filter,
    badge: 'STAGE 03',
    heading: 'Hierarchical Filter Convolutions',
    deepExplanation: 'Sliding 3×3 convolution kernels scan the image with localized receptive fields. Early layers detect micro-edges and color gradients; mid layers detect textures and curves; late layers assemble distinct object parts.',
    details: [
      { label: 'Receptive Fields', value: '3×3 & 7×7 Convolutional Kernels' },
      { label: 'Feature Stride', value: 'Stride 2 + MaxPool Downsampling' },
      { label: 'Visual Hierarchy', value: 'Edges → Textures → Shapes → Parts' },
      { label: 'Non-Linearity', value: 'Rectified Linear Unit (ReLU)' },
    ],
    visualizationType: 'feature_maps',
  },
  {
    id: '04',
    name: 'DEEP LEARNING',
    shortDesc: 'Learned representations move through neural layers.',
    icon: Network,
    badge: 'STAGE 04',
    heading: 'Residual Bottleneck Blocks & Latent Space',
    deepExplanation: 'imgx.ai uses deep residual connections (skip connections) that allow gradient signals to flow across 50 deep layers without vanishing, compressing features into a high-dimensional 2048-D latent embedding.',
    details: [
      { label: 'Backbone Model', value: 'ResNet-50 (Residual Network)' },
      { label: 'Total Conv Layers', value: '48 Convolutions + 1 MaxPool + 1 AvgPool' },
      { label: 'Skip Mechanism', value: 'F(x) + x Identity Mapping' },
      { label: 'Latent Vector', value: '2048-Dimensional Dense Embedding' },
    ],
    visualizationType: 'neural_flow',
  },
  {
    id: '05',
    name: 'CLASSIFICATION',
    shortDesc: 'Feature representations are compared against learned classes.',
    icon: BarChart3,
    badge: 'STAGE 05',
    heading: 'Fully Connected Dense Layer & Softmax',
    deepExplanation: 'The 2048-D latent representation is projected through a linear classifier matrix W × x + b to generate raw logits. The Softmax exponential activation normalizes these logits into a calibrated probability distribution summing to 1.0.',
    details: [
      { label: 'Classifier Type', value: 'Linear Fully-Connected Head' },
      { label: 'Logits Mapping', value: '2048-D Input → 1000 Class Scores' },
      { label: 'Activation Formula', value: 'σ(z_i) = e^(z_i) / Σ e^(z_j)' },
      { label: 'Sum Constraint', value: 'Total Probability = 100.0%' },
    ],
    visualizationType: 'probabilities',
  },
  {
    id: '06',
    name: 'PREDICTION',
    shortDesc: 'The model returns the most probable class and confidence.',
    icon: CheckCircle2,
    badge: 'STAGE 06',
    heading: 'Argmax Top-1 & Top-5 Decision',
    deepExplanation: 'The class with the highest Softmax probability is selected as the Top-1 predicted label (e.g. "Golden Retriever — 97.4%"). The system also outputs the Top-5 nearest semantic candidates for uncertainty telemetry.',
    details: [
      { label: 'Decision Function', value: 'y_hat = argmax(P(y|x))' },
      { label: 'Output Confidence', value: 'Calculated Softmax Percentage' },
      { label: 'Alternative Ranks', value: 'Top-5 Softmax Distribution' },
      { label: 'Inference Latency', value: '~12ms on GPU Accelerators' },
    ],
    visualizationType: 'final_prediction',
  }
];

const HIERARCHY_LEVELS = [
  {
    level: 'LEVEL 01',
    title: 'RAW IMAGE',
    desc: 'Discrete RGB pixel intensities arrayed in 2D coordinates.',
    visual: 'Grid of raw color intensities [R, G, B]',
    badge: 'PIXELS',
    accent: 'border-slate-500/30 text-slate-300'
  },
  {
    level: 'LEVEL 02',
    title: 'EDGES & GRADIENTS',
    desc: 'First conv layers detect light-to-dark transitions and diagonal lines.',
    visual: 'High-frequency Sobel boundary vectors',
    badge: 'LOW-LEVEL',
    accent: 'border-violet-500/40 text-violet-400'
  },
  {
    level: 'LEVEL 03',
    title: 'TEXTURES & CURVES',
    desc: 'Combinations of edges form repeating motifs, fur patterns, and angles.',
    visual: 'Gabor filter activation grids',
    badge: 'MID-LEVEL',
    accent: 'border-purple-500/40 text-purple-400'
  },
  {
    level: 'LEVEL 04',
    title: 'SHAPES & MOTIFS',
    desc: 'Curves and corners coalesce into eyes, ears, rims, wheels, or petals.',
    visual: 'Semantic component heatmaps',
    badge: 'HIGH-LEVEL',
    accent: 'border-emerald-500/40 text-emerald-400'
  },
  {
    level: 'LEVEL 05',
    title: 'SEMANTIC OBJECTS',
    desc: 'Global spatial composition matches class prototypes in latent space.',
    visual: '2048-D Class Prototype Invariance',
    badge: 'ABSTRACT',
    accent: 'border-cyan-500/40 text-cyan-400'
  }
];

export default function HowItWorksPage() {
  const [activeStageId, setActiveStageId] = useState('03');
  const [activeHierarchyLevel, setActiveHierarchyLevel] = useState(2);

  const activeStage = PIPELINE_STAGES.find(s => s.id === activeStageId) || PIPELINE_STAGES[2];

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 sm:space-y-20">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-8 border-b border-slate-200/80 dark:border-white/10">
        
        {/* Left Typography */}
        <div className="lg:col-span-7 space-y-4">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400">
            <Eye className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase">
              INSIDE THE MODEL
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-[0.92]">
            <span className="block">FROM PIXELS</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-500 to-violet-400 dark:from-violet-400 dark:via-purple-300 dark:to-indigo-300 drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              TO PREDICTION.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
            Follow the journey of an image through preprocessing, feature extraction, deep learning, and classification.
          </p>

          {/* Quick Hero Indicator Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-500"></span>
              <span>ResNet-50 Architecture</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>2048-D Latent Mapping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              <span>Softmax Probabilities</span>
            </div>
          </div>
        </div>

        {/* Right Transformative Visual Diagram */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-3xl bg-slate-900 dark:bg-[#0c0e17] border border-violet-500/30 p-6 flex flex-col items-center justify-between shadow-2xl dark:shadow-violet-950/40 overflow-hidden group">
            
            {/* Background Laser Grid */}
            <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none"></div>
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Top Transform Flow Indicator */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-violet-400 border-b border-white/10 pb-3 z-10">
              <span className="flex items-center gap-1.5">
                <Binary className="w-3.5 h-3.5 text-violet-400" />
                <span>INPUT: RGB [224, 224, 3]</span>
              </span>
              <span className="text-emerald-400">OUTPUT: CLASS LOGITS</span>
            </div>

            {/* Central Multilayer Graphic */}
            <div className="relative w-full flex-1 flex items-center justify-center my-4 z-10">
              
              {/* Layer 1: Pixel Grid Box */}
              <div className="absolute -left-2 w-24 h-24 rounded-xl border border-violet-500/30 bg-violet-950/20 flex items-center justify-center backdrop-blur-sm -rotate-6 transition-transform group-hover:-translate-x-3">
                <div className="grid grid-cols-3 gap-1 p-2 opacity-60">
                  <span className="w-3 h-3 rounded-sm bg-rose-500/60"></span>
                  <span className="w-3 h-3 rounded-sm bg-emerald-500/60"></span>
                  <span className="w-3 h-3 rounded-sm bg-sky-500/60"></span>
                  <span className="w-3 h-3 rounded-sm bg-violet-500/60"></span>
                  <span className="w-3 h-3 rounded-sm bg-amber-500/60"></span>
                  <span className="w-3 h-3 rounded-sm bg-cyan-500/60"></span>
                </div>
              </div>

              {/* Connecting Wave SVG */}
              <div className="absolute inset-x-8 h-1 bg-gradient-to-r from-violet-500 via-purple-400 to-emerald-400 shadow-[0_0_12px_#8b5cf6] animate-pulse"></div>

              {/* Layer 2: Convolution Feature Kernel (Center) */}
              <div className="relative w-28 h-28 rounded-2xl border-2 border-violet-400 bg-slate-950/90 shadow-[0_0_25px_rgba(139,92,246,0.4)] flex flex-col items-center justify-center p-2 z-20">
                <Cpu className="w-8 h-8 text-violet-400 animate-spin" style={{ animationDuration: '10s' }} />
                <span className="text-[9px] font-mono text-violet-300 font-bold mt-1 tracking-wider">
                  CONV 3×3
                </span>
                <span className="text-[8px] font-mono text-slate-400">Residual Skip</span>
              </div>

              {/* Layer 3: Prediction Output Box */}
              <div className="absolute -right-2 w-24 h-24 rounded-xl border border-emerald-500/40 bg-emerald-950/20 flex flex-col items-center justify-center p-2 backdrop-blur-sm rotate-6 transition-transform group-hover:translate-x-3">
                <span className="text-[9px] font-mono text-emerald-400 font-bold">PREDICTION</span>
                <span className="text-xs font-black text-white font-mono mt-1">97.4%</span>
                <span className="text-[8px] font-mono text-slate-400 truncate max-w-[70px]">Retriever</span>
              </div>

            </div>

            {/* Bottom Status */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 pt-3 border-t border-white/10 z-10">
              <span>Forward Pass Sequence</span>
              <span className="text-emerald-400">12.4ms Latency</span>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2 & 3. INTERACTIVE PIPELINE JOURNEY (6 STAGES + EXPLORATION PANEL)        */}
      {/* ========================================================================= */}
      <div className="space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-1">
              <span>PIPELINE ARCHITECTURE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              INTERACTIVE PIPELINE JOURNEY
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 max-w-sm">
            Click any of the 6 stages below to explore the internal mathematical and convolutional transformations.
          </p>
        </div>

        {/* 6 Stage Buttons Flow */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {PIPELINE_STAGES.map((stage) => {
            const Icon = stage.icon;
            const isActive = activeStageId === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`group p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between space-y-3 relative overflow-hidden focus:outline-none ${
                  isActive
                    ? 'border-violet-500 bg-violet-600/10 dark:bg-violet-950/40 shadow-lg shadow-violet-500/20 scale-[1.02]'
                    : 'border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0c0e17] hover:border-violet-400 hover:bg-slate-50 dark:hover:bg-[#121524]'
                }`}
              >
                {/* Active Indicator Pip */}
                {isActive && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_#8b5cf6]"></div>
                )}

                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isActive
                      ? 'bg-violet-500 text-white'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                  }`}>
                    {stage.id}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isActive
                      ? 'bg-violet-500/20 text-violet-600 dark:text-violet-400'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-violet-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black tracking-tight uppercase text-slate-900 dark:text-white">
                    {stage.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {stage.shortDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3. INTERACTIVE STAGE EXPLORATION CARD (DEEP DIVE) */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 text-white border border-violet-500/40 shadow-2xl relative overflow-hidden space-y-8">
          
          {/* Ambient Glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Stage Detail Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-violet-400 font-bold">
                <span>{activeStage.badge}</span>
                <span>•</span>
                <span>STAGE DRILLDOWN</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-white">
                {activeStage.heading}
              </h3>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-emerald-400 w-fit">
              <Activity className="w-3.5 h-3.5" />
              <span>STAGE {activeStage.id} OF 06 ACTIVE</span>
            </div>
          </div>

          {/* Deep Explanation Text */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-4xl">
            {activeStage.deepExplanation}
          </p>

          {/* Stage Technical Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeStage.details.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1"
              >
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  {item.label}
                </span>
                <span className="text-sm font-mono font-bold text-violet-300">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. VISUAL CNN EXPLANATION ("WHAT HAPPENS INSIDE THE NETWORK?")             */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-xl dark:shadow-violet-950/20 space-y-8">
        
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-1">
            <span>CONVOLUTIONAL MECHANICS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            WHAT HAPPENS INSIDE THE NETWORK?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Step-by-step breakdown designed for college project presentations, thesis defense, and viva examinations.
          </p>
        </div>

        {/* Horizontal Flow Strip */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
          
          {/* Node 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121524] border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-mono font-bold text-violet-500">01 / INPUT</span>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">INPUT IMAGE</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">224×224×3 RGB tensor matrix</p>
            </div>
          </div>

          {/* Node 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121524] border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-mono font-bold text-violet-500">02 / FILTER</span>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">CONVOLUTION</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Kernel dot-products scan spatial tiles</p>
            </div>
          </div>

          {/* Node 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121524] border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-mono font-bold text-violet-500">03 / MAPS</span>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">FEATURE MAP</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Activations highlight visual contours</p>
            </div>
          </div>

          {/* Node 4 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121524] border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-mono font-bold text-violet-500">04 / RELU</span>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">ACTIVATION</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Zeroes negative values: max(0, x)</p>
            </div>
          </div>

          {/* Node 5 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121524] border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-mono font-bold text-violet-500">05 / LATENT</span>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">DEEP FEATURES</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">2048-D global average pooling</p>
            </div>
          </div>

          {/* Node 6 */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121524] border border-emerald-500/30 flex flex-col justify-between space-y-2">
            <span className="text-[10px] font-mono font-bold text-emerald-500">06 / SOFTMAX</span>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">PREDICTION</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Calibrated confidence probabilities</p>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5. FEATURE EXTRACTION VISUAL HIERARCHY                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Level Selector (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-xl dark:shadow-violet-950/20 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 block mb-1">
              VISUAL ABSTRACTION
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              FEATURE EXTRACTION HIERARCHY
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              As layer depth increases, receptive fields expand from micro pixels to full semantic object prototypes.
            </p>
          </div>

          {/* Vertical Hierarchy Tabs */}
          <div className="space-y-2.5">
            {HIERARCHY_LEVELS.map((item, idx) => (
              <button
                key={item.level}
                onClick={() => setActiveHierarchyLevel(idx)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  activeHierarchyLevel === idx
                    ? 'border-violet-500 bg-violet-500/10 text-white font-bold'
                    : 'border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-[#08090f] text-slate-600 dark:text-slate-400 hover:border-violet-400/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-violet-300">
                    {item.level}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${item.accent}`}>
                  {item.badge}
                </span>
              </button>
            ))}
          </div>

          <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200 dark:border-white/10">
            Depth Range: Layer 1 (Conv1) ➔ Layer 50 (Bottleneck 4)
          </div>
        </div>

        {/* Right Side: Visual Demo Box (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-slate-900 text-white border border-violet-500/30 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
          
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <span className="text-xs font-mono font-bold text-violet-400 tracking-wider">
              {HIERARCHY_LEVELS[activeHierarchyLevel].level} INSPECTION
            </span>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/5 text-slate-300 border border-white/10">
              {HIERARCHY_LEVELS[activeHierarchyLevel].badge}
            </span>
          </div>

          <div className="space-y-4">
            <h4 className="text-2xl font-black uppercase text-white tracking-tight">
              {HIERARCHY_LEVELS[activeHierarchyLevel].title}
            </h4>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {HIERARCHY_LEVELS[activeHierarchyLevel].desc}
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono text-violet-300">
              <span>Mathematical Output:</span>
              <span className="font-bold text-emerald-400">
                {HIERARCHY_LEVELS[activeHierarchyLevel].visual}
              </span>
            </div>
          </div>

          {/* Interactive Visual Bar */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Low-Level Pixels</span>
              <span>Layer Abstraction Progression</span>
              <span>High-Level Semantics</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 via-purple-400 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${((activeHierarchyLevel + 1) / 5) * 100}%` }}
              ></div>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 6. CLASSIFICATION EXPLANATION ("HOW DOES THE MODEL DECIDE?")              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400 block">
            DECISION BOUNDARIES
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            HOW DOES THE MODEL DECIDE?
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            The final layer converts learned features into class probabilities. The highest probability becomes the predicted class via Softmax exponentiation.
          </p>
          <div className="p-4 rounded-2xl bg-violet-500/5 dark:bg-violet-950/30 border border-violet-500/20 text-xs font-mono text-slate-700 dark:text-violet-300">
            <code>P(class_i | image) = exp(z_i) / Σ exp(z_j)</code>
          </div>
        </div>

        {/* Demo Distribution Visual */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 text-xs font-mono text-slate-500">
            <span>CANDIDATE CLASS</span>
            <span>SOFTMAX PROBABILITY</span>
          </div>

          <div className="space-y-3">
            {/* Dog */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-slate-900 dark:text-white">DOG (Golden Retriever)</span>
                <span className="font-bold text-emerald-500">94.0%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-600 to-emerald-400 rounded-full w-[94%]"></div>
              </div>
            </div>

            {/* Cat */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-medium text-slate-700 dark:text-slate-300">CAT (Feline Domestic)</span>
                <span className="font-medium text-violet-400">3.0%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                <div className="h-full bg-violet-400 rounded-full w-[3%]"></div>
              </div>
            </div>

            {/* Fox */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-medium text-slate-700 dark:text-slate-300">FOX (Vulpes)</span>
                <span className="font-medium text-purple-400">2.0%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full w-[2%]"></div>
              </div>
            </div>

            {/* Other */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-medium text-slate-500">OTHER CANDIDATES</span>
                <span className="font-medium text-slate-400">1.0%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full w-[1%]"></div>
              </div>
            </div>
          </div>

          <p className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-200 dark:border-white/10">
            * Illustrative softmax distribution demonstration.
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 7. TECH STACK & ENGINE ARCHITECTURE                                       */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#0c0e16] border border-slate-200/80 dark:border-white/10 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-violet-500" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-800 dark:text-white">
              CORE SYSTEM TECHNOLOGIES
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">PRODUCTION FRAMEWORK</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { name: 'PyTorch', role: 'Neural Weights & Tensors' },
            { name: 'ResNet-50', role: '50-Layer Conv Backbone' },
            { name: 'React 18', role: 'Dynamic View Model' },
            { name: 'Vite', role: 'HMR Development Engine' },
            { name: 'Tailwind CSS', role: 'High-Density Styling' },
            { name: 'WebGPU', role: 'Client-Side Hardware Accel' },
          ].map((t) => (
            <div key={t.name} className="p-3.5 rounded-2xl bg-white dark:bg-[#121522] border border-slate-200/60 dark:border-white/5 space-y-1">
              <span className="text-xs font-mono font-bold text-violet-600 dark:text-violet-400 block">{t.name}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{t.role}</span>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 8. SIMPLE VIVA-FRIENDLY EXPLANATION ("IN 10 SECONDS")                     */}
      {/* ========================================================================= */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-violet-950/60 via-[#0b0d14] to-slate-950 border border-violet-500/30 text-center space-y-6 relative overflow-hidden">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono font-bold uppercase tracking-widest">
          <Zap className="w-3.5 h-3.5" />
          <span>THE WHOLE PROCESS IN 10 SECONDS</span>
        </div>

        {/* Rapid 6-Step Visual Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono font-bold text-white max-w-4xl mx-auto">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">UPLOAD</span>
          <ChevronRight className="w-4 h-4 text-violet-400" />
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">PREPROCESS</span>
          <ChevronRight className="w-4 h-4 text-violet-400" />
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">EXTRACT FEATURES</span>
          <ChevronRight className="w-4 h-4 text-violet-400" />
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">RUN MODEL</span>
          <ChevronRight className="w-4 h-4 text-violet-400" />
          <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10">CALCULATE PROBABILITIES</span>
          <ChevronRight className="w-4 h-4 text-emerald-400" />
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">SHOW RESULT</span>
        </div>

        <p className="text-base sm:text-xl font-bold text-violet-200 tracking-tight max-w-2xl mx-auto italic">
          "Pixels become features. Features become representations. Representations become predictions."
        </p>

      </div>

      {/* ========================================================================= */}
      {/* 9. FINAL CTA                                                              */}
      {/* ========================================================================= */}
      <div className="text-center space-y-6 pt-4 pb-8">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            NOW YOU KNOW HOW IT SEES.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Ready to put the model to work?
          </p>
        </div>

        <Link
          to="/classify"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold tracking-wide uppercase text-white bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 hover:from-violet-500 hover:to-purple-500 shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <span>TRY IMAGE CLASSIFICATION</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
