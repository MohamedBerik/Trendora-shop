import React from 'react';
import { motion } from 'framer-motion';
import { Button } from 'react-bootstrap';
import { FaHashtag } from 'react-icons/fa';

const BlogCategories = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="blog-categories mb-4"
    >
      <div className="d-flex align-items-center gap-2 mb-3">
        <FaHashtag className="text-primary" />
        <h6 className="mb-0 fw-bold">التصنيفات</h6>
      </div>
      
      <div className="d-flex flex-wrap gap-2">
        <Button
          variant={activeCategory === 'all' ? 'primary' : 'outline-primary'}
          size="sm"
          onClick={() => onCategoryChange('all')}
          className="fw-semibold"
        >
          الكل
        </Button>
        
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant={activeCategory === category.slug ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => onCategoryChange(category.slug)}
              className="fw-semibold d-flex align-items-center gap-1"
            >
              {category.name}
              <span className="badge bg-light text-dark ms-1">
                {category.count}
              </span>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BlogCategories;