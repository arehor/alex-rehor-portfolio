// Ejemplo de servidor proxy (Node.js/Express)
const express = require('express');
const cors = require('cors');
const app = express();

// Configuración CORS para tu dominio
app.use(cors({
  origin: ['https://tu-dominio.com', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// API key segura en el servidor (variable de entorno)
const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

// Endpoint proxy para Google Sheets
app.get('/api/blog-posts/:language', async (req, res) => {
  try {
    const { language } = req.params;
    const range = 'Hoja 1!A:J';
    
    // Llamada segura desde el servidor
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_SHEETS_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.values) {
      return res.json([]);
    }
    
    // Filtrar por idioma
    const languageCode = language === 'es' ? 'SP' : 'EN';
    const filteredRows = data.values.slice(1).filter(row => row && row[1] === languageCode);
    
    const posts = filteredRows.map((row, index) => ({
      id: row[0] || `post-${Date.now()}-${index}`,
      title: row[2] || `Post ${index + 1}`,
      excerpt: row[3] || '',
      content: row[4] || '',
      date: row[5] || new Date().toLocaleDateString(),
      readTime: row[6] || '5 min read',
      image: row[7] || 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg',
      videoUrl: row[8] && row[8].trim() !== '' ? row[8].trim() : undefined
    }));
    
    res.json(posts);
    
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Rate limiting para prevenir abuso
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});

app.use('/api/', limiter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
});