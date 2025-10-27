// components/dashboard/AnalyticsOverview.jsx
import React from 'react';
import { 
  FaEye, 
  FaSearch, 
  FaShoppingCart, 
  FaDollarSign,
  FaUsers,
  FaChartLine,
  FaMobile,
  FaDesktop
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const AnalyticsOverview = ({ analytics, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد بيانات تحليلات متاحة
      </div>
    );
  }

  const StatCard = ({ title, value, icon, growth, color, description }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          {icon}
        </div>
        <div className={`text-sm font-medium ${
          growth > 0 ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-gray-500'
        }`}>
          {growth > 0 ? '+' : ''}{growth}%
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </h3>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </motion.div>
  );

  const DeviceDistribution = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">توزيع الأجهزة</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaMobile className="text-blue-500 ml-2" />
            <span>الهواتف</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold">{analytics.device_analytics?.mobile || 58}%</span>
            <div className="w-20 bg-gray-200 rounded-full h-2 ml-3">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${analytics.device_analytics?.mobile || 58}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaDesktop className="text-green-500 ml-2" />
            <span>أجهزة الكمبيوتر</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold">{analytics.device_analytics?.desktop || 35}%</span>
            <div className="w-20 bg-gray-200 rounded-full h-2 ml-3">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${analytics.device_analytics?.desktop || 35}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaMobile className="text-purple-500 ml-2" />
            <span>الأجهزة اللوحية</span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold">{analytics.device_analytics?.tablet || 7}%</span>
            <div className="w-20 bg-gray-200 rounded-full h-2 ml-3">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${analytics.device_analytics?.tablet || 7}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PopularSearches = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">مصطلحات البحث الشائعة</h3>
      <div className="space-y-3">
        {analytics.search_analytics?.popular_terms?.map((term, index) => (
          <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <div className="flex items-center">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span className="mr-3 text-gray-700">{term.term}</span>
            </div>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
              {term.count} بحث
            </span>
          </div>
        )) || (
          <p className="text-gray-500 text-center py-4">لا توجد بيانات بحث متاحة</p>
        )}
      </div>
    </div>
  );

  const PerformanceMetrics = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">مؤشرات الأداء</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {analytics.cart_analytics?.checkout_conversion_rate || 6.5}%
          </div>
          <div className="text-sm text-green-700">معدل التحويل</div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {analytics.user_behavior?.average_session_duration || '4:32'}
          </div>
          <div className="text-sm text-blue-700">مدة الجلسة</div>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {analytics.user_behavior?.bounce_rate || 28.7}%
          </div>
          <div className="text-sm text-yellow-700">معدل الارتداد</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {analytics.user_behavior?.returning_visitors || 42.3}%
          </div>
          <div className="text-sm text-purple-700">زائرون عائدون</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* بطاقات التحليلات الرئيسية */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="مشاهدات الصفحات"
          value={analytics.page_views || analytics.search_analytics?.total_searches || 0}
          icon={<FaEye className="text-purple-600 text-xl" />}
          growth={12.3}
          color="text-purple-600"
          description="إجمالي مشاهدات الصفحات"
        />
        
        <StatCard
          title="عمليات البحث"
          value={analytics.searches || analytics.search_analytics?.total_searches || 0}
          icon={<FaSearch className="text-orange-600 text-xl" />}
          growth={8.7}
          color="text-orange-600"
          description="إجمالي عمليات البحث"
        />
        
        <StatCard
          title="الإضافات للسلة"
          value={analytics.add_to_cart || analytics.cart_analytics?.total_adds || 0}
          icon={<FaShoppingCart className="text-red-600 text-xl" />}
          growth={15.2}
          color="text-red-600"
          description="منتج أضيف إلى السلة"
        />
        
        <StatCard
          title="إجمالي الإيرادات"
          value={analytics.total_revenue || analytics.revenue_analytics?.total_revenue || 0}
          icon={<FaDollarSign className="text-green-600 text-xl" />}
          growth={12.5}
          color="text-green-600"
          description="إجمالي الإيرادات"
        />
      </div>

      {/* التحليلات المتقدمة */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            <PerformanceMetrics />
            <PopularSearches />
          </div>
        </div>
        
        <div className="space-y-6">
          <DeviceDistribution />
          
          {/* تحليل التحويل */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">تحليل التحويل</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">من مشاهدة إلى سلة</span>
                <span className="font-semibold text-blue-600">
                  {analytics.product_analytics?.view_to_cart_rate || 8.3}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">من سلة إلى شراء</span>
                <span className="font-semibold text-green-600">
                  {analytics.cart_analytics?.checkout_conversion_rate || 6.5}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">معدل التخلي عن السلة</span>
                <span className="font-semibold text-red-600">
                  {analytics.cart_analytics?.cart_abandonment_rate || 35.2}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;