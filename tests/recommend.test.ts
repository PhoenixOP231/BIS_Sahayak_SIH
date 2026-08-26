import { describe, it, expect } from 'vitest';
import { searchHybridStandards } from '../lib/vector-store';
import { ALL_STANDARDS, getStandardById } from '../lib/standards-data';

describe('AI Recommendation Engine (SIH26108)', () => {
  it('should recommend IS 694 and IS 1293 for electrical wiring & plug procurement spec', async () => {
    const spec = 'Procurement of 5000 units of 16A 3-pin earthed plugs and sockets and 1.5 sq mm copper FR wiring cables';
    const matches = await searchHybridStandards(spec, 5);
    
    expect(matches.length).toBeGreaterThan(0);
    const isNumbers = matches.map(m => m.isNumber);
    const hasWiringOrPlug = isNumbers.some(n => n.includes('IS 694') || n.includes('IS 1293'));
    expect(hasWiringOrPlug).toBe(true);
  });

  it('should recommend IS 1786 and IS 269 for civil construction reinforcement tender', async () => {
    const spec = 'Supply of 200 MT Fe 500D TMT reinforcement rebars and 53 Grade Portland Cement';
    const matches = await searchHybridStandards(spec, 5);
    
    expect(matches.length).toBeGreaterThan(0);
    const isNumbers = matches.map(m => m.isNumber);
    const hasSteelOrCement = isNumbers.some(n => n.includes('IS 1786') || n.includes('IS 269'));
    expect(hasSteelOrCement).toBe(true);
  });
});
