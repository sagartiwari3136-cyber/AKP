import React, { useState } from 'react';
import { Users, Award, Tv, Mic, X, ChevronRight, Sparkles } from 'lucide-react';
import { EditorAnchor } from '../types';
import { INITIAL_EDITORS_ANCHORS } from '../data/editorsAndMediaData';

export function EditorsSection() {
  const [selectedEditor, setSelectedEditor] = useState<EditorAnchor | null>(null);

  return (
    <section id="editors-section" className="mb-12 border-b border-[#DCDAD0] pb-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-red-700 pb-2.5 mb-6 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-6 bg-red-700 rounded-xs shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-hindi-brand text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
                प्रमुख संपादक एवं एंकर्स
              </h2>
              <span className="bg-red-50 text-red-800 border border-red-200 text-xs px-2 py-0.5 rounded font-hindi-brand font-bold flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>संपादकीय टीम</span>
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-hindi-brand mt-0.5">
              विश्वसनीय और निष्पक्ष पत्रकारिता का चेहरा — हमारे वरिष्ठ संपादकीय स्तंभकार व एंकर्स
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Editor Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {INITIAL_EDITORS_ANCHORS.map((editor) => (
          <div
            key={editor.id}
            onClick={() => setSelectedEditor(editor)}
            className="group cursor-pointer bg-white rounded-xl border border-zinc-200 hover:border-red-400 hover:shadow-md transition-all overflow-hidden flex flex-col text-center"
          >
            {/* Anchor Photo */}
            <div className="relative aspect-square overflow-hidden bg-zinc-100">
              <img
                src={editor.imageUrl}
                alt={editor.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                <span className="text-white text-[11px] font-hindi-brand font-bold bg-red-600/90 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>प्रोफाइल देखें</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>

              {/* Show Name Pill */}
              {editor.showName && (
                <div className="absolute top-2 left-2 bg-black/75 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full font-hindi-brand backdrop-blur-xs flex items-center gap-1">
                  <Tv className="w-2.5 h-2.5" />
                  <span>{editor.showName.split(' ')[0]}</span>
                </div>
              )}
            </div>

            {/* Anchor Details */}
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-hindi-brand font-bold text-sm sm:text-base text-zinc-950 group-hover:text-red-700 transition-colors leading-tight mb-1">
                  {editor.name}
                </h3>
                <p className="text-[11px] text-zinc-600 font-hindi-brand line-clamp-2 leading-tight">
                  {editor.role}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] text-zinc-400 font-hindi-brand">
                <span className="text-red-700 font-semibold">{editor.experience}</span>
                {editor.twitter && <span>{editor.twitter}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Bio Modal */}
      {selectedEditor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-200 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-red-800 to-red-600 text-white p-5 flex items-start gap-4">
              <img
                src={selectedEditor.imageUrl}
                alt={selectedEditor.name}
                className="w-20 h-20 rounded-xl object-cover object-top border-2 border-white shadow-md shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 pr-6">
                <h3 className="text-xl font-bold font-hindi-brand">{selectedEditor.name}</h3>
                <p className="text-amber-200 text-xs font-hindi-brand font-medium mt-0.5">
                  {selectedEditor.role}
                </p>
                {selectedEditor.showName && (
                  <div className="flex items-center gap-1.5 text-xs text-white/90 font-hindi-brand mt-1.5">
                    <Mic className="w-3.5 h-3.5 text-amber-300" />
                    <span>प्रमुख शो: <strong>{selectedEditor.showName}</strong></span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedEditor(null)}
                className="absolute top-4 right-4 p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-hindi-brand mb-1">
                  परिचय एवं संपादकीय अनुभव
                </h4>
                <p className="text-zinc-700 text-sm font-hindi-brand leading-relaxed">
                  {selectedEditor.bio}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-200 text-xs font-hindi-brand">
                <div>
                  <span className="text-zinc-500 block">अनुभव:</span>
                  <span className="font-bold text-zinc-900">{selectedEditor.experience}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">डिजिटल हैंडल:</span>
                  <span className="font-bold text-red-700">{selectedEditor.twitter}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedEditor(null)}
                  className="bg-red-700 hover:bg-red-800 text-white font-hindi-brand text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  बंद करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
