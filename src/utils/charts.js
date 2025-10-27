// utils/charts.js
export const chartColors = {
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',
  
  success: '#10B981',
  successLight: '#34D399',
  successDark: '#059669',
  
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningDark: '#D97706',
  
  danger: '#EF4444',
  dangerLight: '#F87171',
  dangerDark: '#DC2626',
  
  info: '#6B7280',
  infoLight: '#9CA3AF',
  infoDark: '#4B5563',
  
  purple: '#8B5CF6',
  purpleLight: '#A78BFA',
  purpleDark: '#7C3AED',
  
  pink: '#EC4899',
  pinkLight: '#F472B6',
  pinkDark: '#DB2777',
  
  indigo: '#6366F1',
  indigoLight: '#818CF8',
  indigoDark: '#4F46E5'
};

export const getChartOptions = (title, options = {}) => {
  const {
    responsive = true,
    maintainAspectRatio = true,
    plugins = {},
    scales = {},
    rtl = true
  } = options;

  return {
    responsive,
    maintainAspectRatio,
    plugins: {
      legend: {
        position: 'top',
        rtl: rtl,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          size: 16,
          weight: 'bold'
        },
        padding: 20,
        color: '#1F2937'
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#374151',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              // ✅ التحديث الجديد هنا:
              if (context.dataset.label?.includes('الإيرادات') || 
                  context.dataset.label?.includes('التكاليف') ||
                  context.dataset.label?.includes('Revenue') ||
                  context.dataset.label?.includes('Costs')) {
                // استخدام تنسيق العملة للمبالغ المالية
                label += new Intl.NumberFormat('ar-EG', {
                  style: 'currency',
                  currency: 'USD'
                }).format(context.parsed.y);
              } else {
                // استخدام تنسيق الأرقام العادية
                label += new Intl.NumberFormat('ar-EG').format(context.parsed.y);
              }
            }
            return label;
          }
        }
      },
      ...plugins
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            size: 11
          },
          color: '#6B7280'
        }
      },
      y: {
        grid: {
          color: '#F3F4F6',
          drawBorder: false
        },
        ticks: {
          font: {
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            size: 11
          },
          color: '#6B7280',
          callback: function(value) {
            return new Intl.NumberFormat('ar-EG').format(value);
          }
        },
        beginAtZero: true
      },
      ...scales
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear'
      }
    }
  };
};

export const getGradient = (ctx, chartArea, color, opacity = 1) => {
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  gradient.addColorStop(0, `${color}00`);
  gradient.addColorStop(1, `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`);
  return gradient;
};

export const createLineDataset = (label, data, color, fill = false) => ({
  label,
  data,
  borderColor: color,
  backgroundColor: fill ? getGradient : 'transparent',
  borderWidth: 3,
  tension: 0.4,
  fill: fill,
  pointBackgroundColor: color,
  pointBorderColor: '#ffffff',
  pointBorderWidth: 2,
  pointRadius: 4,
  pointHoverRadius: 6,
  pointHoverBackgroundColor: color,
  pointHoverBorderColor: '#ffffff',
  pointHoverBorderWidth: 3
});

export const createBarDataset = (label, data, color) => ({
  label,
  data,
  backgroundColor: color,
  borderColor: color,
  borderWidth: 0,
  borderRadius: 6,
  borderSkipped: false,
  barPercentage: 0.7,
  categoryPercentage: 0.8
});

export const createPieDataset = (data, labels) => ({
  labels,
  datasets: [
    {
      data,
      backgroundColor: [
        chartColors.primary,
        chartColors.success,
        chartColors.warning,
        chartColors.danger,
        chartColors.purple,
        chartColors.pink,
        chartColors.indigo,
        chartColors.info
      ],
      borderWidth: 3,
      borderColor: '#ffffff',
      hoverOffset: 15
    }
  ]
});

export const getSalesChartData = (salesData, revenueData) => ({
  labels: salesData.map(item => item.date),
  datasets: [
    createLineDataset('المبيعات', salesData.map(item => item.sales), chartColors.primary, true),
    createLineDataset('الإيرادات', revenueData.map(item => item.revenue), chartColors.success, false)
  ]
});

export const getRevenueChartData = (revenueData, costsData) => ({
  labels: revenueData.map(item => item.date),
  datasets: [
    createBarDataset('الإيرادات', revenueData.map(item => item.revenue), chartColors.primary),
    createBarDataset('التكاليف', costsData.map(item => item.costs), chartColors.danger)
  ]
});

export const chartConfigs = {
  sales: {
    type: 'line',
    options: (title) => getChartOptions(title, {
      scales: {
        y: {
          ticks: {
            callback: function(value) {
              return '$' + new Intl.NumberFormat('ar-EG').format(value);
            }
          }
        }
      }
    })
  },
  revenue: {
    type: 'bar',
    options: (title) => getChartOptions(title, {
      scales: {
        y: {
          ticks: {
            callback: function(value) {
              return '$' + new Intl.NumberFormat('ar-EG').format(value);
            }
          }
        }
      }
    })
  },
  products: {
    type: 'doughnut',
    options: (title) => getChartOptions(title, {
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    })
  },
  categories: {
    type: 'pie',
    options: (title) => getChartOptions(title, {
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    })
  }
};

// إضافة هذا في utils/charts.js
export const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: currency
  }).format(value);
};