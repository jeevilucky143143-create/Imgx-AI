import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getFullImageUrl } from '../services/api';
import { 
  UploadCloud, 
  Scan, 
  Layers, 
  Cpu, 
  Sliders, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  RefreshCw, 
  ArrowRight, 
  Zap, 
  Activity, 
  Target, 
  ShieldCheck
} from 'lucide-react';

export default function ClassifyPage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [rawFile, setRawFile] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState(0);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (selectedImage && selectedImage.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  // Handle file drop/selection
  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('File size exceeds 15MB limit.');
      return;
    }

    setError('');
    const objectUrl = URL.createObjectURL(file);
    setSelectedImage(objectUrl);
    setRawFile(file);
    setPredictionResult(null);
    setImageMeta({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type.split('/')[1]?.toUpperCase() || 'IMG',
    });

    // Auto trigger inference with real uploaded file
    runInference(file.name, null, file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const runInference = (labelHint = 'Uploaded Asset', overrideResult = null, fileOverride = null) => {
    const fileToUpload = fileOverride || rawFile;
    setIsAnalyzing(true);
    setActivePipelineStep(1);
    setError('');

    // Multi-stage neural pipeline animation progression (fast and smooth)
    const stepInterval = setInterval(() => {
      setActivePipelineStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 120);

    if (overrideResult) {
      setTimeout(() => {
        clearInterval(stepInterval);
        setActivePipelineStep(4);
        setIsAnalyzing(false);

        const samplePayload = {
          predictedClass: overrideResult.predictedClass,
          confidence: overrideResult.confidence,
          latency: overrideResult.latency,
          alternatives: overrideResult.alternatives || [],
          features: overrideResult.features || [],
          imageUrl: selectedImage,
          category: overrideResult.category || 'General',
          subcategory: overrideResult.subcategory || 'General',
          specific: overrideResult.specific || overrideResult.predictedClass,
          classification: overrideResult.classification,
          hierarchy: overrideResult.hierarchy,
          other_detections: overrideResult.other_detections || [],
          is_unknown: overrideResult.is_unknown || false,
        };

        setPredictionResult(samplePayload);
        navigate('/result', { state: { result: samplePayload } });
      }, 400);
      return;
    }

    if (fileToUpload) {
      api.classify.uploadImage(fileToUpload)
        .then((res) => {
          clearInterval(stepInterval);
          setActivePipelineStep(4);
          setIsAnalyzing(false);

          const confVal = res.confidence <= 1 ? (res.confidence * 100).toFixed(1) : Number(res.confidence).toFixed(1);
          const resultPayload = {
            id: res.id,
            predictedClass: res.prediction,
            confidence: parseFloat(confVal),
            latency: res.latency,
            alternatives: res.alternatives || [],
            features: res.features || [],
            category: res.category || 'General',
            subcategory: res.subcategory || 'General',
            specific: res.specific || res.prediction,
            classification: res.classification,
            hierarchy: res.hierarchy,
            other_detections: res.other_detections || [],
            is_unknown: res.is_unknown || false,
            imageUrl: res.image_url ? getFullImageUrl(res.image_url) : selectedImage,
          };

          setPredictionResult(resultPayload);
          // Transition to Result page
          navigate('/result', { state: { result: resultPayload } });
        })
        .catch((err) => {
          clearInterval(stepInterval);
          setIsAnalyzing(false);
          setActivePipelineStep(0);
          setError(err.message || 'Classification failed. Please try again.');
        });
    } else {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setActivePipelineStep(0);
      setError('Please select or upload an image file first.');
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setRawFile(null);
    setImageMeta(null);
    setPredictionResult(null);
    setActivePipelineStep(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* ========================================================================= */}
      {/* 1. TOP INTRO HEADER                                                       */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-white/10">
        <div className="space-y-3 max-w-3xl">
          {/* Engine Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400">
            <Scan className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase">
              VISION ENGINE / LIVE ANALYSIS
            </span>
          </div>

          {/* Large Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight uppercase leading-[0.95] text-slate-900 dark:text-white">
            <span className="block">SEE WHAT THE</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-500 to-violet-400 dark:from-violet-400 dark:via-purple-300 dark:to-indigo-300 drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              MODEL SEES.
            </span>
          </h1>

          {/* Short Description */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Upload an image and let imgx.ai analyze its visual features and predict the most likely class.
          </p>
        </div>

        {/* Model Ready Status Indicator */}
        <div className="flex items-center gap-3 bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30 px-4 py-2 rounded-2xl w-fit backdrop-blur-sm self-start md:self-end">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
              MODEL READY
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-emerald-500/70">
              ResNet-50 / PyTorch WebGPU
            </span>
          </div>
        </div>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 flex items-center justify-between gap-3 text-xs sm:text-sm text-rose-700 dark:text-rose-300 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
          <button 
            type="button"
            onClick={() => setError('')} 
            className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 hover:underline shrink-0"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN CLASSIFICATION EXPERIENCE (LEFT: UPLOAD / RIGHT: PREDICTION)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: INTERACTIVE IMAGE WORKSPACE (7 COLS) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          {/* Workspace Container */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !selectedImage && fileInputRef.current?.click()}
            className={`relative min-h-[420px] sm:min-h-[480px] rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden cursor-pointer group ${
              isDragging
                ? 'border-violet-500 bg-violet-600/10 shadow-[0_0_35px_rgba(139,92,246,0.35)] scale-[1.01]'
                : selectedImage
                ? 'border-violet-500/40 bg-slate-900/90 dark:bg-[#090b11] shadow-2xl dark:shadow-violet-950/30'
                : 'border-dashed border-violet-500/30 hover:border-violet-400 bg-white dark:bg-[#0c0e17] hover:bg-slate-50 dark:hover:bg-[#101320] shadow-xl dark:shadow-violet-950/20'
            }`}
          >
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-grid-dark opacity-40 pointer-events-none"></div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/tiff"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />

            {!selectedImage ? (
              /* EMPTY / DROP STATE */
              <div className="relative z-10 p-8 flex flex-col items-center text-center space-y-5 max-w-md">
                
                {/* Glowing Upload Icon Circle */}
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full blur-md opacity-40 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/40 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform duration-300">
                    <UploadCloud className="w-10 h-10 stroke-[1.75]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-slate-900 dark:text-white">
                    DROP IMAGE HERE
                  </h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    or <span className="text-violet-600 dark:text-violet-400 underline underline-offset-4 decoration-violet-400 font-semibold">click to browse</span> from device
                  </p>
                </div>

                {/* Subtitle technical constraints */}
                <div className="flex items-center gap-3 pt-2 text-xs font-mono text-slate-400 dark:text-slate-500">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    JPG / PNG / WEBP
                  </span>
                  <span>•</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    MAX 15 MB
                  </span>
                </div>

                {/* HUD Corner Reticles */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-violet-500/40"></div>
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-violet-500/40"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-violet-500/40"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-violet-500/40"></div>
              </div>
            ) : (
              /* ACTIVE IMAGE PREVIEW WITH COMPUTER VISION HUD */
              <div className="relative w-full h-full min-h-[420px] sm:min-h-[480px] flex items-center justify-center p-4">
                
                {/* Base Image */}
                <img
                  src={selectedImage}
                  alt="Classification Target"
                  className="max-h-[380px] sm:max-h-[440px] max-w-full w-auto object-contain rounded-2xl shadow-2xl transition-all"
                />

                {/* Computer Vision Scanning Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-violet-500/5 to-transparent"></div>

                {/* Animated Laser Scan Line */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-[0_0_15px_#8b5cf6] animate-scanline pointer-events-none"></div>

                {/* CV HUD Corner Brackets */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>

                {/* CV Feature Points Overlay */}
                <div className="absolute top-1/4 left-1/3 flex items-center gap-1.5 pointer-events-none animate-pulse">
                  <Target className="w-4 h-4 text-violet-400 drop-shadow-[0_0_5px_rgba(139,92,246,0.8)]" />
                  <span className="text-[10px] font-mono text-violet-300 bg-slate-900/80 px-1.5 py-0.5 rounded border border-violet-500/40">
                    F_MAP: [224, 224]
                  </span>
                </div>

                <div className="absolute bottom-1/3 right-1/4 flex items-center gap-1.5 pointer-events-none animate-pulse">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                  <span className="text-[10px] font-mono text-cyan-300 bg-slate-900/80 px-1.5 py-0.5 rounded border border-cyan-500/40">
                    LATENT_NODE #094
                  </span>
                </div>

                {/* Top Overlay Badge: Image Meta */}
                {imageMeta && (
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-mono text-slate-300 backdrop-blur-md shadow-lg">
                    <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
                    <span className="font-semibold truncate max-w-[140px] sm:max-w-[200px]">{imageMeta.name}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-violet-400 font-bold">{imageMeta.type}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">{imageMeta.size}</span>
                  </div>
                )}

                {/* Analyzing Overlay Status */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-violet-600/30 border border-violet-400 flex items-center justify-center animate-spin">
                        <Scan className="w-8 h-8 text-violet-400" />
                      </div>
                      <div className="absolute -inset-2 rounded-2xl bg-violet-500 blur-lg opacity-40 animate-pulse"></div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-base font-black tracking-wider uppercase text-white font-mono flex items-center gap-2 justify-center">
                        <Activity className="w-4 h-4 text-violet-400 animate-pulse" />
                        <span>ANALYZING IMAGE...</span>
                      </div>
                      <p className="text-xs font-mono text-violet-300/80">
                        Extracting high-dimensional feature maps (ResNet-50)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick technical specs subtitle */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 px-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Inference runs with real-time neural activations</span>
            </span>
            <span>224×224 Normalization</span>
          </div>

        </div>

        {/* RIGHT COLUMN: PREDICTION TELEMETRY PANEL (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col">
          
          <div className="h-full rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0d0f17] border border-slate-200/80 dark:border-white/10 shadow-xl dark:shadow-violet-950/20 flex flex-col justify-between space-y-6 relative overflow-hidden">
            
            {/* Top Glowing Ambient Mesh */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header Telemetry Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]"></div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-800 dark:text-violet-300">
                  INFERENCE TELEMETRY
                </span>
              </div>
              <div className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                {predictionResult ? predictionResult.latency : '-- ms'}
              </div>
            </div>

            {/* Prediction Body */}
            {predictionResult ? (
              <div className="space-y-6 flex-1 flex flex-col justify-center">
                
                {/* 1. PREDICTED CLASS */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    PREDICTED CLASS
                  </span>
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {predictionResult.predictedClass}
                    </h2>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                      TOP-1
                    </span>
                  </div>
                </div>

                {/* 2. CONFIDENCE METRIC & PROGRESS BAR */}
                <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-[#08090f] border border-slate-200/80 dark:border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                      CONFIDENCE
                    </span>
                    <span className="text-2xl font-black text-violet-600 dark:text-violet-400 font-mono">
                      {predictionResult.confidence}%
                    </span>
                  </div>

                  {/* Visual Confidence Bar */}
                  <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden p-[2px]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-emerald-400 shadow-[0_0_12px_rgba(139,92,246,0.6)] transition-all duration-1000 ease-out"
                      style={{ width: `${predictionResult.confidence}%` }}
                    ></div>
                  </div>
                </div>

                {/* 3. ALTERNATIVES LIST */}
                <div className="space-y-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    TOP ALTERNATIVE PREDICTIONS
                  </span>
                  
                  <div className="space-y-2">
                    {predictionResult.alternatives.map((alt, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#08090f] border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs font-mono"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="text-slate-400">#{idx + 2}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                            {alt.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden hidden sm:block">
                            <div
                              className="h-full bg-violet-400 rounded-full"
                              style={{ width: `${Math.min(alt.confidence * 8, 100)}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-violet-600 dark:text-violet-400 min-w-[38px] text-right">
                            {alt.confidence}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. EXTRACTED FEATURES TAGS */}
                {predictionResult.features && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      KEY ACTIVATION SIGNALS
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {predictionResult.features.map((f, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-violet-500/5 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-500/15"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              /* AWAITING IMAGE STANDBY STATE */
              <div className="space-y-6 flex-1 flex flex-col items-center justify-center text-center p-6 my-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400">
                  <Cpu className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-2 max-w-xs">
                  <h4 className="text-base font-bold font-mono text-slate-800 dark:text-white uppercase tracking-wider">
                    AWAITING INPUT TENSOR
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Upload an image to execute the deep neural forward pass.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  READY FOR INFERENCE
                </div>
              </div>
            )}

            {/* Bottom Panel Footer Specs */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-violet-500" />
                <span>Softmax Activation</span>
              </span>
              <span>2048-D Latent Space</span>
            </div>

          </div>

        </div>

      </div>


      {/* ========================================================================= */}
      {/* 4. ANALYSIS PIPELINE (HORIZONTAL PROCESS FLOW)                             */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#0c0e16] border border-slate-200/80 dark:border-white/10 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-500" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-800 dark:text-white">
              ANALYSIS PIPELINE FLOW
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            5-STAGE CONVOLUTIONAL SEQUENCE
          </span>
        </div>

        {/* Pipeline Nodes Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          
          {/* Step 1: IMAGE */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center md:flex-col text-left md:text-center gap-3.5 ${
            activePipelineStep >= 0
              ? 'bg-white dark:bg-[#121522] border-violet-500/40 shadow-sm'
              : 'bg-transparent border-slate-200 dark:border-white/5 opacity-60'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 font-bold block">01 / INPUT</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">RAW IMAGE</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 hidden md:block">RGB Matrix 3-Channel</p>
            </div>
          </div>

          {/* Step 2: PREPROCESSING */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center md:flex-col text-left md:text-center gap-3.5 ${
            activePipelineStep >= 1
              ? 'bg-white dark:bg-[#121522] border-violet-500/40 shadow-sm'
              : 'bg-transparent border-slate-200 dark:border-white/5 opacity-60'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 font-bold block">02 / RESIZE</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">PREPROCESSING</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 hidden md:block">224x224 Bilinear Crop</p>
            </div>
          </div>

          {/* Step 3: FEATURE EXTRACTION */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center md:flex-col text-left md:text-center gap-3.5 ${
            activePipelineStep >= 2
              ? 'bg-white dark:bg-[#121522] border-violet-500/40 shadow-sm'
              : 'bg-transparent border-slate-200 dark:border-white/5 opacity-60'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 font-bold block">03 / CONVNET</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">FEATURE EXTRACTION</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 hidden md:block">Residual Bottlenecks</p>
            </div>
          </div>

          {/* Step 4: DEEP LEARNING */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center md:flex-col text-left md:text-center gap-3.5 ${
            activePipelineStep >= 3
              ? 'bg-white dark:bg-[#121522] border-violet-500/40 shadow-sm'
              : 'bg-transparent border-slate-200 dark:border-white/5 opacity-60'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 font-bold block">04 / LATENT</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">DEEP LEARNING</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 hidden md:block">2048-D Dense Pooling</p>
            </div>
          </div>

          {/* Step 5: PREDICTION */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center md:flex-col text-left md:text-center gap-3.5 ${
            activePipelineStep >= 4
              ? 'bg-white dark:bg-[#121522] border-emerald-500/40 shadow-sm'
              : 'bg-transparent border-slate-200 dark:border-white/5 opacity-60'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-500 font-bold block">05 / SOFTMAX</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight">PREDICTION</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 hidden md:block">Probability Distribution</p>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM ACTION AREA                                                     */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
        
        {/* Secondary Action Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {selectedImage && (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>CHANGE IMAGE</span>
              </button>

              <button
                type="button"
                onClick={handleClearImage}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>REMOVE IMAGE</span>
              </button>
            </>
          )}
        </div>

        {/* Primary Classification Trigger Button */}
        <button
          type="button"
          disabled={!selectedImage || isAnalyzing}
          onClick={() => runInference(imageMeta?.name || 'Image Target')}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-200 ${
            !selectedImage
              ? 'bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-slate-600 border border-transparent cursor-not-allowed'
              : isAnalyzing
              ? 'bg-violet-700 text-white cursor-wait opacity-90 shadow-lg shadow-violet-700/30'
              : 'bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 hover:from-violet-500 hover:to-purple-500 text-white shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>RUNNING INFERENCE...</span>
            </>
          ) : (
            <>
              <span>CLASSIFY IMAGE</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </div>

    </div>
  );
}
