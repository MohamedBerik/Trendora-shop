// components/ui/Card.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  shadow = 'shadow-sm',
  border = 'border border-gray-100',
  rounded = 'rounded-xl',
  background = 'bg-white',
  hover = false,
  onClick,
  animation = true,
  ...props 
}) => {
  const baseClasses = `
    ${background} 
    ${border} 
    ${rounded} 
    ${shadow} 
    ${padding} 
    ${hover ? 'hover:shadow-md transition-all duration-300 cursor-pointer' : ''}
    ${className}
  `.trim();

  const cardContent = (
    <div className={baseClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );

  if (animation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={hover ? { y: -2 } : {}}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};

// أنواع متخصصة من البطاقات
export const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue,
  color = 'blue',
  ...props 
}) => {
  const colorConfig = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', trend: 'text-blue-600' },
    green: { bg: 'bg-green-50', text: 'text-green-600', trend: 'text-green-600' },
    red: { bg: 'bg-red-50', text: 'text-red-600', trend: 'text-red-600' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', trend: 'text-yellow-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', trend: 'text-purple-600' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', trend: 'text-indigo-600' }
  };

  const config = colorConfig[color] || colorConfig.blue;

  return (
    <Card {...props}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm font-medium ${config.trend}`}>
              <span className={trend > 0 ? 'mr-1' : 'mr-1 transform rotate-180'}>
                {trend > 0 ? '↗' : '↘'}
              </span>
              {Math.abs(trendValue)}%
              <span className="text-gray-500 ml-1">{trend > 0 ? 'زيادة' : 'انخفاض'}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${config.bg}`}>
            <div className={`text-xl ${config.text}`}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export const ChartCard = ({ title, children, actions, ...props }) => {
  return (
    <Card {...props}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
      <div className="chart-container">
        {children}
      </div>
    </Card>
  );
};

export const TableCard = ({ title, children, headers, actions, ...props }) => {
  return (
    <Card {...props}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
      {headers && (
        <div className="border-b border-gray-200 pb-3 mb-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
            {headers.map((header, index) => (
              <div key={index} className={header.className}>
                {header.label}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        {children}
      </div>
    </Card>
  );
};

export default Card;