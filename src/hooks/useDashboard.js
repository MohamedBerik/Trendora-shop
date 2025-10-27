// hooks/useDashboard.js
import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
import { useAnalytics } from './useAnalytics';
import { useStatistics } from './useStatistics';
import { useSalesData } from './useSalesData';
import { useProducts } from './useProducts';
import { useCustomers } from './useCustomers';
import { useRealTimeData } from './useRealTimeData';
import { useDataExport } from './useDataExport';

export const useDashboard = (initialDateRange = 'week', options = {}) => {
  const {
    enableRealtime = true,
    enableTracking = true,
    autoRefresh = true
  } = options;

  const [dateRange, setDateRange] = useState(initialDateRange);
  const [realTime, setRealTime] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // ✅ استخدام الهوكس المتخصصة
  const statistics = useStatistics(dateRange, { trackEvents: enableTracking });
  const salesData = useSalesData(dateRange, { trackEvents: enableTracking });
  const products = useProducts(dateRange, { trackEvents: enableTracking });
  const customers = useCustomers(dateRange, { trackEvents: enableTracking });
  const realTimeData = useRealTimeData({ 
    enabled: realTime && enableRealtime,
    trackEvents: enableTracking,
    autoStart: realTime
  });
  const dataExport = useDataExport({ trackEvents: enableTracking });

  const { trackEvent, trackError } = useAnalytics();

  // ✅ تجميع حالة التحميل
  const loading = statistics.loading || salesData.loading || 
                  products.loading || customers.loading;

  // ✅ تجميع الأخطاء
  const error = statistics.error || salesData.error || 
                products.error || customers.error;

  // ✅ دالة مساعدة للحصول على معلمات نطاق التاريخ
  const getDateRangeParams = useCallback((range) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (range) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    return { 
      start_date: startDate.toISOString(),
      end_date: now.toISOString(),
      range: range
    };
  }, []);

  // ✅ جلب بيانات Dashboard من analyticsService
  const fetchDashboardData = useCallback(async () => {
    try {
      if (enableTracking) {
        trackEvent('dashboard_data_fetch', { 
          dateRange,
          realTime,
          tracking_source: 'useDashboard'
        });
      }

      // استخدام analyticsService لجلب البيانات
      const dateParams = getDateRangeParams(dateRange);
      
      // محاكاة جلب البيانات من analyticsService
      const sessionInfo = analyticsService.getSessionInfo();
      const mockStats = {
        total_sales: 15420 + Math.floor(Math.random() * 1000),
        total_orders: 245 + Math.floor(Math.random() * 50),
        total_customers: 128 + Math.floor(Math.random() * 20),
        conversion_rate: 6.5 + (Math.random() * 2),
        average_order_value: 189.25 + (Math.random() * 20),
        live_visitors: 23 + Math.floor(Math.random() * 10)
      };

      const mockAnalytics = {
        page_views: 12450 + Math.floor(Math.random() * 500),
        unique_visitors: 8450 + Math.floor(Math.random() * 300),
        sessions: sessionInfo ? 9560 + Math.floor(Math.random() * 200) : 0,
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
            { term: 'لابتوب', count: 32 + Math.floor(Math.random() * 8) },
            { term: 'سماعات', count: 28 + Math.floor(Math.random() * 6) }
          ]
        }
      };

      // تحديث البيانات في الهوكس الفردية
      if (statistics.setData) {
        statistics.setData(mockStats);
      }
      if (salesData.setData) {
        salesData.setData(mockAnalytics.revenue_analytics);
      }

      return {
        statistics: mockStats,
        analytics: mockAnalytics,
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      trackError('dashboard_fetch_failed', error.message, 'useDashboard', {
        dateRange,
        realTime
      });
      throw error;
    }
  }, [dateRange, realTime, enableTracking, trackEvent, trackError, getDateRangeParams, statistics, salesData]);

  // ✅ دالة مركزية للتحديث
  const refreshAll = useCallback(async (source = 'manual') => {
    try {
      if (enableTracking) {
        trackEvent('dashboard_refresh_all', { 
          source,
          dateRange,
          realTime,
          tracking_source: 'useDashboard'
        });
      }

      // استخدام fetchDashboardData المحدثة
      const dashboardData = await fetchDashboardData();
      
      // تحديث البيانات في الهوكس الفردية
      if (statistics.setData && dashboardData.statistics) {
        statistics.setData(dashboardData.statistics);
      }
      if (salesData.setData && dashboardData.analytics) {
        salesData.setData(dashboardData.analytics.revenue_analytics);
      }

      setLastRefreshed(new Date());

      if (enableTracking) {
        trackEvent('dashboard_refresh_success', {
          source,
          dateRange,
          realTime,
          tracking_source: 'useDashboard'
        });
      }

      return dashboardData;

    } catch (error) {
      console.error('Dashboard refresh error:', error);
      trackError('dashboard_refresh_failed', error.message, 'useDashboard', {
        source,
        dateRange,
        realTime
      });
      throw error;
    }
  }, [fetchDashboardData, statistics, salesData, dateRange, realTime, trackEvent, trackError, enableTracking]);

  // ✅ التحديث التلقائي
  useEffect(() => {
    if (realTime && autoRefresh && enableRealtime) {
      const interval = setInterval(() => {
        refreshAll('auto');
      }, 30000); // كل 30 ثانية

      return () => clearInterval(interval);
    }
  }, [realTime, autoRefresh, enableRealtime, refreshAll]);

  // ✅ التحديث الأولي
  useEffect(() => {
    if (autoRefresh) {
      refreshAll('initial');
    }
  }, [dateRange, autoRefresh, refreshAll]);

  // ✅ دالة مركزية للتصدير
  const exportDashboard = useCallback(async (format = 'json', exportOptions = {}) => {
    try {
      if (enableTracking) {
        trackEvent('dashboard_export_started', {
          format,
          dateRange,
          realTime,
          tracking_source: 'useDashboard'
        });
      }

      // تجميع جميع البيانات
      const allData = {
        metadata: {
          exported_at: new Date().toISOString(),
          date_range: dateRange,
          real_time_enabled: realTime,
          source: 'dashboard_export',
          exported_by: 'useDashboard'
        },
        statistics: statistics.data,
        sales: salesData.data,
        products: products.data,
        customers: customers.data,
        realtime: realTimeData.data,
        overview: createOverview(statistics.data, salesData.data, products.data, customers.data),
        session_info: analyticsService.getSessionInfo()
      };

      const result = await dataExport.exportData(allData, {
        format,
        filename: `dashboard-export-${dateRange}-${new Date().toISOString().split('T')[0]}`,
        dataType: 'dashboard_complete',
        ...exportOptions
      });

      if (enableTracking) {
        trackEvent('dashboard_export_completed', {
          format,
          dateRange,
          realTime,
          success: result.success,
          file_size: result.size,
          tracking_source: 'useDashboard'
        });
      }

      return result;

    } catch (error) {
      console.error('Dashboard export error:', error);
      trackError('dashboard_export_failed', error.message, 'useDashboard', {
        format,
        dateRange,
        realTime
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  }, [statistics.data, salesData.data, products.data, customers.data, realTimeData.data, dateRange, realTime, dataExport, trackEvent, trackError, enableTracking, createOverview]);

  // ✅ إنشاء نظرة عامة مجمعة
  const createOverview = useCallback((stats, sales, products, customers) => {
    return {
      totalSales: sales?.total_revenue || stats?.total_sales || 0,
      totalOrders: sales?.total_orders || stats?.total_orders || 0,
      totalCustomers: customers?.total_customers || stats?.total_customers || 0,
      totalProducts: products?.total_products || stats?.total_products || 0,
      conversionRate: sales?.conversion_rate || stats?.conversion_rate || 0,
      averageOrderValue: sales?.average_order_value || stats?.average_order_value || 0,
      liveVisitors: realTimeData.data?.liveVisitors || 0,
      activeSessions: realTimeData.data?.activeSessions || 0,
      bounceRate: stats?.bounce_rate || 0,
      avgSessionDuration: stats?.avg_session_duration || 0
    };
  }, [realTimeData.data]);

  // ✅ بيانات Dashboard المجمعة
  const dashboardData = {
    // البيانات الأساسية
    overview: createOverview(statistics.data, salesData.data, products.data, customers.data),
    
    // البيانات التفصيلية
    statistics: statistics.data,
    sales: salesData.data,
    products: products.data,
    customers: customers.data,
    realtime: realTimeData.data,
    analytics: {
      ...statistics.data,
      revenue_analytics: salesData.data,
      cart_analytics: products.data?.cart_analytics,
      search_analytics: customers.data?.search_analytics
    },
    
    // معلومات التحديث
    lastUpdated: lastRefreshed || statistics.lastUpdated,
    dateRange,
    realTimeEnabled: realTime,
    sessionInfo: analyticsService.getSessionInfo()
  };

  // ✅ تبديل الوضع المباشر
  const toggleRealTime = useCallback((newState) => {
    const newRealTimeState = newState !== undefined ? newState : !realTime;
    setRealTime(newRealTimeState);

    if (enableTracking) {
      trackEvent('dashboard_realtime_toggle', {
        enabled: newRealTimeState,
        dateRange,
        tracking_source: 'useDashboard'
      });
    }

    // إذا تم تشغيل الوضع المباشر، قم بالتحديث الفوري
    if (newRealTimeState) {
      refreshAll('realtime_toggle');
    }

    return newRealTimeState;
  }, [realTime, dateRange, refreshAll, trackEvent, enableTracking]);

  // ✅ تغيير نطاق التاريخ
  const handleDateRangeChange = useCallback((newDateRange) => {
    setDateRange(newDateRange);

    if (enableTracking) {
      trackEvent('dashboard_date_range_change', {
        from: dateRange,
        to: newDateRange,
        realTime,
        tracking_source: 'useDashboard'
      });
    }
  }, [dateRange, realTime, trackEvent, enableTracking]);

  // ✅ تنظيف البيانات وإدارة الجلسة
  const cleanupData = useCallback(() => {
    try {
      analyticsService.cleanupOldData();
      trackEvent('dashboard_cleanup', {
        tracking_source: 'useDashboard'
      });
    } catch (error) {
      console.error('Dashboard cleanup error:', error);
    }
  }, [trackEvent]);

  // ✅ إعادة تعيين الجلسة
  const resetSession = useCallback(() => {
    analyticsService.resetSession();
    if (enableTracking) {
      trackEvent('dashboard_session_reset', {
        tracking_source: 'useDashboard'
      });
    }
  }, [trackEvent, enableTracking]);

  return {
    // ✅ البيانات المجمعة (الاستخدام الرئيسي)
    dashboardData,
    loading,
    error,
    dateRange,
    realTime,
    lastRefreshed,

    // ✅ الدوال المركزية (الاستخدام الرئيسي)
    refreshData: refreshAll,
    exportData: exportDashboard,
    setDateRange: handleDateRangeChange,
    setRealTime: toggleRealTime,
    cleanupData,
    resetSession,

    // ✅ البيانات الفردية (للاستخدام المتقدم)
    statisticsData: statistics.data,
    salesData: salesData.data,
    productsData: products.data,
    customersData: customers.data,
    realTimeData: realTimeData.data,

    // ✅ الدوال الفردية (للاستخدام المتقدم)
    refreshStatistics: statistics.refreshData,
    refreshSales: salesData.refreshData,
    refreshProducts: products.refreshData,
    refreshCustomers: customers.refreshData,
    refreshRealtime: realTimeData.refreshNow,

    // ✅ معلومات إضافية
    isConnected: realTimeData.isConnected,
    exportProgress: dataExport.progress,
    exporting: dataExport.exporting,
    sessionInfo: analyticsService.getSessionInfo()
  };
};

export default useDashboard;