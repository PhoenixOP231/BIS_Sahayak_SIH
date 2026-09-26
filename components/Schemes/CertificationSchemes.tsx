'use client';

import React, { useState } from 'react';
import { Award, Cpu, Globe2, Wrench, CheckCircle2, ArrowRight, ExternalLink, ShieldCheck, FileText } from 'lucide-react';
import { Language } from '@/lib/translations';

interface SchemeInfo {
  id: string;
  name: string;
  nameHi: string;
  tagline: string;
  taglineHi: string;
  markType: string;
  markTypeHi: string;
  applicability: string;
  applicabilityHi: string;
  keyRequirements: string[];
  keyRequirementsHi: string[];
  typicalProducts: string[];
  typicalProductsHi: string[];
  timeline: string;
  timelineHi: string;
  portalUrl: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SCHEMES: SchemeInfo[] = [
  {
    id: 'scheme-1',
    name: 'Scheme-I: ISI Mark Conformity Scheme',
    nameHi: 'स्कीम-I: ISI मार्क अनुरूपता योजना',
    tagline: 'Mandatory & voluntary certification for domestic manufacturers with in-house quality control.',
    taglineHi: 'घरेलू निर्माताओं के लिए इन-हाउस गुणवत्ता नियंत्रण आधारित अनिवार्य एवं स्वैच्छिक प्रमाणन।',
    markType: 'Standard ISI Mark + 7/8 Digit CM/L Licence Number',
    markTypeHi: 'मानक ISI मार्क + 7/8 अंकीय CM/L लाइसेंस नंबर',
    applicability: 'Domestic manufacturers operating production plants in India.',
    applicabilityHi: 'भारत में उत्पादन संयंत्र संचालित करने वाले घरेलू निर्माता।',
    keyRequirements: [
      'Testing arrangement for applicable standard; eligible MSMEs may use recognized external laboratories',
      'Appointment of qualified quality control personnel',
      'Factory inspection by BIS technical audit officer',
      'Independent sample drawing and testing in BIS / NABL laboratory'
    ],
    keyRequirementsHi: [
      'लागू मानक के लिए परीक्षण व्यवस्था; पात्र MSME मान्यता प्राप्त बाहरी प्रयोगशाला का उपयोग कर सकते हैं',
      'योग्य गुणवत्ता नियंत्रण (QC) कर्मियों की नियुक्ति',
      'बीआईएस तकनीकी लेखा परीक्षा अधिकारी द्वारा संयंत्र निरीक्षण',
      'बीआईएस/NABL प्रयोगशाला में स्वतंत्र नमूना परीक्षण'
    ],
    typicalProducts: [
      'Pressure Cookers (IS 2347)',
      'Packaged Drinking Water (IS 14543)',
      'TMT Steel Rebars (IS 1786)',
      'Two-Wheeler Helmets (IS 4151)',
      'LPG Regulators (IS 9798)'
    ],
    typicalProductsHi: [
      'घरेलू प्रेशर कुकर (IS 2347)',
      'पैकेज्ड पेयजल (IS 14543)',
      'TMT सरिया (IS 1786)',
      'हेलमेट (IS 4151)',
      'LPG रेगुलेटर (IS 9798)'
    ],
    timeline: 'Varies by product and application route; check BIS portal',
    timelineHi: 'उत्पाद और आवेदन प्रक्रिया के अनुसार भिन्न; BIS पोर्टल देखें',
    portalUrl: 'https://www.manakonline.in',
    icon: Award,
  },
  {
    id: 'crs',
    name: 'CRS: Compulsory Registration Scheme',
    nameHi: 'CRS: अनिवार्य पंजीकरण योजना',
    tagline: 'Self-declaration of conformity based on test reports for electronics, IT, and solar goods.',
    taglineHi: 'इलेक्ट्रॉनिक्स, आईटी और सौर उत्पादों के लिए परीक्षण रिपोर्ट आधारित स्व-घोषणा पंजीकरण।',
    markType: 'Standard Registration Mark with R-Number (R-XXXXXXXX)',
    markTypeHi: 'R-नंबर वाला मानक पंजीकरण चिह्न (R-XXXXXXXX)',
    applicability: 'Manufacturers of electronic and IT hardware notified under MeitY / MNRE orders.',
    applicabilityHi: 'MeitY / MNRE आदेशों के तहत अधिसूचित इलेक्ट्रॉनिक एवं आईटी उपकरण निर्माता।',
    keyRequirements: [
      'Sample testing at BIS-recognized NABL accredited laboratory',
      'Submission of formal Test Report within 90 days of issuance',
      'Self-Declaration of Conformity (SDoC) by manufacturer',
      'Brand owner and factory registration with Indian representative'
    ],
    keyRequirementsHi: [
      'बीआईएस-मान्यता प्राप्त NABL प्रयोगशाला में नमूना परीक्षण',
      'जारी होने के 90 दिनों के भीतर औपचारिक टेस्ट रिपोर्ट जमा करना',
      'निर्माता द्वारा अनुरूपता की स्व-घोषणा (SDoC)',
      'भारतीय प्रतिनिधि के साथ ब्रांड मालिक एवं फैक्ट्री पंजीकरण'
    ],
    typicalProducts: [
      'Mobile Phones & Laptops (IS 13252)',
      'LED Luminaires & Drivers (IS 15885)',
      'Smart Watches & Wearables',
      'Solar Photovoltaic Inverters (IS 16221)',
      'Power Adapters & Set Top Boxes'
    ],
    typicalProductsHi: [
      'मोबाइल फोन एवं लैपटॉप (IS 13252)',
      'LED लाइट्स एवं ड्राइवर्स (IS 15885)',
      'स्मार्ट वॉच एवं वियरेबल्स',
      'सोलर पीवी इनवर्टर (IS 16221)',
      'पावर एडॉप्टर एवं सेटअप बॉक्स'
    ],
    timeline: 'Varies by product and application; check BIS portal',
    timelineHi: 'उत्पाद और आवेदन के अनुसार भिन्न; BIS पोर्टल देखें',
    portalUrl: 'https://www.services.bis.gov.in',
    icon: Cpu,
  },
  {
    id: 'fmcs',
    name: 'FMCS: Foreign Manufacturers Certification Scheme',
    nameHi: 'FMCS: विदेशी निर्माता प्रमाणन योजना',
    tagline: 'ISI marking certification for overseas production facilities exporting goods into India.',
    taglineHi: 'भारत में उत्पाद निर्यात करने वाले विदेशी विनिर्माण संयंत्रों के लिए ISI मार्किंग प्रमाणन।',
    markType: 'Standard ISI Mark + Overseas CM/L Licence Number',
    markTypeHi: 'मानक ISI मार्क + विदेशी CM/L लाइसेंस नंबर',
    applicability: 'Foreign manufacturing plants located outside the territory of India.',
    applicabilityHi: 'भारत की सीमा से बाहर स्थित विदेशी विनिर्माण संयंत्र।',
    keyRequirements: [
      'Appointment of Authorized Indian Representative (AIR)',
      'Pre-audit document submission with manufacturing plant layout',
      'On-site overseas factory inspection by BIS auditor team',
      'Drawal of counter-samples dispatched for testing in India',
      'Performance Bank Guarantee (PBG) submission'
    ],
    keyRequirementsHi: [
      'अधिकृत भारतीय प्रतिनिधि (AIR) की नियुक्ति',
      'संयंत्र लेआउट के साथ पूर्व-निरीक्षण दस्तावेज प्रस्तुति',
      'बीआईएस लेखा परीक्षक दल द्वारा विदेशी संयंत्र का ऑन-साइट निरीक्षण',
      'परीक्षण हेतु भारत भेजे जाने वाले नमूनों का संग्रह',
      'परफॉर्मेंस बैंक गारंटी (PBG) जमा करना'
    ],
    typicalProducts: [
      'Imported Automotive Tyres & Tubes',
      'Steel & Metal Products for Infrastructure',
      'Chemicals & Petrochemical Polymers',
      'Industrial Electric Motors & Pumps',
      'Sanitary Ware & Construction Glass'
    ],
    typicalProductsHi: [
      'आयातित ऑटोमोटिव टायर एवं ट्यूब',
      'इन्फ्रास्ट्रक्चर हेतु स्टील एवं धातु उत्पाद',
      'रसायन एवं पॉलिमर सामग्री',
      'औद्योगिक इलेक्ट्रिक मोटर एवं पंप',
      'सैनिटरी वेयर एवं ग्लास'
    ],
    timeline: 'Varies by factory inspection and testing; check BIS portal',
    timelineHi: 'कारखाना निरीक्षण और परीक्षण के अनुसार भिन्न; BIS पोर्टल देखें',
    portalUrl: 'https://www.bis.gov.in/index.php/fmcs/',
    icon: Globe2,
  },
  {
    id: 'scheme-x',
    name: 'Scheme-X: Capital Goods & Heavy Machinery',
    nameHi: 'स्कीम-X: पूंजीगत सामान एवं भारी मशीनरी',
    tagline: 'Conformity assessment tailored for heavy engineering equipment, pumps, and industrial machinery.',
    taglineHi: 'भारी इंजीनियरिंग उपकरण, पंप और औद्योगिक मशीनरी के लिए विशेष अनुरूपता मूल्यांकन।',
    markType: 'Certificate of Conformity (CoC) & Scheme-X Marking',
    markTypeHi: 'अनुरूपता प्रमाण पत्र (CoC) एवं स्कीम-X मार्किंग',
    applicability: 'Manufacturers of complex assemblies, cranes, industrial compressors, and machine tools.',
    applicabilityHi: 'जटिल असेंबली, क्रेन, औद्योगिक कंप्रेसर और मशीन टूल्स के निर्माता।',
    keyRequirements: [
      'Type examination of technical design documentation',
      'Factory Production Control (FPC) audit by accredited agency',
      'Surveillance testing of safety-critical subsystems',
      'Direct witness testing at manufacturer high-capacity test bed'
    ],
    keyRequirementsHi: [
      'तकनीकी डिजाइन दस्तावेजों का प्रकार परीक्षण',
      'मान्यता प्राप्त एजेंसी द्वारा फैक्ट्री उत्पादन नियंत्रण (FPC) ऑडिट',
      'सुरक्षा-महत्वपूर्ण सबसिस्टम का निगरानी परीक्षण',
      'निर्माता के उच्च क्षमता परीक्षण बेड पर प्रत्यक्ष परीक्षण'
    ],
    typicalProducts: [
      'Industrial Gas Turbines & Compressors',
      'Heavy Earth Moving Machinery',
      'High Voltage Switchgear Assemblies',
      'Large Commercial Boiler Systems',
      'Automated CNC Machine Centers'
    ],
    typicalProductsHi: [
      'औद्योगिक गैस टर्बाइन एवं कंप्रेसर',
      'भारी अर्थ मूविंग मशीनरी',
      'हाई वोल्टेज स्विचगियर असेंबली',
      'बड़े वाणिज्यिक बॉयलर सिस्टम',
      'स्वचालित सीएनसी मशीन केंद्र'
    ],
    timeline: 'Varies by equipment and assessment route; check BIS portal',
    timelineHi: 'उपकरण और मूल्यांकन प्रक्रिया के अनुसार भिन्न; BIS पोर्टल देखें',
    portalUrl: 'https://www.manakonline.in',
    icon: Wrench,
  }
];

export function CertificationSchemes({ language }: { language: Language }) {
  const [activeSchemeId, setActiveSchemeId] = useState('scheme-1');
  const activeScheme = SCHEMES.find(s => s.id === activeSchemeId) || SCHEMES[0];
  const isHi = language === 'hi';

  return (
    <div className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-950 border border-amber-300 text-[11px] font-mono font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>{isHi ? 'बीआईएस प्रमाणन ढांचा' : 'BIS Conformity Architecture'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-display">
            {isHi ? 'बीआईएस प्रमाणन योजनाएं (Conformity Schemes)' : 'BIS Certification Schemes Overview'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {isHi
              ? 'बीआईएस अनुरूपता मूल्यांकन विनियम, 2018 के तहत विभिन्न विनिर्माण श्रेणियों, आईटी इलेक्ट्रॉनिक्स और आयातित सामानों के लिए 4 प्रमुख योजनाएं।'
              : 'Under the BIS Conformity Assessment Regulations 2018, explore the 4 core certification schemes governing domestic manufacturing, IT electronics, and imports.'}
          </p>
        </div>

        <a
          href="https://www.services.bis.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-950 text-xs font-bold transition border border-slate-200 self-start sm:self-auto"
        >
          <span>{isHi ? 'आधिकारिक e-BIS पोर्टल' : 'Official e-BIS Portal'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Scheme Selection Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SCHEMES.map((scheme) => {
          const Icon = scheme.icon;
          const isSelected = activeSchemeId === scheme.id;
          return (
            <button
              key={scheme.id}
              onClick={() => setActiveSchemeId(scheme.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/25 ring-2 ring-amber-400/40'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">
                    {isHi ? 'चयनित' : 'Active'}
                  </span>
                )}
              </div>
              <div>
                <h3 className={`font-bold text-xs sm:text-sm font-display leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {isHi ? scheme.nameHi.split(':')[0] : scheme.name.split(':')[0]}
                </h3>
                <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-amber-100' : 'text-slate-500'}`}>
                  {isHi ? scheme.taglineHi : scheme.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Scheme Detailed Hardware Enclosure */}
      <div className="rounded-3xl border-2 border-amber-200/90 bg-gradient-to-b from-white via-amber-50/20 to-slate-50/60 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
              {activeScheme.id.toUpperCase()}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 font-display">
              {isHi ? activeScheme.nameHi : activeScheme.name}
            </h3>
            <p className="text-xs text-slate-600">
              {isHi ? activeScheme.taglineHi : activeScheme.tagline}
            </p>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-amber-200 text-xs shadow-2xs space-y-1 sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              {isHi ? 'प्रमाणन मार्क प्रकार' : 'Marking Identification'}
            </span>
            <span className="font-mono font-bold text-amber-900 block">
              {isHi ? activeScheme.markTypeHi : activeScheme.markType}
            </span>
          </div>
        </div>

        {/* Detailed Grid: Requirements vs Typical Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Key Compliance Requirements */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isHi ? 'अनिवार्य अनुपालन शर्तें' : 'Mandatory Compliance Requirements'}</span>
            </h4>
            <ul className="space-y-2.5 pt-1 text-slate-700">
              {(isHi ? activeScheme.keyRequirementsHi : activeScheme.keyRequirements).map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Typical Products & Sector Application */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>{isHi ? 'प्रमुख उत्पाद एवं कार्यक्षेत्र' : 'Typical Products & Sector Scope'}</span>
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {(isHi ? activeScheme.typicalProductsHi : activeScheme.typicalProducts).map((prod, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-800 text-xs shadow-2xs"
                >
                  {prod}
                </span>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-slate-600">
              <span className="font-semibold">{isHi ? 'प्रसंस्करण समय:' : 'Estimated Timeline:'}</span>
              <span className="font-bold text-amber-800">{isHi ? activeScheme.timelineHi : activeScheme.timeline}</span>
            </div>
          </div>
        </div>

        {/* Footer Link & Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">
            {isHi
              ? 'सभी आवेदन आधिकारिक manakonline.in पोर्टल के माध्यम से डिजिटल रूप से प्रोसेस होते हैं।'
              : 'All statutory applications are submitted directly on official government servers via manakonline.in.'}
          </span>
          <a
            href={activeScheme.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-amber-600/20"
          >
            <span>{isHi ? 'योजना पोर्टल पर जाएं' : 'Open Scheme Portal'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
