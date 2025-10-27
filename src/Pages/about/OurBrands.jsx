import React from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { 
  FaStar, 
  FaAward, 
  FaShippingFast, 
  FaShieldAlt,
  FaCheckCircle,
  FaRegHeart,
  FaShoppingCart
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../styles/Page.css';

const OurBrands = () => {
  const featuredBrands = [
    {
      name: 'Nike',
      logo: '/assets/img/Nike-Cortez-Tech-Pack-Mens.jpg',
      description: 'Just Do It. Innovative sportswear and athletic shoes.',
      products: '1,200+ Products',
      rating: 4.8,
      category: 'Sportswear'
    },
    {
      name: 'Apple',
      logo: '/assets/img/airpods...jpg',
      description: 'Think Different. Premium electronics and innovative technology.',
      products: '500+ Products',
      rating: 4.9,
      category: 'Electronics'
    },
    {
      name: 'Samsung',
      logo: '/assets/img/headphone...png',
      description: 'Do What You Can\'t. Leading electronics and home appliances.',
      products: '800+ Products',
      rating: 4.7,
      category: 'Electronics'
    },
    {
      name: 'Adidas',
      logo: '/assets/img/pexels-jiaxin-ni-3115349-4932920.jpg',
      description: 'Impossible is Nothing. Sportswear and athletic footwear.',
      products: '900+ Products',
      rating: 4.6,
      category: 'Sportswear'
    }
  ];

  const allBrands = [
    { name: 'Sony', category: 'Electronics', products: 450 },
    { name: 'LG', category: 'Electronics', products: 320 },
    { name: 'Dell', category: 'Computers', products: 280 },
    { name: 'HP', category: 'Computers', products: 310 },
    { name: 'Canon', category: 'Cameras', products: 190 },
    { name: 'Nikon', category: 'Cameras', products: 210 },
    { name: 'Puma', category: 'Sportswear', products: 340 },
    { name: 'Under Armour', category: 'Sportswear', products: 270 },
    { name: 'Levi\'s', category: 'Fashion', products: 380 },
    { name: 'Zara', category: 'Fashion', products: 420 },
    { name: 'H&M', category: 'Fashion', products: 510 },
    { name: 'Uniqlo', category: 'Fashion', products: 290 }
  ];

  const brandCategories = [
    { name: 'Electronics', count: 12, icon: '📱' },
    { name: 'Fashion', count: 8, icon: '👕' },
    { name: 'Sportswear', count: 6, icon: '👟' },
    { name: 'Home & Garden', count: 5, icon: '🏠' },
    { name: 'Beauty', count: 7, icon: '💄' },
    { name: 'Books', count: 4, icon: '📚' }
  ];

  return (
    <div className="brands-page">
      {/* Hero Section */}
      <section className="brands-hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={8} className="mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="display-4 fw-bold text-white mb-4">
                  Trusted Brands
                </h1>
                <p className="lead text-white mb-4">
                  Discover products from the world's most reputable brands. 
                  We partner with industry leaders to bring you quality and innovation.
                </p>
                <Button variant="light" size="lg" as={Link} to="/products">
                  Shop All Brands
                </Button>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Brands */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="fw-bold mb-3">Featured Brands</h2>
                <p className="text-muted lead">
                  Our most popular and trusted brand partners
                </p>
              </motion.div>
            </Col>
          </Row>
          <Row className="g-4">
            {featuredBrands.map((brand, index) => (
              <Col lg={3} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-sm h-100 brand-card">
                    <div className="brand-logo-wrapper">
                      <img 
                        src={brand.logo} 
                        alt={brand.name}
                        className="brand-logo"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iMTAwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CcmFuZCBMb2dvPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                    </div>
                    <Card.Body className="p-4 text-center">
                      <Badge bg="outline-primary" className="mb-3 category-badge">
                        {brand.category}
                      </Badge>
                      <h5 className="fw-bold mb-3">{brand.name}</h5>
                      <p className="text-muted small mb-3">{brand.description}</p>
                      
                      <div className="brand-stats mb-3">
                        <div className="d-flex justify-content-between align-items-center small">
                          <span className="text-muted">Products:</span>
                          <span className="fw-semibold">{brand.products}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center small">
                          <span className="text-muted">Rating:</span>
                          <span className="d-flex align-items-center">
                            <FaStar className="text-warning me-1" />
                            {brand.rating}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="flex-fill"
                          as={Link}
                          to={`/products?brand=${brand.name.toLowerCase()}`}
                        >
                          View Products
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                        >
                          <FaRegHeart />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Brand Categories */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="fw-bold mb-3">Shop by Category</h2>
                <p className="text-muted lead">
                  Find brands in your favorite categories
                </p>
              </motion.div>
            </Col>
          </Row>
          <Row className="g-4">
            {brandCategories.map((category, index) => (
              <Col lg={4} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className="border-0 shadow-sm h-100 category-card"
                    as={Link}
                    to={`/products?category=${category.name.toLowerCase()}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Card.Body className="p-4 text-center">
                      <div className="category-icon mb-3">
                        {category.icon}
                      </div>
                      <h5 className="fw-bold mb-2">{category.name}</h5>
                      <p className="text-muted mb-0">{category.count} Brands</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* All Brands Grid */}
      <section className="py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="fw-bold mb-3">All Brands</h2>
                <p className="text-muted lead">
                  Complete list of our brand partners
                </p>
              </motion.div>
            </Col>
          </Row>
          <Row className="g-3">
            {allBrands.map((brand, index) => (
              <Col lg={2} md={3} sm={4} xs={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card 
                    className="border-0 shadow-sm brand-grid-card text-center"
                    as={Link}
                    to={`/products?brand=${brand.name.toLowerCase()}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Card.Body className="p-3">
                      <h6 className="fw-bold mb-1">{brand.name}</h6>
                      <small className="text-muted d-block">{brand.category}</small>
                      <Badge bg="light" text="dark" className="mt-1">
                        {brand.products}
                      </Badge>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Partnership Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="fw-bold mb-3">Become a Partner Brand</h2>
                <p className="lead mb-4">
                  Join our network of trusted brands and reach millions of customers worldwide. 
                  We offer competitive partnership terms and marketing support.
                </p>
                <div className="d-flex gap-3">
                  <Button variant="light" size="lg">
                    Apply Now
                  </Button>
                  <Button variant="outline-light" size="lg">
                    Learn More
                  </Button>
                </div>
              </motion.div>
            </Col>
            <Col lg={4}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="partnership-benefits">
                  <div className="benefit-item mb-3">
                    <FaAward className="me-2" />
                    <span>Brand Exposure</span>
                  </div>
                  <div className="benefit-item mb-3">
                    <FaShippingFast className="me-2" />
                    <span>Logistics Support</span>
                  </div>
                  <div className="benefit-item mb-3">
                    <FaShieldAlt className="me-2" />
                    <span>Secure Payments</span>
                  </div>
                  <div className="benefit-item">
                    <FaCheckCircle className="me-2" />
                    <span>Quality Assurance</span>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      <style>{`
        .brands-page {
          overflow-x: hidden;
        }

        .brands-hero-section {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          padding: 100px 0;
          position: relative;
        }

        .brand-card {
          transition: all 0.3s ease;
          border-radius: 15px;
          overflow: hidden;
        }

        .brand-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.1) !important;
        }

        .brand-logo-wrapper {
          height: 120px;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .brand-logo {
          max-height: 80px;
          max-width: 80%;
          object-fit: contain;
        }

        .category-badge {
          border: 1px solid #667eea;
          color: #667eea;
          background: transparent;
          border-radius: 15px;
          padding: 0.25em 0.75em;
          font-size: 0.7rem;
        }

        .brand-stats {
          border-top: 1px solid #e9ecef;
          border-bottom: 1px solid #e9ecef;
          padding: 0.75rem 0;
        }

        .category-card {
          transition: all 0.3s ease;
          border-radius: 15px;
          cursor: pointer;
        }

        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.1) !important;
          text-decoration: none;
          color: inherit;
        }

        .category-icon {
          font-size: 3rem;
        }

        .brand-grid-card {
          transition: all 0.3s ease;
          border-radius: 10px;
          cursor: pointer;
        }

        .brand-grid-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
          text-decoration: none;
          color: inherit;
        }

        .partnership-benefits .benefit-item {
          background: rgba(255,255,255,0.1);
          padding: 1rem;
          border-radius: 10px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .brands-hero-section {
            padding: 60px 0;
          }

          .display-4 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default OurBrands;