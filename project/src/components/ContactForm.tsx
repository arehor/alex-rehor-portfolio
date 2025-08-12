import React, { useState } from 'react';
import { Mail, Send, X, User, MessageSquare } from 'lucide-react';
import { validateInput, rateLimiter, advancedRateLimiter, validateInputStrict } from '../utils/security';

interface ContactFormProps {
  onClose: () => void;
  language: 'en' | 'es';
}

const ContactForm: React.FC<ContactFormProps> = ({ onClose, language }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const translations = {
    en: {
      title: 'Get In Touch',
      subtitle: 'Let\'s discuss how I can help automate your business processes',
      name: 'Your Name',
      email: 'Your Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent successfully!',
      successDesc: 'Thank you for reaching out. I\'ll get back to you within 24 hours.',
      close: 'Close',
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      error: 'Failed to send message. Please try again or contact me directly at arehor@me.com'
    },
    es: {
      title: 'Hablemos',
      subtitle: 'Conversemos sobre cómo puedo ayudarte a automatizar tus procesos empresariales',
      name: 'Tu Nombre',
      email: 'Tu Correo',
      subject: 'Asunto',
      message: 'Mensaje',
      send: 'Enviar Mensaje',
      sending: 'Enviando...',
      success: '¡Mensaje enviado exitosamente!',
      successDesc: 'Gracias por escribirme. Te responderé en menos de 24 horas.',
      close: 'Cerrar',
      required: 'Este campo es obligatorio',
      invalidEmail: 'Por favor ingresa un correo válido',
      error: 'Error al enviar el mensaje. Por favor intenta nuevamente o escríbeme directamente a arehor@me.com'
    }
  };

  const t = translations[language];

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Rate limiting check
    const clientId = `contact_${formData.email || 'anonymous'}`;
    if (!advancedRateLimiter.isAllowed(clientId, 3, 600000)) { // 3 attempts per 10 minutes
      const remainingTime = advancedRateLimiter.getRemainingTime(clientId);
      setResult(language === 'en' 
        ? `Too many attempts. Please try again in ${remainingTime} seconds.`
        : `Demasiados intentos. Intenta nuevamente en ${remainingTime} segundos.`
      );
      setIsSubmitting(false);
      return;
    }
    
    // Input validation
    const nameValidation = validateInputStrict(formData.name, 'text', 100);
    if (!nameValidation.isValid) {
      setResult(language === 'en' ? `Invalid name: ${nameValidation.errors.join(', ')}` : `Nombre inválido: ${nameValidation.errors.join(', ')}`);
      setIsSubmitting(false);
      return;
    }
    
    const emailValidation = validateInputStrict(formData.email, 'email', 100);
    if (!emailValidation.isValid) {
      setResult(language === 'en' ? `Invalid email: ${emailValidation.errors.join(', ')}` : `Email inválido: ${emailValidation.errors.join(', ')}`);
      setIsSubmitting(false);
      return;
    }
    
    const messageValidation = validateInputStrict(formData.message, 'text', 2000);
    if (!messageValidation.isValid) {
      setResult(language === 'en' ? `Invalid message: ${messageValidation.errors.join(', ')}` : `Mensaje inválido: ${messageValidation.errors.join(', ')}`);
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(true);
    setResult('');
    
    const formElement = event.target as HTMLFormElement;
    const formDataToSend = new FormData(formElement);
    
    // Get API key from environment variable
    const apiKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    
    if (!apiKey) {
      setResult(language === 'en' 
        ? 'Configuration error: Missing API key. Please contact the site administrator.'
        : 'Error de configuración: Falta la clave API. Por favor contacta al administrador del sitio.'
      );
      setIsSubmitting(false);
      return;
    }
    
    console.log('🔑 Using API key:', apiKey ? 'Found' : 'Missing');
    
    // Add required fields - access_key must be added first
    formDataToSend.append('access_key', apiKey);
    formDataToSend.append('from_name', formData.name);
    formDataToSend.append('reply_to', formData.email);

    try {
      console.log('🚀 Sending form data...');
      
      // Send form data with proper content type
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📊 Response data:', data);

      if (data.success) {
        console.log('✅ Form submitted successfully');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setResult(t.success);
        setSubmitted(true);
      } else {
        console.log("❌ Form submission failed:", data);
        setResult(data.message || t.error);
      }
    } catch (error) {
      console.log("❌ Network error:", error);
      setResult(t.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t.success}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t.successDesc}
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all duration-300"
          >
            {t.close}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Mail className="w-6 h-6 mr-2 text-blue-600" />
              {t.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{t.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <input type="checkbox" name="botcheck" className="hidden" style={{display: 'none'}} />
          
          {result && (
            <div className={`border rounded-lg p-4 ${
              submitted || result === t.success
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
                : result === t.sending
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
            }`}>
              <p className="text-sm">{result}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                {t.name} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                name="name"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder={t.name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                {t.email} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder={t.email}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t.subject}
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              name="subject"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              placeholder={t.subject}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              {t.message} *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              required
              name="message"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
              placeholder={language === 'en' ? 'Tell me about your project or how I can help...' : 'Cuéntame sobre tu proyecto o cómo puedo ayudarte...'}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              {t.close}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t.sending}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {t.send}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;