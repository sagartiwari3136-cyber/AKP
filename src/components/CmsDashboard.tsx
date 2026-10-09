import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  Radio,
  Mail,
  Sparkles,
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  Flame,
  Star,
  CheckCircle2,
  Send,
  Users,
  BarChart3,
  TrendingUp,
  RefreshCw,
  X,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { Article, LiveUpdate, Subscriber, Category } from '../types';
import { api } from '../services/api';
import { CmsArticleEditor } from './CmsArticleEditor';
import { BrandLogo } from './BrandLogo';

interface CmsDashboardProps {
  onClose: () => void;
  articles: Article[];
  liveUpdates: LiveUpdate[];
  onArticlesChange: () => void;
  onLiveUpdatesChange: () => void;
  onSelectArticleForPreview: (article: Article) => void;
}

export function CmsDashboard({
  onClose,
  articles,
  liveUpdates,
  onArticlesChange,
  onLiveUpdatesChange,
  onSelectArticleForPreview,
}: CmsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'articles' | 'live' | 'newsletters' | 'ai_suite'>('articles');
  const [editingArticle, setEditingArticle] = useState<Article | null | undefined>(undefined);
  const [articleSearch, setArticleSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Live Wire Dispatch Form State
  const [wireTitle, setWireTitle] = useState('');
  const [wireContent, setWireContent] = useState('');
  const [wireCategory, setWireCategory] = useState<string>('World');
  const [wireIsBreaking, setWireIsBreaking] = useState(true);
  const [wireAuthor, setWireAuthor] = useState('AKP Fast Desk');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Subscribers State
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);

  // AI Suite Playground State
  const [aiTask, setAiTask] = useState<'generate_headlines' | 'draft_article' | 'generate_summary' | 'polish_tone'>('draft_article');
  const [aiTopic, setAiTopic] = useState('');
  const [aiExistingText, setAiExistingText] = useState('');
  const [aiCategory, setAiCategory] = useState('World Affairs');
  const [aiTone, setAiTone] = useState('Authoritative, Objective, Investigative');
  const [aiResult, setAiResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    setIsLoadingSubscribers(true);
    try {
      const data = await api.getSubscribers();
      setSubscribers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSubscribers(false);
    }
  };

  // Delete article
  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this article?')) return;
    try {
      await api.deleteArticle(id);
      onArticlesChange();
    } catch (err: any) {
      alert(err.message || 'Failed to delete article');
    }
  };

  // Broadcast Live Update
  const handleBroadcastLiveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wireTitle.trim() || !wireContent.trim()) return;

    setIsBroadcasting(true);
    try {
      await api.createLiveUpdate({
        title: wireTitle.trim(),
        content: wireContent.trim(),
        category: wireCategory,
        isBreaking: wireIsBreaking,
        author: wireAuthor,
        tag: wireIsBreaking ? 'BREAKING' : 'WIRE UPDATE',
      });
      setWireTitle('');
      setWireContent('');
      onLiveUpdatesChange();
    } catch (err: any) {
      alert(err.message || 'Failed to broadcast update');
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Delete live update
  const handleDeleteLiveUpdate = async (id: string) => {
    try {
      await api.deleteLiveUpdate(id);
      onLiveUpdatesChange();
    } catch (err: any) {
      alert(err.message || 'Failed to delete live update');
    }
  };

  // Delete subscriber
  const handleDeleteSubscriber = async (id: string) => {
    if (!window.confirm('Remove subscriber from newsletter distribution?')) return;
    try {
      await api.deleteSubscriber(id);
      loadSubscribers();
    } catch (err: any) {
      alert(err.message || 'Failed to remove subscriber');
    }
  };

  // Run AI Suite Assistant
  const handleRunAiSuite = async () => {
    if (!aiTopic && !aiExistingText) {
      alert('Please provide a story topic or existing text.');
      return;
    }
    setIsAiLoading(true);
    setAiResult('');
    try {
      const res = await api.askAiAssistant({
        task: aiTask,
        topic: aiTopic,
        existingText: aiExistingText,
        category: aiCategory,
        tone: aiTone,
      });
      setAiResult(res);
    } catch (err: any) {
      alert(err.message || 'AI processing failed');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Total readership metrics
  const totalViews = articles.reduce((acc, a) => acc + (a.views || 0), 0);
  const totalLikes = articles.reduce((acc, a) => acc + (a.likes || 0), 0);
  const totalPublished = articles.filter((a) => a.status === 'published').length;
  const totalDrafts = articles.filter((a) => a.status === 'draft').length;

  // Filtered articles list
  const filteredArticles = articles.filter((a) => {
    if (categoryFilter !== 'All' && a.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (articleSearch) {
      const q = articleSearch.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.author.name.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filtered subscribers list
  const filteredSubscribers = subscribers.filter((s) => {
    if (!subscriberSearch) return true;
    const q = subscriberSearch.toLowerCase();
    return s.email.toLowerCase().includes(q) || (s.name && s.name.toLowerCase().includes(q));
  });

  return (
    <div className="bg-[#FAF9F5] min-h-screen py-6 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Newsroom Masthead & Bar */}
        <div className="bg-gradient-to-r from-[#181A1E] via-[#211214] to-[#181A1E] text-white p-6 rounded-2xl border border-red-950/80 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <BrandLogo variant="badge" />
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1 font-hindi-brand">
                <LayoutDashboard className="w-4 h-4" />
                <span>आज का प्रहरी • संपादकीय न्यूज़रूम CMS</span>
              </div>
              <h1 className="font-hindi-brand text-xl sm:text-2xl font-bold tracking-tight text-white">
                Editorial Operations & Fast Wire Publishing Suite
              </h1>
              <p className="text-xs text-zinc-400 mt-1 font-hindi-brand">
                लाइव वायर बुलेटिन, विस्तृत रिपोर्टिंग, न्यूज़लेटर प्रबंधन और Gemini AI ड्राफ्टिंग सूट।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditingArticle(null)}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Compose New Story</span>
            </button>

            <button
              onClick={onClose}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Back to Reader Portal
            </button>
          </div>
        </div>

        {/* Editor Modal Overlay if editing/creating */}
        {editingArticle !== undefined && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <CmsArticleEditor
              article={editingArticle}
              onSave={(saved) => {
                setEditingArticle(undefined);
                onArticlesChange();
              }}
              onCancel={() => setEditingArticle(undefined)}
            />
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
            <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold uppercase">
              <span>Published Stories</span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-2">{totalPublished}</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">{totalDrafts} drafts in queue</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
            <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold uppercase">
              <span>Readership Views</span>
              <BarChart3 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-2 font-mono-data">
              {totalViews.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2% this week
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
            <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold uppercase">
              <span>Reader Likes</span>
              <Users className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-2 font-mono-data">
              {totalLikes.toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Across all active desks</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
            <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold uppercase">
              <span>Live Dispatches</span>
              <Radio className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-2">{liveUpdates.length}</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Streaming wire feeds</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold uppercase">
              <span>Subscribers</span>
              <Mail className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 mt-2">{subscribers.length}</div>
            <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">Verified Inboxes</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border border-zinc-200 rounded-xl p-1.5 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'articles'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Articles Manager ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'live'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <Radio className="w-4 h-4 text-rose-500" />
            <span>Live Wire Broadcaster ({liveUpdates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('newsletters')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'newsletters'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <Mail className="w-4 h-4 text-indigo-500" />
            <span>Newsletter Subscribers ({subscribers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_suite')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ai_suite'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Gemini AI Newsroom Suite</span>
          </button>
        </div>

        {/* TAB 1: ARTICLES MANAGER */}
        {activeTab === 'articles' && (
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-xs overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <div className="relative w-full max-w-xs">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search articles by title, author, tag..."
                    value={articleSearch}
                    onChange={(e) => setArticleSearch(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-800"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-zinc-50 border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-800"
                >
                  <option value="All">All Desks</option>
                  <option value="World">World</option>
                  <option value="Politics">Politics</option>
                  <option value="Business">Business</option>
                  <option value="Technology">Technology</option>
                  <option value="Climate & Science">Climate & Science</option>
                  <option value="Culture & Lifestyle">Culture & Lifestyle</option>
                  <option value="Sports">Sports</option>
                  <option value="Opinion">Opinion</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-zinc-50 border border-zinc-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-800"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingArticle(null)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>New Story</span>
                </button>
              </div>
            </div>

            {/* Articles Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Story & Headline</th>
                    <th className="py-3 px-4">Desk</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Stats</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {filteredArticles.map((art) => (
                    <tr key={art.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="py-3 px-4 max-w-sm">
                        <div className="flex items-start gap-3">
                          <img
                            src={art.imageUrl}
                            alt={art.title}
                            className="w-12 h-12 rounded object-cover shrink-0 border border-zinc-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              {art.isBreaking && (
                                <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                                  Breaking
                                </span>
                              )}
                              {art.isFeatured && (
                                <span className="bg-amber-500 text-zinc-950 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                                  Featured Lead
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif-headline font-bold text-zinc-950 text-xs sm:text-sm leading-snug line-clamp-1">
                              {art.title}
                            </h4>
                            <span className="text-[10px] text-zinc-400 font-mono-data">
                              {new Date(art.publishedAt).toLocaleDateString()} • {art.readTime}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-zinc-900 whitespace-nowrap">
                        <span className="bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded text-[11px]">
                          {art.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-zinc-900">{art.author.name}</div>
                        <div className="text-[10px] text-zinc-400">{art.author.role}</div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            art.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : art.status === 'draft'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-zinc-200 text-zinc-700'
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-zinc-500 font-mono-data text-[11px]">
                        <div>{art.views.toLocaleString()} views</div>
                        <div className="text-zinc-400">{art.likes} likes • {art.commentsCount} comments</div>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectArticleForPreview(art)}
                            className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded"
                            title="Preview Article"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingArticle(art)}
                            className="p-1.5 text-zinc-600 hover:text-blue-600 hover:bg-zinc-100 rounded"
                            title="Edit Article"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-zinc-100 rounded"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE WIRE BROADCASTER */}
        {activeTab === 'live' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Broadcast Form */}
            <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Radio className="w-4 h-4" />
                <span>Instant Wire Broadcaster</span>
              </div>

              <h3 className="font-masthead text-xl font-bold text-zinc-950 mb-1">
                Publish Live Breaking Dispatch
              </h3>
              <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                Dispatches immediately beam to the public breaking news ticker and real-time live feed stream.
              </p>

              <form onSubmit={handleBroadcastLiveUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                    Wire Headline <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Delegates approve $120B clean grid accord in Brussels"
                    value={wireTitle}
                    onChange={(e) => setWireTitle(e.target.value)}
                    required
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs text-zinc-950 font-bold focus:bg-white focus:outline-hidden focus:border-zinc-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-700 mb-1">
                    Dispatch Content / Minute-by-Minute Details <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide 1-2 factual paragraphs with key figures, quotes, or timeline details..."
                    value={wireContent}
                    onChange={(e) => setWireContent(e.target.value)}
                    required
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs text-zinc-800 focus:bg-white focus:outline-hidden focus:border-zinc-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">Desk</label>
                    <select
                      value={wireCategory}
                      onChange={(e) => setWireCategory(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-xs font-semibold"
                    >
                      <option value="World">World</option>
                      <option value="Politics">Politics</option>
                      <option value="Business">Business</option>
                      <option value="Technology">Technology</option>
                      <option value="Climate & Science">Climate & Science</option>
                      <option value="Culture & Lifestyle">Culture & Lifestyle</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">Reporter</label>
                    <input
                      type="text"
                      value={wireAuthor}
                      onChange={(e) => setWireAuthor(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-red-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wireIsBreaking}
                      onChange={(e) => setWireIsBreaking(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <Flame className="w-4 h-4" />
                    <span>Broadcast with High-Priority Breaking Alert Badge</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="w-full bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>{isBroadcasting ? 'Broadcasting...' : 'Broadcast Live Dispatch'}</span>
                </button>
              </form>
            </div>

            {/* Active Live Updates List */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200">
                <h3 className="font-masthead text-lg font-bold text-zinc-950">
                  Active Live Dispatches ({liveUpdates.length})
                </h3>
                <span className="text-xs text-zinc-400">Chronological wire feed</span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {liveUpdates.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {item.isBreaking ? (
                          <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                            Breaking
                          </span>
                        ) : (
                          <span className="bg-zinc-800 text-zinc-200 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                            {item.tag || item.category}
                          </span>
                        )}
                        <span className="text-[10px] font-mono-data text-zinc-400 font-bold">
                          {item.timestamp}
                        </span>
                        <span className="text-zinc-400">•</span>
                        <span className="text-[11px] text-zinc-600 font-medium">By {item.author}</span>
                      </div>

                      <h4 className="font-bold text-xs text-zinc-950 leading-snug mb-1">{item.title}</h4>
                      <p className="text-zinc-600 text-xs line-clamp-2 leading-relaxed">{item.content}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteLiveUpdate(item.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-zinc-200/60 rounded"
                      title="Delete live update"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NEWSLETTER SUBSCRIBERS */}
        {activeTab === 'newsletters' && (
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-6 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-masthead text-xl font-bold text-zinc-950">
                  Newsletter Subscriber Management
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Verified readership list across all 5 editorial briefing channels.
                </p>
              </div>

              <div className="relative w-full max-w-xs">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search subscribers..."
                  value={subscriberSearch}
                  onChange={(e) => setSubscriberSearch(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-6">Subscriber</th>
                    <th className="py-3 px-6">Subscribed Newsletters</th>
                    <th className="py-3 px-6">Cadence</th>
                    <th className="py-3 px-6">Date Joined</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-zinc-50/70">
                      <td className="py-3.5 px-6 font-medium text-zinc-900">
                        <div className="font-bold">{sub.name || 'Anonymous Reader'}</div>
                        <div className="text-zinc-500 text-[11px] font-mono-data">{sub.email}</div>
                      </td>

                      <td className="py-3.5 px-6">
                        <div className="flex flex-wrap gap-1">
                          {sub.subscribedNewsletters.map((nl) => (
                            <span
                              key={nl}
                              className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded text-[10px] font-semibold"
                            >
                              {nl}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-6 font-semibold uppercase text-[10px] text-zinc-600">
                        {sub.frequency}
                      </td>

                      <td className="py-3.5 px-6 text-zinc-500 font-mono-data text-[11px]">
                        {new Date(sub.subscribedAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => handleDeleteSubscriber(sub.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 rounded"
                          title="Remove subscriber"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: GEMINI AI NEWSROOM SUITE */}
        {activeTab === 'ai_suite' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Editorial Assistant</span>
              </div>

              <h3 className="font-masthead text-xl font-bold text-zinc-950">
                Gemini 3.7 Flash Newsroom Engine
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Generate compelling journalistic headlines, draft in-depth multi-section stories, summarize investigations, or polish reporting tone.
              </p>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                  Editorial Task
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                  {[
                    { id: 'draft_article', label: 'Draft Full Article' },
                    { id: 'generate_headlines', label: '5 Headline Ideas' },
                    { id: 'generate_summary', label: 'Executive Summary' },
                    { id: 'polish_tone', label: 'Polish Tone' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAiTask(t.id as any)}
                      className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                        aiTask === t.id
                          ? 'bg-zinc-900 text-white font-bold border-zinc-900 shadow-xs'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                  Story Topic or Preliminary Outline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Breakthrough in next-gen solid state battery chemistry..."
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                  Article Text (for summarizing or polishing)
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste rough text here to polish or summarize..."
                  value={aiExistingText}
                  onChange={(e) => setAiExistingText(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs text-zinc-900 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Desk</label>
                  <select
                    value={aiCategory}
                    onChange={(e) => setAiCategory(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-xs font-semibold"
                  >
                    <option value="World Affairs">World Affairs</option>
                    <option value="Technology & AI">Technology & AI</option>
                    <option value="Business & Markets">Business & Markets</option>
                    <option value="Climate & Science">Climate & Science</option>
                    <option value="Culture & Arts">Culture & Arts</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Tone</label>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2 text-xs font-semibold"
                  >
                    <option value="Authoritative, Objective, Investigative">Authoritative & Investigative</option>
                    <option value="Fast Wire & Breaking">Fast Wire & Breaking</option>
                    <option value="Financial & Macroeconomic">Financial & Markets</option>
                    <option value="In-Depth Longform Feature">In-Depth Longform</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunAiSuite}
                disabled={isAiLoading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAiLoading ? 'Gemini AI Generating...' : 'Generate with Gemini AI'}</span>
              </button>
            </div>

            {/* AI Output Terminal */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="font-masthead text-lg font-bold text-zinc-950">
                    Generated Editorial Output
                  </h3>
                </div>
                {aiResult && (
                  <button
                    onClick={() => {
                      setEditingArticle({
                        id: '',
                        title: aiTopic || 'AI Drafted Investigation',
                        slug: '',
                        summary: 'Drafted via Gemini 3.7 Flash Assistant',
                        content: aiResult,
                        category: (aiCategory.split(' ')[0] as any) || 'World',
                        author: {
                          name: 'AKP Editorial Staff',
                          role: 'Staff Correspondent',
                          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                        },
                        publishedAt: new Date().toISOString(),
                        readTime: '5 min read',
                        imageUrl: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&q=80&w=1200',
                        tags: ['AI Generated', 'Investigation'],
                        views: 0,
                        likes: 0,
                        commentsCount: 0,
                        status: 'draft',
                      });
                    }}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <span>Import to Story Composer →</span>
                  </button>
                )}
              </div>

              <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl p-4 overflow-y-auto max-h-[500px]">
                {isAiLoading ? (
                  <div className="flex flex-col items-center justify-center h-48 text-zinc-400 space-y-3">
                    <Sparkles className="w-8 h-8 text-amber-500 animate-spin" />
                    <p className="text-xs font-semibold">Gemini 3.7 Flash analyzing journalistic context...</p>
                  </div>
                ) : aiResult ? (
                  <div className="prose prose-zinc max-w-none text-xs sm:text-sm font-serif-headline leading-relaxed whitespace-pre-wrap">
                    {aiResult}
                  </div>
                ) : (
                  <div className="text-center py-16 text-zinc-400 space-y-2">
                    <Sparkles className="w-8 h-8 mx-auto opacity-30 text-amber-500" />
                    <p className="text-xs font-medium">Your generated headlines or drafted articles will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
