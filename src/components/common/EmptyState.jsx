// components/common/EmptyState.jsx
import React from 'react';
import { FaChartBar } from 'react-icons/fa';

const EmptyState = ({ title = "لا توجد بيانات", message = "لا توجد بيانات متاحة للعرض" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FaChartBar className="text-gray-400 text-4xl mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default EmptyState;