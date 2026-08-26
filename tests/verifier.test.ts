import { describe, it, expect } from 'vitest';
import { findVerifiedLicense, VERIFIED_BIS_LICENSES } from '../lib/license-database';

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

  it('should find verified authentic license for Bisleri Drinking Water', () => {
    const lic = findVerifiedLicense('5100087');
    expect(lic).not.toBeNull();
    expect(lic?.brand).toContain('Bisleri');
    expect(lic?.isNumber).toBe('IS 14543:2024');
  });

  it('should return null for fake or unregistered numbers (e.g. 11111111, 00000000)', () => {
    const fake1 = findVerifiedLicense('11111111');
    expect(fake1).toBeNull();

    const fake2 = findVerifiedLicense('00000000');
    expect(fake2).toBeNull();

    const fake3 = findVerifiedLicense('12345678');
    expect(fake3).toBeNull();
  });

  it('should contain verified licenses across all major categories', () => {
    expect(VERIFIED_BIS_LICENSES.length).toBeGreaterThanOrEqual(10);
    const categories = new Set(VERIFIED_BIS_LICENSES.map(l => l.category));
    expect(categories.has('Kitchen & Home Safety')).toBe(true);
    expect(categories.has('Food & Drinking Water')).toBe(true);
    expect(categories.has('Civil & Construction')).toBe(true);
    expect(categories.has('Electrical & Electronics')).toBe(true);
  });
});
