// components/dashboard/AdminStatisticsDashboard.jsx
import React, { useEffect } from 'react'; // أضف useEffect
import {
  FaShoppingCart,
  FaUsers,
  FaDollarSign,
  FaChartLine,
  FaBox,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaSearch,
  FaEye,
  FaShoppingBag,
  FaSync,
  FaDownload,
  FaCog,
  FaFilter,
  FaExclamationTriangle,
  FaFileExport,
  FaDatabase
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

// ✅ استيراد الهوكس من النظام المركزي فقط
import { useDashboard, useAnalytics } from '../../hooks/hooks-exports';

// استيراد المكونات المساعدة
import AnalyticsOverview from './AnalyticsOverview';
import StatisticsOverview from './StatisticsOverview';

const AdminStatisticsDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  // ✅ استخدام هوك البيانات
  const {
    dashboardData: stats,
    loading,
    dateRange,
    setDateRange,
    realTime,
    setRealTime,
    refreshData,
    exportData
  } = useDashboard('week');

  // ✅ استخدام useAnalytics فقط للتتبع
  const { trackEvent, trackPageView, trackError } = useAnalytics();

  // ✅ إنشاء دوال متخصصة للتتبع
  const trackExport = (metadata) => trackEvent('export_report', metadata);
  const trackTabChange = (metadata) => trackEvent('dashboard_tab_change', metadata);
  const trackDataManagement = (metadata) => trackEvent('data_management', metadata);

  // ✅ تتبع عرض الصفحة تلقائياً - استخدم useEffect مباشرة
  useEffect(() => {
    trackPageView('admin_dashboard', { activeTab });
  }, [trackPageView, activeTab]);

  // ✅ معالجة التصدير باستخدام الهوك
  const handleExport = async (type, format) => {
    try {
      const data = await exportData(format);
      
      // إنشاء ملف التصدير
      const dataStr = format === 'json' ? JSON.stringify(data, null, 2) : convertToCSV(data);
      const dataBlob = new Blob([dataStr], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${type}-${new Date().toISOString().split('T')[0]}.${format}`;
      link.click();

      trackExport({ 
        type, 
        format, 
        data_size: dataStr.length,
        success: true 
      });

    } catch (error) {
      console.error('Export failed:', error);
      trackExport({ 
        type, 
        format, 
        error: error.message,
        success: false 
      });
      trackError('export_failed', error.message, 'AdminStatisticsDashboard');
    }
  };

  // ✅ دالة مساعدة لتحويل البيانات إلى CSV
  const convertToCSV = (data) => {
    if (!data) return '';
    
    const flattenObject = (obj, prefix = '') => {
      return Object.keys(obj).reduce((acc, key) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(acc, flattenObject(obj[key], pre + key));
        } else {
          acc[pre + key] = obj[key];
        }
        return acc;
      }, {});
    };

    const flattened = flattenObject(data);
    const headers = Object.keys(flattened).join(',');
    const values = Object.values(flattened).map(val => 
      typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
    ).join(',');

    return `${headers}\n${values}`;
  };

  // ✅ إدارة البيانات باستخدام الهوك
  const handleDataManagement = async (action) => {
    try {
      trackDataManagement({ action });

      let result;
      switch (action) {
        case 'flush_offline':
          result = await refreshData();
          break;
        case 'cleanup_old':
          localStorage.removeItem('offline_analytics');
          result = await refreshData();
          break;
        case 'reset_session':
          sessionStorage.removeItem('analytics_session_id');
          result = await refreshData();
          break;
        default:
          break;
      }

      trackDataManagement({ 
        action, 
        success: true,
        result 
      });

    } catch (error) {
      console.error('Data management error:', error);
      trackDataManagement({ 
        action, 
        error: error.message,
        success: false 
      });
      trackError('data_management_failed', error.message, 'AdminStatisticsDashboard');
    }
  };



  // ✅ بطاقة إحصائية محسنة
  const StatCard = ({ title, value, icon, growth, color, type = 'statistics', description, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          {icon}
        </div>
        <div className={`flex items-center text-sm font-medium ${
          growth > 0 ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-gray-500'
        }`}>
          {growth > 0 ? <FaArrowUp className="mr-1" /> : 
           growth < 0 ? <FaArrowDown className="mr-1" /> : null}
          {growth !== 0 ? `${Math.abs(growth)}%` : '0%'}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </h3>
      <p className="text-gray-600 text-sm mb-2">{title}</p>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      <span className={`text-xs px-2 py-1 rounded-full ${
        type === 'analytics' ? 'bg-blue-100 text-blue-600' : 
        type === 'realtime' ? 'bg-purple-100 text-purple-600' :
        'bg-green-100 text-green-600'
      }`}>
        {type === 'analytics' ? 'تحليلات' : 
         type === 'realtime' ? 'مباشر' :
         'إحصائيات'}
      </span>
    </motion.div>
  );

  // ✅ تبويب النظرة العامة المحسن
  const OverviewTab = () => (
    <div>
      {/* ✅ بطاقات النظرة العامة المحسنة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="إجمالي المبيعات"
          value={stats?.overview?.totalSales || stats?.revenue_analytics?.total_revenue}
          icon={<FaDollarSign className="text-green-600 text-xl" />}
          growth={stats?.overview?.revenueGrowth || 12.5}
          color="text-green-600"
          description="إجمالي الإيرادات"
          onClick={() => trackTabChange({ action: 'stat_card_click', card: 'total_sales' })}
        />
        <StatCard
          title="الزوار المباشرين"
          value={stats?.overview?.liveVisitors || 23}
          icon={<FaUsers className="text-purple-600 text-xl" />}
          growth={8.2}
          color="text-purple-600"
          type="realtime"
          description="زوار حالين على الموقع"
          onClick={() => trackTabChange({ action: 'stat_card_click', card: 'live_visitors' })}
        />
        <StatCard
          title="مشاهدات الصفحات"
          value={stats?.analytics?.page_views}
          icon={<FaEye className="text-blue-600 text-xl" />}
          growth={12.3}
          color="text-blue-600"
          type="analytics"
          description="إجمالي مشاهدات الصفحات"
          onClick={() => trackTabChange({ action: 'stat_card_click', card: 'page_views' })}
        />
        <StatCard
          title="معدل التحويل"
          value={`${stats?.overview?.conversionRate || stats?.cart_analytics?.checkout_conversion_rate || 6.5}%`}
          icon={<FaChartLine className="text-orange-600 text-xl" />}
          growth={2.1}
          color="text-orange-600"
          description="نسبة تحويل الزوار"
          onClick={() => trackTabChange({ action: 'stat_card_click', card: 'conversion_rate' })}
        />
      </div>

      {/* ✅ شبكة البيانات الإضافية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="إضافات السلة"
          value={stats?.analytics?.add_to_cart || stats?.cart_analytics?.total_adds}
          icon={<FaShoppingCart className="text-red-600 text-xl" />}
          growth={5.7}
          color="text-red-600"
          type="analytics"
          description="منتجات مضافة إلى السلة"
          onClick={() => trackTabChange({ action: 'stat_card_click', card: 'cart_adds' })}
        />
        <StatCard
          title="عمليات البحث"
          value={stats?.analytics?.searches || stats?.search_analytics?.total_searches}
          icon={<FaSearch className="text-indigo-600 text-xl" />}
          growth={8.7}
          color="text-indigo-600"
          type="analytics"
          description="إجمالي عمليات البحث"
          onClick={() => trackTabChange({ action: 'stat_card_click', card: 'searches' })}
        />
        <StatCard
          title="متوسط قيمة الطلب"
          value={`$${stats?.analytics?.revenue_analytics?.average_order_value || stats?.revenue_analytics?.average_order_value || 189.14}`}
          icon={<FaShoppingBag className="text-teal-600 text-xl" />}
          growth={3.2}
          color="text-teal-600"
          type="analytics"
          description="متوسط قيمة كل طلب"
          onClick={() => trackTabChange({ action: 'stat_card_click', card: 'average_order_value' })}
        />
      </div>

      {/* ✅ محتوى إضافي */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">أحدث الطلبات</h3>
          <div className="space-y-3">
            {stats?.recentOrders?.slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{order.id}</div>
                  <div className="text-sm text-gray-500">{order.customer}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${order.amount}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status === 'completed' ? 'مكتمل' :
                     order.status === 'pending' ? 'قيد الانتظار' :
                     order.status === 'processing' ? 'قيد المعالجة' : order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">مصطلحات البحث الشائعة</h3>
          <div className="space-y-2">
            {stats?.analytics?.popular_terms?.slice(0, 5).map((term, index) => (
              <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span className="text-gray-700">{term.term}</span>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
                  {term.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ✅ تبويب التقارير المحسن
  const ReportsTab = () => (
    <div className="space-y-6">
      {/* ✅ إدارة البيانات */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaDatabase className="ml-2" />
          إدارة بيانات التحليلات
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
            onClick={() => handleDataManagement('flush_offline')}
          >
            <FaSync className="text-xl mx-auto mb-2" />
            <div className="font-semibold">تحديث البيانات</div>
            <div className="text-sm opacity-80">جلب أحدث البيانات من الخوادم</div>
          </button>
          
          <button 
            className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors duration-200 text-center"
            onClick={() => handleDataManagement('cleanup_old')}
          >
            <FaFilter className="text-xl mx-auto mb-2" />
            <div className="font-semibold">تنظيف البيانات</div>
            <div className="text-sm opacity-80">حذف البيانات المؤقتة القديمة</div>
          </button>
          
          <button 
            className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition-colors duration-200 text-center"
            onClick={() => handleDataManagement('reset_session')}
          >
            <FaUsers className="text-xl mx-auto mb-2" />
            <div className="font-semibold">إعادة التعيين</div>
            <div className="text-sm opacity-80">بدء جلسة تحليلات جديدة</div>
          </button>
        </div>
      </div>

      {/* ✅ تصدير التقارير */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <FaFileExport className="ml-2" />
          تصدير التقارير والبيانات
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button 
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-center"
            onClick={() => handleExport('analytics', 'json')}
          >
            <FaChartLine className="text-2xl mx-auto mb-2" />
            <div className="font-semibold">تقرير التحليلات</div>
            <div className="text-sm opacity-80">بيانات JSON كاملة</div>
          </button>
          
          <button 
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
            onClick={() => handleExport('analytics', 'csv')}
          >
            <FaDownload className="text-2xl mx-auto mb-2" />
            <div className="font-semibold">بيانات التحليلات</div>
            <div className="text-sm opacity-80">ملف CSV للتحليل</div>
          </button>

          <button 
            className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 text-center"
            onClick={() => handleExport('statistics', 'json')}
          >
            <FaDollarSign className="text-2xl mx-auto mb-2" />
            <div className="font-semibold">تقرير المبيعات</div>
            <div className="text-sm opacity-80">إحصائيات المبيعات</div>
          </button>

          <button 
            className="bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 text-center"
            onClick={() => handleExport('customers', 'json')}
          >
            <FaUsers className="text-2xl mx-auto mb-2" />
            <div className="font-semibold">تقرير العملاء</div>
            <div className="text-sm opacity-80">تحليل سلوك العملاء</div>
          </button>

          <button 
            className="bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-700 transition-colors duration-200 text-center"
            onClick={() => handleExport('products', 'json')}
          >
            <FaBox className="text-2xl mx-auto mb-2" />
            <div className="font-semibold">تقرير المنتجات</div>
            <div className="text-sm opacity-80">أداء المنتجات</div>
          </button>

          <button 
            className="bg-amber-600 text-white p-4 rounded-lg hover:bg-amber-700 transition-colors duration-200 text-center"
            onClick={() => handleExport('full', 'json')}
          >
            <FaDatabase className="text-2xl mx-auto mb-2" />
            <div className="font-semibold">تقرير شامل</div>
            <div className="text-sm opacity-80">جميع البيانات المتاحة</div>
          </button>
        </div>
      </div>
    </div>
  );

  // ✅ شريط التحكم المحسن
  const ControlBar = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={refreshData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaSync className="ml-2" />
            تحديث البيانات
          </button>
          
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={realTime}
                onChange={(e) => {
                  setRealTime(e.target.checked);
                  trackDataManagement({ action: 'realtime_toggle', enabled: e.target.checked });
                }}
              />
              <div className={`block w-14 h-8 rounded-full ${
                realTime ? 'bg-green-400' : 'bg-gray-400'
              }`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                realTime ? 'transform translate-x-6' : ''
              }`}></div>
            </div>
            <div className="ml-3 text-gray-700 font-medium">التحديث المباشر</div>
          </label>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value);
              trackTabChange({ action: 'date_range_change', range: e.target.value });
            }}
          >
            <option value="today">اليوم</option>
            <option value="week">أسبوع</option>
            <option value="month">شهر</option>
            <option value="year">سنة</option>
          </select>
        </div>
      </div>
    </div>
  );

  // ✅ تبويب التنقل
  const TabNavigation = () => {
    const tabs = [
      { id: 'overview', name: 'نظرة عامة', icon: '📊' },
      { id: 'statistics', name: 'الإحصائيات', icon: '📈' },
      { id: 'analytics', name: 'التحليلات', icon: '🔍' },
      { id: 'reports', name: 'التقارير', icon: '📋' }
    ];

    const handleTabChange = (tabId) => {
      setSearchParams({ tab: tabId });
      trackTabChange({ from: activeTab, to: tabId });
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex space-x-4 rtl:space-x-reverse">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="ml-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ✅ عرض المحتوى حسب التبويب
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'statistics':
        return <StatisticsOverview 
          stats={stats} 
          loading={loading}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />;
      case 'analytics':
        return <AnalyticsOverview 
          analytics={stats?.analytics} 
          loading={loading}
        />;
      case 'reports':
        return <ReportsTab />;
      default:
        return <OverviewTab />;
    }
  };

  // ✅ حالة التحميل
  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم الإدارة المتكاملة</h1>
          <p className="text-gray-600">
            {realTime ? 'بيانات مباشرة - ' : ''}
            آخر تحديث: {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleString('ar-SA') : 'جاري التحميل...'}
          </p>
        </div>

        {/* Control Bar */}
        <ControlBar />

        {/* Tab Navigation */}
        <TabNavigation />

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminStatisticsDashboard;