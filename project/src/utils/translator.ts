import { useEffect, useState } from "react";

const SHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const RANGE = "'Hoja 1'!A2:B100";

let translations: Record<string, string> = {};
let isLoaded = false;

// Built-in translation dictionary as fallback
const builtInTranslations: Record<string, string> = {
  // Blog titles and content
  "Building Modern AI Applications with Machine Learning": "Construyendo Aplicaciones de IA Modernas con Aprendizaje Automático",
  "Exploring the benefits of using AI and machine learning for building intelligent and scalable applications.": "Explorando los beneficios de usar IA y aprendizaje automático para construir aplicaciones inteligentes y escalables.",
  "Artificial Intelligence has become an essential tool for modern business automation...": "La Inteligencia Artificial se ha convertido en una herramienta esencial para la automatización empresarial moderna...",
  
  // Time expressions
  "5 min read": "5 min",
  "3 min read": "3 min",
  "10 min read": "10 min",
  "min read": "min",
  
  // Technical terms
  "machine learning": "aprendizaje automático",
  "artificial intelligence": "inteligencia artificial",
  "data science": "ciencia de datos",
  "automation": "automatización",
  "business intelligence": "inteligencia de negocios",
  "predictive modeling": "modelado predictivo",
  "data visualization": "visualización de datos",
  "workflow optimization": "optimización de flujos de trabajo",
  "AI agents": "agentes de IA",
  "smart technology": "tecnología inteligente",
  "decision-making": "toma de decisiones",
  "cost reduction": "reducción de costos",
  "scalable systems": "sistemas escalables",
  "intelligent applications": "aplicaciones inteligentes",
  
  // Common phrases
  "January 15, 2024": "15 de enero, 2024",
  "February": "febrero",
  "March": "marzo",
  "April": "abril",
  "May": "mayo",
  "June": "junio",
  "July": "julio",
  "August": "agosto",
  "September": "septiembre",
  "October": "octubre",
  "November": "noviembre",
  "December": "diciembre",
  
  // Reverse translations (ES to EN)
  "Construyendo Aplicaciones de IA Modernas con Machine Learning": "Building Modern AI Applications with Machine Learning",
  "Explorando los beneficios de utilizar IA y machine learning para crear aplicaciones inteligentes y escalables.": "Exploring the benefits of using AI and machine learning for building intelligent and scalable applications.",
  "La Inteligencia Artificial se ha convertido en una herramienta fundamental para la automatización empresarial moderna...": "Artificial Intelligence has become an essential tool for modern business automation...",
  "machine learning": "machine learning",
  "inteligencia artificial": "artificial intelligence",
  "ciencia de datos": "data science",
  "automatización": "automation",
  "inteligencia de negocio": "business intelligence",
  "modelado predictivo": "predictive modeling",
  "visualización de datos": "data visualization",
  "optimización de procesos": "workflow optimization",
  "agentes de IA": "AI agents",
  "tecnología inteligente": "smart technology",
  "toma de decisiones": "decision-making",
  "reducción de costos": "cost reduction",
  "sistemas escalables": "scalable systems",
  "aplicaciones inteligentes": "intelligent applications"
};

/**
 * Fetch translations from Google Sheets and populate the translations dictionary.
 */
export async function loadTranslations(): Promise<void> {
  try {
    if (!SHEET_ID || !API_KEY) {
      console.log("Google Sheets credentials not configured for translations, using built-in translations");
      translations = { ...builtInTranslations };
      isLoaded = true;
      return;
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values) {
      console.log("No translations found in Google Sheets, using built-in translations");
      translations = { ...builtInTranslations };
      isLoaded = true;
      return;
    }

    translations = { ...builtInTranslations }; // Start with built-in translations
    
    for (const [en, es] of data.values) {
      if (en && es) {
        translations[en.trim()] = es.trim();
        translations[es.trim()] = en.trim(); // Bidirectional
      }
    }

    console.log(`Loaded ${Object.keys(translations).length / 2} translation pairs from Google Sheets`);
    isLoaded = true;
  } catch (error) {
    console.error("Error loading translations from Google Sheets:", error);
    console.log("Using built-in translations as fallback");
    translations = { ...builtInTranslations };
    isLoaded = true;
  }
}

/**
 * Translate text using loaded translations with improved logic.
 * @param text The text to translate
 * @param to Target language: 'es' or 'en'
 */
export function translateText(text: string, to: 'es' | 'en'): string {
  if (!text) return "";
  if (!isLoaded) {
    console.warn("Translations not loaded yet. Returning original text.");
    return text;
  }

  const trimmedText = text.trim();
  
  // 1. Direct lookup in translations dictionary (exact match)
  const directTranslation = translations[trimmedText];
  if (directTranslation) {
    return directTranslation;
  }

  // 2. Case-insensitive lookup for better matching
  const lowerText = trimmedText.toLowerCase();
  for (const [key, value] of Object.entries(translations)) {
    if (key.toLowerCase() === lowerText) {
      return value;
    }
  }

  // 3. Handle time expressions (e.g., "5 min read" → "5 min de lectura")
  if (to === 'es') {
    const timeMatch = trimmedText.match(/^(\d+)\s*min\s*read$/i);
    if (timeMatch) {
      return `${timeMatch[1]} min de lectura`;
    }
  } else if (to === 'en') {
    const timeMatch = trimmedText.match(/^(\d+)\s*min\s*de\s*lectura$/i);
    if (timeMatch) {
      return `${timeMatch[1]} min read`;
    }
  }

  // 4. Partial text matching for longer content
  for (const [key, value] of Object.entries(translations)) {
    if (trimmedText.includes(key) && key.length > 10) { // Only for substantial phrases
      const translatedText = trimmedText.replace(new RegExp(key, 'gi'), value);
      if (translatedText !== trimmedText) {
        return translatedText;
      }
    }
  }

  // 5. Return original text if no translation found
  return text;
}

/**
 * Returns whether the translations have finished loading
 */
export function isTranslationReady(): boolean {
  return isLoaded;
}

/**
 * Custom React hook for using the translator
 */
export function useTranslator(): {
  t: (text: string, to: 'es' | 'en') => string;
  ready: boolean;
} {
  const [ready, setReady] = useState(isLoaded);

  useEffect(() => {
    if (!isLoaded) {
      loadTranslations().then(() => setReady(true));
    }
  }, []);

  const t = (text: string, to: 'es' | 'en') => translateText(text, to);

  return { t, ready };
}