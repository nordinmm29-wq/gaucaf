import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TRANSLATIONS, TranslationDict } from './translations';

export type Language = 'es' | 'cat' | 'eng';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dict: TranslationDict;
  t: (key: string, fallback?: string) => string;
}

const STORAGE_KEY = 'gaudi_language_preference';

export const LanguageContext = createContext<LanguageContextType>({
  language: 'es',
  setLanguage: () => {},
  dict: TRANSLATIONS.es,
  t: (_key, fallback) => fallback || '',
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved && (saved === 'es' || saved === 'cat' || saved === 'eng')) {
        return saved;
      }
      // Check browser language
      if (typeof navigator !== 'undefined') {
        const navLang = navigator.language?.toLowerCase() || '';
        if (navLang.startsWith('ca')) return 'cat';
        if (navLang.startsWith('en')) return 'eng';
      }
    } catch {
      // Fallback
    }
    return 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
    // Update document html lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'cat' ? 'ca' : lang === 'eng' ? 'en' : 'es';
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language === 'cat' ? 'ca' : language === 'eng' ? 'en' : 'es';
    }
  }, [language]);

  const dict = TRANSLATIONS[language] || TRANSLATIONS.es;

  // Simple nested key resolver (e.g. t('nav.menu'))
  const t = (path: string, fallback?: string): string => {
    const parts = path.split('.');
    let current: any = dict;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return fallback || path;
      }
    }
    return typeof current === 'string' ? current : fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dict, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
