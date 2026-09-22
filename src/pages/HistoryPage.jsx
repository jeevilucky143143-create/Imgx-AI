import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, getFullImageUrl } from '../services/api';
import { 
  History as HistoryIcon,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Trash2,
  ExternalLink,
  Calendar,
  Sparkles,
  BarChart2,
  TrendingUp,
  Award,
  Layers,
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Zap,
  PieChart as PieChartIcon,
  X,
  Scan,
  RefreshCcw
} from 'lucide-react';

const INITIAL_HISTORY_RECORDS = [
  {
    id: 'rec-001',
    predictedClass: 'Golden Retriever',
    category: 'Dog',
    confidence: 97.4,
    timestamp: '2026-09-16T19:12:00',
    displayDate: '16 Sep 2026 · 07:12 PM',
    latency: '12.4ms',
    thumbnail: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
    topAlternatives: [
      { name: 'Labrador Retriever', confidence: 1.8 },
      { name: 'Irish Setter', confidence: 0.6 }
    ],
    tensorMeta: 'ResNet-50 • 2048-D • 224×224'
  },
  {
    id: 'rec-002',
    predictedClass: 'Sunflower (Helianthus)',
    category: 'Flower',
    confidence: 99.1,
    timestamp: '2026-09-16T18:45:00',
    displayDate: '16 Sep 2026 · 06:45 PM',
    latency: '10.9ms',
    thumbnail: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=400&q=80',
    topAlternatives: [
      { name: 'Black-Eyed Susan', confidence: 0.5 },
      { name: 'Daisy', confidence: 0.3 }
    ],
    tensorMeta: 'ResNet-50 • 2048-D • 224×224'
  },
  {
    id: 'rec-003',
    predictedClass: 'Sports Car / Coupé',
    category: 'Car',
    confidence: 98.2,
    timestamp: '2026-09-16T17:30:00',
    displayDate: '16 Sep 2026 · 05:30 PM',
    latency: '14.1ms',
    thumbnail: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80',
    topAlternatives: [
      { name: 'Convertible', confidence: 1.2 },
      { name: 'Sedan Vehicle', confidence: 0.4 }
    ],
    tensorMeta: 'ResNet-50 • 2048-D • 224×224'
  },
  {
    id: 'rec-004',
    predictedClass: 'Tabby Domestic Cat',
    category: 'Cat',
    confidence: 96.8,
    timestamp: '2026-09-16T15:20:00',
    displayDate: '16 Sep 2026 · 03:20 PM',
    latency: '11.8ms',
    thumbnail: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
    topAlternatives: [
      { name: 'Domestic Shorthair', confidence: 2.1 },
      { name: 'Bengal Cat', confidence: 0.8 }
    ],
    tensorMeta: 'ResNet-50 • 2048-D • 224×224'
  },
  {
    id: 'rec-005',
    predictedClass: 'Common Kingfisher',
    category: 'Bird',
    confidence: 96.5,
    timestamp: '2026-09-16T14:10:00',
    displayDate: '16 Sep 2026 · 02:10 PM',
    latency: '13.5ms',
    thumbnail: 'https://images.unsplash.com/photo-1555169062-013468b47731?auto=format&fit=crop&w=400&q=80',
    topAlternatives: [
      { name: 'European Bee-Eater', confidence: 2.3 },
      { name: 'Hummingbird', confidence: 0.8 }
    ],
    tensorMeta: 'ResNet-50 • 2048-D • 224×224'
  },
  {
    id: 'rec-006',
    predictedClass: 'Siberian Husky',
    category: 'Dog',
    confidence: 92.3,
    timestamp: '2026-09-15T16:05:00',
    displayDate: '15 Sep 2026 · 04:05 PM',
    latency: '13.1ms',
    thumbnail: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80',
    topAlternatives: [
      { name: 'Alaskan Malamute', confidence: 5.4 },
      { name: 'Samoyed', confidence: 1.2 }
    ],
    tensorMeta: 'ResNet-50 • 2048-D • 224×224'
  },
  {
    id: 'rec-007',
    predictedClass: 'Electric Sedan',
    category: 'Car',
    confidence: 94.6,
    timestamp: '2026-09-15T11:40:00',
    displayDate: '15 Sep 2026 · 11:40 AM',
    latency: '12.8ms',
    thumbnail: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=400&q=80',
    topAlternatives: [
      { name: 'Compact Hatchback', confidence: 3.2 },
      { name: 'Crossover SUV', confidence: 1.5 }
    ],
    tensorMeta: 'ResNet-50 • 2048-D • 224×224'
  },
  {
    id: 'rec-008',
    predictedClass: 'Red Rose (Rosa)',
    category: 'Flower',
    confidence: 88.4,
    timestamp: '2026-09-14T09:15:00',
    displayDate: '14 Sep 2026 · 09:15 AM',
    latency: '11.2ms',
    thumbnail: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80',
    topAlternatives: [
      { name: 'Camellia', confidence: 7.3 },
      { name: 'Peony', confidence: 3.1 }
    ],
    tensorMeta: 'ResNet-50 • 2048-D • 224×224'
  },
  {
    id: 'rec-009',
    predictedClass: 'Bald Eagle',
    category: 'Bird',
    confidence: 95.1,
    timestamp: '2026-09-13T14:50:00',
    displayDate: '13 Sep 2026 · 02:50 PM',
    latency: '15.0ms',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
    topAlternatives: [
      { name: 'Osprey', confidence: 3.2 },
      { name: 'Red-Tailed Hawk', confidence: 1.1 }
    ],
    tensorMeta: 'ResNet-50 • 2048-D • 224×224'
  },
  {
    id: 'rec-010',
    predictedClass: 'Persian Cat',
    category: 'Cat',
    confidence: 89.7,
    timestamp: '2026-09-12T18:22:00',
    displayDate: '12 Sep 2026 · 06:22 PM',
    latency: '12.0ms',
    thumbnail: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80',
    topAlternatives: [
      { name: 'British Longhair', confidence: 6.8 },
      { name: 'Ragdoll', confidence: 2.5 }
    ],
    tensorMeta: 'ResNet-50 • 2048-D • 224×224'
  }
];

export default function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [inspectedRecord, setInspectedRecord] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Fetch real user history from backend on mount
  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      try {
        setLoading(true);
        const data = await api.history.getHistory();
        if (isMounted) {
          const mapped = data.map((r) => ({
            id: `rec-${r.id}`,
            predictedClass: r.specific || r.prediction,
            category: r.category || 'General',
            subcategory: r.subcategory || 'General',
            specific: r.specific || r.prediction,
            confidence: r.confidence <= 1 ? Number((r.confidence * 100).toFixed(1)) : Number(Number(r.confidence).toFixed(1)),
            timestamp: r.created_at,
            displayDate: r.display_date || new Date(r.created_at).toLocaleString(),
            latency: r.latency || '12.0ms',
            thumbnail: getFullImageUrl(r.image_url),
            topAlternatives: r.top_alternatives || [],
            otherDetections: r.other_detections || [],
            classification: r.classification,
            hierarchy: r.hierarchy,
            tensorMeta: r.tensor_meta || 'ResNet-50 • Hierarchical Softmax • 224×224',
          }));
          setRecords(mapped);
          setFetchError('');
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[HistoryPage] Could not load backend history:', err.message);
          setFetchError(err.message || 'Unable to connect to history service.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all your classification records?')) {
      try {
        await api.history.clearHistory();
        setRecords([]);
      } catch (err) {
        alert(err.message || 'Failed to clear history');
      }
    }
  };

  const handleRestoreDemo = () => {
    setRecords(INITIAL_HISTORY_RECORDS);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `imgx_ai_classification_history_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Distinct category list
  const categories = useMemo(() => {
    const cats = new Set(records.map(r => r.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [records]);

  // Filtered and sorted records
  const filteredRecords = useMemo(() => {
    return records
      .filter(item => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchClass = item.predictedClass?.toLowerCase().includes(q);
          const matchCategory = item.category?.toLowerCase().includes(q);
          const matchSub = item.subcategory?.toLowerCase().includes(q);
          const matchSpec = item.specific?.toLowerCase().includes(q);
          if (!matchClass && !matchCategory && !matchSub && !matchSpec) return false;
        }
        // Category
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }
        // Date filter
        if (dateFilter !== 'all') {
          const itemDate = new Date(item.timestamp);
          const now = new Date();
          if (dateFilter === 'today') {
            const isToday = itemDate.toDateString() === now.toDateString();
            if (!isToday) return false;
          } else if (dateFilter === 'week') {
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (itemDate < oneWeekAgo) return false;
          } else if (dateFilter === 'month') {
            const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (itemDate < oneMonthAgo) return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.timestamp) - new Date(a.timestamp);
        } else if (sortBy === 'oldest') {
          return new Date(a.timestamp) - new Date(b.timestamp);
        } else if (sortBy === 'highest_conf') {
          return b.confidence - a.confidence;
        } else if (sortBy === 'lowest_conf') {
          return a.confidence - b.confidence;
        }
        return 0;
      });
  }, [records, searchQuery, selectedCategory, dateFilter, sortBy]);

  // Computed Analytics Metrics
  const stats = useMemo(() => {
    if (records.length === 0) {
      return {
        total: 0,
        avgConfidence: 0,
        mostDetected: 'N/A',
        mostDetectedPct: 0,
        thisWeekCount: 0,
        highConfCount: 0,
        medConfCount: 0,
        lowConfCount: 0,
        distribution: []
      };
    }

    const total = records.length;
    const avgConfidence = (records.reduce((acc, curr) => acc + curr.confidence, 0) / total).toFixed(1);

    // Most detected class
    const counts = {};
    records.forEach(r => {
      counts[r.predictedClass] = (counts[r.predictedClass] || 0) + 1;
    });
    let topClass = '';
    let topCount = 0;
    Object.entries(counts).forEach(([cls, count]) => {
      if (count > topCount) {
        topCount = count;
        topClass = cls;
      }
    });

    // This week count
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekCount = records.filter(r => new Date(r.timestamp) >= oneWeekAgo).length;

    // Confidence tiers
    const highConfCount = records.filter(r => r.confidence >= 90).length;
    const medConfCount = records.filter(r => r.confidence >= 70 && r.confidence < 90).length;
    const lowConfCount = records.filter(r => r.confidence < 70).length;

    // Category Distribution for chart
    const catCounts = {};
    records.forEach(r => {
      const cat = r.category || 'Other';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });
    const distribution = Object.entries(catCounts).map(([name, count]) => ({
      name,
      count,
      percentage: ((count / total) * 100).toFixed(1)
    })).sort((a, b) => b.count - a.count);

    return {
      total,
      avgConfidence,
      mostDetected: topClass || 'N/A',
      mostDetectedPct: ((topCount / total) * 100).toFixed(0),
      thisWeekCount,
      highConfCount,
      medConfCount,
      lowConfCount,
      distribution
    };
  }, [records]);

  // Chart Chronological Points (Reversed to show time progression left-to-right)
  const chartPoints = useMemo(() => {
    const chrono = [...records].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return chrono.map((rec, idx) => ({
      id: rec.id,
      x: idx,
      confidence: rec.confidence,
      label: rec.predictedClass,
      date: rec.displayDate,
      timeShort: rec.displayDate.split('·')[1]?.trim() || rec.displayDate,
    }));
  }, [records]);

  // Helper for Confidence Pill styling
  const getConfidenceBadge = (conf) => {
    if (conf >= 90) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          {conf}%
        </span>
      );
    }
    if (conf >= 70) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
          {conf}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        {conf}%
      </span>
    );
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* ========================================================================= */}
      {/* 1. HEADER / INTRODUCTION                                                  */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-white/10">
        <div className="space-y-3 max-w-3xl">
          {/* Section Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400">
            <HistoryIcon className="w-3.5 h-3.5" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase">
              ANALYSIS ARCHIVE
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase leading-[1.0]">
            <span>Classification </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-500 to-violet-400 dark:from-violet-400 dark:via-purple-300 dark:to-indigo-300">
              History
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Track your previous predictions, confidence scores, and classification activity.
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-2.5 bg-violet-500/10 dark:bg-violet-950/40 border border-violet-500/30 px-4 py-2 rounded-2xl w-fit backdrop-blur-sm self-start md:self-end">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
          <div className="flex flex-col">
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-violet-300 tracking-wider">
              HISTORY SYNCED
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-violet-400/70">
              {records.length} Telemetry Events
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ANALYTICS OVERVIEW (4 ASYMMETRIC METRIC CARDS)                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: TOTAL ANALYSES */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-lg dark:shadow-violet-950/10 flex flex-col justify-between space-y-4 group hover:border-violet-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              TOTAL ANALYSES
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              {stats.total}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Cumulative logs archived</span>
            </div>
          </div>
        </div>

        {/* Metric 2: AVERAGE CONFIDENCE */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-lg dark:shadow-violet-950/10 flex flex-col justify-between space-y-4 group hover:border-violet-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              AVG CONFIDENCE
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-black text-violet-600 dark:text-violet-400 font-mono tracking-tight flex items-baseline gap-1">
              <span>{stats.avgConfidence}</span>
              <span className="text-xl text-slate-400">%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-white/10 mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full"
                style={{ width: `${stats.avgConfidence}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Metric 3: MOST DETECTED */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-lg dark:shadow-violet-950/10 flex flex-col justify-between space-y-4 group hover:border-violet-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              MOST DETECTED
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate tracking-tight">
              {stats.mostDetected}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 font-bold">
                {stats.mostDetectedPct}%
              </span>
              <span>of total inferences</span>
            </div>
          </div>
        </div>

        {/* Metric 4: THIS WEEK */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-lg dark:shadow-violet-950/10 flex flex-col justify-between space-y-4 group hover:border-violet-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              THIS WEEK
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight flex items-baseline gap-2">
              <span>{stats.thisWeekCount}</span>
              <span className="text-xs font-sans text-slate-500 uppercase tracking-widest">analyses</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-cyan-500">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>Active evaluation stream</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3 & 4. VISUALIZATIONS: CONFIDENCE OVER TIME & CLASS DISTRIBUTION          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* MAIN VISUALIZATION: CONFIDENCE OVER TIME (7 COLS) */}
        <div className="lg:col-span-7 w-full max-w-full min-w-0 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-xl dark:shadow-violet-950/20 space-y-6 flex flex-col justify-between overflow-hidden box-border">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-800 dark:text-violet-300">
                CONFIDENCE OVER TIME
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              {chartPoints.length} EVALUATION{chartPoints.length === 1 ? '' : 'S'}
            </span>
          </div>

          {/* Line Chart Area */}
          {chartPoints.length > 0 ? (
            <div className="relative w-full h-[260px] sm:h-[280px] rounded-2xl bg-slate-50/60 dark:bg-black/30 border border-slate-200/60 dark:border-white/5 p-3 sm:p-4 flex flex-col justify-between overflow-hidden box-border min-w-0">
              
              {/* SVG Graphic Line & Tooltip Container */}
              <div className="relative w-full flex-1 min-h-0 overflow-hidden">
                <svg
                  className="block w-full h-full"
                  viewBox="0 0 520 180"
                  preserveAspectRatio="none"
                  style={{ overflow: 'hidden', maxWidth: '100%', maxHeight: '100%' }}
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Gridlines & Y-Axis Labels (0% to 100%) */}
                  {[
                    { val: 100, y: 18 },
                    { val: 75, y: 53 },
                    { val: 50, y: 88 },
                    { val: 25, y: 123 },
                    { val: 0, y: 158 },
                  ].map((tick) => (
                    <g key={tick.val}>
                      <line
                        x1="45"
                        y1={tick.y}
                        x2="510"
                        y2={tick.y}
                        stroke="currentColor"
                        className="text-slate-200 dark:text-white/[0.06]"
                        strokeDasharray={tick.val === 0 ? undefined : '3 3'}
                        strokeWidth="1"
                      />
                      <text
                        x="38"
                        y={tick.y + 3.5}
                        textAnchor="end"
                        className="text-[9px] font-mono fill-slate-400 dark:fill-slate-500 font-medium"
                      >
                        {tick.val}%
                      </text>
                    </g>
                  ))}

                  {/* Plot Calculations (Scaled 0% to 100%) */}
                  {(() => {
                    const padLeft = 45;
                    const padRight = 10;
                    const padTop = 18;
                    const padBottom = 22;
                    const plotW = 520 - padLeft - padRight;
                    const plotH = 180 - padTop - padBottom;

                    const pts = chartPoints.map((pt, idx) => {
                      const x = chartPoints.length === 1 
                        ? padLeft + plotW / 2 
                        : padLeft + (idx / (chartPoints.length - 1)) * plotW;
                      const clampedConf = Math.max(0, Math.min(100, Number(pt.confidence) || 0));
                      const y = padTop + (1 - clampedConf / 100) * plotH;
                      return { ...pt, px: x, py: y };
                    });

                    const dPath = pts.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.px} ${p.py}`, '');
                    const dArea = pts.length === 1
                      ? ''
                      : `${dPath} L ${pts[pts.length - 1].px} ${padTop + plotH} L ${pts[0].px} ${padTop + plotH} Z`;

                    return (
                      <>
                        {dArea && <path d={dArea} fill="url(#chartGradient)" />}
                        {pts.length > 1 && (
                          <path
                            d={dPath}
                            fill="none"
                            stroke="url(#lineStroke)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        )}
                        
                        {/* Interactive Dot Markers */}
                        {pts.map((p) => (
                          <g 
                            key={p.id}
                            className="cursor-pointer transition-transform duration-200"
                            onMouseEnter={() => setHoveredPoint(p)}
                            onMouseLeave={() => setHoveredPoint(null)}
                          >
                            <circle cx={p.px} cy={p.py} r="5" fill="#0c0e17" stroke="#8b5cf6" strokeWidth="2" />
                            <circle cx={p.px} cy={p.py} r="2.2" fill="#34d399" />
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>

                {/* Hover Tooltip Overlay (Clamped within bounds) */}
                {hoveredPoint && (() => {
                  const padLeft = 45;
                  const padRight = 10;
                  const plotW = 520 - padLeft - padRight;
                  const hoverIdx = chartPoints.findIndex(p => p.id === hoveredPoint.id);
                  const pctX = chartPoints.length > 1 && hoverIdx >= 0
                    ? ((padLeft + (hoverIdx / (chartPoints.length - 1)) * plotW) / 520) * 100
                    : 50;
                  const clampedPctX = Math.min(Math.max(pctX, 18), 82);

                  return (
                    <div 
                      className="absolute z-30 pointer-events-none -translate-x-1/2 p-2.5 rounded-xl bg-slate-900/95 dark:bg-[#121524]/95 border border-violet-500/40 text-xs font-mono text-white shadow-2xl backdrop-blur-md transition-all duration-100"
                      style={{
                        left: `${clampedPctX}%`,
                        top: '8px'
                      }}
                    >
                      <div className="font-bold text-violet-300 truncate max-w-[200px]">{hoveredPoint.label}</div>
                      <div className="text-emerald-400 font-bold">{hoveredPoint.confidence}% Confidence</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{hoveredPoint.date}</div>
                    </div>
                  );
                })()}
              </div>

              {/* X-Axis Timeline Sequence Labels */}
              <div className="flex items-center justify-between pt-2 px-1 text-[10px] font-mono text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-white/5 shrink-0">
                <span className="truncate max-w-[140px]">
                  {chartPoints[0]?.timeShort || 'Earliest'}
                </span>
                <span className="hidden sm:inline text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-600">
                  Sequence Timeline
                </span>
                <span className="truncate max-w-[140px] text-right">
                  {chartPoints[chartPoints.length - 1]?.timeShort || 'Latest'}
                </span>
              </div>

            </div>
          ) : (
            <div className="h-[250px] sm:h-[270px] rounded-2xl bg-slate-50/50 dark:bg-black/30 border border-slate-200/60 dark:border-white/5 flex flex-col items-center justify-center text-xs font-mono text-slate-500 gap-2">
              <TrendingUp className="w-6 h-6 text-slate-400/40" />
              <span>No data points available for chart</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 pt-2">
            <span>Y-Axis: Normalized Probability (0% - 100%)</span>
            <span className="text-emerald-500 font-semibold">
              Peak: {chartPoints.length > 0 ? Math.max(...chartPoints.map(p => Number(p.confidence) || 0)).toFixed(1) : '0.0'}%
            </span>
          </div>

        </div>

        {/* SECOND VISUALIZATION: CLASS DISTRIBUTION & CONFIDENCE SUMMARY (5 COLS) */}
        <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-xl dark:shadow-violet-950/20 flex flex-col justify-between space-y-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-violet-500" />
              <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-800 dark:text-violet-300">
                CLASS DISTRIBUTION
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              BY CATEGORY
            </span>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-3.5 flex-1 flex flex-col justify-center">
            {stats.distribution.map((cat, idx) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      idx === 0 ? 'bg-violet-500' :
                      idx === 1 ? 'bg-purple-400' :
                      idx === 2 ? 'bg-emerald-400' :
                      idx === 3 ? 'bg-cyan-400' : 'bg-amber-400'
                    }`}></span>
                    {cat.name}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    <strong className="text-slate-900 dark:text-white font-bold">{cat.count}</strong> ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0 ? 'bg-gradient-to-r from-violet-600 to-violet-400' :
                      idx === 1 ? 'bg-gradient-to-r from-purple-500 to-purple-300' :
                      idx === 2 ? 'bg-gradient-to-r from-emerald-500 to-emerald-300' :
                      idx === 3 ? 'bg-gradient-to-r from-cyan-500 to-cyan-300' : 'bg-amber-400'
                    }`}
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* 7. CONFIDENCE TIERS SUMMARY */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              CONFIDENCE SPECTRUM
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 block">HIGH (&gt;90%)</span>
                <span className="text-lg font-black font-mono text-slate-900 dark:text-white">{stats.highConfCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-violet-500/5 border border-violet-500/20 text-center">
                <span className="text-[10px] font-mono font-bold text-violet-600 dark:text-violet-400 block">MED (70-89%)</span>
                <span className="text-lg font-black font-mono text-slate-900 dark:text-white">{stats.medConfCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 block">LOW (&lt;70%)</span>
                <span className="text-lg font-black font-mono text-slate-900 dark:text-white">{stats.lowConfCount}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 5 & 6. RECENT CLASSIFICATIONS + SEARCH & FILTERS                          */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        
        {/* Section Title & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-violet-500" />
              <span>RECENT ANALYSES</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspect past inference records, activation saliency, and class confidences
            </p>
          </div>

          {/* 9. SUBTLE EXPORT / CLEAR ACTIONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-violet-500" />
              <span>EXPORT JSON</span>
            </button>

            {records.length > 0 ? (
              <button
                onClick={handleClearHistory}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>CLEAR HISTORY</span>
              </button>
            ) : (
              <button
                onClick={handleRestoreDemo}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-violet-600 dark:text-violet-400 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 transition-colors"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>LOAD DEMO DATA</span>
              </button>
            )}
          </div>
        </div>

        {/* 6. SEARCH & FILTER BAR */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 shadow-md flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by class or label..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#121522] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Category Filter */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-[#121522] border border-slate-200 dark:border-white/10 rounded-xl px-2 py-1">
              <Filter className="w-3.5 h-3.5 text-violet-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none py-1 pr-2 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat === 'All' ? 'All Classes' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-[#121522] border border-slate-200 dark:border-white/10 rounded-xl px-2 py-1">
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none py-1 pr-2 cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-white">All Time</option>
                <option value="today" className="bg-slate-900 text-white">Today</option>
                <option value="week" className="bg-slate-900 text-white">This Week</option>
                <option value="month" className="bg-slate-900 text-white">This Month</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-[#121522] border border-slate-200 dark:border-white/10 rounded-xl px-2 py-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-violet-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none py-1 pr-2 cursor-pointer"
              >
                <option value="newest" className="bg-slate-900 text-white">Newest First</option>
                <option value="oldest" className="bg-slate-900 text-white">Oldest First</option>
                <option value="highest_conf" className="bg-slate-900 text-white">Highest Confidence</option>
                <option value="lowest_conf" className="bg-slate-900 text-white">Lowest Confidence</option>
              </select>
            </div>

          </div>

        </div>

        {/* 5. ANALYSIS ROWS LIST / 8. EMPTY STATE */}
        {loading ? (
          <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin"></div>
            <span className="text-xs font-mono text-slate-500">SYNCING TELEMETRY LOGS...</span>
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="space-y-3">
            {filteredRecords.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#0c0e17] border border-slate-200/80 dark:border-white/10 hover:border-violet-500/50 hover:bg-slate-50 dark:hover:bg-[#101322] shadow-sm transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                
                {/* Left Side: Thumbnail + Class Details */}
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 dark:border-white/10">
                    <img
                      src={item.thumbnail}
                      alt={item.predictedClass}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>

                  {/* Class Info */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {item.specific || item.predictedClass}
                      </span>
                      {item.category && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                          {item.category}
                        </span>
                      )}
                      {item.subcategory && item.subcategory !== item.category && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                          {item.subcategory}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                      <span>{item.displayDate}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-violet-400" />
                        <span>{item.latency}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Confidence & Action */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    {getConfidenceBadge(item.confidence)}
                  </div>

                  <button
                    onClick={() => setInspectedRecord(item)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold text-violet-600 dark:text-violet-400 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 group-hover:border-violet-500/50 transition-colors"
                  >
                    <span>VIEW RESULT</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* 8. BEAUTIFUL EMPTY STATE */
          <div className="p-12 sm:p-16 rounded-3xl bg-white dark:bg-[#0c0e17] border border-dashed border-violet-500/30 text-center space-y-6 flex flex-col items-center justify-center">
            
            <div className="w-20 h-20 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-500">
              <Scan className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                No classifications yet.
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your analyzed images will appear here with complete telemetry and classification confidence scores.
              </p>
            </div>

            <Link
              to="/classify"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-600/30 transition-all hover:scale-105"
            >
              <span>START CLASSIFYING</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* RESULT INSPECTION MODAL (TELEMETRY DRILLDOWN)                             */}
      {/* ========================================================================= */}
      {inspectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0c0e17] border border-violet-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setInspectedRecord(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 flex items-center justify-center">
                <Scan className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-violet-400 font-bold tracking-widest uppercase block">
                  TELEMETRY INSPECTION
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {inspectedRecord.predictedClass}
                </h3>
              </div>
            </div>

            {/* Image Preview & Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10">
                <img
                  src={inspectedRecord.thumbnail}
                  alt={inspectedRecord.predictedClass}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-violet-300 border border-violet-500/30">
                  {inspectedRecord.category}
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#08090f] border border-slate-200 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Classification Confidence</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-mono font-black text-violet-600 dark:text-violet-400">
                      {inspectedRecord.confidence}%
                    </span>
                    <span className="text-xs font-mono text-emerald-500 font-bold">TOP-1 MATCH</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-400">Timestamp:</span>
                    <span className="text-slate-800 dark:text-slate-200">{inspectedRecord.displayDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
                    <span className="text-slate-400">Inference Latency:</span>
                    <span className="text-slate-800 dark:text-slate-200">{inspectedRecord.latency}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Backbone:</span>
                    <span className="text-violet-400">{inspectedRecord.tensorMeta}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternatives */}
            {inspectedRecord.topAlternatives && inspectedRecord.topAlternatives.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Alternative Candidates
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {inspectedRecord.topAlternatives.map((alt, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#08090f] border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-700 dark:text-slate-300 truncate">{alt.name}</span>
                      <span className="text-violet-400 font-bold">{alt.confidence}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setInspectedRecord(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                CLOSE
              </button>
              <Link
                to="/classify"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-violet-600 hover:bg-violet-500 transition-colors"
              >
                <span>RUN NEW INFERENCE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
