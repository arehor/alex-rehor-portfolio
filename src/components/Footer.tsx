import React from 'react';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

interface FooterProps {
  language: 'en' | 'es';
  onContactClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ language, onContactClick }) => {
  const translations = {
    en: {
      madeWith: "Made with",
      by: "by Alex Rehor",
      rights: "All rights reserved.",
      quickLinks: "Quick Links",
      connect: "Connect",
      about: "About",
      experience: "Experience",
      blog: "Blog",
      contact: "Contact"
    },
    es: {
      madeWith: "Hecho con",
      by: "por Alex Rehor",
      rights: "Todos los derechos reservados.",
      quickLinks: "Accesos Rápidos",
      connect: "Conectar",
      about: "Sobre Mí",
      experience: "Experiencia",
      blog: "Blog",
      contact: "Contacto"
    }
  };

  const t = translations[language];

  return (
    <footer id="contact" className="bg-gray-900 dark:bg-black text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-orange-500">Alex Rehor</h3>
            <p className="text-gray-300 mb-4">
              {language === 'en' 
                ? 'AI Consultant & Data Strategist'
                : 'Consultor de IA y Estratega de Datos'
              }
            </p>
            <p className="text-gray-400 mb-4 font-bold">
              {language === 'en'
                ? 'Automate the boring. Amplify the smart.'
                : 'Automatiza lo aburrido. Amplifica lo inteligente.'
              }
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transform hover:scale-110 transition-all duration-300">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transform hover:scale-110 transition-all duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/alejandro-alonso-%C5%99eho%C5%99-55b2844a/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transform hover:scale-110 transition-all duration-300">
                <Linkedin className="w-6 h-6" />
              </a>
              <button 
                onClick={onContactClick}
                className="text-gray-400 hover:text-blue-400 transform hover:scale-110 transition-all duration-300"
                title={language === 'en' ? 'Contact me' : 'Contactarme'}
              >
                <Mail className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.quickLinks}</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-blue-400 transition-colors">{t.about}</a></li>
              <li><a href="#experience" className="text-gray-400 hover:text-blue-400 transition-colors">{t.experience}</a></li>
              <li><a href="#blog" className="text-gray-400 hover:text-blue-400 transition-colors">{t.blog}</a></li>
              <li><button onClick={onContactClick} className="text-gray-400 hover:text-blue-400 transition-colors">{t.contact}</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t.connect}</h4>
            <p className="text-gray-400 mb-2">arehor@me.com</p>
            <p className="text-gray-400">+54 11 4969 7750</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center">
            {t.madeWith} <Heart className="w-4 h-4 mx-1 text-red-500" /> {t.by} • © 2024 {t.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;