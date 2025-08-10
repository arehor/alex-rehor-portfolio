import React from 'react';

const TechRibbon: React.FC = () => {
  const technologies = [
    {
      name: 'R',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg'
    },
    {
      name: 'RStudio',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rstudio/rstudio-original.svg'
    },
    {
      name: 'Plotly',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/plotly/plotly-original.svg'
    },
    {
      name: 'Shiny',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg'
    },
    {
      name: 'Python',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'
    },
    {
      name: 'GitHub Copilot',
      logo: 'https://github.githubassets.com/images/modules/site/copilot/copilot.png'
    },
    {
      name: 'SAP',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg'
    },
    {
      name: 'D3.js',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/d3js/d3js-original.svg'
    },
    {
      name: 'n8n',
      logo: 'https://n8n.io/favicon.ico'
    },
    {
      name: 'Make',
      logo: '/make-color (1).svg'
    },
    {
      name: 'Vapi',
      logo: 'https://docs.vapi.ai/img/logo.svg'
    },
    {
      name: 'Claude',
      logo: '/claude-color.svg'
    },
    {
      name: 'OpenAI',
      logo: '/openai.svg'
    },
    {
      name: 'Gemini',
      logo: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg'
    },
    {
      name: 'ElevenLabs',
      logo: 'https://elevenlabs.io/favicon.ico'
    },
    {
      name: 'HeyGen',
      logo: 'https://heygen.com/favicon.ico'
    },
    {
      name: 'Glide',
      logo: 'https://glideapps.com/favicon.ico'
    },
    {
      name: 'LangChain',
      logo: 'https://python.langchain.com/img/favicon.ico'
    },
    {
      name: 'Chroma',
      logo: 'https://www.trychroma.com/favicon.ico'
    },
    {
      name: 'Pinecone',
      logo: 'https://www.pinecone.io/favicon.ico'
    },
    {
      name: 'Power BI',
      logo: 'https://powerbi.microsoft.com/pictures/application-logos/svg/powerbi.svg'
    },
    {
      name: 'Excel',
      logo: 'https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/brand-icons/product/svg/excel_48x1.svg'
    }
  ];

  return (
    <div className="py-8 bg-gray-900 dark:bg-gray-800 overflow-hidden relative">
      <div className="flex animate-scroll whitespace-nowrap" style={{ width: 'max-content' }}>
        {[...technologies, ...technologies].map((tech, index) => (
          <div
            key={index}
            className="flex-shrink-0 mx-6 px-6 py-4 bg-white dark:bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3"
          >
            <img
              src={tech.logo}
              alt={tech.name}
              className="w-8 h-8 object-contain flex-shrink-0"
              onError={(e) => {
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent && !parent.querySelector('.fallback-text')) {
                  const fallback = document.createElement('span');
                  fallback.className = 'fallback-text text-gray-800 dark:text-gray-200 font-medium text-sm';
                  fallback.textContent = tech.name;
                  parent.appendChild(fallback);
                }
              }}
            />
            <span className="text-gray-800 dark:text-gray-200 font-medium text-base whitespace-nowrap flex-shrink-0">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechRibbon;