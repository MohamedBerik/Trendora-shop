import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaEnvelope, FaCheck, FaRocket } from 'react-icons/fa';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // محاكاة عملية الاشتراك
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="newsletter-section"
      id="newsletter"
    >
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="newsletter-content">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="newsletter-icon mb-3"
              >
                <FaEnvelope size={48} />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="fw-bold mb-3"
              >
                انضم إلى قائمة بريدنا
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lead mb-4 opacity-90"
              >
                احصل على أحدث المقالات، نصائح التسوق، والعروض الحصرية مباشرة في بريدك الإلكتروني
              </motion.p>

              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="success-message text-center"
                >
                  <Alert variant="success" className="d-inline-flex align-items-center gap-2">
                    <FaCheck className="text-success" />
                    <span className="fw-bold">تم الاشتراك بنجاح!</span>
                    شكراً لك، سنرسل لك آخر التحديثات قريباً.
                  </Alert>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="newsletter-form"
                >
                  <Form onSubmit={handleSubmit}>
                    <div className="d-flex gap-2 flex-column flex-md-row">
                      <Form.Control
                        type="email"
                        placeholder="بريدك الإلكتروني"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        size="lg"
                        className="flex-fill border-0 shadow-sm"
                        style={{ borderRadius: '12px' }}
                      />
                      <Button
                        type="submit"
                        variant="warning"
                        size="lg"
                        disabled={isLoading}
                        className="fw-bold d-flex align-items-center gap-2 border-0"
                        style={{ borderRadius: '12px', minWidth: '140px' }}
                      >
                        {isLoading ? (
                          <>
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">جاري الاشتراك...</span>
                            </div>
                            جاري الاشتراك...
                          </>
                        ) : (
                          <>
                            <FaRocket />
                            اشترك الآن
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="small text-center mt-3 opacity-75"
                  >
                    نحن نحترم خصوصيتك. لن نشارك بريدك مع أي طرف ثالث.
                  </motion.p>
                </motion.div>
              )}

              {/* إحصائيات الاشتراكات */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="newsletter-stats mt-4"
              >
                <Row className="justify-content-center text-center">
                  <Col xs="auto">
                    <div className="stat-item">
                      <div className="stat-number fw-bold">5,247+</div>
                      <div className="stat-label">مشترك</div>
                    </div>
                  </Col>
                  <Col xs="auto">
                    <div className="stat-item">
                      <div className="stat-number fw-bold">98%</div>
                      <div className="stat-label">رضا العملاء</div>
                    </div>
                  </Col>
                  <Col xs="auto">
                    <div className="stat-item">
                      <div className="stat-number fw-bold">24/7</div>
                      <div className="stat-label">دعم فني</div>
                    </div>
                  </Col>
                </Row>
              </motion.div>
            </div>
          </Col>
        </Row>
      </Container>
    </motion.section>
  );
};

export default Newsletter;