import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TechRibbon from './components/TechRibbon';
import Experience from './components/Experience';
import Blog from './components/Blog';
import AdminLogin from './components/AdminLogin';
import BlogEditor from './components/BlogEditor';
import ExperienceEditor from './components/ExperienceEditor';
import Footer from './components/Footer';
import ContactForm from './components/ContactForm';
import GoogleSheetsService from './services/googleSheets';

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

interface WorkExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  photo: string;
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Building Modern AI Applications with Machine Learning',
      excerpt: 'Exploring the benefits of using AI and machine learning for building intelligent and scalable applications.',
      content: 'Artificial Intelligence has become an essential tool for modern business automation. In this post, we explore how to leverage AI and machine learning to build applications that are not only intelligent but also scalable and efficient.\n\nKey benefits include:\n- Automated decision making\n- Predictive analytics\n- Enhanced user experiences\n- Reduced operational costs\n\nBy implementing these technologies correctly, businesses can transform their operations and stay competitive in the digital age.',
      date: 'January 15, 2024',
      readTime: '5 min read',
      image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: '2',
      title: 'Data Visualization Best Practices for Business Intelligence',
      excerpt: 'Learn how to create compelling dashboards and reports that drive business decisions.',
      content: 'Effective data visualization is crucial for business intelligence success. This guide covers the essential principles and best practices for creating dashboards that actually get used.\n\nCore principles:\n- Know your audience\n- Choose the right chart types\n- Keep it simple and focused\n- Use color strategically\n- Tell a story with your data\n\nWhen done right, data visualization transforms raw numbers into actionable insights that drive business growth.',
      date: 'December 28, 2023',
      readTime: '7 min read',
      image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
      videoUrl: ''
    },
    {
      id: '3',
      title: 'Automating Business Processes with AI Agents',
      excerpt: 'Discover how AI agents can streamline your workflows and reduce manual tasks.',
      content: 'AI agents are revolutionizing how businesses handle repetitive tasks and complex workflows. This comprehensive guide shows you how to implement AI automation in your organization.\n\nTypes of AI agents:\n- Chatbots for customer service\n- Document processing agents\n- Workflow automation bots\n- Predictive maintenance systems\n\nThe key is starting small, measuring results, and scaling what works. AI agents can save thousands of hours annually while improving accuracy and consistency.',
      date: 'December 10, 2023',
      readTime: '6 min read',
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
      videoUrl: 'https://youtu.be/ScMzIvxBSi4'
    }
  ]);
  const [experiences, setExperiences] = useState<WorkExperience[]>([
    {
      id: '1',
      role: 'AI Consultant & Data Strategist',
      company: 'Independent Consultant',
      period: '2023 - Present',
      location: 'Buenos Aires, Argentina',
      description: 'Helping businesses transform manual workflows into intelligent, automated systems using AI agents, machine learning, and data visualization. Specializing in cost reduction and decision-making acceleration through smart technology implementation.',
      photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      role: 'Senior Data Analyst',
      company: 'Global Tech Solutions',
      period: '2021 - 2023',
      location: 'Remote',
      description: 'Built advanced analytics dashboards and predictive models using R, Python, and Power BI. Automated reporting processes that saved 40+ hours per week and improved decision-making speed by 60%.',
      photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '3',
      role: 'Business Intelligence Developer',
      company: 'Enterprise Analytics Corp',
      period: '2019 - 2021',
      location: 'Buenos Aires, Argentina',
      description: 'Designed and implemented data warehouses and ETL processes. Created interactive dashboards that transformed raw data into actionable business insights for C-level executives.',
      photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
    }
  ]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [showExperienceEditor, setShowExperienceEditor] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [googleSheetsService] = useState(new GoogleSheetsService());
  const [googleSheetsConnected, setGoogleSheetsConnected] = useState(false);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language') as 'en' | 'es';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Load saved blog posts if available
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
          setPosts(parsedPosts);
        }
      } catch (error) {
        console.error('Error loading saved posts:', error);
      }
    }

    // Load saved experiences if available
    const savedExperiences = localStorage.getItem('workExperiences');
    if (savedExperiences) {
      try {
        const parsedExperiences = JSON.parse(savedExperiences);
        if (Array.isArray(parsedExperiences) && parsedExperiences.length > 0) {
          setExperiences(parsedExperiences);
        }
      } catch (error) {
        console.error('Error loading saved experiences:', error);
      }
    }

    // Try to load from Google Sheets
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const sheetsPosts = await googleSheetsService.fetchPostsByLanguage(language);
      if (sheetsPosts && sheetsPosts.length > 0) {
        setPosts(sheetsPosts);
        setGoogleSheetsConnected(true);
      } else {
        setGoogleSheetsConnected(false);
      }
    } catch (error) {
      console.error('Error loading blog posts:', error);
      setGoogleSheetsConnected(false);
    }
  };

  // Reload posts when language changes
  useEffect(() => {
    loadBlogPosts();
  }, [language]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleAdminClick = () => {
    setShowAdminLogin(true);
  };

  const handleExperienceAdminClick = () => {
    setShowAdminLogin(true);
  };

  const handleLogin = (password: string) => {
    setIsAdmin(true);
    setShowAdminLogin(false);
    setShowBlogEditor(true);
  };

  const handleSavePosts = (updatedPosts: BlogPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
  };

  const handleSaveExperiences = (updatedExperiences: WorkExperience[]) => {
    setExperiences(updatedExperiences);
    localStorage.setItem('workExperiences', JSON.stringify(updatedExperiences));
  };

  const handleCloseEditor = () => {
    setShowBlogEditor(false);
  };

  const handleCloseExperienceEditor = () => {
    setShowExperienceEditor(false);
  };

  const handleShowContactForm = () => {
    setShowContactForm(true);
  };

  const handleCloseContactForm = () => {
    setShowContactForm(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setShowBlogEditor(false);
    setShowExperienceEditor(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        language={language}
        toggleLanguage={toggleLanguage}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />
      
      <main>
        <Hero language={language} onContactClick={handleShowContactForm} />
        <TechRibbon />
        <Experience 
          language={language} 
          onContactClick={handleShowContactForm}
          experiences={experiences}
          isAdmin={isAdmin}
          onAdminClick={handleExperienceAdminClick}
        />
        <Blog 
          language={language} 
          posts={posts}
          isAdmin={isAdmin}
          onAdminClick={handleAdminClick}
        />
      </main>
      
      <Footer language={language} onContactClick={handleShowContactForm} />
      
      {showAdminLogin && (
        <AdminLogin 
          onLogin={handleLogin}
          language={language}
        />
      )}
      
      {showBlogEditor && (
        <BlogEditor
          posts={posts}
          onSave={handleSavePosts}
          onClose={handleCloseEditor}
          language={language}
          googleSheetsConnected={googleSheetsConnected}
          onToggleGoogleSheets={() => setGoogleSheetsConnected(!googleSheetsConnected)}
        />
      )}
      
      {showExperienceEditor && (
        <ExperienceEditor
          experiences={experiences}
          onSave={handleSaveExperiences}
          onClose={handleCloseExperienceEditor}
          language={language}
        />
      )}
      
      {showContactForm && (
        <ContactForm
          onClose={handleCloseContactForm}
          language={language}
        />
      )}
    </div>
  );
}

export default App;