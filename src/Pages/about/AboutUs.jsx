import React from "react";
import { motion } from "framer-motion";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaRocket, FaUsers, FaAward, FaHeart, FaShoppingBag, FaGlobe, FaShieldAlt, FaLeaf } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../styles/Page.css";
import analyticsService from '../../services/analyticsService';

const AboutUs = () => {
  const stats = [
    { number: "50K+", label: "Happy Customers", icon: <FaUsers /> },
    { number: "1000+", label: "Products", icon: <FaShoppingBag /> },
    { number: "50+", label: "Brands", icon: <FaAward /> },
    { number: "5+", label: "Years Experience", icon: <FaRocket /> },
  ];

  const values = [
    {
      icon: <FaHeart />,
      title: "Customer First",
      description: "We prioritize our customers needs and satisfaction above.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Quality Assurance",
      description: "Every product is carefully selected and quality tested.",
    },
    {
      icon: <FaLeaf />,
      title: "Sustainability",
      description: "We are committed to environmentally practices.",
    },
    {
      icon: <FaGlobe />,
      title: "Global Reach",
      description: "Serving customers worldwide with fast delivery.",
    },
  ];

  const team = [
    {
      name: "Emily Davis",
      role: "CEO & Founder",
      image: "/assets/img/Amy-Jo-Lawley-e1689173212925.jpg",
      description: "Passionate about creating the best shopping experience.",
    },
    {
      name: "Mike Chen",
      role: "Head of Operations",
      image: "/assets/img/businessman-high-quality-image_1252102-38452.jpg",
      description: "Ensuring smooth operations and customer satisfaction.",
    },
    {
      name: "Sam Johnson",
      role: "Product Curator",
      image: "/assets/img/ai-generative-happy-business-man-in-a-suit-white-transparent-background-free-photo.jpg",
      description: "Expert in selecting the finest products for our customers.",
    },
    {
      name: "Suzanne Wilson",
      role: "Customer Success",
      image: "/assets/img/istockphoto-1486113550-170667a.jpg",
      description: "Dedicated to providing exceptional customer support.",
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6}>
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <h1 className="display-4 fw-bold text-white mb-4">Our Story</h1>
                <p className="lead text-white mb-4">Founded in 2018, we started as a small boutique and grew into a trusted online destination for quality products and exceptional customer service. Our journey is built on passion, dedication, and a commitment to excellence.</p>
                <div className="d-flex gap-3">
                  <Button variant="light" size="lg" as={Link} to="/products">
                    Shop Now
                  </Button>
                  <Button variant="outline-light" size="lg" as={Link} to="/contact">
                    Contact Us
                  </Button>
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-center">
                <img
                  src="/assets/img/team.jpg"
                  alt="About Us"
                  className="img-fluid rounded-3 shadow-lg"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY3ZWVhIi8+PHRleHQgeD0iMzAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+T3VyIFN0b3J5PC90ZXh0Pjwvc3ZnPg==";
                  }}
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="g-4">
            {stats.map((stat, index) => (
              <Col lg={3} md={6} key={index}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="text-center">
                  <div className="stat-icon mb-3">{stat.icon}</div>
                  <h2 className="fw-bold text-primary">{stat.number}</h2>
                  <p className="text-muted mb-0">{stat.label}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-5">
        <Container>
          <Row className="g-5">
            <Col lg={6}>
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <h2 className="fw-bold mb-4">Our Mission</h2>
                <p className="fs-5 text-muted mb-4">To provide exceptional quality products that enhance our customers lives while maintaining the highest standards of service and sustainability.</p>
                <ul className="list-unstyled fs-6">
                  <li className="mb-2">✅ Quality products at affordable prices</li>
                  <li className="mb-2">✅ Sustainable and ethical practices</li>
                  <li className="mb-2">✅ Exceptional customer service</li>
                  <li className="mb-2">✅ Continuous innovation and improvement</li>
                </ul>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <h2 className="fw-bold mb-4">Our Vision</h2>
                <p className="fs-5 text-muted mb-4">To become the most trusted and loved online shopping destination, creating meaningful connections with our customers and communities worldwide.</p>
                <div className="bg-primary text-white p-4 rounded-3">
                  <h5 className="fw-bold">"Excellence is not a skill, it's an attitude."</h5>
                  <p className="mb-0">- Our Philosophy</p>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h2 className="fw-bold mb-3">Our Values</h2>
                <p className="text-muted lead">The principles that guide everything we do</p>
              </motion.div>
            </Col>
          </Row>
          <Row className="g-4">
            {values.map((value, index) => (
              <Col lg={3} md={6} key={index}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Card className="border-0 shadow-sm h-100 text-center value-card">
                    <Card.Body className="p-4">
                      <div className="value-icon mb-3">{value.icon}</div>
                      <h5 className="fw-bold mb-3">{value.title}</h5>
                      <p className="text-muted mb-0">{value.description}</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Team Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h2 className="fw-bold mb-3">Meet Our Team</h2>
                <p className="text-muted lead">The passionate people behind our success</p>
              </motion.div>
            </Col>
          </Row>
          <Row className="g-4">
            {team.map((member, index) => (
              <Col lg={3} md={6} key={index}>
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Card className="border-0 shadow-sm h-100 team-card">
                    <div className="team-image-wrapper">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="team-image"
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iMTUwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvZmlsZSBJbWFnZTwvdGV4dD48L3N2Zz4=";
                        }}
                      />
                    </div>
                    <Card.Body className="text-center p-4">
                      <h5 className="fw-bold mb-1">{member.name}</h5>
                      <p className="text-primary mb-2">{member.role}</p>
                      <p className="text-muted small">{member.description}</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="text-center">
            <Col>
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h2 className="fw-bold mb-3">Ready to Shop With Us?</h2>
                <p className="lead mb-4">Join thousands of satisfied customers and discover why we're different</p>
                <Button variant="light" size="lg" as={Link} to="/products">
                  Start Shopping Now
                </Button>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      <style>{`
        .about-page {
          overflow-x: hidden;
        }

        .about-hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 100px 0;
          position: relative;
        }

        .stat-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: white;
          font-size: 2rem;
        }

        .value-card {
          transition: all 0.3s ease;
          border-radius: 15px;
        }

        .value-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.1) !important;
        }

        .value-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: white;
          font-size: 1.5rem;
        }

        .team-card {
          transition: all 0.3s ease;
          border-radius: 15px;
          overflow: hidden;
        }

        .team-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.1) !important;
        }

        .team-image-wrapper {
          height: 250px;
          overflow: hidden;
        }

        .team-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .team-card:hover .team-image {
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .about-hero-section {
            padding: 60px 0;
            text-align: center;
          }

          .display-4 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
