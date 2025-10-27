// components/providers/StatisticsProvider.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import serviceRegistry from '../../services/serviceRegistry';

// إنشاء Context للإحصائيات
export const StatisticsContext = createContext();

// Hook مخصص لاستخدام StatisticsContext
export const useStatistics = () => {
  const context = useContext(StatisticsContext);
  if (!context) {
    throw new Error('useStatistics must be used within a StatisticsProvider');
  }
  return context;
};

export const StatisticsProvider = ({ children }) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // آخر 7 أيام
    endDate: new Date()
  });

  // جلب الإحصائيات العامة
  const fetchDashboardStats = useCallback(async (customDateRange = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const range = customDateRange || dateRange;
      const data = await serviceRegistry.statistics.getDashboardStats(range);
      setStatistics(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch statistics';
      setError(errorMessage);
      
      // استخدام serviceRegistry للتحليلات لتتبع الخطأ
      serviceRegistry.analytics.trackError('statistics_fetch_error', errorMessage, 'StatisticsProvider');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  // جلب إحصائيات المبيعات
  const fetchSalesData = useCallback(async (groupBy = 'day', customDateRange = null) => {
    setLoading(true);
    try {
      const range = customDateRange || dateRange;
      const data = await serviceRegistry.statistics.getSalesData(range, groupBy);
      
      // تحديث الإحصائيات مع بيانات المبيعات
      setStatistics(prev => ({
        ...prev,
        salesData: data
      }));
      
      return data;
    } catch (err) {
      const errorMessage = `Sales data fetch failed: ${err.message}`;
      setError(errorMessage);
      serviceRegistry.analytics.trackError('sales_data_error', errorMessage, 'StatisticsProvider');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  // جلب أفضل المنتجات
  const fetchTopProducts = useCallback(async (limit = 10, customDateRange = null) => {
    try {
      const range = customDateRange || dateRange;
      const data = await serviceRegistry.statistics.getTopProducts(range, limit);
      
      setStatistics(prev => ({
        ...prev,
        topProducts: data
      }));
      
      return data;
    } catch (err) {
      const errorMessage = `Top products fetch failed: ${err.message}`;
      serviceRegistry.analytics.trackError('top_products_error', errorMessage, 'StatisticsProvider');
      throw err;
    }
  }, [dateRange]);

  // جلب إحصائيات العملاء
  const fetchCustomerStats = useCallback(async (customDateRange = null) => {
    try {
      const range = customDateRange || dateRange;
      const data = await serviceRegistry.statistics.getCustomerStats(range);
      
      setStatistics(prev => ({
        ...prev,
        customerStats: data
      }));
      
      return data;
    } catch (err) {
      const errorMessage = `Customer stats fetch failed: ${err.message}`;
      serviceRegistry.analytics.trackError('customer_stats_error', errorMessage, 'StatisticsProvider');
      throw err;
    }
  }, [dateRange]);

  // جلب إحصائيات الطلبات
  const fetchOrderStats = useCallback(async (customDateRange = null) => {
    try {
      const range = customDateRange || dateRange;
      const data = await serviceRegistry.statistics.getOrderStats(range);
      
      setStatistics(prev => ({
        ...prev,
        orderStats: data
      }));
      
      return data;
    } catch (err) {
      const errorMessage = `Order stats fetch failed: ${err.message}`;
      serviceRegistry.analytics.trackError('order_stats_error', errorMessage, 'StatisticsProvider');
      throw err;
    }
  }, [dateRange]);

  // جلب جميع الإحصائيات مرة واحدة
  const fetchAllStatistics = useCallback(async (customDateRange = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const range = customDateRange || dateRange;
      
      const [
        dashboardStats,
        salesData,
        topProducts,
        customerStats,
        orderStats,
        recentOrders
      ] = await Promise.all([
        serviceRegistry.statistics.getDashboardStats(range),
        serviceRegistry.statistics.getSalesData(range, 'day'),
        serviceRegistry.statistics.getTopProducts(range, 10),
        serviceRegistry.statistics.getCustomerStats(range),
        serviceRegistry.statistics.getOrderStats(range),
        serviceRegistry.statistics.getRecentOrders(10)
      ]);

      const allStats = {
        ...dashboardStats,
        salesData,
        topProducts,
        customerStats,
        orderStats,
        recentOrders
      };

      setStatistics(allStats);
      return allStats;
    } catch (err) {
      const errorMessage = `Comprehensive statistics fetch failed: ${err.message}`;
      setError(errorMessage);
      serviceRegistry.analytics.trackError('comprehensive_stats_error', errorMessage, 'StatisticsProvider');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  // تحديث نطاق التاريخ
  const updateDateRange = useCallback((newDateRange) => {
    setDateRange(newDateRange);
    
    // تتبع تغيير نطاق التاريخ
    serviceRegistry.analytics.trackUserAction('date_range_changed', {
      start_date: newDateRange.startDate?.toISOString(),
      end_date: newDateRange.endDate?.toISOString(),
      range_days: Math.round((newDateRange.endDate - newDateRange.startDate) / (1000 * 60 * 60 * 24))
    });
  }, []);

  // إنشاء تقرير
  const generateReport = useCallback(async (reportType, format = 'pdf') => {
    try {
      const result = await serviceRegistry.statistics.generateReport(reportType, dateRange, format);
      
      // تتبع إنشاء التقرير
      serviceRegistry.analytics.trackUserAction('report_generated', {
        report_type: reportType,
        format: format,
        date_range: dateRange
      });
      
      return result;
    } catch (err) {
      const errorMessage = `Report generation failed: ${err.message}`;
      serviceRegistry.analytics.trackError('report_generation_error', errorMessage, 'StatisticsProvider');
      throw err;
    }
  }, [dateRange]);

  // تصدير البيانات
  const exportData = useCallback(async (dataType, format = 'csv') => {
    try {
      const result = await serviceRegistry.statistics.exportData(dataType, dateRange, format);
      
      // تتبع تصدير البيانات
      serviceRegistry.analytics.trackUserAction('data_exported', {
        data_type: dataType,
        format: format,
        date_range: dateRange
      });
      
      return result;
    } catch (err) {
      const errorMessage = `Data export failed: ${err.message}`;
      serviceRegistry.analytics.trackError('data_export_error', errorMessage, 'StatisticsProvider');
      throw err;
    }
  }, [dateRange]);

  // إعادة تعيين الحالة
  const resetStatistics = useCallback(() => {
    setStatistics(null);
    setError(null);
    setLoading(false);
  }, []);

  // تنظيف البيانات القديمة
  const refreshData = useCallback(() => {
    return fetchAllStatistics();
  }, [fetchAllStatistics]);

  const value = {
    // الحالة
    statistics,
    loading,
    error,
    dateRange,
    
    // الإجراءات
    fetchDashboardStats,
    fetchSalesData,
    fetchTopProducts,
    fetchCustomerStats,
    fetchOrderStats,
    fetchAllStatistics,
    updateDateRange,
    generateReport,
    exportData,
    resetStatistics,
    refreshData,
    
    // دوال مساعدة
    hasData: !!statistics,
    lastUpdated: statistics?.timestamp || null
  };

  return (
    <StatisticsContext.Provider value={value}>
      {children}
    </StatisticsContext.Provider>
  );
};

export default StatisticsProvider;