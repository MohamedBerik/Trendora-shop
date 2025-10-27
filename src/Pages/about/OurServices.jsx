import React from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { 
  FaShippingFast, 
  FaShieldAlt, 
  FaHeadset, 
  FaExchangeAlt,
  FaGift,
  FaCreditCard,
  FaUndo,
  FaAward
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../styles/Page.css';

const OurServices = () => {
  const services = [
    {
      icon: <FaShippingFast />,
      title: 'Fast Shipping',
      description: 'Free shipping on orders over $50. Express delivery available.',
      features: ['2-5 Business Days', 'Free Over $50', 'Real-time Tracking']
    },
    {
      icon: <FaShieldAlt />,
      title: 'Quality Guarantee',
      description: '30-day money-back guarantee on all products.',
      features: ['30-Day Return', 'Quality Checked', 'Warranty Included']
    },
    {
      icon: <FaHeadset />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs.',
      features: ['24/7 Availability', 'Expert Assistance', 'Multiple Channels']
    },
    {
      icon: <FaExchangeAlt />,
      title: 'Easy Returns',
      description: 'Hassle-free returns and exchanges within 30 days.',
      features: ['No Questions Asked', 'Free Returns', 'Quick Processing']
    },
    {
      icon: <FaGift />,
      title: 'Gift Services',
      description: 'Special gift wrapping and personalized messages.',
      features: ['Gift Wrapping', 'Personalized Cards', 'Surprise Delivery']
    },
    {
      icon: <FaCreditCard />,
      title: 'Secure Payment',
      description: 'Multiple secure payment options for your convenience.',
      features: ['SSL Encrypted', 'Multiple Methods', 'Safe & Secure']
    }
  ];

  const premiumServices = [
    {
      title: 'VIP Membership',
      price: '$99/year',
      features: [
        'Free Express Shipping',
        'Early Access to Sales',
        'Personal Shopper',
        'Exclusive Discounts'
      ],
      popular: true
    },
    {
      title: 'Business Account',
      price: 'Custom',
      features: [
        'Bulk Order Discounts',
        'Dedicated Account Manager',
        'Flexible Payment Terms',
        'Priority Support'
      ],
      popular: false
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={8} className="mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="display-4 fw-bold text-white mb-4">
                  Exceptional Services
                </h1>
                <p className="lead text-white mb-4">
                  We go beyond just selling products. Our comprehensive services 
                  are designed to provide you with the best shopping experience 
                  from start to finish.
                </p>
                <Button variant="light" size="lg" as={Link} to="/products">
                  Explore Products
                </Button>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Services */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="fw-bold mb-3">Our Services</h2>
                <p className="text-muted lead">
                  Everything you need for a seamless shopping experience
                </p>
              </motion.div>
            </Col>
          </Row>
          <Row className="g-4">
            {services.map((service, index) => (
              <Col lg={4} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-sm h-100 service-card">
                    <Card.Body className="p-4 text-center">
                      <div className="service-icon mb-4">
                        {service.icon}
                      </div>
                      <h4 className="fw-bold mb-3">{service.title}</h4>
                      <p className="text-muted mb-4">{service.description}</p>
                      <div className="service-features">
                        {service.features.map((feature, idx) => (
                          <Badge 
                            key={idx}
                            bg="outline-primary" 
                            className="me-2 mb-2 feature-badge"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="fw-bold mb-3">How It Works</h2>
                <p className="text-muted lead">
                  Simple steps to get what you need
                </p>
              </motion.div>
            </Col>
          </Row>
          <Row className="g-4">
            <Col lg={3} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="step-number">1</div>
                <h5 className="fw-bold mt-3">Browse & Select</h5>
                <p className="text-muted">Explore our wide range of products and add to cart</p>
              </motion.div>
            </Col>
            <Col lg={3} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center"
              >
                <div className="step-number">2</div>
                <h5 className="fw-bold mt-3">Checkout</h5>
                <p className="text-muted">Secure payment with multiple options available</p>
              </motion.div>
            </Col>
            <Col lg={3} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <div className="step-number">3</div>
                <h5 className="fw-bold mt-3">Fast Delivery</h5>
                <p className="text-muted">Quick shipping with real-time tracking</p>
              </motion.div>
            </Col>
            <Col lg={3} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center"
              >
                <div className="step-number">4</div>
                <h5 className="fw-bold mt-3">Enjoy & Support</h5>
                <p className="text-muted">24/7 support for any questions or returns</p>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Premium Services */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="fw-bold mb-3">Premium Services</h2>
                <p className="text-muted lead">
                  Upgrade your experience with our exclusive services
                </p>
              </motion.div>
            </Col>
          </Row>
          <Row className="g-4 justify-content-center">
            {premiumServices.map((service, index) => (
              <Col lg={5} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className={`border-0 shadow h-100 premium-card ${service.popular ? 'popular' : ''}`}>
                    {service.popular && (
                      <div className="popular-badge">Most Popular</div>
                    )}
                    <Card.Body className="p-4 text-center">
                      <h4 className="fw-bold mb-3">{service.title}</h4>
                      <h3 className="text-primary fw-bold mb-4">{service.price}</h3>
                      <ul className="list-unstyled mb-4">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="mb-2">
                            <FaAward className="text-success me-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button 
                        variant={service.popular ? "primary" : "outline-primary"}
                        size="lg"
                        className="w-100"
                      >
                        Get Started
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="fw-bold mb-3">Frequently Asked Questions</h2>
              </motion.div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col lg={8}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold">What is your return policy?</h5>
                    <p className="text-muted mb-4">
                      We offer a 30-day money-back guarantee on all products. If you're not satisfied, 
                      you can return the item for a full refund.
                    </p>

                    <h5 className="fw-bold">Do you offer international shipping?</h5>
                    <p className="text-muted mb-4">
                      Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times 
                      vary by location.
                    </p>

                    <h5 className="fw-bold">How can I track my order?</h5>
                    <p className="text-muted mb-4">
                      Once your order ships, you'll receive a tracking number via email. You can also 
                      track your order from your account dashboard.
                    </p>

                    <h5 className="fw-bold">What payment methods do you accept?</h5>
                    <p className="text-muted mb-0">
                      We accept all major credit cards, PayPal, Apple Pay, Google Pay, and bank transfers 
                      for certain orders.
                    </p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      <style>{`
        .services-page {
          overflow-x: hidden;
        }

        .services-hero-section {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          padding: 100px 0;
          position: relative;
        }

        .service-card {
          transition: all 0.3s ease;
          border-radius: 15px;
        }

        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.1) !important;
        }

        .service-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #f093fb, #f5576c);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: white;
          font-size: 2rem;
        }

        .feature-badge {
          border: 1px solid #667eea;
          color: #667eea;
          background: transparent;
          border-radius: 20px;
          padding: 0.5em 1em;
          font-size: 0.8rem;
        }

        .step-number {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .premium-card {
          transition: all 0.3s ease;
          border-radius: 20px;
          position: relative;
          border: 2px solid transparent;
        }

        .premium-card.popular {
          border-color: #667eea;
          transform: scale(1.05);
        }

        .premium-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.15) !important;
        }

        .premium-card.popular:hover {
          transform: scale(1.05) translateY(-5px);
        }

        .popular-badge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: #667eea;
          color: white;
          padding: 0.5em 1.5em;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .services-hero-section {
            padding: 60px 0;
          }

          .display-4 {
            font-size: 2.5rem;
          }

          .premium-card.popular {
            transform: none;
          }

          .premium-card.popular:hover {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
};

export default OurServices;