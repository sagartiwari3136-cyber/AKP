import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Article, Category } from '../types';
import { ArticleCard } from './ArticleCard';

interface CategorySectionProps {
  category: Category;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onSelectCategory: (category: Category) => void;
}

const DESK_NAMES_HI: Record<string, { title: string; subtitle?: string }> = {
  'देश': { title: 'राष्ट्रीय समाचार डेस्क', subtitle: 'देशभर की प्रमुख एवं नीतिगत खबरें' },
  'शहर': { title: 'राज्य एवं शहर ब्यूरो डेस्क', subtitle: 'राज्यों और महानगरों की ज़मीनी हलचल' },
  'क्रिकेट': { title: 'खेल एवं क्रिकेट डेस्क', subtitle: 'मैच रिपोर्ट, स्कोरबोर्ड और खेल जगत' },
  'कारोबार': { title: 'कारोबार एवं बाजार डेस्क', subtitle: 'अर्थव्यवस्था, शेयर बाजार व उद्योग जगत' },
  'मनोरंजन': { title: 'सिनेमा एवं मनोरंजन डेस्क', subtitle: 'बॉलीवुड, ओटीटी और कला-संस्कृति' },
  'विदेश': { title: 'विदेश एवं अंतरराष्ट्रीय डेस्क', subtitle: 'वैश्विक कूटनीति, भू-राजनीति और विश्व समाचार' },
  'तकनीक': { title: 'विज्ञान एवं तकनीक डेस्क', subtitle: 'एआई, गैजेट्स, इनोवेशन व अंतरिक्ष' },
  'संपादकीय': { title: 'संपादकीय एवं विचार मंच', subtitle: 'वरिष्ठ पत्रकारों और विचारकों के लेख' },
  'लाइफस्टाइल': { title: 'जीवनशैली एवं स्वास्थ्य डेस्क', subtitle: 'स्वास्थ्य, फिटनेस, खानपान व पर्यटन' },
  'ताज़ातरीन': { title: 'ताज़ा एवं ब्रेकिंग न्यूज़ डेस्क', subtitle: 'पल-पल की बड़ी खबरें' },
};

export function CategorySection({
  category,
  articles,
  onSelectArticle,
  onSelectCategory,
}: CategorySectionProps) {
  if (articles.length === 0) return null;

  const isOpinionDesk = category === 'संपादकीय';
  const displayArticles = articles.slice(0, 8);
  const deskInfo = DESK_NAMES_HI[category] || { title: `${category} डेस्क`, subtitle: '' };

  return (
    <section className="mb-12 border-b border-[#DCDAD0] pb-10">
      {/* Desk Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-red-700 pb-2.5 mb-6 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-6 bg-red-700 rounded-xs shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-hindi-brand text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
                {deskInfo.title}
              </h2>
              <span className="bg-red-50 text-red-800 border border-red-200 text-xs px-2 py-0.5 rounded font-hindi-brand font-bold">
                {articles.length} खबरें
              </span>
            </div>
            {deskInfo.subtitle && (
              <p className="text-xs text-zinc-500 font-hindi-brand mt-0.5">{deskInfo.subtitle}</p>
            )}
          </div>
        </div>

        <button
          onClick={() => onSelectCategory(category)}
          className="text-xs font-bold text-red-700 hover:text-red-900 flex items-center gap-1 font-hindi-brand cursor-pointer group self-start sm:self-auto"
        >
          <span>सभी {category} समाचार देखें</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Grid Layouts */}
      {isOpinionDesk ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="opinion"
              onSelect={onSelectArticle}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.map((article, idx) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant={idx === 0 && displayArticles.length > 2 ? 'horizontal' : 'standard'}
              onSelect={onSelectArticle}
            />
          ))}
        </div>
      )}
    </section>
  );
}

