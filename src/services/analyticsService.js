// services/analyticsService.js - خدمة التحليلات
import ENDPOINTS from './endpoints';

export class AnalyticsService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
    this.isProduction = process.env.NODE_ENV === 'production';
    this.sessionId = this._generateSessionId();
    this._initializeSession();
  }

  // ==================== إدارة الجلسة والمستخدم ====================

  _generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  _initializeSession() {
    const storedSessionId = sessionStorage.getItem('analytics_session_id');
    if (!storedSessionId) {
      sessionStorage.setItem('analytics_session_id', this.sessionId);
      sessionStorage.setItem('session_start_time', new Date().toISOString());
    } else {
      this.sessionId = storedSessionId;
    }
  }

  _getUserId() {
    return localStorage.getItem('user_id') || 'anonymous';
  }

  _getUserProperties() {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return {
          user_id: user.id,
          user_email: user.email,
          user_role: user.role,
          user_segment: user.segment || 'general'
        };
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    return { user_id: 'anonymous' };
  }

  _getDeviceInfo() {
    const screenObj = typeof window !== 'undefined' ? window.screen : { width: 0, height: 0 };
   
    return {
      user_agent: navigator.userAgent,
      screen_resolution: `${screenObj.width}x${screenObj.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      device_type: this._getDeviceType()
    };
  }

  _getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipod/.test(userAgent)) return 'mobile';
    if (/tablet|ipad/.test(userAgent)) return 'tablet';
    return 'desktop';
  }

  // ==================== الدوال الرئيسية للتتبع ====================

  async _sendAnalyticsEvent(eventType, data) {
    const eventData = {
      // البيانات الأساسية
      type: eventType,
      timestamp: new Date().toISOString(),
     
      // معلومات الجلسة والمستخدم
      session_id: this.sessionId,
      ...this._getUserProperties(),
     
      // معلومات الجهاز
      ...this._getDeviceInfo(),
     
      // معلومات الصفحة
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer,
     
      // معلومات البيئة
      environment: process.env.NODE_ENV,
      app_version: process.env.REACT_APP_VERSION || '1.0.0',
     
      // البيانات المخصصة
      ...data
    };

    // في وضع التطوير، لا نرسل البيانات الحقيقية
    if (!this.isProduction) {
      console.log('📊 Analytics Event:', eventType, eventData);
      return { success: true, development: true };
    }

    try {
      // ✅ استخدام ENDPOINTS بدلاً من المسار الثابت
      const response = await fetch(`${this.baseURL}${ENDPOINTS.ANALYTICS.TRACK}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Analytics error:', error);
      this.saveOffline(eventData);
      return { success: false, error: error.message, offline: true };
    }
  }

  // ==================== تتبع البحث ====================

  async trackSearch(term, resultsCount = 0, metadata = {}) {
    const data = {
      term,
      results_count: resultsCount,
      has_results: resultsCount > 0,
      ...metadata
    };
    return this._sendAnalyticsEvent('search', data);
  }

  // ==================== تتبع المنتجات ====================

  async trackProductView(productId, category, title = '', metadata = {}) {
    const data = {
      product_id: productId,
      category,
      product_title: title,
      ...metadata
    };
    return this._sendAnalyticsEvent('product_view', data);
  }

  async trackAddToCart(productId, quantity, price, title = '', metadata = {}) {
    const data = {
      product_id: productId,
      quantity,
      price,
      product_title: title,
      total_value: quantity * price,
      ...metadata
    };
    return this._sendAnalyticsEvent('add_to_cart', data);
  }

  // ==================== تتبع السلة ====================

  async trackCartView(cartItemsCount, totalAmount, uniqueItemsCount, metadata = {}) {
    const data = {
      cart_items_count: cartItemsCount,
      total_amount: totalAmount,
      unique_items_count: uniqueItemsCount,
      average_item_value: totalAmount / cartItemsCount,
      ...metadata
    };
    return this._sendAnalyticsEvent('cart_view', data);
  }

  async trackRemoveFromCart(productId, title = '', price, quantity, metadata = {}) {
    const data = {
      product_id: productId,
      product_title: title,
      price,
      quantity,
      total_value: price * quantity,
      ...metadata
    };
    return this._sendAnalyticsEvent('remove_from_cart', data);
  }

  async trackUpdateCartQuantity(productId, oldQuantity, newQuantity, price, title = '', metadata = {}) {
    const data = {
      product_id: productId,
      old_quantity: oldQuantity,
      new_quantity: newQuantity,
      price,
      product_title: title,
      quantity_change: newQuantity - oldQuantity,
      value_change: (newQuantity - oldQuantity) * price,
      ...metadata
    };
    return this._sendAnalyticsEvent('update_cart_quantity', data);
  }

  async trackCheckoutStarted(totalAmount, itemsCount, cartItems = [], metadata = {}) {
    const data = {
      total_amount: totalAmount,
      items_count: itemsCount,
      cart_items: cartItems.map(item => ({
        product_id: item.id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price
      })),
      ...metadata
    };
    return this._sendAnalyticsEvent('checkout_started', data);
  }

  async trackCartEmptied(itemsCount, totalAmount, metadata = {}) {
    const data = {
      items_count: itemsCount,
      total_amount: totalAmount,
      ...metadata
    };
    return this._sendAnalyticsEvent('cart_emptied', data);
  }

  // ==================== تتبع الطلبات والتحويلات ====================

  async trackPurchase(orderId, totalAmount, items = [], metadata = {}) {
    const data = {
      order_id: orderId,
      total_amount: totalAmount,
      items_count: items.length,
      items: items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.quantity * item.price
      })),
      ...metadata
    };
    return this._sendAnalyticsEvent('purchase', data);
  }

  // ==================== تتبع المستخدم والصفحات ====================

  async trackPageView(pageName, additionalData = {}) {
    const data = {
      page_name: pageName,
      ...additionalData
    };
    return this._sendAnalyticsEvent('page_view', data);
  }

  async trackUserAction(action, metadata = {}) {
    const data = {
      action,
      ...metadata
    };
    return this._sendAnalyticsEvent('user_action', data);
  }

  async trackError(errorType, message, component = '', metadata = {}) {
    const data = {
      error_type: errorType,
      message,
      component,
      ...metadata
    };
    return this._sendAnalyticsEvent('error', data);
  }

  // ==================== دوال التوافق ====================

  async trackProductViewSingle(productId, category, title = '') {
    return this.trackProductView(productId, category, title, { source: 'single_product' });
  }

  async trackAddToCartSingle(productId, quantity, price, title = '') {
    return this.trackAddToCart(productId, quantity, price, title, { source: 'single_product' });
  }

  // ==================== دوال جديدة للبيانات التحليلية ====================

  // ✅ الحصول على إحصائيات سريعة
  async getQuickStats(dateRange = {}) {
    try {
      // محاكاة لجلب البيانات - في التطبيق الحقيقي استخدم ENDPOINTS.STATISTICS.OVERVIEW
      return {
        total_sales: 15420 + Math.floor(Math.random() * 1000),
        total_orders: 245 + Math.floor(Math.random() * 50),
        total_customers: 128 + Math.floor(Math.random() * 20),
        conversion_rate: 6.5 + (Math.random() * 2),
        average_order_value: 189.25 + (Math.random() * 20),
        live_visitors: 23 + Math.floor(Math.random() * 10)
      };
    } catch (error) {
      console.error('Error fetching quick stats:', error);
      return this._getMockStats();
    }
  }

  // ✅ الحصول على بيانات التحليلات
  async getAnalyticsData(dateRange = {}) {
    try {
      // محاكاة لجلب البيانات - في التطبيق الحقيقي استخدم ENDPOINTS.ANALYTICS.DATA
      return {
        page_views: 12450 + Math.floor(Math.random() * 500),
        unique_visitors: 8450 + Math.floor(Math.random() * 300),
        sessions: 9560 + Math.floor(Math.random() * 200),
        bounce_rate: 42.3 + (Math.random() * 5),
        avg_session_duration: 245 + Math.floor(Math.random() * 30),
        revenue_analytics: {
          total_revenue: 15420 + Math.floor(Math.random() * 1000),
          revenue_trend: 12.5 + (Math.random() * 3)
        },
        cart_analytics: {
          total_adds: 456 + Math.floor(Math.random() * 50),
          checkout_conversion_rate: 18.7 + (Math.random() * 2)
        },
        search_analytics: {
          total_searches: 1234 + Math.floor(Math.random() * 100),
          popular_terms: [
            { term: 'هاتف', count: 45 + Math.floor(Math.random() * 10) },
            { term: 'لابتوب', count: 32 + Math.floor(Math.random() * 8) }
          ]
        }
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      return this._getMockAnalytics();
    }
  }

  // ==================== إدارة البيانات ====================

  saveOffline(data) {
    try {
      const offlineData = JSON.parse(localStorage.getItem('offline_analytics') || '[]');
      offlineData.push({
        ...data,
        offline: true,
        stored_at: new Date().toISOString(),
        retry_count: 0
      });
     
      // حفظ فقط آخر 100 حدث لتجنب امتلاء التخزين
      const trimmedData = offlineData.slice(-100);
      localStorage.setItem('offline_analytics', JSON.stringify(trimmedData));
     
      // محاولة إرسال البيانات المخزنة محلياً
      this.flushOfflineData();
    } catch (error) {
      console.error('Error saving offline analytics:', error);
    }
  }

  async flushOfflineData() {
    try {
      const offlineData = JSON.parse(localStorage.getItem('offline_analytics') || '[]');
     
      if (offlineData.length === 0) return;

      const successfulSends = [];
      const failedSends = [];

      for (const data of offlineData) {
        try {
          // زيادة عداد المحاولات
          data.retry_count = (data.retry_count || 0) + 1;
         
          // إذا تجاوزت المحاولات الحد المسموح، تخطي هذا الحدث
          if (data.retry_count > 3) {
            console.warn('Skipping event after 3 failed attempts:', data);
            continue;
          }

          const response = await fetch(`${this.baseURL}${ENDPOINTS.ANALYTICS.TRACK}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          });

          if (response.ok) {
            successfulSends.push(data);
          } else {
            failedSends.push(data);
          }
        } catch (error) {
          failedSends.push(data);
        }
      }

      // حفظ فقط البيانات التي فشل إرسالها
      localStorage.setItem('offline_analytics', JSON.stringify(failedSends));

      if (successfulSends.length > 0) {
        console.log(`Successfully sent ${successfulSends.length} offline analytics events`);
      }

    } catch (error) {
      console.error('Error flushing offline data:', error);
    }
  }

  // ==================== أدوات مساعدة ====================

  // إعادة تعيين الجلسة
  resetSession() {
    this.sessionId = this._generateSessionId();
    sessionStorage.setItem('analytics_session_id', this.sessionId);
    sessionStorage.setItem('session_start_time', new Date().toISOString());
  }

  // الحصول على معلومات الجلسة الحالية
  getSessionInfo() {
    return {
      session_id: this.sessionId,
      user_id: this._getUserId(),
      device_type: this._getDeviceType(),
      session_start: sessionStorage.getItem('session_start_time') || new Date().toISOString()
    };
  }

  // تنظيف البيانات القديمة
  cleanupOldData() {
    try {
      const offlineData = JSON.parse(localStorage.getItem('offline_analytics') || '[]');
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
     
      const recentData = offlineData.filter(item => {
        const itemDate = new Date(item.stored_at || item.timestamp);
        return itemDate > oneWeekAgo;
      });
     
      localStorage.setItem('offline_analytics', JSON.stringify(recentData));
    } catch (error) {
      console.error('Error cleaning up old data:', error);
    }
  }

  // ==================== بيانات افتراضية للتنمية ====================

  _getMockStats() {
    return {
      total_sales: 15420,
      total_orders: 245,
      total_customers: 128,
      conversion_rate: 6.5,
      average_order_value: 189.25,
      live_visitors: 23
    };
  }

  _getMockAnalytics() {
    return {
      page_views: 12450,
      unique_visitors: 8450,
      sessions: 9560,
      bounce_rate: 42.3,
      avg_session_duration: 245,
      revenue_analytics: {
        total_revenue: 15420,
        revenue_trend: 12.5
      },
      cart_analytics: {
        total_adds: 456,
        checkout_conversion_rate: 18.7
      },
      search_analytics: {
        total_searches: 1234,
        popular_terms: [
          { term: 'هاتف', count: 45 },
          { term: 'لابتوب', count: 32 }
        ]
      }
    };
  }
}

// إنشاء نسخة واحدة من الخدمة
export const analyticsService = new AnalyticsService();

// تصدير افتراضي للاستيراد السهل
export default analyticsService;