// components/statistics/CategoryDistribution.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { chartConfigs, createPieDataset } from '../../utils/charts';

const CategoryDistribution = ({ data }) => {
  // ✅ استخدام الدالة الجاهزة المتقدمة
  const chartData = createPieDataset(
    data.map(item => item.percentage),
    data.map(item => item.category)
  );

  // ✅ استخدام الإعدادات الجاهزة
  const options = chartConfigs.categories.options('توزيع المبيعات حسب الفئة');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="chart-container" style={{ position: 'relative', height: '400px', width: '100%' }}>
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CategoryDistribution;