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
  Sparkles,
  Info,
  Droplets,
  HelpCircle
} from 'lucide-react';
import { UI_TEXT, Language } from '@/lib/translations';
import { 
  parseAndVerifyLicense, 
  VerificationResult 
} from '@/lib/license-database';
import { ISIMarkLogo } from './ISIMarkLogo';

export function MarkVerifier({ language }: { language: Language }) {
  const t = UI_TEXT[language];
  const [cmlInput, setCmlInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const runVerification = (input: string) => {
    const result = parseAndVerifyLicense(input);
    setVerificationResult(result);
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

        {/* Dedicated Water Bottle Tip Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Droplets className="w-4 h-4" />
          </div>
          <div className="text-xs text-cyan-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>Checking a Packaged Drinking Water Bottle?</span>
              <span className="bg-cyan-200 text-cyan-900 px-2 py-0.5 rounded-full text-[10px] font-bold">IS 14543</span>
            </div>
            <p className="text-cyan-900/90 leading-relaxed">
              On every authentic water bottle in India, look for the <strong>ISI mark stamp</strong> on the plastic label. 
              The <strong>top line</strong> shows standard <span className="font-mono font-bold">IS 14543</span>, and the <strong>bottom line</strong> shows the 7 or 8-digit license <span className="font-mono font-bold">CM/L-XXXXXXX</span>. Enter either number below!
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Enter CM/L License Number or Bottle Standard Code:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="e.g. CM/L-5100087 (Bisleri), CM/L-8512345 (Aquafina), or IS 14543"
                className="flex-1 px-4 py-3 bg-slate-50 focus:bg-white text-sm text-slate-900 border border-slate-200 focus:border-amber-500 rounded-xl outline-hidden font-mono uppercase transition"
                value={cmlInput}
                onChange={(e) => setCmlInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Verify License</span>
              </button>
            </div>
          </div>

          {/* Quick Test Demo Chips */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>1-Click Test Samples (Water Bottles & Popular Brands):</span>
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickTest('CM/L-5100087')}
                className="text-xs bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                💧 CM/L-5100087 (Bisleri Bottle)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('CM/L-8512345')}
                className="text-xs bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                💧 CM/L-8512345 (Aquafina Bottle)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('CM/L-5100342')}
                className="text-xs bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                💧 CM/L-5100342 (Kinley Bottle)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('CM/L-5200142')}
                className="text-xs bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                💧 CM/L-5200142 (Rail Neer)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('IS 14543')}
                className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                🏷️ IS 14543 (Standard Number)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('CM/L-8400123')}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                ✓ CM/L-8400123 (Prestige Cooker)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('11111111')}
                className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                ⚠ 11111111 (Fake Stamp Test)
              </button>
            </div>
          </div>
        </form>

        {/* VERIFICATION RESULTS CONTAINER */}
        {verificationResult && (
          <div className="mt-8 pt-8 border-t border-slate-200">
            
            {/* STATE 1: VERIFIED REGISTERED BRAND LICENSE */}
            {verificationResult.status === 'verified' && verificationResult.license && (
              <div className="rounded-3xl border-2 border-emerald-500/80 bg-gradient-to-b from-emerald-50/90 via-emerald-50/40 to-white p-6 sm:p-8 shadow-lg shadow-emerald-500/10 space-y-6">
                
                {/* Header Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-200/80">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                          Authentic BIS License
                        </span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                          Status: {verificationResult.license.status}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900 font-display mt-1">
                        {verificationResult.license.brand}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        {verificationResult.license.manufacturer}
                      </p>
                    </div>
                  </div>

                  {/* Vector ISI Mark Preview */}
                  <div className="shrink-0 flex justify-center">
                    <ISIMarkLogo 
                      isNumber={verificationResult.license.isNumber.split(':')[0]} 
                      cmlNumber={verificationResult.license.cmlNumber} 
                    />
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Standard Specification</span>
                    </div>
                    <p className="font-bold text-slate-900">{verificationResult.license.isNumber}</p>
                    <p className="text-[11px] text-slate-500 leading-tight">{verificationResult.license.standardTitle}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Certified Plant Location</span>
                    </div>
                    <p className="font-bold text-slate-900">{verificationResult.license.factoryLocation}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{verificationResult.license.state}, India</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>License Validity Period</span>
                    </div>
                    <p className="font-bold text-emerald-700">Valid until {verificationResult.license.validUntil}</p>
                    <p className="text-[11px] text-slate-500">{verificationResult.license.scheme}</p>
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-emerald-900 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cross-referenced with BIS Scheme-I Certified Manufacturer Registry.</span>
                  </span>
                  <Link
                    href={`/standards/${verificationResult.license.standardId}`}
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                  >
                    <span>View {verificationResult.license.isNumber.split(':')[0]} Technical Limits</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            )}

            {/* STATE 2: VALID REGIONAL SCHEME-I LICENSE (E.G. REGIONAL BOTTLING PLANT) */}
            {verificationResult.status === 'regional_valid' && verificationResult.decodedInfo && (
              <div className="rounded-3xl border-2 border-teal-500/80 bg-gradient-to-b from-teal-50/90 via-teal-50/40 to-white p-6 sm:p-8 shadow-lg shadow-teal-500/10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-teal-200/80">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 shrink-0">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider bg-teal-600 text-white px-2.5 py-0.5 rounded-full">
                          Valid Scheme-I Format
                        </span>
                        <span className="text-xs font-bold text-teal-800 bg-teal-100 border border-teal-300 px-2 py-0.5 rounded-full">
                          {verificationResult.inputNumber}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900 font-display mt-1">
                        {verificationResult.decodedInfo.branchOffice}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        {verificationResult.decodedInfo.region} • BIS Scheme-I Certification
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex justify-center">
                    <ISIMarkLogo 
                      isNumber="IS 14543" 
                      cmlNumber={verificationResult.inputNumber} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-teal-100 space-y-1.5 shadow-2xs">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-teal-600" />
                      <span>Jurisdiction & Applicable Standards</span>
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      This 7/8-digit CM/L number complies with the Bureau of Indian Standards (BIS) Scheme-I numbering format. In India, all packaged drinking water manufacturing units operate under mandatory <strong>IS 14543:2024</strong> Quality Control Orders.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-teal-100 space-y-1.5 shadow-2xs">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-teal-600" />
                      <span>Live Batch & Address Lookup</span>
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      To inspect this specific plant&apos;s real-time operative status, factory owner name, and laboratory test history, use the official <strong>BIS Care Mobile App</strong> or the e-BIS national portal.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-teal-900 font-medium">
                    ✓ Structurally valid CM/L license format under BIS Act 2016.
                  </span>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.bis.bisapp"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-teal-700 hover:text-teal-900 hover:underline"
                  >
                    <span>Check on BIS Care App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* STATE 3: USER ENTERED STANDARD NUMBER (E.G. "IS 14543") */}
            {verificationResult.status === 'is_standard' && verificationResult.matchedStandard && (
              <div className="rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-amber-50/90 via-amber-50/40 to-white p-6 sm:p-8 shadow-lg shadow-amber-500/10 space-y-6">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Info className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
                        Standard Number Detected
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xl text-slate-900 font-display">
                      {verificationResult.matchedStandard.isNumber} — {verificationResult.matchedStandard.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      You entered the <strong>Indian Standard specification code</strong> ({verificationResult.matchedStandard.isNumber}) that is printed on top of the ISI mark on your bottle or appliance.
                    </p>
                  </div>
                </div>

                {/* How to Find CM/L Number Visual Help */}
                <div className="p-4 rounded-2xl bg-white border border-amber-200/80 space-y-3">
                  <h4 className="font-bold text-xs text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>How to find the 7/8-digit CM/L Number on your product:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                      <span className="font-bold text-amber-900 block mb-1">1. Top Line</span>
                      <p className="text-slate-600 text-[11px]">{verificationResult.matchedStandard.isNumber} (Quality Standard)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                      <span className="font-bold text-amber-900 block mb-1">2. Center Monogram</span>
                      <p className="text-slate-600 text-[11px]">Official ISI framed logo</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="font-bold text-emerald-900 block mb-1">3. Bottom Line (CM/L)</span>
                      <p className="text-emerald-800 text-[11px] font-mono font-bold">CM/L-XXXXXXX (Type this number)</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-2">
                  <span className="text-slate-600">
                    Want to inspect testing limits and mandatory chemical/microbiological tolerances?
                  </span>
                  <Link
                    href={`/standards/${verificationResult.matchedStandard.id}`}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Inspect {verificationResult.matchedStandard.isNumber} Clauses</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* STATE 4: DUMMY / COUNTERFEIT ALERT */}
            {verificationResult.status === 'counterfeit' && (
              <div className="rounded-3xl border-2 border-rose-400 bg-gradient-to-b from-rose-50/90 via-rose-50/40 to-white p-6 sm:p-8 shadow-lg shadow-rose-500/10 space-y-6">
                <div className="flex items-start gap-4 pb-6 border-b border-rose-200/80">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/20 shrink-0">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider bg-rose-600 text-white px-2.5 py-0.5 rounded-full">
                        Counterfeit / Dummy Number
                      </span>
                      <span className="text-xs font-mono font-bold text-rose-900 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">
                        {verificationResult.inputNumber}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xl sm:text-2xl text-rose-950 font-display mt-1">
                      Dummy or Fake License Detected
                    </h3>
                    <p className="text-xs text-rose-800 font-medium mt-1 leading-relaxed">
                      {verificationResult.message}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-rose-200/70 space-y-1.5">
                    <h4 className="font-bold text-rose-950 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Health & Safety Hazards</span>
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      Counterfeit water bottles bypass mandatory reverse osmosis (RO), ozonization, and pesticide residue testing under IS 14543, leading to dangerous bacterial and toxic risks.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-rose-200/70 space-y-1.5">
                    <h4 className="font-bold text-rose-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-rose-600" />
                      <span>Legal Penalty under BIS Act 2016</span>
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      Printing a fake ISI mark is a cognizable criminal offense punishable with up to 2 years imprisonment and heavy fines under Section 29 of the Bureau of Indian Standards Act.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STATE 5: INVALID FORMAT */}
            {verificationResult.status === 'invalid' && (
              <div className="rounded-3xl border border-slate-300 bg-slate-50 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3 text-slate-800 font-bold">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Invalid License Format</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {verificationResult.message || 'CM/L license number must contain exactly 7 or 8 digits.'}
                </p>
                <div className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 <strong>Tip for Water Bottles:</strong> If your bottle says <span className="font-mono font-bold text-slate-800">IS 14543</span>, type that in or look beneath the logo for the 7-digit CM/L code (e.g. <span className="font-mono font-bold text-slate-800">CM/L-5100087</span>).
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* 4-Step Checklist Component */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900 font-display flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-amber-600" />
              <span>4-Step Authenticity Checklist</span>
            </h3>
            <p className="text-xs text-slate-500">
              How to inspect authentic ISI marking against counterfeit products:
            </p>
          </div>

          <div className="shrink-0 hidden sm:block">
            <ISIMarkLogo isNumber="IS 14543" cmlNumber="CM/L-5100087" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex gap-3.5 items-start">
            <div className="w-7 h-7 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-xs text-amber-950 mb-1">
                Top: IS Standard Number
              </h4>
              <p className="text-xs text-slate-600 leading-snug">
                {t.verifyStep1} (e.g. <span className="font-mono font-bold text-slate-800">IS 14543</span> for Water, <span className="font-mono font-bold text-slate-800">IS 2347</span> for Cookers).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex gap-3.5 items-start">
            <div className="w-7 h-7 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-xs text-amber-950 mb-1">
                Centre: Authentic ISI Logo
              </h4>
              <p className="text-xs text-slate-600 leading-snug">
                {t.verifyStep2} Look for the official geometric monogram with interlocking <span className="font-bold text-slate-800">I-S-I</span> characters in a rectangle.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex gap-3.5 items-start">
            <div className="w-7 h-7 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-xs text-amber-950 mb-1">
                Bottom: 7/8 Digit CM/L Number
              </h4>
              <p className="text-xs text-slate-600 leading-snug">
                {t.verifyStep3} Must be printed beneath the logo (e.g. <span className="font-mono font-bold text-slate-800">CM/L-5100087</span>).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex gap-3.5 items-start">
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-xs text-emerald-950 mb-1">
                Instant In-App Verification
              </h4>
              <p className="text-xs text-slate-600 leading-snug">
                {t.verifyStep4}
              </p>
            </div>
          </div>
        </div>

        {/* BIS Care App Official Download Card */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Download BIS Care Mobile App</h4>
              <p className="text-xs text-slate-300">
                Verify ISI marks, Gold Hallmarks & register consumer complaints directly with the Government of India.
              </p>
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
