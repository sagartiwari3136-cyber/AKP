import { useState, useEffect } from 'react';
import { Radio, ChevronRight, Volume2, VolumeX, Sparkles, Flame } from 'lucide-react';
import { LiveUpdate } from '../types';

interface BreakingTickerProps {
  updates: LiveUpdate[];
  onOpenLiveFeed: () => void;
  onSelectUpdate: (update: LiveUpdate) => void;
}

export function BreakingTicker({ updates, onOpenLiveFeed, onSelectUpdate }: BreakingTickerProps) {
  const breakingItems = updates.filter((u) => u.isBreaking);
  const items = breakingItems.length > 0 ? breakingItems : updates;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) return null;

  const current = items[currentIndex];

  return (
    <div className="bg-gradient-to-r from-[#991B1B] via-[#B91C1C] to-[#881337] text-white px-4 py-2 flex items-center justify-between text-xs sm:text-sm border-b border-red-950 shadow-inner">
      <div className="flex items-center gap-3 overflow-hidden flex-1 mr-3">
        {/* Breaking Badge */}
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded text-amber-300 font-extrabold uppercase tracking-wider text-[11px] shrink-0 border border-amber-400/30">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
          </span>
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-hindi-brand">ताज़ा खबर / BREAKING</span>
        </div>

        {/* Current News Item */}
        <button
          onClick={() => onSelectUpdate(current)}
          className="truncate text-left font-medium hover:underline hover:text-amber-100 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="bg-black/30 px-1.5 py-0.5 rounded text-[10px] font-mono-data tracking-tight text-amber-200 border border-amber-300/20">
            {current.timestamp}
          </span>
          <span className="truncate font-hindi-brand font-semibold text-white">
            {current.title}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenLiveFeed}
          className="bg-amber-400 hover:bg-amber-300 text-zinc-950 px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs font-hindi-brand"
        >
          <span>सभी बुलेटिन ({updates.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
