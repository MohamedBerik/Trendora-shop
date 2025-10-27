// components/statistics/StatCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';

const StatCard = ({ title, value, icon, growth, color = 'primary', format = 'number' }) => {
  const formatValue = (val) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return `${val}%`;
      default:
        return formatNumber(val);
    }
  };

  const colorClasses = {
    primary: 'from-blue-500 to-blue-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    danger: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} bg-opacity-10`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className={`flex items-center text-sm font-medium ${
          growth > 0 ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-gray-500'
        }`}>
          {growth > 0 ? '↗' : growth < 0 ? '↘' : '→'}
          {formatPercentage(growth)}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {formatValue(value)}
      </h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </motion.div>
  );
};

export default StatCard;