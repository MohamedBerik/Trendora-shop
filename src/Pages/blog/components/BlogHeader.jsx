import React from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';
import { FaPenFancy, FaNewspaper, FaUsers } from 'react-icons/fa';

const BlogHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="blog-header"
    >
      <Container>
        <Row className="text-center">
          <Col>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="blog-icon mb-3"
            >
              <FaPenFancy size={48} />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="display-4 fw-bold mb-3"
            >
              مدونة تريندورا
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lead mb-4 opacity-90"
            >
              اكتشف أحدث مقالاتنا حول الموضة، التكنولوجيا، نصائح التسوق، وأكثر
            </motion.p>

            {/* إحصائيات */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="blog-stats"
            >
              <Row className="justify-content-center">
                <Col xs="auto">
                  <div className="stat-item">
                    <FaNewspaper size={24} className="mb-2" />
                    <div className="stat-number fw-bold">50+</div>
                    <div className="stat-label">مقالة</div>
                  </div>
                </Col>
                <Col xs="auto">
                  <div className="stat-item">
                    <FaUsers size={24} className="mb-2" />
                    <div className="stat-number fw-bold">10K+</div>
                    <div className="stat-label">قارئ</div>
                  </div>
                </Col>
                <Col xs="auto">
                  <div className="stat-item">
                    <FaPenFancy size={24} className="mb-2" />
                    <div className="stat-number fw-bold">15+</div>
                    <div className="stat-label">كاتب</div>
                  </div>
                </Col>
              </Row>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default BlogHeader;