// components/statistics/RevenueChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { chartConfigs, getRevenueChartData } from '../../utils/charts';
// ❌ لا حاجة لـ ChartJS.register هنا

const RevenueChart = ({ data }) => {
  const chartData = getRevenueChartData(
    data.map(item => ({ date: item.date, revenue: item.revenue })),
    data.map(item => ({ date: item.date, costs: item.costs }))
  );

  const options = chartConfigs.revenue.options('الإيرادات والتكاليف');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="chart-container" style={{ position: 'relative', height: '400px', width: '100%' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;