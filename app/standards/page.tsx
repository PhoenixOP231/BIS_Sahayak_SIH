'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StandardCard } from '@/components/Standards/StandardCard';
import { StandardFilter } from '@/components/Standards/StandardFilter';
import { StandardDrawer } from '@/components/Standards/StandardDrawer';
import { ALL_STANDARDS } from '@/lib/standards-data';
import { Language, UI_TEXT } from '@/lib/translations';
import { BookOpen } from 'lucide-react';

export default function StandardsDirectoryPage() {
  const [mode, setMode] = useState<'consumer' | 'industry'>('consumer');
  const [language, setLanguage] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);

  const t = UI_TEXT[language];

  // Extract unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(ALL_STANDARDS.map((s) => s.category))).sort();
  }, []);

  // Filter standards
  const filteredStandards = useMemo(() => {
    return ALL_STANDARDS.filter((s) => {
      // Category match
      if (selectedCategory !== 'all' && s.category !== selectedCategory) {
        return false;
      }
      // Status match
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'Mandatory' && !s.status.includes('Mandatory')) return false;
        if (selectedStatus === 'Voluntary' && s.status !== 'Voluntary') return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNumber = s.isNumber.toLowerCase().includes(q);
        const matchesTitle = s.title.toLowerCase().includes(q) || (s.titleHi && s.titleHi.toLowerCase().includes(q));
        const matchesScope = s.scope.toLowerCase().includes(q);
        const matchesCategory = s.category.toLowerCase().includes(q);
        const matchesSector = s.sector.toLowerCase().includes(q);
        const matchesClauses = s.clauses.some((c) => c.content.toLowerCase().includes(q) || c.title.toLowerCase().includes(q));

        return matchesNumber || matchesTitle || matchesScope || matchesCategory || matchesSector || matchesClauses;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedStatus]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      
      <Navbar
        mode={mode}
        setMode={setMode}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>Official BIS Registry Corpus</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-display">
            {t.navStandards}
          </h1>
          <p className="text-sm text-slate-600">
            {language === 'hi'
              ? 'भारतीय मानक ब्यूरो (BIS) द्वारा प्रकाशित एवं गुणवत्ता नियंत्रण आदेशों (QCO) के तहत विनियमित प्रमुख भारतीय मानकों की विस्तृत निर्देशिका।'
              : 'Search and inspect Indian Standards across electrical, child safety, drinking water, pressure vessels, civil infrastructure, and consumer electronics.'
            }
          </p>
        </div>

        {/* Filter Toolbar */}
        <StandardFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          categories={categories}
          language={language}
          onReset={handleReset}
        />

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong>{filteredStandards.length}</strong> of {ALL_STANDARDS.length} Indian Standards
          </span>
          <span className="hidden sm:inline-block font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {ALL_STANDARDS.filter(s => s.status.includes('Mandatory')).length} Mandatory QCO Standards
          </span>
        </div>

        {/* Standards Grid */}
        {filteredStandards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStandards.map((std) => (
              <StandardCard
                key={std.id}
                standard={std}
                language={language}
                onQuickView={(s) => setActiveDrawerId(s.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <p className="text-base font-bold text-slate-800">No standards found matching your criteria</p>
            <p className="text-xs text-slate-500">Try changing your search term or resetting the category and status filters.</p>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </main>

      {/* Slide-out Drawer */}
      <StandardDrawer
        standardId={activeDrawerId}
        isOpen={!!activeDrawerId}
        onClose={() => setActiveDrawerId(null)}
        language={language}
      />

      <Footer language={language} />

    </div>
  );
}
