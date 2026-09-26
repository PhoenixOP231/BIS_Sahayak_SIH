import { NextRequest, NextResponse } from 'next/server';
import { generateRAGAnswer, ChatMessage } from '@/lib/gemini';
import { getDb } from '@/lib/prisma';

export const maxDuration = 30;

// In-memory sliding window rate limiter: 30 requests / minute per IP
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

function isRateLimited(ip: string, maxRequests = 30, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  // Periodically purge old entries (when map grows)
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= maxRequests) {
    return true;
  }

  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Client IP & Rate Limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    if (isRateLimited(ip, 30, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 30 requests per minute allowed.' },
        { status: 429 }
      );
    }

    // 2. Request JSON parsing & validation
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body' },
        { status: 400 }
      );
    }

    const { query, history = [], mode = 'consumer', language = 'en', sessionId } = body || {};

    // Validate query
    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { error: 'Query is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const trimmedQuery = query.trim();
    if (trimmedQuery.length > 1000) {
      return NextResponse.json(
        { error: 'Query exceeds maximum allowed length of 1000 characters' },
        { status: 400 }
      );
    }

    // Validate history
    if (!Array.isArray(history)) {
      return NextResponse.json(
        { error: 'History must be an array of messages' },
        { status: 400 }
      );
    }

    if (history.length > 20) {
      return NextResponse.json(
        { error: 'History exceeds maximum length of 20 messages' },
        { status: 400 }
      );
    }

    for (const msg of history) {
      if (!msg || typeof msg !== 'object') {
        return NextResponse.json(
          { error: 'Each history item must be a valid message object' },
          { status: 400 }
        );
      }
      if (msg.role !== 'user' && msg.role !== 'assistant') {
        return NextResponse.json(
          { error: 'History message role must be "user" or "assistant"' },
          { status: 400 }
        );
      }
      if (typeof msg.content !== 'string' || msg.content.length > 2000) {
        return NextResponse.json(
          { error: 'History message content must be a string <= 2000 characters' },
          { status: 400 }
        );
      }
    }

    // Validate mode
    const validMode = mode === 'industry' ? 'industry' : 'consumer';

    // Validate language
    const validLanguage = language === 'hi' ? 'hi' : 'en';

    // 3. Process RAG query
    const aiResponse = await generateRAGAnswer(
      trimmedQuery,
      history as ChatMessage[],
      validMode,
      validLanguage
    );

    // 4. Optional background telemetry logging (best effort, non-blocking)
    try {
      const sql = getDb();
      if (sql) {
        const logId = 'log-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
        await sql.query(
          `INSERT INTO chat_logs (id, session_id, mode, user_query, assistant_response, cited_standards, language)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            logId,
            typeof sessionId === 'string' ? sessionId.slice(0, 64) : 'anon-session',
            aiResponse.mode,
            trimmedQuery,
            aiResponse.answer,
            JSON.stringify(aiResponse.citations),
            aiResponse.language
          ]
        );
      }
    } catch {
      // Non-blocking log notice
    }

    // 5. Return sanitized response
    return NextResponse.json({
      success: true,
      answer: aiResponse.answer,
      citations: aiResponse.citations,
      mode: aiResponse.mode,
      language: aiResponse.language,
      fallback: aiResponse.fallback ?? false,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Chat API error:', error?.message || error);
    // Sanitize 500 error response — never leak internal stack traces or database errors
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
