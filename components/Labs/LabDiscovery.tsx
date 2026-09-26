'use client';

import React, { useState, useMemo } from 'react';
import { FlaskConical, MapPin, Search, ExternalLink } from 'lucide-react';
import { Language } from '@/lib/translations';

interface LabRecord {
  id: string;
  name: string;
  nameHi: string;
  type: 'Central Reference Lab' | 'Regional Laboratory' | 'Branch Laboratory';
  typeHi: string;
  region: 'Central' | 'Western' | 'Eastern' | 'Southern' | 'Northern';
  regionHi: string;
  location: string;
  locationHi: string;
  address: string;
  addressHi: string;
  disciplines: string[];
  disciplinesHi: string[];
  sampleCapabilities: string[];
  sampleCapabilitiesHi: string[];
  contact: string;
}

const BIS_LABS: LabRecord[] = [
  {
    id: 'cl-sahibabad',
    name: 'Central Laboratory (CL), Sahibabad',
    nameHi: 'केंद्रीय प्रयोगशाला (CL), साहिबाबाद',
    type: 'Central Reference Lab',
    typeHi: 'केंद्रीय संदर्भ प्रयोगशाला',
    region: 'Central',
    regionHi: 'केंद्रीय',
    location: 'Ghaziabad, Uttar Pradesh (Delhi NCR)',
    locationHi: 'गाजियाबाद, उत्तर प्रदेश (दिल्ली एनसीआर)',
    address: 'Plot No. 20/9, Site IV, Sahibabad Industrial Area, Ghaziabad - 201010',
    addressHi: 'प्लॉट नं. 20/9, साइट IV, साहिबाबाद औद्योगिक क्षेत्र, गाजियाबाद - 201010',
    disciplines: ['Chemical', 'Electrical', 'Mechanical', 'Microbiological', 'Metallurgical'],
    disciplinesHi: ['रासायनिक', 'विद्युत', 'यांत्रिक', 'सूक्ष्मजैविक', 'धातुकर्म'],
    sampleCapabilities: [
      'Packaged Drinking Water & Food Products (IS 14543/10500)',
      'Domestic Appliances & Pressure Cookers (IS 2347/302)',
      'TMT Steel Bars & Wire Rods (IS 1786)',
      'Automotive Components & Protective Helmets (IS 4151)',
      'Cables & Conductors (IS 694/398)'
    ],
    sampleCapabilitiesHi: [
      'पैकेज्ड पेयजल एवं खाद्य उत्पाद (IS 14543/10500)',
      'घरेलू उपकरण एवं प्रेशर कुकर (IS 2347/302)',
      'TMT सरिया एवं स्टील (IS 1786)',
      'सुरक्षा हेलमेट एवं ऑटो पार्ट्स (IS 4151)',
      'केबल एवं कंडक्टर (IS 694/398)'
    ],
    contact: 'sample@bis.gov.in | +91-120-2811989'
  },
  {
    id: 'wrl-mumbai',
    name: 'Western Regional Laboratory (WRL), Mumbai',
    nameHi: 'पश्चिमी क्षेत्रीय प्रयोगशाला (WRL), मुंबई',
    type: 'Regional Laboratory',
    typeHi: 'क्षेत्रीय प्रयोगशाला',
    region: 'Western',
    regionHi: 'पश्चिमी',
    location: 'Mumbai, Maharashtra',
    locationHi: 'मुंबई, महाराष्ट्र',
    address: 'Manakalaya, E9, MIDC, Behind Marol Telephone Exchange, Andheri (East), Mumbai - 400093',
    addressHi: 'मानकालय, ई-9, एमआईडीसी, मरोल टेलीफोन एक्सचेंज के पीछे, अंधेरी (पूर्व), मुंबई - 400093',
    disciplines: ['Chemical', 'Electrical', 'Mechanical', 'Microbiological'],
    disciplinesHi: ['रासायनिक', 'विद्युत', 'यांत्रिक', 'सूक्ष्मजैविक'],
    sampleCapabilities: [
      'Petrochemicals, Polymers & Plastic Pipes (IS 4984)',
      'LPG Valves, Regulators & Domestic Cookware (IS 9798/2347)',
      'Packaged Drinking Water & Mineral Water (IS 14543)',
      'Switches, Plugs & Electrical Accessories (IS 3854)'
    ],
    sampleCapabilitiesHi: [
      'पेट्रोरसायन, पॉलिमर एवं प्लास्टिक पाइप (IS 4984)',
      'LPG वाल्व, रेगुलेटर एवं कुकवेयर (IS 9798/2347)',
      'पैकेज्ड पेयजल एवं मिनरल वाटर (IS 14543)',
      'स्विच, प्लग एवं विद्युत सहायक उपकरण (IS 3854)'
    ],
    contact: 'wrol@bis.gov.in | +91-22-28329295'
  },
  {
    id: 'erl-kolkata',
    name: 'Eastern Regional Laboratory (ERL), Kolkata',
    nameHi: 'पूर्वी क्षेत्रीय प्रयोगशाला (ERL), कोलकाता',
    type: 'Regional Laboratory',
    typeHi: 'क्षेत्रीय प्रयोगशाला',
    region: 'Eastern',
    regionHi: 'पूर्वी',
    location: 'Kolkata, West Bengal',
    locationHi: 'कोलकाता, पश्चिम बंगाल',
    address: '1/14, C.I.T. Scheme VII M, V.I.P. Road, Kankurgachi, Kolkata - 700054',
    addressHi: '1/14, सी.आई.टी. स्कीम VII M, वी.आई.पी. रोड, कंकुरगाछी, कोलकाता - 700054',
    disciplines: ['Chemical', 'Mechanical', 'Metallurgical', 'Microbiological'],
    disciplinesHi: ['रासायनिक', 'यांत्रिक', 'धातुकर्म', 'सूक्ष्मजैविक'],
    sampleCapabilities: [
      'Structural Steel, TMT Rebars & Wire Ropes (IS 1786/2062)',
      'Portland & Slag Cement (IS 1489/455)',
      'Jute Products & Textile Packaging (IS 12650)',
      'Packaged Drinking Water (IS 14543)'
    ],
    sampleCapabilitiesHi: [
      'संरचनात्मक स्टील, सरिया एवं तार रस्सियां (IS 1786/2062)',
      'सीमेंट एवं निर्माण सामग्री (IS 1489/455)',
      'जूट उत्पाद एवं कपड़ा पैकेजिंग (IS 12650)',
      'पैकेज्ड पेयजल (IS 14543)'
    ],
    contact: 'sample.erol@bis.gov.in | +91-33-23208561'
  },
  {
    id: 'srl-chennai',
    name: 'Southern Regional Laboratory (SRL), Chennai',
    nameHi: 'दक्षिणी क्षेत्रीय प्रयोगशाला (SRL), चेन्नई',
    type: 'Regional Laboratory',
    typeHi: 'क्षेत्रीय प्रयोगशाला',
    region: 'Southern',
    regionHi: 'दक्षिणी',
    location: 'Chennai, Tamil Nadu',
    locationHi: 'चेन्नई, तमिलनाडु',
    address: 'CIT Campus, IV Cross Road, Taramani, Chennai - 600113',
    addressHi: 'सीआईटी कैंपस, IV क्रॉस रोड, तारामणि, चेन्नई - 600113',
    disciplines: ['Chemical', 'Electrical', 'Mechanical', 'Microbiological'],
    disciplinesHi: ['रासायनिक', 'विद्युत', 'यांत्रिक', 'सूक्ष्मजैविक'],
    sampleCapabilities: [
      'Submersible Pumps & Agricultural Motors (IS 14220/9079)',
      'Automotive Tyres, Tubes & Safety Glass (IS 15633)',
      'Packaged Natural Mineral Water & Drinking Water',
      'Electronic Energy Meters & Power Distribution (IS 13779)'
    ],
    sampleCapabilitiesHi: [
      'सबमर्सिबल पंप एवं कृषि मोटर (IS 14220/9079)',
      'ऑटोमोटिव टायर एवं सुरक्षा ग्लास (IS 15633)',
      'प्राकृतिक मिनरल वाटर एवं पैकेज्ड पेयजल',
      'इलेक्ट्रॉनिक ऊर्जा मीटर (IS 13779)'
    ],
    contact: 'srol@bis.gov.in | +91-44-22541208'
  },
  {
    id: 'nrl-mohali',
    name: 'Northern Regional Laboratory (NRL), Mohali',
    nameHi: 'उत्तरी क्षेत्रीय प्रयोगशाला (NRL), मोहाली',
    type: 'Regional Laboratory',
    typeHi: 'क्षेत्रीय प्रयोगशाला',
    region: 'Northern',
    regionHi: 'उत्तरी',
    location: 'Mohali, Punjab (Chandigarh Tricity)',
    locationHi: 'मोहाली, पंजाब (चंडीगढ़)',
    address: 'B-69, Industrial Focal Point, Phase VII, Mohali - 160059',
    addressHi: 'बी-69, इंडस्ट्रियल फोकल पॉइंट, फेज VII, मोहाली - 160059',
    disciplines: ['Chemical', 'Mechanical', 'Electrical', 'Microbiological'],
    disciplinesHi: ['रासायनिक', 'यांत्रिक', 'विद्युत', 'सूक्ष्मजैविक'],
    sampleCapabilities: [
      'Agricultural Implements & Spraying Equipment (IS 3652)',
      'Safety Footwear & Protective Workwear (IS 15298)',
      'Sanitary Pipes, Fittings & Valves (IS 1239)',
      'Drinking Water & Packaged Beverages'
    ],
    sampleCapabilitiesHi: [
      'कृषि उपकरण एवं स्प्रेयर (IS 3652)',
      'सुरक्षा जूते एवं कार्य परिधान (IS 15298)',
      'सैनिटरी पाइप एवं वाल्व (IS 1239)',
      'पेयजल एवं पैकेज्ड पेय'
    ],
    contact: 'nrolsample@bis.gov.in | +91-172-4802676'
  },
  {
    id: 'bl-bengaluru',
    name: 'Branch Laboratory (BL), Bengaluru',
    nameHi: 'शाखा प्रयोगशाला (BL), बेंगलुरु',
    type: 'Branch Laboratory',
    typeHi: 'शाखा प्रयोगशाला',
    region: 'Southern',
    regionHi: 'दक्षिणी',
    location: 'Bengaluru, Karnataka',
    locationHi: 'बेंगलुरु, कर्नाटक',
    address: 'Peenya Industrial Area, 1st Stage, Tumkur Road, Bengaluru - 560058',
    addressHi: 'पीन्या औद्योगिक क्षेत्र, प्रथम चरण, तुमकुर रोड, बेंगलुरु - 560058',
    disciplines: ['Electrical', 'Electronics', 'Chemical'],
    disciplinesHi: ['विद्युत', 'इलेक्ट्रॉनिक्स', 'रासायनिक'],
    sampleCapabilities: [
      'IT & Telecommunication Hardware Testing (CRS Scheme)',
      'Transformers & Industrial Switchgear',
      'Domestic Appliances & Heating Elements (IS 302)',
      'Packaged Drinking Water Testing (IS 14543)'
    ],
    sampleCapabilitiesHi: [
      'आईटी एवं दूरसंचार हार्डवेयर परीक्षण (CRS योजना)',
      'ट्रांसफार्मर एवं स्विचगियर',
      'घरेलू विद्युत उपकरण (IS 302)',
      'पैकेज्ड पेयजल परीक्षण (IS 14543)'
    ],
    contact: 'bnbol@bis.gov.in | +91-80-29908860'
  }
];

export function LabDiscovery({ language }: { language: Language }) {
  const isHi = language === 'hi';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');

  const filteredLabs = useMemo(() => {
    return BIS_LABS.filter((lab) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lab.name.toLowerCase().includes(q) ||
        lab.nameHi.includes(q) ||
        lab.location.toLowerCase().includes(q) ||
        lab.disciplines.some((d) => d.toLowerCase().includes(q)) ||
        lab.sampleCapabilities.some((s) => s.toLowerCase().includes(q));

      const matchesRegion = selectedRegion === 'all' || lab.region === selectedRegion;
      const matchesDiscipline = selectedDiscipline === 'all' || lab.disciplines.includes(selectedDiscipline);

      return matchesSearch && matchesRegion && matchesDiscipline;
    });
  }, [searchQuery, selectedRegion, selectedDiscipline]);

  return (
    <div className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-950 border border-amber-300 text-[11px] font-mono font-semibold uppercase tracking-wider mb-2">
            <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
            <span>{isHi ? 'राष्ट्रीय परीक्षण प्रयोगशाला नेटवर्क' : 'National Testing Laboratory Network'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-display">
            {isHi ? 'आधिकारिक बीआईएस प्रयोगशाला खोज' : 'Official BIS Laboratory Directory & LIMS'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {isHi
              ? 'चुनिंदा BIS प्रयोगशालाओं के स्थान देखें। वर्तमान संपर्क और परीक्षण दायरा आधिकारिक LIMS निर्देशिका में जांचें।'
              : 'Explore selected BIS laboratories. Confirm current contacts and testing scope in the official LIMS directory.'}
          </p>
        </div>

        <a
          href="https://lims.bis.gov.in/home/bis_labs/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-950 text-xs font-bold transition border border-slate-200 self-start sm:self-auto"
        >
          <span>{isHi ? 'LIMS पोर्टल खोलें' : 'Open LIMS Sample Portal'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isHi
                ? 'उत्पाद (उदा. पानी, कुकर, सरिया), शहर, या परीक्षण श्रेणी खोजें...'
                : 'Search by product (e.g. water, cooker, TMT), location, or discipline...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white text-xs text-slate-900 border border-slate-200 focus:border-amber-500 rounded-xl outline-hidden transition"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl outline-hidden cursor-pointer"
          >
            <option value="all">{isHi ? 'सभी क्षेत्र (All Regions)' : 'All Regions'}</option>
            <option value="Central">{isHi ? 'केंद्रीय (Central NCR)' : 'Central (NCR)'}</option>
            <option value="Western">{isHi ? 'पश्चिमी (Western)' : 'Western'}</option>
            <option value="Eastern">{isHi ? 'पूर्वी (Eastern)' : 'Eastern'}</option>
            <option value="Southern">{isHi ? 'दक्षिणी (Southern)' : 'Southern'}</option>
            <option value="Northern">{isHi ? 'उत्तरी (Northern)' : 'Northern'}</option>
          </select>

          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl outline-hidden cursor-pointer"
          >
            <option value="all">{isHi ? 'सभी विषय (All Disciplines)' : 'All Disciplines'}</option>
            <option value="Chemical">{isHi ? 'रासायनिक (Chemical)' : 'Chemical'}</option>
            <option value="Mechanical">{isHi ? 'यांत्रिक (Mechanical)' : 'Mechanical'}</option>
            <option value="Electrical">{isHi ? 'विद्युत (Electrical)' : 'Electrical'}</option>
            <option value="Microbiological">{isHi ? 'सूक्ष्मजैविक (Microbiological)' : 'Microbiological'}</option>
            <option value="Metallurgical">{isHi ? 'धातुकर्म (Metallurgical)' : 'Metallurgical'}</option>
          </select>
        </div>
      </div>

      {/* Laboratory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLabs.map((lab) => (
          <div
            key={lab.id}
            className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 shadow-2xs"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-mono">
                  {isHi ? lab.typeHi : lab.type}
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  {isHi ? lab.regionHi : lab.region}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-950 font-display">
                  {isHi ? lab.nameHi : lab.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{isHi ? lab.locationHi : lab.location}</span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                {isHi ? lab.addressHi : lab.address}
              </div>

              {/* Disciplines Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(isHi ? lab.disciplinesHi : lab.disciplines).map((disc, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-mono text-[10px] font-semibold border border-amber-200/80"
                  >
                    {disc}
                  </span>
                ))}
              </div>

              {/* Sample Capabilities */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-700 block">
                  {isHi ? 'उदाहरण उत्पाद श्रेणियां (दायरा LIMS पर जांचें):' : 'Example product categories (confirm scope on LIMS):'}
                </span>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  {(isHi ? lab.sampleCapabilitiesHi : lab.sampleCapabilities).slice(0, 3).map((cap, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 truncate">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span className="truncate">{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="truncate">{lab.contact}</span>
              <a
                href="https://lims.bis.gov.in/home/bis_labs/"
                target="_blank"
                rel="noopener noreferrer"
                title="LIMS Tracking"
                className="text-amber-700 hover:text-amber-950 font-bold inline-flex items-center gap-1 shrink-0 ml-2"
              >
                <span>LIMS</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredLabs.length === 0 && (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
          <p className="text-xs font-bold text-slate-700">
            {isHi ? 'कोई प्रयोगशाला नहीं मिली' : 'No BIS Laboratories Match Your Filter'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('all');
              setSelectedDiscipline('all');
            }}
            className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
          >
            {isHi ? 'फ़िल्टर रीसेट करें' : 'Reset Search Filters'}
          </button>
        </div>
      )}

      {/* LIMS Information Note */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="font-bold block mb-0.5">
            {isHi ? 'LIMS: प्रयोगशाला सूचना प्रबंधन प्रणाली' : 'LIMS: Laboratory Information Management System'}
          </span>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            {isHi
              ? 'वर्तमान प्रयोगशाला संपर्क और परीक्षण दायरा आधिकारिक BIS LIMS निर्देशिका पर देखें।'
              : 'Check current laboratory contacts and authorized testing scope in the official BIS LIMS directory.'}
          </p>
        </div>
        <a
          href="https://lims.bis.gov.in/home/bis_labs/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 font-bold text-amber-900 hover:bg-amber-100 transition shrink-0"
        >
          {isHi ? 'e-BIS LIMS खोलें' : 'Access e-BIS LIMS'}
        </a>
      </div>
    </div>
  );
}
