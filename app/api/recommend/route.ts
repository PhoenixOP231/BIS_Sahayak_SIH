import { NextRequest, NextResponse } from 'next/server';
import { searchHybridStandards } from '@/lib/vector-store';
import { ALL_STANDARDS, StandardDoc, getStandardById } from '@/lib/standards-data';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface RecommendationResult {
  id: string;
  isNumber: string;
  title: string;
  titleHi?: string;
  category: string;
  sector: string;
  status: string;
  qcoOrder?: string;
  confidenceScore: number;
  reason: string;
  reasonHi: string;
  keyClauses: string[];
  mandatoryTests: string[];
  hsCodes: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { specText, sector, language = 'en' } = body;

    if (!specText || typeof specText !== 'string' || !specText.trim()) {
      return NextResponse.json(
        { error: 'Product specification or procurement requirement text is required' },
        { status: 400 }
      );
    }

    // Step 1: Hybrid vector search against all standards
    const retrieved = await searchHybridStandards(specText, 6);

    // Group retrieved chunks by standard
    const standardMap = new Map<string, { std: StandardDoc; score: number; matchedClauses: string[] }>();

    for (const r of retrieved) {
      const std = r.standard || getStandardById(r.standardId) || getStandardById(r.isNumber);
      if (std) {
        if (!standardMap.has(std.id)) {
          standardMap.set(std.id, { std, score: r.score, matchedClauses: [r.clauseNumber].filter(Boolean) });
        } else {
          const curr = standardMap.get(std.id)!;
          curr.score = Math.max(curr.score, r.score);
          if (r.clauseNumber && !curr.matchedClauses.includes(r.clauseNumber)) {
            curr.matchedClauses.push(r.clauseNumber);
          }
        }
      }
    }

    // Fallback: If vector matches are sparse, do broad keyword search across all standards
    if (standardMap.size < 2) {
      const tokens = specText.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 3);
      for (const std of ALL_STANDARDS) {
        if (!standardMap.has(std.id)) {
          let count = 0;
          const fullText = (std.title + ' ' + std.scope + ' ' + std.category + ' ' + std.sector).toLowerCase();
          for (const t of tokens) {
            if (fullText.includes(t)) count++;
          }
          if (count > 0) {
            standardMap.set(std.id, { std, score: Math.min(0.5 + count * 0.1, 0.95), matchedClauses: ['Scope'] });
          }
        }
      }
    }

    const recommendations: RecommendationResult[] = [];

    for (const [id, item] of standardMap.entries()) {
      const { std, score, matchedClauses } = item;
      const confidence = Math.min(Math.round(score * 100), 99);

      let reason = 'Applicable for ' + std.title + ' covering ' + std.category + ' products under ' + std.conformityAssessmentScheme + '.';
      let reasonHi = std.category + ' श्रेणी के उत्पादों और ' + (std.titleHi || std.title) + ' के लिए ' + std.conformityAssessmentScheme + ' के तहत लागू।';

      if (std.status.includes('Mandatory')) {
        reason += ' Regulated under ' + (std.qcoOrder || 'mandatory Quality Control Order') + '.';
        reasonHi += ' भारत सरकार के गुणवत्ता नियंत्रण आदेश (QCO) के तहत अनिवार्य।';
      }

      recommendations.push({
        id: std.id,
        isNumber: std.isNumber,
        title: std.title,
        titleHi: std.titleHi,
        category: std.category,
        sector: std.sector,
        status: std.status,
        qcoOrder: std.qcoOrder,
        confidenceScore: confidence,
        reason,
        reasonHi,
        keyClauses: matchedClauses.length > 0 ? matchedClauses : std.clauses.map(c => c.clauseNumber),
        mandatoryTests: std.keyTests.map(t => t.name + ' (Limit: ' + t.parameterLimit + ')'),
        hsCodes: std.hsCodes || []
      });
    }

    // Sort by confidence score descending
    recommendations.sort((a, b) => b.confidenceScore - a.confidenceScore);

    return NextResponse.json({
      success: true,
      specLength: specText.length,
      totalMatches: recommendations.length,
      recommendations: recommendations.slice(0, 5)
    });

  } catch (error: any) {
    console.error('Recommendation API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
