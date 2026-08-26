'use client';

import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { UI_TEXT, Language } from '@/lib/translations';

interface StandardFilterProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedStatus: string;
  setSelectedStatus: (stat: string) => void;
  categories: string[];
  language: Language;
  onReset: () => void;
}

export function StandardFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  categories,
  language,
  onReset,
}: StandardFilterProps) {
  const t = UI_TEXT[language];

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 p-4 sm:p-5 shadow-xs mb-8 space-y-4">
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'hi' ? 'मानक संख्या, शीर्षक, या कीवर्ड से खोजें (उदा. IS 2347, प्रेशर कुकर, TMT, केबल)...' : 'Search by IS number, product title, or keyword (e.g., IS 2347, Pressure Cooker, TMT Rebar, Cable)...'}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white text-sm text-slate-900 border border-slate-200 focus:border-amber-500 rounded-xl outline-hidden transition-all shadow-inner"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Category Dropdown */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            {t.category}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:border-amber-500 outline-hidden transition cursor-pointer"
          >
            <option value="all">{t.allCategories} (All)</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="w-full sm:w-48">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Status / QCO
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:border-amber-500 outline-hidden transition cursor-pointer"
          >
            <option value="all">{t.allStatuses}</option>
            <option value="Mandatory">Mandatory (QCO)</option>
            <option value="Voluntary">Voluntary</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="self-end">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

      </div>

    </div>
  );
}
