// components/statistics/TopCustomersTable.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/formatters';

const TopCustomersTable = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">أفضل العملاء</h3>
      <div className="space-y-4">
        {data.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {customer.name.charAt(0)}
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">{customer.name}</div>
                <div className="text-sm text-gray-500">{customer.orders} طلبات</div>
              </div>
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">{formatCurrency(customer.totalSpent)}</div>
              <div className="text-sm text-green-600">+{customer.returnRate}% عائد</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopCustomersTable;