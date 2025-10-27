// hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';
import serviceRegistry from '../services/serviceRegistry';

export const useProducts = (dateRange, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    limit = 10,
    category = null,
    sortBy = 'sales',
    sortOrder = 'desc',
    includeInventory = false
  } = options;

  // ✅ جلب بيانات المنتجات
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ استخدام serviceRegistry الموحد
      const productsData = await serviceRegistry.statistics.getTopProducts(dateRange, limit);
      
      // إذا طلبنا بيانات المخزون أيضاً
      let inventoryData = [];
      if (includeInventory) {
        try {
          inventoryData = await serviceRegistry.statistics.getLowStockProducts(10);
        } catch (inventoryError) {
          console.warn('Failed to fetch inventory data:', inventoryError);
        }
      }

      const enrichedData = (productsData || []).map(product => ({
        ...product,
        // إضافة معلومات المخزون إذا كانت متاحة
        inventoryStatus: getInventoryStatus(product, inventoryData),
        // حساب معدل التحويل
        conversionRate: calculateConversionRate(product),
        // تصنيف الأداء
        performance: classifyPerformance(product)
      }));

      setData(enrichedData);
      
      // ✅ تتبع نجاح جلب البيانات
      serviceRegistry.analytics.trackUserAction('products_data_fetched', {
        date_range: dateRange,
        limit,
        category,
        products_count: enrichedData.length,
        include_inventory: includeInventory
      });
      
      return enrichedData;
    } catch (err) {
      const errorMessage = err.message || 'فشل في جلب بيانات المنتجات';
      setError(errorMessage);
      console.error('Error fetching products:', err);
      
      // ✅ تتبع الخطأ
      serviceRegistry.analytics.trackError('products_data_error', errorMessage, 'useProducts', {
        date_range: dateRange,
        limit
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dateRange, limit, category, includeInventory]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ✅ إعادة جلب البيانات يدوياً
  const refetch = useCallback(async () => {
    try {
      const result = await fetchProducts();
      
      // تتبع حدث التحديث
      serviceRegistry.analytics.trackUserAction('products_data_refreshed', {
        date_range: dateRange,
        source: 'manual_refetch'
      });
      
      return result;
    } catch (err) {
      throw err;
    }
  }, [fetchProducts, dateRange]);

  // ✅ الحصول على منتج بواسطة ID
  const getProductById = useCallback((id) => {
    return data.find(product => product.id === id);
  }, [data]);

  // ✅ الحصول على المنتجات حسب الفئة
  const getProductsByCategory = useCallback((categoryName) => {
    return data.filter(product => product.category === categoryName);
  }, [data]);

  // ✅ ترتيب المنتجات
  const sortProducts = useCallback((field, order = 'desc') => {
    const sorted = [...data].sort((a, b) => {
      const aValue = a[field] || 0;
      const bValue = b[field] || 0;
      
      if (order === 'asc') {
        return aValue - bValue;
      }
      return bValue - aValue;
    });
    setData(sorted);
    
    // تتبع حدث الترتيب
    serviceRegistry.analytics.trackUserAction('products_sorted', {
      field,
      order,
      products_count: sorted.length
    });
  }, [data]);

  // ✅ تصدير بيانات المنتجات
  const exportProducts = useCallback(async (format = 'csv') => {
    try {
      const result = await serviceRegistry.statistics.exportData('products', dateRange, format);
      
      // تتبع التصدير
      serviceRegistry.analytics.trackUserAction('products_data_exported', {
        format,
        date_range: dateRange,
        products_count: data.length
      });
      
      return result;
    } catch (err) {
      const errorMessage = `فشل في تصدير بيانات المنتجات: ${err.message}`;
      serviceRegistry.analytics.trackError('products_export_error', errorMessage, 'useProducts');
      throw err;
    }
  }, [dateRange, data.length]);

  // ✅ الحصول على إحصائيات سريعة
  const getQuickStats = useCallback(() => {
    if (data.length === 0) return null;

    const totalRevenue = data.reduce((sum, product) => sum + (product.revenue || 0), 0);
    const totalSales = data.reduce((sum, product) => sum + (product.sales || 0), 0);
    const averagePrice = data.reduce((sum, product) => sum + (product.price || 0), 0) / data.length;

    return {
      totalRevenue,
      totalSales,
      averagePrice,
      topProduct: data[0],
      categories: [...new Set(data.map(p => p.category))]
    };
  }, [data]);

  return {
    // البيانات الأساسية
    data,
    loading,
    error,
    
    // الإجراءات
    refetch,
    sortProducts,
    exportProducts,
    
    // دوال البحث والتصفية
    getProductById,
    getProductsByCategory,
    
    // إحصائيات
    quickStats: getQuickStats(),
    
    // معلومات إضافية
    hasData: data.length > 0,
    productsCount: data.length,
    categories: [...new Set(data.map(p => p.category))],
    
    // دوال متخصصة
    getTopPerforming: (count = 5) => data.slice(0, count),
    getUnderperforming: (count = 5) => [...data].sort((a, b) => (a.sales || 0) - (b.sales || 0)).slice(0, count)
  };
};

// ✅ هوك للمنتجات منخفضة المخزون (محسّن)
export const useLowStockProducts = (threshold = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLowStockProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ استخدام serviceRegistry الموحد
      const lowStockData = await serviceRegistry.statistics.getLowStockProducts(threshold);
      setData(lowStockData || []);
      
      // تتبع نجاح جلب البيانات
      if (lowStockData && lowStockData.length > 0) {
        serviceRegistry.analytics.trackUserAction('low_stock_products_fetched', {
          threshold,
          products_count: lowStockData.length,
          critical_count: lowStockData.filter(p => (p.stock || 0) === 0).length
        });
      }
    } catch (err) {
      const errorMessage = err.message || 'فشل في جلب المنتجات منخفضة المخزون';
      setError(errorMessage);
      serviceRegistry.analytics.trackError('low_stock_error', errorMessage, 'useLowStockProducts', {
        threshold
      });
    } finally {
      setLoading(false);
    }
  }, [threshold]);

  useEffect(() => {
    fetchLowStockProducts();
  }, [fetchLowStockProducts]);

  const refetch = useCallback(async () => {
    await fetchLowStockProducts();
  }, [fetchLowStockProducts]);

  const getCriticalProducts = useCallback(() => {
    return data.filter(product => (product.stock || 0) === 0);
  }, [data]);

  const getLowStockCount = useCallback(() => {
    return data.filter(product => (product.stock || 0) > 0 && (product.stock || 0) <= threshold).length;
  }, [data, threshold]);

  const getOutOfStockCount = useCallback(() => {
    return data.filter(product => (product.stock || 0) === 0).length;
  }, [data]);

  return {
    data,
    loading,
    error,
    refetch,
    criticalProducts: getCriticalProducts(),
    lowStockCount: getLowStockCount(),
    outOfStockCount: getOutOfStockCount(),
    totalCount: data.length,
    hasCritical: getCriticalProducts().length > 0
  };
};

// ✅ هوك للفئات (محسّن ومتكامل)
export const useCategories = (dateRange) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ استخدام serviceRegistry الموحد
      const categoryData = await serviceRegistry.statistics.getCategoryDistribution(dateRange);
      setData(categoryData || []);
      
    } catch (err) {
      const errorMessage = err.message || 'فشل في جلب بيانات الفئات';
      setError(errorMessage);
      serviceRegistry.analytics.trackError('categories_data_error', errorMessage, 'useCategories');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const refetch = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  const getTopCategories = useCallback((limit = 5) => {
    return [...data]
      .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
      .slice(0, limit);
  }, [data]);

  const getCategoryByName = useCallback((categoryName) => {
    return data.find(category => category.category === categoryName);
  }, [data]);

  const getTotalPercentage = useCallback(() => {
    return data.reduce((total, category) => total + (category.percentage || 0), 0);
  }, [data]);

  return {
    data,
    loading,
    error,
    refetch,
    topCategories: getTopCategories(),
    totalPercentage: getTotalPercentage(),
    getCategoryByName,
    categoriesCount: data.length,
    hasData: data.length > 0
  };
};

// ✅ دوال مساعدة
const getInventoryStatus = (product, inventoryData) => {
  const inventoryProduct = inventoryData.find(inv => inv.id === product.id);
  if (!inventoryProduct) return 'unknown';
  
  const stock = inventoryProduct.stock || 0;
  if (stock === 0) return 'out_of_stock';
  if (stock <= 10) return 'low_stock';
  if (stock <= 25) return 'medium_stock';
  return 'in_stock';
};

const calculateConversionRate = (product) => {
  const views = product.views || 0;
  const sales = product.sales || 0;
  
  if (views === 0) return 0;
  return ((sales / views) * 100).toFixed(2);
};

const classifyPerformance = (product) => {
  const sales = product.sales || 0;
  const revenue = product.revenue || 0;
  
  if (sales > 50 && revenue > 1000) return 'excellent';
  if (sales > 20 && revenue > 500) return 'good';
  if (sales > 10 && revenue > 100) return 'average';
  return 'poor';
};

export default useProducts;