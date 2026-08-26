// scripts/seed-standards.ts
// Automated ingestion pipeline for Indian Standards documents into Postgres + pgvector and local vector cache

import * as fs from 'fs';
import * as path from 'path';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

export interface DocumentChunk {
  id: string;
  standardId: string;
  isNumber: string;
  title: string;
  clauseNumber: string;
  heading: string;
  content: string;
  contentHi?: string;
  category: string;
  status: string;
  embedding?: number[];
}

export function generateLocalEmbedding(text: string, dimensions = 768): number[] {
  const vector = new Array(dimensions).fill(0);
  const words = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let j = 0; j < word.length; j++) {
      hash = (hash << 5) - hash + word.charCodeAt(j);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dimensions;
    vector[idx] += 1 / Math.sqrt(words.length || 1);
    
    const idx2 = (Math.abs(hash * 31 + i)) % dimensions;
    vector[idx2] += 0.5 / Math.sqrt(words.length || 1);
  }
  
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
  return vector.map(v => Number((v / norm).toFixed(6)));
}

export async function chunkStandardDocument(doc: any): Promise<DocumentChunk[]> {
  const chunks: DocumentChunk[] = [];
  
  chunks.push({
    id: doc.id + '-scope',
    standardId: doc.id,
    isNumber: doc.isNumber,
    title: doc.title,
    clauseNumber: 'Scope',
    heading: doc.isNumber + ' ? Scope & Applicability',
    content: doc.isNumber + ' (' + doc.title + '): ' + doc.scope + ' Category: ' + doc.category + ', Sector: ' + doc.sector + '. Status: ' + doc.status + '. QCO Order: ' + (doc.qcoOrder || 'N/A') + '. Marking: ' + doc.markingRequirements,
    contentHi: doc.scopeHi,
    category: doc.category,
    status: doc.status,
    embedding: generateLocalEmbedding(doc.isNumber + ' ' + doc.title + ' ' + doc.scope + ' ' + doc.category + ' ' + doc.sector + ' ' + doc.markingRequirements)
  });

  if (doc.keyTests && doc.keyTests.length > 0) {
    const testsSummary = doc.keyTests.map((t: any) => t.name + ': ' + t.description + ' (Limit: ' + t.parameterLimit + ')').join(' | ');
    chunks.push({
      id: doc.id + '-tests',
      standardId: doc.id,
      isNumber: doc.isNumber,
      title: doc.title,
      clauseNumber: 'Testing Requirements',
      heading: doc.isNumber + ' ? Testing Parameters & Acceptance Limits',
      content: 'Testing & Inspection for ' + doc.isNumber + ' (' + doc.title + '): ' + testsSummary + '. Conformity scheme: ' + doc.conformityAssessmentScheme + '.',
      contentHi: doc.isNumber + ' ?? ??????? ????: ' + doc.keyTests.map((t: any) => t.name).join(', '),
      category: doc.category,
      status: doc.status,
      embedding: generateLocalEmbedding(doc.isNumber + ' testing inspection parameters ' + testsSummary)
    });
  }

  if (doc.clauses && Array.isArray(doc.clauses)) {
    for (let i = 0; i < doc.clauses.length; i++) {
      const clause = doc.clauses[i];
      chunks.push({
        id: doc.id + '-c' + (i + 1),
        standardId: doc.id,
        isNumber: doc.isNumber,
        title: doc.title,
        clauseNumber: clause.clauseNumber,
        heading: doc.isNumber + ' ' + clause.clauseNumber + ' ? ' + clause.title,
        content: doc.isNumber + ' ' + clause.clauseNumber + ' (' + clause.title + '): ' + clause.content,
        contentHi: clause.contentHi,
        category: doc.category,
        status: doc.status,
        embedding: generateLocalEmbedding(doc.isNumber + ' ' + clause.clauseNumber + ' ' + clause.title + ' ' + clause.content)
      });
    }
  }

  if (doc.consumerTips && doc.consumerTips.length > 0) {
    chunks.push({
      id: doc.id + '-consumer',
      standardId: doc.id,
      isNumber: doc.isNumber,
      title: doc.title,
      clauseNumber: 'Consumer Advisory',
      heading: doc.isNumber + ' ? Consumer Verification & ISI Mark Guidance',
      content: 'Consumer guidance for ' + doc.isNumber + ' (' + doc.title + '): ' + doc.consumerTips.join(' ') + ' Marking: ' + doc.markingRequirements,
      contentHi: doc.isNumber + ' ???????? ??????? ?? ??????? ??????????',
      category: doc.category,
      status: doc.status,
      embedding: generateLocalEmbedding(doc.isNumber + ' consumer verification ISI mark CM/L fake test ' + doc.consumerTips.join(' '))
    });
  }

  return chunks;
}

export async function runIngestion() {
  console.log('?? Starting BIS Indian Standards Ingestion Pipeline...');
  const standardsDir = path.join(process.cwd(), 'data', 'standards');
  
  if (!fs.existsSync(standardsDir)) {
    throw new Error('Directory ' + standardsDir + ' not found!');
  }

  const files = fs.readdirSync(standardsDir).filter(f => f.endsWith('.json') && f !== 'standards-index.json');
  console.log('?? Discovered ' + files.length + ' standard documents to ingest.');

  const allChunks: DocumentChunk[] = [];
  const allStandards: any[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(standardsDir, file), 'utf8');
    const doc = JSON.parse(raw);
    allStandards.push(doc);

    const docChunks = await chunkStandardDocument(doc);
    allChunks.push(...docChunks);
    console.log('  ? Processed ' + doc.isNumber + ' (' + doc.id + '): generated ' + docChunks.length + ' chunks');
  }

  const vectorCachePath = path.join(process.cwd(), 'data', 'standards-vectors.json');
  fs.writeFileSync(vectorCachePath, JSON.stringify(allChunks, null, 2), 'utf8');
  console.log('?? Saved ' + allChunks.length + ' embedded chunks to local vector cache: ' + vectorCachePath);

  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && !dbUrl.includes('placeholder')) {
    try {
      console.log('?? Connecting to Neon Postgres database for pgvector insertion...');
      const sql = neon(dbUrl);
      
      for (const std of allStandards) {
        const keyTestsJson = JSON.stringify(std.keyTests || []);
        const hsCodesJson = JSON.stringify(std.hsCodes || []);
        await sql.query(`
          INSERT INTO standards (
            id, is_number, title, title_hi, category, sector, status, qco_order, year, scope, scope_hi, key_tests, marking_requirements, conformity_assessment_scheme, hs_codes
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
          )
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            scope = EXCLUDED.scope,
            key_tests = EXCLUDED.key_tests,
            status = EXCLUDED.status;
        `, [
          std.id, std.isNumber, std.title, std.titleHi || '', std.category, std.sector, std.status, std.qcoOrder || '', std.year || 2024, std.scope, std.scopeHi || '', keyTestsJson, std.markingRequirements || '', std.conformityAssessmentScheme || '', hsCodesJson
        ]);
      }
      console.log('✅ Upserted ' + allStandards.length + ' standards into Neon database table.');

      for (const chunk of allChunks) {
        const vectorStr = '[' + (chunk.embedding?.join(',') || '') + ']';
        const metaJson = JSON.stringify({ category: chunk.category, status: chunk.status });
        await sql.query(`
          INSERT INTO standard_chunks (
            id, standard_id, is_number, clause_number, heading, content, content_hi, embedding, metadata
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8::vector, $9
          )
          ON CONFLICT (id) DO UPDATE SET
            content = EXCLUDED.content,
            embedding = EXCLUDED.embedding;
        `, [
          chunk.id, chunk.standardId, chunk.isNumber, chunk.clauseNumber, chunk.heading, chunk.content, chunk.contentHi || '', vectorStr, metaJson
        ]);
      }
      console.log('✅ Upserted ' + allChunks.length + ' vector chunks into standard_chunks table in Neon Postgres.');
    } catch (err: any) {
      console.warn('⚠️ Neon insertion notice (fallback local vector search active):', err.message);
    }
  } else {
    console.log('ℹ️ DATABASE_URL not set — local vector search active.');
  }

  console.log('\n🎉 Ingestion pipeline complete! All standards chunked, embedded, and ready for RAG.');
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('seed-standards')) {
  runIngestion().catch(console.error);
}
