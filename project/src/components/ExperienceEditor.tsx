import React, { useState } from 'react';
import { Save, X, Plus, Edit, Trash2, Calendar, MapPin, User, Key } from 'lucide-react';

interface WorkExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  photo: string;
}

interface ExperienceEditorProps {
  experiences: WorkExperience[];
  onSave: (experiences: WorkExperience[]) => void;
  onClose: () => void;
  language: 'en' | 'es';
}

const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ experiences, onSave, onClose, language }) => {
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const translations = {
    en: {
      title: 'Experience Management',
      createNew: 'Add New Experience',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      role: 'Job Role',
      company: 'Company',
      period: 'Period (e.g., "2020 - 2022")',
      location: 'Location',
      description: 'Description',
      photoUrl: 'Photo URL',
      confirmDelete: 'Are you sure you want to delete this experience?',
      changePassword: 'Change Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      passwordChanged: 'Password changed successfully!',
      passwordMismatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters'
    },
    es: {
      title: 'Gestión de Experiencia',
      createNew: 'Agregar Nueva Experiencia',
      edit: 'Editar',
      delete: 'Eliminar',
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',
      role: 'Puesto de Trabajo',
      company: 'Empresa',
      period: 'Período (ej. "2020 - 2022")',
      location: 'Ubicación',
      description: 'Descripción',
      photoUrl: 'URL de la Foto',
      confirmDelete: '¿Estás seguro de que quieres eliminar esta experiencia?',
      changePassword: 'Cambiar Contraseña',
      newPassword: 'Nueva Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      passwordChanged: '¡Contraseña cambiada exitosamente!',
      passwordMismatch: 'Las contraseñas no coinciden',
      passwordTooShort: 'La contraseña debe tener al menos 6 caracteres'
    }
  };

  const t = translations[language];

  const createNewExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      role: '',
      company: '',
      period: '',
      location: '',
      description: '',
      photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
    };
    setEditingExperience(newExperience);
    setIsCreating(true);
  };

  const saveExperience = () => {
    if (!editingExperience) return;

    let updatedExperiences;
    if (isCreating) {
      updatedExperiences = [editingExperience, ...experiences];
    } else {
      updatedExperiences = experiences.map(exp => 
        exp.id === editingExperience.id ? editingExperience : exp
      );
    }

    onSave(updatedExperiences);
    setEditingExperience(null);
    setIsCreating(false);
  };

  const deleteExperience = (experienceId: string) => {
    if (window.confirm(t.confirmDelete)) {
      const updatedExperiences = experiences.filter(exp => exp.id !== experienceId);
      onSave(updatedExperiences);
    }
  };

  const cancelEdit = () => {
    setEditingExperience(null);
    setIsCreating(false);
  };

  const handlePasswordChange = () => {
    setPasswordError('');
    
    if (newPassword.length < 6) {
      setPasswordError(t.passwordTooShort);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError(t.passwordMismatch);
      return;
    }
    
    localStorage.setItem('adminPassword', newPassword);
    setPasswordError('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordChange(false);
    alert(t.passwordChanged);
  };

  if (editingExperience) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isCreating ? t.createNew : t.edit}
            </h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.role}
                </label>
                <input
                  type="text"
                  value={editingExperience.role}
                  onChange={(e) => setEditingExperience({...editingExperience, role: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.company}
                </label>
                <input
                  type="text"
                  value={editingExperience.company}
                  onChange={(e) => setEditingExperience({...editingExperience, company: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.period}
                </label>
                <input
                  type="text"
                  value={editingExperience.period}
                  onChange={(e) => setEditingExperience({...editingExperience, period: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.location}
                </label>
                <input
                  type="text"
                  value={editingExperience.location}
                  onChange={(e) => setEditingExperience({...editingExperience, location: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.description}
              </label>
              <textarea
                value={editingExperience.description}
                onChange={(e) => setEditingExperience({...editingExperience, description: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.photoUrl}
              </label>
              <input
                type="url"
                value={editingExperience.photo}
                onChange={(e) => setEditingExperience({...editingExperience, photo: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
            <button
              onClick={saveExperience}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {t.save}
            </button>
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
              onClick={createNewExperience}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t.createNew}
            </button>
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
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiences.map((experience) => (
              <div key={experience.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-emerald-600 p-0.5 flex-shrink-0">
                      <img
                        src={experience.photo}
                        alt={experience.role}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {experience.role}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                        {experience.company}
                      </p>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {experience.period}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {experience.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {experience.description}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingExperience(experience)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      {t.edit}
                    </button>
                    <button
                      onClick={() => deleteExperience(experience.id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      {t.delete}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceEditor;