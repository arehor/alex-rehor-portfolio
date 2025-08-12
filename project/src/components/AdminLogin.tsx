import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { validatePassword, SecureSession, rateLimiter } from '../utils/security';

interface AdminLoginProps {
  onLogin: (password: string) => void;
  language: 'en' | 'es';
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, language }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const translations = {
    en: {
      title: 'Admin Access',
      subtitle: 'Enter password to manage blog posts',
      password: 'Password',
      login: 'Login',
      wrongPassword: 'Incorrect password',
      tooManyAttempts: 'Too many failed attempts. Please try again in {time} seconds.',
      weakPassword: 'Password does not meet security requirements'
    },
    es: {
      title: 'Acceso de Administrador',
      subtitle: 'Ingresa la contraseña para gestionar las publicaciones del blog',
      password: 'Contraseña',
      login: 'Iniciar Sesión',
      wrongPassword: 'Contraseña incorrecta',
      tooManyAttempts: 'Demasiados intentos fallidos. Intenta nuevamente en {time} segundos.',
      weakPassword: 'La contraseña no cumple con los requisitos de seguridad'
    }
  };

  const t = translations[language];
  const savedPassword = localStorage.getItem('adminPassword') || 'admin123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Enhanced rate limiting with exponential backoff
    const clientId = 'admin_login';
    if (!advancedRateLimiter.isAllowed(clientId, 3, 300000)) {
      const remainingTime = advancedRateLimiter.getRemainingTime(clientId);
      setError(t.tooManyAttempts.replace('{time}', remainingTime.toString()));
      setIsSubmitting(false);
      return;
    }
    
    // Verify password with hash
    verifyStoredPassword(password)
      .then(isValid => {
        if (isValid) {
          advancedRateLimiter.reset(clientId); // Reset on successful login
          onLogin(password);
          setError('');
        } else {
          setError(t.wrongPassword);
        }
        setIsSubmitting(false);
      })
      .catch(error => {
        console.error('Password verification error:', error);
        setError(t.wrongPassword);
        setIsSubmitting(false);
      });
  };
  
  const verifyStoredPassword = async (inputPassword: string): Promise<boolean> => {
    try {
      const storedHash = await SecureStorage.getItem('adminPasswordHash');
      const storedSalt = await SecureStorage.getItem('adminPasswordSalt');
      
      if (storedHash && storedSalt) {
        return await verifyPassword(inputPassword, storedHash, storedSalt);
      } else {
        // Fallback to plain text for existing installations
        const plainPassword = localStorage.getItem('adminPassword') || 'admin123';
        if (inputPassword === plainPassword) {
          // Upgrade to hashed password
          const { hash, salt } = await hashPassword(inputPassword);
          await SecureStorage.setItem('adminPasswordHash', hash);
          await SecureStorage.setItem('adminPasswordSalt', salt);
          localStorage.removeItem('adminPassword'); // Remove plain text
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Password verification error:', error);
      // Fallback to plain text comparison
      const plainPassword = localStorage.getItem('adminPassword') || 'admin123';
      return inputPassword === plainPassword;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{t.subtitle}</p>
          
          {savedPassword === 'admin123' && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>Security Warning:</strong> {language === 'en' 
                  ? 'You are using the default password. Please change it immediately after logging in.'
                  : 'Estás usando la contraseña predeterminada. Por favor cámbiala inmediatamente después de iniciar sesión.'
                }
              </p>
            </div>
          )}
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
            disabled={isSubmitting || isLocked}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLocked ? `${t.login} (${lockTimeRemaining}s)` : t.login}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;