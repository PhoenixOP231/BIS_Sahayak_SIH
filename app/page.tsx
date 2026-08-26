'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ChatInterface } from '@/components/Chat/ChatInterface';
import { Footer } from '@/components/Footer';
import { Language, UI_TEXT } from '@/lib/translations';
import { BookOpen, Search, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [mode, setMode] = useState<'consumer' | 'industry'>('consumer');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');

  const t = UI_TEXT[language];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      
      {/* Top Navigation */}
      <Navbar
        mode={mode}
        setMode={setMode}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Hero Section */}
      <HeroSection
        mode={mode}
        setMode={setMode}
        language={language}
        onSelectPrompt={(prompt) => setSelectedPrompt(prompt)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        
        {/* RAG Chat Assistant */}
        <section id="chat" className="relative">
          <ChatInterface
            mode={mode}
            language={language}
            initialQuery={selectedPrompt}
            onClearInitialQuery={() => setSelectedPrompt('')}
          />
        </section>

        {/* Quick Access Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          
          <Link
            href="/standards"
            className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-xl hover:shadow-amber-500/5 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 font-display mb-1.5">
                {t.navStandards}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {language === 'hi'
                  ? 'घरेलू उपकरणों, निर्माण सामग्री, पेयजल और खिलौनों के लिए 20+ भारतीय मानकों को खोजें और जांचें।'
                  : 'Search & browse Indian Standards by IS number, sector, product category, and mandatory Quality Control Orders (QCO).'
                }
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-amber-800 group-hover:text-amber-950 gap-1">
              <span>{language === 'hi' ? 'मानक देखें' : 'Browse Catalog'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/recommend"
            className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-xs hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-800 mb-4 group-hover:scale-105 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 font-display mb-1.5">
                {t.navRecommend}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {language === 'hi'
                  ? 'निविदा विनिर्देशों या उत्पाद विवरण के आधार पर प्रासंगिक भारतीय मानकों और परीक्षण सीमाओं का AI मिलान।'
                  : 'Paste procurement specifications or tender bills of materials to automatically discover applicable Indian Standards.'
                }
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-blue-800 group-hover:text-blue-950 gap-1">
              <span>{language === 'hi' ? 'विनिर्देश मिलान' : 'Match Specification'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/verify"
            className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-400 shadow-xs hover:shadow-xl hover:shadow-emerald-500/5 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 font-display mb-1.5">
                {t.navVerify}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {language === 'hi'
                  ? '7/8 अंकों का CM/L लाइसेंस नंबर जांचें और नकली आईएसआई मार्क की पहचान के लिए 4-चरणीय गाइड देखें।'
                  : 'Validate 7/8-digit CM/L license numbers and learn how to identify authentic ISI marks vs counterfeit products.'
                }
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-800 group-hover:text-emerald-950 gap-1">
              <span>{language === 'hi' ? 'मार्क सत्यापित करें' : 'Verify Mark'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </section>

      </main>

      {/* Global Footer */}
      <Footer language={language} />

    </div>
  );
}
