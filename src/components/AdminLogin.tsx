import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (password: string) => void;
  language: 'en' | 'es';
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, language }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const translations = {
    en: {
      title: 'Admin Access',
      subtitle: 'Enter password to manage blog posts',
      password: 'Password',
      login: 'Login',
      wrongPassword: 'Incorrect password'
    },
    es: {
      title: 'Acceso de Administrador',
      subtitle: 'Ingresa la contraseña para gestionar las publicaciones del blog',
      password: 'Contraseña',
      login: 'Iniciar Sesión',
      wrongPassword: 'Contraseña incorrecta'
    }
  };

  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem('adminPassword') || 'admin123';
    if (password === savedPassword) {
      onLogin(password);
      setError('');
    } else {
      setError(t.wrongPassword);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.password}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all duration-300"
          >
            {t.login}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;