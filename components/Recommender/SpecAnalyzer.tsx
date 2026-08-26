'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Shield, ArrowRight, CheckCircle2, FileText, Activity, Layers, Download } from 'lucide-react';
import { UI_TEXT, Language } from '@/lib/translations';
import { RecommendationResult } from '@/app/api/recommend/route';

const SAMPLE_SPECS = [
  {
    title: 'Electrical Wiring & Power Plugs Tender',
    text: 'Procurement of 5000 units of 16A 3-pin earthed plugs and sockets with child-safety shutters, along with 25,000 meters of 1.5 sq mm and 2.5 sq mm copper conductor PVC flame-retardant (FR) insulated electrical wiring cables rated for 1100V working voltage for new administrative building.'
  },
  {
    title: 'Construction & Seismic Reinforcement Specs',
    text: 'Supply of 200 Metric Tonnes of Thermo-Mechanically Treated (TMT) High Strength Deformed Steel Bars grade Fe 500D (12mm, 16mm, 25mm diameter) with minimum 16% elongation for earthquake resistant bridge construction, along with 4000 bags of 53 Grade Ordinary Portland Cement (OPC).'
  },
  {
    title: 'Commercial Water Purifier & Plumbing System',
    text: 'Installation of reverse osmosis (RO) point-of-use water purification systems with minimum 40% water recovery efficiency and 85% TDS reduction, connected via 1-inch and 2-inch lead-free unplasticized PVC (uPVC) pipes for potable drinking water supply.'
  }
];

export function SpecAnalyzer({ language }: { language: Language }) {
  const t = UI_TEXT[language];
  const [specText, setSpecText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<RecommendationResult[] | null>(null);

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = (textToAnalyze || specText).trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    setResults(null);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specText: text, language })
      });

      const data = await res.json();
      if (data.success) {
        setResults(data.recommendations);
      }
    } catch (err) {
      console.error('Failed to analyze spec:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (spec: string) => {
    setSpecText(spec);
    handleAnalyze(spec);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Input Card */}
      <div className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50">
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-slate-900 font-display">
              {t.recommendTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.recommendSubtitle}
            </p>
          </div>
        </div>

        {/* Preset Sample Tenders */}
        <div className="mb-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            {language === 'hi' ? 'नमूना निविदा विनिर्देश चुनें:' : 'Or load sample tender specification:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_SPECS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(sample.text)}
                className="text-xs bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 px-3 py-1.5 rounded-xl transition font-medium cursor-pointer text-left"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="relative mb-4">
          <textarea
            rows={5}
            value={specText}
            onChange={(e) => setSpecText(e.target.value)}
            placeholder={t.specInputPlaceholder}
            className="w-full p-4 bg-slate-50 focus:bg-white text-sm text-slate-900 border border-slate-200 focus:border-amber-500 rounded-2xl outline-hidden transition-all shadow-inner leading-relaxed resize-y"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {specText.length} characters
          </span>

          <button
            onClick={() => handleAnalyze()}
            disabled={isLoading || !specText.trim()}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition shadow-md shadow-amber-500/20 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>{t.analyzing}</span>
              </>
            ) : (
              <>
                <span>{t.analyzeSpec}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-lg text-slate-900 font-display flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Recommended Indian Standards ({results.length} Matches)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {results.map((rec) => {
              const isMandatory = rec.status.includes('Mandatory');

              return (
                <div
                  key={rec.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 p-6 shadow-xs hover:shadow-lg transition-all space-y-4"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300 font-mono">
                          {rec.isNumber}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isMandatory ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {rec.status}
                        </span>
                        <span className="text-xs text-slate-500">
                          {rec.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-slate-900 font-display">
                        {language === 'hi' && rec.titleHi ? rec.titleHi : rec.title}
                      </h4>
                    </div>

                    {/* Confidence Score Pill */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full">
                        <Activity className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs font-bold font-mono">{rec.confidenceScore}% Match</span>
                      </div>
                    </div>
                  </div>

                  {/* Applicability Rationale */}
                  <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/70 text-xs text-amber-950 leading-relaxed">
                    <strong>{t.whyApplicable}:</strong> {language === 'hi' ? rec.reasonHi : rec.reason}
                  </div>

                  {/* Mandatory Tests */}
                  {rec.mandatoryTests && rec.mandatoryTests.length > 0 && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        {t.keyTests}:
                      </span>
                      <ul className="space-y-1">
                        {rec.mandatoryTests.map((tst, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{tst}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Link */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-mono">
                      Harmonized HS: {rec.hsCodes.join(', ') || 'N/A'}
                    </span>

                    <Link
                      href={`/standards/${rec.id}`}
                      className="inline-flex items-center gap-1 font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition"
                    >
                      <span>{t.viewDetails}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
