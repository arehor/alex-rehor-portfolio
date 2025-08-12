/**
 * Security utilities for input sanitization and validation
 */

// Content Security Policy utilities
export function initializeCSP(): void {
  // Set CSP headers via meta tag (better to do server-side)
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.youtube.com https://www.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.web3forms.com https://sheets.googleapis.com https://translation.googleapis.com",
    "frame-src 'self' https://www.youtube.com",
    "media-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://api.web3forms.com"
  ].join('; ');
  
  document.head.appendChild(cspMeta);
}

// Enhanced XSS protection
export function sanitizeHtmlStrict(input: string): string {
  if (!input) return '';
  
  // Create a more restrictive sanitizer
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'];
  const allowedAttributes: { [key: string]: string[] } = {};
  
  // Remove all HTML tags except allowed ones
  let sanitized = input.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/gi, (match, tag) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      // Return only the tag without attributes for maximum security
      return match.replace(/\s+[^>]*/, '');
    }
    return '';
  });
  
  // Remove any remaining dangerous patterns
  const dangerousPatterns = [
    /javascript:/gi,
    /vbscript:/gi,
    /data:/gi,
    /on\w+\s*=/gi,
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi
  ];
  
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized;
}

// HTML sanitization function
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.textContent = input;
  
  // Remove any remaining script tags or dangerous attributes
  let sanitized = temp.innerHTML;
  
  // Remove script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove javascript: protocols
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove on* event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*"[^"]*"/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*'[^']*'/gi, '');
  
  return sanitized;
}

// Input validation
export function validateInput(input: string, maxLength: number = 1000): boolean {
  if (!input || typeof input !== 'string') return false;
  if (input.length > maxLength) return false;
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /onclick=/i
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(input));
}

// Secure password hashing (client-side - for demo only, use server-side in production)
export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const encoder = new TextEncoder();
  const usedSalt = salt || crypto.getRandomValues(new Uint8Array(16)).join('');
  
  const data = encoder.encode(password + usedSalt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return { hash, salt: usedSalt };
}

export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const { hash: newHash } = await hashPassword(password, salt);
  return newHash === hash;
}

// Rate limiting utility
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 300000): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (record.count >= maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  getRemainingTime(key: string): number {
    const record = this.attempts.get(key);
    if (!record) return 0;
    
    const remaining = record.resetTime - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000));
  }
}

export const rateLimiter = new RateLimiter();

// Secure storage with encryption
class SecureStorage {
  private static readonly ENCRYPTION_KEY = 'portfolio_secure_key_v1';
  
  static async encrypt(data: string): Promise<string> {
    try {
      // Simple XOR encryption for demo (use proper encryption in production)
      const key = this.ENCRYPTION_KEY;
      let encrypted = '';
      for (let i = 0; i < data.length; i++) {
        encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return btoa(encrypted);
    } catch (error) {
      console.error('Encryption error:', error);
      return data; // Fallback to unencrypted
    }
  }
  
  static async decrypt(encryptedData: string): Promise<string> {
    try {
      const encrypted = atob(encryptedData);
      const key = this.ENCRYPTION_KEY;
      let decrypted = '';
      for (let i = 0; i < encrypted.length; i++) {
        decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedData; // Fallback
    }
  }
  
  static async setItem(key: string, value: string): Promise<void> {
    const encrypted = await this.encrypt(value);
    localStorage.setItem(`secure_${key}`, encrypted);
  }
  
  static async getItem(key: string): Promise<string | null> {
    const encrypted = localStorage.getItem(`secure_${key}`);
    if (!encrypted) return null;
    return await this.decrypt(encrypted);
  }
  
  static removeItem(key: string): void {
    localStorage.removeItem(`secure_${key}`);
  }
}

export { SecureStorage };

// Enhanced rate limiting with exponential backoff
class AdvancedRateLimiter {
  private attempts: Map<string, { count: number; resetTime: number; backoffMultiplier: number }> = new Map();
  
  isAllowed(key: string, maxAttempts: number = 3, windowMs: number = 300000): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs, backoffMultiplier: 1 });
      return true;
    }
    
    if (record.count >= maxAttempts) {
      // Exponential backoff
      const backoffTime = windowMs * Math.pow(2, record.backoffMultiplier - 1);
      record.resetTime = now + backoffTime;
      record.backoffMultiplier = Math.min(record.backoffMultiplier + 1, 5); // Max 5x backoff
      return false;
    }
    
    record.count++;
    return true;
  }
  
  getRemainingTime(key: string): number {
    const record = this.attempts.get(key);
    if (!record) return 0;
    
    const remaining = record.resetTime - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000));
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const advancedRateLimiter = new AdvancedRateLimiter();

// Input validation with more strict rules
export function validateInputStrict(input: string, type: 'email' | 'text' | 'password' | 'url', maxLength: number = 1000): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!input || typeof input !== 'string') {
    errors.push('Input is required and must be a string');
    return { isValid: false, errors };
  }
  
  if (input.length > maxLength) {
    errors.push(`Input exceeds maximum length of ${maxLength} characters`);
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    { pattern: /<script/i, message: 'Script tags are not allowed' },
    { pattern: /javascript:/i, message: 'JavaScript protocols are not allowed' },
    { pattern: /vbscript:/i, message: 'VBScript protocols are not allowed' },
    { pattern: /on\w+\s*=/i, message: 'Event handlers are not allowed' },
    { pattern: /data:/i, message: 'Data URLs are not allowed' },
    { pattern: /\x00/g, message: 'Null bytes are not allowed' }
  ];
  
  suspiciousPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(input)) {
      errors.push(message);
    }
  });
  
  // Type-specific validation
  switch (type) {
    case 'email':
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(input)) {
        errors.push('Invalid email format');
      }
      break;
      
    case 'url':
      try {
        const url = new URL(input);
        if (!['http:', 'https:'].includes(url.protocol)) {
          errors.push('Only HTTP and HTTPS URLs are allowed');
        }
      } catch {
        errors.push('Invalid URL format');
      }
      break;
      
    case 'password':
      if (input.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }
      if (!/[A-Z]/.test(input)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(input)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/\d/.test(input)) {
        errors.push('Password must contain at least one number');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(input)) {
        errors.push('Password must contain at least one special character');
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Secure password validation
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Secure session management
export class SecureSession {
  private static readonly SESSION_KEY = 'secure_session';
  private static readonly SESSION_DURATION = 3600000; // 1 hour
  
  static createSession(): string {
    const sessionId = this.generateSecureId();
    const session = {
      id: sessionId,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.SESSION_DURATION
    };
    
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      return sessionId;
    } catch (error) {
      console.error('Failed to create session:', error);
      return '';
    }
  }
  
  static validateSession(): boolean {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return false;
      
      const session = JSON.parse(sessionData);
      const now = Date.now();
      
      if (now > session.expiresAt) {
        this.clearSession();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      this.clearSession();
      return false;
    }
  }
  
  static clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }
  
  private static generateSecureId(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

// Security headers checker
export function checkSecurityHeaders(): { warnings: string[]; recommendations: string[] } {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  
  // Check if running over HTTPS
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    warnings.push('Site is not served over HTTPS');
    recommendations.push('Enable HTTPS to protect data in transit');
  }
  
  // Check for CSP
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!cspMeta) {
    warnings.push('No Content Security Policy detected');
    recommendations.push('Implement CSP to prevent XSS attacks');
  }
  
  // Check for mixed content
  const images = document.querySelectorAll('img[src^="http:"]');
  const scripts = document.querySelectorAll('script[src^="http:"]');
  if (images.length > 0 || scripts.length > 0) {
    warnings.push('Mixed content detected (HTTP resources on HTTPS page)');
    recommendations.push('Use HTTPS for all external resources');
  }
  
  return { warnings, recommendations };
}

// Environment variable validation
export function validateEnvironmentConfig(): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  // Check for required environment variables
  const requiredVars = ['VITE_WEB3FORMS_ACCESS_KEY'];
  
  requiredVars.forEach(varName => {
    const value = import.meta.env[varName];
    if (!value) {
      warnings.push(`Missing required environment variable: ${varName}`);
    }
  });
  
  // Warn about exposed API keys in development
  if (import.meta.env.DEV) {
    const sensitiveVars = [
      'VITE_GOOGLE_SHEETS_API_KEY',
      'VITE_GOOGLE_TRANSLATE_API_KEY'
    ];
    
    sensitiveVars.forEach(varName => {
      const value = import.meta.env[varName];
      if (value) {
        warnings.push(`Warning: ${varName} is exposed in client-side code. Consider moving to server-side.`);
      }
    });
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}