// hooks/useStatistics.js
import { useState, useEffect, useCallback } from 'react';
import serviceRegistry from '../services/serviceRegistry';
import { useStatistics as useStatisticsContext } from '../components/providers/StatisticsProvider';

export const useStatistics = (dateRange) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✅ استخدام السياق إذا كان متاحاً
  const statisticsContext = useStatisticsContext();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ استخدام serviceRegistry الموحد
        const [statsData, analyticsData] = await Promise.all([
          serviceRegistry.statistics.getDashboardStats(dateRange),
          serviceRegistry.analytics.getAnalyticsData(dateRange, [
            'search_analytics', 
            'product_analytics', 
            'cart_analytics', 
            'user_behavior'
          ])
        ]);

        // دمج البيانات
        const mergedData = {
          ...statsData,
          analytics: analyticsData,
          // إحصائيات إضافية محسوبة
          calculatedMetrics: calculateAdvancedMetrics(statsData, analyticsData),
          timestamp: new Date().toISOString()
        };

        setData(mergedData);
        
        // ✅ تحديث السياق إذا كان متاحاً
        if (statisticsContext && statisticsContext.fetchAllStatistics) {
          statisticsContext.fetchAllStatistics(dateRange);
        }
      } catch (err) {
        const errorMessage = err.message || 'فشل في جلب البيانات الإحصائية';
        setError(errorMessage);
        console.error('Error fetching statistics:', err);
        
        // ✅ تتبع الخطأ في التحليلات
        serviceRegistry.analytics.trackError('statistics_fetch_error', errorMessage, 'useStatistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [dateRange, statisticsContext]);

  // ✅ تحديث البيانات يدوياً (محسّن)
  const refetch = useCallback(async (customDateRange = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const rangeToUse = customDateRange || dateRange;
      
      const [statsData, analyticsData] = await Promise.all([
        serviceRegistry.statistics.getDashboardStats(rangeToUse),
        serviceRegistry.analytics.getAnalyticsData(rangeToUse)
      ]);
      
      const mergedData = {
        ...statsData,
        analytics: analyticsData,
        calculatedMetrics: calculateAdvancedMetrics(statsData, analyticsData),
        timestamp: new Date().toISOString()
      };
      
      setData(mergedData);
      
      // ✅ تتبع حدث التحديث
      serviceRegistry.analytics.trackUserAction('statistics_refreshed', {
        date_range: rangeToUse,
        data_source: 'manual_refetch'
      });
      
      return mergedData;
    } catch (err) {
      const errorMessage = err.message || 'فشل في إعادة جلب البيانات';
      setError(errorMessage);
      serviceRegistry.analytics.trackError('statistics_refetch_error', errorMessage, 'useStatistics');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  // ✅ تتبع حدث معين (محسّن)
  const trackEvent = useCallback(async (eventType, eventData) => {
    try {
      await serviceRegistry.analytics.trackUserAction(eventType, {
        ...eventData,
        hook: 'useStatistics',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, []);

  // ✅ دوال مساعدة جديدة
  const getQuickStats = useCallback(async () => {
    try {
      return await serviceRegistry.statistics.getQuickStats();
    } catch (error) {
      console.error('Error getting quick stats:', error);
      throw error;
    }
  }, []);

  const generateReport = useCallback(async (reportType, format = 'pdf') => {
    try {
      const result = await serviceRegistry.statistics.generateReport(reportType, dateRange, format);
      
      // تتبع إنشاء التقرير
      await trackEvent('report_generated', {
        report_type: reportType,
        format: format,
        date_range: dateRange
      });
      
      return result;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }, [dateRange, trackEvent]);

  // ✅ إعادة تعيين البيانات
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    // الحالة
    data,
    loading,
    error,
    
    // الإجراءات
    refetch,
    reset,
    trackEvent,
    getQuickStats,
    generateReport,
    
    // معلومات إضافية
    lastUpdated: data?.timestamp,
    hasData: !!data,
    usingContext: !!statisticsContext,
    
    // ✅ التوافق مع السياق
    ...statisticsContext
  };
};

// ✅ حساب المقاييس المتقدمة (محسّن)
const calculateAdvancedMetrics = (statsData, analyticsData) => {
  const sales = statsData.overview?.totalSales || 0;
  const orders = statsData.overview?.totalOrders || 0;
  const customers = statsData.overview?.totalCustomers || 0;
  const searches = analyticsData.search_analytics?.total_searches || 0;
  const productViews = analyticsData.product_analytics?.total_views || 0;
  const cartAdds = analyticsData.cart_analytics?.total_adds || 0;
  const checkouts = analyticsData.cart_analytics?.total_checkouts || 0;

  return {
    // معدلات التحويل
    search_to_sale_rate: searches > 0 ? (sales / searches * 100).toFixed(2) : 0,
    view_to_cart_rate: productViews > 0 ? (cartAdds / productViews * 100).toFixed(2) : 0,
    cart_to_checkout_rate: cartAdds > 0 ? (checkouts / cartAdds * 100).toFixed(2) : 0,
    checkout_conversion_rate: checkouts > 0 ? (orders / checkouts * 100).toFixed(2) : 0,
    
    // متوسط القيم
    average_order_value: orders > 0 ? (sales / orders).toFixed(2) : 0,
    average_customer_value: customers > 0 ? (sales / customers).toFixed(2) : 0,
    
    // مؤشرات الأداء
    cart_abandonment_rate: cartAdds > 0 ? ((cartAdds - checkouts) / cartAdds * 100).toFixed(2) : 0,
    customer_retention_rate: 0, // يحتاج بيانات تاريخية
    inventory_turnover: 0, // يحتاج بيانات المخزون
    
    // تقديرات (يمكن استبدالها ببيانات حقيقية)
    customer_acquisition_cost: 15.75,
    customer_lifetime_value: 245.30,
    return_on_ad_spend: 4.2
  };
};

// ✅ هوك مساعد للإحصائيات السريعة
export const useQuickStats = () => {
  const [quickStats, setQuickStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        setLoading(true);
        const stats = await serviceRegistry.statistics.getQuickStats();
        setQuickStats(stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuickStats();
  }, []);

  return { quickStats, loading, error };
};

export default useStatistics;