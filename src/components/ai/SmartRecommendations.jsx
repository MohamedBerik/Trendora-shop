import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { FaStar, FaHeart, FaShoppingCart, FaRobot } from 'react-icons/fa';

const SmartRecommendations = ({ userPreferences = {} }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // محاكاة تحليل التفضيلات وتوليد توصيات
  useEffect(() => {
    const generateRecommendations = async () => {
      setLoading(true);
      
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockRecommendations = [
        {
          id: 1,
          name: 'هاتف ذكي متطور',
          price: 1999,
          originalPrice: 2499,
          image: '/images/products/smartphone.jpg',
          category: 'إلكترونيات',
          rating: 4.8,
          reason: 'بناءً على مشاهداتك الأخيرة'
        },
        {
          id: 2,
          name: 'حذاء رياضي مريح',
          price: 299,
          originalPrice: 399,
          image: '/images/products/shoes.jpg',
          category: 'أحذية',
          rating: 4.5,
          reason: 'يكمل أسلوبك الحالي'
        },
        {
          id: 3,
          name: 'ساعة ذكية',
          price: 899,
          originalPrice: 1199,
          image: '/images/products/smartwatch.jpg',
          category: 'إلكترونيات',
          rating: 4.7,
          reason: 'شائع بين العملاء المشابهين'
        },
        {
          id: 4,
          name: 'قميص قطني أنيق',
          price: 149,
          originalPrice: 199,
          image: '/images/products/shirt.jpg',
          category: 'ملابس',
          rating: 4.3,
          reason: 'يناسب ذوقك في الألوان'
        }
      ];
      
      setRecommendations(mockRecommendations);
      setLoading(false);
    };

    generateRecommendations();
  }, [userPreferences]);

  if (loading) {
    return (
      <div className="smart-recommendations loading">
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
          <p className="mt-2 text-muted">جاري تحليل تفضيلاتك...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="smart-recommendations"
    >
      <div className="d-flex align-items-center mb-4">
        <FaRobot className="text-primary me-2" size={24} />
        <h4 className="mb-0 fw-bold">توصيات مخصصة لك 🤖</h4>
        <Badge bg="primary" className="ms-2">ذكي</Badge>
      </div>

      <Row>
        {recommendations.map((product, index) => (
          <Col lg={3} md={6} key={product.id} className="mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-100 border-0 shadow-sm recommendation-card">
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src={product.image} 
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Badge 
                    bg="success" 
                    className="position-absolute top-0 start-0 m-2"
                  >
                    موصى به
                  </Badge>
                </div>
                
                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    <Badge bg="outline-primary" text="primary" className="small">
                      {product.category}
                    </Badge>
                  </div>
                  
                  <Card.Title className="h6 mb-2">{product.name}</Card.Title>
                  
                  <div className="d-flex align-items-center mb-2">
                    <FaStar className="text-warning me-1" />
                    <span className="small">{product.rating}</span>
                  </div>
                  
                  <div className="price-section mb-2">
                    <span className="h6 text-primary fw-bold">{product.price} ر.س</span>
                    {product.originalPrice && (
                      <span className="text-muted text-decoration-line-through small ms-2">
                        {product.originalPrice} ر.س
                      </span>
                    )}
                  </div>
                  
                  <div className="reason-badge mb-3">
                    <small className="text-muted">{product.reason}</small>
                  </div>
                  
                  <div className="mt-auto d-flex gap-2">
                    <Button variant="outline-primary" size="sm" className="flex-fill">
                      <FaHeart />
                    </Button>
                    <Button variant="primary" size="sm" className="flex-fill">
                      <FaShoppingCart className="me-1" />
                      شراء
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </motion.div>
  );
};

export default SmartRecommendations;