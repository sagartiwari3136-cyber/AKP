import { Article, LiveUpdate, NewsletterPlan, Subscriber, ArticleComment } from '../types';

export const api = {
  // Articles
  async getArticles(params?: {
    category?: string;
    search?: string;
    tag?: string;
    status?: string;
    featured?: boolean;
    breaking?: boolean;
  }): Promise<Article[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.tag) query.set('tag', params.tag);
    if (params?.status) query.set('status', params.status);
    if (params?.featured) query.set('featured', 'true');
    if (params?.breaking) query.set('breaking', 'true');

    const res = await fetch(`/api/articles?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch articles');
    const json = await res.json();
    return json.data;
  },

  async getArticleById(id: string): Promise<Article> {
    const res = await fetch(`/api/articles/${id}`);
    if (!res.ok) throw new Error('Article not found');
    const json = await res.json();
    return json.data;
  },

  async createArticle(data: Partial<Article>): Promise<Article> {
    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create article');
    const json = await res.json();
    return json.data;
  },

  async updateArticle(id: string, data: Partial<Article>): Promise<Article> {
    const res = await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update article');
    const json = await res.json();
    return json.data;
  },

  async deleteArticle(id: string): Promise<void> {
    const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete article');
  },

  async likeArticle(id: string): Promise<number> {
    const res = await fetch(`/api/articles/${id}/like`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to like article');
    const json = await res.json();
    return json.likes;
  },

  async getComments(articleId: string): Promise<ArticleComment[]> {
    const res = await fetch(`/api/articles/${articleId}/comments`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    const json = await res.json();
    return json.data;
  },

  async addComment(articleId: string, userName: string, content: string): Promise<ArticleComment> {
    const res = await fetch(`/api/articles/${articleId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, content }),
    });
    if (!res.ok) throw new Error('Failed to post comment');
    const json = await res.json();
    return json.data;
  },

  // Live Updates
  async getLiveUpdates(): Promise<LiveUpdate[]> {
    const res = await fetch('/api/live-updates');
    if (!res.ok) throw new Error('Failed to fetch live updates');
    const json = await res.json();
    return json.data;
  },

  async createLiveUpdate(data: Partial<LiveUpdate>): Promise<LiveUpdate> {
    const res = await fetch('/api/live-updates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create live update');
    const json = await res.json();
    return json.data;
  },

  async deleteLiveUpdate(id: string): Promise<void> {
    const res = await fetch(`/api/live-updates/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete live update');
  },

  // Newsletters
  async getNewsletters(): Promise<NewsletterPlan[]> {
    const res = await fetch('/api/newsletters');
    if (!res.ok) throw new Error('Failed to fetch newsletters');
    const json = await res.json();
    return json.data;
  },

  async subscribeNewsletter(data: {
    email: string;
    name?: string;
    newsletters?: string[];
    frequency?: string;
  }): Promise<{ message: string; data: Subscriber }> {
    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to subscribe');
    return json;
  },

  async getSubscribers(): Promise<Subscriber[]> {
    const res = await fetch('/api/newsletter/subscribers');
    if (!res.ok) throw new Error('Failed to fetch subscribers');
    const json = await res.json();
    return json.data;
  },

  async deleteSubscriber(id: string): Promise<void> {
    const res = await fetch(`/api/newsletter/subscribers/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete subscriber');
  },

  // AI Editorial Assistant
  async askAiAssistant(params: {
    task: 'generate_headlines' | 'draft_article' | 'generate_summary' | 'polish_tone' | 'suggest_tags';
    topic?: string;
    existingText?: string;
    category?: string;
    tone?: string;
    length?: string;
  }): Promise<string> {
    const res = await fetch('/api/ai/editorial-assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'AI generation failed');
    return json.result;
  },

  async resetData(): Promise<void> {
    await fetch('/api/reset-data', { method: 'POST' });
  },
};
