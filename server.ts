import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_ARTICLES, INITIAL_LIVE_UPDATES, INITIAL_NEWSLETTERS } from './src/data/initialData';
import { Article, LiveUpdate, NewsletterPlan, Subscriber, ArticleComment } from './src/types';

// In-memory persistent database store for the session
let articles: Article[] = [...INITIAL_ARTICLES];
let liveUpdates: LiveUpdate[] = [...INITIAL_LIVE_UPDATES];
const newsletters: NewsletterPlan[] = [...INITIAL_NEWSLETTERS];
let subscribers: Subscriber[] = [
  {
    id: 'sub-1',
    email: 'reader.global@outlook.com',
    name: 'Sarah Jenkins',
    subscribedNewsletters: ['akp-morning-briefing', 'tech-frontier'],
    frequency: 'daily',
    subscribedAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    status: 'active',
  },
  {
    id: 'sub-2',
    email: 'marcus.investments@capital.org',
    name: 'David Sterling',
    subscribedNewsletters: ['markets-and-capital', 'akp-breaking-flash'],
    frequency: 'daily',
    subscribedAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    status: 'active',
  },
  {
    id: 'sub-3',
    email: 'amara.eco@cleanfuture.org',
    name: 'Dr. Lin Zhang',
    subscribedNewsletters: ['climate-and-earth', 'akp-morning-briefing'],
    frequency: 'weekly',
    subscribedAt: new Date(Date.now() - 1 * 86400 * 1000).toISOString(),
    status: 'active',
  },
];

const comments: ArticleComment[] = [
  {
    id: 'com-1',
    articleId: 'art-1',
    userName: 'Prof. Henrik Lindqvist',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    content: 'The HVDC subsea interconnectors mentioned here are truly the unsung hero of modern energy transition. Excellent reporting by AKP News.',
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    likes: 18,
  },
  {
    id: 'com-2',
    articleId: 'art-1',
    userName: 'Claire Beaumont',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    content: 'Subsea cable security must remain top of mind for international treaties. Look forward to the Geneva summit coverage.',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    likes: 7,
  },
  {
    id: 'com-3',
    articleId: 'art-2',
    userName: 'Dr. Sanjay Patel',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    content: 'Narrowing theoretical crystalline structures down from 4.2M to 3 in 72 hours is unprecedented in materials physics.',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    likes: 34,
  },
];

// Lazy Gemini API initialization helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in the environment.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // ==========================================
  // ARTICLE API ENDPOINTS
  // ==========================================

  // GET all articles with filters
  app.get('/api/articles', (req, res) => {
    try {
      const { category, search, tag, status, featured, breaking } = req.query;
      let result = [...articles];

      // Status filter (default to published for public unless CMS requests all)
      if (status) {
        if (status !== 'all') {
          result = result.filter((a) => a.status === status);
        }
      }

      // Category filter
      if (category && category !== 'All') {
        result = result.filter((a) => a.category.toLowerCase() === (category as string).toLowerCase());
      }

      // Tag filter
      if (tag) {
        result = result.filter((a) => a.tags.some((t) => t.toLowerCase() === (tag as string).toLowerCase()));
      }

      // Featured filter
      if (featured === 'true') {
        result = result.filter((a) => a.isFeatured);
      }

      // Breaking filter
      if (breaking === 'true') {
        result = result.filter((a) => a.isBreaking);
      }

      // Search filter
      if (search) {
        const q = (search as string).toLowerCase();
        result = result.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.summary.toLowerCase().includes(q) ||
            a.content.toLowerCase().includes(q) ||
            a.author.name.toLowerCase().includes(q) ||
            a.tags.some((t) => t.toLowerCase().includes(q))
        );
      }

      // Sort by publishedAt descending
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      res.json({ success: true, count: result.length, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // GET single article by ID or slug
  app.get('/api/articles/:id', (req, res) => {
    try {
      const { id } = req.params;
      const article = articles.find((a) => a.id === id || a.slug === id);

      if (!article) {
        return res.status(404).json({ success: false, error: 'Article not found' });
      }

      // Increment view count
      article.views = (article.views || 0) + 1;

      res.json({ success: true, data: article });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST create article (CMS)
  app.post('/api/articles', (req, res) => {
    try {
      const body = req.body;
      if (!body.title || !body.content || !body.category) {
        return res.status(400).json({ success: false, error: 'Title, content, and category are required' });
      }

      const id = `art-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const slug = (body.title || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const wordCount = body.content.split(/\s+/).length;
      const estimatedReadTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

      const newArticle: Article = {
        id,
        title: body.title,
        slug: body.slug || slug,
        summary: body.summary || body.content.substring(0, 160) + '...',
        content: body.content,
        category: body.category,
        subCategory: body.subCategory || 'General News',
        author: body.author || {
          name: 'AKP Editorial Staff',
          role: 'Staff Correspondent',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        },
        publishedAt: body.publishedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        readTime: body.readTime || estimatedReadTime,
        imageUrl:
          body.imageUrl ||
          'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1200',
        imageCaption: body.imageCaption || 'AKP Newsroom reporting.',
        imagePhotographer: body.imagePhotographer || 'AKP Bureau',
        isBreaking: Boolean(body.isBreaking),
        isFeatured: Boolean(body.isFeatured),
        isEditorialPick: Boolean(body.isEditorialPick),
        tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()) : ['AKP News']),
        views: 0,
        likes: 0,
        commentsCount: 0,
        status: body.status || 'published',
        audioLength: body.audioLength || `${Math.ceil(wordCount / 140)}:00`,
        location: body.location || 'Global Desk',
      };

      articles.unshift(newArticle);

      // If marked as breaking, optionally generate a live feed update
      if (newArticle.isBreaking) {
        liveUpdates.unshift({
          id: `live-${Date.now()}`,
          timestamp: 'Just now',
          title: newArticle.title,
          content: newArticle.summary,
          category: newArticle.category,
          isBreaking: true,
          author: newArticle.author.name,
          verified: true,
          tag: 'BREAKING',
          linkArticleId: newArticle.id,
        });
      }

      res.status(201).json({ success: true, data: newArticle });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // PUT update article (CMS)
  app.put('/api/articles/:id', (req, res) => {
    try {
      const { id } = req.params;
      const index = articles.findIndex((a) => a.id === id);

      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Article not found' });
      }

      const body = req.body;
      const updatedArticle: Article = {
        ...articles[index],
        ...body,
        updatedAt: new Date().toISOString(),
        id, // ensure ID is not overwritten
      };

      articles[index] = updatedArticle;
      res.json({ success: true, data: updatedArticle });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // DELETE article (CMS)
  app.delete('/api/articles/:id', (req, res) => {
    try {
      const { id } = req.params;
      const index = articles.findIndex((a) => a.id === id);

      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Article not found' });
      }

      const removed = articles.splice(index, 1)[0];
      res.json({ success: true, message: 'Article deleted successfully', data: removed });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST like article
  app.post('/api/articles/:id/like', (req, res) => {
    try {
      const { id } = req.params;
      const article = articles.find((a) => a.id === id);
      if (!article) {
        return res.status(404).json({ success: false, error: 'Article not found' });
      }
      article.likes = (article.likes || 0) + 1;
      res.json({ success: true, likes: article.likes });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Comments for articles
  app.get('/api/articles/:id/comments', (req, res) => {
    const { id } = req.params;
    const articleComments = comments.filter((c) => c.articleId === id);
    res.json({ success: true, data: articleComments });
  });

  app.post('/api/articles/:id/comments', (req, res) => {
    try {
      const { id } = req.params;
      const { userName, content, userAvatar } = req.body;
      if (!content) {
        return res.status(400).json({ success: false, error: 'Comment content is required' });
      }

      const newComment: ArticleComment = {
        id: `com-${Date.now()}`,
        articleId: id,
        userName: userName || 'Verified Subscriber',
        userAvatar: userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
      };

      comments.unshift(newComment);

      const article = articles.find((a) => a.id === id);
      if (article) {
        article.commentsCount = (article.commentsCount || 0) + 1;
      }

      res.status(201).json({ success: true, data: newComment });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ==========================================
  // LIVE FEED / BREAKING NEWS UPDATES
  // ==========================================

  app.get('/api/live-updates', (req, res) => {
    res.json({ success: true, count: liveUpdates.length, data: liveUpdates });
  });

  app.post('/api/live-updates', (req, res) => {
    try {
      const { title, content, category, isBreaking, author, tag } = req.body;
      if (!title || !content) {
        return res.status(400).json({ success: false, error: 'Title and content are required' });
      }

      const newUpdate: LiveUpdate = {
        id: `live-${Date.now()}`,
        timestamp: 'Just now',
        title,
        content,
        category: category || 'World',
        isBreaking: Boolean(isBreaking),
        author: author || 'AKP Fast Desk',
        verified: true,
        tag: tag || (isBreaking ? 'BREAKING' : 'UPDATE'),
      };

      liveUpdates.unshift(newUpdate);
      res.status(201).json({ success: true, data: newUpdate });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.delete('/api/live-updates/:id', (req, res) => {
    try {
      const { id } = req.params;
      const index = liveUpdates.findIndex((l) => l.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Live update not found' });
      }
      const removed = liveUpdates.splice(index, 1)[0];
      res.json({ success: true, data: removed });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ==========================================
  // NEWSLETTERS & SUBSCRIPTION PORTAL
  // ==========================================

  app.get('/api/newsletters', (req, res) => {
    res.json({ success: true, data: newsletters });
  });

  app.get('/api/newsletter/subscribers', (req, res) => {
    res.json({ success: true, count: subscribers.length, data: subscribers });
  });

  app.post('/api/newsletter/subscribe', (req, res) => {
    try {
      const { email, name, newsletters: chosenNewsletters, frequency } = req.body;

      if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, error: 'Please provide a valid email address' });
      }

      const existingIndex = subscribers.findIndex((s) => s.email.toLowerCase() === email.toLowerCase());

      if (existingIndex >= 0) {
        subscribers[existingIndex].subscribedNewsletters = Array.from(
          new Set([...subscribers[existingIndex].subscribedNewsletters, ...(chosenNewsletters || ['akp-morning-briefing'])])
        );
        if (frequency) subscribers[existingIndex].frequency = frequency;
        if (name) subscribers[existingIndex].name = name;
        subscribers[existingIndex].status = 'active';

        return res.json({
          success: true,
          message: 'Your newsletter subscription preferences have been updated!',
          data: subscribers[existingIndex],
        });
      }

      const newSubscriber: Subscriber = {
        id: `sub-${Date.now()}`,
        email,
        name: name || email.split('@')[0],
        subscribedNewsletters: chosenNewsletters && chosenNewsletters.length > 0 ? chosenNewsletters : ['akp-morning-briefing'],
        frequency: frequency || 'daily',
        subscribedAt: new Date().toISOString(),
        status: 'active',
      };

      subscribers.unshift(newSubscriber);

      // Increment counters in newsletters
      for (const nId of newSubscriber.subscribedNewsletters) {
        const found = newsletters.find((n) => n.id === nId);
        if (found) {
          found.subscriberCount = (found.subscriberCount || 0) + 1;
        }
      }

      res.status(201).json({
        success: true,
        message: 'Welcome to AKP Newsletters! You are now subscribed.',
        data: newSubscriber,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.delete('/api/newsletter/subscribers/:id', (req, res) => {
    try {
      const { id } = req.params;
      const index = subscribers.findIndex((s) => s.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Subscriber not found' });
      }
      const removed = subscribers.splice(index, 1)[0];
      res.json({ success: true, message: 'Subscriber removed', data: removed });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ==========================================
  // GEMINI AI EDITORIAL ASSISTANT (CMS)
  // ==========================================

  app.post('/api/ai/editorial-assist', async (req, res) => {
    try {
      const { task, topic, existingText, category, tone, length } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        // Fallback gracefully with intelligent editorial templates if API key is not yet set
        return res.json({
          success: true,
          result: getSimulatedEditorialFallback(task, topic, existingText, category),
          note: 'Generated using built-in newsroom assistant template.',
        });
      }

      const ai = getGeminiClient();

      let prompt = '';
      if (task === 'generate_headlines') {
        prompt = `You are a chief news copy editor at AKP News, a world-class investigative and international news publication.
Generate 5 compelling, journalistic, authoritative news headlines for the following story topic:
Topic: "${topic}"
Category: ${category || 'World Affairs'}
Style Guidelines:
- Clear, punchy, active verbs, high credibility.
- Avoid clickbait or cheap sensationalism; sound like The New York Times, Financial Times, or Reuters.
- Provide 1 Primary Headline, 1 Breaking Wire style headline, 1 Analytical headline, 1 Feature headline, and 1 Subtitle deck.`;
      } else if (task === 'draft_article') {
        prompt = `You are a senior correspondent at AKP News writing an in-depth, authoritative news report.
Story Topic / Outline: "${topic}"
Category: ${category || 'World'}
Tone: ${tone || 'Authoritative, Objective, Investigative'}
Target Length: ${length || 'Comprehensive 4-5 sections'}

Format your output in clean Markdown with:
# Compelling Headline
A 2-sentence italicized summary deck.

### Section Headers (3-4 sections)
Paragraphs with journalistic depth, realistic quotes from named experts/officials, empirical figures, and international geopolitical/economic context.

Ensure the reporting is balanced, factual in tone, and rich with investigative nuance.`;
      } else if (task === 'generate_summary') {
        prompt = `You are an executive news editor at AKP News.
Summarize the following article text into 3-4 crisp executive bullet points and a 1-sentence TL;DR deck:
Article Content:
${existingText || topic}`;
      } else if (task === 'polish_tone') {
        prompt = `You are a master news copy editor at AKP News.
Polish and elevate the following text to ensure impeccable grammar, journalistic authority, rhythm, and tone (${tone || 'Authoritative & Investigative'}):
Original Text:
${existingText}`;
      } else if (task === 'suggest_tags') {
        prompt = `Suggest 5 relevant SEO news tags, 1 specific subcategory, and estimated reading time for an article about:
"${topic || existingText}"
Return in JSON format with fields: tags (array of strings), subCategory (string), readTime (string).`;
      } else {
        prompt = `Assist with this news editorial request: "${topic || existingText}"`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      res.json({
        success: true,
        result: response.text || 'No response generated.',
      });
    } catch (error: any) {
      console.error('Gemini AI error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate editorial content',
      });
    }
  });

  // Reset database back to seed
  app.post('/api/reset-data', (req, res) => {
    articles = [...INITIAL_ARTICLES];
    liveUpdates = [...INITIAL_LIVE_UPDATES];
    res.json({ success: true, message: 'Database reset to initial editorial state' });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AKP News Server running on http://localhost:${PORT}`);
  });
}

function getSimulatedEditorialFallback(task: string, topic?: string, existingText?: string, category?: string): string {
  if (task === 'generate_headlines') {
    return `1. Primary: Global Summit Reaches Historic Consensus on ${topic || 'International Infrastructure Pact'}
2. Fast Wire: BREAKING: Key Envoys Sign Framework on ${topic || 'Trade & Energy Security'}
3. Analytical: Beyond the Accord: What ${topic || 'the Policy Shift'} Means for Global Markets
4. Feature: Inside the High-Stakes Diplomacy Behind ${topic || 'the New Strategic Era'}
5. Subtitle Deck: Diplomats conclude marathon negotiations, setting unified regulatory standards starting next fiscal quarter.`;
  }
  if (task === 'generate_summary') {
    return `• Key Accord Reached: International delegates finalized terms following intensive bilateral discussions.
• Economic Implications: Broad consensus expected to unlock over $100B in cross-border infrastructure and clean technology initiatives.
• Next Steps: Ratification procedures begin next month across member parliaments, with initial phase rollouts scheduled for Q3.
• TL;DR: A landmark policy framework sets new international standards with wide-ranging economic and industrial impacts.`;
  }
  return `### Comprehensive Editorial Draft: ${topic || 'Global Developments'}

International policymakers and industry stakeholders have finalized terms on a pivotal initiative that promises to reshape market trajectories and cross-border cooperation.

### Strategic Priorities and Regulatory Alignment
The framework addresses long-standing regulatory bottlenecks, establishing harmonized protocols across participating economies. Analysts emphasize that the alignment provides critical certainty for long-term investments.

### Market and Societal Impact
"This agreement marks a decisive transition toward resilient, coordinated frameworks," noted senior analysts during an AKP News editorial briefing. Initial phase implementations are projected to commence within the coming months.`;
}

startServer();
