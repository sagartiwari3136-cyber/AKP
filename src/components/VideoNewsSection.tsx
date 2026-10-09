import React, { useState } from 'react';
import { Play, Eye, Clock, Volume2, VolumeX, Maximize2, Sparkles, Film, ChevronRight } from 'lucide-react';
import { VideoNewsItem } from '../types';
import { INITIAL_VIDEO_NEWS } from '../data/editorsAndMediaData';

export function VideoNewsSection() {
  const [selectedVideo, setSelectedVideo] = useState<VideoNewsItem>(INITIAL_VIDEO_NEWS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <section id="video-news-section" className="mb-12 border-b border-[#DCDAD0] pb-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-red-700 pb-2.5 mb-6 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-6 bg-red-700 rounded-xs shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-hindi-brand text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
                वीडियो समाचार एवं विशेष बुलेटिन
              </h2>
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-hindi-brand font-bold flex items-center gap-1">
                <Play className="w-3 h-3 fill-current" />
                <span>वीडियो गैलरी</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-hindi-brand mt-0.5">
              प्राइम टाइम शो, ग्राउंड रिपोर्टिंग व विशेष साक्षात्कार के एक्सक्लूसिव वीडियो
            </p>
          </div>
        </div>
      </div>

      {/* Main Video Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Main Featured Video Player (7 Cols) */}
        <div className="lg:col-span-7 bg-zinc-900 rounded-2xl overflow-hidden shadow-lg border border-zinc-800">
          <div className="relative aspect-16/9 bg-black flex items-center justify-center group">
            {isPlaying ? (
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                muted={isMuted}
                className="w-full h-full object-contain"
                poster={selectedVideo.thumbnailUrl}
              />
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={selectedVideo.thumbnailUrl}
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                {/* Big Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer ring-4 ring-white/30"
                  >
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />
                  </button>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                  {selectedVideo.duration}
                </div>

                {/* Top Left Tag */}
                {selectedVideo.tag && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold font-hindi-brand px-2.5 py-1 rounded shadow-md">
                    {selectedVideo.tag}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Video Metadata Panel */}
          <div className="p-4 sm:p-5 bg-zinc-950 text-white">
            <div className="flex items-center gap-2 text-xs text-red-400 font-hindi-brand font-bold mb-2">
              <span>{selectedVideo.category}</span>
              <span>•</span>
              <span className="text-zinc-400 font-normal">{selectedVideo.publishedAt}</span>
              <span>•</span>
              <span className="text-zinc-400 font-normal flex items-center gap-1">
                <Eye className="w-3 h-3" /> {selectedVideo.views} व्यूज
              </span>
            </div>

            <h3 className="font-hindi-brand font-bold text-lg sm:text-xl text-white leading-snug mb-2.5">
              {selectedVideo.title}
            </h3>

            {selectedVideo.description && (
              <p className="text-xs sm:text-sm text-zinc-400 font-hindi-brand line-clamp-2 leading-relaxed mb-4">
                {selectedVideo.description}
              </p>
            )}

            {/* Anchor Info */}
            {selectedVideo.anchor && (
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs">
                <div className="flex items-center gap-2.5">
                  {selectedVideo.anchorAvatar && (
                    <img
                      src={selectedVideo.anchorAvatar}
                      alt={selectedVideo.anchor}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div>
                    <div className="text-zinc-200 font-hindi-brand font-bold">
                      प्रस्तोता: {selectedVideo.anchor}
                    </div>
                    <div className="text-zinc-500 text-[11px] font-hindi-brand">वरिष्ठ एंकर, आज का प्रहरी</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-red-950/80 text-red-300 border border-red-800/50 px-2 py-0.5 rounded font-hindi-brand">
                    HD 1080p
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Video Playlist / More Videos (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-[#FAF9F5] p-3 rounded-xl border border-zinc-200 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-800 font-hindi-brand flex items-center gap-1.5">
              <Film className="w-4 h-4 text-red-700" />
              <span>ट्रेंडिंग एवं हालिया वीडियो रिपोर्ट्स</span>
            </span>
            <span className="text-[11px] font-hindi-brand text-zinc-500">
              {INITIAL_VIDEO_NEWS.length} वीडियो
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {INITIAL_VIDEO_NEWS.map((video) => {
              const isCurrent = video.id === selectedVideo.id;
              return (
                <div
                  key={video.id}
                  onClick={() => {
                    setSelectedVideo(video);
                    setIsPlaying(true);
                  }}
                  className={`group cursor-pointer p-2.5 rounded-xl border transition-all flex gap-3 items-start ${
                    isCurrent
                      ? 'bg-red-50/70 border-red-300 shadow-xs'
                      : 'bg-white border-zinc-200 hover:border-red-200 hover:bg-zinc-50'
                  }`}
                >
                  <div className="relative w-28 h-18 rounded-lg overflow-hidden shrink-0 bg-black">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10">
                      <div className="w-7 h-7 bg-red-600/90 text-white rounded-full flex items-center justify-center shadow-xs">
                        <Play className="w-3.5 h-3.5 fill-current translate-x-0.2" />
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono px-1 py-0.2 rounded">
                      {video.duration}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-hindi-brand text-xs sm:text-[13px] font-semibold leading-snug line-clamp-2 mb-1 ${
                        isCurrent ? 'text-red-700 font-bold' : 'text-zinc-900 group-hover:text-red-700'
                      }`}
                    >
                      {video.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-hindi-brand">
                      {video.anchor && <span>{video.anchor}</span>}
                      <span>•</span>
                      <span>{video.views} व्यूज</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
