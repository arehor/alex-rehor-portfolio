/**
 * Utility functions for YouTube video handling
 */

/**
 * Checks if a URL is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
  return youtubeRegex.test(url.trim());
}

/**
 * Extracts YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  
  const trimmedUrl = url.trim();
  
  // Handle youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmedUrl.match(/(?:youtube\.com\/watch\?v=)([^&\n?#]+)/);
  if (watchMatch) return watchMatch[1];
  
  // Handle youtu.be/VIDEO_ID
  const shortMatch = trimmedUrl.match(/(?:youtu\.be\/)([^&\n?#]+)/);
  if (shortMatch) return shortMatch[1];
  
  // Handle youtube.com/embed/VIDEO_ID
  const embedMatch = trimmedUrl.match(/(?:youtube\.com\/embed\/)([^&\n?#]+)/);
  if (embedMatch) return embedMatch[1];
  
  return null;
}

/**
 * Converts any YouTube URL to embed format
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Gets YouTube thumbnail URL from video URL
 */
export function getYouTubeThumbnail(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}