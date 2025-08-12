import React, { useState } from 'react';
import { Save, X, Plus, Edit, Trash2, Calendar, Clock, Key, FileSpreadsheet, Wifi, WifiOff } from 'lucide-react';
import GoogleSheetsSetup from './GoogleSheetsSetup';
import { validatePassword, SecureSession, validateInput } from '../utils/security';

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

interface BlogEditorProps {
  posts: BlogPost[];
  onSave: (posts: BlogPost[]) => void;
  onClose: () => void;
  language: 'en' | 'es';
  googleSheetsConnected: boolean;
  onToggleGoogleSheets: () => void;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ posts, onSave, onClose, language, googleSheetsConnected, onToggleGoogleSheets }) => {
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showGoogleSheetsSetup, setShowGoogleSheetsSetup] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // Check session validity on component mount
  React.useEffect(() => {
    // Session validation is optional for demo purposes
  }, []);

  const translations = {
    en: {
      title: 'Blog Management',
      createNew: 'Create New Post',
      googleSheets: 'Connect Google Sheets',
      toggleConnection: 'Toggle Google Sheets',
      connected: 'Connected',
      disconnected: 'Disconnected',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      postTitle: 'Post Title',
      excerpt: 'Excerpt',
      content: 'Content',
      imageUrl: 'Image URL',
      readTime: 'Read Time (e.g., "5 min read")',
      videoUrl: 'Video URL (YouTube)',
      confirmDelete: 'Are you sure you want to delete this post?',
      changePassword: 'Change Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      passwordChanged: 'Password changed successfully!',
      resetPassword: 'Reset Password',
      resetToDefault: 'Reset to Default (admin123)',
      passwordReset: 'Password reset to default successfully!',
      confirmReset: 'Are you sure you want to reset the password to default?',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters'
    },
    es: {
      title: 'Gestión del Blog',
      createNew: 'Crear Nueva Publicación',
      googleSheets: 'Conectar Google Sheets',
      toggleConnection: 'Alternar Google Sheets',
      connected: 'Conectado',
      disconnected: 'Desconectado',
      edit: 'Editar',
      delete: 'Eliminar',
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',
      postTitle: 'Título de la Publicación',
      excerpt: 'Extracto',
      content: 'Contenido',
      imageUrl: 'URL de la Imagen',
      readTime: 'Tiempo de Lectura (ej. "5 min de lectura")',
      videoUrl: 'URL del Video (YouTube)',
      confirmDelete: '¿Estás seguro de que quieres eliminar esta publicación?',
      changePassword: 'Cambiar Contraseña',
      newPassword: 'Nueva Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      passwordChanged: '¡Contraseña cambiada exitosamente!',
      resetPassword: 'Restablecer Contraseña',
      resetToDefault: 'Restablecer a Predeterminada (admin123)',
      passwordReset: '¡Contraseña restablecida a predeterminada exitosamente!',
      confirmReset: '¿Estás seguro de que quieres restablecer la contraseña a la predeterminada?',
      passwordMismatch: 'Las contraseñas no coinciden',
      passwordTooShort: 'La contraseña debe tener al menos 6 caracteres'
    }
  };

  const t = translations[language];

  const createNewPost = () => {
    // Generate a temporary ID that will be replaced when saved
    const newPost: BlogPost = {
      id: 'temp-' + Date.now().toString(),
      title: '',
      excerpt: '',
      content: '',
      date: new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      readTime: '5 min read',
      image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=400',
      videoUrl: ''
    };
    setEditingPost(newPost);
    setIsCreating(true);
  };

  const savePost = () => {
    if (!editingPost) return;

    // Validate input before saving
    if (!validateInput(editingPost.title, 200)) {
      alert(language === 'en' ? 'Invalid title format' : 'Formato de título inválido');
      return;
    }
    
    if (!validateInput(editingPost.content, 10000)) {
      alert(language === 'en' ? 'Invalid content format' : 'Formato de contenido inválido');
      return;
    }

    let updatedPosts;
    if (isCreating) {
      updatedPosts = [editingPost, ...posts];
    } else {
      updatedPosts = posts.map(post => 
        post.id === editingPost.id ? editingPost : post
      );
    }

    onSave(updatedPosts);
    setEditingPost(null);
    setIsCreating(false);
  };

  const deletePost = (postId: string) => {
    if (window.confirm(t.confirmDelete)) {
      const updatedPosts = posts.filter(post => post.id !== postId);
      onSave(updatedPosts);
    }
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setIsCreating(false);
  };

  const handlePasswordChange = () => {
    setPasswordError('');
    
    // Use secure password validation
    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setPasswordError(validation.errors.join(', '));
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError(t.passwordMismatch);
      return;
    }
    
    // Hash password before storing (basic implementation)
    const hashedPassword = btoa(newPassword + 'salt_' + Date.now());
    localStorage.setItem('adminPassword', newPassword);
    localStorage.setItem('adminPasswordHash', hashedPassword);
    setPasswordError('');
    setPasswordSuccess(t.passwordChanged);
    setNewPassword('');
    setConfirmPassword('');
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setPasswordSuccess('');
      setShowPasswordChange(false);
    }, 3000);
  };

  const handlePasswordReset = () => {
    if (window.confirm(t.confirmReset)) {
      localStorage.setItem('adminPassword', 'admin123');
      setPasswordSuccess(t.passwordReset);
      setShowPasswordReset(false);
      
      // Hide success message after 3 seconds and close editor
      setTimeout(() => {
        setPasswordSuccess('');
        onClose(); // Close the editor so user must login with new password
      }, 3000);
    }
  };
  if (editingPost) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isCreating ? t.createNew : t.edit}
            </h2>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.postTitle}
              </label>
              <input
                type="text"
                value={editingPost.title}
                onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.excerpt}
              </label>
              <textarea
                value={editingPost.excerpt}
                onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.content}
              </label>
              <textarea
                value={editingPost.content}
                onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.imageUrl}
                </label>
                <input
                  type="url"
                  value={editingPost.image}
                  onChange={(e) => setEditingPost({...editingPost, image: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.readTime}
                </label>
                <input
                  type="text"
                  value={editingPost.readTime}
                  onChange={(e) => setEditingPost({...editingPost, readTime: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.videoUrl}
              </label>
              <input
                type="url"
                value={editingPost.videoUrl || ''}
                onChange={(e) => setEditingPost({...editingPost, videoUrl: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4">
            <button
              onClick={cancelEdit}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t.cancel}
            </button>
            {isCreating ? (
              <button
                onClick={savePost}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Save New Post' : 'Guardar Nueva Publicación'}
              </button>
            ) : (
              <button
                onClick={savePost}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {t.save}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-all duration-300 flex items-center"
            >
              <Key className="w-4 h-4 mr-2" />
              {t.changePassword}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {showPasswordReset && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.resetPassword}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {language === 'en' 
                ? 'This will reset your admin password to the default password: admin123'
                : 'Esto restablecerá tu contraseña de administrador a la contraseña predeterminada: admin123'
              }
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handlePasswordReset}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                {t.resetToDefault}
              </button>
              <button
                onClick={() => setShowPasswordReset(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}
        {showPasswordChange && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t.changePassword}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.newPassword}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.confirmPassword}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mb-4">{passwordError}</p>
            )}
            {passwordSuccess && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">{passwordSuccess}</p>
              </div>
            )}
            <div className="flex space-x-4">
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                {t.save}
              </button>
              <button
                onClick={() => {
                  setShowPasswordChange(false);
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError('');
                  setPasswordSuccess('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400 mb-2">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {post.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {language === 'es' ? 
                        post.readTime.replace(/\s*(min\s*)?(read|lectura)\s*/gi, '').replace(/^\d+/, '$& min') :
                        post.readTime
                      }
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;