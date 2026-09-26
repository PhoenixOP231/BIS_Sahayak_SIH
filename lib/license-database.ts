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
  status: 'OPERATIVE' | 'EXPIRED' | 'SUSPENDED' | 'CANCELLED';
  validUntil: string;
  scheme: string;
  standardId: string;
  branchOffice?: string;
  isDemoData?: boolean;
}

export type VerificationStatus =
  | 'verified'                 // Deprecated alias for operative
  | 'format_valid_unverified'  // Valid 7 or 8-digit format, but unverified (requires BIS Care/e-BIS check)
  | 'operative'                // Found in local demonstration dataset with OPERATIVE status
  | 'expired'                  // Found in dataset with EXPIRED status
  | 'suspended'                // Found in dataset with SUSPENDED status
  | 'cancelled'                // Found in dataset with CANCELLED status
  | 'suspicious_pattern'       // Repeated or sequential test pattern (e.g. 11111111, 12345678)
  | 'is_standard'              // User entered an IS standard code instead of a CM/L number
  | 'invalid';                 // Malformed input

export interface VerificationResult {
  status: VerificationStatus;
  license?: VerifiedLicense;
  inputNumber: string;
  matchedStandard?: {
    isNumber: string;
    title: string;
    category: string;
    id: string;
  };
  formatNotice?: string;
  authoritativeStep?: string;
  portalUrl?: string;
  message?: string;
  isDemoData?: boolean;
}

export const VERIFIED_BIS_LICENSES: VerifiedLicense[] = (rawLicenses as VerifiedLicense[]).map(lic => ({
  ...lic,
  isDemoData: true
}));

// Map of common Indian Standards that users often type from product labels
export const INDIAN_STANDARDS_LOOKUP: Record<string, { isNumber: string; title: string; category: string; id: string }> = {
  '14543': { isNumber: 'IS 14543:2024', title: 'Packaged Drinking Water (Other than Natural Mineral Water)', category: 'Food & Drinking Water', id: 'IS-14543-2024' },
  '10500': { isNumber: 'IS 10500:2012', title: 'Drinking Water (Potable Piped Water) - Specification', category: 'Food & Drinking Water', id: 'IS-10500-2012' },
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

export function resolveStandardId(isNumber?: string | null): string | undefined {
  if (!isNumber || isNumber === 'undefined' || isNumber === 'null') return undefined;
  const clean = isNumber.toUpperCase().trim();
  for (const [key, val] of Object.entries(INDIAN_STANDARDS_LOOKUP)) {
    if (clean.includes(key)) {
      return val.id;
    }
  }
  return undefined;
}

export function resolveStandardTitle(isNumber?: string, fallbackTitle?: string): string {
  if (!isNumber) return 'Domestic Pressure Cookers — Specification';
  const clean = isNumber.toUpperCase().trim();
  for (const [key, val] of Object.entries(INDIAN_STANDARDS_LOOKUP)) {
    if (clean.includes(key)) {
      return val.title;
    }
  }
  return fallbackTitle || `${isNumber} Specification`;
}

// Check if a number matches an invalid, dummy, or suspicious test pattern
export function isSuspiciousTestPattern(digits: string): boolean {
  // All identical digits like 1111111, 11111111, 00000000, 99999999
  if (/^(\d)\1+$/.test(digits)) return true;

  // Obvious sequential or dummy test numbers
  const testPatterns = [
    '1234567', '12345678', '87654321', '7654321',
    '0123456', '01234567', '0000000', '1111111',
    '2222222', '3333333', '4444444', '5555555',
    '6666666', '7777777', '8888888', '9999999',
    '1212121', '12121212', '9876543', '12234444',
    '1231231', '12312312', '88889999', '00001111'
  ];
  return testPatterns.includes(digits);
}

// Backwards compatibility alias
export const isDummyOrCounterfeitNumber = isSuspiciousTestPattern;

export function parseAndVerifyLicense(input: string): VerificationResult {
  const clean = input.trim().toUpperCase();
  if (!clean) {
    return {
      status: 'invalid',
      inputNumber: '',
      isDemoData: true,
      message: 'Please enter a valid CM/L license number, brand name, or IS standard number.'
    };
  }

  const rawDigits = clean.replace(/[^0-9]/g, '');
  const licenseDigits = /^(?:CM\/L[\s-]*)?(\d{7,8})$/.exec(clean)?.[1];

  // 1. Check if user typed an Indian Standard Number (e.g. "14543", "IS 14543", "IS-10500", "IS 2347")
  if (INDIAN_STANDARDS_LOOKUP[rawDigits] && (clean.includes('IS') || rawDigits.length <= 5)) {
    const std = INDIAN_STANDARDS_LOOKUP[rawDigits];
    return {
      status: 'is_standard',
      inputNumber: std.isNumber,
      matchedStandard: std,
      isDemoData: true,
      authoritativeStep: 'Verify CM/L licence under ISI mark using BIS Care Mobile App',
      portalUrl: 'https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails',
      message: `You entered the Indian Standard number (${std.isNumber}) for ${std.title}. Look directly underneath the ISI logo on your product for the 7 or 8-digit CM/L license number (e.g. CM/L-8270877).`
    };
  }

  // 2. Direct brand name query lookup in demonstration dataset
  if (!clean.startsWith('CM/L') && rawDigits.length < 7) {
    const brandMatch = VERIFIED_BIS_LICENSES.find(lic => 
      lic.brand.toUpperCase().includes(clean) || 
      lic.manufacturer.toUpperCase().includes(clean)
    );
    if (brandMatch) {
      if (brandMatch.status === 'EXPIRED') {
        return {
          status: 'expired',
          license: brandMatch,
          inputNumber: brandMatch.cmlNumber,
          isDemoData: true,
          authoritativeStep: 'Verify current renewal status on official BIS Care App',
          portalUrl: 'https://www.services.bis.gov.in',
          message: `Notice: Demonstration record for ${brandMatch.brand} (${brandMatch.cmlNumber}) is listed as EXPIRED. Products manufactured after expiry are not certified.`
        };
      }
      if (brandMatch.status === 'SUSPENDED') {
        return {
          status: 'suspended',
          license: brandMatch,
          inputNumber: brandMatch.cmlNumber,
          isDemoData: true,
          authoritativeStep: 'Verify suspension / revocation status on official BIS Care App',
          portalUrl: 'https://www.services.bis.gov.in',
          message: `WARNING: Demonstration record for ${brandMatch.brand} (${brandMatch.cmlNumber}) is marked as SUSPENDED in this dataset. Confirm its current status with BIS.`
        };
      }
      if (brandMatch.status === 'CANCELLED') {
        return {
          status: 'cancelled',
          license: brandMatch,
          inputNumber: brandMatch.cmlNumber,
          isDemoData: true,
          authoritativeStep: 'Verify cancellation status on official BIS Care App',
          portalUrl: 'https://www.services.bis.gov.in',
          message: `WARNING: Demonstration record for ${brandMatch.brand} (${brandMatch.cmlNumber}) is marked as CANCELLED in this dataset. Confirm its current status with BIS.`
        };
      }
      return {
        status: 'operative',
        license: brandMatch,
        inputNumber: brandMatch.cmlNumber,
        isDemoData: true,
        authoritativeStep: 'Cross-check real-time operative status on official BIS Care App or e-BIS',
        portalUrl: 'https://www.services.bis.gov.in',
        message: `Demonstration record: ${brandMatch.brand} (${brandMatch.cmlNumber}) is indexed as OPERATIVE in our demonstration dataset. Confirm on official BIS Care App.`
      };
    }
  }

  // 3. Format validation: must be 7 or 8 digits
  if (!licenseDigits) {
    return {
      status: 'invalid',
      inputNumber: clean,
      isDemoData: true,
      message: 'CM/L license number must contain exactly 7 or 8 digits (e.g. CM/L-8270877, CM/L-5100087, or 8400123). You can also search by brand name.'
    };
  }

  // 4. Check for known dummy / test / suspicious patterns
  if (isSuspiciousTestPattern(licenseDigits)) {
    return {
      status: 'suspicious_pattern',
      inputNumber: `CM/L-${rawDigits}`,
      isDemoData: true,
      authoritativeStep: 'Inspect physical packaging and verify on official BIS Care Mobile App',
      portalUrl: 'https://www.services.bis.gov.in',
      message: `The license number CM/L-${rawDigits} matches an invalid or suspicious test pattern. This is not confirmed as an authentic licence. Please verify packaging and cross-check on the official BIS Care Mobile App.`
    };
  }

  // 5. Look up in demonstration dataset of BIS licenses
  const matched = VERIFIED_BIS_LICENSES.find(lic => lic.digits === licenseDigits);
  if (matched) {
    if (matched.status === 'EXPIRED') {
      return {
        status: 'expired',
        license: matched,
        inputNumber: matched.cmlNumber,
        isDemoData: true,
        authoritativeStep: 'Verify renewal status on official BIS Care App',
        portalUrl: 'https://www.services.bis.gov.in',
        message: `Notice: Demonstration record for CM/L-${rawDigits} (${matched.brand}) is listed as EXPIRED. Products manufactured after expiry are not certified.`
      };
    }
    if (matched.status === 'SUSPENDED') {
      return {
        status: 'suspended',
        license: matched,
        inputNumber: matched.cmlNumber,
        isDemoData: true,
        authoritativeStep: 'Verify suspension notice on official BIS Care App',
        portalUrl: 'https://www.services.bis.gov.in',
        message: `WARNING: Demonstration record for CM/L-${rawDigits} (${matched.brand}) is marked as SUSPENDED in this dataset. Confirm its current status with BIS.`
      };
    }
    if (matched.status === 'CANCELLED') {
      return {
        status: 'cancelled',
        license: matched,
        inputNumber: matched.cmlNumber,
        isDemoData: true,
        authoritativeStep: 'Verify cancellation notice on official BIS Care App',
        portalUrl: 'https://www.services.bis.gov.in',
        message: `WARNING: Demonstration record for CM/L-${rawDigits} (${matched.brand}) is marked as CANCELLED in this dataset. Confirm its current status with BIS.`
      };
    }
    return {
      status: 'operative',
      license: matched,
      inputNumber: matched.cmlNumber,
      isDemoData: true,
      authoritativeStep: 'Confirm live operative validity on official BIS Care App (com.bis.bisapp)',
      portalUrl: 'https://www.services.bis.gov.in',
      message: `Demonstration record: CM/L-${rawDigits} (${matched.brand}) is listed as OPERATIVE in our prototype dataset. For official real-time verification, check the BIS Care Mobile App.`
    };
  }

  // 6. Unknown 7/8-digit number: plausible length, but UNVERIFIED
  // Never treat an unknown number as verified!
  return {
    status: 'format_valid_unverified',
    inputNumber: `CM/L-${rawDigits}`,
    isDemoData: true,
    authoritativeStep: 'Check licence details on official BIS Care Mobile App or e-BIS portal',
    portalUrl: 'https://www.services.bis.gov.in',
    formatNotice: 'This number has a plausible 7 or 8-digit length. That does not prove a BIS licence exists.',
    message: `CM/L-${rawDigits} has a plausible number length but is not present in this demonstration dataset. This tool cannot confirm its authenticity or branch office. Check the official BIS Care Mobile App or e-BIS portal for current licence details.`
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
