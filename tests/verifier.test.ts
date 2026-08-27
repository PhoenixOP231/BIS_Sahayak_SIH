import { describe, it, expect } from 'vitest';
import { 
  findVerifiedLicense, 
  parseAndVerifyLicense, 
  VERIFIED_BIS_LICENSES 
} from '../lib/license-database';

describe('BIS CM/L License Database & Verifier', () => {
  it('should find verified authentic license for Prestige Cookers', () => {
    const lic = findVerifiedLicense('8400123');
    expect(lic).not.toBeNull();
    expect(lic?.manufacturer).toBe('TTK Prestige Limited');
    expect(lic?.isNumber).toBe('IS 2347:2017');
    expect(lic?.status).toBe('OPERATIVE');
  });

  it('should find verified authentic license for Tata Tiscon Steel', () => {
    const lic = findVerifiedLicense('CM/L-6200154');
    expect(lic).not.toBeNull();
    expect(lic?.manufacturer).toBe('Tata Steel Limited');
    expect(lic?.isNumber).toBe('IS 1786:2008');
  });

  it('should verify major water bottles like Bisleri, Aquafina, Kinley, Rail Neer', () => {
    const bisleri = parseAndVerifyLicense('CM/L-5100087');
    expect(bisleri.status).toBe('verified');
    expect(bisleri.license?.brand).toContain('Bisleri');
    expect(bisleri.license?.isNumber).toBe('IS 14543:2024');

    const aquafina = parseAndVerifyLicense('8512345');
    expect(aquafina.status).toBe('verified');
    expect(aquafina.license?.brand).toContain('Aquafina');

    const kinley = parseAndVerifyLicense('CM/L-5100342');
    expect(kinley.status).toBe('verified');
    expect(kinley.license?.brand).toContain('Kinley');

    const railneer = parseAndVerifyLicense('5200142');
    expect(railneer.status).toBe('verified');
    expect(railneer.license?.brand).toContain('Rail Neer');
  });

  it('should recognize Indian Standard numbers like IS 14543 or 14543 from bottle labels', () => {
    const std1 = parseAndVerifyLicense('IS 14543');
    expect(std1.status).toBe('is_standard');
    expect(std1.matchedStandard?.isNumber).toBe('IS 14543:2024');

    const std2 = parseAndVerifyLicense('14543');
    expect(std2.status).toBe('is_standard');
    expect(std2.matchedStandard?.isNumber).toBe('IS 14543:2024');

    const std3 = parseAndVerifyLicense('IS 10500');
    expect(std3.status).toBe('is_standard');
    expect(std3.matchedStandard?.isNumber).toBe('IS 10500:2012');
  });

  it('should decode regional bottling plant 7/8-digit Scheme-I licenses', () => {
    const regional = parseAndVerifyLicense('CM/L-7489123');
    expect(regional.status).toBe('regional_valid');
    expect(regional.decodedInfo?.branchOffice).toContain('Pune');
  });

  it('should detect counterfeit / dummy test numbers (e.g. 11111111, 00000000)', () => {
    const fake1 = parseAndVerifyLicense('11111111');
    expect(fake1.status).toBe('counterfeit');

    const fake2 = parseAndVerifyLicense('00000000');
    expect(fake2.status).toBe('counterfeit');

    const fake3 = parseAndVerifyLicense('12345678');
    expect(fake3.status).toBe('counterfeit');
  });

  it('should mark invalid short inputs as invalid format', () => {
    const invalid = parseAndVerifyLicense('123');
    expect(invalid.status).toBe('invalid');
  });
});
