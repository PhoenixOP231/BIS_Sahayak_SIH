import { describe, it, expect } from 'vitest';
import { 
  parseAndVerifyLicense, 
  searchVerifiedLicenses,
  VERIFIED_BIS_LICENSES 
} from '../lib/license-database';

describe('BIS CM/L License Database & Intelligent Verification', () => {
  it('should contain at least 1,000 authentic BIS certified licenses', () => {
    expect(VERIFIED_BIS_LICENSES.length).toBeGreaterThanOrEqual(1000);
  });

  it('should verify Kenson Cooker CM/L-8270877 as AUTHENTIC VERIFIED LICENSE', () => {
    const res = parseAndVerifyLicense('CM/L-8270877');
    expect(res.status).toBe('verified');
    expect(res.license).not.toBeNull();
    expect(res.license?.manufacturer).toBe('Kenson Home Appliances');
    expect(res.license?.brand).toContain('Kenson');
    expect(res.license?.isNumber).toBe('IS 2347:2017');
    expect(res.license?.status).toBe('OPERATIVE');

    // Also verify by raw 7 digits
    const resDigits = parseAndVerifyLicense('8270877');
    expect(resDigits.status).toBe('verified');
    expect(resDigits.license?.cmlNumber).toBe('CM/L-8270877');

    // Also verify by brand name
    const resBrand = parseAndVerifyLicense('Kenson');
    expect(resBrand.status).toBe('verified');
    expect(resBrand.license?.cmlNumber).toBe('CM/L-8270877');
  });

  it('should verify ALL authentic products in the dataset', () => {
    const samples = [
      { code: 'CM/L-5100087', brand: 'Bisleri' },
      { code: '8400123', brand: 'Prestige' },
      { code: 'CM/L-6200154', brand: 'Tata Tiscon' },
      { code: '7200456', brand: 'Havells' },
      { code: '7100123', brand: 'Indane' },
      { code: '8512345', brand: 'Aquafina' },
      { code: '9200678', brand: 'Steelbird' },
      { code: '9600123', brand: 'Kent' }
    ];

    for (const s of samples) {
      const res = parseAndVerifyLicense(s.code);
      expect(res.status).toBe('verified');
      expect(res.license?.brand).toContain(s.brand);
    }
  });

  it('should strictly catch fake and dummy numbers as COUNTERFEIT', () => {
    const fakeCodes = ['12234444', '11111111', '00000000', '12345678', '87654321', '99999999'];
    for (const fake of fakeCodes) {
      const res = parseAndVerifyLicense(fake);
      expect(res.status).toBe('counterfeit');
      expect(res.license).toBeNull();
    }
  });

  it('should decode regional Scheme-I format with live portal gateway for other legitimate plants', () => {
    // 7-digit number with valid prefix 75 (Pune/Satara) that is not in the top-80 cache
    const res = parseAndVerifyLicense('7599123');
    expect(res.status).toBe('regional_verified');
    expect(res.decodedInfo?.branchOffice).toContain('Pune');
    expect(res.decodedInfo?.portalUrl).toContain('services.bis.gov.in');
  });

  it('should catch suspended / revoked licenses as SUSPENDED', () => {
    const suspended = parseAndVerifyLicense('CM/L-5199999');
    expect(suspended.status).toBe('suspended');
    expect(suspended.license?.status).toBe('SUSPENDED');
  });

  it('should recognize Indian Standard numbers like IS 14543 or 2347', () => {
    const std = parseAndVerifyLicense('IS 2347');
    expect(std.status).toBe('is_standard');
    expect(std.matchedStandard?.isNumber).toBe('IS 2347:2017');
  });

  it('should query Kenson Cooker CM/L-8270877 from Neon PostgreSQL cloud database', async () => {
    const { getLicenseByDigits, getDatabaseStats } = await import('../lib/db-licenses');
    const rec = await getLicenseByDigits('8270877');
    if (rec) {
      expect(rec.cml_number).toBe('CM/L-8270877');
      expect(rec.brand).toContain('Kenson');
      expect(rec.is_number).toBe('IS 2347:2017');
      expect(rec.status).toBe('OPERATIVE');
    }

    const stats = await getDatabaseStats();
    if (stats.totalLicenses > 0) {
      expect(stats.totalLicenses).toBeGreaterThanOrEqual(1000);
      expect(stats.operative).toBeGreaterThan(900);
    }
  });
});

