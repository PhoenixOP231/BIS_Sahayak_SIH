'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Smartphone, 
  ExternalLink, 
  FileCheck2, 
  Building2, 
  MapPin, 
  Calendar, 
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { UI_TEXT, Language } from '@/lib/translations';
import { findVerifiedLicense, VerifiedLicense } from '@/lib/license-database';
import { ISIMarkLogo } from './ISIMarkLogo';

export function MarkVerifier({ language }: { language: Language }) {
  const t = UI_TEXT[language];
  const [cmlInput, setCmlInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    status: 'verified' | 'unverified' | 'invalid' | null;
    license: VerifiedLicense | null;
    inputNumber: string;
  }>({ status: null, license: null, inputNumber: '' });

  const runVerification = (input: string) => {
    const clean = input.trim().toUpperCase();
    if (!clean) return;

    const digitsOnly = clean.replace(/[^0-9]/g, '');

    if (digitsOnly.length !== 7 && digitsOnly.length !== 8) {
      setVerificationResult({
        status: 'invalid',
        license: null,
        inputNumber: clean,
      });
      return;
    }

    // Check in verified BIS License registry
    const matched = findVerifiedLicense(digitsOnly);

    if (matched) {
      setVerificationResult({
        status: 'verified',
        license: matched,
        inputNumber: `CM/L-${digitsOnly}`,
      });
    } else {
      // 7/8 digits but NOT in our verified authentic registry
      setVerificationResult({
        status: 'unverified',
        license: null,
        inputNumber: `CM/L-${digitsOnly}`,
      });
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    runVerification(cmlInput);
  };

  const handleQuickTest = (licenseNum: string) => {
    setCmlInput(licenseNum);
    runVerification(licenseNum);
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
                placeholder="e.g. CM/L-8400123 or 8400123"
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

          {/* Quick Demo Test Buttons */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>{language === 'hi' ? 'त्वरित परीक्षण के लिए उदाहरण चुनें:' : 'Or test with verified vs unverified sample numbers:'}</span>
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickTest('8400123')}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                ✓ CM/L-8400123 (Prestige Cooker)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('6200154')}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                ✓ CM/L-6200154 (Tata Tiscon Steel)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('5100087')}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                ✓ CM/L-5100087 (Bisleri Water)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('11111111')}
                className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                ⚠ 11111111 (Unverified Sample)
              </button>
            </div>
          </div>
        </form>

        {/* 1. RESULT: VERIFIED AUTHENTIC LICENSE */}
        {verificationResult.status === 'verified' && verificationResult.license && (
          <div className="mt-6 p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-2 border-emerald-500 shadow-md animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-emerald-950 font-display">
                      {language === 'hi' ? 'प्रमाणिक बीआईएस लाइसेंस सत्यापित' : 'Verified Authentic BIS License'}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 font-mono">
                    {verificationResult.license.cmlNumber} • {verificationResult.license.scheme}
                  </p>
                </div>
              </div>

              {/* Visual ISI Mark Emblem */}
              <div className="shrink-0">
                <ISIMarkLogo
                  isNumber={verificationResult.license.isNumber.split(' ')[0] + ' ' + verificationResult.license.isNumber.split(' ')[1]?.split(':')[0]}
                  cmlNumber={verificationResult.license.cmlNumber}
                  size="sm"
                />
              </div>
            </div>

            {/* Detailed Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-emerald-100">
                <Building2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {language === 'hi' ? 'निर्माता एवं ब्रांड' : 'Manufacturer & Brand'}
                  </span>
                  <span className="font-bold text-slate-900 block">
                    {verificationResult.license.manufacturer}
                  </span>
                  <span className="text-slate-600 text-[11px]">
                    {verificationResult.license.brand}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-emerald-100">
                <Award className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {language === 'hi' ? 'भारतीय मानक संख्या' : 'Indian Standard Specification'}
                  </span>
                  <span className="font-bold text-slate-900 block font-mono">
                    {verificationResult.license.isNumber}
                  </span>
                  <span className="text-slate-600 text-[11px]">
                    {verificationResult.license.standardTitle}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-emerald-100">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {language === 'hi' ? 'फैक्ट्री स्थान' : 'Operative Factory Location'}
                  </span>
                  <span className="font-semibold text-slate-800 block">
                    {verificationResult.license.factoryLocation}, {verificationResult.license.state}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-emerald-100">
                <Calendar className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {language === 'hi' ? 'वैधता तिथि' : 'License Valid Until'}
                  </span>
                  <span className="font-bold text-emerald-800 block">
                    {verificationResult.license.validUntil} (Operative)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200/80 flex items-center justify-between">
              <span className="text-[11px] text-emerald-900 font-medium">
                {language === 'hi' ? '✓ मानक की पूर्ण परीक्षण सीमाएं देखें:' : '✓ View technical test limits for this standard:'}
              </span>
              <Link
                href={`/standards/${verificationResult.license.standardId}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100/80 px-3 py-1.5 rounded-xl transition"
              >
                <span>{language === 'hi' ? 'मानक क्लॉज देखें' : 'Inspect Clauses'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        )}

        {/* 2. RESULT: UNVERIFIED / POTENTIAL COUNTERFEIT WARNING */}
        {verificationResult.status === 'unverified' && (
          <div className="mt-6 p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-rose-50/40 to-white border-2 border-rose-400 shadow-md animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-base text-rose-950 font-display">
                    {language === 'hi' ? 'लाइसेंस अप्रमाणित — नकली उत्पाद की चेतावनी!' : 'Unverified in BIS Registry — Potential Counterfeit Warning!'}
                  </h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full">
                    NOT FOUND
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {language === 'hi' 
                    ? `लाइसेंस संख्या "${verificationResult.inputNumber}" 7/8 अंकों की प्रारूप संरचना से मेल खाती है, लेकिन यह हमारे आधिकारिक बीआईएस भारतीय मानक रजिस्ट्री में किसी प्रमाणित निर्माता से मेल नहीं खाती है।`
                    : `The license number "${verificationResult.inputNumber}" matches the numeric 7/8-digit format, but it was NOT FOUND in our indexed Bureau of Indian Standards manufacturer registry.`}
                </p>
                <div className="p-3 bg-white/90 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <span>⚠️ {language === 'hi' ? 'महत्वपूर्ण उपभोक्ता सुरक्षा निर्देश:' : 'Important Consumer Safety Directive:'}</span>
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    {language === 'hi'
                      ? '• इस उत्पाद को प्रमाणित न समझें। नकली ISI मार्क से आग लगने, कुकर फटने या दूषित पानी का गंभीर खतरा हो सकता है। आधिकारिक BIS Care मोबाइल ऐप में निर्माता का नाम जांचें।'
                      : '• Do NOT assume this product is safe or certified. Counterfeit ISI marks carry serious fire, explosion, and toxic contamination risks. Confirm manufacturer details in the official BIS Care App before purchasing.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. RESULT: INVALID FORMAT */}
        {verificationResult.status === 'invalid' && (
          <div className="mt-6 p-5 rounded-3xl bg-rose-50 border-2 border-rose-300 text-rose-950 animate-fadeIn">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm mb-1">
                  {language === 'hi' ? 'अमान्य CM/L लाइसेंस प्रारूप!' : 'Invalid CM/L License Format!'}
                </h4>
                <p className="text-xs leading-relaxed text-slate-700">
                  {language === 'hi'
                    ? 'आधिकारिक भारतीय मानक ब्यूरो (BIS Scheme-I) लाइसेंस नंबर में ठीक 7 या 8 अंक होने चाहिए (उदा. CM/L-8400123 या 8400123)।'
                    : 'Authentic BIS Scheme-I license numbers must consist of exactly 7 or 8 numeric digits (e.g. CM/L-8400123 or 8400123).'}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 4-Step Visual Inspection Guide with Visual Logo */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900 font-display flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-amber-600" />
              <span>{language === 'hi' ? 'प्रमाणिक ISI मार्क की 4-चरणीय जांच' : '4-Step Authenticity Checklist'}</span>
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'असली और नकली ISI मार्क की पहचान करने के 4 महत्वपूर्ण बिंदु:' : 'How to inspect authentic ISI marking against counterfeit products:'}
            </p>
          </div>

          {/* Visual Logo Preview */}
          <div className="shrink-0 hidden sm:block">
            <ISIMarkLogo isNumber="IS 2347" cmlNumber="CM/L-8400123" size="sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex gap-3.5 items-start">
            <div className="w-7 h-7 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-xs text-amber-950 mb-1">
                {language === 'hi' ? 'मानक संख्या (Top: IS Number)' : 'Top: IS Standard Number'}
              </h4>
              <p className="text-xs text-slate-600 leading-snug">
                {t.verifyStep3} (e.g. <span className="font-mono font-bold text-slate-800">IS 2347</span> for Cookers, <span className="font-mono font-bold text-slate-800">IS 14543</span> for Water).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex gap-3.5 items-start">
            <div className="w-7 h-7 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-xs text-amber-950 mb-1">
                {language === 'hi' ? 'आईएसआई लोगो (Centre: ISI Logo)' : 'Centre: Authentic ISI Logo'}
              </h4>
              <p className="text-xs text-slate-600 leading-snug">
                {t.verifyStep1} Look for the official geometric monogram with interlocking <span className="font-bold text-slate-800">I-S-I</span> characters in a rectangle.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex gap-3.5 items-start">
            <div className="w-7 h-7 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-xs text-amber-950 mb-1">
                {language === 'hi' ? 'CM/L लाइसेंस नंबर (Bottom)' : 'Bottom: 7/8 Digit CM/L Number'}
              </h4>
              <p className="text-xs text-slate-600 leading-snug">
                {t.verifyStep2} Must be printed beneath the logo (e.g. <span className="font-mono font-bold text-slate-800">CM/L-8400123</span>).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex gap-3.5 items-start">
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-xs text-emerald-950 mb-1">
                {language === 'hi' ? 'BIS Care मोबाइल ऐप सत्यापन' : 'Instant In-App Verification'}
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
              <p className="text-xs text-slate-300">Verify ISI marks, Gold Hallmarks & register consumer complaints directly with the Government of India.</p>
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
