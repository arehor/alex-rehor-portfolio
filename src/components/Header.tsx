import React from 'react';
import { Moon, Sun, Globe, Menu, X } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: 'en' | 'es';
  toggleLanguage: () => void;
  isAdmin?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, language, toggleLanguage, isAdmin, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const translations = {
    en: {
      about: 'About',
      experience: 'Experience',
      blog: 'Blog',
      contact: 'Contact',
      menu: 'Menu'
    },
    es: {
      about: 'Sobre Mí',
      experience: 'Experiencia',
      blog: 'Blog',
      contact: 'Contacto',
      menu: 'Menú'
    }
  };

  const t = translations[language];

  const handleNavClick = (sectionId: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'contact') {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <button 
              onClick={() => handleNavClick('about')}
              className="text-xl font-bold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Alex Rehor
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => handleNavClick('about')}
              className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-medium"
            >
              {t.about}
            </button>
            <button 
              onClick={() => handleNavClick('experience')}
              className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-medium"
            >
              {t.experience}
            </button>
            <button 
              onClick={() => handleNavClick('blog')}
              className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-medium"
            >
              {t.blog}
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-medium"
            >
              {t.contact}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={t.menu}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Toggle Language"
            >
              <Globe className="w-5 h-5" />
              <span className="ml-1 text-sm font-medium">{language.toUpperCase()}</span>
            </button>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => handleNavClick('about')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                {t.about}
              </button>
              <button
                onClick={() => handleNavClick('experience')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                {t.experience}
              </button>
              <button
                onClick={() => handleNavClick('blog')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                {t.blog}
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                {t.contact}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;