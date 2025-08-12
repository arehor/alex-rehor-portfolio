interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  image: string;
  videoUrl?: string;
}

class GoogleSheetsService {
  private baseUrl: string;
  private range: string;
  private sheetName: string;

  constructor() {
    // Usar tu servidor proxy en lugar de la API directa
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
    this.sheetName = 'Hoja 1';
    this.range = `${this.sheetName}!A:J`;
  }

  async fetchPosts(): Promise<BlogPost[]> {
    // Google Sheets is always available - proceed with API call

    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.range}?key=${this.apiKey}`;
      console.log('📊 Fetching posts from Google Sheets...');
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Google Sheets API Error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      
      if (!data.values || data.values.length <= 1) {
        console.warn('⚠️ No data found in Google Sheet or only headers present');
        return [];
      }

      // Skip header row and filter for English rows only (default)
      const allRows = data.values.slice(1).filter(row => row[1] === 'EN');
      const posts: BlogPost[] = [];
      
      // Process filtered rows
      for (let i = 0; i < allRows.length; i++) {
        const row = allRows[i];
        if (!row) continue;
        
        const post: BlogPost = {
          id: row[0] || `post-${i + 1}`,
          title: row[2] || `Post ${i + 1}`,
          excerpt: row[3] || '',
          content: row[4] || '',
          date: row[5] || new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          readTime: row[6] || '5 min read',
          image: row[7] || 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
          videoUrl: row[8] && row[8].trim() !== '' ? row[8].trim() : undefined
        };
        
        posts.push(post);
      }

      localStorage.setItem('cachedGoogleSheetsPosts', JSON.stringify(posts));
      console.log(`✅ Successfully loaded ${posts.length} posts from Google Sheets`);
      return posts;
    } catch (error) {
      console.error('❌ Critical error fetching from Google Sheets:', error);
      throw error; // Re-throw since Google Sheets should always be available
    }
  }

  async fetchPostsByLanguage(language: 'en' | 'es'): Promise<BlogPost[]> {
    console.log(`📊 Fetching posts for language: ${language.toUpperCase()}`);

    // Check if we have API credentials
    const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
    const spreadsheetId = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;
    
    if (!apiKey || !spreadsheetId) {
      console.log('⚠️ Google Sheets credentials not configured, using fallback data');
      return this.getFallbackPostsByLanguage(language);
    }

    try {
      // Use direct Google Sheets API call
      const range = 'Hoja 1!A:J';
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.log(`⚠️ Google Sheets API error (${response.status}), using fallback data`);
        return this.getFallbackPostsByLanguage(language);
      }
      
      const data = await response.json();
      
      if (!data.values || data.values.length <= 1) {
        console.warn('⚠️ No data found in Google Sheet');
        return this.getFallbackPostsByLanguage(language);
      }

      // Filter by language: 'EN' for English, 'SP' for Spanish
      const languageCode = language === 'es' ? 'SP' : 'EN';
      const filteredRows = data.values.slice(1).filter(row => row && row[1] === languageCode);
      const posts: BlogPost[] = [];
      
      // Process filtered rows
      for (let i = 0; i < filteredRows.length; i++) {
        const row = filteredRows[i];
        if (!row) continue;
        
        const post: BlogPost = {
          id: row[0] || `post-${Date.now()}-${i}`,
          title: row[2] || `Post ${i + 1}`,
          excerpt: row[3] || '',
          content: row[4] || '',
          date: row[5] || new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          readTime: row[6] || (language === 'es' ? '5 min' : '5 min read'),
          image: row[7] || 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
          videoUrl: row[8] && row[8].trim() !== '' ? row[8].trim() : undefined
        };
        
        posts.push(post);
      }

      localStorage.setItem('cachedGoogleSheetsPosts', JSON.stringify(posts));
      console.log(`✅ Successfully loaded ${posts.length} posts from Google Sheets for language: ${language.toUpperCase()}`);
      
      return posts;
    } catch (error) {
      console.error('❌ Error fetching from Google Sheets, using fallback data:', error);
      return this.getFallbackPostsByLanguage(language);
    }
  }

  async addPost(post: Omit<BlogPost, 'id'>): Promise<boolean> {
    // Google Sheets write operations require OAuth2, not API keys
    // For now, we'll save locally and sync manually when needed
    console.info('Saving post locally (Google Sheets write operations require OAuth2)');
    const newId = await this.generateNextId();
    return this.savePostLocally({ ...post, id: newId });
  }

  async updatePost(post: BlogPost): Promise<boolean> {
    // Google Sheets write operations require OAuth2, not API keys
    // For now, we'll update locally and sync manually when needed
    console.info('Updating post locally (Google Sheets write operations require OAuth2)');
    return this.updatePostLocally(post);
  }

  async deletePost(postId: string): Promise<boolean> {
    // Google Sheets write operations require OAuth2, not API keys
    // For now, we'll delete locally and sync manually when needed
    console.info('Deleting post locally (Google Sheets write operations require OAuth2)');
    return this.deletePostLocally(postId);
  }

  private async generateNextId(): Promise<string> {
    try {
      // Get current date in YYYYMMDD format
      const today = new Date();
      const datePrefix = today.getFullYear().toString() + 
                        (today.getMonth() + 1).toString().padStart(2, '0') + 
                        today.getDate().toString().padStart(2, '0');
      
      // Get existing posts to find the highest number for today
      const existingPosts = await this.fetchPosts();
      const todayPosts = existingPosts.filter(post => 
        post.id.startsWith(datePrefix)
      );
      
      // Find the highest number for today
      let highestNumber = 0;
      todayPosts.forEach(post => {
        const numberPart = post.id.substring(8); // Get the nn part
        const num = parseInt(numberPart, 10);
        if (!isNaN(num) && num > highestNumber) {
          highestNumber = num;
        }
      });
      
      // Generate next ID
      const nextNumber = (highestNumber + 1).toString().padStart(2, '0');
      return datePrefix + nextNumber;
      
    } catch (error) {
      console.error('Error generating ID, using timestamp fallback:', error);
      // Fallback to timestamp-based ID if there's an error
      return Date.now().toString();
    }
  }

  private async findPostRow(postId: string): Promise<number> {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.range}?key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        return -1;
      }
      
      const data = await response.json();
      
      if (!data.values || data.values.length <= 1) {
        return -1;
      }

      // Find the row with matching ID (skip header row)
      for (let i = 1; i < data.values.length; i++) {
        if (data.values[i][0] === postId) {
          return i + 1; // +1 because sheets are 1-indexed
        }
      }

      return -1;
    } catch (error) {
      console.error('Error finding post row:', error);
      return -1;
    }
  }

  private getFallbackPosts(): BlogPost[] {
    const cached = localStorage.getItem('cachedGoogleSheetsPosts');
    if (cached) {
      console.log('📦 Using cached Google Sheets posts');
      return JSON.parse(cached);
    }

    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      console.log('💾 Using locally saved posts');
      return JSON.parse(savedPosts);
    }

    console.log('🔄 Using default fallback posts');
    return [
      {
        id: '1',
        title: 'Building Modern AI Applications with Machine Learning',
        excerpt: 'Exploring the benefits of using AI and machine learning for building intelligent and scalable applications.',
        content: 'Artificial Intelligence has become an essential tool for modern business automation...',
        date: 'January 15, 2024',
        readTime: '5 min read',
        image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
      }
    ];
  }

  private getFallbackPostsByLanguage(language: 'en' | 'es'): BlogPost[] {
    const cached = localStorage.getItem('cachedGoogleSheetsPosts');
    if (cached) {
      console.log('📦 Using cached Google Sheets posts');
      return JSON.parse(cached);
    }

    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      console.log('💾 Using locally saved posts');
      return JSON.parse(savedPosts);
    }

    console.log(`🔄 Using default fallback posts for ${language.toUpperCase()}`);
    
    if (language === 'es') {
      return [
        {
          id: '1',
          title: 'Construyendo Aplicaciones Modernas de IA con Machine Learning',
          excerpt: 'Explorando los beneficios de usar IA y machine learning para construir aplicaciones inteligentes y escalables.',
          content: 'La Inteligencia Artificial se ha convertido en una herramienta esencial para la automatización empresarial moderna...',
          date: '15 de enero, 2024',
          readTime: '5 min',
          image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
        }
      ];
    }
    
    return [
      {
        id: '1',
        title: 'Building Modern AI Applications with Machine Learning',
        excerpt: 'Exploring the benefits of using AI and machine learning for building intelligent and scalable applications.',
        content: 'Artificial Intelligence has become an essential tool for modern business automation...',
        date: 'January 15, 2024',
        readTime: '5 min read',
        image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
      }
    ];
  }

  private savePostLocally(post: Omit<BlogPost, 'id'>): boolean {
    try {
      const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      const newPost = {
        ...post,
        id: Date.now().toString()
      };
      const updatedPosts = [newPost, ...existingPosts];
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      return true;
    } catch (error) {
      console.error('Error saving post locally:', error);
      return false;
    }
  }

  private updatePostLocally(post: BlogPost): boolean {
    try {
      const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      const updatedPosts = existingPosts.map((p: BlogPost) => 
        p.id === post.id ? post : p
      );
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      return true;
    } catch (error) {
      console.error('Error updating post locally:', error);
      return false;
    }
  }

  private deletePostLocally(postId: string): boolean {
    try {
      const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      const updatedPosts = existingPosts.filter((p: BlogPost) => p.id !== postId);
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      return true;
    } catch (error) {
      console.error('Error deleting post locally:', error);
      return false;
    }
  }

  getSetupInstructions(): string {
    return `
To enable full CRUD operations with Google Sheets:

1. Create a Google Sheet with these columns (starting from column C):
   A: ID | B: Language | C: Title | D: Excerpt | E: Content | F: Date | G: Read Time | H: Image URL | I: Video URL
   
   Language column should contain 'EN' for English rows and 'SP' for Spanish rows.
   Same ID should be used for both language versions of the same content.
   Video URL column should contain YouTube URLs (youtube.com/watch or youtu.be format).

2. Get a Google Sheets API key with write permissions:
   - Go to Google Cloud Console
   - Enable Google Sheets API
   - Create credentials (API key)
   - For write operations, you may need OAuth2 authentication

3. Make your sheet editable:
   - File > Share > Anyone with the link can edit (for testing)
   - Or set up proper OAuth2 for production

4. Add environment variables:
   - VITE_GOOGLE_SHEETS_API_KEY=your_api_key
   - VITE_GOOGLE_SPREADSHEET_ID=your_sheet_id

Note: For production, use OAuth2 authentication instead of API keys for write operations.
    `;
  }
}

export default GoogleSheetsService;