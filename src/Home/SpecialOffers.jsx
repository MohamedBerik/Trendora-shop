import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaClock, FaFire, FaArrowRight, FaTag, FaShoppingBag } from "react-icons/fa";

// ✅ استيراد useAnalytics
import { useAnalytics } from "../hooks/hooks-exports";

function SpecialOffers({ onSectionView }) {
  const [darkMode, setDarkMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 12,
    minutes: 30,
    seconds: 0
  });

  const navigate = useNavigate();
  
  // ✅ استخدام useAnalytics
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);

    // ✅ تتبع عرض قسم العروض الخاصة
    onSectionView('special_offers');
    trackEvent('special_offers_section_view', {
      offers_count: offers.length,
      timestamp: new Date().toISOString()
    });

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { days, hours, minutes, seconds } = prev;
       
        if (seconds > 0) return { ...prev, seconds: seconds - 1 };
        if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0) return { ...prev, days: days - 1, hours: 23, minutes: 59, seconds: 59 };
       
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onSectionView, trackEvent]);

  const offers = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop",
      title: "Summer Mega Sale",
      desc: "Enjoy massive discounts up to 60% on premium collections. Limited time only!",
      link: "/products?category=summer-sale",
      discount: 60,
      gradient: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
      badge: "HOT DEAL",
      icon: <FaFire />,
      timer: true,
      products: 124,
      bgPattern: "🔥"
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      title: "New Arrivals Collection",
      desc: "Be the first to explore our latest trends and fresh styles for the season",
      link: "/products?category=new-arrivals",
      discount: 25,
      gradient: "linear-gradient(135deg, #4ECDC4, #44A08D)",
      badge: "NEW",
      icon: <FaTag />,
      timer: false,
      products: 89,
      bgPattern: "✨"
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=300&fit=crop",
      title: "Flash Sale Weekend",
      desc: "Weekend exclusive offers with extra 15% off on already discounted items",
      link: "/products?category=flash-sale",
      discount: 45,
      gradient: "linear-gradient(135deg, #A166AB, #5073B8)",
      badge: "FLASH",
      icon: <FaClock />,
      timer: true,
      products: 67,
      bgPattern: "⚡"
    }
  ];

  // ✅ تتبع النقر على العروض
  const handleOfferClick = useCallback((offer) => {
    trackEvent('special_offer_click', {
      offer_id: offer.id,
      offer_title: offer.title,
      discount_percentage: offer.discount,
      products_count: offer.products,
      has_timer: offer.timer,
      badge_type: offer.badge,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const CountdownTimer = ({ timeLeft, offerId }) => (
    <div className="d-flex justify-content-center gap-2 mb-3">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <motion.div
          key={unit}
          className="text-center"
          whileHover={{ scale: 1.1 }}
          onClick={() => {
            trackEvent('countdown_timer_click', {
              offer_id: offerId,
              time_unit: unit,
              time_value: value,
              timestamp: new Date().toISOString()
            });
          }}
          style={{ cursor: 'pointer' }}
        >
          <div
            className="rounded-3 p-2 mx-1"
            style={{
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              minWidth: '50px'
            }}
          >
            <div className="h5 mb-0 fw-bold text-white">
              {value.toString().padStart(2, '0')}
            </div>
            <div className="small text-white-50 text-uppercase" style={{ fontSize: '0.7rem' }}>
              {unit}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const OfferCard = ({ offer, index }) => (
    <Col key={offer.id} xs={12} md={6} lg={4} className="mb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{
          y: -5,
          transition: { duration: 0.2 }
        }}
        className="h-100"
      >
        <div
          className="position-relative overflow-hidden rounded-4 shadow-lg h-100"
          style={{
            background: offer.gradient,
            cursor: 'pointer',
            minHeight: '420px'
          }}
          onClick={() => handleOfferClick(offer)}
        >
          {/* Background Pattern */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
            style={{
              fontSize: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          >
            {offer.bgPattern}
          </div>

          {/* Content */}
          <div className="position-relative h-100 d-flex flex-column p-4 text-white" style={{ zIndex: 2 }}>
           
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start mb-3">
              <Badge
                className="px-3 py-2 fw-semibold d-flex align-items-center gap-2"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  fontSize: '0.8rem'
                }}
              >
                {offer.icon}
                {offer.badge}
              </Badge>
             
              {/* Discount Circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.2, type: "spring" }}
                className="rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{
                  width: '70px',
                  height: '70px',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#1a1a1a',
                  flexShrink: 0
                }}
              >
                <div className="text-center">
                  <div className="h6 mb-0 fw-bold">-{offer.discount}%</div>
                  <div className="small" style={{ fontSize: '0.6rem' }}>OFF</div>
                </div>
              </motion.div>
            </div>

            {/* Product Image */}
            <motion.div
              className="text-center mb-3 flex-grow-1 d-flex align-items-center justify-content-center"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={offer.img}
                alt={offer.title}
                className="img-fluid rounded-3 shadow"
                style={{
                  maxHeight: '160px',
                  width: 'auto',
                  objectFit: 'contain',
                  border: '3px solid rgba(255,255,255,0.2)'
                }}
                loading="eager"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </motion.div>

            {/* Content */}
            <div className="text-center">
              <h5 className="fw-bold mb-2" style={{
                minHeight: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem'
              }}>
                {offer.title}
              </h5>
              <p className="mb-3 opacity-90" style={{
                lineHeight: '1.4',
                minHeight: '2.8rem',
                fontSize: '0.9rem'
              }}>
                {offer.desc}
              </p>
             
              {/* Products Count */}
              <div className="d-flex align-items-center justify-content-center gap-2 mb-3 small opacity-80">
                <FaShoppingBag />
                <span>{offer.products}+ Products</span>
              </div>

              {/* Countdown Timer */}
              {offer.timer && <CountdownTimer timeLeft={timeLeft} offerId={offer.id} />}

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={offer.link}
                  className="btn btn-light btn-lg fw-semibold px-4 py-2 rounded-pill d-inline-flex align-items-center gap-2"
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: 'none',
                    color: '#1a1a1a',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    trackEvent('special_offer_cta_click', {
                      offer_id: offer.id,
                      offer_title: offer.title,
                      button_type: 'shop_now',
                      timestamp: new Date().toISOString()
                    });
                  }}
                >
                  Shop Now <FaArrowRight />
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Hover Effect */}
          <motion.div
            className="position-absolute top-0 start-0 w-100 h-100"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              backdropFilter: 'blur(5px)',
              borderRadius: '16px',
              pointerEvents: 'none'
            }}
          />
        </div>
      </motion.div>
    </Col>
  );

  return (
    <section
      className="py-5 position-relative overflow-hidden"
      style={{
        background: darkMode
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
          : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        minHeight: 'auto'
      }}
    >
      {/* Background Elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10">
        <div className="position-absolute" style={{ top: '10%', left: '5%', fontSize: '60px' }}>🎁</div>
        <div className="position-absolute" style={{ top: '60%', right: '10%', fontSize: '80px' }}>🎯</div>
        <div className="position-absolute" style={{ bottom: '20%', left: '15%', fontSize: '50px' }}>🔥</div>
      </div>

      <Container className="position-relative" style={{ zIndex: 2 }}>
        {/* Header Section */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="badge mb-3 px-4 py-2 fw-semibold"
            style={{
              background: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
              color: "white",
              fontSize: "0.9rem"
            }}
          >
            🎉 Limited Time Offers
          </span>
          <h2 className="fw-bold mb-3 display-5">
            <span style={{
              background: darkMode
                ? "linear-gradient(135deg, #FF6B6B, #FF8E53)"
                : "linear-gradient(135deg, #FF6B6B, #FF8E53)",
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Special Offers
            </span>
          </h2>
          <p className="fs-6 mx-auto" style={{
            color: darkMode ? '#cbd5e0' : '#64748b',
            maxWidth: '600px'
          }}>
            Don't miss these exclusive deals! Limited time offers with massive discounts on premium collections.
          </p>
        </motion.div>

        {/* Offers Grid */}
        <Row className="justify-content-center">
          {offers.map((offer, index) => (
            <OfferCard key={offer.id} offer={offer} index={index} />
          ))}
        </Row>

        {/* View All Offers */}
        <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            to="/offers"
            className="btn btn-outline-primary btn-lg px-4 py-2 fw-semibold"
            style={{
              borderRadius: "50px",
              borderWidth: "2px",
              color: darkMode ? '#FF6B6B' : '#FF6B6B',
              borderColor: darkMode ? '#FF6B6B' : '#FF6B6B',
              background: 'transparent',
              transition: 'all 0.2s ease',
              fontSize: '0.9rem'
            }}
            onClick={() => {
              trackEvent('view_all_offers_click', {
                source: 'special_offers_section',
                total_offers: offers.length,
                timestamp: new Date().toISOString()
              });
            }}
          >
            View All Offers
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}

export default SpecialOffers;