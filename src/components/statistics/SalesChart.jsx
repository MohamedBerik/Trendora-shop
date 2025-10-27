// components/statistics/SalesChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { chartConfigs, getSalesChartData } from '../../utils/charts';
// ❌ لا حاجة لـ ChartJS.register هنا

const SalesChart = ({ data }) => {
  const chartData = getSalesChartData(
    data.map(item => ({ date: item.date, sales: item.sales })),
    data.map(item => ({ date: item.date, revenue: item.orders }))
  );

  const options = chartConfigs.sales.options('المبيعات والطلبات');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="chart-container" style={{ position: 'relative', height: '400px', width: '100%' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SalesChart;