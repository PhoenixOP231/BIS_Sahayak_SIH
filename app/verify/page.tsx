'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MarkVerifier } from '@/components/Verifier/MarkVerifier';
import { Language } from '@/lib/translations';

export default function VerifyPage() {
  const [mode, setMode] = useState<'consumer' | 'industry'>('consumer');
  const [language, setLanguage] = useState<Language>('en');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      
      <Navbar
        mode={mode}
        setMode={setMode}
        language={language}
        setLanguage={setLanguage}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <MarkVerifier language={language} />
      </main>

      <Footer language={language} />

    </div>
  );
}
