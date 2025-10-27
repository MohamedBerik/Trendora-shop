// hooks/useSalesData.js
import { useState, useEffect, useCallback } from 'react';
import serviceRegistry from '../services/serviceRegistry';

export const useSalesData = (dateRange, options = {}) => {
  const [data, setData] = useState({
    current: [],
    comparison: [],
    metrics: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    groupBy = 'day',
    includeComparison = false,
    metrics = ['sales', 'revenue'],
    autoRefresh = false
  } = options;

  // ✅ جلب بيانات المبيعات
  const fetchSalesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ استخدام serviceRegistry الموحد
      const salesData = await serviceRegistry.statistics.getSalesData(dateRange, groupBy);
      
      // إذا طلبنا بيانات المقارنة
      let comparisonData = [];
      if (includeComparison) {
        const previousDateRange = getPreviousDateRange(dateRange);
        comparisonData = await serviceRegistry.statistics.getSalesData(previousDateRange, groupBy);
      }

      const newData = {
        current: salesData || [],
        comparison: comparisonData || [],
        metrics,
        timestamp: new Date().toISOString()
      };

      setData(newData);
      
      // ✅ تتبع نجاح جلب البيانات
      serviceRegistry.analytics.trackUserAction('sales_data_fetched', {
        date_range: dateRange,
        group_by: groupBy,
        data_points: salesData?.length || 0,
        has_comparison: includeComparison
      });
      
      return newData;
    } catch (err) {
      const errorMessage = err.message || 'فشل في جلب بيانات المبيعات';
      setError(errorMessage);
      console.error('Error fetching sales data:', err);
      
      // ✅ تتبع الخطأ
      serviceRegistry.analytics.trackError('sales_data_error', errorMessage, 'useSalesData', {
        date_range: dateRange,
        group_by: groupBy
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dateRange, groupBy, includeComparison, metrics]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  // ✅ التحديث التلقائي
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchSalesData();
    }, 30000); // كل 30 ثانية

    return () => clearInterval(interval);
  }, [autoRefresh, fetchSalesData]);

  // ✅ حساب النمو (محسّن)
  const calculateGrowth = useCallback(() => {
    if (!data.comparison || data.comparison.length === 0) return 0;

    const currentTotal = data.current.reduce((sum, item) => sum + (item.sales || 0), 0);
    const previousTotal = data.comparison.reduce((sum, item) => sum + (item.sales || 0), 0);

    if (previousTotal === 0) return currentTotal > 0 ? 100 : 0;
    return ((currentTotal - previousTotal) / previousTotal) * 100;
  }, [data]);

  // ✅ الحصول على أعلى يوم مبيعات (محسّن)
  const getPeakSalesDay = useCallback(() => {
    if (!data.current || data.current.length === 0) return null;
    
    return data.current.reduce((peak, day) => 
      (day.sales || 0) > (peak.sales || 0) ? day : peak
    , { ...data.current[0] });
  }, [data]);

  // ✅ الحصول على متوسط المبيعات (محسّن)
  const getAverageSales = useCallback(() => {
    if (!data.current || data.current.length === 0) return 0;
    
    const total = data.current.reduce((sum, day) => sum + (day.sales || 0), 0);
    return total / data.current.length;
  }, [data]);

  // ✅ الحصول على إجمالي المبيعات
  const getTotalSales = useCallback(() => {
    if (!data.current || data.current.length === 0) return 0;
    return data.current.reduce((sum, day) => sum + (day.sales || 0), 0);
  }, [data]);

  // ✅ إعادة تجميع البيانات
  const regroupData = useCallback(async (newGroupBy) => {
    try {
      setLoading(true);
      const newData = await serviceRegistry.statistics.getSalesData(dateRange, newGroupBy);
      
      setData(prev => ({
        ...prev,
        current: newData || []
      }));
      
      return newData;
    } catch (err) {
      const errorMessage = `فشل في إعادة تجميع البيانات: ${err.message}`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  // ✅ إعادة جلب البيانات يدوياً (محسّن)
  const refetch = useCallback(async () => {
    try {
      const result = await fetchSalesData();
      
      // تتبع حدث التحديث
      serviceRegistry.analytics.trackUserAction('sales_data_refreshed', {
        date_range: dateRange,
        source: 'manual_refetch'
      });
      
      return result;
    } catch (err) {
      throw err;
    }
  }, [fetchSalesData, dateRange]);

  // ✅ تصدير البيانات
  const exportData = useCallback(async (format = 'csv') => {
    try {
      const result = await serviceRegistry.statistics.exportData('sales', dateRange, format);
      
      // تتبع التصدير
      serviceRegistry.analytics.trackUserAction('sales_data_exported', {
        format,
        date_range: dateRange,
        data_points: data.current.length
      });
      
      return result;
    } catch (err) {
      const errorMessage = `فشل في تصدير البيانات: ${err.message}`;
      serviceRegistry.analytics.trackError('sales_export_error', errorMessage, 'useSalesData');
      throw err;
    }
  }, [dateRange, data.current.length]);

  return {
    // البيانات الأساسية
    data: data.current,
    comparison: data.comparison,
    loading,
    error,
    
    // الإجراءات
    refetch,
    regroupData,
    exportData,
    
    // الإحصائيات المحسوبة
    growth: calculateGrowth(),
    peakDay: getPeakSalesDay(),
    average: getAverageSales(),
    total: getTotalSales(),
    
    // معلومات إضافية
    metrics,
    lastUpdated: data.timestamp,
    hasData: data.current && data.current.length > 0,
    dataPoints: data.current.length,
    
    // دوال مساعدة
    getWeeklyTrend: () => calculateWeeklyTrend(data.current),
    getBestPerformingDays: () => getBestPerformingDays(data.current)
  };
};

// ✅ هوك لبيانات الإيرادات (محسّن)
export const useRevenueData = (dateRange, groupBy = 'day') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRevenueData = useCallback(async () => {
    try {
      setLoading(true);
      // ✅ استخدام serviceRegistry الموحد
      const revenueData = await serviceRegistry.statistics.getRevenueData(dateRange, groupBy);
      setData(revenueData || []);
    } catch (err) {
      const errorMessage = err.message || 'فشل في جلب بيانات الإيرادات';
      setError(errorMessage);
      serviceRegistry.analytics.trackError('revenue_data_error', errorMessage, 'useRevenueData');
    } finally {
      setLoading(false);
    }
  }, [dateRange, groupBy]);

  useEffect(() => {
    fetchRevenueData();
  }, [fetchRevenueData]);

  const getRevenueGrowth = useCallback(() => {
    if (data.length < 2) return 0;
    
    const recent = data[data.length - 1]?.revenue || 0;
    const previous = data[data.length - 2]?.revenue || 0;
    
    if (previous === 0) return recent > 0 ? 100 : 0;
    return ((recent - previous) / previous) * 100;
  }, [data]);

  const getTotalRevenue = useCallback(() => {
    return data.reduce((total, day) => total + (day.revenue || 0), 0);
  }, [data]);

  const getAverageRevenue = useCallback(() => {
    if (data.length === 0) return 0;
    return getTotalRevenue() / data.length;
  }, [data, getTotalRevenue]);

  const refetch = useCallback(async () => {
    await fetchRevenueData();
  }, [fetchRevenueData]);

  return {
    data,
    loading,
    error,
    refetch,
    growth: getRevenueGrowth(),
    total: getTotalRevenue(),
    average: getAverageRevenue(),
    hasData: data.length > 0
  };
};

// ✅ وظيفة مساعدة للحصول على الفترة السابقة
const getPreviousDateRange = (currentDateRange) => {
  if (!currentDateRange?.startDate || !currentDateRange?.endDate) {
    return currentDateRange;
  }
  
  const { startDate, endDate } = currentDateRange;
  const diff = endDate.getTime() - startDate.getTime();
  
  const previousEndDate = new Date(startDate.getTime());
  const previousStartDate = new Date(previousEndDate.getTime() - diff);
  
  return {
    startDate: previousStartDate,
    endDate: previousEndDate
  };
};

// ✅ دوال مساعدة إضافية
const calculateWeeklyTrend = (salesData) => {
  if (!salesData || salesData.length < 7) return 0;
  
  const lastWeek = salesData.slice(-7);
  const previousWeek = salesData.slice(-14, -7);
  
  const lastWeekTotal = lastWeek.reduce((sum, day) => sum + (day.sales || 0), 0);
  const previousWeekTotal = previousWeek.reduce((sum, day) => sum + (day.sales || 0), 0);
  
  if (previousWeekTotal === 0) return lastWeekTotal > 0 ? 100 : 0;
  return ((lastWeekTotal - previousWeekTotal) / previousWeekTotal) * 100;
};

const getBestPerformingDays = (salesData) => {
  if (!salesData || salesData.length === 0) return [];
  
  return [...salesData]
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, 3)
    .map(day => ({
      date: day.date,
      sales: day.sales,
      orders: day.orders
    }));
};

export default useSalesData;