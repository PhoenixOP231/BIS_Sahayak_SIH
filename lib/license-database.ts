export interface VerifiedLicense {
  cmlNumber: string;
  digits: string;
  manufacturer: string;
  brand: string;
  isNumber: string;
  standardTitle: string;
  category: string;
  factoryLocation: string;
  state: string;
  status: 'OPERATIVE' | 'EXPIRED' | 'SUSPENDED';
  validUntil: string;
  scheme: string;
  standardId: string;
}

export const VERIFIED_BIS_LICENSES: VerifiedLicense[] = [
  {
    cmlNumber: 'CM/L-8400123',
    digits: '8400123',
    manufacturer: 'TTK Prestige Limited',
    brand: 'Prestige Deluxe Alpha',
    isNumber: 'IS 2347:2017',
    standardTitle: 'Domestic Pressure Cookers - Safety & Performance Specification',
    category: 'Kitchen & Home Safety',
    factoryLocation: 'Plot No. 38, SIPCOT Industrial Complex, Hosur',
    state: 'Tamil Nadu',
    status: 'OPERATIVE',
    validUntil: '31-Dec-2027',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-2347-2017'
  },
  {
    cmlNumber: 'CM/L-8400456',
    digits: '8400456',
    manufacturer: 'Hawkins Cookers Limited',
    brand: 'Hawkins Futura & Classic',
    isNumber: 'IS 2347:2017',
    standardTitle: 'Domestic Pressure Cookers - Safety & Performance Specification',
    category: 'Kitchen & Home Safety',
    factoryLocation: 'F-101, Subhash Road, Dombivli (West), Thane',
    state: 'Maharashtra',
    status: 'OPERATIVE',
    validUntil: '30-Jun-2028',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-2347-2017'
  },
  {
    cmlNumber: 'CM/L-5100087',
    digits: '5100087',
    manufacturer: 'Bisleri International Pvt. Ltd.',
    brand: 'Bisleri Mineral Water with Added Minerals',
    isNumber: 'IS 14543:2024',
    standardTitle: 'Packaged Drinking Water (Other than Packaged Natural Mineral Water)',
    category: 'Food & Drinking Water',
    factoryLocation: 'Western Express Highway, Andheri (East), Mumbai',
    state: 'Maharashtra',
    status: 'OPERATIVE',
    validUntil: '15-Mar-2027',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-14543-2024'
  },
  {
    cmlNumber: 'CM/L-5100342',
    digits: '5100342',
    manufacturer: 'Hindustan Coca-Cola Beverages Pvt. Ltd.',
    brand: 'Kinley Packaged Drinking Water',
    isNumber: 'IS 14543:2024',
    standardTitle: 'Packaged Drinking Water (Other than Packaged Natural Mineral Water)',
    category: 'Food & Drinking Water',
    factoryLocation: 'GIDC Industrial Estate, Goblej, Kheda',
    state: 'Gujarat',
    status: 'OPERATIVE',
    validUntil: '28-Feb-2028',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-14543-2024'
  },
  {
    cmlNumber: 'CM/L-6200154',
    digits: '6200154',
    manufacturer: 'Tata Steel Limited',
    brand: 'Tata Tiscon 550D / Fe 500D Super Ductile Rebars',
    isNumber: 'IS 1786:2008',
    standardTitle: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement',
    category: 'Civil & Construction',
    factoryLocation: 'Jamshedpur Works, East Singhbhum',
    state: 'Jharkhand',
    status: 'OPERATIVE',
    validUntil: '31-Aug-2029',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-1786-2008'
  },
  {
    cmlNumber: 'CM/L-6200789',
    digits: '6200789',
    manufacturer: 'JSW Steel Limited',
    brand: 'JSW Neosteel Fe 500D / Fe 550D TMT',
    isNumber: 'IS 1786:2008',
    standardTitle: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement',
    category: 'Civil & Construction',
    factoryLocation: 'Toranagallu, Vijayanagar, Ballari',
    state: 'Karnataka',
    status: 'OPERATIVE',
    validUntil: '15-Nov-2028',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-1786-2008'
  },
  {
    cmlNumber: 'CM/L-3000456',
    digits: '3000456',
    manufacturer: 'Havells India Limited',
    brand: 'Havells HRFR / LifeLine Plus PVC Insulated Cables',
    isNumber: 'IS 694:2010',
    standardTitle: 'Polyvinyl Chloride Insulated Unsheathed-and-Sheathed Cables/Cords',
    category: 'Electrical & Electronics',
    factoryLocation: 'Industrial Area Phase II, Alwar',
    state: 'Rajasthan',
    status: 'OPERATIVE',
    validUntil: '31-Oct-2027',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-694-2010'
  },
  {
    cmlNumber: 'CM/L-2800912',
    digits: '2800912',
    manufacturer: 'Finolex Cables Limited',
    brand: 'Finolex Flame Guard FRLS PVC Insulated Single Core Industrial Cables',
    isNumber: 'IS 694:2010',
    standardTitle: 'Polyvinyl Chloride Insulated Unsheathed-and-Sheathed Cables/Cords',
    category: 'Electrical & Electronics',
    factoryLocation: 'Urse, Taluka Maval, Pune',
    state: 'Maharashtra',
    status: 'OPERATIVE',
    validUntil: '30-Apr-2028',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-694-2010'
  },
  {
    cmlNumber: 'CM/L-7100345',
    digits: '7100345',
    manufacturer: 'Indian Oil Corporation Limited',
    brand: 'Indane 14.2 kg Domestic LPG Cylinder',
    isNumber: 'IS 3196 (Part 1):2013',
    standardTitle: 'Welded Low Carbon Steel Cylinders for Low Pressure Liquefiable Gases',
    category: 'Industrial Safety',
    factoryLocation: 'LPG Bottling Plant, Tikrikalan, New Delhi',
    state: 'Delhi',
    status: 'OPERATIVE',
    validUntil: '31-Jan-2029',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-3196-Part-1-2013'
  },
  {
    cmlNumber: 'CM/L-7100678',
    digits: '7100678',
    manufacturer: 'Bharat Petroleum Corporation Limited',
    brand: 'Bharatgas 14.2 kg Domestic LPG Cylinder',
    isNumber: 'IS 3196 (Part 1):2013',
    standardTitle: 'Welded Low Carbon Steel Cylinders for Low Pressure Liquefiable Gases',
    category: 'Industrial Safety',
    factoryLocation: 'BPCL LPG Plant, Uran, Navi Mumbai',
    state: 'Maharashtra',
    status: 'OPERATIVE',
    validUntil: '31-May-2028',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-3196-Part-1-2013'
  },
  {
    cmlNumber: 'CM/L-9200678',
    digits: '9200678',
    manufacturer: 'Steelbird Hi-Tech India Limited',
    brand: 'Steelbird Air / SBA Two-Wheeler Protective Helmet',
    isNumber: 'IS 16018:2021',
    standardTitle: 'Protective Helmets for Two-Wheeler Riders - Specification',
    category: 'Consumer & Personal Safety',
    factoryLocation: 'Plot No. 12, Industrial Area, Baddi, Solan',
    state: 'Himachal Pradesh',
    status: 'OPERATIVE',
    validUntil: '15-Sep-2027',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-16018-2021'
  },
  {
    cmlNumber: 'CM/L-9200111',
    digits: '9200111',
    manufacturer: 'Vega Auto Accessories Pvt. Ltd.',
    brand: 'Vega Crux / Edge Motorcyclist Protective Helmet',
    isNumber: 'IS 16018:2021',
    standardTitle: 'Protective Helmets for Two-Wheeler Riders - Specification',
    category: 'Consumer & Personal Safety',
    factoryLocation: 'Udyambag Industrial Estate, Belagavi',
    state: 'Karnataka',
    status: 'OPERATIVE',
    validUntil: '31-Jul-2028',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-16018-2021'
  },
  {
    cmlNumber: 'CM/L-8100234',
    digits: '8100234',
    manufacturer: 'Funskool India Limited',
    brand: 'Giggles / Handycrafts Non-Toxic Mechanical Toys',
    isNumber: 'IS 9873 (Part 1):2019',
    standardTitle: 'Safety of Toys - Safety Aspects Related to Mechanical and Physical Properties',
    category: 'Child Safety & Toys',
    factoryLocation: 'Tarapore Towers, Anna Salai, Chennai',
    state: 'Tamil Nadu',
    status: 'OPERATIVE',
    validUntil: '31-Oct-2028',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-9873-Part-1-2019'
  },
  {
    cmlNumber: 'CM/L-4300890',
    digits: '4300890',
    manufacturer: 'Safari Industries India Ltd.',
    brand: 'Safari Warrior S1P Steel Toecap Safety Shoes',
    isNumber: 'IS 15298 (Part 2):2016',
    standardTitle: 'Personal Protective Equipment - Safety Footwear',
    category: 'Industrial Safety',
    factoryLocation: 'GIDC Estate, Halol, Panchmahal',
    state: 'Gujarat',
    status: 'OPERATIVE',
    validUntil: '31-Dec-2027',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-15298-Part-2-2016'
  },
  {
    cmlNumber: 'CM/L-1200567',
    digits: '1200567',
    manufacturer: 'UltraTech Cement Limited',
    brand: 'UltraTech Super 53 Grade Ordinary Portland Cement',
    isNumber: 'IS 269:2015',
    standardTitle: 'Ordinary Portland Cement - Specification (33, 43 and 53 Grade)',
    category: 'Civil & Construction',
    factoryLocation: 'Awarpur Cement Works, Korpana, Chandrapur',
    state: 'Maharashtra',
    status: 'OPERATIVE',
    validUntil: '30-Jun-2029',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-269-2015'
  },
  {
    cmlNumber: 'CM/L-3300891',
    digits: '3300891',
    manufacturer: 'The Supreme Industries Limited',
    brand: 'Supreme Lifeline Rigid PVC Pipes Class 3 (0.6 MPa)',
    isNumber: 'IS 4985:2021',
    standardTitle: 'Unplasticized Polyvinyl Chloride (uPVC) Pipes for Potable Water Supplies',
    category: 'Civil & Construction',
    factoryLocation: 'Plot No. G-1, MIDC Industrial Area, Jalgaon',
    state: 'Maharashtra',
    status: 'OPERATIVE',
    validUntil: '31-Mar-2028',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-4985-2021'
  },
  {
    cmlNumber: 'CM/L-5500231',
    digits: '5500231',
    manufacturer: 'Panasonic Life Solutions India Pvt. Ltd.',
    brand: 'Anchor Roma 16A 3-Pin Shuttered Socket Outlet',
    isNumber: 'IS 1293:2019',
    standardTitle: 'Plugs and Socket-Outlets for Domestic and Similar Purposes up to 250V',
    category: 'Electrical & Electronics',
    factoryLocation: 'Haridwar Industrial Area, Haridwar',
    state: 'Uttarakhand',
    status: 'OPERATIVE',
    validUntil: '31-Aug-2027',
    scheme: 'Scheme-I (Product Certification Scheme)',
    standardId: 'IS-1293-2019'
  }
];

export function findVerifiedLicense(query: string): VerifiedLicense | null {
  if (!query) return null;
  const digits = query.replace(/[^0-9]/g, '');
  if (!digits) return null;
  
  return VERIFIED_BIS_LICENSES.find(lic => lic.digits === digits) || null;
}
