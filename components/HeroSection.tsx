'use client';

import React from 'react';
import { Sparkles, Shield, Scale, FileCode2, Search } from 'lucide-react';
import { Language, UI_TEXT, SAMPLE_PROMPTS } from '@/lib/translations';

interface HeroSectionProps {
  mode: 'consumer' | 'industry';
  setMode?: (mode: 'consumer' | 'industry') => void;
  language: Language;
  onSelectPrompt: (prompt: string) => void;
}

export function HeroSection({ mode, language, onSelectPrompt }: HeroSectionProps) {
  const t = UI_TEXT[language];
  const samplePrompts = SAMPLE_PROMPTS[mode].map((item) => item[language]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-amber-200/60">
      
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-25 -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center space-y-6">
          
          {/* GovTech Header Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Smart India Hackathon 2026 • Problem SIH26107</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 font-display tracking-tight leading-[1.15]">
            {t.heroHeading}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans max-w-2xl mx-auto">
            {t.heroSubheading}
          </p>

          {/* Live System Stats */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5 bg-white/80 border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>{language === 'hi' ? '20+ प्रामाणिक भारतीय मानक' : '20+ Authentic Indian Standards'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <Scale className="w-4 h-4 text-rose-600" />
              <span>{language === 'hi' ? 'अनिवार्य QCO निर्देश' : 'Mandatory QCO Directives'}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/80 border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              <FileCode2 className="w-4 h-4 text-emerald-600" />
              <span>{language === 'hi' ? 'pgvector RAG + बहु-संवादी एआई' : 'pgvector RAG + Multi-turn AI'}</span>
            </div>
          </div>

          {/* Sample Prompts Pills */}
          <div className="pt-4 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {language === 'hi' ? 'उदाहरण प्रश्न चुनें:' : 'Or choose a sample question to ask:'}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectPrompt(prompt)}
                  className="text-xs bg-white hover:bg-amber-500 hover:text-white text-slate-700 border border-slate-200 hover:border-amber-500 px-3.5 py-1.5 rounded-full transition-all duration-150 font-medium cursor-pointer shadow-2xs hover:shadow-xs flex items-center gap-1.5 text-left"
                >
                  <Search className="w-3 h-3 opacity-60" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}