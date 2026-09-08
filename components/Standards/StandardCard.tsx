'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ArrowRight } from 'lucide-react';
import { StandardDoc } from '@/lib/standards-data';
import { UI_TEXT, Language } from '@/lib/translations';

interface StandardCardProps {
  standard: StandardDoc;
  language: Language;
  onQuickView?: (standard: StandardDoc) => void;
}

export function StandardCard({ standard, language, onQuickView }: StandardCardProps) {
  const t = UI_TEXT[language];
  const isMandatory = standard.status.includes('Mandatory');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400 p-5 shadow-xs hover:shadow-lg hover:shadow-amber-500/5 transition-all flex flex-col justify-between group">
      
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono font-extrabold text-xs text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-md border border-amber-200">
            {standard.isNumber}
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
            isMandatory ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
          }`}>
            {language === 'hi' && standard.status.includes('Mandatory') ? 'अनिवार्य (QCO)' : language === 'hi' && standard.status === 'Voluntary' ? 'स्वैच्छिक मानक' : standard.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-slate-900 font-display group-hover:text-amber-800 transition-colors leading-snug line-clamp-2 mb-1.5">
          {language === 'hi' && standard.titleHi ? standard.titleHi : standard.title}
        </h3>

        {/* Category / Sector */}
        <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5 font-medium">
          <span>{standard.category}</span>
          <span>•</span>
          <span>{standard.sector}</span>
        </p>

        {/* Scope Snippet */}
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
          {language === 'hi' && standard.scopeHi ? standard.scopeHi : standard.scope}
        </p>

        {/* Key Tests preview */}
        {standard.keyTests && standard.keyTests.length > 0 && (
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 mb-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-600" />
              <span>{t.keyTests}:</span>
            </div>
            <p className="text-xs text-slate-700 line-clamp-2 font-medium">
              {standard.keyTests.map(t => t.name).join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-mono">
          HS: {standard.hsCodes?.[0] || 'N/A'}
        </span>

        <div className="flex items-center gap-2">
          {onQuickView && (
            <button
              onClick={() => onQuickView(standard)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-md hover:bg-slate-100 transition cursor-pointer"
            >
              Quick View
            </button>
          )}

          <Link
            href={`/standards/${standard.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200/80 transition"
          >
            <span>{t.viewDetails}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

    </div>
  );
}
