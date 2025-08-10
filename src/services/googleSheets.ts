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
  private apiKey: string;
  private spreadsheetId: string;
  private range: string;
  private sheetName: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || '';
    this.spreadsheetId = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID || '';
    this.sheetName = 'Hoja 1';
    this.range = `${this.sheetName}!A:J`;
  }

  async fetchPosts(): Promise<BlogPost[]> {
    if (!this.apiKey || !this.spreadsheetId) {
      console.warn('Google Sheets API key or Spreadsheet ID not configured. Please check your .env file.');
      console.log('Expected variables: VITE_GOOGLE_SHEETS_API_KEY and VITE_GOOGLE_SPREADSHEET_ID');
      return this.getFallbackPosts();
    }

    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.range}?key=${this.apiKey}`;
      console.log('Fetching from URL:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Google Sheets API Error (${response.status}):`, errorText);
        return this.getFallbackPosts();
      }
      
      const data = await response.json();
      
      if (!data.values || data.values.length <= 1) {
        console.log('No data found in Google Sheet or only headers present');
        return this.getFallbackPosts();
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
      console.log(`Successfully loaded ${posts.length} posts from Google Sheets`);
      return posts;
    } catch (error) {
      console.error('Error fetching from Google Sheets:', error);
      return this.getFallbackPosts();
    }
  }

  async fetchPostsByLanguage(language: 'en' | 'es'): Promise<BlogPost[]> {
    if (!this.apiKey || !this.spreadsheetId) {
      console.warn('Google Sheets API key or Spreadsheet ID not configured. Please check your .env file.');
      console.log('Expected variables: VITE_GOOGLE_SHEETS_API_KEY and VITE_GOOGLE_SPREADSHEET_ID');
      return this.getFallbackPosts();
    }

    // Validate API key format (basic check)
    if (this.apiKey.length < 30 || !this.apiKey.startsWith('AIza')) {
      console.warn('Google Sheets API key appears to be invalid format. Using fallback posts.');
      return this.getFallbackPosts();
    }

    // Validate spreadsheet ID format (basic check)
    if (this.spreadsheetId.length < 40) {
      console.warn('Google Sheets Spreadsheet ID appears to be invalid format. Using fallback posts.');
      console.log('Spreadsheet ID should be a long string from your Google Sheets URL');
      return this.getFallbackPosts();
    }

    try {
      console.log(`Fetching posts for language: ${language}`);
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${this.range}?key=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
        console.error(`Google Sheets API Error (${response.status}):`, errorData);
        
        // Handle specific errors
        if (response.status === 404) {
          console.error('Google Sheet not found. Please check:');
          console.error('1. Spreadsheet ID is correct in .env file');
          console.error('2. Sheet is shared with "Anyone with the link can view"');
          console.error('3. Sheet name is "Hoja 1" or update the sheetName in googleSheets.ts');
        } else if (response.status === 400 && errorData.error?.message?.includes('API key not valid')) {
          console.error('Invalid Google Sheets API key. Please check your VITE_GOOGLE_SHEETS_API_KEY in .env file.');
          console.error('To fix: 1) Go to Google Cloud Console, 2) Enable Sheets API, 3) Create valid API key, 4) Update .env file');
        } else if (response.status === 403) {
          console.error('Access denied. Please check:');
          console.error('1. Google Sheets API is enabled in Google Cloud Console');
          console.error('2. API key has proper permissions');
          console.error('3. Sheet is publicly accessible');
        }
        
        return this.getFallbackPosts();
      }
      
      const data = await response.json();
      console.log('Raw Google Sheets data:', data);
      
      if (!data.values || data.values.length <= 1) {
        console.log('No data found in Google Sheet or only headers present');
        return this.getFallbackPosts();
      }

      // Skip header row and filter by language
      const languageCode = language === 'es' ? 'SP' : 'EN';
      console.log(`Looking for language code: ${languageCode}`);
      const filteredRows = data.values.slice(1).filter(row => row[1] === languageCode);
      console.log(`Found ${filteredRows.length} rows for ${languageCode}`);
      const posts: BlogPost[] = [];
      
      // Process filtered rows
      for (let i = 0; i < filteredRows.length; i++) {
        const row = filteredRows[i];
        if (!row || !Array.isArray(row)) continue;
        
        console.log(`Processing row ${i}:`, row);
        
        const post: BlogPost = {
          id: row[0] || `post-${i + 1}`,
          title: row[2] || `Post ${i + 1}`,
          excerpt: row[3] || '',
          content: row[4] || '',
          date: row[5] || new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          readTime: row[6] || (language === 'es' ? '5 min de lectura' : '5 min read'),
          image: row[7] || 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
          videoUrl: row[8] && row[8].trim() !== '' ? row[8].trim() : undefined
        };
        
        console.log(`Created post: ${post.title}`);
        posts.push(post);
      }

      try {
        localStorage.setItem('cachedGoogleSheetsPosts', JSON.stringify(posts));
      } catch (error) {
        console.warn('Could not cache posts to localStorage:', error);
      }
      console.log(`Successfully loaded ${posts.length} posts from Google Sheets`);
      return posts;
    } catch (error) {
      console.error('Error fetching from Google Sheets:', error);
      return this.getFallbackPosts();
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
      return JSON.parse(cached);
    }

    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      return JSON.parse(savedPosts);
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