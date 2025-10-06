'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load saved language from multiple sources
    const loadLanguage = async () => {
      let savedLang = null;

      // 1. Try Electron Store first (persistent across restarts)
      if (typeof window !== 'undefined' && window.electron) {
        try {
          savedLang = await window.electron.getSetting('language');
          console.log('📦 Language loaded from Electron Store:', savedLang);
        } catch (error) {
          console.error('Failed to load language from Electron Store:', error);
        }
      }

      // 2. Fallback to localStorage (for web or if Electron fails)
      if (!savedLang && typeof window !== 'undefined') {
        try {
          savedLang = localStorage.getItem('shroudly_language');
          console.log('💾 Language loaded from localStorage:', savedLang);
        } catch (error) {
          console.error('Failed to load language from localStorage:', error);
        }
      }

      // 3. Set language if found, otherwise use default
      if (savedLang && availableLanguages.find(l => l.code === savedLang)) {
        setLanguageState(savedLang);
        console.log('✅ Language set to:', savedLang);
      } else {
        console.log('🌐 Using default language: en');
        setLanguageState('en');
      }

      setIsLoaded(true);
    };

    loadLanguage();
  }, []);

  const setLanguage = async (lang) => {
    console.log('🔄 Changing language to:', lang);
    
    setLanguageState(lang);

    // Save to multiple locations for redundancy
    // 1. Save to Electron Store
    if (typeof window !== 'undefined' && window.electron) {
      try {
        await window.electron.setSetting('language', lang);
        console.log('✅ Language saved to Electron Store:', lang);
      } catch (error) {
        console.error('Failed to save language to Electron Store:', error);
      }
    }

    // 2. Save to localStorage as backup
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('shroudly_language', lang);
        console.log('✅ Language saved to localStorage:', lang);
      } catch (error) {
        console.error('Failed to save language to localStorage:', error);
      }
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
