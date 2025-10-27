// components/ui/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  fullWidth = false,
  className = '',
  ...props
}) => {
  // أنماط Variant
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-blue-500',
    link: 'bg-transparent hover:bg-transparent text-blue-600 hover:text-blue-700 underline focus:ring-blue-500'
  };

  // أنماط الحجم
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };

  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  const content = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );

  if (variant === 'link') {
    return (
      <button
        type={type}
        className={baseClasses}
        disabled={disabled || loading}
        onClick={onClick}
        {...props}
      >
        {content}
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {content}
    </motion.button>
  );
};

// أنواع متخصصة من الأزرار
export const IconButton = ({ icon, ...props }) => (
  <Button
    {...props}
    icon={icon}
    className={`p-2 ${props.className || ''}`}
  />
);

export const FabButton = ({ icon, ...props }) => (
  <Button
    {...props}
    icon={icon}
    className={`rounded-full p-4 shadow-lg ${props.className || ''}`}
    size="large"
  />
);

export const ButtonGroup = ({ children, className = '' }) => (
  <div className={`inline-flex rounded-lg shadow-sm ${className}`}>
    {React.Children.map(children, (child, index) => 
      React.cloneElement(child, {
        className: `
          ${child.props.className || ''}
          ${index === 0 ? 'rounded-r-none' : ''}
          ${index === React.Children.count(children) - 1 ? 'rounded-l-none' : ''}
          ${index > 0 && index < React.Children.count(children) - 1 ? 'rounded-none' : ''}
          ${index > 0 ? 'border-l-0' : ''}
        `.trim()
      })
    )}
  </div>
);

export default Button;