import rawLicenses from '../data/licenses/verified-licenses.json';

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
  branchOffice?: string;
}

export interface VerificationResult {
  status: 'verified' | 'suspended' | 'unregistered' | 'counterfeit' | 'is_standard' | 'invalid';
  license: VerifiedLicense | null;
  inputNumber: string;
  matchedStandard?: {
    isNumber: string;
    title: string;
    category: string;
    id: string;
  } | null;
  message?: string;
}

export const VERIFIED_BIS_LICENSES: VerifiedLicense[] = rawLicenses as VerifiedLicense[];

// Map of common Indian Standards that users often type from product labels
export const INDIAN_STANDARDS_LOOKUP: Record<string, { isNumber: string; title: string; category: string; id: string }> = {
  '14543': { isNumber: 'IS 14543:2024', title: 'Packaged Drinking Water (Other than Natural Mineral Water)', category: 'Food & Drinking Water', id: 'IS-14543-2024' },
  '10500': { isNumber: 'IS 10500:2012', title: 'Drinking Water (Potable Piped Water) - Specification', category: 'Food & Drinking Water', id: 'IS-10500-2012' },
  '13428': { isNumber: 'IS 13428:2024', title: 'Packaged Natural Mineral Water - Specification', category: 'Food & Drinking Water', id: 'IS-14543-2024' },
  '2347': { isNumber: 'IS 2347:2017', title: 'Domestic Pressure Cookers - Specification', category: 'Kitchen & Home Safety', id: 'IS-2347-2017' },
  '1786': { isNumber: 'IS 1786:2008', title: 'High Strength Deformed Steel Bars (Fe 500D) for Concrete Reinforcement', category: 'Civil & Construction', id: 'IS-1786-2008' },
  '694': { isNumber: 'IS 694:2010', title: 'PVC Insulated Cables for Working Voltages up to 1100 V', category: 'Electrical & Electronics', id: 'IS-694-2010' },
  '1293': { isNumber: 'IS 1293:2019', title: 'Plugs and Socket-Outlets up to 250V and 16A', category: 'Electrical & Electronics', id: 'IS-1293-2019' },
  '3196': { isNumber: 'IS 3196 (Part 1):2013', title: 'Welded Low Carbon Steel Cylinders for LPG', category: 'Industrial Safety', id: 'IS-3196-Part-1-2013' },
  '9873': { isNumber: 'IS 9873 (Part 1):2019', title: 'Safety of Toys - Mechanical and Physical Properties', category: 'Child Safety & Toys', id: 'IS-9873-Part-1-2019' },
  '16018': { isNumber: 'IS 16018:2021', title: 'Helmets for Riders of Two-Wheeled Motor Vehicles', category: 'Consumer & Personal Safety', id: 'IS-16018-2021' },
  '269': { isNumber: 'IS 269:2015', title: 'Ordinary Portland Cement (33, 43 and 53 Grade)', category: 'Civil & Construction', id: 'IS-269-2015' },
  '4985': { isNumber: 'IS 4985:2021', title: 'Unplasticized PVC Pipes for Potable Water Supplies', category: 'Pipes & Fittings', id: 'IS-4985-2021' },
  '15298': { isNumber: 'IS 15298 (Part 2):2016', title: 'Safety Footwear with 200J Toecap', category: 'Personal Protective Equipment', id: 'IS-15298-Part-2-2016' },
  '16240': { isNumber: 'IS 16240:2023', title: 'Point-of-Use RO Water Treatment Systems', category: 'Food & Drinking Water', id: 'IS-16240-2023' },
  '15885': { isNumber: 'IS 15885 (Part 2/Sec 13):2012', title: 'Safety of Electronic Controlgear for LED Modules', category: 'Electrical & Electronics', id: 'IS-15885-Part-2-Sec-13-2012' },
  '15652': { isNumber: 'IS 15652:2006', title: 'Insulating Mats for Electrical Purposes', category: 'Electrical & Electronics', id: 'IS-15652-2006' },
  '15477': { isNumber: 'IS 15477:2019', title: 'Adhesives for Ceramic and Stone Tiles', category: 'Civil & Construction', id: 'IS-15477-2019' }
};

export function isDummyOrCounterfeitNumber(digits: string): boolean {
  // All identical digits like 1111111, 11111111, 00000000, 99999999
  if (/^(\d)\1+$/.test(digits)) return true;
  // Obvious sequential or dummy test numbers
  const dummyList = [
    '1234567', '12345678', '87654321', '7654321',
    '0123456', '01234567', '0000000', '1111111',
    '2222222', '3333333', '4444444', '5555555',
    '6666666', '7777777', '8888888', '9999999',
    '1212121', '12121212', '9876543'
  ];
  return dummyList.includes(digits);
}

export function parseAndVerifyLicense(input: string): VerificationResult {
  const clean = input.trim().toUpperCase();
  if (!clean) {
    return {
      status: 'invalid',
      license: null,
      inputNumber: '',
      message: 'Please enter a valid CM/L license number, brand name, or IS standard number.'
    };
  }

  const rawDigits = clean.replace(/[^0-9]/g, '');

  // 1. Check if user typed an Indian Standard Number (e.g. "14543", "IS 14543", "IS-10500", "IS 2347")
  if (INDIAN_STANDARDS_LOOKUP[rawDigits] && (clean.includes('IS') || rawDigits.length <= 5)) {
    const std = INDIAN_STANDARDS_LOOKUP[rawDigits];
    return {
      status: 'is_standard',
      license: null,
      inputNumber: std.isNumber,
      matchedStandard: std,
      message: `You entered the Indian Standard number (${std.isNumber}) for ${std.title}. Look directly underneath the ISI logo on your product for the 7 or 8-digit CM/L license number (e.g. CM/L-5100087).`
    };
  }

  // 2. Check if user typed a Brand / Manufacturer Name (e.g. "Bisleri", "Prestige", "Aquafina", "Tata Tiscon", "Anchor", "Indane", "Steelbird", "Kent")
  if (rawDigits.length < 5 && clean.length >= 3) {
    const brandMatch = VERIFIED_BIS_LICENSES.find(lic => 
      lic.brand.toUpperCase().includes(clean) || 
      lic.manufacturer.toUpperCase().includes(clean)
    );
    if (brandMatch) {
      return {
        status: brandMatch.status === 'SUSPENDED' ? 'suspended' : 'verified',
        license: brandMatch,
        inputNumber: brandMatch.cmlNumber
      };
    }
  }

  // 3. Format validation: must be 7 or 8 digits
  if (rawDigits.length !== 7 && rawDigits.length !== 8) {
    return {
      status: 'invalid',
      license: null,
      inputNumber: clean,
      message: 'CM/L license number must contain exactly 7 or 8 digits (e.g. CM/L-5100087 or 8400123). You can also search by brand name (e.g. "Bisleri", "Prestige", "Aquafina").'
    };
  }

  // 4. Check for known dummy / counterfeit test sequences
  if (isDummyOrCounterfeitNumber(rawDigits)) {
    return {
      status: 'counterfeit',
      license: null,
      inputNumber: `CM/L-${rawDigits}`,
      message: `The license number CM/L-${rawDigits} is a known fake / dummy sequence. Substandard products and counterfeit stamps carry serious safety and legal hazards under Section 29 of the BIS Act, 2016.`
    };
  }

  // 5. Look up in verified database of authentic BIS licenses
  const matched = VERIFIED_BIS_LICENSES.find(lic => lic.digits === rawDigits);
  if (matched) {
    if (matched.status === 'SUSPENDED') {
      return {
        status: 'suspended',
        license: matched,
        inputNumber: matched.cmlNumber,
        message: `WARNING: The license CM/L-${rawDigits} (${matched.brand}) was SUSPENDED / REVOKED by BIS for non-compliance. Do NOT purchase or distribute this product.`
      };
    }
    return {
      status: 'verified',
      license: matched,
      inputNumber: matched.cmlNumber
    };
  }

  // 6. STRICT VERIFICATION: If the 7 or 8-digit number does NOT exist in the database,
  // IT IS UNREGISTERED / POTENTIALLY COUNTERFEIT. Do NOT treat it as valid!
  return {
    status: 'unregistered',
    license: null,
    inputNumber: `CM/L-${rawDigits}`,
    message: `License CM/L-${rawDigits} was NOT found in the official BIS certified registry. If this number appears on a commercial product, it may be an uncertified, substandard, or counterfeit item violating mandatory Quality Control Orders (QCO).`
  };
}

export function findVerifiedLicense(query: string): VerifiedLicense | null {
  if (!query) return null;
  const digits = query.replace(/[^0-9]/g, '');
  if (!digits) return null;
  return VERIFIED_BIS_LICENSES.find(lic => lic.digits === digits) || null;
}

export function searchVerifiedLicenses(
  searchTerm?: string,
  categoryFilter?: string,
  statusFilter?: string
): VerifiedLicense[] {
  let results = [...VERIFIED_BIS_LICENSES];

  if (categoryFilter && categoryFilter !== 'all') {
    results = results.filter(lic => lic.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  if (statusFilter && statusFilter !== 'all') {
    results = results.filter(lic => lic.status.toLowerCase() === statusFilter.toLowerCase());
  }

  if (searchTerm && searchTerm.trim()) {
    const term = searchTerm.toLowerCase().trim();
    results = results.filter(lic => 
      lic.cmlNumber.toLowerCase().includes(term) ||
      lic.digits.includes(term) ||
      lic.brand.toLowerCase().includes(term) ||
      lic.manufacturer.toLowerCase().includes(term) ||
      lic.isNumber.toLowerCase().includes(term) ||
      lic.state.toLowerCase().includes(term) ||
      lic.factoryLocation.toLowerCase().includes(term)
    );
  }

  return results;
}
