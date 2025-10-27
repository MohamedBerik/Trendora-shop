// components/statistics/CustomerStats.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaUserPlus, 
  FaStar, 
  FaShoppingCart, 
  FaChartLine,
  FaMapMarkerAlt,
  FaRegClock,
  FaCrown
} from 'react-icons/fa';
import StatisticsModal from '../ui/StatisticsModal';
import ConfirmModal from '../ui/ConfirmModal';
import Button from '../ui/Button';
import { formatNumber, formatPercentage, formatCurrency } from '../../utils/formatters';

const CustomerStats = ({ data, dateRange }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCustomersModalOpen, setIsCustomersModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'إجمالي العملاء',
      value: data.totalCustomers || 0,
      icon: <FaUsers className="text-blue-600" />,
      growth: data.customerGrowth || 0,
      color: 'blue',
      description: 'إجمالي عدد العملاء المسجلين'
    },
    {
      title: 'عملاء جدد',
      value: data.newCustomers || 0,
      icon: <FaUserPlus className="text-green-600" />,
      growth: data.newCustomerGrowth || 0,
      color: 'green',
      description: 'عملاء جدد خلال الفترة المحددة'
    },
    {
      title: 'معدل الرضا',
      value: data.satisfactionRate || 0,
      icon: <FaStar className="text-yellow-600" />,
      growth: data.satisfactionGrowth || 0,
      format: 'percentage',
      color: 'yellow',
      description: 'متوسط تقييم العملاء'
    },
    {
      title: 'متوسط الطلبات',
      value: data.avgOrdersPerCustomer || 0,
      icon: <FaShoppingCart className="text-purple-600" />,
      growth: data.avgOrdersGrowth || 0,
      color: 'purple',
      description: 'متوسط عدد الطلبات لكل عميل'
    }
  ];

  const topCustomers = data.topCustomers || [];
  const customerSegments = data.segments || [];
  const geographicData = data.geographicDistribution || [];

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setIsCustomersModalOpen(true);
  };

  const getRetentionRate = () => {
    if (!data.totalCustomers || !data.newCustomers) return 0;
    return ((data.totalCustomers - data.newCustomers) / data.totalCustomers) * 100;
  };

  const getLifetimeValue = (customer) => {
    return customer.totalSpent / (customer.totalOrders || 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">إحصائيات العملاء</h3>
        <Button 
          variant="outline" 
          size="small"
          onClick={() => setIsCustomersModalOpen(true)}
        >
          عرض التفاصيل
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            onClick={() => setIsCustomersModalOpen(true)}
          >
            <div className="p-3 bg-white rounded-lg shadow-sm mr-4">
              {stat.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm text-gray-600">{stat.title}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.growth > 0 
                    ? 'bg-green-100 text-green-800' 
                    : stat.growth < 0 
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {stat.growth > 0 ? '+' : ''}{formatPercentage(stat.growth)}
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900">
                {stat.format === 'percentage' ? `${stat.value}%` : formatNumber(stat.value)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {stat.description}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{formatPercentage(getRetentionRate())}</div>
          <div className="text-sm text-blue-700">معدل الاحتفاظ</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{data.avgOrderValue ? formatCurrency(data.avgOrderValue) : '$0'}</div>
          <div className="text-sm text-green-700">متوسط قيمة الطلب</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{formatNumber(data.repeatPurchaseRate || 0)}%</div>
          <div className="text-sm text-purple-700">معدل الشراء المتكرر</div>
        </div>
      </div>

      {/* Top Customers List */}
      {topCustomers.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <FaCrown className="text-yellow-500 mr-2" />
            أفضل العملاء
          </h4>
          <div className="space-y-3">
            {topCustomers.slice(0, 3).map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
                onClick={() => handleCustomerClick(customer)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <FaShoppingCart className="mr-1" size={12} />
                      {customer.totalOrders} طلبات
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatCurrency(customer.totalSpent)}</div>
                  <div className="text-sm text-green-600 flex items-center justify-end">
                    <FaChartLine className="mr-1" size={10} />
                    {customer.returnRate}% عائد
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Segments */}
      {customerSegments.length > 0 && (
        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold text-gray-900 mb-3">شرائح العملاء</h4>
          <div className="grid grid-cols-2 gap-3">
            {customerSegments.map((segment, index) => (
              <div key={segment.name} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{segment.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {segment.percentage}%
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900">{formatNumber(segment.count)}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${segment.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      <StatisticsModal
        isOpen={isCustomersModalOpen}
        onClose={() => {
          setIsCustomersModalOpen(false);
          setSelectedCustomer(null);
          setActiveTab('overview');
        }}
        title={selectedCustomer ? `تفاصيل العميل - ${selectedCustomer.name}` : 'تحليل العملاء'}
        size="xlarge"
      >
        {selectedCustomer ? (
          // Single Customer View
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p>
                <p className="text-sm text-blue-600">إجمالي الطلبات</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedCustomer.totalSpent)}</p>
                <p className="text-sm text-green-600">إجمالي الإنفاق</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(getLifetimeValue(selectedCustomer))}</p>
                <p className="text-sm text-purple-600">متوسط قيمة العميل</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-orange-600">{selectedCustomer.visitCount || 0}</p>
                <p className="text-sm text-orange-600">مرات الزيارة</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <FaRegClock className="mr-2" />
                  معلومات العميل
                </h4>
                <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">البريد الإلكتروني:</span>
                    <span className="font-medium">{selectedCustomer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ التسجيل:</span>
                    <span className="font-medium">{selectedCustomer.joinDate || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">آخر زيارة:</span>
                    <span className="font-medium">{selectedCustomer.lastVisit || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحالة:</span>
                    <span className={`font-medium ${
                      selectedCustomer.isActive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedCustomer.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <FaChartLine className="mr-2" />
                  الأداء
                </h4>
                <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">معدل العودة:</span>
                    <span className="font-medium">{selectedCustomer.returnRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">معدل التسوق:</span>
                    <span className="font-medium">{(selectedCustomer.conversionRate || 0).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">متوسط سلة الشراء:</span>
                    <span className="font-medium">{formatCurrency(selectedCustomer.avgCartValue || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الفئة:</span>
                    <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {selectedCustomer.segment || 'عام'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // All Customers Analysis View
          <div className="space-y-6">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'overview' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                نظرة عامة
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'segments' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('segments')}
              >
                شرائح العملاء
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === 'geographic' 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('geographic')}
              >
                التوزيع الجغرافي
              </button>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h4 className="font-semibold">أفضل العملاء</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-right py-3 text-sm font-medium text-gray-500">العميل</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-500">الطلبات</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-500">إجمالي الإنفاق</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-500">معدل العودة</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-500">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCustomers.map((customer, index) => (
                        <tr 
                          key={customer.id}
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleCustomerClick(customer)}
                        >
                          <td className="py-3 text-right">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {customer.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{customer.name}</div>
                                <div className="text-sm text-gray-500">{customer.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-sm font-medium text-gray-900 text-right">
                            {customer.totalOrders}
                          </td>
                          <td className="py-3 text-sm font-medium text-gray-900 text-right">
                            {formatCurrency(customer.totalSpent)}
                          </td>
                          <td className="py-3 text-right">
                            <span className="text-sm text-green-600">{customer.returnRate}%</span>
                          </td>
                          <td className="py-3 text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              customer.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {customer.isActive ? 'نشط' : 'غير نشط'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'segments' && (
              <div className="space-y-4">
                <h4 className="font-semibold">تحليل شرائح العملاء</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customerSegments.map((segment, index) => (
                    <div key={segment.name} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-semibold text-gray-900">{segment.name}</h5>
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {segment.percentage}%
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {formatNumber(segment.count)} عميل
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${segment.percentage}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        {segment.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'geographic' && geographicData.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  التوزيع الجغرافي
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {geographicData.map((region, index) => (
                    <div key={region.name} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">{region.name}</span>
                        <span className="text-sm text-gray-600">{region.percentage}%</span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatNumber(region.customers)} عميل
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${region.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </StatisticsModal>
    </div>
  );
};

export default CustomerStats;