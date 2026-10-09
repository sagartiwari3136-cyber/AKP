import React from 'react';
import { Clock, Eye } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  key?: React.Key;
  article: Article;
  onSelect: (article: Article) => void;
  variant?: 'featured' | 'standard' | 'compact' | 'opinion' | 'horizontal';
}

export function ArticleCard({
  article,
  onSelect,
  variant = 'standard',
}: ArticleCardProps) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('hi-IN', {
    month: 'short',
    day: 'numeric',
  });

  if (variant === 'opinion') {
    return (
      <article
        onClick={() => onSelect(article)}
        className="bg-white border border-[#E5E3D8] hover:border-red-600/40 p-5 rounded-xl transition-all shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-11 h-11 rounded-full object-cover border border-zinc-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="text-xs font-bold text-zinc-900 font-hindi-brand">{article.author.name}</h4>
              <p className="text-[11px] text-zinc-500 font-hindi-brand">{article.author.role}</p>
            </div>
          </div>

          <div className="inline-block text-[10px] font-bold uppercase tracking-wider text-red-700 font-hindi-brand mb-2 bg-red-50 px-2 py-0.5 rounded">
            संपादकीय विचार • {article.subCategory || article.category}
          </div>

          <h3 className="font-hindi-brand text-base sm:text-lg font-bold text-zinc-900 group-hover:text-red-700 transition-colors leading-snug mb-2">
            "{article.title}"
          </h3>

          <p className="text-zinc-600 text-xs sm:text-sm line-clamp-3 leading-relaxed font-hindi-brand">
            {article.summary}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 text-[11px] text-zinc-400 font-hindi-brand">
          <div className="flex items-center gap-2">
            <span>{article.readTime}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1 text-zinc-400">
            <Eye className="w-3.5 h-3.5" />
            <span className="font-mono-data">{article.views || 1200}</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article
        onClick={() => onSelect(article)}
        className="bg-white border border-[#E5E3D8] hover:border-red-600/40 p-4 rounded-xl transition-all shadow-2xs hover:shadow-md cursor-pointer flex flex-col sm:flex-row gap-4 group"
      >
        <div className="sm:w-1/3 shrink-0 overflow-hidden rounded-lg relative aspect-16/10 sm:aspect-auto">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          {article.isBreaking && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs uppercase tracking-wider font-hindi-brand">
              ताज़ा खबर
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-red-700 font-hindi-brand mb-1.5">
              <span>{article.category}</span>
              {article.subCategory && (
                <>
                  <span className="text-zinc-300">•</span>
                  <span className="text-zinc-500 font-medium">
                    {article.subCategory}
                  </span>
                </>
              )}
            </div>

            <h3 className="font-hindi-brand text-sm sm:text-base font-bold text-zinc-900 group-hover:text-red-700 transition-colors leading-snug mb-1.5">
              {article.title}
            </h3>

            <p className="text-zinc-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3 font-hindi-brand">
              {article.summary}
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100 font-hindi-brand">
            <div className="flex items-center gap-2">
              <span className="font-medium text-zinc-800">{article.author.name}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>

            <div className="flex items-center gap-1 text-zinc-400">
              <Eye className="w-3.5 h-3.5" />
              <span className="font-mono-data">{article.views}</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard Card
  return (
    <article
      onClick={() => onSelect(article)}
      className="bg-white border border-[#E5E3D8] hover:border-red-600/40 rounded-xl overflow-hidden transition-all shadow-2xs hover:shadow-lg cursor-pointer flex flex-col justify-between group"
    >
      <div>
        <div className="relative aspect-16/10 overflow-hidden bg-zinc-100">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          {article.isBreaking && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs uppercase tracking-wider font-hindi-brand">
              ब्रेकिंग
            </span>
          )}
          {article.isFeatured && !article.isBreaking && (
            <span className="absolute top-2 left-2 bg-zinc-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs font-hindi-brand">
              विशेष
            </span>
          )}
          {article.location && (
            <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-hindi-brand">
              {article.location}
            </span>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-700 font-hindi-brand mb-2">
            <span>{article.category}</span>
            {article.subCategory && (
              <>
                <span className="text-zinc-300">•</span>
                <span className="text-zinc-500 font-medium">{article.subCategory}</span>
              </>
            )}
          </div>

          <h3 className="font-hindi-brand text-base sm:text-lg font-bold text-zinc-900 group-hover:text-red-700 transition-colors leading-snug mb-2">
            {article.title}
          </h3>

          <p className="text-zinc-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4 font-hindi-brand">
            {article.summary}
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-hindi-brand">
        <div className="flex items-center gap-2">
          <span className="font-medium text-zinc-700">{article.author.name}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>

        <div className="flex items-center gap-1 text-zinc-400">
          <Eye className="w-3.5 h-3.5" />
          <span className="font-mono-data">{article.views}</span>
        </div>
      </div>
    </article>
  );
}
