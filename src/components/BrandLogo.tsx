import React from 'react';

interface BrandLogoProps {
  variant?: 'masthead' | 'navbar' | 'badge' | 'mini' | 'circle' | 'footer';
  className?: string;
  onClick?: () => void;
  showTagline?: boolean;
  theme?: 'light' | 'dark';
}

export function BrandLogo({
  variant = 'navbar',
  className = '',
  onClick,
  showTagline = true,
  theme = 'light',
}: BrandLogoProps) {
  // Circular NDTV/AKP Style Red Badge Logo
  if (variant === 'circle') {
    const isDark = theme === 'dark';
    return (
      <div
        onClick={onClick}
        className={`relative flex items-center gap-2.5 select-none group ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-[#991B1B] via-[#DC2626] to-[#EF4444] flex flex-col items-center justify-center shadow-md border-2 border-white group-hover:scale-105 transition-transform shrink-0">
          <span className="text-[7px] font-black tracking-widest text-amber-200 uppercase leading-none font-mono-data">
            AKP
          </span>
          <span className="text-[9px] font-hindi-brand font-black text-white leading-none mt-0.5">
            प्रहरी
          </span>
          <span className="text-[6px] font-extrabold text-amber-300 tracking-tighter uppercase font-mono-data">
            NEWS
          </span>
        </div>
        <div className="flex flex-col">
          <div className={`font-hindi-brand font-black text-lg leading-none tracking-tight flex items-center gap-1 ${isDark ? 'text-white' : 'text-zinc-950'}`}>
            <span>आज का</span>
            <span className="text-red-700">प्रहरी</span>
          </div>
          <span className={`text-[9px] font-extrabold tracking-widest uppercase font-mono-data mt-0.5 ${isDark ? 'text-amber-200' : 'text-zinc-500'}`}>
            AKP INDIA • 24x7
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'mini') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center gap-2 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#B91C1C] via-[#DC2626] to-[#EF4444] flex flex-col items-center justify-center shadow-xs border border-amber-300/40 shrink-0">
          <span className="text-[7px] font-black text-amber-200 leading-none">AKP</span>
          <span className="text-[8px] font-hindi-brand font-black text-white leading-none">प्रहरी</span>
        </div>
        <div className="flex flex-col">
          <div className="font-hindi-brand font-black text-sm leading-tight text-zinc-900">
            <span>आज का </span>
            <span className="text-[#C62828]">प्रहरी</span>
          </div>
          <span className="text-[8px] font-bold tracking-widest text-zinc-500 uppercase font-mono-data">
            AKP NEWS
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        onClick={onClick}
        className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-[#991B1B] via-[#DC2626] to-[#B91C1C] p-2.5 text-white shadow-md border-2 border-amber-400/40 select-none ${
          onClick ? 'cursor-pointer hover:scale-[1.02] transition-transform' : ''
        } ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black/30 border border-amber-300/50 flex flex-col items-center justify-center shrink-0">
            <span className="text-[8px] font-black text-amber-300">AKP</span>
            <span className="text-[9px] font-hindi-brand font-black text-white">प्रहरी</span>
          </div>
          <div>
            <div className="font-hindi-brand font-black text-lg leading-none tracking-tight">
              <span className="text-white">आज का </span>
              <span className="text-amber-300">प्रहरी</span>
            </div>
            <div className="text-[9px] text-amber-200 font-bold uppercase tracking-wider font-mono-data mt-0.5">
              Aaj Ka Prahari • AKP News
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#991B1B] via-[#DC2626] to-[#EF4444] flex flex-col items-center justify-center shadow-lg border-2 border-amber-300/60 shrink-0">
        <span className="text-[8px] font-black tracking-widest text-amber-200 font-mono-data">AKP</span>
        <span className="text-[10px] font-hindi-brand font-black text-white">प्रहरी</span>
      </div>
      <div className="flex flex-col">
        <div className="font-hindi-brand font-black text-2xl leading-none tracking-tight text-zinc-950">
          <span>आज का </span>
          <span className="text-[#C62828]">प्रहरी</span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-bold text-rose-900 font-hindi-brand mt-0.5">
            सत्यमेव जयते • निष्पक्ष पत्रकारिता
          </span>
        )}
      </div>
    </div>
  );
}
