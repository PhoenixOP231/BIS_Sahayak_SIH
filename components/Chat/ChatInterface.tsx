'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, User, Shield, Volume2, VolumeX, Copy, Check, RotateCcw } from 'lucide-react';
import { CitationChip } from './CitationChip';
import { ChatMessageContent } from './ChatMessageContent';
import { StandardDrawer } from '../Standards/StandardDrawer';
import { CitationItem } from '@/lib/gemini';
import { UI_TEXT, Language } from '@/lib/translations';

export interface ChatMessageUI {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: CitationItem[];
  timestamp: string;
}

interface ChatInterfaceProps {
  mode: 'consumer' | 'industry';
  language: Language;
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

export function ChatInterface({ mode, language, initialQuery, onClearInitialQuery }: ChatInterfaceProps) {
  const t = UI_TEXT[language];

  const defaultGreeting = language === 'hi'
    ? 'नमस्ते! मैं बीआईएस सहायक (BIS Sahayak) हूँ। आप भारतीय मानकों (IS), गुणवत्ता नियंत्रण आदेशों (QCO), परीक्षण मानकों या प्रमाणन प्रक्रियाओं के बारे में कुछ भी पूछ सकते हैं।'
    : 'Namaste! I am BIS Sahayak, your AI Assistant for Indian Standards & BIS Services. Ask me anything about ISI certification, product safety compliance, testing parameters, or specific IS standard clauses.';

  const [messages, setMessages] = useState<ChatMessageUI[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: defaultGreeting,
      citations: [
        {
          id: 'IS-2347-2017',
          isNumber: 'IS 2347:2017',
          title: 'Domestic Pressure Cookers',
          category: 'Consumer Goods',
          status: 'Mandatory (QCO)',
          clauseNumber: 'Safety Valve & GRS'
        },
        {
          id: 'IS-14543-2024',
          isNumber: 'IS 14543:2024',
          title: 'Packaged Drinking Water',
          category: 'Food & Water',
          status: 'Mandatory (QCO)',
          clauseNumber: 'Pesticide & Sterility'
        }
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeDrawerStandardId, setActiveDrawerStandardId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendQuery = useCallback(async (queryToSend?: string) => {
    const q = (queryToSend || input).trim();
    if (!q || isLoading) return;

    const userMessage: ChatMessageUI = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryToSend) setInput('');
    setIsLoading(true);

    try {
      // Build history
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          history,
          mode,
          language
        })
      });

      const data = await res.json();

      if (data.success) {
        const assistantMessage: ChatMessageUI = {
          id: 'assistant-' + Date.now(),
          role: 'assistant',
          content: data.answer,
          citations: data.citations || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to generate response');
      }
    } catch (err: any) {
      const errorMessage: ChatMessageUI = {
        id: 'err-' + Date.now(),
        role: 'assistant',
        content: 'Error: ' + (err.message || 'Unable to connect to AI assistant. Please try again.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, mode, language]);

  // If initialQuery is passed from Hero quick pills, submit immediately
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendQuery(initialQuery);
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery, handleSendQuery, onClearInitialQuery]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleClearHistory = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
    setMessages([
      {
        id: 'welcome-msg-reset',
        role: 'assistant',
        content: defaultGreeting,
        citations: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      
      {/* Chat Container Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-amber-200/90 overflow-hidden flex flex-col h-[650px] transition-all">
        
        {/* Chat Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/80 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 font-display">
                  {language === 'hi' ? 'बीआईएस सहायक संवाद' : 'BIS Intelligent Conversation'}
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  mode === 'consumer' ? 'bg-amber-100 text-amber-900' : 'bg-slate-900 text-white'
                }`}>
                  {mode === 'consumer' ? t.consumerMode : t.industryMode}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'hi' ? 'भारतीय मानक ब्यूरो के नियमों पर आधारित' : 'Grounded on official Indian Standards corpus'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 bg-white/80 hover:bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs transition-all cursor-pointer"
            title={t.clearChat}
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{t.clearChat}</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-start animate-fadeIn ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                </div>

                {/* Message Content Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 transition-all ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none shadow-xs'
                  }`}
                >
                  {/* Markdown-like Text Formatter */}
                  <ChatMessageContent content={msg.content} isUser={isUser} />

                  {/* Citation Chips */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-amber-100">
                      <div className="text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{t.sources}:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.citations.map((c, i) => (
                          <CitationChip
                            key={i}
                            citation={c}
                            onClick={(cit) => setActiveDrawerStandardId(cit.id || cit.isNumber)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions & Timestamp */}
                  <div className={`mt-2 flex items-center justify-between text-[11px] ${isUser ? 'text-slate-400' : 'text-slate-400'}`}>
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <div className="flex items-center gap-2">
                        {/* Audio Speak */}
                        <button
                          onClick={() => handleSpeak(msg.id, msg.content)}
                          className="hover:text-amber-600 p-1 rounded transition cursor-pointer"
                          title={speakingId === msg.id ? t.stopSpeak : t.speak}
                        >
                          {speakingId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-amber-600 p-1 rounded transition cursor-pointer"
                          title={t.copy}
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 items-start animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <div className="bg-white border border-amber-200 rounded-2xl rounded-tl-none p-4 shadow-xs max-w-sm">
                <div className="flex items-center gap-2 text-xs text-amber-800 font-medium">
                  <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>{t.thinking}</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="p-3.5 bg-white border-t border-amber-200/80 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.searchPlaceholder}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-slate-50 focus:bg-white text-sm text-slate-900 border border-slate-200 focus:border-amber-500 rounded-xl outline-hidden transition-all shadow-inner"
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer disabled:cursor-not-allowed"
          >
            <span>{t.send}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

      {/* Slide-out Standard Detail Drawer */}
      <StandardDrawer
        standardId={activeDrawerStandardId}
        isOpen={!!activeDrawerStandardId}
        onClose={() => setActiveDrawerStandardId(null)}
        language={language}
      />

    </div>
  );
}
