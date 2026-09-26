'use client';

import React, { useState } from 'react';
import { FileCheck, Building2, CheckCircle2, ExternalLink, DollarSign } from 'lucide-react';
import { Language } from '@/lib/translations';

interface WorkflowStep {
  step: number;
  title: string;
  titleHi: string;
  shortDesc: string;
  shortDescHi: string;
  details: string[];
  detailsHi: string[];
  documentsRequired: string[];
  documentsRequiredHi: string[];
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: 1,
    title: 'Portal Registration & Profile Setup',
    titleHi: 'e-BIS पोर्टल पंजीकरण एवं प्रोफाइल',
    shortDesc: 'Create enterprise account on e-BIS / Manakonline portal.',
    shortDescHi: 'e-BIS / Manakonline पोर्टल पर उद्यम खाता बनाएं।',
    details: [
      'Register manufacturing entity on manakonline.in with valid PAN and GSTIN',
      'Provide company incorporation certificate and authorized signatory credentials',
      'Submit registered office and manufacturing premises location proofs'
    ],
    detailsHi: [
      'वैध पैन एवं जीएसटी नंबर के साथ manakonline.in पर विनिर्माण इकाई पंजीकृत करें',
      'कंपनी निगमन प्रमाण पत्र एवं अधिकृत हस्ताक्षरकर्ता क्रेडेंशियल प्रदान करें',
      'पंजीकृत कार्यालय एवं विनिर्माण संयंत्र के पते का प्रमाण प्रस्तुत करें'
    ],
    documentsRequired: [
      'Certificate of Incorporation / Partnership Deed',
      'GSTIN Registration Certificate',
      'Factory Land Ownership / Valid Lease Deed'
    ],
    documentsRequiredHi: [
      'कंपनी निगमन प्रमाण पत्र / पार्टनरशिप डीड',
      'जीएसटी पंजीकरण प्रमाण पत्र',
      'फैक्ट्री भूमि स्वामित्व / वैध पट्टा विलेख'
    ]
  },
  {
    step: 2,
    title: 'Standard & Conformity Scheme Selection',
    titleHi: 'मानक (IS) एवं प्रमाणन योजना का चयन',
    shortDesc: 'Identify applicable Indian Standard (IS) and Conformity Assessment Scheme.',
    shortDescHi: 'उत्पाद पर लागू भारतीय मानक (IS) एवं योजना का निर्धारण करें।',
    details: [
      'Search applicable IS specification (e.g. IS 2347 for cookers, IS 14543 for water)',
      'Review mandatory Quality Control Orders (QCO) and statutory deadlines',
      'Determine if product falls under Scheme-I, CRS, or specialized regulations'
    ],
    detailsHi: [
      'लागू IS विनिर्देश की पहचान करें (उदा. कुकर हेतु IS 2347, पानी हेतु IS 14543)',
      'अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) एवं समयसीमा की समीक्षा करें',
      'निर्धारित करें कि उत्पाद स्कीम-I, CRS या अन्य योजना के अंतर्गत आता है'
    ],
    documentsRequired: [
      'Product technical brochure and brand registration proof',
      'Declaration of product variants / sizes to be certified'
    ],
    documentsRequiredHi: [
      'उत्पाद तकनीकी विवरणिका एवं ब्रांड पंजीकरण प्रमाण',
      'प्रमाणित किए जाने वाले उत्पाद वेरिएंट/साइज़ की घोषणा'
    ]
  },
  {
    step: 3,
    title: 'Testing Arrangement & QC Setup',
    titleHi: 'परीक्षण व्यवस्था एवं गुणवत्ता टीम',
    shortDesc: 'Plan testing arrangements and appoint qualified quality control staff.',
    shortDescHi: 'परीक्षण व्यवस्था बनाएं और योग्य गुणवत्ता टीम नियुक्त करें।',
    details: [
      'Review the product manual and choose an eligible in-house or recognized external testing arrangement',
      'Ensure test equipment has valid calibration certificates from NABL accredited labs',
      'Appoint qualified QC chemist / engineer with relevant technical degrees'
    ],
    detailsHi: [
      'उत्पाद मैनुअल देखें और पात्रता के अनुसार इन-हाउस या मान्यता प्राप्त बाहरी परीक्षण व्यवस्था चुनें',
      'उपकरणों का NABL मान्यता प्राप्त प्रयोगशालाओं से वैध अंशांकन (Calibration) कराएं',
      'संबंधित तकनीकी योग्यता वाले योग्य QC केमिस्ट / इंजीनियर नियुक्त करें'
    ],
    documentsRequired: [
      'List of testing equipment with serial numbers and calibration certificates',
      'Quality control chemist qualification degree and appointment letter',
      'Plant layout indicating manufacturing lines and applicable testing arrangement'
    ],
    documentsRequiredHi: [
      'अंशांकन प्रमाण पत्रों के साथ परीक्षण उपकरणों की सूची',
      'गुणवत्ता नियंत्रण केमिस्ट की डिग्री एवं नियुक्ति पत्र',
      'विनिर्माण लाइनों और लागू परीक्षण व्यवस्था को दर्शाने वाला संयंत्र लेआउट'
    ]
  },
  {
    step: 4,
    title: 'Online Application & Fee Payment',
    titleHi: 'ऑनलाइन आवेदन एवं शुल्क भुगतान',
    shortDesc: 'Submit Form-V with plant documentation and pay statutory audit fees.',
    shortDescHi: 'संयंत्र दस्तावेजों के साथ फॉर्म-V जमा करें और वैधानिक शुल्क का भुगतान करें।',
    details: [
      'Fill comprehensive Form-V on e-BIS detailing manufacturing machinery and capacities',
      'Upload complete Scheme of Testing & Inspection (STI) readiness manual',
      'Check current application and audit fees on the official BIS portal before payment'
    ],
    detailsHi: [
      'मशीनरी और क्षमता का विवरण देते हुए e-BIS पर फॉर्म-V भरें',
      'संपूर्ण परीक्षण एवं निरीक्षण योजना (STI) मैनुअल अपलोड करें',
      'भुगतान से पहले आधिकारिक BIS पोर्टल पर वर्तमान आवेदन और ऑडिट शुल्क जांचें'
    ],
    documentsRequired: [
      'Complete manufacturing machinery list with capacities',
      'Process flow chart from raw material to finished packaging',
      'Udyam Registration Certificate (for MSME fee concessions)'
    ],
    documentsRequiredHi: [
      'क्षमता के साथ विनिर्माण मशीनरी की पूरी सूची',
      'कच्चे माल से पैकेजिंग तक का प्रक्रिया प्रवाह चार्ट (Flow Chart)',
      'उद्यम पंजीकरण प्रमाण पत्र (शुल्क छूट हेतु)'
    ]
  },
  {
    step: 5,
    title: 'Factory Audit & Sample Collection',
    titleHi: 'फैक्ट्री ऑडिट एवं नमूना संग्रह',
    shortDesc: 'BIS technical officer inspects plant controls and draws test samples.',
    shortDescHi: 'बीआईएस तकनीकी अधिकारी संयंत्र का निरीक्षण करते हैं और नमूने लेते हैं।',
    details: [
      'BIS auditing officer visits factory to verify testing infrastructure and manufacturing hygiene',
      'Witness in-house testing performed by factory QC staff',
      'Draw independent product samples, seal them, and dispatch to BIS / NABL testing lab'
    ],
    detailsHi: [
      'बीआईएस अधिकारी संयंत्र नियंत्रण और परीक्षण बुनियादी ढांचे का ऑन-साइट सत्यापन करते हैं',
      'फैक्ट्री कर्मियों द्वारा किए गए इन-हाउस परीक्षण का प्रत्यक्ष अवलोकन (Witness)',
      'स्वतंत्र नमूने एकत्र कर सील किए जाते हैं और बीआईएस लैब में भेजे जाते हैं'
    ],
    documentsRequired: [
      'Daily production and internal routine test logs',
      'Raw material test certificates (MTC / COA)'
    ],
    documentsRequiredHi: [
      'दैनिक उत्पादन एवं आंतरिक परीक्षण रजिस्टर',
      'कच्चे माल के परीक्षण प्रमाण पत्र (MTC / COA)'
    ]
  },
  {
    step: 6,
    title: 'Grant of CM/L Licence & Renewal',
    titleHi: 'CM/L लाइसेंस आवंटन एवं वार्षिक नवीनीकरण',
    shortDesc: 'Receipt of CM/L number, standard ISI mark marking authorization, and annual compliance.',
    shortDescHi: 'CM/L नंबर प्राप्ति, आधिकारिक ISI मार्क मुद्रण अनुमति और वार्षिक अनुपालन।',
    details: [
      'Upon passing independent laboratory testing, BIS issues the Certificate of Licence',
      '7 or 8-digit CM/L number is granted and indexed in national registry',
      'Manufacturer authorized to print authentic ISI mark on products',
      'Subject to periodic surveillance audits and annual minimum marking fee payment'
    ],
    detailsHi: [
      'स्वतंत्र लैब रिपोर्ट सफल होने पर बीआईएस द्वारा लाइसेंस प्रमाण पत्र जारी किया जाता है',
      '7 या 8 अंकों का CM/L नंबर आवंटित होता है और राष्ट्रीय रजिस्ट्री में दर्ज होता है',
      'निर्माता को उत्पाद पर असली ISI मार्क प्रिंट करने का वैधानिक अधिकार प्राप्त होता है',
      'समय-समय पर बाजार निगरानी ऑडिट और वार्षिक नवीनीकरण शुल्क देय होता है'
    ],
    documentsRequired: [
      'Performance Bank Guarantee (if applicable)',
      'Annual Minimum Marking Fee payment receipt'
    ],
    documentsRequiredHi: [
      'परफॉर्मेंस बैंक गारंटी (यदि लागू हो)',
      'वार्षिक न्यूनतम मार्किंग शुल्क भुगतान रसीद'
    ]
  }
];

export function LicensingWorkflow({ language }: { language: Language }) {
  const isHi = language === 'hi';
  const [activeStep, setActiveStep] = useState(1);
  const currentStep = WORKFLOW_STEPS.find(s => s.step === activeStep) || WORKFLOW_STEPS[0];

  return (
    <div className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-950 border border-amber-300 text-[11px] font-mono font-semibold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5 text-amber-700" />
            <span>{isHi ? 'एमएसएमई एवं उद्योग प्रमाणन' : 'MSME & Industry Licensing Portal'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-display">
            {isHi ? 'बीआईएस लाइसेंस (CM/L) आवेदन प्रक्रिया' : '6-Step BIS CM/L Licensing Procedure'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {isHi
              ? 'पोर्टल पंजीकरण से लेकर CM/L लाइसेंस आवंटन तक की 6-चरणीय पारदर्शी डिजिटल प्रक्रिया, आवश्यक दस्तावेज और एमएसएमई शुल्क रियायतें।'
              : 'End-to-end procedural guide for obtaining a BIS Scheme-I manufacturer licence on manakonline.in, document requirements, and MSME concessions.'}
          </p>
        </div>

        <a
          href="https://www.manakonline.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-md shadow-amber-500/20 self-start sm:self-auto"
        >
          <span>{isHi ? 'manakonline.in पर आवेदन करें' : 'Apply on manakonline.in'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* MSME & Startup Concession Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-300/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-950">
              {isHi ? 'सूक्ष्म, लघु उद्यम (MSME) एवं स्टार्ट-अप विशेष रियायतें' : 'Special Concessions for MSMEs & Startups'}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
              {isHi
                ? 'BIS की मार्च 2026 अधिसूचना के अनुसार, 31 मई 2029 तक वार्षिक न्यूनतम मार्किंग शुल्क पर सूक्ष्म उद्यमों और स्टार्टअप को 80%, लघु उद्यमों को 50%, और पात्र महिला उद्यमों को अतिरिक्त 10% छूट है। आवेदन और ऑडिट शुल्क अलग से जांचें।'
                : 'BIS states that through 31 May 2029, annual minimum marking fee concessions are 80% for micro enterprises and startups, 50% for small enterprises, plus an additional 10% for eligible women-led enterprises. Check application and audit fees separately.'}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <a href="https://www.bis.gov.in/wp-content/uploads/2026/03/Scheme-1-Concession-Extension-31May2029.pdf" target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full inline-block">
            {isHi ? 'BIS शुल्क अधिसूचना देखें' : 'Check BIS fee notice'}
          </a>
        </div>
      </div>

      {/* Horizontal Step Progression Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {WORKFLOW_STEPS.map((s) => {
          const isSelected = activeStep === s.step;
          const isPast = s.step < activeStep;
          return (
            <button
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/25 ring-2 ring-amber-400/40'
                  : isPast
                  ? 'bg-amber-50 text-slate-800 border-amber-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${isSelected ? 'bg-white text-amber-700' : isPast ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-600'}`}>
                  {s.step}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                )}
              </div>
              <span className={`text-[11px] font-bold leading-snug line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                {isHi ? s.titleHi.split(' ')[0] : s.title.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Step Detail Card */}
      <div className="rounded-3xl border-2 border-amber-200/90 bg-gradient-to-b from-white via-amber-50/20 to-slate-50/60 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/80 pb-4">
          <div>
            <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 uppercase">
              {isHi ? `चरण ${currentStep.step} / 6` : `Step ${currentStep.step} of 6`}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 font-display mt-1">
              {isHi ? currentStep.titleHi : currentStep.title}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {isHi ? currentStep.shortDescHi : currentStep.shortDesc}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Action Points */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isHi ? 'मुख्य प्रक्रियात्मक कदम' : 'Key Procedural Actions'}</span>
            </h4>
            <ul className="space-y-2.5 pt-1 text-slate-700">
              {(isHi ? currentStep.detailsHi : currentStep.details).map((det, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{det}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Documents Required */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-600" />
              <span>{isHi ? 'आवश्यक दस्तावेज (Checklist)' : 'Mandatory Document Checklist'}</span>
            </h4>
            <ul className="space-y-2.5 pt-1 text-slate-700">
              {(isHi ? currentStep.documentsRequiredHi : currentStep.documentsRequired).map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-2 text-xs">
          <button
            type="button"
            disabled={activeStep === 1}
            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            {isHi ? '← पिछला चरण' : '← Previous Step'}
          </button>

          <span className="text-slate-500 font-mono">
            {activeStep} / 6
          </span>

          <button
            type="button"
            disabled={activeStep === 6}
            onClick={() => setActiveStep(prev => Math.min(6, prev + 1))}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1 shadow-md shadow-amber-600/20"
          >
            <span>{isHi ? 'अगला चरण →' : 'Next Step →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
