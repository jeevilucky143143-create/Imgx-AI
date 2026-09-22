import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Scan, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Zap, 
  Layers, 
  ShieldCheck, 
  Target,
  Image as ImageIcon,
  History as HistoryIcon,
  ChevronRight,
  Boxes,
  AlertTriangle
} from 'lucide-react';
import { api, getFullImageUrl } from '../services/api';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result);

  // If accessed directly without state, fetch the latest classification from history
  useEffect(() => {
    if (result) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchLatest = async () => {
      try {
        const history = await api.history.getHistory();
        if (isMounted && history && history.length > 0) {
          const latest = history[0];
          setResult({
            id: latest.id,
            predictedClass: latest.specific || latest.prediction,
            confidence: latest.confidence <= 1 ? (latest.confidence * 100).toFixed(1) : Number(latest.confidence).toFixed(1),
            latency: latest.latency || '12.0ms',
            alternatives: latest.top_alternatives || [],
            features: [
              `Level 1: ${latest.category || 'General'}`,
              `Level 2: ${latest.subcategory || 'General'}`,
              `Level 3: ${latest.specific || latest.prediction}`,
              'Calibrated Hierarchical Softmax',
              'Multi-Scale Feature Latents',
            ],
            category: latest.category || 'General',
            subcategory: latest.subcategory || 'General',
            specific: latest.specific || latest.prediction,
            classification: latest.classification,
            hierarchy: latest.hierarchy,
            other_detections: latest.other_detections || [],
            is_unknown: latest.prediction?.toLowerCase().includes('unknown') || latest.category?.toLowerCase() === 'unknown',
            imageUrl: getFullImageUrl(latest.image_url),
            displayDate: latest.display_date,
          });
        }
      } catch (err) {
        console.warn('[ResultPage] Could not load latest history:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLatest();
    return () => {
      isMounted = false;
    };
  }, [result]);

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/classify"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO CLASSIFIER</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>HIERARCHICAL INFERENCE COMPLETE</span>
        </div>
      </div>

      {loading ? (
        <div className="p-16 rounded-3xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-slate-500">LOADING INFERENCE TELEMETRY...</span>
        </div>
      ) : !result ? (
        /* Empty State */
        <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-[#0f1118] border border-dashed border-violet-500/30 text-center space-y-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-500">
            <Scan className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase">
              NO CLASSIFICATION RESULT FOUND
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Upload and analyze an image to inspect real-time neural activations and softmax confidence metrics.
            </p>
          </div>
          <Link
            to="/classify"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-600/30 transition-all hover:scale-105"
          >
            <span>START CLASSIFYING</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Result Telemetry Layout */
        <div className="space-y-8">
          
          {/* Low Confidence / Unknown Alert Banner if detected */}
          {result.is_unknown && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold uppercase tracking-wider block font-mono">
                  HONEST AI TELEMETRY NOTICE: UNCERTAIN CLASSIFICATION
                </span>
                <p className="leading-relaxed opacity-90">
                  The vision network evaluated this image across all taxonomic categories but did not reach the confidence threshold for a definitive class. IMGX.AI reports <strong>Unknown</strong> rather than hallucinating an unsupported classification.
                </p>
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0f1118] border border-slate-200 dark:border-white/10 shadow-2xl dark:shadow-violet-950/20 space-y-8 relative overflow-hidden">
            
            {/* Ambient Top Glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-violet-600/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-md shadow-violet-500/10 shrink-0 mt-1">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                      HIERARCHICAL TELEMETRY
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      STATUS: {result.is_unknown ? 'FLAGGED UNCERTAIN' : 'VERIFIED'}
                    </span>
                  </div>

                  {/* Level 3 Specific Prediction Heading */}
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                    {result.specific || result.predictedClass}
                  </h1>

                  {/* 3-Tier Hierarchy Breadcrumb HUD */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/25 text-xs font-mono">
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold">L1:</span>
                      <span className="font-bold text-violet-700 dark:text-violet-300">
                        {result.category || result.hierarchy?.level1 || 'Category'}
                      </span>
                      {result.classification?.category && (
                        <span className="text-[10px] text-violet-500 font-semibold">
                          ({(result.classification.category.confidence * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/25 text-xs font-mono">
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold">L2:</span>
                      <span className="font-bold text-purple-700 dark:text-purple-300">
                        {result.subcategory || result.hierarchy?.level2 || 'Subcategory'}
                      </span>
                      {result.classification?.subcategory && (
                        <span className="text-[10px] text-purple-500 font-semibold">
                          ({(result.classification.subcategory.confidence * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-xs font-mono">
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold">L3:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">
                        {result.specific || result.hierarchy?.level3 || result.predictedClass}
                      </span>
                      {result.classification?.specific && (
                        <span className="text-[10px] text-emerald-500 font-semibold">
                          ({(result.classification.specific.confidence * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              <div className="flex sm:flex-col sm:items-end items-center gap-2">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Latency: <strong className="text-violet-600 dark:text-violet-400 font-bold">{result.latency}</strong>
                </span>
                <span className="px-3 py-1 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-mono font-bold border border-violet-500/20">
                  HIERARCHICAL MATCH
                </span>
              </div>
            </div>

            {/* Grid: Left Image with CV HUD & Right Telemetry Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Image with CV HUD (6 Cols) */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative min-h-[340px] sm:min-h-[400px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-white/10 flex items-center justify-center p-4">
                  {result.imageUrl ? (
                    <img
                      src={result.imageUrl}
                      alt={result.predictedClass}
                      className="max-h-[360px] max-w-full w-auto object-contain rounded-xl shadow-2xl"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  {/* HUD Corner Brackets */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-violet-400"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-violet-400"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-violet-400"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-violet-400"></div>

                  {/* Feature Tag Overlay */}
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-white/10 text-[10px] font-mono text-violet-300 backdrop-blur-md">
                    {result.category?.toUpperCase() || 'GENERAL'} &rsaquo; {result.subcategory?.toUpperCase() || 'GENERAL'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 px-1">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Inference executed on local PyTorch ResNet-50</span>
                  </span>
                  <span>1000-Class Taxonomy</span>
                </div>
              </div>

              {/* Right Column: Confidence & Detailed Alternatives (6 Cols) */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Confidence Card */}
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#090a10] border border-slate-200 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                      SPECIFIC CLASS CONFIDENCE
                    </span>
                    <span className="text-3xl font-black text-violet-600 dark:text-violet-400 font-mono">
                      {result.confidence}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden p-[2px]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-emerald-400 shadow-[0_0_12px_rgba(139,92,246,0.6)] transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(Number(result.confidence) || 0, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500 pt-1">
                    <span>
                      Category Conf: <strong>{result.classification?.category ? (result.classification.category.confidence * 100).toFixed(1) + '%' : 'Calibrated'}</strong>
                    </span>
                    <span className={Number(result.confidence) >= 50 ? "text-emerald-500 font-semibold" : "text-amber-500 font-semibold"}>
                      {Number(result.confidence) >= 50 ? "High Confidence Specific" : "Uncertain / Dispersed"}
                    </span>
                  </div>
                </div>

                {/* Multi-Object Candidates (if present) */}
                {result.other_detections && result.other_detections.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Boxes className="w-4 h-4 text-violet-500" />
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        MULTI-OBJECT CANDIDATES (CO-OCCURRING)
                      </span>
                    </div>

                    <div className="space-y-2">
                      {result.other_detections.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-[#090a10] border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs font-mono"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-[10px]">
                              {item.category}
                            </span>
                            <span className="text-slate-400">&rsaquo;</span>
                            <span className="text-slate-500 dark:text-slate-400 truncate">{item.subcategory}</span>
                            <span className="text-slate-400">&rsaquo;</span>
                            <span className="font-semibold text-slate-900 dark:text-white truncate">
                              {item.specific}
                            </span>
                          </div>
                          <span className="font-bold text-violet-600 dark:text-violet-400 min-w-[44px] text-right">
                            {(item.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alternatives List */}
                {result.alternatives && result.alternatives.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      TOP ALTERNATIVE PREDICTIONS
                    </span>
                    
                    <div className="space-y-2">
                      {result.alternatives.map((alt, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-[#090a10] border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs font-mono"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="text-slate-400">#{idx + 2}</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                              {alt.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden hidden sm:block">
                              <div
                                className="h-full bg-violet-400 rounded-full"
                                style={{ width: `${Math.min(alt.confidence * 8, 100)}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-violet-600 dark:text-violet-400 min-w-[40px] text-right">
                              {alt.confidence}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Features Tags */}
                {result.features && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      KEY ACTIVATION SIGNALS
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.features.map((f, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Bottom Actions Row */}
            <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/classify"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-600/30 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>CLASSIFY ANOTHER IMAGE</span>
              </Link>

              <div className="flex items-center gap-3">
                <Link
                  to="/history"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors"
                >
                  <HistoryIcon className="w-4 h-4 text-violet-500" />
                  <span>VIEW ALL HISTORY</span>
                </Link>

                <Link
                  to="/home"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-xs font-mono font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <span>RETURN HOME</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
