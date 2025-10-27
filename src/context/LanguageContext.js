import React, { createContext, useContext, useState, useEffect } from 'react';
import { i18n } from '../utils/i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar');
  const [direction, setDirection] = useState('rtl');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeLanguage = async () => {
      const savedLanguage = localStorage.getItem('trendora_language') || 'ar';
      await changeLanguage(savedLanguage, false); // false = لا تحميل الترجمة مرة أخرى
    };

    initializeLanguage();
  }, []);

  const changeLanguage = async (newLanguage, loadTranslations = true) => {
    if (newLanguage === language) return;
    
    setIsLoading(true);
    
    try {
      if (loadTranslations) {
        await i18n.changeLanguage(newLanguage);
      }
      
      setLanguage(newLanguage);
      const newDirection = newLanguage === 'ar' ? 'rtl' : 'ltr';
      setDirection(newDirection);
      
      localStorage.setItem('trendora_language', newLanguage);
      
      document.body.dir = newDirection;
      document.documentElement.lang = newLanguage;
      document.documentElement.setAttribute('data-language', newLanguage);
      
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    language,
    direction,
    changeLanguage,
    isLoading,
    isRTL: direction === 'rtl',
    t: i18n.t.bind(i18n),
    formatNumber: i18n.formatNumber.bind(i18n),
    formatCurrency: i18n.formatCurrency.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};