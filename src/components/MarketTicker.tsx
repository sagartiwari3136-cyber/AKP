import { TrendingUp, TrendingDown, Clock, Globe } from 'lucide-react';
import { INITIAL_MARKETS } from '../data/initialData';

export function MarketTicker() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-[#FAF8F5] text-zinc-700 text-xs border-b border-zinc-200 px-4 py-1.5 flex items-center justify-between overflow-hidden select-none">
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1.5 text-red-700 font-bold tracking-wide">
          <Globe className="w-3.5 h-3.5 text-red-600" />
          <span className="font-hindi-brand text-zinc-900 font-bold">आज का प्रहरी • राष्ट्रीय एवं वैश्विक संस्करण</span>
        </div>
        <span className="text-zinc-300 hidden sm:inline">|</span>
        <div className="flex items-center gap-1.5 text-zinc-500 hidden sm:flex font-mono-data text-[11px]">
          <Clock className="w-3 h-3 text-red-600" />
          <span>नई दिल्ली 19:46 • London 14:19 • NY 09:19 • Tokyo 23:19</span>
        </div>
      </div>

      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar font-mono-data text-[11px] pl-4">
        {INITIAL_MARKETS.map((item) => (
          <div key={item.symbol} className="flex items-center gap-1.5 shrink-0">
            <span className="text-zinc-500 font-bold">{item.symbol}</span>
            <span className="text-zinc-900 font-bold">{item.price}</span>
            <span
              className={`flex items-center text-[10px] font-bold ${
                item.isPositive ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {item.isPositive ? (
                <TrendingUp className="w-2.5 h-2.5 mr-0.5 inline" />
              ) : (
                <TrendingDown className="w-2.5 h-2.5 mr-0.5 inline" />
              )}
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
