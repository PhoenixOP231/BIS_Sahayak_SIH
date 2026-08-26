'use client';

import React from 'react';
import { FileText, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { CitationItem } from '@/lib/gemini';

interface CitationChipProps {
  citation: CitationItem;
  onClick: (citation: CitationItem) => void;
}

export function CitationChip({ citation, onClick }: CitationChipProps) {
  const isMandatory = citation.status?.includes('Mandatory');

  return (
    <button
      onClick={() => onClick(citation)}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-amber-50/90 hover:bg-amber-100/90 text-amber-900 border border-amber-300/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
      title={`Click to inspect clauses and parameters for ${citation.isNumber}`}
    >
      {isMandatory ? (
        <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
      ) : (
        <FileText className="w-3.5 h-3.5 text-amber-700" />
      )}
      <span className="font-bold font-mono text-[11px]">{citation.isNumber}</span>
      {citation.clauseNumber && (
        <span className="text-[10px] text-amber-700 bg-amber-200/60 px-1 py-0.5 rounded">
          {citation.clauseNumber}
        </span>
      )}
      <ArrowUpRight className="w-3 h-3 text-amber-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}
