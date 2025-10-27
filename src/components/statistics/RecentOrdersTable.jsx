// components/statistics/RecentOrdersTable.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, formatDate } from '../../utils/formatters';

const RecentOrdersTable = ({ data }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', text: 'مكتمل' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'قيد الانتظار' },
      processing: { color: 'bg-blue-100 text-blue-800', text: 'قيد المعالجة' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'ملغي' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">الطلبات الحديثة</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-right py-3 text-sm font-medium text-gray-500">رقم الطلب</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">العميل</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">المبلغ</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">الحالة</th>
              <th className="text-right py-3 text-sm font-medium text-gray-500">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 text-sm font-medium text-gray-900 text-right">
                  #{order.id}
                </td>
                <td className="py-3 text-sm text-gray-600 text-right">
                  {order.customer}
                </td>
                <td className="py-3 text-sm font-semibold text-gray-900 text-right">
                  {formatCurrency(order.amount)}
                </td>
                <td className="py-3 text-right">
                  {getStatusBadge(order.status)}
                </td>
                <td className="py-3 text-sm text-gray-500 text-right">
                  {formatDate(order.date)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;