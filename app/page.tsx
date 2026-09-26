'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ChatInterface } from '@/components/Chat/ChatInterface';
import { Footer } from '@/components/Footer';
import { Language, UI_TEXT } from '@/lib/translations';
import { BookOpen, ShieldCheck, ArrowRight, Award, Sparkles, FlaskConical, Building2 } from 'lucide-react';

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

        {/* Quick Access Feature Cards Grid */}
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-lg sm:text-xl text-slate-900 font-display">
              {language === 'hi' ? 'प्रमुख बीआईएस सेवाएं एवं ज्ञान पोर्टल' : 'Core BIS Services & Knowledge Portals'}
            </h2>
            <span className="text-[11px] font-mono text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300 font-semibold">
              SIH26107
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Card 1: Standards Catalog */}
            <Link
              href="/standards"
              className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 mb-3 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 font-display mb-1">
                  {t.navStandards}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {language === 'hi'
                    ? '21 भारतीय मानकों के प्रदर्शन सारांश खोजें। वर्तमान धाराएं और QCO आधिकारिक BIS स्रोतों में जांचें।'
                    : 'Browse 21 demonstration standard summaries. Confirm current clauses and QCOs on official BIS portals.'}
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-amber-800 group-hover:text-amber-950 gap-1">
                <span>{language === 'hi' ? 'मानक देखें' : 'Explore Standards'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Mark Verifier */}
            <Link
              href="/verify"
              className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-400 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 mb-3 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 font-display mb-1">
                  {t.navVerify}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {language === 'hi'
                    ? '7 या 8 अंकों का CM/L लाइसेंस नंबर और 4-चरणीय प्रामाणिकता चेकलिस्ट द्वारा नकली सामान से बचाव।'
                    : 'Inspect 7/8-digit CM/L licence numbers and follow the 4-step checklist to spot unverified markings.'}
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-emerald-800 group-hover:text-emerald-950 gap-1">
                <span>{language === 'hi' ? 'मार्क जांचें' : 'Verify Licence'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Conformity Schemes */}
            <Link
              href="/schemes"
              className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 mb-3 group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 font-display mb-1">
                  {t.navSchemes}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {language === 'hi'
                    ? 'Scheme-I (ISI मार्क), CRS (इलेक्ट्रॉनिक्स), FMCS (विदेशी विनिर्माता) और Scheme-X का संपूर्ण तुलनात्मक ढांचा।'
                    : 'Overview of Scheme-I (ISI mark), CRS (Electronics SDoC), FMCS (Foreign Plants), and Scheme-X machinery.'}
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-amber-800 group-hover:text-amber-950 gap-1">
                <span>{language === 'hi' ? 'योजनाएं समझें' : 'Compare Schemes'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 4: Gold Hallmarking & HUID */}
            <Link
              href="/hallmarking"
              className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 mb-3 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 font-display mb-1">
                  {t.navHallmarking}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {language === 'hi'
                    ? 'सोने के आभूषणों पर हॉलमार्क चिह्न, 6-अक्षरीय HUID प्रारूप और शुद्धता तालिका समझें।'
                    : 'Learn gold hallmark signs, the six-character HUID format, and fineness grades.'}
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-amber-800 group-hover:text-amber-950 gap-1">
                <span>{language === 'hi' ? 'हॉलमार्क गाइड' : 'Explore Hallmarking'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 5: BIS Testing Labs */}
            <Link
              href="/labs"
              className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 mb-3 group-hover:scale-105 transition-transform">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 font-display mb-1">
                  {t.navLabs}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {language === 'hi'
                    ? 'केंद्रीय (साहिबाबाद), पश्चिमी (मुंबई), पूर्वी (कोलकाता), दक्षिणी (चेन्नई) लैब और LIMS सैंपल ट्रैकिंग।'
                    : 'Discover BIS Central, Regional & Branch testing laboratories with sample disciplines and LIMS portal links.'}
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-amber-800 group-hover:text-amber-950 gap-1">
                <span>{language === 'hi' ? 'लैब खोजें' : 'Find Laboratories'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 6: MSME Licensing Workflow */}
            <Link
              href="/licensing"
              className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 mb-3 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 font-display mb-1">
                  {t.navLicensing}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {language === 'hi'
                    ? 'CM/L आवेदन के 6 चरण, दस्तावेज चेकलिस्ट और पात्र वार्षिक न्यूनतम मार्किंग शुल्क रियायतें।'
                    : 'Six-step CM/L application guide, document checklist, and eligible annual minimum marking fee concessions.'}
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-amber-800 group-hover:text-amber-950 gap-1">
                <span>{language === 'hi' ? 'आवेदन चरण देखें' : 'View Workflow'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

      </main>

      {/* Global Footer */}
      <Footer language={language} />

    </div>
  );
}
