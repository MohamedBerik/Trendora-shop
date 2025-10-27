// components/statistics/TopProductsChart.jsx
import React, { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Button, StatisticsModal, Card } from '../ui';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { chartColors, getChartOptions } from '../../utils/charts';

ChartJS.register(ArcElement, Tooltip, Legend);

const TopProductsChart = ({ data, dateRange }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('sales'); // 'sales' or 'revenue'

  const { data: products, loading } = useProducts(dateRange);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => viewMode === 'sales' ? item.sales : item.revenue),
        backgroundColor: [
          chartColors.primary,
          chartColors.success,
          chartColors.warning,
          chartColors.danger,
          chartColors.info,
          chartColors.purple,
          chartColors.pink,
          chartColors.indigo
        ],
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverBorderWidth: 4,
        hoverBorderColor: '#f8fafc',
        hoverOffset: 8,
      },
    ],
  };

  const options = getChartOptions(
    `أفضل المنتجات ${viewMode === 'sales' ? 'مبيعاً' : 'من حيث الإيرادات'}`,
    {
      plugins: {
        legend: {
          position: 'bottom',
          rtl: true,
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 11
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              
              if (viewMode === 'sales') {
                return `${label}: ${formatNumber(value)} مبيع (${percentage}%)`;
              } else {
                return `${label}: ${formatCurrency(value)} (${percentage}%)`;
              }
            }
          }
        }
      },
      cutout: '60%',
      maintainAspectRatio: false
    }
  );

  // الحصول على إجمالي المبيعات أو الإيرادات
  const getTotal = () => {
    return data.reduce((total, item) => total + (viewMode === 'sales' ? item.sales : item.revenue), 0);
  };

  return (
    <div className="chart-card">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          أفضل المنتجات {viewMode === 'sales' ? 'مبيعاً' : 'من حيث الإيرادات'}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'sales' ? 'primary' : 'outline'}
            size="small"
            onClick={() => setViewMode('sales')}
          >
            المبيعات
          </Button>
          <Button
            variant={viewMode === 'revenue' ? 'primary' : 'outline'}
            size="small"
            onClick={() => setViewMode('revenue')}
          >
            الإيرادات
          </Button>
        </div>
      </div>

      {/* Chart and List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="relative h-64">
          <Doughnut data={chartData} options={options} />
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {viewMode === 'sales' 
                  ? formatNumber(getTotal())
                  : formatCurrency(getTotal())
                }
              </div>
              <div className="text-sm text-gray-600 mt-1">
                إجمالي {viewMode === 'sales' ? 'المبيعات' : 'الإيرادات'}
              </div>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-3">
          {data.slice(0, 5).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200"
              onClick={() => handleProductClick(product)}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-500' :
                  'bg-blue-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.category}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {viewMode === 'sales' 
                    ? formatNumber(product.sales)
                    : formatCurrency(product.revenue)
                  }
                </div>
                <div className="text-sm text-gray-500">
                  {viewMode === 'sales' ? 'مبيع' : 'إيرادات'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View All Button */}
      {data.length > 5 && (
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="small"
            onClick={() => setIsProductModalOpen(true)}
          >
            عرض جميع المنتجات ({data.length})
          </Button>
        </div>
      )}

      {/* Product Details Modal */}
      <StatisticsModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={selectedProduct ? `تفاصيل ${selectedProduct.name}` : 'جميع المنتجات'}
        size="large"
      >
        {selectedProduct ? (
          // Single Product View
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{selectedProduct.sales}</p>
                <p className="text-sm text-blue-600">عدد المبيعات</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedProduct.revenue)}</p>
                <p className="text-sm text-green-600">الإيرادات</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(selectedProduct.price)}</p>
                <p className="text-sm text-purple-600">السعر</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-orange-600">{selectedProduct.stock || 'N/A'}</p>
                <p className="text-sm text-orange-600">المخزون</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">معلومات المنتج</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الفئة:</span>
                    <span className="font-medium">{selectedProduct.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">العلامة التجارية:</span>
                    <span className="font-medium">{selectedProduct.brand || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">التقييم:</span>
                    <span className="font-medium">⭐ {selectedProduct.rating || 'N/A'}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحالة:</span>
                    <span className={`font-medium ${
                      (selectedProduct.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(selectedProduct.stock || 0) > 0 ? 'متوفر' : 'غير متوفر'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">الأداء</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">معدل التحويل:</span>
                    <span className="font-medium">{(selectedProduct.conversionRate || 0).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">العملاء المعادين:</span>
                    <span className="font-medium">{selectedProduct.returningCustomers || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">آخر تحديث:</span>
                    <span className="font-medium">{selectedProduct.lastSale || 'غير محدد'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // All Products View
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 text-sm font-medium text-gray-500">المنتج</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500">المبيعات</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500">الإيرادات</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500">السعر</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-500">التقييم</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((product, index) => (
                    <tr 
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <td className="py-3 text-right">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-orange-500' :
                            'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-sm font-medium text-gray-900 text-right">
                        {formatNumber(product.sales)}
                      </td>
                      <td className="py-3 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(product.revenue)}
                      </td>
                      <td className="py-3 text-sm text-gray-600 text-right">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end">
                          <span className="text-sm text-gray-600">⭐ {product.rating || 'N/A'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </StatisticsModal>
    </div>
  );
};

export default TopProductsChart;