import React, { useState } from 'react';
import {
  X,
  Save,
  Sparkles,
  Image,
  Eye,
  Edit3,
  Flame,
  Star,
  Tag,
  Clock,
  User,
  Check,
  AlertCircle,
  FileText,
  Wand2,
} from 'lucide-react';
import { Article, Category } from '../types';
import { api } from '../services/api';

interface CmsArticleEditorProps {
  article?: Article | null;
  onSave: (article: Article) => void;
  onCancel: () => void;
}

const SAMPLE_PHOTO_PRESETS = [
  { label: 'प्रशासन व न्यायालय', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200' },
  { label: 'शहर व बुनियादी ढांचा', url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=1200' },
  { label: 'शेयर बाज़ार व वित्त', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200' },
  { label: 'क्रिकेट व खेल', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1200' },
  { label: 'सिनेमा व संस्कृति', url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200' },
  { label: 'विज्ञान व अंतरिक्ष', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200' },
];

const STAFF_AUTHORS = [
  {
    name: 'राजेश शर्मा',
    role: 'प्रधान संपादक',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    bio: 'विगत 30 वर्षों से राष्ट्रीय राजनीति और सामाजिक सरोकारों पर निरंतर निष्पक्ष लेखन।',
  },
  {
    name: 'अनामिका सिंह',
    role: 'वरिष्ठ राजनीतिक संवाददाता',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    bio: 'संसद, चुनाव विश्लेषण और नीति निर्माण मामलों की विशेषज्ञ पत्रकार।',
  },
  {
    name: 'विवेक मेहरोत्रा',
    role: 'वित्तीय विश्लेषक एवं बाज़ार प्रमुख',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    bio: 'शेयर बाज़ार, कॉरपोरेट गवर्नेंस और बजट नीतियों के विश्लेषक।',
  },
  {
    name: 'डॉ. अमित वर्मा',
    role: 'विज्ञान एवं रक्षा सलाहकार',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    bio: 'इसरो मिशन, एआई प्रौद्योगिकी और रक्षा सौदों पर गहरी नज़र।',
  },
  {
    name: 'प्रिया रघुवंशी',
    role: 'कला व सिनेमा समीक्षक',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    bio: 'भारतीय सिनेमा के इतिहास और समकालीन कला-संस्कृति पर स्तंभकार।',
  },
];

const HINDI_CATEGORIES: Category[] = [
  'देश',
  'शहर',
  'क्रिकेट',
  'मनोरंजन',
  'कारोबार',
  'विदेश',
  'तकनीक',
  'लाइफस्टाइल',
  'संपादकीय',
];

export function CmsArticleEditor({ article, onSave, onCancel }: CmsArticleEditorProps) {
  const isEditing = Boolean(article?.id);

  const [title, setTitle] = useState(article?.title || '');
  const [summary, setSummary] = useState(article?.summary || '');
  const [content, setContent] = useState(article?.content || '');
  const [category, setCategory] = useState<Category>(article?.category || 'देश');
  const [subCategory, setSubCategory] = useState(article?.subCategory || '');
  const [authorName, setAuthorName] = useState(article?.author.name || STAFF_AUTHORS[0].name);
  const [imageUrl, setImageUrl] = useState(
    article?.imageUrl || SAMPLE_PHOTO_PRESETS[0].url
  );
  const [imageCaption, setImageCaption] = useState(article?.imageCaption || '');
  const [imagePhotographer, setImagePhotographer] = useState(
    article?.imagePhotographer || 'आज का प्रहरी फोटो डेस्क'
  );
  const [tagsString, setTagsString] = useState(article?.tags?.join(', ') || 'राष्ट्रीय, मुख्य समाचार');
  const [isBreaking, setIsBreaking] = useState(article?.isBreaking || false);
  const [isFeatured, setIsFeatured] = useState(article?.isFeatured || false);
  const [isEditorialPick, setIsEditorialPick] = useState(article?.isEditorialPick || false);
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>(
    article?.status || 'published'
  );
  const [location, setLocation] = useState(article?.location || 'नई दिल्ली');

  // AI Assistant states
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiError, setAiError] = useState('');

  // AI Headline Generator
  const handleGenerateAiHeadlines = async () => {
    if (!title && !content) {
      setAiError('कृपया हेडलाइन सुझाव पाने के लिए कुछ शीर्षक या सारांश दर्ज करें।');
      return;
    }
    setIsAiGenerating(true);
    setAiError('');
    try {
      const result = await api.askAiAssistant({
        task: 'generate_headlines',
        topic: title || content.slice(0, 200),
        existingText: content,
        category: category,
        tone: 'पत्रकारिता, सटीक एवं विश्वसनीय',
      });
      const lines = result
        .split('\n')
        .map((l) => l.replace(/^[0-9.-•*\s]+/, '').trim())
        .filter((l) => l.length > 5);
      setAiSuggestions(lines);
    } catch (err: any) {
      setAiError(err.message || 'एआई सेवा से जुड़ने में असमर्थ');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // AI Polish Text
  const handleAiPolishContent = async () => {
    if (!content) {
      setAiError('सुधार के लिए पहले लेख का विवरण लिखें।');
      return;
    }
    setIsAiGenerating(true);
    setAiError('');
    try {
      const result = await api.askAiAssistant({
        task: 'polish_tone',
        existingText: content,
        category: category,
        topic: title,
        tone: 'शुद्ध एवं प्रवाहपूर्ण पत्रकारिता हिंदी',
      });
      setContent(result);
    } catch (err: any) {
      setAiError(err.message || 'एआई संपादन में त्रुटि');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Save handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const authorObj = STAFF_AUTHORS.find((a) => a.name === authorName) || {
      name: authorName,
      role: 'विशेष संवाददाता',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    };

    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updated: Article = {
      id: article?.id || `art-akp-${Date.now()}`,
      title: title.trim(),
      slug: article?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `news-${Date.now()}`,
      summary: summary.trim() || title.trim(),
      content: content.trim() || summary.trim() || title.trim(),
      category,
      subCategory: subCategory.trim() || undefined,
      author: authorObj,
      publishedAt: article?.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTime: article?.readTime || `${Math.max(2, Math.ceil(content.split(' ').length / 150))} मिनट`,
      imageUrl: imageUrl.trim(),
      imageCaption: imageCaption.trim() || undefined,
      imagePhotographer: imagePhotographer.trim() || undefined,
      isBreaking,
      isFeatured,
      isEditorialPick,
      tags,
      views: article?.views || 120,
      likes: article?.likes || 0,
      commentsCount: article?.commentsCount || 0,
      status,
      location: location.trim() || undefined,
    };

    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-hindi-brand">
      <div className="bg-[#FAF9F5] border border-zinc-300 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-[#0B1E1D] text-white px-6 py-4 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-700 flex items-center justify-center text-white font-bold">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {isEditing ? 'समाचार संपादित करें (Edit Article)' : 'नई खबर तैयार करें (Create New Article)'}
              </h2>
              <p className="text-xs text-zinc-300">
                आज का प्रहरी • डिजिटल संपादकीय डेस्क
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Editor Form */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Title & AI Headline Assist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                समाचार शीर्षक / हेडलाइन (Headline) *
              </label>
              <button
                type="button"
                onClick={handleGenerateAiHeadlines}
                disabled={isAiGenerating}
                className="flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md border border-red-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span>{isAiGenerating ? 'तैयार हो रहा है...' : 'AI से आकर्षक शीर्षक बनाएं'}</span>
              </button>
            </div>

            <textarea
              required
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="मुख्य शीर्षक दर्ज करें (जैसे: मोहाली में निर्माणाधीन अस्पताल की छत गिरी...)"
              className="w-full bg-white border border-zinc-300 rounded-xl p-3 text-base font-bold text-zinc-900 focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600"
            />

            {/* AI Headline suggestions pill */}
            {aiSuggestions.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
                <div className="text-xs font-bold text-red-900 flex items-center gap-1">
                  <Wand2 className="w-3.5 h-3.5" /> AI द्वारा सुझाए गए शीर्षक (क्लिक करके चुनें):
                </div>
                <div className="space-y-1.5">
                  {aiSuggestions.map((sug, i) => (
                    <div
                      key={i}
                      onClick={() => setTitle(sug)}
                      className="text-xs text-zinc-800 bg-white hover:bg-red-100/60 p-2 rounded border border-red-200 cursor-pointer transition-colors"
                    >
                      {sug}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Meta Desks & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-1.5">
                संपादकीय डेस्क (Category) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-white border border-zinc-300 rounded-lg p-2.5 text-xs text-zinc-900 font-bold focus:border-red-600 focus:outline-hidden"
              >
                {HINDI_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} डेस्क
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-Category */}
            <div>
              <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-1.5">
                उप-विषय (Sub-Category / Topic)
              </label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="उदा: सुप्रीम कोर्ट, मौसम, रेलवे"
                className="w-full bg-white border border-zinc-300 rounded-lg p-2.5 text-xs text-zinc-900 focus:border-red-600 focus:outline-hidden"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-1.5">
                स्थान / ब्यूरो (Location)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="उदा: नई दिल्ली, लखनऊ, मोहाली"
                className="w-full bg-white border border-zinc-300 rounded-lg p-2.5 text-xs text-zinc-900 focus:border-red-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Author & Publication Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-1.5">
                लेखक / पत्रकार (Byline Author)
              </label>
              <select
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg p-2.5 text-xs text-zinc-900 font-bold focus:border-red-600 focus:outline-hidden"
              >
                {STAFF_AUTHORS.map((auth) => (
                  <option key={auth.name} value={auth.name}>
                    {auth.name} ({auth.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-1.5">
                प्रकाशन स्थिति (Status)
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-white border border-zinc-300 rounded-lg p-2.5 text-xs text-zinc-900 font-bold focus:border-red-600 focus:outline-hidden"
              >
                <option value="published">लाइव प्रकाशित (Published)</option>
                <option value="draft">ड्राफ्ट सुरक्षित (Draft)</option>
                <option value="archived">संग्रहित (Archived)</option>
              </select>
            </div>
          </div>

          {/* Badges / Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 p-3.5 bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-bold">
            <label className="flex items-center gap-2 cursor-pointer text-red-700">
              <input
                type="checkbox"
                checked={isBreaking}
                onChange={(e) => setIsBreaking(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 accent-red-600"
              />
              <Flame className="w-4 h-4 fill-red-600" />
              <span>ब्रेकिंग न्यूज़ फ्लैश (Breaking Flash)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-amber-800">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 accent-amber-600"
              />
              <Star className="w-4 h-4 fill-amber-500" />
              <span>मुख्य पृष्ठ प्रमुख लीड (Front Page Lead)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-indigo-900">
              <input
                type="checkbox"
                checked={isEditorialPick}
                onChange={(e) => setIsEditorialPick(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
              />
              <span>संपादक की विशेष पसंद (Editorial Pick)</span>
            </label>
          </div>

          {/* Summary Deck */}
          <div>
            <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-1.5">
              संक्षिप्त सार (Summary / Lead Deck) *
            </label>
            <textarea
              required
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="खबर का एक या दो वाक्यों में संक्षिप्त सार..."
              className="w-full bg-white border border-zinc-300 rounded-lg p-2.5 text-xs text-zinc-900 focus:border-red-600 focus:outline-hidden"
            />
          </div>

          {/* Full Article Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                विस्तृत समाचार विवरण (Full Article Body) *
              </label>
              <button
                type="button"
                onClick={handleAiPolishContent}
                disabled={isAiGenerating || !content}
                className="flex items-center gap-1.5 text-xs font-bold text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md border border-red-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiGenerating ? 'सुधार हो रहा है...' : 'AI से भाषा व शैली परिष्कृत करें'}</span>
              </button>
            </div>

            <textarea
              required
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="खबर का पूरा विवरण यहाँ लिखें..."
              className="w-full bg-white border border-zinc-300 rounded-xl p-3 text-xs leading-relaxed text-zinc-900 focus:outline-hidden focus:border-red-600"
            />
          </div>

          {/* Image Presets & URL */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider">
              चित्र लिंक (Featured Image URL)
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white border border-zinc-300 rounded-lg p-2.5 text-xs text-zinc-900 focus:border-red-600 focus:outline-hidden font-mono-data"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-zinc-500 font-bold">त्वरित फोटो विषय:</span>
              {SAMPLE_PHOTO_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className="text-[10px] font-bold bg-zinc-200 hover:bg-zinc-300 text-zinc-800 px-2 py-0.5 rounded cursor-pointer transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wider mb-1.5">
              टैग्स (Tags - अल्पविराम से अलग करें)
            </label>
            <input
              type="text"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              placeholder="सुप्रीम कोर्ट, फैसला, देश, राजनीति"
              className="w-full bg-white border border-zinc-300 rounded-lg p-2.5 text-xs text-zinc-900 focus:border-red-600 focus:outline-hidden"
            />
          </div>

          {aiError && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg text-xs font-bold">
              {aiError}
            </div>
          )}

          {/* Submit Footer */}
          <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-bold text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'परिवर्तन सुरक्षित करें' : 'खबर प्रकाशित करें'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
