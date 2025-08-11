import React from 'react';
import { Calendar, Clock, ArrowRight, Settings, Volume2, VolumeX, Play } from 'lucide-react';
import BlogPostModal from './BlogPostModal';
import VideoModal from './VideoModal';
import { isValidYouTubeUrl } from '../utils/youtubeUtils';

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

interface BlogProps {
  language: 'en' | 'es';
  posts: BlogPost[];
  isAdmin: boolean;
  onAdminClick: () => void;
}

const Blog: React.FC<BlogProps> = ({ language, posts, isAdmin, onAdminClick }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [visiblePosts, setVisiblePosts] = React.useState(3);
  const [selectedPost, setSelectedPost] = React.useState<BlogPost | null>(null);
  const [playingPost, setPlayingPost] = React.useState<string | null>(null);
  const [speechSynthesis, setSpeechSynthesis] = React.useState<SpeechSynthesis | null>(null);
  const [selectedVideo, setSelectedVideo] = React.useState<{ url: string; title: string } | null>(null);

  React.useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }

    const updateVisiblePosts = () => {
      if (window.innerWidth < 768) {
        setVisiblePosts(1);
      } else if (window.innerWidth < 1024) {
        setVisiblePosts(2);
      } else {
        setVisiblePosts(3);
      }
    };

    updateVisiblePosts();
    window.addEventListener('resize', updateVisiblePosts);
    return () => window.removeEventListener('resize', updateVisiblePosts);
  }, []);

  const translations = {
    en: {
      title: "Latest Blog Posts",
      subtitle: "Insights and thoughts on AI and automation",
      readMore: "Read More",
      viewNext: "View Next Post",
      playAudio: "Listen to post",
      stopAudio: "Stop audio",
      watchVideo: "Watch video"
    },
    es: {
      title: "Últimas Entradas del Blog",
      subtitle: "Ideas y reflexiones sobre IA y automatización",
      readMore: "Leer Más",
      viewNext: "Ver Siguiente Entrada",
      playAudio: "Escuchar entrada",
      stopAudio: "Detener audio",
      watchVideo: "Ver video"
    }
  };

  const uiText = translations[language];

  const handleViewAllPosts = () => {
    const maxIndex = Math.max(0, posts.length - visiblePosts);
    const nextIndex = Math.min(currentIndex + 1, maxIndex);
    setCurrentIndex(nextIndex);
  };

  // Reset to beginning when posts change (new post added)
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [posts.length]);

  const displayedPosts = posts.slice(currentIndex, currentIndex + visiblePosts);


  const handleReadMore = (post: BlogPost) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleVideoClick = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.videoUrl && isValidYouTubeUrl(post.videoUrl)) {
      setSelectedVideo({ url: post.videoUrl, title: post.title });
    }
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const handlePlayAudio = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!speechSynthesis) {
      console.warn('Speech synthesis not available');
      return;
    }

    // Check if currently playing this post
    const isCurrentlyPlaying = playingPost === post.id;

    // Stop any current speech
    try {
      speechSynthesis.cancel();
    } catch (error) {
      console.warn('Error canceling speech:', error);
    }

    if (isCurrentlyPlaying) {
      setPlayingPost(null);
      return;
    }

    // iOS Safari requires user interaction to start speech
    // Check if speech synthesis is ready
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      // Wait a bit for cancellation to complete
      setTimeout(() => handlePlayAudio(post, e), 100);
      return;
    }

    // Create speech utterance
    const textToRead = `${post.title}. ${post.excerpt}. ${post.content}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Set language and voice
    utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
    utterance.rate = 0.8; // Slightly faster for more natural flow
    utterance.pitch = 1;
    utterance.volume = 0.9;
    
    // Get available voices and select appropriate one
    const voices = speechSynthesis.getVoices();
    
    let preferredVoice;
    if (language === 'es') {
      // For Spanish: prioritize premium natural voices
      preferredVoice = voices.find(voice => 
        voice.lang.startsWith('es') && (
          voice.name.includes('Mónica') || 
          voice.name.includes('Paulina') || 
          voice.name.includes('Jorge') ||
          voice.name.includes('Diego') ||
          voice.name.includes('Esperanza') ||
          voice.name.includes('Marisol')
        )
      ) || voices.find(voice => 
        voice.lang.startsWith('es') && voice.name.includes('Google') && voice.name.includes('es-ES')
      ) || voices.find(voice => 
        voice.lang.startsWith('es') && voice.localService === true
      ) || voices.find(voice => 
        voice.lang.startsWith('es') && voice.name.includes('Microsoft')
      ) || voices.find(voice => 
        voice.lang.startsWith('es')
      );
    } else {
      // For English: prioritize premium natural voices
      const englishVoicePreferences = [
        // Premium natural voices (macOS/iOS) - highest quality
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en') && (
          v.name.includes('Samantha') || 
          v.name.includes('Alex') || 
          v.name.includes('Victoria') ||
          v.name.includes('Allison') ||
          v.name.includes('Ava') ||
          v.name.includes('Susan')
        ),
        // Google Neural voices (very good quality)
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en') && v.name.includes('Google') && (
          v.name.includes('US') || v.name.includes('Neural') || v.name.includes('Wavenet')
        ),
        // Microsoft Neural voices
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en') && v.name.includes('Microsoft') && (
          v.name.includes('Aria') || 
          v.name.includes('Jenny') || 
          v.name.includes('Guy') ||
          v.name.includes('Zira') || 
          v.name.includes('David')
        ),
        // Other high-quality voices
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en') && (
          v.name.includes('Daniel') || 
          v.name.includes('Karen') || 
          v.name.includes('Moira') ||
          v.name.includes('Fiona') ||
          v.name.includes('Tessa')
        ),
        // Local service voices (usually better than remote)
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en-US') && v.localService === true,
        // Any US English voice
        (v: SpeechSynthesisVoice) => v.lang === 'en-US',
        // Any English voice as last resort
        (v: SpeechSynthesisVoice) => v.lang.startsWith('en')
      ];
      
      for (const preference of englishVoicePreferences) {
        preferredVoice = voices.find(preference);
        if (preferredVoice) break;
      }
    }
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      console.log(`🎙️ Using voice: ${preferredVoice.name} (${preferredVoice.lang}) - Local: ${preferredVoice.localService}`);
    } else {
      console.warn('No preferred voice found, using default');
    }

    // Fine-tune settings based on voice type
    if (preferredVoice) {
      if (preferredVoice.name.includes('Google') || preferredVoice.name.includes('Neural')) {
        // Google and Neural voices work better with slightly different settings
        utterance.rate = 0.85;
        utterance.pitch = 0.95;
      } else if (preferredVoice.name.includes('Microsoft')) {
        // Microsoft voices
        utterance.rate = 0.8;
        utterance.pitch = 1.05;
      } else if (preferredVoice.localService) {
        // Local/system voices (usually highest quality)
        utterance.rate = 0.9;
        utterance.pitch = 1;
      }
    }

    utterance.onstart = () => setPlayingPost(post.id);
    utterance.onend = () => setPlayingPost(null);
    utterance.onerror = (event) => {
      setPlayingPost(null);
      
      // Handle different error types
      if (event.error === 'interrupted' || event.error === 'canceled') {
        // These are normal when user stops audio, don't show error
        return;
      }
      
      console.error('Speech synthesis error:', event.error);
      
      // For other errors, show a subtle notification instead of alert
      const errorMessage = language === 'en' 
        ? 'Audio playback unavailable on this device'
        : 'Reproducción de audio no disponible en este dispositivo';
      
      // Create a temporary toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg z-50 text-sm';
      toast.textContent = errorMessage;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 3000);
    };

    // iOS Safari specific handling
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      // On iOS, we need to ensure voices are loaded
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Wait for voices to load on iOS
        speechSynthesis.addEventListener('voiceschanged', () => {
          handlePlayAudio(post, e);
        }, { once: true });
        return;
      }
    }

    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error starting speech:', error);
      setPlayingPost(null);
      
      const errorMessage = language === 'en' 
        ? 'Audio not supported on this device'
        : 'Audio no compatible con este dispositivo';
      
      // Show toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg z-50 text-sm';
      toast.textContent = errorMessage;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 3000);
    }
  };


  return (
    <section id="blog" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {uiText.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {uiText.subtitle}
          </p>
          <button
            onClick={onAdminClick}
            className="absolute top-0 right-0 p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title={isAdmin ? "Manage Blog Posts" : "Admin Login"}
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
            {displayedPosts.map((post, index) => (
              <article key={post.id} className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {language === 'es' ? 
                      post.readTime.replace(/\s*(min\s*)?(read|lectura)\s*/gi, '').replace(/^\d+/, '$& min') :
                      post.readTime
                    }
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => handleReadMore(post)}
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
                  >
                    {uiText.readMore}
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {post.videoUrl && isValidYouTubeUrl(post.videoUrl) && (
                      <button
                        onClick={(e) => handleVideoClick(post, e)}
                        className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        title={uiText.watchVideo}
                      >
                        <Play className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handlePlayAudio(post, e)}
                      className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      title={playingPost === post.id ? uiText.stopAudio : uiText.playAudio}
                    >
                      {playingPost === post.id ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </article>
            ))}
          </div>
          
          {posts.length > visiblePosts && (
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ←
              </button>
              <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                {currentIndex + 1} - {Math.min(currentIndex + visiblePosts, posts.length)} of {posts.length}
              </span>
              <button
                onClick={() => setCurrentIndex(Math.min(currentIndex + 1, Math.max(0, posts.length - visiblePosts)))}
                disabled={currentIndex >= posts.length - visiblePosts}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                →
              </button>
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <button 
            onClick={handleViewAllPosts}
            disabled={currentIndex >= posts.length - visiblePosts}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {uiText.viewNext}
          </button>
        </div>
      </div>
      
      {selectedPost && (
        <BlogPostModal
          post={selectedPost}
          onClose={handleCloseModal}
          language={language}
          playingPost={playingPost}
          onPlayAudio={handlePlayAudio}
        />
      )}
      
      {selectedVideo && (
        <VideoModal
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
          onClose={handleCloseVideo}
          language={language}
        />
      )}
    </section>
  );
};

export default Blog;