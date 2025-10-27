// hooks/useCustomers.js
import { useState, useEffect, useCallback } from 'react';
import serviceRegistry from '../services/serviceRegistry';

export const useCustomers = (dateRange, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    includeDetails = false,
    segment = 'all',
    includeTopCustomers = true,
    includeSegments = true
  } = options;

  // ✅ جلب بيانات العملاء
  const fetchCustomerData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ استخدام serviceRegistry الموحد
      const customerData = await serviceRegistry.statistics.getCustomerStats(dateRange);
      
      // بيانات إضافية
      let additionalData = {};
      
      if (includeTopCustomers) {
        try {
          const topCustomers = await serviceRegistry.statistics.getTopCustomers(10);
          additionalData.topCustomers = topCustomers || [];
        } catch (topError) {
          console.warn('Failed to fetch top customers:', topError);
          additionalData.topCustomers = [];
        }
      }

      if (includeSegments) {
        try {
          // استخدام بيانات التوزيع الجغرافي إذا كانت متاحة
          const segments = await getCustomerSegments(dateRange, segment);
          additionalData.segments = segments;
        } catch (segmentError) {
          console.warn('Failed to fetch customer segments:', segmentError);
          additionalData.segments = [];
        }
      }

      if (includeDetails) {
        try {
          const details = await getCustomerDetails(dateRange, segment);
          additionalData.detailedInfo = details;
        } catch (detailsError) {
          console.warn('Failed to fetch customer details:', detailsError);
          additionalData.detailedInfo = {};
        }
      }

      const mergedData = {
        ...customerData,
        ...additionalData,
        timestamp: new Date().toISOString()
      };

      setData(mergedData);
      
      // ✅ تتبع نجاح جلب البيانات
      serviceRegistry.analytics.trackUserAction('customers_data_fetched', {
        date_range: dateRange,
        segment,
        include_details: includeDetails,
        include_top_customers: includeTopCustomers,
        customers_count: customerData?.totalCustomers || 0
      });
      
      return mergedData;
    } catch (err) {
      const errorMessage = err.message || 'فشل في جلب بيانات العملاء';
      setError(errorMessage);
      console.error('Error fetching customer data:', err);
      
      // ✅ تتبع الخطأ
      serviceRegistry.analytics.trackError('customers_data_error', errorMessage, 'useCustomers', {
        date_range: dateRange,
        segment
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dateRange, includeDetails, segment, includeTopCustomers, includeSegments]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  // ✅ إعادة جلب البيانات يدوياً
  const refetch = useCallback(async () => {
    try {
      const result = await fetchCustomerData();
      
      // تتبع حدث التحديث
      serviceRegistry.analytics.trackUserAction('customers_data_refreshed', {
        date_range: dateRange,
        source: 'manual_refetch'
      });
      
      return result;
    } catch (err) {
      throw err;
    }
  }, [fetchCustomerData, dateRange]);

  // ✅ الحصول على أفضل العملاء من حيث الإنفاق
  const getTopSpenders = useCallback((limit = 10) => {
    if (!data?.topCustomers) return [];
    return data.topCustomers
      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
      .slice(0, limit);
  }, [data]);

  // ✅ الحصول على العملاء الجدد
  const getNewCustomers = useCallback(() => {
    return data?.newCustomers || data?.customerStats?.newCustomers || [];
  }, [data]);

  // ✅ حساب معدل الاحتفاظ بالعملاء
  const getRetentionRate = useCallback(() => {
    if (!data) return 0;
    
    const totalCustomers = data.totalCustomers || data.customerStats?.totalCustomers || 0;
    const returningCustomers = data.returningCustomers || data.customerStats?.returningCustomers || 0;
    
    if (totalCustomers === 0) return 0;
    return (returningCustomers / totalCustomers) * 100;
  }, [data]);

  // ✅ الحصول على توزيع العملاء حسب المنطقة
  const getCustomerDistribution = useCallback(() => {
    return data?.distributionByRegion || data?.geographicDistribution || [];
  }, [data]);

  // ✅ الحصول على متوسط قيمة العميل
  const getAverageCustomerValue = useCallback(() => {
    if (!data) return 0;
    
    const totalRevenue = data.totalRevenue || data.customerStats?.totalRevenue || 0;
    const totalCustomers = data.totalCustomers || data.customerStats?.totalCustomers || 0;
    
    if (totalCustomers === 0) return 0;
    return totalRevenue / totalCustomers;
  }, [data]);

  // ✅ الحصول على معدل الشراء المتكرر
  const getRepeatPurchaseRate = useCallback(() => {
    if (!data) return 0;
    
    const totalCustomers = data.totalCustomers || data.customerStats?.totalCustomers || 0;
    const repeatCustomers = data.repeatCustomers || data.customerStats?.repeatCustomers || 0;
    
    if (totalCustomers === 0) return 0;
    return (repeatCustomers / totalCustomers) * 100;
  }, [data]);

  // ✅ تصدير بيانات العملاء
  const exportCustomerData = useCallback(async (format = 'csv') => {
    try {
      const result = await serviceRegistry.statistics.exportData('customers', dateRange, format);
      
      // تتبع التصدير
      serviceRegistry.analytics.trackUserAction('customers_data_exported', {
        format,
        date_range: dateRange,
        customers_count: data?.totalCustomers || 0
      });
      
      return result;
    } catch (err) {
      const errorMessage = `فشل في تصدير بيانات العملاء: ${err.message}`;
      serviceRegistry.analytics.trackError('customers_export_error', errorMessage, 'useCustomers');
      throw err;
    }
  }, [dateRange, data]);

  // ✅ الحصول على إحصائيات سريعة
  const getQuickStats = useCallback(() => {
    if (!data) return null;

    return {
      totalCustomers: data.totalCustomers || data.customerStats?.totalCustomers || 0,
      newCustomers: data.newCustomers || data.customerStats?.newCustomers || 0,
      retentionRate: getRetentionRate(),
      averageOrderValue: data.averageOrderValue || data.customerStats?.averageOrderValue || 0,
      customerSatisfaction: data.customerSatisfaction || data.customerStats?.customerSatisfaction || 0,
      topSpender: getTopSpenders(1)[0]
    };
  }, [data, getRetentionRate, getTopSpenders]);

  return {
    // البيانات الأساسية
    data,
    loading,
    error,
    
    // الإجراءات
    refetch,
    exportCustomerData,
    
    // دوال الحساب
    topSpenders: getTopSpenders(),
    newCustomers: getNewCustomers(),
    retentionRate: getRetentionRate(),
    distribution: getCustomerDistribution(),
    averageCustomerValue: getAverageCustomerValue(),
    repeatPurchaseRate: getRepeatPurchaseRate(),
    
    // إحصائيات
    quickStats: getQuickStats(),
    
    // معلومات إضافية
    hasData: !!data,
    lastUpdated: data?.timestamp,
    segments: data?.segments || [],
    detailedInfo: data?.detailedInfo || {}
  };
};

// ✅ هوك للعملاء النشطين (محسّن ومتكامل)
export const useActiveCustomers = (dateRange, activityThreshold = 30) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ محاكاة API للعملاء النشطين (يمكن استبدالها بـ API حقيقي)
      const activeCustomers = await simulateActiveCustomersAPI(dateRange, activityThreshold);
      setData(activeCustomers);
      
      // تتبع نجاح جلب البيانات
      serviceRegistry.analytics.trackUserAction('active_customers_fetched', {
        activity_threshold: activityThreshold,
        active_customers_count: activeCustomers.length
      });
      
    } catch (err) {
      const errorMessage = err.message || 'فشل في جلب العملاء النشطين';
      setError(errorMessage);
      serviceRegistry.analytics.trackError('active_customers_error', errorMessage, 'useActiveCustomers', {
        activity_threshold: activityThreshold
      });
    } finally {
      setLoading(false);
    }
  }, [dateRange, activityThreshold]);

  useEffect(() => {
    fetchActiveCustomers();
  }, [fetchActiveCustomers]);

  const refetch = useCallback(async () => {
    await fetchActiveCustomers();
  }, [fetchActiveCustomers]);

  const getHighlyActiveCustomers = useCallback(() => {
    return data.filter(customer => (customer.activityScore || 0) >= 80);
  }, [data]);

  const getAtRiskCustomers = useCallback(() => {
    return data.filter(customer => (customer.lastActivityDays || 0) > activityThreshold * 0.7);
  }, [data, activityThreshold]);

  return {
    data,
    loading,
    error,
    refetch,
    highlyActive: getHighlyActiveCustomers(),
    atRisk: getAtRiskCustomers(),
    totalCount: data.length,
    averageActivityScore: data.reduce((sum, customer) => sum + (customer.activityScore || 0), 0) / data.length || 0
  };
};

// ✅ دوال مساعدة
const getCustomerDetails = async (dateRange, segment) => {
  try {
    // محاكاة API للتفاصيل (يمكن استبدالها بـ API حقيقي)
    return await simulateCustomerDetailsAPI(dateRange, segment);
  } catch (error) {
    console.error('Error fetching customer details:', error);
    return {};
  }
};

const getCustomerSegments = async (dateRange, segment) => {
  try {
    // محاكاة API للشرائح (يمكن استبدالها بـ API حقيقي)
    return await simulateCustomerSegmentsAPI(dateRange, segment);
  } catch (error) {
    console.error('Error fetching customer segments:', error);
    return [];
  }
};

// ✅ دوال محاكاة API (مؤقتة - يمكن استبدالها بـ APIs حقيقية)
const simulateActiveCustomersAPI = async (dateRange, threshold) => {
  // محاكاة بيانات العملاء النشطين
  return [
    {
      id: 1,
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // منذ يومين
      activityScore: 95,
      totalOrders: 15,
      totalSpent: 2450
    },
    {
      id: 2,
      name: 'فاطمة علي',
      email: 'fatima@example.com',
      lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // منذ 5 أيام
      activityScore: 78,
      totalOrders: 8,
      totalSpent: 1200
    }
    // يمكن إضافة المزيد من البيانات الوهمية
  ];
};

const simulateCustomerDetailsAPI = async (dateRange, segment) => {
  return {
    demographics: {
      ageGroups: ['18-25', '26-35', '36-45', '46+'],
      genderDistribution: { male: 55, female: 45 },
      locations: ['الرياض', 'جدة', 'الدمام', 'أبها']
    },
    behavior: {
      preferredCategories: ['إلكترونيات', 'ملابس', 'منزل'],
      averageSessionDuration: '4:32',
      favoriteTime: '19:00-22:00'
    }
  };
};

const simulateCustomerSegmentsAPI = async (dateRange, segment) => {
  return [
    { name: 'العملاء المميزين', percentage: 15, count: 45 },
    { name: 'العملاء المتكررين', percentage: 35, count: 105 },
    { name: 'العملاء الجدد', percentage: 25, count: 75 },
    { name: 'العملاء الخاملين', percentage: 25, count: 75 }
  ];
};

export default useCustomers;