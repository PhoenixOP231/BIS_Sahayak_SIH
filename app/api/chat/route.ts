import { NextRequest, NextResponse } from 'next/server';
import { generateRAGAnswer, ChatMessage } from '@/lib/gemini';
import { getDb } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, history = [], mode = 'consumer', language = 'en', sessionId } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const aiResponse = await generateRAGAnswer(
      query.trim(),
      history as ChatMessage[],
      mode as 'consumer' | 'industry',
      language as 'en' | 'hi'
    );

    // Optional logging in background if database connected
    try {
      const sql = getDb();
      if (sql) {
        const logId = 'log-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
        await sql.query(
          `INSERT INTO chat_logs (id, session_id, mode, user_query, assistant_response, cited_standards, language)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            logId,
            sessionId || 'anon-session',
            aiResponse.mode,
            query.trim(),
            aiResponse.answer,
            JSON.stringify(aiResponse.citations),
            aiResponse.language
          ]
        );
      }
    } catch {
      // Non-blocking log notice
    }

    return NextResponse.json({
      success: true,
      answer: aiResponse.answer,
      citations: aiResponse.citations,
      mode: aiResponse.mode,
      language: aiResponse.language,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
