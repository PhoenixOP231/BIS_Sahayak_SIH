import { describe, it, expect } from 'vitest';
import { 
  findVerifiedLicense, 
  parseAndVerifyLicense, 
  searchVerifiedLicenses,
  VERIFIED_BIS_LICENSES 
} from '../lib/license-database';

describe('BIS CM/L License Database & Verifier Registry', () => {
  it('should contain a comprehensive dataset of real BIS certified products (70+)', () => {
    expect(VERIFIED_BIS_LICENSES.length).toBeGreaterThanOrEqual(70);
  });

  it('should verify products across all major sectors', () => {
    // Water Bottles
    const bisleri = parseAndVerifyLicense('CM/L-5100087');
    expect(bisleri.status).toBe('verified');
    expect(bisleri.license?.brand).toContain('Bisleri');

    // Pressure Cookers
    const prestige = parseAndVerifyLicense('8400123');
    expect(prestige.status).toBe('verified');
    expect(prestige.license?.brand).toContain('Prestige');

    // Steel Rebars
    const steel = parseAndVerifyLicense('CM/L-6200154');
    expect(steel.status).toBe('verified');
    expect(steel.license?.manufacturer).toBe('Tata Steel Limited');

    // Electrical Cables
    const cables = parseAndVerifyLicense('7200456');
    expect(cables.status).toBe('verified');
    expect(cables.license?.brand).toContain('Havells');

    // LPG Cylinders
    const lpg = parseAndVerifyLicense('7100123');
    expect(lpg.status).toBe('verified');
    expect(lpg.license?.brand).toContain('Indane');

    // Helmets
    const helmet = parseAndVerifyLicense('9200678');
    expect(helmet.status).toBe('verified');
    expect(helmet.license?.brand).toContain('Steelbird');

    // Water Purifiers
    const kent = parseAndVerifyLicense('9600123');
    expect(kent.status).toBe('verified');
    expect(kent.license?.brand).toContain('Kent');
  });

  it('should allow searching and verifying directly by brand name', () => {
    const byBrand1 = parseAndVerifyLicense('Bisleri');
    expect(byBrand1.status).toBe('verified');
    expect(byBrand1.license?.cmlNumber).toBe('CM/L-5100087');

    const byBrand2 = parseAndVerifyLicense('Hawkins');
    expect(byBrand2.status).toBe('verified');
    expect(byBrand2.license?.brand).toContain('Hawkins');
  });

  it('should detect suspended / revoked licenses accurately', () => {
    const suspended = parseAndVerifyLicense('CM/L-5199999');
    expect(suspended.status).toBe('suspended');
    expect(suspended.license?.status).toBe('SUSPENDED');
  });

  it('should filter product registry by search term and category', () => {
    const waterProds = searchVerifiedLicenses('', 'Food & Drinking Water');
    expect(waterProds.length).toBeGreaterThanOrEqual(15);
    expect(waterProds.every(p => p.category === 'Food & Drinking Water')).toBe(true);

    const searchResults = searchVerifiedLicenses('Tata');
    expect(searchResults.length).toBeGreaterThanOrEqual(2);
    expect(searchResults.some(p => p.manufacturer.includes('Tata'))).toBe(true);
  });

  it('should flag fake / dummy test numbers (e.g. 11111111, 00000000, 12345678) as counterfeit', () => {
    const fake1 = parseAndVerifyLicense('11111111');
    expect(fake1.status).toBe('counterfeit');

    const fake2 = parseAndVerifyLicense('00000000');
    expect(fake2.status).toBe('counterfeit');

    const fake3 = parseAndVerifyLicense('12345678');
    expect(fake3.status).toBe('counterfeit');
  });

  it('should recognize Indian Standard numbers like IS 14543 or 2347', () => {
    const std = parseAndVerifyLicense('IS 14543');
    expect(std.status).toBe('is_standard');
    expect(std.matchedStandard?.isNumber).toBe('IS 14543:2024');
  });
});
