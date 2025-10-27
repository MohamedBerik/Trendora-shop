// src/utils/i18n.js

class I18n {
  constructor() {
    this.language = 'ar';
    this.translations = {};
    this.fallbacks = {};
    this.isLoading = false;
  }

  // تهيئة النظام
  async initialize(language = 'ar') {
    this.language = language;
    await this.loadTranslations(language);
    
    // إعداد اللغة الافتراضية كـ fallback
    if (language !== 'ar') {
      await this.loadFallbacks('ar');
    }
  }

  // تحميل الترجمات
  async loadTranslations(language) {
    try {
      this.isLoading = true;
      
      // في بيئة الإنتاج، سيتم جلب الملفات من الخادم
      const response = await import(`../locales/${language}.json`);
      this.translations = response.default || response;
      
      console.log(`🌍 Loaded ${language} translations:`, Object.keys(this.translations).length, 'categories');
      
    } catch (error) {
      console.error(`❌ Failed to load ${language} translations:`, error);
      this.translations = {};
    } finally {
      this.isLoading = false;
    }
  }

  // تحميل الترجمات الاحتياطية
  async loadFallbacks(language) {
    try {
      const response = await import(`../locales/${language}.json`);
      this.fallbacks = response.default || response;
    } catch (error) {
      console.error(`❌ Failed to load ${language} fallbacks:`, error);
      this.fallbacks = {};
    }
  }

  // الحصول على ترجمة
  t(key, params = {}) {
    if (!key) return '';

    // البحث في الترجمات الحالية
    let value = this.getNestedTranslation(this.translations, key);
    
    // إذا لم توجد، البحث في الترجمات الاحتياطية
    if (!value && Object.keys(this.fallbacks).length > 0) {
      value = this.getNestedTranslation(this.fallbacks, key);
    }
    
    // إذا لم توجد، إرجاع المفتاح
    if (!value) {
      console.warn(`🌍 Translation missing for key: ${key}`);
      return this.formatKey(key);
    }

    // تطبيق المعاملات إذا وجدت
    return this.replaceParams(value, params);
  }

  // البحث في الكائنات المتداخلة
  getNestedTranslation(obj, key) {
    return key.split('.').reduce((current, part) => {
      return current ? current[part] : undefined;
    }, obj);
  }

  // استبدال المعاملات في النص
  replaceParams(text, params) {
    return text.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  }

  // تنسيق المفتاح لعرضه عندما لا توجد ترجمة
  formatKey(key) {
    return key.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // تغيير اللغة
  async changeLanguage(newLanguage) {
    if (newLanguage === this.language) return;
    
    this.language = newLanguage;
    await this.loadTranslations(newLanguage);
    
    // إذا لم تكن العربية، تحميلها كـ fallback
    if (newLanguage !== 'ar') {
      await this.loadFallbacks('ar');
    } else {
      this.fallbacks = {};
    }
    
    // إشعار التطبيق بتغيير اللغة
    this.notifyLanguageChange();
  }

  // إشعار المكونات بتغيير اللغة
  notifyLanguageChange() {
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: this.language }
    }));
  }

  // تنسيق الأرقام حسب اللغة
  formatNumber(number) {
    const formatters = {
      ar: new Intl.NumberFormat('ar-SA'),
      en: new Intl.NumberFormat('en-US'),
      fr: new Intl.NumberFormat('fr-FR')
    };
    
    return formatters[this.language]?.format(number) || number.toString();
  }

  // تنسيق العملة
  formatCurrency(amount, currency = 'SAR') {
    const formatters = {
      ar: new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol'
      }),
      en: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }),
      fr: new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency
      })
    };
    
    return formatters[this.language]?.format(amount) || `${amount} ${currency}`;
  }

  // تنسيق التاريخ
  formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    const formatters = {
      ar: new Intl.DateTimeFormat('ar-SA', finalOptions),
      en: new Intl.DateTimeFormat('en-US', finalOptions),
      fr: new Intl.DateTimeFormat('fr-FR', finalOptions)
    };
    
    return formatters[this.language]?.format(new Date(date)) || new Date(date).toLocaleDateString();
  }

  // تنسيق الوقت النسبي
  formatRelativeTime(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, seconds] of Object.entries(intervals)) {
      const count = Math.floor(diffInSeconds / seconds);
      
      if (count >= 1) {
        return this.t(`time.${unit}s_ago`, { count });
      }
    }
    
    return this.t('time.just_now');
  }

  // الحصول على اتجاه النص
  getDirection() {
    return this.language === 'ar' ? 'rtl' : 'ltr';
  }

  // الحصول على معلومات اللغة
  getLanguageInfo() {
    const languages = {
      ar: { name: 'العربية', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl' },
      en: { name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr' },
      fr: { name: 'Français', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr' }
    };
    
    return languages[this.language] || languages.ar;
  }

  // الحصول على جميع اللغات المدعومة
  getSupportedLanguages() {
    return [
      { code: 'ar', name: 'العربية', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl' },
      { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr' },
      { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr' }
    ];
  }
}

// إنشاء نسخة وحيدة من النظام
export const i18n = new I18n();

// Hook للاستخدام في المكونات (اختياري)
export const useTranslation = () => {
  const translate = (key, params = {}) => i18n.t(key, params);
  
  return {
    t: translate,
    formatNumber: i18n.formatNumber.bind(i18n),
    formatCurrency: i18n.formatCurrency.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n),
    formatRelativeTime: i18n.formatRelativeTime.bind(i18n),
    language: i18n.language,
    direction: i18n.getDirection(),
    changeLanguage: i18n.changeLanguage.bind(i18n)
  };
};

// دالة مساعدة للاستخدام خارج المكونات
export const t = (key, params = {}) => i18n.t(key, params);