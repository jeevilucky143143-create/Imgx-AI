import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Scan, Terminal, Shield, Zap } from 'lucide-react';
import HeroVisual from '../components/HeroVisual';
import NavigationCards from '../components/NavigationCards';
import ProcessStrip from '../components/ProcessStrip';
import PipelineSection from '../components/PipelineSection';
import FinalCTA from '../components/FinalCTA';

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      
      {/* ========================================================================= */}
      {/* HERO SECTION                                                             */}
      {/* ========================================================================= */}
      <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
        
        {/* Subtle background radial glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Editorial Typography & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Small pill: "COMPUTER VISION • DEEP LEARNING" */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                <span className="text-xs font-mono font-bold tracking-widest text-slate-800 dark:text-violet-300 uppercase">
                  COMPUTER VISION • DEEP LEARNING
                </span>
              </div>

              {/* Huge headline:
                  TEACHING
                  MACHINES
                  TO SEE. (violet)
              */}
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-[0.92] text-slate-900 dark:text-white">
                <span className="block">TEACHING</span>
                <span className="block">MACHINES</span>
                <span className="block text-violet-600 dark:text-violet-500 drop-shadow-[0_0_25px_rgba(139,92,246,0.3)]">
                  TO SEE.
                </span>
              </h1>

              {/* Subtitle: "Image Classification, powered by Deep Learning." */}
              <p className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200">
                Image Classification, powered by Deep Learning.
              </p>

              {/* Description: "Turn pixels into intelligent predictions. Upload an image and let imgx.ai discover what the model sees." */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl font-normal leading-relaxed">
                Turn pixels into intelligent predictions. Upload an image and let imgx.ai discover what the model sees.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Primary CTA: "START CLASSIFYING →" */}
                <Link
                  to="/classify"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <span>START CLASSIFYING</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                {/* Secondary CTA: "EXPLORE THE SYSTEM" */}
                <a
                  href="#pipeline"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all duration-200"
                >
                  <span>EXPLORE THE SYSTEM</span>
                </a>
              </div>

              {/* Quick Feature Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-1.5">
                  <Scan className="w-4 h-4 text-violet-500" />
                  <span>RESNET-50 BACKBONE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-violet-500" />
                  <span>&lt; 15MS INFERENCE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-violet-500" />
                  <span>TOP-1: 97.4% ACC</span>
                </div>
              </div>

            </div>

            {/* Right Column: Sophisticated Hero Visual (Computer Vision HUD) */}
            <div className="lg:col-span-6 w-full flex items-center justify-center">
              <HeroVisual />
            </div>

          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* PROCESS STRIP: IMAGE → FEATURES → DEEP LEARNING → PREDICTION              */}
      {/* ========================================================================= */}
      <ProcessStrip />

      {/* ========================================================================= */}
      {/* FOUR NAVIGATION CARDS: 01 CLASSIFY, 02 HOW IT WORKS, 03 HISTORY, 04 ABOUT */}
      {/* ========================================================================= */}
      <NavigationCards />

      {/* ========================================================================= */}
      {/* SECTION: FROM PIXELS TO PREDICTION                                        */}
      {/* ========================================================================= */}
      <PipelineSection />

      {/* ========================================================================= */}
      {/* FINAL CTA: READY TO SEE WHAT AI SEES?                                     */}
      {/* ========================================================================= */}
      <FinalCTA />

    </div>
  );
}
