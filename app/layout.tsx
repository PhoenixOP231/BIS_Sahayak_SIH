import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800', '900'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'BIS Sahayak ? AI Assistant for Indian Standards & BIS Services (SIH26107)',
  description: 'Intelligent AI Companion for Indian Standards (IS), QCO compliance, testing procedures, and procurement specification matching. Ministry of Consumer Affairs, Govt of India.',
  keywords: ['BIS', 'Bureau of Indian Standards', 'ISI Mark', 'Indian Standards', 'SIH2026', 'SIH26107', 'Quality Control Order', 'Consumer Affairs'],
  authors: [{ name: 'Team Antigravity' }],
  creator: 'Smart India Hackathon 2026',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-slate-50/50 text-slate-900 selection:bg-amber-200 selection:text-amber-900">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
