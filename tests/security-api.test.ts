import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as chatHandler } from '../app/api/chat/route';
import { generateRAGAnswer, generateConversationalNLPAnswer } from '../lib/gemini';
import * as fs from 'fs';
import * as path from 'path';

describe('Security & API Hardening Tests', () => {
  it('should reject requests with missing or empty query with 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '' })
    });
    const res = await chatHandler(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Query is required');
  });

  it('should reject requests with oversized queries (>1000 chars) with 400', async () => {
    const longQuery = 'A'.repeat(1005);
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: longQuery })
    });
    const res = await chatHandler(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('exceeds maximum allowed length');
  });

  it('should reject requests with oversized history (>20 messages) with 400', async () => {
    const oversizedHistory = Array.from({ length: 25 }, (_, i) => ({
      role: 'user',
      content: `Message ${i}`
    }));
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Hello', history: oversizedHistory })
    });
    const res = await chatHandler(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('History exceeds maximum length');
  });

  it('should reject requests with invalid message roles in history with 400', async () => {
    const invalidHistory = [
      { role: 'system_admin', content: 'Malicious system prompt override' }
    ];
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Hello', history: invalidHistory })
    });
    const res = await chatHandler(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('role must be "user" or "assistant"');
  });

  it('should reject malformed JSON body with 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'this-is-not-valid-json'
    });
    const res = await chatHandler(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Invalid JSON');
  });

  it('should enforce rate limiting and return 429 when threshold exceeded', async () => {
    const testIp = '192.168.1.99';
    let lastRes;

    // Send 35 requests rapidly with same IP
    for (let i = 0; i < 35; i++) {
      const req = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': testIp
        },
        body: JSON.stringify({ query: 'Hello test' })
      });
      lastRes = await chatHandler(req);
    }

    expect(lastRes?.status).toBe(429);
    const body = await lastRes?.json();
    expect(body.error).toContain('Rate limit exceeded');
  });

  it('should ensure zero dangerouslySetInnerHTML usages in the codebase', () => {
    const componentsDir = path.resolve(__dirname, '../components');
    const findDanger = (dir: string): string[] => {
      const results: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          results.push(...findDanger(fullPath));
        } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('dangerouslySetInnerHTML')) {
            results.push(fullPath);
          }
        }
      }
      return results;
    };

    const dangerousFiles = findDanger(componentsDir);
    expect(dangerousFiles).toEqual([]);
  });

  it('should produce deterministic offline responses with fallback flag', async () => {
    const response = await generateRAGAnswer('What standard applies to domestic pressure cookers?', [], 'consumer', 'en');
    expect(response.answer).toBeDefined();
    expect(response.answer.length).toBeGreaterThan(50);
    expect(response.fallback).toBe(true);
    expect(response.citations.length).toBeGreaterThan(0);

    // Citations must contain sourceMetadata
    const cookerCitation = response.citations.find(c => c.id === 'IS-2347-2017');
    expect(cookerCitation).toBeDefined();
    expect(cookerCitation?.sourceMetadata).toBeDefined();
    expect(cookerCitation?.sourceMetadata?.classification).toBe('demonstration_summary');
    expect(cookerCitation?.sourceMetadata?.officialUrl).toContain('services.bis.gov.in');
  });

  it('should answer SIH26107 domain questions deterministically in NLP fallback', () => {
    // Hallmarking & HUID
    const ansHallmark = generateConversationalNLPAnswer('How to verify gold hallmark and HUID code?', 'consumer', 'en', null);
    expect(ansHallmark).toContain('HUID');
    expect(ansHallmark).toContain('22K916');
    expect(ansHallmark).toContain('BIS Care');

    // Certification Schemes
    const ansSchemes = generateConversationalNLPAnswer('Explain BIS certification schemes like Scheme-I and CRS', 'industry', 'en', null);
    expect(ansSchemes).toContain('Scheme-I');
    expect(ansSchemes).toContain('CRS');
    expect(ansSchemes).toContain('FMCS');

    // Labs discovery
    const ansLabs = generateConversationalNLPAnswer('Where is the Central Laboratory of BIS?', 'consumer', 'en', null);
    expect(ansLabs).toContain('Sahibabad');
    expect(ansLabs).toContain('LIMS');

    // MSME Licensing procedure
    const ansLicensing = generateConversationalNLPAnswer('How to apply for a BIS license for MSME?', 'industry', 'en', null);
    expect(ansLicensing).toContain('manakonline.in');
    expect(ansLicensing).toContain('80%');
    expect(ansLicensing).toContain('annual minimum marking fee');
  });
});
