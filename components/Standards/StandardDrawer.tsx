'use client';

import React from 'react';
import Link from 'next/link';
import { X, Shield, ExternalLink, CheckCircle, AlertTriangle, FileText, Activity } from 'lucide-react';
import { StandardDoc, getStandardById } from '@/lib/standards-data';
import { UI_TEXT, Language } from '@/lib/translations';

interface StandardDrawerProps {
  standardId: string | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export function StandardDrawer({ standardId, isOpen, onClose, language }: StandardDrawerProps) {
  if (!isOpen || !standardId) return null;

  const standard: StandardDoc | undefined = getStandardById(standardId);
  const t = UI_TEXT[language];

  if (!standard) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
        <div className="w-full max-w-lg bg-white h-full p-6 shadow-2xl overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">Standard Details</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-slate-500">Standard details not found for {standardId}</p>
        </div>
      </div>
    );
  }

  const isMandatory = standard.status.includes('Mandatory');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono font-extrabold text-base text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-md border border-amber-300">
                {standard.isNumber}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isMandatory ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {standard.status}
              </span>
            </div>
            <h2 className="font-bold text-base text-slate-900 font-display leading-snug">
              {language === 'hi' && standard.titleHi ? standard.titleHi : standard.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {standard.sector} • {standard.category}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors cursor-pointer"
            aria-label="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* Scope Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>{t.scope}</span>
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {language === 'hi' && standard.scopeHi ? standard.scopeHi : standard.scope}
            </p>
            {standard.qcoOrder && (
              <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs text-rose-800 flex items-start gap-1.5 font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span><strong>QCO Order:</strong> {standard.qcoOrder}</span>
              </div>
            )}
          </div>

          {/* Key Tests */}
          <div>
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>{t.keyTests}</span>
            </h3>
            <div className="space-y-2.5">
              {standard.keyTests.map((test, i) => (
                <div key={i} className="p-3 rounded-lg border border-slate-200 bg-white hover:border-amber-300 transition-colors">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                    <span>{test.name}</span>
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {test.parameterLimit}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{test.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory Clauses */}
          <div>
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>{t.clauses}</span>
            </h3>
            <div className="space-y-2.5">
              {standard.clauses.map((clause, i) => (
                <div key={i} className="p-3 rounded-lg bg-amber-50/50 border border-amber-200/60">
                  <div className="font-bold text-xs text-amber-900 mb-1 flex items-center justify-between">
                    <span>{clause.clauseNumber} — {clause.title}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {language === 'hi' && clause.contentHi ? clause.contentHi : clause.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Marking & Consumer Tips */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200 space-y-2">
            <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>{t.markingReq}</span>
            </h3>
            <p className="text-xs text-emerald-950 leading-relaxed">
              {standard.markingRequirements}
            </p>
            {standard.consumerTips && standard.consumerTips.length > 0 && (
              <ul className="mt-2 pt-2 border-t border-emerald-200/80 space-y-1.5">
                {standard.consumerTips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-emerald-900 flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Conformity: <strong>{standard.conformityAssessmentScheme}</strong>
          </span>
          <Link
            href={`/standards/${standard.id}`}
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition shadow-xs"
          >
            <span>Full Standard Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
