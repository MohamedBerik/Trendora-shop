import React from 'react';
import { motion } from 'framer-motion';
import { FaFire, FaHashtag, FaCalendar, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BlogSidebar = ({ categories, popularPosts, activeCategory, onCategoryChange }) => {
  const navigate = useNavigate();

  return (
    <div className="blog-sidebar-content">
      {/* فئات المدونة */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="sidebar-widget"
      >
        <h5 className="sidebar-title d-flex align-items-center gap-2">
          <FaHashtag />
          فئات المدونة
        </h5>
        <div className="category-list">
          <div 
            className={`category-item ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => onCategoryChange('all')}
          >
            <span>جميع المقالات</span>
            <span className="badge bg-primary rounded-pill">
              {categories.reduce((total, cat) => total + cat.count, 0)}
            </span>
          </div>
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`category-item ${activeCategory === category.slug ? 'active' : ''}`}
              onClick={() => onCategoryChange(category.slug)}
            >
              <span>{category.name}</span>
              <span className="badge bg-light text-dark rounded-pill">
                {category.count}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* المقالات الشائعة */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="sidebar-widget"
      >
        <h5 className="sidebar-title d-flex align-items-center gap-2">
          <FaFire className="text-warning" />
          المقالات الشائعة
        </h5>
        <div className="popular-posts-list">
          {popularPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="popular-post"
              onClick={() => navigate(`/blog/${post.slug || post.id}`)}
            >
              <img
                src={post.image}
                alt={post.title}
                className="popular-post-image"
              />
              <div className="popular-post-content">
                <div className="popular-post-title">
                  {post.title}
                </div>
                <div className="popular-post-meta d-flex align-items-center gap-2">
                  <FaCalendar size={12} />
                  <span>{post.date}</span>
                  <FaEye size={12} />
                  <span>{post.views} مشاهدة</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* إعلان أو دعوة للعمل */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="sidebar-widget"
      >
        <div className="promo-banner text-center p-4 rounded-3"
             style={{
               background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
               color: 'white'
             }}>
          <h6 className="fw-bold mb-2">انضم إلى مجتمعنا</h6>
          <p className="small mb-3 opacity-90">
            احصل على آخر المقالات والعروض مباشرة في بريدك
          </p>
          <button 
            className="btn btn-light btn-sm fw-bold"
            onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })}
          >
            اشترك الآن
          </button>
        </div>
      </motion.div>

      {/* الوسوم الشائعة */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="sidebar-widget"
      >
        <h5 className="sidebar-title">الوسوم الشائعة</h5>
        <div className="tags-cloud">
          {['موضة', 'تكنولوجيا', 'تسوق', 'عروض', 'نصائح', 'جمال', 'منزل', 'صحة'].map(tag => (
            <span
              key={tag}
              className="tag badge bg-outline-primary text-primary me-1 mb-1"
              style={{
                cursor: 'pointer',
                border: '1px solid #667eea',
                padding: '6px 12px',
                fontSize: '0.8rem'
              }}
              onClick={() => onCategoryChange(tag)}
            >
              #{tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BlogSidebar;