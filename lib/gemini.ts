import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchHybridStandards, ScoredStandardChunk } from './vector-store';
import { ALL_STANDARDS, getStandardById, StandardDoc } from './standards-data';
import { Language } from './translations';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CitationItem {
  id: string;
  isNumber: string;
  title: string;
  category: string;
  status: string;
  clauseNumber?: string;
}

export interface AIResponse {
  answer: string;
  citations: CitationItem[];
  mode: 'consumer' | 'industry';
  language: Language;
}

const CONSUMER_SYSTEM_PROMPT = `
You are "BIS Sahayak" (बीआईएस सहायक), an official AI Assistant designed for the Bureau of Indian Standards (BIS) and Ministry of Consumer Affairs, Government of India.
Your mission is to help Indian citizens and consumers understand product safety standards, identify authentic ISI / BIS Hallmarks, avoid dangerous sub-standard counterfeit products, and know their legal consumer rights under the BIS Act, 2016.

GUIDELINES FOR CONSUMER PERSONA:
1. Explain technical safety rules in clear, reassuring, accessible everyday language (avoid overly dense engineering jargon unless explaining a safety risk).
2. When answering in Hindi, use warm, respectful, and standard Hindustani/Devanagari script.
3. Explicitly guide the user on how to verify the ISI mark:
   - Check the IS standard number at the top of the ISI mark (e.g. IS 2347).
   - Check the 7 or 8-digit CM/L license number at the bottom.
   - Mention the official BIS Care mobile app for verifying manufacturer license details and filing complaints.
4. Highlight if a product is under a mandatory Quality Control Order (QCO), meaning it is illegal to manufacture, import, or sell without a valid BIS license in India.
5. Base all answers strictly on the retrieved official Indian Standards context provided.
6. Provide citations to the relevant IS standards.
`;

const INDUSTRY_SYSTEM_PROMPT = `
You are "BIS Sahayak" (बीआईएस सहायक) in Technical Industry & MSME Mode, an expert regulatory and engineering compliance assistant for manufacturers, testing laboratories, exporters, and procurement officers.

GUIDELINES FOR INDUSTRY PERSONA:
1. Provide precise, authoritative technical guidance citing exact IS standard numbers, clause designations (e.g., Clause 4.1, Clause 5.2), testing parameters, and numerical tolerance limits.
2. Detail applicable Conformity Assessment Schemes (Scheme-I Product Certification, Scheme-IV, etc.), Standard Mark specifications, and QCO (Quality Control Order) mandates.
3. When applicable, mention Harmonized System (HS) codes, sampling plans, routine test intervals, and laboratory calibration standards.
4. If the query asks about procurement tenders or technical specifications, provide exact compliance checkpoints and acceptance criteria.
5. Base all answers strictly on the retrieved official Indian Standards context provided.
`;

export async function generateRAGAnswer(
  query: string,
  history: ChatMessage[] = [],
  mode: 'consumer' | 'industry' = 'consumer',
  language: Language = 'en'
): Promise<AIResponse> {
  // Step 1: Hybrid Vector Retrieval
  const relevantChunks = await searchHybridStandards(query, 5);

  // Extract unique citations from retrieved chunks
  const citationMap = new Map<string, CitationItem>();
  for (const chunk of relevantChunks) {
    const std = chunk.standard || getStandardById(chunk.standardId) || getStandardById(chunk.isNumber);
    if (std) {
      if (!citationMap.has(std.id)) {
        citationMap.set(std.id, {
          id: std.id,
          isNumber: std.isNumber,
          title: std.title,
          category: std.category,
          status: std.status,
          clauseNumber: chunk.clauseNumber
        });
      }
    }
  }

  if (citationMap.size < 2) {
    const qTokens = query.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ' ').split(/\s+/).filter(w => w.length >= 3);
    for (const std of ALL_STANDARDS) {
      if (!citationMap.has(std.id)) {
        const fullStdText = ((std.title || '') + ' ' + (std.titleHi || '') + ' ' + (std.scope || '') + ' ' + (std.scopeHi || '')).toLowerCase();
        const hasMatch = qTokens.some(tok => fullStdText.includes(tok));
        if (hasMatch) {
          citationMap.set(std.id, {
            id: std.id,
            isNumber: std.isNumber,
            title: std.title,
            category: std.category,
            status: std.status,
            clauseNumber: 'General'
          });
        }
      }
    }
  }

  const citations = Array.from(citationMap.values());

  // Format context for LLM
  const contextString = relevantChunks
    .map(
      (c, idx) =>
        '[' + (idx + 1) + '] Standard: ' + c.isNumber + ' (' + c.title + ')\n' +
        'Clause: ' + c.clauseNumber + ' (' + c.heading + ')\n' +
        'Content: ' + c.content + '\n' +
        'Category: ' + c.category + ' | Status: ' + c.status + '\n'
    )
    .join('\n---\n');

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && !apiKey.includes('placeholder')) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        },
      });

      const systemPrompt = mode === 'consumer' ? CONSUMER_SYSTEM_PROMPT : INDUSTRY_SYSTEM_PROMPT;
      const langInstruction = language === 'hi'
        ? '\nIMPORTANT: Respond fluently and accurately in HINDI (Devanagari script).'
        : '\nRespond clearly in ENGLISH.';

      const conversationContext = history
        .slice(-4)
        .map(h => (h.role === 'user' ? 'User: ' + h.content : 'Assistant: ' + h.content))
        .join('\n');

      const fullPrompt = 
        systemPrompt + '\n' +
        langInstruction + '\n\n' +
        'RETRIEVED OFFICIAL INDIAN STANDARDS CONTEXT:\n' +
        contextString + '\n\n' +
        (conversationContext ? 'PREVIOUS CONVERSATION:\n' + conversationContext + '\n\n' : '') +
        'USER QUERY: ' + query + '\n\n' +
        'ANSWER:';

      const result = await model.generateContent(fullPrompt);
      const answerText = result.response.text();

      return {
        answer: answerText,
        citations,
        mode,
        language,
      };
    } catch (err: any) {
      console.warn('Gemini API call fallback:', err.message);
    }
  }

  // Resilient Authentic Fallback Response Generator
  const topMatch = relevantChunks[0];
  const std = topMatch?.standard || (topMatch ? getStandardById(topMatch.standardId) : null);

  let fallbackAnswer = '';

  if (language === 'hi') {
    if (std) {
      if (mode === 'consumer') {
        fallbackAnswer = 
          '**' + std.isNumber + ' (' + (std.titleHi || std.title) + ')** ?? ??????:\n\n' +
          (std.scopeHi || std.scope) + '\n\n' +
          '**???????? ??????? ??? ??????? ?????:**\n' +
          '? ?????? ?????? ??? ????? **ISI ?????** ?? ???? ?????\n' +
          '? ????? ?? ??? ???? ?????? (**' + std.isNumber + '**)' +
          ' ?? ???? 7/8 ????? ?? **CM/L ??????? ????** ???????? ??? ?? ????? ???? ??????\n' +
          (std.status.includes('Mandatory') ? '? ?? ?????? ???? ????? ?? **???????? ???????? ???? (QCO)** ?? ??? ???????? ??? ???? ??? ISI ????? ?? ??? ????? ????????? ???\n' : '') +
          '? ??????? ?? ??????????? ?? ???? ?? ??? ?? **BIS Care** ?????? ?? ?? ????? ?? ???? ????';
      } else {
        fallbackAnswer = 
          '**?????? ????????? ??? ???????: ' + std.isNumber + ' (' + std.title + ')**\n\n' +
          '**????? ? ???????:** ' + std.scope + '\n\n' +
          '**???????? ??????? ??? ????????:**\n' +
          std.keyTests.map(t => '? **' + t.name + ':** ' + t.description + ' (????: ' + t.parameterLimit + ')').join('\n') + '\n\n' +
          '**???????? ????????? ?????:** ' + std.conformityAssessmentScheme + '\n' +
          (std.qcoOrder ? '**QCO ????:** ' + std.qcoOrder + '\n' : '') +
          '**???? ??????????:** ' + std.markingRequirements;
      }
    } else {
      fallbackAnswer = 
        '?????? ???? ?????? (BIS) ?? ??????, ???????? ?? ??????? ?? ??????????? ?? ??? ????????? ?????? ?????? (IS) ?? ??????? ?????? ??? ???????? ??????? ?? ??? ????? ????????? ISI ????? ?? CM/L ??????? ???? ?? ???? ?????';
    }
  } else {
    if (std) {
      if (mode === 'consumer') {
        fallbackAnswer = 
          'According to **' + std.isNumber + ' (' + std.title + ')**:\n\n' +
          std.scope + '\n\n' +
          '**Consumer Safety & Verification Tips:**\n' +
          '? Always look for the authentic **ISI Mark** on the product package and body.\n' +
          '? Verify the standard number (**' + std.isNumber + '**)' +
          ' printed on top and the 7 or 8-digit **CM/L license number** at the bottom.\n' +
          (std.status.includes('Mandatory') ? '? **Mandatory Compliance:** This product is governed by a Quality Control Order (QCO: ' + (std.qcoOrder || 'Mandatory') + '). Selling without the ISI mark is punishable under the BIS Act, 2016.\n' : '') +
          '? You can verify the manufacturer factory license instantly using the official **BIS Care App** or the e-BIS portal.';
      } else {
        fallbackAnswer = 
          '**Technical Standards & Compliance Overview: ' + std.isNumber + ' (' + std.title + ')**\n\n' +
          '**Scope & Application:** ' + std.scope + '\n\n' +
          '**Key Quality & Testing Parameters:**\n' +
          std.keyTests.map(t => '? **' + t.name + ':** ' + t.description + ' (Acceptance Limit: ' + t.parameterLimit + ')').join('\n') + '\n\n' +
          '**Conformity Scheme:** ' + std.conformityAssessmentScheme + '\n' +
          (std.qcoOrder ? '**QCO Mandate:** ' + std.qcoOrder + '\n' : '') +
          '**Marking Clause:** ' + std.markingRequirements;
      }
    } else {
      fallbackAnswer = 
        'Under the Bureau of Indian Standards Act, 2016, products certified under Scheme-I must comply with designated Indian Standards (IS), mandatory testing limits, and carry the authentic ISI mark with an active CM/L license number.';
    }
  }

  return {
    answer: fallbackAnswer,
    citations,
    mode,
    language,
  };
}
