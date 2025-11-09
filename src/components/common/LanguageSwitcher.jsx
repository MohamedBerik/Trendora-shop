import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { FaGlobe, FaCheck, FaSpinner } from 'react-icons/fa';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { language, changeLanguage, isLoading } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    {
      code: 'ar',
      name: 'العربية',
      nativeName: 'العربية',
      flag: '🇸🇦',
      direction: 'rtl'
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      direction: 'ltr'
    },
    {
      code: 'fr',
      name: 'Français',
      nativeName: 'Français',
      flag: '🇫🇷',
      direction: 'ltr'
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  // إغلاق الدروب داون عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = async (langCode) => {
    if (langCode === language) {
      setShowDropdown(false);
      return;
    }

    await changeLanguage(langCode);
    setShowDropdown(false);
  };

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="language-trigger"
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isLoading}
        aria-label="Change language"
      >
        <div className="trigger-content">
          {isLoading ? (
            <FaSpinner className="spinning" />
          ) : (
            <>
              <FaGlobe className="globe-icon" />
              <span className="current-flag">{currentLanguage?.flag}</span>
              <span className="current-language">
                {currentLanguage?.code.toUpperCase()}
              </span>
            </>
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="language-dropdown"
          >
            <div className="dropdown-header">
              <h6>اختر اللغة / Choose Language</h6>
            </div>
            
            <div className="language-list">
              {languages.map((lang) => (
                <motion.button
                  key={lang.code}
                  className={`language-option ${language === lang.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                  whileHover={{ x: language === 'ar' ? -5 : 5 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  <div className="option-content">
                    <span className="option-flag">{lang.flag}</span>
                    <div className="option-text">
                      <span className="language-name">{lang.name}</span>
                      <span className="native-name">{lang.nativeName}</span>
                    </div>
                  </div>
                  
                  {language === lang.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="check-mark"
                    >
                      <FaCheck />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="dropdown-footer">
              <small>🌍 Trendora Shop - عالمي بكل اللغات</small>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;