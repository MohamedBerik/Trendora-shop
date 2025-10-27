// services/serviceRegistry.js
import { statisticsService } from './statisticsService';
import { analyticsService } from './analyticsService';
import { api } from './api';
import ENDPOINTS from './endpoints';

// دوال مساعدة مشتركة
const formatDateForAPI = (date) => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

const getDateRange = (days = 7) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return { startDate, endDate };
};

const getStatisticsURL = (endpoint, dateRange, params = {}) => {
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
  const url = new URL(`${baseURL}${endpoint}`);
  
  if (dateRange && dateRange.startDate && dateRange.endDate) {
    url.searchParams.append('start_date', formatDateForAPI(dateRange.startDate));
    url.searchParams.append('end_date', formatDateForAPI(dateRange.endDate));
  }
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  return url.pathname + url.search;
};

// التسجيل الموحد للخدمات
export const serviceRegistry = {
  // الخدمات الأساسية
  statistics: statisticsService,
  analytics: analyticsService,
  api: api,
  endpoints: ENDPOINTS,
  
  // الدوال المساعدة
  utils: {
    formatDateForAPI,
    getDateRange,
    getStatisticsURL
  }
};

// تصدير افتراضي للاستيراد السهل
export default serviceRegistry;