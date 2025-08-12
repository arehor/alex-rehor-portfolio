import React from 'react';
import { X, Calendar, Clock, User, Volume2, VolumeX, Play } from 'lucide-react';
import VideoModal from './VideoModal';
import { isValidYouTubeUrl } from '../utils/youtubeUtils';
import { sanitizeHtml, sanitizeHtmlStrict } from '../utils/security';

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

interface BlogPostModalProps {
  post: BlogPost;
  onClose: () => void;
  language: 'en' | 'es';
  playingPost?: string | null;
  onPlayAudio?: (post: BlogPost, e: React.MouseEvent) => void;
}

const BlogPostModal: React.FC<BlogPostModalProps> = ({ post, onClose, language, playingPost, onPlayAudio }) => {
  const [selectedVideo, setSelectedVideo] = React.useState<{ url: string; title: string } | null>(null);

  const translations = {
    en: {
      close: 'Close',
      author: 'Alex Rehor',
      playAudio: 'Listen to post',
      stopAudio: 'Stop audio',
      watchVideo: 'Watch video'
    },
    es: {
      close: 'Cerrar',
      author: 'Alex Rehor',
      playAudio: 'Escuchar entrada',
      stopAudio: 'Detener audio',
      watchVideo: 'Ver video'
    }
  };

  const t = translations[language];

  // Stop audio when modal closes
  const handleClose = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (error) {
        console.warn('Error canceling speech on modal close:', error);
      }
    }
    onClose();
  };
  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Stop audio when component unmounts
  React.useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
        } catch (error) {
          console.warn('Error canceling speech on unmount:', error);
        }
      }
    };
  }, []);
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.videoUrl && isValidYouTubeUrl(post.videoUrl)) {
      setSelectedVideo({ url: post.videoUrl, title: post.title });
    }
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-start z-10">
          <div className="flex-1 pr-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {t.author}
              </div>
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
              {onPlayAudio && (
                <button
                  onClick={(e) => onPlayAudio(post, e)}
                  className="flex items-center px-3 py-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  title={playingPost === post.id ? t.stopAudio : t.playAudio}
                >
                  {playingPost === post.id ? (
                    <VolumeX className="w-4 h-4 mr-1" />
                  ) : (
                    <Volume2 className="w-4 h-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">
                    {playingPost === post.id ? t.stopAudio : t.playAudio}
                  </span>
                </button>
              )}
              {post.videoUrl && isValidYouTubeUrl(post.videoUrl) && (
                <button
                  onClick={handleVideoClick}
                  className="flex items-center px-3 py-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                  title={t.watchVideo}
                >
                  <Play className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">
                    {t.watchVideo}
                  </span>
                </button>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
            title={t.close}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Featured Image */}
        <div className="relative overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Excerpt */}
          {post.excerpt && (
            <div className="mb-6">
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic border-l-4 border-blue-500 pl-4">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Main Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div 
              className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: sanitizeHtmlStrict(post.content) }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'en' 
                ? `Published on ${post.date} • ${post.readTime}`
                : `Publicado el ${post.date} • ${post.readTime.replace(/\s*(min\s*)?(read|lectura)\s*/gi, '').replace(/^\d+/, '$& min')}`
              }
            </div>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all duration-300"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
      
      {selectedVideo && (
        <VideoModal
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
          onClose={handleCloseVideo}
          language={language}
        />
      )}
    </div>
  );
};

export default BlogPostModal;