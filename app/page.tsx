'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ChatInterface } from '@/components/Chat/ChatInterface';
import { Footer } from '@/components/Footer';
import { Language, UI_TEXT } from '@/lib/translations';
import { BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [mode, setMode] = useState<'consumer' | 'industry'>('consumer');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');

  const t = UI_TEXT[language];

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#chat') {
      const el = document.getElementById('chat');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
      }
    }
  }, []);

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
        onSelectPrompt={(prompt) => {
          setSelectedPrompt(prompt);
          const chatEl = document.getElementById('chat');
          if (chatEl) {
            chatEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        
        {/* RAG Chat Assistant */}
        <section id="chat" className="relative scroll-mt-24 sm:scroll-mt-28">
          <ChatInterface
            mode={mode}
            language={language}
            initialQuery={selectedPrompt}
            onClearInitialQuery={() => setSelectedPrompt('')}
          />
        </section>

        {/* Quick Access Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          
          <Link
            href="/standards"
            className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-xl hover:shadow-amber-500/5 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 font-display mb-2">
                {t.navStandards}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {language === 'hi'
                  ? 'घरेलू उपकरणों, निर्माण सामग्री, पेयजल, खिलौनों और औद्योगिक घटकों के लिए 20+ आधिकारिक भारतीय मानकों का अन्वेषण करें। धारा-वार तकनीकी परीक्षण और अनिवार्य QCO आदेश देखें।'
                  : 'Search & browse official Indian Standards by IS number, sector, product category, testing tolerances, and mandatory Quality Control Orders (QCO).'
                }
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-amber-800 group-hover:text-amber-950 gap-1.5">
              <span>{language === 'hi' ? 'मानक निर्देशिका देखें' : 'Explore Standards Catalog'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/verify"
            className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-400 shadow-xs hover:shadow-xl hover:shadow-emerald-500/5 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 font-display mb-2">
                {t.navVerify}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {language === 'hi'
                  ? '7 या 8 अंकों का CM/L लाइसेंस नंबर जांचें और असली आईएसआई मार्क पहचानने व नकली उत्पादों से बचाव के लिए 4-चरणीय सत्यापन गाइड देखें।'
                  : 'Validate 7/8-digit CM/L license numbers under BIS Scheme-I and follow the 4-step guide to verify authentic ISI marks against counterfeits.'
                }
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-800 group-hover:text-emerald-950 gap-1.5">
              <span>{language === 'hi' ? 'मार्क व लाइसेंस सत्यापित करें' : 'Verify ISI Mark & License'}</span>
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
