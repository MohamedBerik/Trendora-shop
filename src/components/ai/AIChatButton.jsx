import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from 'react-bootstrap';
import { FaRobot, FaTimes } from 'react-icons/fa';

const AIChatButton = ({ onToggle, isOpen }) => {
  return (
    <motion.div
      className="ai-chat-button-wrapper"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Button
        variant="primary"
        className="ai-chat-button rounded-circle p-3"
        onClick={onToggle}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          width: '60px',
          height: '60px',
          position: 'relative'
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <FaTimes size={20} /> : <FaRobot size={20} />}
        </motion.div>
        
        {/* مؤشر النبض */}
        {!isOpen && (
          <motion.div
            className="pulse-indicator"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              width: '20px',
              height: '20px',
              background: '#00ffcc',
              borderRadius: '50%',
              border: '3px solid white'
            }}
          />
        )}
      </Button>
    </motion.div>
  );
};

export default AIChatButton;