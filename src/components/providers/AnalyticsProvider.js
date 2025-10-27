// components/providers/AnalyticsProvider.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import serviceRegistry from '../../services/serviceRegistry';

export const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children, user: initialUser = null }) => {
  const [user, setUser] = useState(initialUser);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [analyticsReady, setAnalyticsReady] = useState(false);

  // تهيئة التحليلات والجلسة
  useEffect(() => {
    const initializeAnalytics = () => {
      try {
        const sessionInfo = serviceRegistry.analytics.getSessionInfo();
        setSessionInfo(sessionInfo);

        // تنظيف البيانات القديمة
        serviceRegistry.analytics.cleanupOldData();

        // تتبع بدء الجلسة
        serviceRegistry.analytics.trackUserAction('session_started', {
          session_id: sessionInfo.session_id,
          device_type: sessionInfo.device_type,
          environment: process.env.NODE_ENV
        });

        setAnalyticsReady(true);
      } catch (error) {
        console.error('Error initializing analytics:', error);
        setAnalyticsReady(true); // الاستمرار حتى مع وجود خطأ
      }
    };

    initializeAnalytics();
  }, []);

  // تتبع تغييرات المستخدم
  useEffect(() => {
    if (!analyticsReady) return;

    if (user) {
      // حفظ بيانات المستخدم
      localStorage.setItem('user_data', JSON.stringify(user));
      localStorage.setItem('user_id', user.id);
     
      serviceRegistry.analytics.trackUserAction('user_identified', {
        user_id: user.id,
        user_email: user.email,
        user_role: user.role,
        session_id: sessionInfo?.session_id
      });
    } else {
      // مستخدم مجهول
      localStorage.removeItem('user_data');
      localStorage.removeItem('user_id');
     
      serviceRegistry.analytics.trackUserAction('user_anonymous', {
        session_id: sessionInfo?.session_id
      });
    }
  }, [user, sessionInfo, analyticsReady]);

  // تتبع الأخطاء العالمية
  useEffect(() => {
    if (!analyticsReady) return;

    const handleError = (error) => {
      serviceRegistry.analytics.trackError('global_error', error.message, 'App', {
        session_id: sessionInfo?.session_id,
        user_id: user?.id,
        url: window.location.href
      });
    };

    const handleUnhandledRejection = (event) => {
      serviceRegistry.analytics.trackError('unhandled_rejection', 
        event.reason?.message || 'Unknown promise rejection', 
        'App', {
        session_id: sessionInfo?.session_id,
        user_id: user?.id,
        url: window.location.href
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [sessionInfo, user, analyticsReady]);

  // تتبع تغيير المسار
  useEffect(() => {
    if (!analyticsReady) return;

    const trackPageView = () => {
      const pageName = document.title || window.location.pathname;
      serviceRegistry.analytics.trackPageView(pageName, {
        path: window.location.pathname,
        search: window.location.search,
        session_id: sessionInfo?.session_id,
        user_id: user?.id
      });
    };

    // تتبع الصفحة الأولى
    trackPageView();

    // يمكن إضافة تتبع لتغيير المسار في SPA هنا
  }, [sessionInfo, user, analyticsReady]);

  // دالة لتحديث بيانات المستخدم
  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  // دالة لتسجيل خروج المستخدم
  const logoutUser = useCallback(() => {
    if (analyticsReady) {
      serviceRegistry.analytics.trackUserAction('user_logged_out', {
        user_id: user?.id,
        session_id: sessionInfo?.session_id
      });
    }
   
    setUser(null);
    serviceRegistry.analytics.resetSession();
  }, [user, sessionInfo, analyticsReady]);

  // دوال التتبع المساعدة
  const trackEvent = useCallback((eventName, metadata = {}) => {
    if (!analyticsReady) return;
    
    return serviceRegistry.analytics.trackUserAction(eventName, {
      session_id: sessionInfo?.session_id,
      user_id: user?.id,
      ...metadata
    });
  }, [sessionInfo, user, analyticsReady]);

  const trackPageView = useCallback((pageName, additionalData = {}) => {
    if (!analyticsReady) return;
    
    return serviceRegistry.analytics.trackPageView(pageName, {
      session_id: sessionInfo?.session_id,
      user_id: user?.id,
      url: window.location.href,
      ...additionalData
    });
  }, [sessionInfo, user, analyticsReady]);

  const trackError = useCallback((errorType, message, component = '', metadata = {}) => {
    if (!analyticsReady) return;
    
    return serviceRegistry.analytics.trackError(errorType, message, component, {
      session_id: sessionInfo?.session_id,
      user_id: user?.id,
      url: window.location.href,
      ...metadata
    });
  }, [sessionInfo, user, analyticsReady]);

  const value = {
    // الحالة
    user,
    sessionInfo,
    analyticsReady,
    
    // إدارة المستخدم
    setUser: updateUser,
    logoutUser,
    
    // دوال التتبع
    trackEvent,
    trackPageView,
    trackError,
    
    // دوال متقدمة
    trackProductView: (product, metadata = {}) => {
      if (!analyticsReady) return;
      return serviceRegistry.analytics.trackProductView(
        product.id,
        product.category,
        product.title,
        { ...metadata, session_id: sessionInfo?.session_id, user_id: user?.id }
      );
    },
    
    trackAddToCart: (product, quantity = 1, metadata = {}) => {
      if (!analyticsReady) return;
      return serviceRegistry.analytics.trackAddToCart(
        product.id,
        quantity,
        product.price,
        product.title,
        { ...metadata, session_id: sessionInfo?.session_id, user_id: user?.id }
      );
    },
    
    // الحصول على بيانات التحليلات
    getQuickStats: () => {
      return serviceRegistry.analytics.getQuickStats();
    },
    
    // إدارة الجلسة
    resetSession: () => {
      serviceRegistry.analytics.resetSession();
      const newSessionInfo = serviceRegistry.analytics.getSessionInfo();
      setSessionInfo(newSessionInfo);
    },
    
    // إرسال البيانات المخزنة
    flushOfflineData: () => {
      return serviceRegistry.analytics.flushOfflineData();
    }
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;