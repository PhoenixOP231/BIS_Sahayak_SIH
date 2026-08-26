'use client';

import React, { useState } from 'react';
import { ShieldCheck, Search, AlertCircle, CheckCircle, Smartphone, ExternalLink, Award, FileCheck2 } from 'lucide-react';
import { UI_TEXT, Language } from '@/lib/translations';

export function MarkVerifier({ language }: { language: Language }) {
  const t = UI_TEXT[language];
  const [cmlInput, setCmlInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'valid' | 'invalid' | 'unknown' | null;
    message: string;
    details?: string;
  }>({ status: null, message: '' });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cmlInput.trim().toUpperCase();

    if (!clean) return;

    // CM/L is typically a 7 to 8-digit number (e.g. CM/L-8400123 or 8400123)
    const digitsOnly = clean.replace(/[^0-9]/g, '');

    if (digitsOnly.length === 7 || digitsOnly.length === 8) {
      setVerificationResult({
        status: 'valid',
        message: language === 'hi' 
          ? 'CM/L-' + digitsOnly + ' वैध बीआईएस लाइसेंस संरचना से मेल खाता है।'
          : 'CM/L-' + digitsOnly + ' matches valid BIS Scheme-I license structure.',
        details: language === 'hi'
          ? 'यह 7/8 अंकों का लाइसेंस नंबर आधिकारिक BIS रजिस्ट्री और अनुरूपता मूल्यांकन के अनुरूप है। निर्माता का नाम व वैधता तिथि जानने के लिए BIS Care ऐप उपयोग करें।'
          : 'This 7/8-digit license number format is active under the Bureau of Indian Standards Scheme-I conformity register. To view live manufacturer factory address and license validity date, verify in the BIS Care App.'
      });
    } else {
      setVerificationResult({
        status: 'invalid',
        message: language === 'hi'
          ? 'अमान्य CM/L लाइसेंस संरचना!'
          : 'Invalid CM/L License Format!',
        details: language === 'hi'
          ? 'आधिकारिक भारतीय मानक ब्यूरो लाइसेंस नंबर 7 या 8 अंकों का होना चाहिए (उदा. CM/L-8400123)। अमान्य लाइसेंस से नकली उत्पाद का संदेह हो सकता है।'
          : 'Authentic BIS Scheme-I license numbers must consist of exactly 7 or 8 numeric digits (e.g., CM/L-8400123). Uncertified numbers may indicate counterfeit marks.'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Search Verifier Box */}
      <div className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-slate-900 font-display">
              {t.verifyMarkTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.verifyMarkSub}
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              {language === 'hi' ? 'CM/L लाइसेंस नंबर दर्ज करें (उदा. CM/L-8400123 या 8400123):' : 'Enter 7/8-Digit CM/L License Number (e.g. CM/L-8400123 or 8400123):'}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={cmlInput}
                onChange={(e) => setCmlInput(e.target.value)}
                placeholder="e.g. CM/L-8400123"
                className="flex-1 px-4 py-3 bg-slate-50 focus:bg-white text-sm text-slate-900 border border-slate-200 focus:border-amber-500 rounded-xl outline-hidden font-mono uppercase transition"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{language === 'hi' ? 'सत्यापित करें' : 'Verify License'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Verification Result Alert */}
        {verificationResult.status && (
          <div className={`mt-5 p-4 rounded-2xl border transition-all animate-fadeIn ${
            verificationResult.status === 'valid'
              ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
              : 'bg-rose-50 text-rose-950 border-rose-300'
          }`}>
            <div className="flex items-start gap-2.5">
              {verificationResult.status === 'valid' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-sm mb-1">
                  {verificationResult.message}
                </h4>
                <p className="text-xs leading-relaxed opacity-90">
                  {verificationResult.details}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4-Step Visual Inspection Guide */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h3 className="font-bold text-lg text-slate-900 font-display mb-6 flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-amber-600" />
          <span>{language === 'hi' ? 'प्रमाणिक ISI मार्क की 4-चरणीय जांच' : '4-Step Authenticity Checklist'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex gap-3.5 items-start">
            <div className="w-7 h-7 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-xs text-amber-950 mb-1">
                {language === 'hi' ? 'मानक संख्या (IS Number)' : 'Top: IS Standard Number'}
              </h4>
              <p className="text-xs text-slate-600 leading-snug">
                {t.verifyStep3}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex gap-3.5 items-start">
            <div className="w-7 h-7 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-xs text-amber-950 mb-1">
                {language === 'hi' ? 'आईएसआई लोगो (ISI Logo)' : 'Centre: Authentic ISI Logo'}
              </h4>
              <p className="text-xs text-slate-600 leading-snug">
                {t.verifyStep1}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex gap-3.5 items-start">
            <div className="w-7 h-7 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-xs text-amber-950 mb-1">
                {language === 'hi' ? 'CM/L लाइसेंस नंबर' : 'Bottom: 7/8 Digit CM/L Number'}
              </h4>
              <p className="text-xs text-slate-600 leading-snug">
                {t.verifyStep2}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex gap-3.5 items-start">
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-xs text-emerald-950 mb-1">
                {language === 'hi' ? 'BIS Care मोबाइल ऐप' : 'Instant In-App Verification'}
              </h4>
              <p className="text-xs text-slate-600 leading-snug">
                {t.verifyStep4}
              </p>
            </div>
          </div>

        </div>

        {/* BIS Care App Promotion Box */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Download BIS Care Mobile App</h4>
              <p className="text-xs text-slate-300">Verify ISI marks, Gold Hallmarks & register consumer complaints.</p>
            </div>
          </div>

          <a
            href="https://play.google.com/store/apps/details?id=com.bis.bisapp"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
          >
            <span>Google Play / App Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
}
