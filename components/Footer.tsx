'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ExternalLink } from 'lucide-react';
import { Language, UI_TEXT } from '@/lib/translations';

export function Footer({ language }: { language: Language }) {
  const t = UI_TEXT[language];

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-xl bg-amber-600 flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-display font-extrabold text-lg text-white">
                {t.appTitle}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              {language === 'hi'
                ? 'स्मार्ट इंडिया हैकाथॉन 2026 के लिए विकसित एआई-संचालित भारतीय मानक एवं गुणवत्ता नियंत्रण सहायक। उद्योगों और उपभोक्ताओं के लिए संपूर्ण ज्ञान सेतु।'
                : 'AI-Powered Intelligent Assistant for Indian Standards, Quality Control Orders, testing parameters, and procurement specification matching. Developed for Smart India Hackathon 2026.'
              }
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-amber-400 font-mono">
              <span>Problem Statements: SIH26107 & SIH26108</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              {language === 'hi' ? 'त्वरित लिंक' : 'Quick Portals'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-amber-400 transition">
                  {t.navHome}
                </Link>
              </li>
              <li>
                <Link href="/standards" className="hover:text-amber-400 transition">
                  {t.navStandards}
                </Link>
              </li>
              <li>
                <Link href="/recommend" className="hover:text-amber-400 transition">
                  {t.navRecommend}
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-amber-400 transition">
                  {t.navVerify}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: BIS Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              {language === 'hi' ? 'आधिकारिक स्रोत' : 'Official BIS Resources'}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.bis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition inline-flex items-center gap-1"
                >
                  <span>BIS Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.services.bis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition inline-flex items-center gap-1"
                >
                  <span>e-BIS & Manakonline</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://play.google.com/store/apps/details?id=com.bis.biscare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition inline-flex items-center gap-1"
                >
                  <span>BIS Care Mobile App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://consumeraffairs.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition inline-flex items-center gap-1"
                >
                  <span>Ministry of Consumer Affairs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & SIH Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} BIS Sahayak • Smart India Hackathon 2026 Project
          </div>
          <div className="flex items-center gap-1">
            <span>Demo GovTech prototype built for SIH26107 & SIH26108</span>
          </div>
        </div>

      </div>
    </footer>
  );
}