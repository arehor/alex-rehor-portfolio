import React, { useState, useRef } from 'react';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';

interface HeroProps {
  language: 'en' | 'es';
  onContactClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ language, onContactClick }) => {

  const translations = {
    en: {
      greeting: "Hello, I'm",
      role: "AI Consultant & Data Strategist",
      description: "You've heard about AI, automation, and data science — but no one tells you how to actually use them to save time or money. That's where I come in. I help businesses that feel stuck or overwhelmed turn messy data and manual workflows into smart, scalable systems. With the right mix of AI agents, machine learning, and clear dashboards, I simplify complexity to deliver real results — lower costs, faster decisions, and more time to focus on what matters.",
      slogan: "Automate the boring. Amplify the smart.",
      location: "Based in Buenos Aires, Argentina",
      getInTouch: "Get In Touch",
      viewWork: "View My Work"
    },
    es: {
      greeting: "Hola, soy",
      role: "Consultor de IA y Estratega de Datos",
      description: "Seguramente has oído hablar de IA, automatización y ciencia de datos, pero nadie te explica cómo utilizarlos realmente para ahorrar tiempo y dinero. Ahí es donde intervengo. Ayudo a empresas que se sienten estancadas o abrumadas a transformar datos desordenados y procesos manuales en sistemas inteligentes y escalables. Con la combinación adecuada de agentes de IA, machine learning y dashboards claros, simplifico la complejidad para ofrecer resultados tangibles: costos reducidos, decisiones más ágiles y más tiempo para enfocarte en lo que realmente importa.",
      slogan: "Automatiza lo aburrido. Potencia lo inteligente.",
      location: "Ubicado en Buenos Aires, Argentina",
      getInTouch: "Hablemos",
      viewWork: "Ver Mi Trabajo"
    }
  };

  const t = translations[language];

  return (
    <section id="about" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-lg text-gray-600 dark:text-gray-300">{t.greeting}</p>
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white">
                <span className="text-orange-500">Alex Rehor</span>
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-200 font-medium">{t.role}</p>
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {t.description}
            </p>
            
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {t.slogan}
            </p>
            
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <MapPin className="w-5 h-5" />
              <span>{t.location}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onContactClick}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {t.getInTouch}
              </button>
              <button className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                {t.viewWork}
              </button>
            </div>
            
            <div className="flex space-x-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transform hover:scale-110 transition-all duration-300">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transform hover:scale-110 transition-all duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/alejandro-alonso-%C5%99eho%C5%99-55b2844a/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transform hover:scale-110 transition-all duration-300">
                <Linkedin className="w-6 h-6" />
              </a>
              <button 
                onClick={onContactClick}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transform hover:scale-110 transition-all duration-300"
                title={language === 'en' ? 'Contact me' : 'Contactarme'}
              >
                <Mail className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-blue-600 to-emerald-600 p-2">
                <img
                  src="/ChatGPT Image Jul 23, 2025, 04_06_08 PM.png"
                  alt="Alex Rehor"
                  className="w-full h-full rounded-full object-cover object-[20%_center]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;