import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button } from 'react-bootstrap';
import { FaCalendar, FaUser, FaComments, FaEye, FaShare, FaHeart,FaArrowRight  } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BlogPost = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const navigate = useNavigate();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleReadMore = () => {
    navigate(`/blog/${post.slug}`);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="blog-post-card"
    >
      <Card className="h-100 border-0 shadow-sm">
        {/* الصورة */}
        <div className="post-image-wrapper">
          <Card.Img 
            variant="top" 
            src={post.image} 
            alt={post.title}
            className="post-image"
          />
          <div className="post-overlay">
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleReadMore}
              className="read-more-btn"
            >
              اقرأ المزيد
            </Button>
          </div>
          <Badge bg="primary" className="category-badge">
            {post.category}
          </Badge>
        </div>

        <Card.Body className="d-flex flex-column">
          {/* التصنيفات */}
          <div className="post-tags mb-2">
            {post.tags.slice(0, 3).map(tag => (
              <Badge 
                key={tag} 
                bg="outline-primary" 
                text="primary" 
                className="me-1 mb-1"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          {/* العنوان */}
          <Card.Title 
            className="post-title h5"
            onClick={handleReadMore}
            style={{ cursor: 'pointer' }}
          >
            {post.title}
          </Card.Title>

          {/* الملخص */}
          <Card.Text className="post-excerpt text-muted flex-grow-1">
            {post.excerpt}
          </Card.Text>

          {/* الميتاداتا */}
          <div className="post-meta mt-auto">
            <div className="d-flex justify-content-between align-items-center text-muted small">
              <div className="d-flex gap-3">
                <span className="d-flex align-items-center gap-1">
                  <FaCalendar size={12} />
                  {post.date}
                </span>
                <span className="d-flex align-items-center gap-1">
                  <FaUser size={12} />
                  {post.author}
                </span>
              </div>
              <div className="d-flex gap-3">
                <span 
                  className={`d-flex align-items-center gap-1 ${isLiked ? 'text-danger' : ''}`}
                  onClick={handleLike}
                  style={{ cursor: 'pointer' }}
                >
                  <FaHeart size={12} />
                  {likes}
                </span>
                <span className="d-flex align-items-center gap-1">
                  <FaComments size={12} />
                  {post.comments}
                </span>
                <span className="d-flex align-items-center gap-1">
                  <FaEye size={12} />
                  {post.views}
                </span>
              </div>
            </div>
          </div>

          {/* زر المشاركة */}
          <div className="post-actions mt-3 pt-3 border-top">
            <div className="d-flex justify-content-between align-items-center">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={handleReadMore}
                className="d-flex align-items-center gap-2"
              >
                اقرأ المزيد
                <FaArrowRight size={12} />
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm"
                className="d-flex align-items-center gap-2"
              >
                <FaShare size={12} />
                مشاركة
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default BlogPost;