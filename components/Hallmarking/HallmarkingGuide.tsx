'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Smartphone, ExternalLink, ShieldCheck, Search, HelpCircle } from 'lucide-react';
import { Language } from '@/lib/translations';

interface PurityGrade {
  carat: string;
  fineness: string;
  goldPercentage: string;
  typicalUses: string;
  typicalUsesHi: string;
}

const PURITY_GRADES: PurityGrade[] = [
  {
    carat: '24K',
    fineness: '999',
    goldPercentage: '99.9%',
    typicalUses: 'Gold Coins, Bullion Bars, Investment',
    typicalUsesHi: 'सोने के सिक्के, बिस्कुट, निवेश'
  },
  {
    carat: '23K',
    fineness: '958',
    goldPercentage: '95.8%',
    typicalUses: 'Traditional Heavy Jewellery',
    typicalUsesHi: 'पारंपरिक भारी आभूषण'
  },
  {
    carat: '22K',
    fineness: '916',
    goldPercentage: '91.6%',
    typicalUses: 'Most Popular Indian Gold Jewellery',
    typicalUsesHi: 'सर्वाधिक लोकप्रिय भारतीय सोने के आभूषण'
  },
  {
    carat: '20K',
    fineness: '833',
    goldPercentage: '83.3%',
    typicalUses: 'Intricate & Studded Jewellery',
    typicalUsesHi: 'जड़ाऊ एवं नक्काशीदार आभूषण'
  },
  {
    carat: '18K',
    fineness: '750',
    goldPercentage: '75.0%',
    typicalUses: 'Diamond Jewellery & Modern Daily Wear',
    typicalUsesHi: 'हीरे के आभूषण एवं आधुनिक दैनिक आभूषण'
  },
  {
    carat: '14K',
    fineness: '585',
    goldPercentage: '58.5%',
    typicalUses: 'Affordable & High Durability Lightweight Jewellery',
    typicalUsesHi: 'किफायती एवं टिकाऊ हल्के आभूषण'
  }
];

export function HallmarkingGuide({ language }: { language: Language }) {
  const isHi = language === 'hi';
  const [huidInput, setHuidInput] = useState('');
  const [huidValidation, setHuidValidation] = useState<{
    tested: boolean;
    validFormat: boolean;
    code: string;
  } | null>(null);

  const handleHuidCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = huidInput.trim().toUpperCase();
    if (!trimmed) return;

    // HUID format: exactly 6 alphanumeric characters
    const isValid = /^[A-Z0-9]{6}$/.test(trimmed);
    setHuidValidation({
      tested: true,
      validFormat: isValid,
      code: trimmed
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-950 border border-amber-300 text-[11px] font-mono font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{isHi ? 'सोने की शुद्धता एवं उपभोक्ता सुरक्षा' : 'Gold Purity & Consumer Safeguards'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-display">
            {isHi ? 'बीआईएस हॉलमार्किंग एवं HUID गाइड' : 'BIS Hallmarking & HUID Verification Guide'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {isHi
              ? 'हॉलमार्क वाले सोने के आभूषणों के 3 चिह्न, 6-अंकीय HUID कोड और BIS Care ऐप पर सत्यापन समझें। अनिवार्यता जिलों और छूट पर निर्भर करती है।'
              : 'Understand the 3 mandatory hallmark signs on gold jewellery, verify 6-digit alphanumeric HUID codes, and protect your investments.'}
          </p>
        </div>

        <a
          href="https://play.google.com/store/apps/details?id=com.bis.bisapp"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-md shadow-amber-500/20 self-start sm:self-auto"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{isHi ? 'BIS Care ऐप पर HUID जांचें' : 'Verify HUID on BIS Care'}</span>
        </a>
      </div>

      {/* 3 Mandatory Signs Graphic Hardware Enclosure */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-base sm:text-lg text-slate-950 font-display flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          <span>{isHi ? 'सोने के आभूषण पर 3 अनिवार्य चिह्न' : 'The 3 Mandatory Hallmark Signs on Gold Jewellery'}</span>
        </h3>
        <p className="text-xs text-slate-600">
          {isHi
            ? '1 जुलाई 2021 से लागू नियमों के अनुसार, भारत में बेचे जाने वाले प्रत्येक सोने के आभूषण पर ये 3 चिह्न लेज़र द्वारा अंकित होने अनिवार्य हैं:'
            : 'As notified under the Bureau of Indian Standards (Hallmarking) Regulations, every hallmarked gold article sold in India must display these 3 laser-engraved marks:'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Sign 1: BIS Logo */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                {isHi ? '1. बीआईएस मानक चिह्न (BIS Logo)' : '1. Official BIS Logo'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHi
                  ? 'त्रिकोणीय आधिकारिक बीआईएस प्रतीक चिह्न जो यह प्रमाणित करता है कि आभूषण बीआईएस मान्यता प्राप्त केंद्र द्वारा परखा गया है।'
                  : 'The triangular official Bureau of Indian Standards emblem certifying third-party testing at a recognized centre.'}
              </p>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-amber-200 text-center font-mono font-bold text-xs text-amber-900">
              △ BIS MARK
            </div>
          </div>

          {/* Sign 2: Purity & Fineness */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                {isHi ? '2. शुद्धता एवं कैरट (Purity Grade)' : '2. Purity in Carats & Fineness'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHi
                  ? 'कैरट और सूक्ष्मता संख्या जो सोने की शुद्धता दर्शाती है (उदा. 22K916 का अर्थ है 91.6% शुद्ध सोना)।'
                  : 'Fineness number declaring exact gold content (e.g. 22K916 = 91.6% pure, 18K750 = 75.0% pure, 14K585 = 58.5% pure).'}
              </p>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-amber-200 text-center font-mono font-bold text-xs text-amber-900">
              22K916 / 18K750 / 14K585
            </div>
          </div>

          {/* Sign 3: 6-Digit HUID */}
          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900">
                {isHi ? '3. 6-अंकीय HUID कोड (6-Digit Code)' : '3. 6-Digit Alphanumeric HUID'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHi
                  ? 'हॉलमार्क विशिष्ट पहचान कोड (HUID) जो प्रत्येक आभूषण के लिए अद्वितीय होता है और जिसे बदला नहीं जा सकता।'
                  : 'Hallmark Unique Identification (HUID) code laser-etched on every piece, assuring traceability to the jeweller and assaying lab.'}
              </p>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-amber-200 text-center font-mono font-bold text-xs text-amber-900">
              HUID: AB1234
            </div>
          </div>
        </div>
      </div>

      {/* Interactive HUID Format Checker */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-amber-50/30 border border-slate-200 space-y-4">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-600" />
            <span>{isHi ? 'HUID कोड प्रारूप परीक्षक' : 'Interactive HUID Format Inspector'}</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {isHi
              ? 'अपने आभूषण पर अंकित 6-अंकीय अक्षरांकीय (Alphanumeric) HUID कोड दर्ज करें (उदा. AB1234 या 9K4M2L):'
              : 'Enter the 6-digit alphanumeric HUID code etched on your jewellery piece to test format compliance:'}
          </p>
        </div>

        <form onSubmit={handleHuidCheck} className="flex flex-col sm:flex-row gap-2 max-w-xl">
          <input
            type="text"
            maxLength={6}
            value={huidInput}
            onChange={(e) => setHuidInput(e.target.value.toUpperCase())}
            placeholder="e.g. AB1234"
            className="flex-1 px-4 py-2.5 bg-white border border-slate-300 focus:border-amber-500 rounded-xl text-sm font-mono uppercase outline-hidden"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shrink-0"
          >
            {isHi ? 'प्रारूप जांचें' : 'Inspect Format'}
          </button>
        </form>

        {huidValidation && (
          <div className="mt-3 p-4 rounded-xl border text-xs leading-relaxed animate-fadeIn">
            {huidValidation.validFormat ? (
              <div className="space-y-2 text-emerald-900 bg-emerald-50/80 border-emerald-300 p-3 rounded-lg border">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {isHi
                      ? `वैध HUID प्रारूप: "${huidValidation.code}"`
                      : `Valid HUID Format Syntax: "${huidValidation.code}"`}
                  </span>
                </div>
                <p className="text-slate-700">
                  {isHi
                    ? 'यह कोड 6-अंकीय अक्षरांकीय HUID प्रारूप के पूर्णतः अनुरूप है। ध्यान दें: प्रामाणिक लाइव सरकारी डेटाबेस सत्यापन केवल आधिकारिक BIS Care मोबाइल ऐप पर ही उपलब्ध है।'
                    : 'This input conforms to the 6-digit alphanumeric HUID standard. Note: Authoritative live verification with the registered jeweller name and AHC centre must be confirmed directly inside the official BIS Care Mobile App.'}
                </p>
                <div className="pt-1">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.bis.bisapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:underline"
                  >
                    <span>{isHi ? 'BIS Care ऐप पर लाइव विवरण देखें' : 'Confirm Live Details in BIS Care App'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-rose-900 bg-rose-50/80 border-rose-300 p-3 rounded-lg border">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    {isHi
                      ? `अमान्य HUID प्रारूप: "${huidValidation.code}"`
                      : `Invalid HUID Code Format: "${huidValidation.code}"`}
                  </span>
                </div>
                <p className="text-slate-700">
                  {isHi
                    ? 'HUID कोड में ठीक 6 अक्षरांकीय अक्षर/अंक होने चाहिए (केवल A-Z और 0-9)। विशेष वर्ण या भिन्न लंबाई अमान्य है।'
                    : 'This input does not match the 6-character alphanumeric HUID format (A-Z, 0-9). Check the marking and verify the code in BIS Care.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fineness & Carat Reference Table */}
      <div className="space-y-3">
        <h4 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>{isHi ? 'सोने की शुद्धता एवं सूक्ष्मता तालिका' : 'BIS Standard Gold Fineness Reference Table'}</span>
        </h4>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">{isHi ? 'कैरट (Carat)' : 'Carat Grade'}</th>
                <th className="p-3">{isHi ? 'सूक्ष्मता (Fineness)' : 'Fineness Mark'}</th>
                <th className="p-3">{isHi ? 'सोने का प्रतिशत' : 'Pure Gold %'}</th>
                <th className="p-3">{isHi ? 'सामान्य उपयोग' : 'Typical Commercial Application'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {PURITY_GRADES.map((g, idx) => (
                <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                  <td className="p-3 font-bold text-slate-900 font-mono">{g.carat}</td>
                  <td className="p-3 font-mono text-amber-800 font-bold">{g.fineness}</td>
                  <td className="p-3 text-slate-900">{g.goldPercentage}</td>
                  <td className="p-3 text-slate-600">{isHi ? g.typicalUsesHi : g.typicalUses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consumer Rights Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="font-bold block mb-0.5">
            {isHi ? 'उपभोक्ता अधिकार: आभूषण की शुद्धता का परीक्षण' : 'Consumer Right: Independent Purity Testing'}
          </span>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            {isHi
              ? 'कोई भी उपभोक्ता किसी भी बीआईएस मान्यता प्राप्त एएचसी (Assaying & Hallmarking Centre) में नाममात्र शुल्क देकर अपने सोने के आभूषण की शुद्धता की स्वतंत्र जांच करवा सकता है।'
              : 'Consumers can get jewellery tested at a BIS-recognized Assaying & Hallmarking Centre. BIS lists ₹200 for consumer fire-assay testing; ₹45 is the separate gold hallmarking charge per article.'}
          </p>
        </div>
        <a
          href="https://www.bis.gov.in/hallmarking-overview/hallmarking-faqs/hallmarking-faq/?lang=en"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 font-bold text-amber-900 hover:bg-amber-100 transition shrink-0"
        >
          {isHi ? 'BIS शुल्क देखें' : 'Check BIS fees'}
        </a>
      </div>
    </div>
  );
}
