import React from 'react';
import { Calendar, MapPin, ExternalLink, Settings } from 'lucide-react';

interface WorkExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  photo: string;
}

interface ExperienceProps {
  language: 'en' | 'es';
  onContactClick: () => void;
  experiences: WorkExperience[];
  isAdmin: boolean;
  onAdminClick: () => void;
}

const Experience: React.FC<ExperienceProps> = ({ language, onContactClick, experiences, isAdmin, onAdminClick }) => {
  const translations = {
    en: {
      title: "Experience & Skills",
      subtitle: "My journey in the world of technology",
      skills: ["AI-Powered Automation", "Data Analysis & Business Intelligence", "Machine Learning & Predictive Modeling", "Custom AI Agent Development", "Workflow Optimization with LLMs", "Dashboards & Data Storytelling"]
    },
    es: {
      title: "Experiencia y Habilidades",
      subtitle: "Mi trayectoria en el mundo de la tecnología",
      skills: ["Automatización con IA", "Análisis de Datos e Inteligencia de Negocio", "Machine Learning y Modelado Predictivo", "Desarrollo de Agentes de IA Personalizados", "Optimización de Procesos con LLMs", "Dashboards y Storytelling de Datos"]
    }
  };

  const t = translations[language];

  return (
    <section id="experience" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t.subtitle}
          </p>
          <button
            onClick={onAdminClick}
            className="absolute top-0 right-0 p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title={isAdmin ? "Manage Experience" : "Admin Login"}
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8 relative">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              {language === 'en' ? 'Work Experience' : 'Experiencia Laboral'}
            </h3>
            {experiences.map((exp, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-emerald-600 p-0.5 flex-shrink-0">
                    <img
                      src={exp.photo}
                      alt={`${exp.role} at ${exp.company}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {exp.role}
                    </h4>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {exp.company}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {exp.period}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {exp.location}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer flex-shrink-0" />
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              {language === 'en' ? 'Core Skills' : 'Habilidades Principales'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {t.skills.map((skill, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg p-4 text-center font-medium hover:from-blue-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300">
                  {skill}
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'en' ? 'Let\'s Collaborate' : 'Colaboremos'}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {language === 'en' 
                  ? 'Always open to new opportunities and exciting projects. Let\'s build something amazing together!'
                  : '¡Siempre abierto a nuevas oportunidades y proyectos emocionantes. Construyamos algo increíble juntos!'
                }
              </p>
              <button 
                onClick={onContactClick}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all duration-300"
              >
                {language === 'en' ? 'Contact Me' : 'Contactarme'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
            {language === 'en' ? 'View All Experience' : 'Ver Toda la Experiencia'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Experience;