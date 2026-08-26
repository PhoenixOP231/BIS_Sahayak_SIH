'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, User, Briefcase, Globe, Menu, X } from 'lucide-react';
import { Language, UI_TEXT } from '@/lib/translations';

interface NavbarProps {
  mode: 'consumer' | 'industry';
  setMode: (mode: 'consumer' | 'industry') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export function Navbar({ mode, setMode, language, setLanguage }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = UI_TEXT[language];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-extrabold text-lg sm:text-xl text-slate-950 tracking-tight">
                    {t.appTitle}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                    SIH26107
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  {t.appSubtitle}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-800 hover:bg-amber-50 transition"
            >
              {t.navHome}
            </Link>
            <Link
              href="/standards"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-800 hover:bg-amber-50 transition"
            >
              {t.navStandards}
            </Link>
            <Link
              href="/recommend"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-800 hover:bg-amber-50 transition"
            >
              {t.navRecommend}
            </Link>
            <Link
              href="/verify"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-800 hover:bg-amber-50 transition"
            >
              {t.navVerify}
            </Link>
          </nav>

          {/* Mode Switcher & Language Toggle */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Persona Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setMode('consumer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === 'consumer'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Consumer Mode: Everyday safety and ISI verification"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.consumerMode}</span>
              </button>
              
              <button
                onClick={() => setMode('industry')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mode === 'industry'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Industry Mode: Technical parameters, testing limits, and QCO mandates"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{t.industryMode}</span>
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-slate-200 hover:border-amber-400 bg-white text-xs font-bold text-slate-700 hover:text-amber-900 transition cursor-pointer shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2 py-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-amber-200/80 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-4">
          
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => { setMode('consumer'); setMobileMenuOpen(false); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold ${
                mode === 'consumer' ? 'bg-amber-500 text-white' : 'text-slate-600'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.consumerMode}</span>
            </button>
            <button
              onClick={() => { setMode('industry'); setMobileMenuOpen(false); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold ${
                mode === 'industry' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{t.industryMode}</span>
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-amber-50"
            >
              {t.navHome}
            </Link>
            <Link
              href="/standards"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-amber-50"
            >
              {t.navStandards}
            </Link>
            <Link
              href="/recommend"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-amber-50"
            >
              {t.navRecommend}
            </Link>
            <Link
              href="/verify"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-amber-50"
            >
              {t.navVerify}
            </Link>
          </div>

        </div>
      )}
    </header>
  );
}