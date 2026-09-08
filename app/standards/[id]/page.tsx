'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getStandardById, ALL_STANDARDS } from '@/lib/standards-data';
import { Language, UI_TEXT } from '@/lib/translations';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Activity, FileText, Share2, Layers, Award } from 'lucide-react';
import { toast } from 'sonner';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StandardDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const resolved = getStandardById(id);
  const standard = resolved || ALL_STANDARDS.find(s => s.id === 'IS-2347-2017') || ALL_STANDARDS[0];

  const [mode, setMode] = useState<'consumer' | 'industry'>('consumer');
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'clauses' | 'compliance'>('overview');

  const t = UI_TEXT[language];

  if (!standard) {
    notFound();
  }

  const isMandatory = standard.status.includes('Mandatory');

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      
      <Navbar
        mode={mode}
        setMode={setMode}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        
        {/* Back Link */}
        <div>
          <Link
            href="/standards"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'hi' ? 'मानक निर्देशिका पर वापस जाएं' : 'Back to Standards Directory'}</span>
          </Link>
        </div>

        {/* Standard Banner Card */}
        <div className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/40 space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-extrabold text-base sm:text-lg text-amber-900 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">
                {standard.isNumber}
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                isMandatory ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-slate-100 text-slate-700'
              }`}>
                {standard.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                title="Share Standard URL"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-display leading-snug">
            {language === 'hi' && standard.titleHi ? standard.titleHi : standard.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium pt-1">
            <span><strong>Sector:</strong> {standard.sector}</span>
            <span>•</span>
            <span><strong>Category:</strong> {standard.category}</span>
            <span>•</span>
            <span><strong>Conformity:</strong> {standard.conformityAssessmentScheme}</span>
            <span>•</span>
            <span><strong>Year:</strong> {standard.year}</span>
          </div>

          {standard.qcoOrder && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>Mandatory Quality Control Order (QCO):</strong> {standard.qcoOrder}.
                <span className="block text-rose-700 mt-0.5">Manufacturing, importing, or selling without the ISI mark is illegal in India under the BIS Act.</span>
              </div>
            </div>
          )}

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'hi' ? 'दायरा व विवरण' : 'Scope & Overview'}
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'tests'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.keyTests} ({standard.keyTests.length})
          </button>
          <button
            onClick={() => setActiveTab('clauses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'clauses'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.clauses} ({standard.clauses.length})
          </button>
          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'compliance'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'hi' ? 'अंकन एवं अनुपालन' : 'Marking & Compliance'}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>{t.scope}</span>
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {language === 'hi' && standard.scopeHi ? standard.scopeHi : standard.scope}
                </p>
              </div>

              {standard.consumerTips && standard.consumerTips.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>{t.consumerAdvisory}</span>
                  </h3>
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
                    {standard.consumerTips.map((tip, idx) => (
                      <div key={idx} className="text-xs text-emerald-950 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {standard.industryGuidelines && standard.industryGuidelines.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>{t.industryNotes}</span>
                  </h3>
                  <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-2">
                    {standard.industryGuidelines.map((g, idx) => (
                      <div key={idx} className="text-xs text-blue-950 flex items-start gap-2">
                        <Activity className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KEY TESTS */}
          {activeTab === 'tests' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                {t.keyTests}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {standard.keyTests.map((test, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 bg-slate-50/50 space-y-1.5 transition">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900 font-display">
                        {idx + 1}. {test.name}
                      </h4>
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                        {test.parameterLimit}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {test.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CLAUSES */}
          {activeTab === 'clauses' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                {t.clauses}
              </h3>
              <div className="space-y-3">
                {standard.clauses.map((clause, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-2">
                    <div className="font-mono font-bold text-xs text-amber-900 bg-amber-200/70 inline-block px-2.5 py-0.5 rounded-md border border-amber-300">
                      {clause.clauseNumber} — {clause.title}
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      {language === 'hi' && clause.contentHi ? clause.contentHi : clause.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COMPLIANCE & MARKING */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>{t.markingReq}</span>
                </h3>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-800 leading-relaxed">
                  {standard.markingRequirements}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Harmonized System (HS) Codes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {standard.hsCodes && standard.hsCodes.length > 0 ? (
                    standard.hsCodes.map((code) => (
                      <span key={code} className="font-mono text-xs bg-slate-100 text-slate-800 px-3 py-1 rounded-xl border border-slate-300">
                        {code}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500">No specific HS code assigned</span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                <span className="font-bold block">Demo/Educational Notice:</span>
                <p className="text-slate-600">{standard.demoNotice}</p>
              </div>
            </div>
          )}

        </div>

      </main>

      <Footer language={language} />

    </div>
  );
}
