import { useLanguage } from '../context/LanguageContext';

// Hook مبسط للاستخدام في المكونات
export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key, fallback = '') => {
    // في المستقبل، سيتم تحميل الترجمات من ملفات JSON
    // حالياً نعيد النص كما هو
    return key || fallback;
  };

  const formatNumber = (number) => {
    if (language === 'ar') {
      return new Intl.NumberFormat('ar-SA').format(number);
    }
    return new Intl.NumberFormat('en-US').format(number);
  };

  const formatCurrency = (amount, currency = 'SAR') => {
    if (language === 'ar') {
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: currency
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (date) => {
    if (language === 'ar') {
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(date));
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  return {
    t,
    formatNumber,
    formatCurrency,
    formatDate,
    language
  };
};