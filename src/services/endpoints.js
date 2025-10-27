// services/endpoints.js - نقاط النهاية
const ENDPOINTS = {
  // الإحصائيات
  STATISTICS: {
    DASHBOARD: '/statistics/dashboard',
    OVERVIEW: '/statistics/overview',
    SALES: '/statistics/sales',
    REVENUE: '/statistics/revenue',
    TOP_PRODUCTS: '/statistics/top-products',
    RECENT_ORDERS: '/statistics/recent-orders',
    CUSTOMERS: '/statistics/customers',
    INVENTORY: '/statistics/inventory',
    CATEGORIES: '/statistics/categories',
    ORDERS: '/statistics/orders'
  },
  
  // المبيعات
  SALES: {
    DAILY: '/sales/daily',
    TRENDS: '/sales/trends',
    SUMMARY: '/sales/summary',
    BY_CATEGORY: '/sales/by-category'
  },
  
  // المنتجات
  PRODUCTS: {
    LIST: '/products',
    ANALYTICS: '/products/analytics',
    POPULAR: '/products/popular',
    LOW_STOCK: '/products/low-stock'
  },
  
  // العملاء
  CUSTOMERS: {
    LIST: '/customers',
    ANALYTICS: '/customers/analytics',
    SEGMENTS: '/customers/segments',
    LOYALTY: '/customers/loyalty'
  },
  
  // المخزون
  INVENTORY: {
    LOW_STOCK: '/inventory/low-stock',
    STATUS: '/inventory/status',
    ALERTS: '/inventory/alerts'
  },
  
  // التقارير
  REPORTS: {
    GENERATE: '/reports/generate',
    EXPORT: '/reports/export',
    DASHBOARD: '/reports/dashboard'
  },
  
  // التحليلات
  ANALYTICS: {
    TRACK: '/analytics/track',
    DATA: '/analytics/data',
    SESSION: '/analytics/session',
    EVENTS: '/analytics/events',
    METRICS: '/analytics/metrics',
    REAL_TIME: '/analytics/real-time'
  },
  
  // البيانات المباشرة
  REAL_TIME: {
    VISITORS: '/real-time/visitors',
    ACTIVITY: '/real-time/activity',
    METRICS: '/real-time/metrics'
  },
  
  // التصدير
  EXPORT: {
    DATA: '/export/data',
    REPORTS: '/export/reports',
    STATISTICS: '/export/statistics'
  }
};

export default ENDPOINTS;