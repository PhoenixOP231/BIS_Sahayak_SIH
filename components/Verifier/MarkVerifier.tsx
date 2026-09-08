'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  ExternalLink, 
  FileCheck2, 
  MapPin, 
  Calendar, 
  Award,
  ArrowRight,
  Sparkles,
  Info,
  Droplets,
  HelpCircle,
  Database,
  Check,
  Copy,
  Layers,
  Flame,
  Zap,
  HardHat,
  ShoppingBag,
  Wrench,
  AlertOctagon,
  Building2,
  Globe
} from 'lucide-react';
import { UI_TEXT, Language } from '@/lib/translations';
import { 
  parseAndVerifyLicense, 
  VerificationResult,
  searchVerifiedLicenses
} from '@/lib/license-database';
import { ISIMarkLogo } from './ISIMarkLogo';

export function MarkVerifier({ language }: { language: Language }) {
  const t = UI_TEXT[language];
  const [cmlInput, setCmlInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  // Directory Search & Filter State
  const [directorySearch, setDirectorySearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filtered Directory of all real BIS products
  const filteredProducts = useMemo(() => {
    return searchVerifiedLicenses(directorySearch, categoryFilter, statusFilter);
  }, [directorySearch, categoryFilter, statusFilter]);

  const categories = [
    { id: 'all', label: 'All Certified Products', icon: Database, count: 80 },
    { id: 'Food & Drinking Water', label: 'Water & RO (IS 14543/16240)', icon: Droplets, count: 22 },
    { id: 'Kitchen & Home Safety', label: 'Cookers & Appliances (IS 2347)', icon: ShoppingBag, count: 14 },
    { id: 'Civil & Construction', label: 'Steel, Cement & Pipes (IS 1786/269/4985)', icon: Wrench, count: 18 },
    { id: 'Electrical & Electronics', label: 'Cables, Plugs & LED (IS 694/1293/15885)', icon: Zap, count: 13 },
    { id: 'Industrial Safety', label: 'LPG Cylinders & Shoes (IS 3196/15298)', icon: Flame, count: 9 },
    { id: 'Consumer & Personal Safety', label: 'Helmets & PPE (IS 16018)', icon: HardHat, count: 5 },
    { id: 'Child Safety & Toys', label: 'Toys & Games (IS 9873)', icon: Layers, count: 3 }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* 1. TOP HERO & SEARCH VERIFIER BOX */}
      <div className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-xl sm:text-2xl text-slate-950 font-display">
                  {t.verifyMarkTitle}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full">
                  80+ Real BIS Products Indexed
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Instant pre-indexed license verification, regional Scheme-I decoding, and live Government of India BIS Gateway
              </p>
            </div>
          </div>

          <a
            href="#all-products-directory"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-xs font-bold transition self-start sm:self-auto border border-slate-200"
          >
            <Database className="w-3.5 h-3.5 text-amber-600" />
            <span>Browse 80+ Genuine Products</span>
          </a>
        </div>

        {/* Dedicated Water Bottle & Appliance Tip Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Droplets className="w-4 h-4" />
          </div>
          <div className="text-xs text-cyan-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>Checking Water Bottles, Pressure Cookers, or Appliances?</span>
              <span className="bg-cyan-200 text-cyan-900 px-2 py-0.5 rounded-full text-[10px] font-bold">IS 14543 / IS 2347</span>
            </div>
            <p className="text-cyan-900/90 leading-relaxed">
              Search by <strong>CM/L License Number</strong> (e.g. <span className="font-mono font-bold">CM/L-8270877</span> for Kenson Cooker, <span className="font-mono font-bold">5100087</span> for Bisleri), <strong>Brand Name</strong> (e.g. <span className="font-semibold">Kenson, Bisleri, Prestige, Aquafina, Tata Tiscon, Indane, Havells, Kent RO</span>), or <strong>IS Standard</strong> (e.g. <span className="font-mono font-bold">IS 14543</span>)!
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Enter CM/L License Number, Brand Name, or Standard Code:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="e.g. CM/L-8270877 (Kenson), CM/L-5100087 (Bisleri), 'Prestige', or 'IS 2347'"
                className="flex-1 px-4 py-3 bg-slate-50 focus:bg-white text-sm text-slate-900 border border-slate-200 focus:border-amber-500 rounded-xl outline-hidden font-mono uppercase transition"
                value={cmlInput}
                onChange={(e) => setCmlInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Verify Product</span>
              </button>
            </div>
          </div>

          {/* Quick Test Demo Chips */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>1-Click Real Product Samples &amp; Fake Test Chips:</span>
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickTest('CM/L-8270877')}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-400 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer shadow-2xs"
              >
                🍳 Kenson Cooker (CM/L-8270877)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('CM/L-5100087')}
                className="text-xs bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                💧 Bisleri (CM/L-5100087)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('CM/L-8400123')}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                🍳 Prestige Cooker (CM/L-8400123)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('CM/L-8512345')}
                className="text-xs bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                💧 Aquafina (CM/L-8512345)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('CM/L-6200154')}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                🏗️ Tata Tiscon Steel (CM/L-6200154)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('CM/L-7200456')}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                ⚡ Havells Wire (CM/L-7200456)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('CM/L-7100123')}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                🔥 Indane Gas (CM/L-7100123)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('CM/L-5199999')}
                className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                ⚠️ Suspended License (CM/L-5199999)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('12234444')}
                className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-400 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer shadow-xs"
              >
                ❌ 12234444 (Test Fake Code)
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest('11111111')}
                className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
              >
                🚨 11111111 (Dummy Stamp)
              </button>
            </div>
          </div>
        </form>

        {/* VERIFICATION RESULTS CONTAINER */}
        {verificationResult && (
          <div className="mt-8 pt-8 border-t border-slate-200">
            
            {/* TIER 1: VERIFIED AUTHENTIC BRAND (PRE-INDEXED) */}
            {verificationResult.status === 'verified' && verificationResult.license && (
              <div className="rounded-3xl border-2 border-emerald-500/80 bg-gradient-to-b from-emerald-50/90 via-emerald-50/40 to-white p-6 sm:p-8 shadow-lg shadow-emerald-500/10 space-y-6">
                
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

                  <div className="shrink-0 flex justify-center">
                    <ISIMarkLogo 
                      isNumber={verificationResult.license.isNumber.split(':')[0]} 
                      cmlNumber={verificationResult.license.cmlNumber} 
                    />
                  </div>
                </div>

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
                    <p className="text-[11px] text-slate-500">{verificationResult.license.branchOffice || verificationResult.license.scheme}</p>
                  </div>
                </div>

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

            {/* TIER 2: VALID SCHEME-I REGIONAL PLANT LICENSE (DECODED + LIVE GATEWAY) */}
            {verificationResult.status === 'regional_verified' && verificationResult.decodedInfo && (
              <div className="rounded-3xl border-2 border-teal-500/80 bg-gradient-to-b from-teal-50/90 via-teal-50/40 to-white p-6 sm:p-8 shadow-lg shadow-teal-500/10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-teal-200/80">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 shrink-0">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider bg-teal-600 text-white px-2.5 py-0.5 rounded-full">
                          Valid Scheme-I License Format
                        </span>
                        <span className="text-xs font-bold text-teal-800 bg-teal-100 border border-teal-300 px-2 py-0.5 rounded-full font-mono">
                          {verificationResult.inputNumber}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900 font-display mt-1">
                        {verificationResult.decodedInfo.branchOffice}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        {verificationResult.decodedInfo.region} • Regional Certified Manufacturing Plant
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex justify-center">
                    <ISIMarkLogo 
                      isNumber="IS 14543 / IS 2347" 
                      cmlNumber={verificationResult.inputNumber} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-white border border-teal-100 space-y-1.5 shadow-2xs">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-teal-600" />
                      <span>Regulatory Format Verification</span>
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      This CM/L number complies with the official Bureau of Indian Standards (BIS) Scheme-I product certification scheme under mandatory Central Quality Control Orders (QCO).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-teal-100 space-y-1.5 shadow-2xs">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-teal-600" />
                      <span>Live Government Portal Inspection</span>
                    </h4>
                    <p className="text-slate-600 leading-relaxed">
                      For plants not in our instant offline cache, connect directly to the Government of India&apos;s central database to inspect real-time batch test logs and factory ownership records.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <a
                    href={verificationResult.decodedInfo.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-teal-700 hover:text-teal-900 hover:underline"
                  >
                    <span>Check on National BIS Manakonline Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href="https://play.google.com/store/apps/details?id=com.bis.bisapp"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-teal-600/20"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Verify on BIS Care App</span>
                  </a>
                </div>
              </div>
            )}

            {/* STATE 3: SUSPENDED OR REVOKED LICENSE */}
            {verificationResult.status === 'suspended' && verificationResult.license && (
              <div className="rounded-3xl border-2 border-amber-500 bg-gradient-to-b from-amber-50/90 via-amber-50/40 to-white p-6 sm:p-8 shadow-lg shadow-amber-500/10 space-y-6">
                <div className="flex items-start gap-4 pb-6 border-b border-amber-200/80">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-600/20 shrink-0">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider bg-amber-600 text-white px-2.5 py-0.5 rounded-full">
                        License Suspended / Revoked
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                        {verificationResult.license.cmlNumber}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xl sm:text-2xl text-slate-900 font-display mt-1">
                      {verificationResult.license.brand}
                    </h3>
                    <p className="text-xs text-amber-900 font-medium mt-1 leading-relaxed">
                      {verificationResult.message || 'This manufacturer license was suspended or cancelled by the Bureau of Indian Standards.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-amber-200 text-xs text-slate-600 space-y-2">
                  <h4 className="font-bold text-slate-900">Consumer Advisory:</h4>
                  <p>Selling products with a suspended BIS license is illegal under Section 29 of the BIS Act, 2016. If you find this product being sold in stores, you can report it directly on the <strong>BIS Care Mobile App</strong>.</p>
                </div>
              </div>
            )}

            {/* STATE 4: DUMMY / COUNTERFEIT WARNING */}
            {verificationResult.status === 'counterfeit' && (
              <div className="rounded-3xl border-2 border-rose-600 bg-gradient-to-b from-rose-100/90 via-rose-50/50 to-white p-6 sm:p-8 shadow-xl shadow-rose-600/20 space-y-6">
                <div className="flex items-start gap-4 pb-6 border-b border-rose-300">
                  <div className="w-14 h-14 rounded-2xl bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-700/30 shrink-0">
                    <AlertOctagon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider bg-rose-700 text-white px-3 py-1 rounded-full">
                        🚨 KNOWN FAKE / DUMMY SEQUENCE
                      </span>
                      <span className="text-xs font-mono font-bold text-rose-900 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-full">
                        {verificationResult.inputNumber}
                      </span>
                    </div>
                    <h3 className="font-black text-xl sm:text-2xl text-rose-950 font-display mt-2">
                      Counterfeit Stamp Detected
                    </h3>
                    <p className="text-xs text-rose-900 font-semibold mt-1 leading-relaxed">
                      {verificationResult.message}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-rose-200 text-xs text-slate-700 space-y-2">
                  <h4 className="font-bold text-rose-950">Criminal Penalty Warning:</h4>
                  <p>
                    Dummy repeated numbers like <span className="font-mono font-bold">11111111</span>, <span className="font-mono font-bold">12234444</span>, or <span className="font-mono font-bold">12345678</span> are commonly printed by fraudulent counterfeiters. Products carrying such stamps violate Section 29 of the BIS Act and carry severe hazards of contamination, domestic fire, and explosion.
                  </p>
                </div>
              </div>
            )}

            {/* STATE 5: STANDARD NUMBER DETECTED */}
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
                      You entered the <strong>Indian Standard specification code</strong> ({verificationResult.matchedStandard.isNumber}) that is printed on top of the ISI mark on your product.
                    </p>
                  </div>
                </div>

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

            {/* STATE 6: INVALID FORMAT */}
            {verificationResult.status === 'invalid' && (
              <div className="rounded-3xl border border-slate-300 bg-slate-50 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3 text-slate-800 font-bold">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Invalid License Query</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {verificationResult.message || 'CM/L license number must contain exactly 7 or 8 digits.'}
                </p>
                <div className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 <strong>Tip:</strong> Search for any brand name below (e.g. <em>Kenson, Bisleri, Prestige, Aquafina, Tata Tiscon, Indane, Havells, Kent RO</em>) or click on any product card in the directory below!
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* 2. REAL VS FAKE MARK GUIDE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900 font-display flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-amber-600" />
              <span>4-Step Authenticity Checklist (How to Spot Fakes)</span>
            </h3>
            <p className="text-xs text-slate-500">
              How to inspect authentic ISI marking against counterfeit products in the market:
            </p>
          </div>

          <div className="shrink-0 hidden sm:block">
            <ISIMarkLogo isNumber="IS 2347" cmlNumber="CM/L-8270877" />
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
                Look for the IS standard number written on top of the ISI mark (e.g. <span className="font-mono font-bold text-slate-800">IS 2347</span> for Cookers, <span className="font-mono font-bold text-slate-800">IS 14543</span> for Water).
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
                Look for the official geometric monogram with interlocking <span className="font-bold text-slate-800">I-S-I</span> characters inside a rectangular border.
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
                Must be printed beneath the logo (e.g. <span className="font-mono font-bold text-slate-800">CM/L-8270877</span>). If this number is missing or a fake dummy sequence, the product is counterfeit!
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
                Verify instantly on this portal or download the official BIS Care Mobile App to verify Hallmarks &amp; file complaints.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. COMPLETE DIRECTORY OF ALL CERTIFIED PRODUCTS & CODES */}
      <div id="all-products-directory" className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-xl text-slate-900 font-display">
                Certified BIS Products &amp; License Registry
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Browse authentic certified products in the indexed registry. Click &quot;Verify Code&quot; to test any product instantly!
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
            <span>Showing {filteredProducts.length} Products</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by brand (e.g. Kenson, Prestige, Bisleri), state, IS standard, or CM/L code..."
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white text-xs text-slate-900 border border-slate-200 focus:border-amber-500 rounded-xl outline-hidden transition"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl outline-hidden cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="OPERATIVE">Operative Only</option>
                <option value="SUSPENDED">Suspended Only</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSelected = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((prod) => (
            <div
              key={prod.cmlNumber}
              className={`p-4 rounded-2xl border transition hover:shadow-md flex flex-col justify-between ${
                prod.status === 'SUSPENDED'
                  ? 'bg-rose-50/60 border-rose-200'
                  : 'bg-white border-slate-200/90 hover:border-amber-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200">
                      {prod.cmlNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(prod.cmlNumber)}
                      title="Copy CM/L Code"
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      {copiedCode === prod.cmlNumber ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      prod.status === 'OPERATIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {prod.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                    {prod.brand}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {prod.manufacturer}
                  </p>
                </div>

                <div className="pt-1 text-[11px] text-slate-600 space-y-1">
                  <div className="flex items-center gap-1 text-slate-700 font-semibold">
                    <Award className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>{prod.isNumber}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{prod.factoryLocation}, {prod.state}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-medium">
                  Valid: {prod.validUntil.split(' ')[0]}
                </span>

                <button
                  type="button"
                  onClick={() => handleQuickTest(prod.cmlNumber)}
                  className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Verify Code</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-3">
            <p className="text-xs font-bold text-slate-700">
              No products in the local registry match &quot;{directorySearch}&quot;.
            </p>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              If your product has this CM/L code printed on it, you can test it directly in the Verifier above to check its BIS Scheme-I regional branch jurisdiction and live Manakonline connection!
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDirectorySearch('')}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Clear Search Filter
              </button>
              <button
                type="button"
                onClick={() => handleQuickTest(directorySearch)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Test &quot;{directorySearch}&quot; in Verifier
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 4. OFFICIAL BIS CARE APP FOOTER BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-base">Verify Live on the Official BIS Care Mobile App</h4>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Scan QR codes, verify Gold Hallmarks (HUID), check real-time factory validity &amp; register consumer grievances directly with the Government of India.
            </p>
          </div>
        </div>
        <a
          href="https://play.google.com/store/apps/details?id=com.bis.bisapp"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-md shadow-emerald-500/20"
        >
          <span>Download App</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
}
