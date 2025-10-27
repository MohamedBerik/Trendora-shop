import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ 
  size = "lg", 
  text = "جاري تحميل المحتوى...",
  className = "" 
}) => {
  const sizes = {
    sm: "40px",
    md: "60px",
    lg: "80px"
  };

  return (
    <div className={`d-flex flex-column align-items-center justify-content-center py-5 ${className}`}>
      {/* Spinner متحرك */}
      <motion.div
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          width: sizes[size],
          height: sizes[size],
          border: `4px solid #f3f3f3`,
          borderTop: `4px solid var(--main-color)`,
          borderRadius: '50%'
        }}
      />
      
      {/* النص */}
      {text && (
        <motion.p 
          className="mt-3 text-muted fw-semibold text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: '0.9rem' }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;