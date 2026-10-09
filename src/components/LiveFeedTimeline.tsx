import { useState } from 'react';
import {
  Radio,
  X,
  RefreshCw,
  Flame,
  CheckCircle2,
  Share2,
  Clock,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';
import { LiveUpdate } from '../types';

interface LiveFeedTimelineProps {
  isOpen: boolean;
  onClose: () => void;
  updates: LiveUpdate[];
  onSelectUpdate: (update: LiveUpdate) => void;
  onSelectArticleById?: (articleId: string) => void;
  onOpenCmsBroadcast?: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function LiveFeedTimeline({
  isOpen,
  onClose,
  updates,
  onSelectUpdate,
  onSelectArticleById,
  onOpenCmsBroadcast,
  onRefresh,
  isRefreshing = false,
}: LiveFeedTimelineProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('सभी');
  const [breakingOnly, setBreakingOnly] = useState<boolean>(false);

  if (!isOpen) return null;

  const categories = ['सभी', 'देश', 'शहर', 'क्रिकेट', 'विदेश', 'कारोबार', 'तकनीक', 'मनोरंजन'];

  const filteredUpdates = updates.filter((item) => {
    if (breakingOnly && !item.isBreaking) return false;
    if (selectedCategory !== 'सभी' && item.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF9F5] border border-zinc-300 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#0B1E1D] text-white px-6 py-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600"></span>
            </span>
            <div>
              <h2 className="font-hindi-brand text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-500" />
                <span>आज का प्रहरी • 24x7 लाइव वायर ब्रेकिंग</span>
              </h2>
              <p className="text-xs text-zinc-300 font-hindi-brand">
                सीधे न्यूज़रूम से प्रति मिनट सत्यापित ताजा अपडेट
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 text-zinc-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="ताजा अपडेट लोड करें"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-red-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white border-b border-zinc-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[11px] mr-1 font-hindi-brand">
              डेस्क:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer font-hindi-brand ${
                  selectedCategory === cat
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-zinc-700 font-bold font-hindi-brand">
              <input
                type="checkbox"
                checked={breakingOnly}
                onChange={(e) => setBreakingOnly(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 accent-red-600"
              />
              <span className="flex items-center gap-1 text-red-700">
                <Flame className="w-3.5 h-3.5 fill-red-600" /> केवल ब्रेकिंग
              </span>
            </label>

            {onOpenCmsBroadcast && (
              <button
                onClick={onOpenCmsBroadcast}
                className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-red-700 hover:text-red-900 bg-red-50 px-2 py-1 rounded border border-red-200 transition-colors font-hindi-brand"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>लाइव बुलेटिन जोड़ें</span>
              </button>
            )}
          </div>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredUpdates.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 font-hindi-brand">
              इस श्रेणी में कोई लाइव अपडेट उपलब्ध नहीं है।
            </div>
          ) : (
            filteredUpdates.map((item, index) => (
              <div key={item.id} className="relative flex gap-4 group">
                {/* Vertical Timeline Track */}
                {index !== filteredUpdates.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-zinc-200 -z-1" />
                )}

                {/* Timeline Node */}
                <div className="shrink-0 pt-0.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      item.isBreaking
                        ? 'bg-red-600 border-red-300 text-white shadow-md animate-pulse'
                        : 'bg-white border-zinc-300 text-zinc-700'
                    }`}
                  >
                    {item.isBreaking ? (
                      <Flame className="w-4 h-4 fill-white" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>

                {/* Event Card */}
                <div
                  onClick={() => onSelectUpdate(item)}
                  className={`flex-1 p-4 rounded-xl border transition-all cursor-pointer ${
                    item.isBreaking
                      ? 'bg-red-50/70 border-red-200 hover:border-red-400'
                      : 'bg-white border-zinc-200 hover:border-zinc-400 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-data text-xs font-bold text-red-700">
                        {item.timestamp}
                      </span>
                      <span className="text-zinc-300">•</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded font-hindi-brand">
                        {item.category}
                      </span>
                      {item.location && (
                        <span className="text-[11px] text-zinc-500 font-hindi-brand hidden sm:inline">
                          [{item.location}]
                        </span>
                      )}
                    </div>

                    {item.verified && (
                      <span
                        className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-hindi-brand"
                        title="AKP फैक्ट-चेक एवं न्यूज़रूम द्वारा सत्यापित"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> सत्यापित
                      </span>
                    )}
                  </div>

                  <h3 className="font-hindi-brand text-sm sm:text-base font-bold text-zinc-900 leading-snug mb-1 group-hover:text-red-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-zinc-700 text-xs sm:text-sm leading-relaxed mb-3 font-hindi-brand">
                    {item.content}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 font-hindi-brand">
                    <span>
                      रिपोर्टर:{' '}
                      <strong className="text-zinc-800">
                        {item.author || 'AKP ब्यूरो डेस्क'}
                      </strong>
                    </span>

                    {item.linkArticleId && onSelectArticleById && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectArticleById(item.linkArticleId!);
                        }}
                        className="text-red-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <span>विस्तृत रिपोर्ट पढ़ें</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="bg-zinc-100 border-t border-zinc-200 px-6 py-3 text-xs text-zinc-600 flex items-center justify-between font-hindi-brand">
          <span>आज का प्रहरी (AKP) • डिजिटल समाचार प्रसारण नेटवर्क</span>
          <button
            onClick={onClose}
            className="text-zinc-700 hover:text-zinc-950 font-bold underline cursor-pointer"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
}
