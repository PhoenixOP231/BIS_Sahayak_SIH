'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface ChatMessageContentProps {
  content: string;
  isUser: boolean;
}

export function ChatMessageContent({ content, isUser }: ChatMessageContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isUser) {
    return <div className="text-sm leading-relaxed text-slate-100 whitespace-pre-wrap">{content}</div>;
  }

  let mainContent = content;
  let moreInfoContent = '';
  let summaryTitle = 'More Information & Technical Specifications';

  if (content.includes('<details>')) {
    const parts = content.split('<details>');
    mainContent = parts[0].trim();
    const detailsPart = parts[1] || '';

    const summaryMatch = detailsPart.match(/<summary><b>(.*?)<\/b><\/summary>/i) || detailsPart.match(/<summary>(.*?)<\/summary>/i);
    if (summaryMatch && summaryMatch[1]) {
      summaryTitle = summaryMatch[1].replace(/<\/?[^>]+(>|$)/g, '').trim();
    }

    moreInfoContent = detailsPart
      .replace(/<summary>.*?<\/summary>/gi, '')
      .replace(/<\/details>/gi, '')
      .trim();
  }

  const formatInlineMarkdown = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-950">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-amber-100/70 text-amber-900 px-1 py-0.5 rounded text-[11px] font-mono">$1</code>');
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return <div key={idx} className="h-1.5" />;
      }

      if (trimmed.startsWith('### ')) {
        const headingText = trimmed.replace(/^###\s+/, '');
        return (
          <h4 key={idx} className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wide mt-2.5 mb-1 flex items-center gap-1.5 text-amber-900">
            {headingText}
          </h4>
        );
      }

      if (trimmed.startsWith('• ') || trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const bulletText = trimmed.replace(/^[•*-]\s+/, '');
        return (
          <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 my-1 pl-1">
            <span className="text-amber-600 font-bold mt-0.5">•</span>
            <div className="flex-1" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(bulletText) }} />
          </div>
        );
      }

      return (
        <p
          key={idx}
          className="text-xs sm:text-sm text-slate-800 leading-relaxed my-0.5"
          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
        />
      );
    });
  };

  return (
    <div className="space-y-2">
      <div>{renderFormattedText(mainContent)}</div>

      {moreInfoContent && (
        <div className="mt-2.5 pt-2 border-t border-amber-200/60">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50/90 hover:bg-amber-100/90 border border-amber-200/90 text-amber-950 text-xs font-bold transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-700 group-hover:scale-110 transition-transform" />
              <span>{summaryTitle}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-amber-800">
              <span>{isExpanded ? 'Hide Details' : 'Show Details'}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-amber-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-amber-700" />
              )}
            </div>
          </button>

          {isExpanded && (
            <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed animate-fadeIn space-y-1.5">
              {renderFormattedText(moreInfoContent)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
