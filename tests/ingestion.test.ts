import { describe, it, expect } from 'vitest';
import { generateLocalEmbedding, chunkStandardDocument } from '../scripts/seed-standards';
import { ALL_STANDARDS, getStandardById } from '../lib/standards-data';
import { searchHybridStandards, computeCosineSimilarity } from '../lib/vector-store';

describe('BIS Standards Ingestion & Retrieval Pipeline', () => {
  it('should load all 21 seeded Indian Standards', () => {
    expect(ALL_STANDARDS.length).toBeGreaterThanOrEqual(15);
    const pressureCooker = getStandardById('IS-2347-2017');
    expect(pressureCooker).toBeDefined();
    expect(pressureCooker?.isNumber).toBe('IS 2347:2017');
  });

  it('should compute valid 768-dimensional normalized embeddings', () => {
    const text = 'Domestic pressure cookers burst pressure safety valve';
    const emb = generateLocalEmbedding(text);
    expect(emb.length).toBe(768);

    // Magnitude should be approximately 1.0 (unit vector)
    const norm = Math.sqrt(emb.reduce((sum, v) => sum + v * v, 0));
    expect(norm).toBeCloseTo(1.0, 2);
  });

  it('should chunk standard documents into scope, tests, and clauses', async () => {
    const doc = ALL_STANDARDS[0];
    const chunks = await chunkStandardDocument(doc);
    expect(chunks.length).toBeGreaterThanOrEqual(3);
    expect(chunks[0].clauseNumber).toBe('Scope');
  });

  it('should retrieve relevant standards using hybrid vector search', async () => {
    const results = await searchHybridStandards('LPG cylinder pressure burst test', 3);
    expect(results.length).toBeGreaterThan(0);
    const top = results[0];
    expect(top.isNumber).toContain('IS 3196');
  });
});
