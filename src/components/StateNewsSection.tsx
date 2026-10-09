import React, { useState } from 'react';
import { MapPin, ChevronRight, Clock, User, Sparkles, Building2, Flame } from 'lucide-react';
import { MajorState, StateNewsItem, Article } from '../types';
import { INITIAL_STATE_NEWS } from '../data/editorsAndMediaData';

interface StateNewsSectionProps {
  onSelectArticle: (article: Article) => void;
}

const STATES_LIST: { id: MajorState; label: string; icon: string; highlightCity: string; weather: string }[] = [
  { id: 'दिल्ली', label: 'दिल्ली-NCR', icon: '🏛️', highlightCity: 'नई दिल्ली', weather: '32°C धूप' },
  { id: 'महाराष्ट्र', label: 'महाराष्ट्र', icon: '🌊', highlightCity: 'मुंबई, पुणे', weather: '28°C हल्की बारिश' },
  { id: 'उत्तर प्रदेश', label: 'उत्तर प्रदेश', icon: '🚩', highlightCity: 'लखनऊ, नोएडा, काशी', weather: '31°C साफ मौसम' },
  { id: 'बिहार', label: 'बिहार', icon: '🌾', highlightCity: 'पटना, गया, दरभंगा', weather: '30°C उमस' },
  { id: 'पंजाब', label: 'पंजाब', icon: '🌾', highlightCity: 'मोहाली, अमृतसर', weather: '29°C हवादार' },
];

export function StateNewsSection({ onSelectArticle }: StateNewsSectionProps) {
  const [activeState, setActiveState] = useState<MajorState>('दिल्ली');

  const stateNewsList = INITIAL_STATE_NEWS[activeState] || [];
  const headlineItem = stateNewsList.find((item) => item.isHeadline) || stateNewsList[0];
  const otherItems = stateNewsList.filter((item) => item.id !== headlineItem?.id);

  const handleOpenNews = (item: StateNewsItem) => {
    // Map StateNewsItem to Article interface for the reader modal
    const article: Article = {
      id: item.id,
      title: item.title,
      slug: item.id,
      summary: item.summary,
      content: item.content || item.summary,
      category: 'शहर',
      author: {
        name: item.reporter,
        role: `${item.state} ब्यूरो संवाददाता`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
      },
      publishedAt: item.publishedAt,
      readTime: item.readTime,
      imageUrl: item.imageUrl,
      tags: item.tags || [item.state, item.city],
      views: 1420,
      likes: 0,
      commentsCount: 0,
      status: 'published',
    };
    onSelectArticle(article);
  };

  return (
    <section id="state-news-section" className="mb-12 border-b border-[#DCDAD0] pb-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-red-700 pb-2.5 mb-6 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-6 bg-red-700 rounded-xs shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-hindi-brand text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
                राज्यवार समाचार एवं प्रादेशिक खबरें
              </h2>
              <span className="bg-red-50 text-red-800 border border-red-200 text-xs px-2 py-0.5 rounded font-hindi-brand font-bold">
                5 प्रमुख राज्य
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-hindi-brand mt-0.5">
              दिल्ली, महाराष्ट्र, उत्तर प्रदेश, बिहार व पंजाब के जिलों की ज़मीनी रिपोर्ट
            </p>
          </div>
        </div>

        {/* State Selector Quick Badge */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-hindi-brand">
          <MapPin className="w-3.5 h-3.5 text-red-700" />
          <span>चुना गया राज्य: </span>
          <span className="font-bold text-red-700 font-hindi-brand">{activeState}</span>
        </div>
      </div>

      {/* State Switcher Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        {STATES_LIST.map((st) => {
          const isActive = activeState === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setActiveState(st.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-hindi-brand font-bold transition-all shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-red-700 text-white border-red-700 shadow-sm'
                  : 'bg-white text-zinc-700 border-zinc-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
              }`}
            >
              <span>{st.icon}</span>
              <span>{st.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-sans font-normal ${
                  isActive ? 'bg-red-800 text-red-100' : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {st.weather}
              </span>
            </button>
          );
        })}
      </div>

      {/* State Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Big Featured State Story (7 Cols) */}
        {headlineItem && (
          <div
            className="lg:col-span-7 group cursor-pointer bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            onClick={() => handleOpenNews(headlineItem)}
          >
            <div className="relative aspect-16/9 bg-zinc-100 overflow-hidden">
              <img
                src={headlineItem.imageUrl}
                alt={headlineItem.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-red-700 text-white text-xs font-bold px-2.5 py-1 rounded shadow-md font-hindi-brand flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{headlineItem.city} • प्रमुख खबर</span>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex items-center justify-between text-white text-xs">
                <span className="font-hindi-brand font-medium text-amber-300">
                  {headlineItem.reporter}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-300" />
                  <span>{headlineItem.readTime}</span>
                </span>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-hindi-brand font-bold text-lg sm:text-xl lg:text-2xl text-zinc-950 group-hover:text-red-700 transition-colors leading-snug mb-2.5">
                {headlineItem.title}
              </h3>
              <p className="text-zinc-600 text-sm font-hindi-brand line-clamp-3 leading-relaxed mb-4">
                {headlineItem.summary}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                <div className="flex flex-wrap gap-1.5">
                  {headlineItem.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-zinc-100 text-zinc-600 text-[11px] px-2 py-0.5 rounded font-hindi-brand"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-bold text-red-700 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-hindi-brand">
                  <span>पूरी खबर पढ़ें</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Right: Sub-stories Grid within State (5 Cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-zinc-200/80 mb-1 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-800 font-hindi-brand flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-red-700" />
              <span>{activeState} के अन्य प्रमुख शहरों से रिपोर्ट</span>
            </span>
            <span className="text-[11px] font-hindi-brand text-zinc-500">
              {otherItems.length} अन्य खबरें
            </span>
          </div>

          {otherItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenNews(item)}
              className="group cursor-pointer bg-white p-3.5 rounded-xl border border-zinc-200 hover:border-red-300 hover:shadow-xs transition-all flex gap-3.5 items-start"
            >
              <div className="relative w-28 h-20 sm:w-32 sm:h-22 rounded-lg overflow-hidden shrink-0 bg-zinc-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 left-1 bg-black/75 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded font-hindi-brand">
                  {item.city}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-hindi-brand text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug mb-1.5">
                  {item.title}
                </h4>
                <p className="text-[11px] text-zinc-500 font-hindi-brand line-clamp-1 mb-2">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-hindi-brand">
                  <span>{item.reporter.split(',')[0]}</span>
                  <span>{item.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
