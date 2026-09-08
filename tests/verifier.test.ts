import { describe, it, expect } from 'vitest';
import { 
  parseAndVerifyLicense, 
  searchVerifiedLicenses,
  VERIFIED_BIS_LICENSES 
} from '../lib/license-database';

describe('BIS CM/L License Database & Real vs Fake Detection', () => {
  it('should contain at least 70 authentic BIS certified licenses', () => {
    expect(VERIFIED_BIS_LICENSES.length).toBeGreaterThanOrEqual(70);
  });

  it('should verify ALL authentic product licenses in the database as verified', () => {
    // Every single operative license in the dataset must verify successfully
    const operativeLicenses = VERIFIED_BIS_LICENSES.filter(l => l.status === 'OPERATIVE');
    expect(operativeLicenses.length).toBeGreaterThanOrEqual(70);

    for (const lic of operativeLicenses) {
      const res = parseAndVerifyLicense(lic.cmlNumber);
      expect(res.status).toBe('verified');
      expect(res.license).not.toBeNull();
      expect(res.license?.brand).toBe(lic.brand);
      expect(res.license?.cmlNumber).toBe(lic.cmlNumber);

      // Also verify by raw digits
      const resDigits = parseAndVerifyLicense(lic.digits);
      expect(resDigits.status).toBe('verified');
      expect(resDigits.license?.cmlNumber).toBe(lic.cmlNumber);
    }
  });

  it('should verify popular brands by name', () => {
    const brands = ['Bisleri', 'Aquafina', 'Prestige', 'Hawkins', 'Tata Tiscon', 'Havells', 'Indane', 'Kent', 'Steelbird', 'UltraTech', 'Finolex'];
    for (const b of brands) {
      const res = parseAndVerifyLicense(b);
      expect(res.status).toBe('verified');
      expect(res.license).not.toBeNull();
    }
  });

  it('should catch the user reported fake number 12234444 as UNREGISTERED', () => {
    const res = parseAndVerifyLicense('12234444');
    expect(res.status).toBe('unregistered');
    expect(res.license).toBeNull();
    expect(res.message).toContain('NOT found in the official BIS certified registry');
  });

  it('should catch a wide variety of fake / unregistered 7 and 8-digit numbers as UNREGISTERED', () => {
    const fakeNumbers = [
      '12234444',
      '98765431',
      '55512345',
      '34567890',
      '99988877',
      '10203040',
      '77778888',
      '43218765',
      '88990011',
      '66554433',
      '78901234',
      '23456789',
      '91827364',
      '54321098'
    ];

    for (const fake of fakeNumbers) {
      const res = parseAndVerifyLicense(fake);
      expect(res.status).toBe('unregistered');
      expect(res.license).toBeNull();
      expect(res.message).toContain('NOT found');
    }
  });

  it('should catch dummy repeated and sequential test sequences as COUNTERFEIT', () => {
    const dummyNumbers = ['11111111', '00000000', '99999999', '22222222', '12345678', '87654321', '01234567'];
    for (const dummy of dummyNumbers) {
      const res = parseAndVerifyLicense(dummy);
      expect(res.status).toBe('counterfeit');
      expect(res.license).toBeNull();
      expect(res.message).toContain('dummy');
    }
  });

  it('should catch suspended / revoked licenses as SUSPENDED', () => {
    const suspended = parseAndVerifyLicense('CM/L-5199999');
    expect(suspended.status).toBe('suspended');
    expect(suspended.license?.status).toBe('SUSPENDED');
  });

  it('should catch IS standard codes as is_standard and guide the user', () => {
    const standards = ['IS 14543', '14543', 'IS 2347', '2347', 'IS 1786', 'IS 694', 'IS 3196'];
    for (const std of standards) {
      const res = parseAndVerifyLicense(std);
      expect(res.status).toBe('is_standard');
      expect(res.matchedStandard).toBeDefined();
    }
  });
});
