import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaGift,
  FaStar,
  FaShippingFast,
  FaShieldAlt,
  FaRocket,
  FaCheckCircle
} from "react-icons/fa";

// ✅ استيراد useAnalytics
import { useAnalytics } from "../hooks/hooks-exports";

function CTA({ onSectionView }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);

  // ✅ استخدام useAnalytics
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    
    // ✅ تتبع عرض قسم CTA
    onSectionView('cta');
    trackEvent('cta_section_view', {
      section: 'call_to_action',
      timestamp: new Date().toISOString()
    });
    
    return () => clearTimeout(timer);
  }, [onSectionView, trackEvent]);

  // ✅ تتبع النقر على Get Started
  const handleSignUp = () => {
    trackEvent('cta_get_started_click', {
      button_type: 'primary',
      section: 'home_page_bottom',
      source: 'cta_section',
      timestamp: new Date().toISOString()
    });
    navigate("/signup");
  };

  // ✅ تتبع الاشتراك في النشرة
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // ✅ تتبع محاولة الاشتراك
      trackEvent('newsletter_subscribe_attempt', {
        email_length: email.length,
        source: 'home_page_cta',
        has_welcome_bonus: true,
        timestamp: new Date().toISOString()
      });

      // محاكاة الاشتراك الناجح
      setIsSubscribed(true);
      
      // ✅ تتبع الاشتراك الناجح
      trackEvent('newsletter_subscribe_success', {
        email_domain: email.split('@')[1],
        source: 'home_page_cta',
        welcome_bonus_claimed: true,
        timestamp: new Date().toISOString()
      });
      
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 4000);
    } else {
      // ✅ تتبع فشل الاشتراك
      trackEvent('newsletter_subscribe_failed', {
        reason: 'empty_email',
        source: 'home_page_cta',
        timestamp: new Date().toISOString()
      });
    }
  };

  // ✅ تتبع عرض/إخفاء المزايا
  const handleBenefitsToggle = (isShowing) => {
    setShowBenefits(isShowing);
    trackEvent('benefits_section_toggle', {
      action: isShowing ? 'show' : 'hide',
      section: 'cta',
      timestamp: new Date().toISOString()
    });
  };

  // ✅ تتبع النقر على المزايا
  const handleBenefitClick = (benefit) => {
    trackEvent('benefit_click', {
      benefit_type: benefit.text,
      benefit_subtext: benefit.subtext,
      section: 'cta',
      timestamp: new Date().toISOString()
    });
  };

  // ✅ تتبع النقر على الإحصائيات
  const handleStatClick = (stat) => {
    trackEvent('stat_click', {
      stat_label: stat.label,
      stat_value: stat.number,
      section: 'cta',
      timestamp: new Date().toISOString()
    });
  };

  const benefits = [
    { 
      icon: <FaGift />, 
      text: "Welcome Bonus", 
      subtext: "10% off first order",
      type: "welcome_bonus"
    },
    { 
      icon: <FaStar />, 
      text: "Exclusive Deals", 
      subtext: "Member-only offers",
      type: "exclusive_deals"
    },
    { 
      icon: <FaShippingFast />, 
      text: "Free Shipping", 
      subtext: "On orders over $50",
      type: "free_shipping"
    },
    { 
      icon: <FaShieldAlt />, 
      text: "Early Access", 
      subtext: "New collections first",
      type: "early_access"
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Members", type: "members" },
    { number: "4.9★", label: "Customer Rating", type: "rating" },
    { number: "24/7", label: "Support", type: "support" },
    { number: "100%", label: "Secure", type: "security" }
  ];

                        {/* تتبع مشاهدة رسالة النجاح */}
                        {useEffect(() => {
                          trackEvent('newsletter_success_message_view', {
                            source: 'home_page_cta',
                            timestamp: new Date().toISOString()
                          });
                        }, [])}

  return (
    <section className="py-5 position-relative overflow-hidden">
      {/* Background with Gradient */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
          backgroundSize: "200% 200%",
          animation: "gradientShift 8s ease infinite"
        }}
      />
     
      {/* Animated Background Elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="position-absolute"
          style={{ top: '10%', left: '5%', fontSize: '60px' }}
        >
          🎯
        </motion.div>
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="position-absolute"
          style={{ top: '60%', right: '10%', fontSize: '80px' }}
        >
          ⚡
        </motion.div>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="position-absolute"
          style={{ bottom: '20%', left: '15%', fontSize: '50px' }}
        >
          ✨
        </motion.div>
      </div>

      <Container className="position-relative" style={{ zIndex: 2 }}>
        <Row className="align-items-center">
          {/* Main Content */}
          <Col lg={6} className="mb-4 mb-lg-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Badge */}
              <motion.span
                initial={{ scale: 0 }}
                animate={isVisible ? { scale: 1 } : {}}
                transition={{ delay: 0.2, type: "spring" }}
                className="badge mb-3 px-3 py-2 fw-semibold"
                style={{
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  color: "white",
                  fontSize: "0.9rem",
                  border: "1px solid rgba(255,255,255,0.3)",
                  cursor: 'pointer'
                }}
                onClick={() => {
                  trackEvent('cta_badge_click', {
                    badge_type: 'limited_time_offer',
                    section: 'cta',
                    timestamp: new Date().toISOString()
                  });
                }}
              >
                <FaRocket className="me-2" />
                Limited Time Offer
              </motion.span>

              {/* Heading */}
              <h2 className="display-5 fw-bold text-white mb-3" style={{ lineHeight: '1.2' }}>
                Ready to Transform Your{" "}
                <span
                  style={{
                    background: "linear-gradient(45deg, #ffd700, #ffed4e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  Shopping Experience?
                </span>
              </h2>

              {/* Description */}
              <p className="fs-5 text-white-80 mb-4" style={{ lineHeight: '1.6', opacity: 0.9 }}>
                Join thousands of satisfied customers who trust Trendora for quality products,
                exclusive deals, and exceptional service. Your perfect shopping journey starts here.
              </p>

              {/* Stats */}
              <motion.div
                className="row g-3 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
              >
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="col-6 col-sm-3"
                    onClick={() => handleStatClick(stat)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="text-center text-white">
                      <div className="h4 fw-bold mb-1">{stat.number}</div>
                      <div className="small opacity-80">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <div className="d-flex flex-wrap gap-3 mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignUp}
                  className="btn btn-light btn-lg px-4 py-3 fw-semibold d-flex align-items-center gap-2"
                  style={{
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    color: '#667eea'
                  }}
                >
                  Get Started Free
                  <FaArrowRight />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBenefitsToggle(!showBenefits)}
                  className="btn btn-outline-light btn-lg px-4 py-3 fw-semibold"
                  style={{
                    borderRadius: '12px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {showBenefits ? 'Hide Benefits' : 'View Benefits'}
                </motion.button>
              </div>
            </motion.div>
          </Col>

          {/* Benefits & Newsletter */}
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              {/* Benefits Grid */}
              <AnimatePresence>
                {showBenefits && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <div className="row g-3">
                      {benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="col-sm-6"
                          onClick={() => handleBenefitClick(benefit)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div
                            className="p-3 rounded-3 h-100 text-white"
                            style={{
                              background: 'rgba(255,255,255,0.1)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255,255,255,0.2)'
                            }}
                          >
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="fs-4"
                                style={{
                                  background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text'
                                }}
                              >
                                {benefit.icon}
                              </div>
                              <div>
                                <div className="fw-semibold">{benefit.text}</div>
                                <div className="small opacity-80">{benefit.subtext}</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Newsletter Subscription */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="card border-0 shadow-lg"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px'
                }}
              >
                <div className="card-body p-4">
                  <AnimatePresence mode="wait">
                    {isSubscribed ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-center py-3"
                      >
                        <FaCheckCircle className="text-success mb-3" size={48} />
                        <h5 className="fw-bold text-dark mb-2">Welcome to Trendora!</h5>
                        <p className="text-muted mb-0">
                          Check your email for your welcome bonus and exclusive offers.
                        </p>
                        

                      </motion.div>
                    ) : (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <h5 className="fw-bold text-dark mb-3">
                          🎁 Get Your Welcome Bonus!
                        </h5>
                        <p className="text-muted mb-3">
                          Enter your email to receive 10% off your first order and exclusive member benefits.
                        </p>
                       
                        <form onSubmit={handleSubscribe} className="mb-3">
                          <div className="input-group input-group-lg">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                // تتبع كتابة البريد الإلكتروني
                                if (e.target.value.length > 0) {
                                  trackEvent('newsletter_email_input', {
                                    input_length: e.target.value.length,
                                    has_value: e.target.value.length > 0,
                                    timestamp: new Date().toISOString()
                                  });
                                }
                              }}
                              className="form-control border-0"
                              placeholder="Enter your email address"
                              style={{
                                background: '#f8f9fa',
                                borderRadius: '12px 0 0 12px'
                              }}
                              required
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="submit"
                              className="btn btn-primary border-0 px-4"
                              style={{
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                borderRadius: '0 12px 12px 0'
                              }}
                            >
                              Claim Offer
                            </motion.button>
                          </div>
                        </form>

                        <div className="d-flex align-items-center gap-2 text-muted small">
                          <FaShieldAlt size={12} />
                          <span>We respect your privacy. Unsubscribe at any time.</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 }}
                className="text-center mt-4"
              >
                <div className="d-flex justify-content-center gap-4 flex-wrap text-white-80 small">
                  {["🔒 Secure Signup", "🚀 Instant Access", "💬 24/7 Support", "💰 No Credit Card"].map((item, index) => (
                    <span
                      key={index}
                      onClick={() => {
                        trackEvent('trust_indicator_click', {
                          indicator: item,
                          section: 'cta',
                          timestamp: new Date().toISOString()
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* CSS Animations */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
       
        .text-white-80 {
          color: rgba(255, 255, 255, 0.8);
        }
       
        .card {
          transition: all 0.3s ease;
        }
       
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
       
        .btn-light {
          transition: all 0.3s ease;
        }
       
        .btn-light:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255,255,255,0.3);
        }

        /* تحسينات للتفاعل */
        .benefit-item:hover {
          background: rgba(255,255,255,0.15) !important;
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }

        .trust-indicator:hover {
          opacity: 1 !important;
          transform: scale(1.1);
          transition: all 0.2s ease;
        }
      `}</style>
    </section>
  );
}

export default CTA;