// components/statistics/InventoryStats.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBox, 
  FaExclamationTriangle, 
  FaTimes, 
  FaCheck, 
  FaSortAmountDown,
  FaSearch,
  FaSync,
  FaDownload
} from 'react-icons/fa';
import StatisticsModal from '../ui/StatisticsModal';
import ConfirmModal from '../ui/ConfirmModal';
import Button from '../ui/Button';
import { formatNumber, formatCurrency } from '../../utils/formatters';

const InventoryStats = ({ data, dateRange }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('stock');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [newStock, setNewStock] = useState(0);

  const getStockStatus = (stock, minStock = 10) => {
    if (stock === 0) return { 
      color: 'text-red-600', 
      bg: 'bg-red-100', 
      text: 'منتهي',
      icon: <FaTimes className="text-red-600" />,
      level: 'out'
    };
    if (stock <= minStock) return { 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100', 
      text: 'منخفض',
      icon: <FaExclamationTriangle className="text-yellow-600" />,
      level: 'low'
    };
    return { 
      color: 'text-green-600', 
      bg: 'bg-green-100', 
      text: 'متوفر',
      icon: <FaCheck className="text-green-600" />,
      level: 'good'
    };
  };

  const stats = [
    {
      title: 'إجمالي المنتجات',
      value: data.totalProducts || 0,
      color: 'blue',
      description: 'إجمالي عدد المنتجات في المخزون'
    },
    {
      title: 'منخفض المخزون',
      value: data.lowStockCount || 0,
      color: 'yellow',
      description: 'منتجات تحت الحد الأدنى'
    },
    {
      title: 'منتهي المخزون',
      value: data.outOfStockCount || 0,
      color: 'red',
      description: 'منتجات غير متوفرة'
    },
    {
      title: 'قيمة المخزون',
      value: data.totalInventoryValue || 0,
      color: 'green',
      description: 'إجمالي قيمة المخزون',
      format: 'currency'
    }
  ];

  const lowStockProducts = data.lowStockProducts || [];
  const outOfStockProducts = data.outOfStockProducts || [];
  const recentMovements = data.recentMovements || [];

  // تصفية وترتيب المنتجات
  const filteredProducts = [...lowStockProducts, ...outOfStockProducts]
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'stock') {
        return sortOrder === 'asc' ? a.stock - b.stock : b.stock - a.stock;
      }
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });

  const handleUpdateStock = (product) => {
    setSelectedProduct(product);
    setNewStock(product.stock);
    setIsUpdateModalOpen(true);
  };

  const handleReorder = (product) => {
    setSelectedProduct(product);
    setIsReorderModalOpen(true);
  };

  const handleStockUpdate = async () => {
    try {
      console.log(`تحديث مخزون ${selectedProduct.name} إلى ${newStock}`);
      // await inventoryService.updateStock(selectedProduct.id, newStock);
      setIsUpdateModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('خطأ في تحديث المخزون:', error);
    }
  };

  const handleReorderSubmit = async (quantity) => {
    try {
      console.log(`طلب إعادة توريد ${quantity} وحدة من ${selectedProduct.name}`);
      // await inventoryService.reorderProduct(selectedProduct.id, quantity);
      setIsReorderModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('خطأ في طلب إعادة التوريد:', error);
    }
  };

  const getInventoryHealth = () => {
    const total = data.totalProducts || 1;
    const outOfStock = data.outOfStockCount || 0;
    const lowStock = data.lowStockCount || 0;
    
    const healthy = total - outOfStock - lowStock;
    return Math.round((healthy / total) * 100);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">إدارة المخزون</h3>
          <p className="text-sm text-gray-600 mt-1">مراقبة وتحليل حالة المخزون</p>
        </div>
        <Button 
          variant="primary"
          onClick={() => setIsInventoryModalOpen(true)}
        >
          <FaBox className="mr-2" />
          عرض التفاصيل
        </Button>
      </div>

      {/* Inventory Health */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-blue-900">صحة المخزون</span>
          <span className="text-2xl font-bold text-blue-600">{getInventoryHealth()}%</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-600 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${getInventoryHealth()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-blue-700 mt-1">
          <span>يحتاج تحسين</span>
          <span>ممتاز</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 p-4 rounded-lg text-center hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => setIsInventoryModalOpen(true)}
          >
            <div className={`text-2xl font-bold ${
              stat.color === 'blue' ? 'text-blue-600' :
              stat.color === 'yellow' ? 'text-yellow-600' :
              stat.color === 'red' ? 'text-red-600' :
              'text-green-600'
            }`}>
              {stat.format === 'currency' ? formatCurrency(stat.value) : formatNumber(stat.value)}
            </div>
            <div className="text-sm text-gray-600 mt-1">{stat.title}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
          </motion.div>
        ))}
      </div>

      {/* Alert Products */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-900 flex items-center">
            <FaExclamationTriangle className="text-yellow-500 mr-2" />
            المنتجات التي تحتاج انتباه
          </h4>
          <span className="text-sm text-gray-500">
            {filteredProducts.length} منتج
          </span>
        </div>

        {filteredProducts.slice(0, 5).map((product, index) => {
          const status = getStockStatus(product.stock, product.minStock);
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className={`p-2 rounded-lg ${status.bg}`}>
                  {status.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500 flex items-center space-x-4 mt-1">
                    <span>الفئة: {product.category}</span>
                    <span>الحد الأدنى: {product.minStock || 10}</span>
                    <span>SKU: {product.sku}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className={`text-lg font-bold ${status.color}`}>
                    {formatNumber(product.stock)} وحدة
                  </div>
                  <div className="text-sm text-gray-500">
                    {status.text}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleUpdateStock(product)}
                  >
                    تحديث
                  </Button>
                  {status.level === 'out' && (
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => handleReorder(product)}
                    >
                      إعادة توريد
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Movements */}
      {recentMovements.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium text-gray-900 mb-3">آخر التحركات</h4>
          <div className="space-y-2">
            {recentMovements.slice(0, 3).map((movement, index) => (
              <div key={movement.id} className="flex justify-between items-center p-2 text-sm">
                <span className="text-gray-600">{movement.productName}</span>
                <span className={`font-medium ${
                  movement.type === 'in' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                </span>
                <span className="text-gray-500 text-xs">{movement.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Details Modal */}
      <StatisticsModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        title="تحليل المخزون التفصيلي"
        size="xlarge"
      >
        <div className="space-y-6">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="stock">حسب المخزون</option>
                <option value="name">حسب الاسم</option>
              </select>
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <FaSortAmountDown />
              </Button>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 text-sm font-medium text-gray-500">المنتج</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">المخزون</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">الحد الأدنى</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">الحالة</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => {
                  const status = getStockStatus(product.stock, product.minStock);
                  return (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 text-right">
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category} • {product.sku}</div>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <div className="font-medium text-gray-900">{formatNumber(product.stock)}</div>
                      </td>
                      <td className="py-3 text-right text-gray-600">
                        {product.minStock || 10}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          {status.icon && <span className="ml-1">{status.icon}</span>}
                          {status.text}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex space-x-2 justify-end">
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleUpdateStock(product)}
                          >
                            تحديث
                          </Button>
                          {status.level === 'out' && (
                            <Button
                              variant="primary"
                              size="small"
                              onClick={() => handleReorder(product)}
                            >
                              إعادة توريد
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </StatisticsModal>

      {/* Update Stock Modal */}
      <StatisticsModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title={`تحديث مخزون - ${selectedProduct?.name}`}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="primary" onClick={handleStockUpdate}>
              <FaSync className="mr-2" />
              تحديث المخزون
            </Button>
          </>
        }
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">المخزون الحالي</p>
                <p className="text-2xl font-bold text-gray-900">{selectedProduct.stock}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">الحد الأدنى</p>
                <p className="text-2xl font-bold text-red-600">{selectedProduct.minStock || 10}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الكمية الجديدة
              </label>
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ملاحظات
              </label>
              <textarea
                rows="3"
                placeholder="أضف ملاحظات حول تحديث المخزون..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </StatisticsModal>

      {/* Reorder Modal */}
      <ConfirmModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        onConfirm={() => handleReorderSubmit(50)} // كمية افتراضية
        title="طلب إعادة توريد"
        message={`هل تريد طلب إعادة توريد ${selectedProduct?.name}؟ سيتم إشعار فريق المشتريات.`}
        confirmText="تأكيد الطلب"
        cancelText="إلغاء"
        variant="primary"
      />
    </div>
  );
};

export default InventoryStats;