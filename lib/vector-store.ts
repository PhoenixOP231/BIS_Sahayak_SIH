import { ALL_STANDARDS, StandardDoc, getStandardById } from './standards-data';
import * as fs from 'fs';
import * as path from 'path';

export interface ScoredStandardChunk {
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
  score: number;
  standard?: StandardDoc;
}

export function generateEmbedding(text: string, dimensions = 768): number[] {
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

export function computeCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
  }
  return Math.max(0, Math.min(1, dot));
}

let inMemoryChunksCache: any[] | null = null;

function loadLocalChunks(): any[] {
  if (inMemoryChunksCache) return inMemoryChunksCache;
  
  try {
    const vectorFilePath = path.join(process.cwd(), 'data', 'standards-vectors.json');
    if (fs.existsSync(vectorFilePath)) {
      const raw = fs.readFileSync(vectorFilePath, 'utf8');
      inMemoryChunksCache = JSON.parse(raw);
      return inMemoryChunksCache || [];
    }
  } catch {
    // Fall back to building on-the-fly from ALL_STANDARDS
  }

  const chunks: any[] = [];
  for (const doc of ALL_STANDARDS) {
    chunks.push({
      id: doc.id + '-scope',
      standardId: doc.id,
      isNumber: doc.isNumber,
      title: doc.title,
      clauseNumber: 'Scope',
      heading: doc.isNumber + ' ? Scope & Applicability',
      content: doc.isNumber + ' (' + doc.title + '): ' + doc.scope + ' Category: ' + doc.category + ', Sector: ' + doc.sector + '. Status: ' + doc.status + '. QCO: ' + (doc.qcoOrder || 'N/A') + '. Marking: ' + doc.markingRequirements,
      contentHi: doc.scopeHi,
      category: doc.category,
      status: doc.status,
      embedding: generateEmbedding(doc.isNumber + ' ' + doc.title + ' ' + doc.scope + ' ' + doc.category + ' ' + doc.sector)
    });

    if (doc.keyTests) {
      const testsStr = doc.keyTests.map(t => t.name + ' ' + t.parameterLimit).join(' | ');
      chunks.push({
        id: doc.id + '-tests',
        standardId: doc.id,
        isNumber: doc.isNumber,
        title: doc.title,
        clauseNumber: 'Testing Requirements',
        heading: doc.isNumber + ' ? Testing Parameters',
        content: 'Testing requirements for ' + doc.isNumber + ': ' + testsStr,
        contentHi: doc.isNumber + ' ??????? ????',
        category: doc.category,
        status: doc.status,
        embedding: generateEmbedding(doc.isNumber + ' testing ' + testsStr)
      });
    }

    for (let i = 0; i < doc.clauses.length; i++) {
      const c = doc.clauses[i];
      chunks.push({
        id: doc.id + '-c' + (i + 1),
        standardId: doc.id,
        isNumber: doc.isNumber,
        title: doc.title,
        clauseNumber: c.clauseNumber,
        heading: doc.isNumber + ' ' + c.clauseNumber + ' ? ' + c.title,
        content: doc.isNumber + ' ' + c.clauseNumber + ' (' + c.title + '): ' + c.content,
        contentHi: c.contentHi,
        category: doc.category,
        status: doc.status,
        embedding: generateEmbedding(doc.isNumber + ' ' + c.clauseNumber + ' ' + c.title + ' ' + c.content)
      });
    }
  }

  inMemoryChunksCache = chunks;
  return chunks;
}

const STOP_WORDS = new Set([
  'is', 'are', 'and', 'the', 'for', 'with', 'from', 'per', 'not', 'can', 'may', 'shall', 'should', 'all',
  'what', 'which', 'who', 'how', 'when', 'where', 'why', 'about', 'under', 'into', 'over', 'after',
  'standard', 'standards', 'isi', 'mark', 'bis', 'act', 'code', 'product', 'products',
  'yo', 'hi', 'hey', 'hello', 'sup', 'whats', 'whatsup', 'wazzup', 'hola', 'hie', 'heyy', 'hii', 'gm', 'gn',
  'ok', 'okay', 'cool', 'nice', 'great', 'awesome', 'thanks', 'thank', 'thx', 'tysm', 'bye', 'goodbye', 'help',
  'kya', 'hai', 'kaise', 'bhai', 'bro', 'dost', 'namaste', 'pranam', 'shukriya', 'dhanyawad',
  'क्या', 'है', 'पर', 'या', 'का', 'की', 'के', 'में', 'को', 'से', 'होना', 'चाहिए', 'और', 'लिए', 'यह', 'वह', 'मानक', 'मार्क', 'उत्पाद', 'नमस्ते', 'प्रणाम', 'धन्यवाद', 'शुक्रिया', 'हेलो', 'हाय'
]);

export async function searchHybridStandards(query: string, topK = 5): Promise<ScoredStandardChunk[]> {
  const queryVec = generateEmbedding(query);
  const queryTokens = query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 2 && !STOP_WORDS.has(w));

  // If query consists solely of greetings / stop words, return empty results to allow conversational NLP
  if (queryTokens.length === 0) {
    return [];
  }

  const localChunks = loadLocalChunks();
  const scored: ScoredStandardChunk[] = [];

  for (const chunk of localChunks) {
    const std = getStandardById(chunk.standardId) || getStandardById(chunk.isNumber);
    const cosSim = computeCosineSimilarity(queryVec, chunk.embedding || generateEmbedding(chunk.content));
    let matchScore = 0;

    if (std) {
      const stdTitleText = (std.isNumber + ' ' + std.title + ' ' + (std.titleHi || '')).toLowerCase();
      const stdFullText = (
        stdTitleText + ' ' + 
        std.scope + ' ' + 
        (std.scopeHi || '') + ' ' + 
        std.category + ' ' + 
        std.sector + ' ' + 
        (std.qcoOrder || '') + ' ' + 
        (std.keyTests || []).map((t: any) => t.name + ' ' + t.description).join(' ') + ' ' + 
        (std.clauses || []).map((c: any) => c.title + ' ' + c.content + ' ' + (c.contentHi || '')).join(' ')
      ).toLowerCase();

      for (const t of queryTokens) {
        if (stdTitleText.includes(t)) {
          matchScore += 0.8;
        } else if (stdFullText.includes(t)) {
          matchScore += 0.35;
        }
      }
    }

    const totalScore = cosSim * 0.25 + matchScore;

    if (totalScore > 0.05) {
      scored.push({
        id: chunk.id,
        standardId: chunk.standardId,
        isNumber: chunk.isNumber,
        title: std?.title || chunk.title,
        clauseNumber: chunk.clauseNumber,
        heading: chunk.heading,
        content: chunk.content,
        contentHi: chunk.contentHi,
        category: chunk.category,
        status: chunk.status,
        score: totalScore,
        standard: std
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
