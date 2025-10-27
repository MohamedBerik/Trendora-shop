// services/statisticsService.js - خدمة الإحصائيات
import { api } from './api';
import ENDPOINTS from './endpoints';
import serviceRegistry from './serviceRegistry';

export const statisticsService = {
  // ==================== الإحصائيات الرئيسية ====================
  
  // الإحصائيات الرئيسية للوحة التحكم
  async getDashboardStats(dateRange) {
    try {
      const url = serviceRegistry.utils.getStatisticsURL(ENDPOINTS.STATISTICS.DASHBOARD, dateRange);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // نظرة عامة على الإحصائيات
  async getOverview(dateRange) {
    try {
      const url = serviceRegistry.utils.getStatisticsURL(ENDPOINTS.STATISTICS.OVERVIEW, dateRange);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching overview stats:', error);
      throw error;
    }
  },

  // ==================== بيانات المبيعات والإيرادات ====================

  // بيانات المبيعات
  async getSalesData(dateRange, groupBy = 'day') {
    try {
      const url = serviceRegistry.utils.getStatisticsURL(ENDPOINTS.STATISTICS.SALES, dateRange, { group_by: groupBy });
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales data:', error);
      throw error;
    }
  },

  // بيانات الإيرادات
  async getRevenueData(dateRange, groupBy = 'day') {
    try {
      const url = serviceRegistry.utils.getStatisticsURL(ENDPOINTS.STATISTICS.REVENUE, dateRange, { group_by: groupBy });
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      throw error;
    }
  },

  // بيانات المبيعات اليومية
  async getDailySales(dateRange) {
    try {
      const url = serviceRegistry.utils.getStatisticsURL(ENDPOINTS.SALES.DAILY, dateRange);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching daily sales:', error);
      throw error;
    }
  },

  // اتجاهات المبيعات
  async getSalesTrends(dateRange) {
    try {
      const url = serviceRegistry.utils.getStatisticsURL(ENDPOINTS.SALES.TRENDS, dateRange);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      throw error;
    }
  },

  // ==================== بيانات المنتجات ====================

  // أفضل المنتجات مبيعاً
  async getTopProducts(dateRange, limit = 10) {
    try {
      const url = serviceRegistry.utils.getStatisticsURL(ENDPOINTS.STATISTICS.TOP_PRODUCTS, dateRange, { limit });
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching top products:', error);
      throw error;
    }
  },

  // توزيع الفئات
  async getCategoryDistribution(dateRange) {
    try {
      const url = serviceRegistry.utils.getStatisticsURL(ENDPOINTS.STATISTICS.CATEGORIES, dateRange);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching category distribution:', error);
      throw error;
    }
  },

  // ==================== بيانات العملاء والطلبات ====================

  // الطلبات الحديثة
  async getRecentOrders(limit = 10) {
    try {
      const response = await api.get(ENDPOINTS.STATISTICS.RECENT_ORDERS, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }
  },

  // إحصائيات العملاء
  async getCustomerStats(dateRange) {
    try {
      const url = serviceRegistry.utils.getStatisticsURL(ENDPOINTS.STATISTICS.CUSTOMERS, dateRange);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      throw error;
    }
  },

  // إحصائيات الطلبات
  async getOrderStats(dateRange) {
    try {
      const url = serviceRegistry.utils.getStatisticsURL(ENDPOINTS.STATISTICS.ORDERS, dateRange);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  },

  // ==================== بيانات المخزون ====================

  // إحصائيات المخزون
  async getInventoryStats() {
    try {
      const response = await api.get(ENDPOINTS.STATISTICS.INVENTORY);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory stats:', error);
      throw error;
    }
  },

  // المنتجات منخفضة المخزون
  async getLowStockProducts(threshold = 10) {
    try {
      const response = await api.get(ENDPOINTS.INVENTORY.LOW_STOCK, {
        params: { threshold }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      throw error;
    }
  },

  // ==================== التقارير والتصدير ====================

  // إنشاء تقرير
  async generateReport(reportType, dateRange, format = 'pdf') {
    try {
      const response = await api.post(ENDPOINTS.REPORTS.GENERATE, {
        report_type: reportType,
        start_date: serviceRegistry.utils.formatDateForAPI(dateRange.startDate),
        end_date: serviceRegistry.utils.formatDateForAPI(dateRange.endDate),
        format
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  // تصدير البيانات
  async exportData(dataType, dateRange, format = 'csv') {
    try {
      const response = await api.post(ENDPOINTS.REPORTS.EXPORT, {
        data_type: dataType,
        start_date: serviceRegistry.utils.formatDateForAPI(dateRange.startDate),
        end_date: serviceRegistry.utils.formatDateForAPI(dateRange.endDate),
        format
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  },

  // ==================== إحصائيات سريعة ====================

  // إحصائيات سريعة للأسبوع الحالي
  async getQuickStats() {
    try {
      const dateRange = serviceRegistry.utils.getDateRange(7);
      const [dashboard, sales, orders] = await Promise.all([
        this.getDashboardStats(dateRange),
        this.getSalesData(dateRange),
        this.getOrderStats(dateRange)
      ]);
      
      return {
        dashboard,
        sales,
        orders,
        date_range: dateRange
      };
    } catch (error) {
      console.error('Error fetching quick stats:', error);
      throw error;
    }
  }
};

export default statisticsService;