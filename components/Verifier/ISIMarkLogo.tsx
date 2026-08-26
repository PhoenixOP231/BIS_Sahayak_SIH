import React from 'react';

interface ISIMarkLogoProps {
  isNumber?: string;
  cmlNumber?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ISIMarkLogo({
  isNumber = 'IS 2347',
  cmlNumber = 'CM/L-8400123',
  size = 'md',
  className = '',
}: ISIMarkLogoProps) {
  const dimensions = {
    sm: { width: 'w-24', textTop: 'text-[9px]', textBot: 'text-[8px]', logoH: 32 },
    md: { width: 'w-36', textTop: 'text-[11px]', textBot: 'text-[10px]', logoH: 48 },
    lg: { width: 'w-48', textTop: 'text-[13px]', textBot: 'text-[12px]', logoH: 64 },
  }[size];

  return (
    <div
      className={`inline-flex flex-col items-center justify-center p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-sm ${dimensions.width} ${className}`}
      title="Official ISI Certification Mark (BIS Scheme-I)"
    >
      {/* Top: IS Standard Number */}
      <span className={`font-mono font-bold text-slate-950 tracking-tight text-center ${dimensions.textTop} mb-1`}>
        {isNumber.toUpperCase()}
      </span>

      {/* Centre: Authentic Stylized ISI Monogram SVG */}
      <div className="my-1 flex items-center justify-center">
        <svg
          viewBox="0 0 100 65"
          className="w-full max-w-[90px] h-auto text-slate-950"
          fill="currentColor"
        >
          {/* Outer rectangular badge frame */}
          <rect x="2" y="2" width="96" height="61" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
          
          {/* Stylized 'I' on Left */}
          <path d="M14 14 H28 V51 H14 Z" />
          
          {/* Stylized 'S' in Center */}
          <path d="M34 14 H66 V26 H46 V33 H66 V51 H34 V39 H54 V33 H34 Z" />
          
          {/* Stylized 'I' on Right */}
          <path d="M72 14 H86 V51 H72 Z" />
          
          {/* Horizontal connecting standard bar */}
          <line x1="28" y1="32.5" x2="34" y2="32.5" stroke="currentColor" strokeWidth="4" />
          <line x1="66" y1="32.5" x2="72" y2="32.5" stroke="currentColor" strokeWidth="4" />
        </svg>
      </div>

      {/* Bottom: CM/L License Number */}
      <span className={`font-mono font-bold text-slate-800 tracking-wider text-center ${dimensions.textBot} mt-1`}>
        {cmlNumber.toUpperCase()}
      </span>
    </div>
  );
}
