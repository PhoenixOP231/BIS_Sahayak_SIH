import { describe, it, expect } from 'vitest';
import { 
  parseAndVerifyLicense, 
  searchVerifiedLicenses,
  resolveStandardId,
  VERIFIED_BIS_LICENSES 
} from '../lib/license-database';
import { ALL_STANDARDS, getStandardById } from '../lib/standards-data';

describe('Truthful BIS CM/L Verification & Safety Invariants', () => {
  it('should contain indexed demo records with isDemoData flag', () => {
    expect(VERIFIED_BIS_LICENSES.length).toBeGreaterThanOrEqual(1000);
    const first = VERIFIED_BIS_LICENSES[0];
    expect(first.isDemoData).toBe(true);
  });

  it('should return operative for genuine operative demo records', () => {
    const res = parseAndVerifyLicense('CM/L-8270877');
    expect(res.status).toBe('operative');
    expect(res.license).toBeDefined();
    expect(res.license?.manufacturer).toBe('Kenson Home Appliances');
    expect(res.license?.brand).toContain('Kenson');
    expect(res.license?.isNumber).toBe('IS 2347:2017');
    expect(res.license?.status).toBe('OPERATIVE');
    expect(res.isDemoData).toBe(true);

    // Also verify by raw digits
    const resDigits = parseAndVerifyLicense('8270877');
    expect(resDigits.status).toBe('operative');
    expect(resDigits.license?.cmlNumber).toBe('CM/L-8270877');

    // Also verify by brand name lookup
    const resBrand = parseAndVerifyLicense('Kenson');
    expect(resBrand.status).toBe('operative');
    expect(resBrand.license?.cmlNumber).toBe('CM/L-8270877');
  });

  it('should NEVER treat an unknown 7/8-digit number as verified', () => {
    // 7-digit number not in local demo index
    const res7 = parseAndVerifyLicense('7599123');
    expect(res7.status).toBe('format_valid_unverified');
    expect(res7.status).not.toBe('operative');
    expect(res7.status).not.toBe('verified');
    expect(res7.license).toBeUndefined();
    expect(res7.message).toContain('cannot confirm its authenticity or branch office');
    expect(res7.message).toContain('BIS Care');

    // 8-digit plausible number not in local demo index
    const res8 = parseAndVerifyLicense('84991234');
    expect(res8.status).toBe('format_valid_unverified');
    expect(res8.status).not.toBe('operative');
    expect(res8.license).toBeUndefined();
  });

  it('rejects extra characters around a CM/L number', () => {
    expect(parseAndVerifyLicense('abc8270877').status).toBe('invalid');
    expect(parseAndVerifyLicense('CM/L-8270877x').status).toBe('invalid');
  });

  it('should identify suspended demo licenses as suspended and NEVER operative', () => {
    const suspended = parseAndVerifyLicense('CM/L-5199999');
    expect(suspended.status).toBe('suspended');
    expect(suspended.status).not.toBe('operative');
    expect(suspended.license?.status).toBe('SUSPENDED');
    expect(suspended.message).toContain('SUSPENDED');
  });

  it('should identify expired demo licenses as expired and NEVER operative', () => {
    const expired = parseAndVerifyLicense('CM/L-8399999');
    expect(expired.status).toBe('expired');
    expect(expired.status).not.toBe('operative');
    expect(expired.license?.status).toBe('EXPIRED');
    expect(expired.message).toContain('EXPIRED');
  });

  it('should identify cancelled demo licenses as cancelled and NEVER operative', () => {
    const cancelled = parseAndVerifyLicense('CM/L-8499999');
    expect(cancelled.status).toBe('cancelled');
    expect(cancelled.status).not.toBe('operative');
    expect(cancelled.license?.status).toBe('CANCELLED');
    expect(cancelled.message).toContain('CANCELLED');
  });

  it('should flag repeating or sequential numbers as suspicious_pattern without false criminal accusations', () => {
    const suspiciousCodes = ['11111111', '00000000', '12345678', '87654321', '99999999', '1234567', '7654321'];
    for (const code of suspiciousCodes) {
      const res = parseAndVerifyLicense(code);
      expect(res.status).toBe('suspicious_pattern');
      expect(res.license).toBeUndefined();
      expect(res.message).toContain('pattern');
      expect(res.message).toContain('BIS Care');
    }
  });

  it('should recognize Indian Standard numbers like IS 14543 or IS 2347', () => {
    const std = parseAndVerifyLicense('IS 2347');
    expect(std.status).toBe('is_standard');
    expect(std.matchedStandard?.isNumber).toBe('IS 2347:2017');
    expect(std.matchedStandard?.id).toBe('IS-2347-2017');

    const stdWater = parseAndVerifyLicense('IS 14543');
    expect(stdWater.status).toBe('is_standard');
    expect(stdWater.matchedStandard?.isNumber).toBe('IS 14543:2024');
  });

  it('should return invalid for malformed or non-compliant queries', () => {
    const resInvalid = parseAndVerifyLicense('12345');
    expect(resInvalid.status).toBe('invalid');
    expect(resInvalid.message).toContain('7 or 8 digits');
  });

  it('should filter directory by status truthfully (OPERATIVE, EXPIRED, SUSPENDED, CANCELLED)', () => {
    const operativeList = searchVerifiedLicenses('', 'all', 'OPERATIVE');
    expect(operativeList.length).toBeGreaterThan(0);
    expect(operativeList.every(l => l.status === 'OPERATIVE')).toBe(true);

    const suspendedList = searchVerifiedLicenses('', 'all', 'SUSPENDED');
    expect(suspendedList.length).toBeGreaterThan(0);
    expect(suspendedList.every(l => l.status === 'SUSPENDED')).toBe(true);

    const expiredList = searchVerifiedLicenses('', 'all', 'EXPIRED');
    expect(expiredList.length).toBeGreaterThan(0);
    expect(expiredList.every(l => l.status === 'EXPIRED')).toBe(true);

    const cancelledList = searchVerifiedLicenses('', 'all', 'CANCELLED');
    expect(cancelledList.length).toBeGreaterThan(0);
    expect(cancelledList.every(l => l.status === 'CANCELLED')).toBe(true);
  });

  it('should strictly return undefined for unknown standard IDs and undefined inputs', () => {
    expect(getStandardById(undefined)).toBeUndefined();
    expect(getStandardById(null)).toBeUndefined();
    expect(getStandardById('undefined')).toBeUndefined();
    expect(getStandardById('null')).toBeUndefined();
    expect(getStandardById('non-existent-standard-12345')).toBeUndefined();

    expect(resolveStandardId(undefined)).toBeUndefined();
    expect(resolveStandardId(null)).toBeUndefined();
    expect(resolveStandardId('undefined')).toBeUndefined();
    expect(resolveStandardId('unknown-standard')).toBeUndefined();

    // Valid standard lookup
    const cookerStd = getStandardById('IS-2347-2017');
    expect(cookerStd).toBeDefined();
    expect(cookerStd?.id).toBe('IS-2347-2017');
    expect(cookerStd?.title).toContain('Cookers');
    expect(cookerStd?.sourceMetadata).toBeDefined();
    expect(cookerStd?.sourceMetadata?.officialUrl).toContain('services.bis.gov.in');
    expect(cookerStd?.sourceMetadata?.classification).toBe('demonstration_summary');
  });

  it('should have complete sourceMetadata across all 21 standards in the dataset', () => {
    expect(ALL_STANDARDS.length).toBeGreaterThanOrEqual(21);
    for (const std of ALL_STANDARDS) {
      expect(std.sourceMetadata).toBeDefined();
      expect(std.sourceMetadata?.officialUrl).toContain('services.bis.gov.in');
      expect(std.sourceMetadata?.editionYear).toBeDefined();
      expect(std.sourceMetadata?.clausePageReference).toBeDefined();
      expect(std.sourceMetadata?.retrievalDate).toBe('2026-09-22');
      expect(std.sourceMetadata?.classification).toBe('demonstration_summary');
    }
  });
});
