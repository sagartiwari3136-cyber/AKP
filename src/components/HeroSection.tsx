import React, { useState } from 'react';
import {
  Flame,
  Volume2,
  VolumeX,
  Radio,
  Play,
  Share2,
  CloudSun,
  Tv,
} from 'lucide-react';
import { Article, LiveUpdate } from '../types';

interface HeroSectionProps {
  leadArticle?: Article;
  articles: Article[];
  liveUpdates: LiveUpdate[];
  onSelectArticle: (article: Article) => void;
  onSelectLiveUpdate: (update: LiveUpdate) => void;
  onOpenLiveFeed: () => void;
}

export function HeroSection({
  leadArticle,
  articles,
  liveUpdates,
  onSelectArticle,
  onOpenLiveFeed,
}: HeroSectionProps) {
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isPlayingLive, setIsPlayingLive] = useState(false);

  // Find specific articles matching the layout or fallback gracefully
  const mohaliArticle = articles.find((a) => a.id === 'art-mohali-1') || leadArticle;
  const jpscArticle = articles.find((a) => a.id === 'art-jpsc-dispute') || articles[1];
  const mumbaiArticle = articles.find((a) => a.id === 'art-mumbai-local') || articles[2];
  const scstArticle = articles.find((a) => a.id === 'art-sc-st-verdict') || articles[3];
  const turkeyArticle = articles.find((a) => a.id === 'art-israel-syria-turkey') || articles[4];
  const lucknowArticle = articles.find((a) => a.id === 'art-lucknow-case') || articles[5];
  const joeRootArticle = articles.find((a) => a.id === 'art-joe-root') || articles[6];
  const delhi2047Article = articles.find((a) => a.id === 'art-delhi-2047') || articles[7];

  // Bottom 3 stories
  const anthemArticle = articles.find((a) => a.id === 'art-british-singer-anthem') || articles[8];
  const rishiKapoorArticle = articles.find((a) => a.id === 'art-rishi-kapoor-song') || articles[9];
  const gangulyArticle = articles.find((a) => a.id === 'art-ganguly-bowler') || articles[10];

  if (!mohaliArticle) return null;

  return (
    <section className="bg-white text-zinc-900 p-3 sm:p-5 lg:p-6 rounded-2xl shadow-sm border border-zinc-200 mb-8 select-none">
      {/* ========================================================================= */}
      {/* TOP SECTION: Main Grid Layout (Exact match to provided NDTV India image) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-8 border-b border-zinc-200">
        {/* ------------------------------------------------------------- */}
        {/* COLUMN 1: Large Main Lead Card (Left - 5 Cols) */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-5 group cursor-pointer" onClick={() => onSelectArticle(mohaliArticle)}>
          <div className="relative rounded-xl overflow-hidden aspect-16/10 mb-3 bg-zinc-100 border border-zinc-200 shadow-md">
            <img
              src={mohaliArticle.imageUrl}
              alt={mohaliArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Top-Left Red Circular AKP News Channel Badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-gradient-to-r from-[#991B1B] to-[#DC2626] text-white px-2.5 py-1 rounded-full shadow-md border border-white/40">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="text-[10px] font-hindi-brand font-black tracking-wide">आज का प्रहरी</span>
            </div>

            {/* Bottom Gradient Overlay with Location */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 flex justify-between items-end">
              <span className="text-[11px] font-bold text-amber-300 font-hindi-brand bg-black/60 px-2 py-0.5 rounded">
                मोहाली ब्यूरो रिपोर्ट
              </span>
              <span className="text-[10px] text-zinc-200 font-mono-data">20 अगस्त 2026</span>
            </div>
          </div>

          {/* Big Bold Hindi Lead Headline */}
          <h2 className="font-hindi-brand font-bold text-xl sm:text-2xl lg:text-[26px] leading-[1.3] text-zinc-950 group-hover:text-red-700 transition-colors tracking-tight">
            {mohaliArticle.title}
          </h2>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* COLUMN 2 & 3: Middle Dual Columns Grid (4 Cols) */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Item 1: JPSC-JSSC Dispute with Red Badge */}
          {jpscArticle && (
            <div
              className="group cursor-pointer flex flex-col justify-between"
              onClick={() => onSelectArticle(jpscArticle)}
            >
              <div className="relative rounded-lg overflow-hidden aspect-16/10 mb-2 bg-zinc-100 border border-zinc-200">
                <img
                  src={jpscArticle.imageUrl}
                  alt={jpscArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {/* Top-Right Mini AKP Logo */}
                <div className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                  प्रहरी
                </div>
              </div>
              <div>
                <h3 className="font-hindi-brand text-xs sm:text-[13px] font-semibold text-zinc-900 group-hover:text-red-700 transition-colors leading-snug line-clamp-4">
                  <span className="bg-red-700 text-white font-black text-[10px] px-1.5 py-0.5 rounded mr-1.5 inline-block uppercase">
                    JPSC-JSSC विवाद:
                  </span>
                  सरकार मामले को दबाना चाहती है... हाईकोर्ट के फैसले पर क्या बोले देवेंद्र महतो?
                </h3>
              </div>
            </div>
          )}

          {/* Item 2: Mumbai Local Train Seat Dispute */}
          {mumbaiArticle && (
            <div
              className="group cursor-pointer flex flex-col justify-between"
              onClick={() => onSelectArticle(mumbaiArticle)}
            >
              <div className="relative rounded-lg overflow-hidden aspect-16/10 mb-2 bg-zinc-100 border border-zinc-200">
                <img
                  src={mumbaiArticle.imageUrl}
                  alt={mumbaiArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                  प्रहरी
                </div>
              </div>
              <div>
                <h3 className="font-hindi-brand text-xs sm:text-[13px] font-semibold text-zinc-900 group-hover:text-red-700 transition-colors leading-snug line-clamp-4">
                  {mumbaiArticle.title}
                </h3>
              </div>
            </div>
          )}

          {/* Middle Row Text Stories (Divider Line) */}
          {scstArticle && (
            <div
              className="group cursor-pointer pt-2 sm:pt-3 border-t border-zinc-200"
              onClick={() => onSelectArticle(scstArticle)}
            >
              <h3 className="font-hindi-brand text-xs sm:text-[13px] font-semibold text-zinc-800 group-hover:text-red-700 transition-colors leading-snug">
                {scstArticle.title}
              </h3>
            </div>
          )}

          {turkeyArticle && (
            <div
              className="group cursor-pointer pt-2 sm:pt-3 border-t border-zinc-200"
              onClick={() => onSelectArticle(turkeyArticle)}
            >
              <h3 className="font-hindi-brand text-xs sm:text-[13px] font-semibold text-zinc-800 group-hover:text-red-700 transition-colors leading-snug">
                {turkeyArticle.title}
              </h3>
            </div>
          )}

          {/* Bottom Row Stories with Lucknow Triple Murder Badge & Joe Root */}
          {lucknowArticle && (
            <div
              className="group cursor-pointer pt-2 sm:pt-3 border-t border-zinc-200"
              onClick={() => onSelectArticle(lucknowArticle)}
            >
              <h3 className="font-hindi-brand text-xs sm:text-[13px] font-semibold text-zinc-800 group-hover:text-red-700 transition-colors leading-snug">
                <span className="bg-red-700 text-white font-black text-[10px] px-1.5 py-0.5 rounded mr-1.5 inline-block uppercase">
                  लखनऊ ट्रिपल मर्डर:
                </span>
                पहले से कोर्ट में चल रहा था केस! अब मृतका दिव्या मिश्रा के परिजनों ने खोल दिया यह बड़ा राज
              </h3>
            </div>
          )}

          {joeRootArticle && (
            <div
              className="group cursor-pointer pt-2 sm:pt-3 border-t border-zinc-200"
              onClick={() => onSelectArticle(joeRootArticle)}
            >
              <h3 className="font-hindi-brand text-xs sm:text-[13px] font-semibold text-zinc-800 group-hover:text-red-700 transition-colors leading-snug">
                {joeRootArticle.title}
              </h3>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* COLUMN 3: Right Sidebar - Featured Story & Live TV Player (3 Cols) */}
        {/* ------------------------------------------------------------- */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {/* 1. Featured Mega Story (Delhi Master Plan 2047) */}
          {delhi2047Article && (
            <div
              className="bg-zinc-50 border border-zinc-200 hover:border-zinc-300 p-3 rounded-xl transition-all group cursor-pointer shadow-xs"
              onClick={() => onSelectArticle(delhi2047Article)}
            >
              <div className="text-[10px] text-zinc-500 font-mono-data text-center mb-1 uppercase tracking-widest">
                Advertisement / Featured
              </div>

              <div className="relative rounded-lg overflow-hidden aspect-16/10 mb-3 bg-zinc-100 border border-zinc-200">
                <img
                  src={delhi2047Article.imageUrl}
                  alt={delhi2047Article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {/* Circular Author Inset Icon */}
                <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-md">
                  <img
                    src={delhi2047Article.author.avatar}
                    alt={delhi2047Article.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Orange 'फीचर्ड' Tag Badge */}
                <div className="absolute bottom-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-black text-[10px] px-2 py-0.5 rounded shadow-md font-hindi-brand">
                  फीचर्ड
                </div>
              </div>

              <h3 className="font-hindi-brand text-xs sm:text-sm font-bold text-zinc-900 group-hover:text-red-700 transition-colors leading-snug">
                {delhi2047Article.title}
              </h3>
            </div>
          )}

          {/* 2. Interactive Live TV Broadcast Player Card (NDTV Style) */}
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-md">
            <div className="p-2.5 bg-gradient-to-r from-red-700 via-red-600 to-red-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-1.5 text-xs font-bold font-hindi-brand">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                <span>देखें आज का प्रहरी LIVE</span>
              </div>
              <button
                onClick={() => setIsVideoMuted(!isVideoMuted)}
                className="text-white/80 hover:text-white p-1"
                title={isVideoMuted ? 'ध्वनि चालू करें' : 'ध्वनि म्यूट करें'}
              >
                {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-300" />}
              </button>
            </div>

            {/* Video / Bulletin Box */}
            <div className="relative aspect-16/9 bg-zinc-950 overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=600"
                alt="Mumbai Gateway Live"
                className="w-full h-full object-cover opacity-85"
              />

              {/* Weather Overlay in Video (Mumbai 31°C | 26°C) */}
              <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-xs border border-white/20 rounded-md px-2 py-1 flex items-center gap-2 text-white">
                <div className="flex flex-col text-right">
                  <span className="text-[8px] text-amber-300 font-hindi-brand font-bold">मौसम अपडेट</span>
                  <span className="text-[10px] font-bold font-hindi-brand">मुंबई</span>
                </div>
                <div className="flex items-center gap-1 font-mono-data text-xs font-bold text-white">
                  <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                  <span>31°</span>
                  <span className="text-zinc-300 text-[10px]">26°</span>
                </div>
              </div>

              {/* Central Play Trigger */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                <button
                  onClick={onOpenLiveFeed}
                  className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                  title="लाइव वायर बुलेटिन देखें"
                >
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </button>
              </div>

              {/* Channel Watermark Logo */}
              <div className="absolute bottom-2 right-2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-xs">
                प्रहरी LIVE
              </div>
            </div>

            {/* Anchor Night Bulletin Banner Promo */}
            <div
              onClick={onOpenLiveFeed}
              className="p-2.5 bg-amber-50/70 hover:bg-amber-100/70 border-t border-amber-200/60 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 shrink-0 shadow-xs">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                    alt="Anchor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-[11px] font-black text-amber-950 font-hindi-brand leading-none">
                    भारत की बात • आशुतोष के साथ
                  </div>
                  <div className="text-[10px] text-zinc-600 font-hindi-brand mt-0.5">
                    देश, दिल्ली, पंजाब, हरियाणा, महाराष्ट्र में भारी अलर्ट
                  </div>
                </div>
              </div>
              <span className="bg-red-700 text-white text-[9px] font-bold px-2 py-0.5 rounded shrink-0 font-hindi-brand shadow-2xs">
                रात 11 बजे
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM SECTION: 3 Highlight Cards (Exact match to the 3 cards in image) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {/* Card 1: British Singer Singing Jana Gana Mana & Pak Anthem */}
        {anthemArticle && (
          <div
            className="group cursor-pointer flex flex-col justify-between"
            onClick={() => onSelectArticle(anthemArticle)}
          >
            <div className="relative rounded-xl overflow-hidden aspect-16/10 mb-3 bg-zinc-100 border border-zinc-200 shadow-xs">
              <img
                src={anthemArticle.imageUrl}
                alt={anthemArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                प्रहरी
              </div>
            </div>
            <h3 className="font-hindi-brand text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-red-700 transition-colors leading-snug">
              {anthemArticle.title}
            </h3>
          </div>
        )}

        {/* Card 2: 71-Year Old Rishi Kapoor Song with Raj Kapoor & Nargis */}
        {rishiKapoorArticle && (
          <div
            className="group cursor-pointer flex flex-col justify-between"
            onClick={() => onSelectArticle(rishiKapoorArticle)}
          >
            <div className="relative rounded-xl overflow-hidden aspect-16/10 mb-3 bg-zinc-100 border border-zinc-200 shadow-xs">
              <img
                src={rishiKapoorArticle.imageUrl}
                alt={rishiKapoorArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter grayscale"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-xs font-hindi-brand">
                सिनेमा
              </div>
            </div>
            <h3 className="font-hindi-brand text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-red-700 transition-colors leading-snug">
              {rishiKapoorArticle.title}
            </h3>
          </div>
        )}

        {/* Card 3: Sourav Ganguly 500-Wicket Fast Bowler Statement */}
        {gangulyArticle && (
          <div
            className="group cursor-pointer flex flex-col justify-between"
            onClick={() => onSelectArticle(gangulyArticle)}
          >
            <div className="relative rounded-xl overflow-hidden aspect-16/10 mb-3 bg-zinc-100 border border-zinc-200 shadow-xs">
              <img
                src={gangulyArticle.imageUrl}
                alt={gangulyArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-xs font-hindi-brand">
                क्रिकेट
              </div>
            </div>
            <h3 className="font-hindi-brand text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-red-700 transition-colors leading-snug">
              {gangulyArticle.title}
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}
