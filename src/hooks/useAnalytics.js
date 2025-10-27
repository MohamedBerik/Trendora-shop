// hooks/useAnalytics.js
import { useEffect, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { AnalyticsContext } from '../components/providers/AnalyticsProvider';
import serviceRegistry from '../services/serviceRegistry';

export const useAnalytics = () => {
  const location = useLocation();
  const context = useContext(AnalyticsContext);

  // التحقق من وجود السياق (اختياري في الإصدار الجديد)
  const hasContext = context && context !== undefined;

  // استخدام serviceRegistry كبديل إذا لم يكن السياق متاحاً
  const analyticsService = serviceRegistry.analytics;

  // تتبع تغيير الصفحات تلقائياً
  useEffect(() => {
    const pageName = getPageNameFromPath(location.pathname);
    const category = getCategoryFromPath(location.pathname);
    
    const trackData = {
      category,
      previous_path: document.referrer,
      search_params: location.search,
      user_id: context?.user?.id,
      url: window.location.href,
      path: location.pathname
    };

    // ✅ استخدام serviceRegistry إذا كان السياق غير متاح
    if (hasContext && context.trackPageView) {
      context.trackPageView(pageName, trackData);
    } else {
      // ✅ استخدام serviceRegistry مباشرة
      analyticsService.trackPageView(pageName, trackData);
    }
  }, [location, context, hasContext, analyticsService]);

  // دوال مساعدة لتحديد الصفحات (محسنة)
  const getPageNameFromPath = useCallback((path) => {
    const pageMap = {
      '/': 'الصفحة الرئيسية',
      '/products': 'المنتجات',
      '/products/:id': 'تفاصيل المنتج',
      '/cart': 'سلة التسوق',
      '/checkout': 'الدفع',
      '/confirmation': 'تأكيد الطلب',
      '/wishlist': 'المفضلة',
      '/orders': 'الطلبات',
      '/profile': 'الملف الشخصي',
      '/signin': 'تسجيل الدخول',
      '/signup': 'إنشاء حساب',
      '/about': 'من نحن',
      '/contact': 'اتصل بنا',
      '/shop': 'المتجر',
      '/category/:category': 'الفئة',
      '/search': 'البحث',
      '/notifications': 'الإشعارات',
      '/blog': 'المدونة',
      '/new-arrivals': 'المنتجات الجديدة',
      '/best-sellers': 'الأكثر مبيعاً',
      '/sale-items': 'العروض',
      '/premium-collection': 'المجموعة المميزة',
      '/gift-cards': 'بطاقات الهدايا',
      '/statistics': 'الإحصائيات',
      '/admin-dashboard': 'لوحة التحكم',
      '/admin-dashboard?tab=overview': 'نظرة عامة',
      '/admin-dashboard?tab=statistics': 'الإحصائيات',
      '/admin-dashboard?tab=analytics': 'التحليلات',
      '/admin-dashboard?tab=reports': 'التقارير'
    };

    // البحث عن أفضل تطابق للمسار
    for (const [route, name] of Object.entries(pageMap)) {
      if (route.includes(':')) {
        const pattern = new RegExp('^' + route.replace(/:[^/]+/g, '([^/]+)') + '$');
        if (pattern.test(path)) return name;
      } else if (path === route || (route.includes('?') && window.location.href.includes(route))) {
        return name;
      }
    }

    return 'صفحة غير معروفة';
  }, []);

  const getCategoryFromPath = useCallback((path) => {
    if (path === '/') return 'الرئيسية';
    if (path.includes('/products')) return 'المنتجات';
    if (path.includes('/cart')) return 'سلة التسوق';
    if (path.includes('/checkout') || path.includes('/confirmation')) return 'الدفع';
    if (path.includes('/wishlist')) return 'المفضلة';
    if (path.includes('/orders')) return 'الطلبات';
    if (path.includes('/profile')) return 'الحساب';
    if (path.includes('/auth') || path.includes('/sign')) return 'المصادقة';
    if (path.includes('/category')) return 'الفئات';
    if (path.includes('/search')) return 'البحث';
    if (path.includes('/admin-dashboard') || path.includes('/statistics')) return 'الإدارة';
    if (path.includes('/blog')) return 'المدونة';
    return 'عام';
  }, []);

  // ✅ دمج دوال التتبع من السياق و serviceRegistry
  const trackEvent = useCallback((eventName, metadata = {}) => {
    if (hasContext && context.trackEvent) {
      return context.trackEvent(eventName, metadata);
    } else {
      return analyticsService.trackUserAction(eventName, metadata);
    }
  }, [hasContext, context, analyticsService]);

  const trackPageView = useCallback((pageName, additionalData = {}) => {
    if (hasContext && context.trackPageView) {
      return context.trackPageView(pageName, additionalData);
    } else {
      return analyticsService.trackPageView(pageName, additionalData);
    }
  }, [hasContext, context, analyticsService]);

  const trackError = useCallback((errorType, message, component = '', metadata = {}) => {
    if (hasContext && context.trackError) {
      return context.trackError(errorType, message, component, metadata);
    } else {
      return analyticsService.trackError(errorType, message, component, metadata);
    }
  }, [hasContext, context, analyticsService]);

  // دوال متخصصة للتجارة الإلكترونية
  const trackProductView = useCallback((product, metadata = {}) => {
    const eventData = {
      product_id: product.id,
      product_name: product.name || product.title,
      product_category: product.category,
      product_price: product.price,
      product_brand: product.brand,
      ...metadata
    };
    return trackEvent('product_view', eventData);
  }, [trackEvent]);

  const trackAddToCart = useCallback((product, quantity = 1, metadata = {}) => {
    const eventData = {
      product_id: product.id,
      product_name: product.name || product.title,
      product_price: product.price,
      quantity,
      total_value: product.price * quantity,
      ...metadata
    };
    return trackEvent('add_to_cart', eventData);
  }, [trackEvent]);

  const trackPurchase = useCallback((order, items = [], metadata = {}) => {
    const eventData = {
      order_id: order.id,
      total_amount: order.total || order.amount,
      items_count: items.length,
      items: items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      ...metadata
    };
    return trackEvent('purchase', eventData);
  }, [trackEvent]);

  // إرجاع جميع دوال التتبع
  return {
    // الحالة والمعلومات
    ...context,
    currentPage: location.pathname,
    currentCategory: getCategoryFromPath(location.pathname),
    hasAnalytics: hasContext || true, // ✅ دائماً متاح مع serviceRegistry
    
    // الدوال الأساسية
    trackEvent,
    trackPageView,
    trackError,
    
    // الدوال المتخصصة
    trackProductView,
    trackAddToCart,
    trackPurchase,
    trackSearch: (term, resultsCount = 0, metadata = {}) => 
      trackEvent('search', { term, results_count: resultsCount, ...metadata }),
    
    // دوال مساعدة
    getPageNameFromPath: () => getPageNameFromPath(location.pathname),
    getCategoryFromPath: () => getCategoryFromPath(location.pathname),
    
    // معلومات الجلسة
    getSessionInfo: () => analyticsService.getSessionInfo(),
    getUserId: () => context?.user?.id || analyticsService._getUserId()
  };
};

// هوك مساعد لتتبع عرض الصفحة
export const useTrackPageView = (pageName, dependencies = []) => {
  const { trackPageView } = useAnalytics();
  
  useEffect(() => {
    trackPageView(pageName);
  }, [trackPageView, pageName, ...dependencies]);
};

export default useAnalytics;