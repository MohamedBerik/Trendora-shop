// components/statistics/OrderStats.jsx
import React from 'react';
import { motion } from 'framer-motion';

const OrderStats = ({ data }) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">حالة الطلبات</h3>
      <div className="space-y-4">
        {data.statusDistribution.map((status, index) => (
          <motion.div
            key={status.status}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status.status]}`}>
                {status.status}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{status.percentage}%</span>
              <span className="font-semibold text-gray-900">{status.count}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">متوسط وقت التوصيل</span>
          <span className="font-semibold text-gray-900">{data.avgDeliveryTime} أيام</span>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;