interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  image: string;
}

class GoogleTranslateService {
  private apiKey: string;
  private baseUrl = 'https://translation.googleapis.com/language/translate/v2';
  private cache: Map<string, string> = new Map();

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || '';
    this.loadCacheFromStorage();
  }

  private loadCacheFromStorage() {
    try {
      const cached = localStorage.getItem('translation_cache');
      if (cached) {
        const cacheArray = JSON.parse(cached);
        this.cache = new Map(cacheArray);
        console.log(`Loaded ${this.cache.size} cached translations`);
      }
    } catch (error) {
      console.error('Error loading translation cache:', error);
      this.cache = new Map();
    }
  }

  private saveCacheToStorage() {
    try {
      const cacheArray = Array.from(this.cache.entries());
      localStorage.setItem('translation_cache', JSON.stringify(cacheArray));
    } catch (error) {
      console.error('Error saving translation cache:', error);
    }
  }

  async translateText(text: string, targetLanguage: 'es' | 'en'): Promise<string> {
    if (!text || !text.trim()) {
      return text;
    }

    if (!this.apiKey) {
      console.warn('Google Translate API key not configured');
      return text;
    }

    // Check cache first
    const cacheKey = `${text}_${targetLanguage}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          source: targetLanguage === 'es' ? 'en' : 'es',
          format: 'text'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Google Translate API error:', errorData);
        return text;
      }

      const data = await response.json();
      
      if (!data.data || !data.data.translations || !data.data.translations[0]) {
        console.error('Unexpected API response format:', data);
        return text;
      }

      const translatedText = data.data.translations[0].translatedText;
      
      // Cache the result
      this.cache.set(cacheKey, translatedText);
      this.saveCacheToStorage();
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  }

  async translateBlogPost(post: BlogPost, targetLanguage: 'es' | 'en'): Promise<BlogPost> {
    try {
      // If target language is English, assume posts are originally in English
      if (targetLanguage === 'en') {
        return post;
      }

      const [translatedTitle, translatedExcerpt, translatedContent] = await Promise.all([
        this.translateText(post.title, targetLanguage),
        this.translateText(post.excerpt, targetLanguage),
        this.translateText(post.content, targetLanguage)
      ]);

      return {
        ...post,
        title: translatedTitle,
        excerpt: translatedExcerpt,
        content: translatedContent
      };
    } catch (error) {
      console.error('Error translating blog post:', error);
      return post; // Return original post if translation fails
    }
  }

  async translateMultiplePosts(posts: BlogPost[], targetLanguage: 'es' | 'en'): Promise<BlogPost[]> {
    if (targetLanguage === 'en') {
      return posts; // Assume original posts are in English
    }

    try {
      const translatedPosts = await Promise.all(
        posts.map(post => this.translateBlogPost(post, targetLanguage))
      );
      return translatedPosts;
    } catch (error) {
      console.error('Error translating multiple posts:', error);
      return posts; // Return original posts if translation fails
    }
  }

  // Clear cache if needed
  clearCache() {
    this.cache.clear();
    localStorage.removeItem('translation_cache');
    console.log('Translation cache cleared');
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()).slice(0, 5) // Show first 5 keys as example
    };
  }
}

export default GoogleTranslateService;