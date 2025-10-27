// components/dashboard/StatisticsOverview.jsx
import React from 'react';
import { 
  FaShoppingCart, 
  FaUsers, 
  FaDollarSign, 
  FaBox,
  FaStar,
  FaArrowUp,
  FaArrowDown,
  FaShoppingBag
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const StatisticsOverview = ({ stats, loading, dateRange, onDateRangeChange }) => {
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

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد بيانات إحصائية متاحة
      </div>
    );
  }

  const StatCard = ({ title, value, icon, growth, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
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
      <p className="text-gray-600 text-sm">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </motion.div>
  );

  const SalesChartMini = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">أداء المبيعات</h3>
        <select
          value={dateRange}
          onChange={(e) => onDateRangeChange && onDateRangeChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">أسبوع</option>
          <option value="month">شهر</option>
          <option value="quarter">ربع سنة</option>
          <option value="year">سنة</option>
        </select>
      </div>
      <div className="h-40">
        <div className="flex items-end justify-between h-32 gap-1">
          {stats.salesData?.map((day, index) => (
            <div key={day.day} className="flex flex-col items-center flex-1">
              <div className="text-xs text-gray-500 mb-1">{day.day}</div>
              <div className="flex flex-col items-center w-full">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: (day.sales / 3500) * 100 + '%' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-t from-blue-500 to-blue-600 rounded-t w-full max-w-8 hover:from-blue-400 hover:to-blue-500 transition-all duration-300 cursor-pointer"
                  title={`$${day.sales} - ${day.orders} طلبات`}
                />
              </div>
            </div>
          )) || (
            <div className="text-center text-gray-500 w-full py-8">
              لا توجد بيانات مبيعات
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const TopProducts = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">المنتجات الأكثر مبيعاً</h3>
      <div className="space-y-3">
        {stats.topProducts?.map((product, index) => (
          <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold text-sm">
                {index + 1}
              </div>
              <div>
                <div className="font-medium text-gray-900">{product.name}</div>
                <div className="text-sm text-gray-500">{product.sales} مبيع</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">${product.revenue?.toLocaleString()}</div>
              <div className="text-sm text-green-600">+{Math.round((product.sales / stats.topProducts[0]?.sales) * 100)}%</div>
            </div>
          </div>
        )) || (
          <p className="text-gray-500 text-center py-4">لا توجد بيانات منتجات</p>
        )}
      </div>
    </div>
  );

  const CustomerInsights = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات العملاء</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">العملاء الجدد</span>
          <span className="font-semibold text-green-600">
            {stats.customerStats?.newCustomers || 0}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">العملاء العائدين</span>
          <span className="font-semibold text-blue-600">
            {stats.customerStats?.returningCustomers || 0}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">متوسط قيمة الطلب</span>
          <span className="font-semibold text-purple-600">
            ${stats.customerStats?.averageOrderValue || 0}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">معدل الرضا</span>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 ml-1" />
            <span className="font-semibold text-gray-900">
              {stats.customerStats?.customerSatisfaction || 0}/5
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* البطاقات الإحصائية الرئيسية */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي المبيعات"
          value={stats.overview?.totalSales}
          icon={<FaDollarSign className="text-green-600 text-xl" />}
          growth={stats.overview?.revenueGrowth}
          color="text-green-600"
          subtitle="إجمالي الإيرادات"
        />
        
        <StatCard
          title="إجمالي الطلبات"
          value={stats.overview?.totalOrders}
          icon={<FaShoppingCart className="text-blue-600 text-xl" />}
          growth={stats.overview?.orderGrowth}
          color="text-blue-600"
          subtitle="عدد الطلبات الكلي"
        />
        
        <StatCard
          title="إجمالي العملاء"
          value={stats.overview?.totalCustomers}
          icon={<FaUsers className="text-purple-600 text-xl" />}
          growth={stats.overview?.customerGrowth}
          color="text-purple-600"
          subtitle="العملاء المسجلين"
        />
        
        <StatCard
          title="إجمالي المنتجات"
          value={stats.overview?.totalProducts}
          icon={<FaBox className="text-orange-600 text-xl" />}
          growth={stats.overview?.productGrowth}
          color="text-orange-600"
          subtitle="المنتجات المتاحة"
        />
      </div>

      {/* المحتوى الإضافي */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChartMini />
        </div>
        
        <div className="space-y-6">
          <CustomerInsights />
          <TopProducts />
        </div>
      </div>

      {/* الطلبات الحديثة */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">أحدث الطلبات</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 text-sm font-medium text-gray-500">رقم الطلب</th>
                <th className="text-right py-3 text-sm font-medium text-gray-500">العميل</th>
                <th className="text-right py-3 text-sm font-medium text-gray-500">المبلغ</th>
                <th className="text-right py-3 text-sm font-medium text-gray-500">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders?.map((order, index) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-3 text-sm font-medium text-gray-900 text-right">{order.id}</td>
                  <td className="py-3 text-sm text-gray-600 text-right">{order.customer}</td>
                  <td className="py-3 text-sm font-semibold text-gray-900 text-right">${order.amount}</td>
                  <td className="py-3 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status === 'completed' ? 'مكتمل' :
                       order.status === 'pending' ? 'قيد الانتظار' :
                       order.status === 'processing' ? 'قيد المعالجة' : order.status}
                    </span>
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">
                    لا توجد طلبات حديثة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatisticsOverview;