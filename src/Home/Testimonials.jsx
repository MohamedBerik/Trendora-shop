import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectCards, EffectCreative } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaQuoteLeft,
  FaQuoteRight,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaShare,
  FaHeart,
  FaRegHeart,
  FaExpand,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-cards";
import "swiper/css/effect-creative";

// ✅ استيراد useAnalytics
import { useAnalytics } from "../hooks/hooks-exports";

function Testimonials({ onSectionView }) {
  const [darkMode, setDarkMode] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [muted, setMuted] = useState(false);
  const [expandedTestimonial, setExpandedTestimonial] = useState(null);
  const [likedTestimonials, setLikedTestimonials] = useState(new Set());
  const audioRef = useRef(null);
  const swiperRef = useRef(null);

  // ✅ استخدام useAnalytics
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    
    // ✅ تتبع عرض قسم التوصيات
    onSectionView('testimonials');
    trackEvent('testimonials_section_view', {
      testimonials_count: testimonials.length,
      timestamp: new Date().toISOString()
    });
  }, [onSectionView, trackEvent]);

  const testimonials = [
    {
      id: 1,
      name: "Stevane Johnson",
      comment: "The quality exceeded my expectations! Fast delivery and amazing customer service. I've already recommended Trendora to all my friends. The attention to detail in their products is remarkable.",
      img: "/assets/img/person1.jpg",
      rating: 5,
      position: "Fashion Blogger",
      location: "New York, USA",
      verified: true,
      purchase: "Nike Cloud Shoes",
      duration: "2 weeks ago",
      video: "/assets/videos/testimonial1.mp4",
      audio: "/assets/audio/testimonial1.mp3",
      tags: ["Quality", "Fast Delivery", "Customer Service"]
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      comment: "Incredible shopping experience! The products are exactly as described and the prices are very reasonable. Will definitely shop again! The mobile app makes shopping so convenient.",
      img: "/assets/img/person3.jpg",
      rating: 4.5,
      position: "Software Engineer",
      location: "California, USA",
      verified: true,
      purchase: "Gym Weight Set",
      duration: "1 month ago",
      video: "/assets/videos/testimonial2.mp4",
      audio: "/assets/audio/testimonial2.mp3",
      tags: ["Reasonable Prices", "Accurate Description", "Mobile App"]
    },
    {
      id: 3,
      name: "John Kowalski",
      comment: "Outstanding quality and attention to detail. The customer support team was incredibly helpful throughout my shopping journey. They went above and beyond to ensure my satisfaction.",
      img: "/assets/img/person4.jpg",
      rating: 5,
      position: "Business Owner",
      location: "London, UK",
      verified: true,
      purchase: "Designer Watch",
      duration: "3 days ago",
      video: "/assets/videos/testimonial3.mp4",
      audio: "/assets/audio/testimonial3.mp3",
      tags: ["Quality", "Customer Support", "Satisfaction"]
    },
    {
      id: 4,
      name: "Sarah Chen",
      comment: "I'm blown away by the fast shipping and product quality. The packaging was beautiful and the items arrived in perfect condition. This is now my go-to online store!",
      img: "/assets/img/istockphoto-174769304-170667a.jpg",
      rating: 5,
      position: "Marketing Manager",
      location: "Toronto, Canada",
      verified: true,
      purchase: "Summer Collection",
      duration: "1 week ago",
      video: "/assets/videos/testimonial4.mp4",
      audio: "/assets/audio/testimonial4.mp3",
      tags: ["Fast Shipping", "Packaging", "Quality"]
    },
    {
      id: 5,
      name: "David Martinez",
      comment: "Best online shopping experience I've had! The website is easy to navigate and the product recommendations were spot on. The return process was also very straightforward.",
      img: "/assets/img/user-3-min.jpg",
      rating: 4,
      position: "University Professor",
      location: "Madrid, Spain",
      verified: true,
      purchase: "Accessories Bundle",
      duration: "2 months ago",
      video: "/assets/videos/testimonial5.mp4",
      audio: "/assets/audio/testimonial5.mp3",
      tags: ["User Experience", "Recommendations", "Easy Returns"]
    }
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers", icon: "😊" },
    { number: "4.9/5", label: "Average Rating", icon: "⭐" },
    { number: "98%", label: "Recommend Us", icon: "💬" },
    { number: "24/7", label: "Support", icon: "🛡️" },
    { number: "50+", label: "Countries", icon: "🌎" },
    { number: "99.9%", label: "Uptime", icon: "⚡" }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-warning" size={16} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning" size={16} />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-muted" size={16} />);
    }

    return stars;
  };

  // ✅ تتبع التفاعل مع التوصيات
  const toggleLike = (testimonialId, testimonial) => {
    setLikedTestimonials(prev => {
      const newSet = new Set(prev);
      const isAdding = !newSet.has(testimonialId);
      
      if (newSet.has(testimonialId)) {
        newSet.delete(testimonialId);
      } else {
        newSet.add(testimonialId);
      }
      
      // تتبع الإعجاب/إلغاء الإعجاب
      trackEvent('testimonial_like_toggle', {
        testimonial_id: testimonialId,
        customer_name: testimonial.name,
        action: isAdding ? 'like' : 'unlike',
        rating: testimonial.rating,
        timestamp: new Date().toISOString()
      });
      
      return newSet;
    });
  };

  // ✅ تتبع مشاركة التوصيات
  const shareTestimonial = async (testimonial) => {
    // تتبع محاولة المشاركة
    trackEvent('testimonial_share_attempt', {
      testimonial_id: testimonial.id,
      customer_name: testimonial.name,
      platform: 'web_share',
      timestamp: new Date().toISOString()
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Testimonial from ${testimonial.name}`,
          text: testimonial.comment,
          url: window.location.href,
        });
        
        // تتبع نجاح المشاركة
        trackEvent('testimonial_share_success', {
          testimonial_id: testimonial.id,
          customer_name: testimonial.name,
          platform: 'web_share',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        // تتبع إلغاء المشاركة
        trackEvent('testimonial_share_cancelled', {
          testimonial_id: testimonial.id,
          customer_name: testimonial.name,
          platform: 'web_share',
          timestamp: new Date().toISOString()
        });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(testimonial.comment);
      
      // تتبع النسخ إلى الحافظة
      trackEvent('testimonial_copy_to_clipboard', {
        testimonial_id: testimonial.id,
        customer_name: testimonial.name,
        timestamp: new Date().toISOString()
      });
      
      alert('Testimonial copied to clipboard!');
    }
  };

  // ✅ تتبع فتح التوصية الموسعة
  const handleExpandTestimonial = (testimonial) => {
    setExpandedTestimonial(testimonial);
    trackEvent('testimonial_expand', {
      testimonial_id: testimonial.id,
      customer_name: testimonial.name,
      rating: testimonial.rating,
      timestamp: new Date().toISOString()
    });
  };

  // ✅ تتبع التحكم في السلايدر
  const handleAutoplayToggle = (newAutoplayState) => {
    setAutoplay(newAutoplayState);
    trackEvent('testimonials_autoplay_toggle', {
      action: newAutoplayState ? 'play' : 'pause',
      timestamp: new Date().toISOString()
    });
  };

  const TestimonialCard = ({ testimonial, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className="h-100 position-relative"
    >
      <div
        className="position-relative h-100 p-4 rounded-4 shadow-lg"
        style={{
          background: darkMode
            ? "linear-gradient(145deg, #1e293b, #0f172a)"
            : "linear-gradient(145deg, #ffffff, #f8fafc)",
          border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
          cursor: 'pointer',
          backdropFilter: 'blur(10px)'
        }}
        onClick={() => handleExpandTestimonial(testimonial)}
      >
        {/* Background Pattern */}
        <div
          className="position-absolute top-0 end-0 w-50 h-50 opacity-5"
          style={{
            background: `radial-gradient(circle, ${darkMode ? '#00ffcc' : '#667eea'} 1%, transparent 70%)`,
            transform: 'translate(30%, -30%)'
          }}
        />

        {/* Quote Icon */}
        <div
          className="position-absolute top-0 start-0 m-3 opacity-10"
          style={{ transform: 'translate(-10px, -10px)' }}
        >
          <FaQuoteLeft size={60} color={darkMode ? "#00ffcc" : "#667eea"} />
        </div>

        {/* Rating and Actions */}
        <div className="d-flex justify-content-between align-items-center mb-3 position-relative">
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex gap-1">
              {renderStars(testimonial.rating)}
            </div>
            <span
              className="small fw-semibold"
              style={{ color: darkMode ? '#94a3b8' : '#64748b' }}
            >
              {testimonial.rating}
            </span>
          </div>
         
          <div className="d-flex gap-2">
            {testimonial.verified && (
              <span
                className="badge px-2 py-1"
                style={{
                  background: "linear-gradient(135deg, #00B894, #00D8A3)",
                  color: "white",
                  fontSize: "0.7rem"
                }}
              >
                ✓ Verified
              </span>
            )}
           
            {/* Action Buttons */}
            <div className="d-flex gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="btn btn-sm p-1 rounded-circle"
                style={{
                  background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  border: 'none',
                  color: likedTestimonials.has(testimonial.id) ? '#ff4757' : (darkMode ? '#94a3b8' : '#64748b')
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(testimonial.id, testimonial);
                }}
              >
                {likedTestimonials.has(testimonial.id) ? <FaHeart /> : <FaRegHeart />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="btn btn-sm p-1 rounded-circle"
                style={{
                  background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  border: 'none',
                  color: darkMode ? '#94a3b8' : '#64748b'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  shareTestimonial(testimonial);
                }}
              >
                <FaShare size={12} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="btn btn-sm p-1 rounded-circle"
                style={{
                  background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  border: 'none',
                  color: darkMode ? '#94a3b8' : '#64748b'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandTestimonial(testimonial);
                }}
              >
                <FaExpand size={12} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Comment with Read More */}
        <div
          className="mb-4 position-relative"
          style={{
            color: darkMode ? '#e2e8f0' : '#475569',
            lineHeight: '1.6',
            fontStyle: 'italic'
          }}
        >
          <FaQuoteLeft className="me-2 opacity-50" size={16} />
          {testimonial.comment.length > 150 ? (
            <>
              {testimonial.comment.slice(0, 150)}...
              <button
                className="btn btn-link p-0 ms-1 text-decoration-none"
                style={{
                  color: darkMode ? '#00ffcc' : '#667eea',
                  fontSize: '0.9rem'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandTestimonial(testimonial);
                }}
              >
                Read more
              </button>
            </>
          ) : (
            testimonial.comment
          )}
          <FaQuoteRight className="ms-2 opacity-50" size={16} />
        </div>

        {/* Tags */}
        <div className="d-flex flex-wrap gap-1 mb-3">
          {testimonial.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="badge px-2 py-1"
              style={{
                background: darkMode
                  ? 'rgba(102, 126, 234, 0.2)'
                  : 'rgba(102, 126, 234, 0.1)',
                color: darkMode ? '#00ffcc' : '#667eea',
                fontSize: '0.7rem',
                border: `1px solid ${darkMode ? 'rgba(0, 255, 204, 0.3)' : 'rgba(102, 126, 234, 0.3)'}`
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Customer Info */}
        <div className="d-flex align-items-center gap-3">
          <div className="position-relative">
            <motion.img
              src={testimonial.img}
              alt={testimonial.name}
              className="rounded-circle shadow"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
                border: `3px solid ${darkMode ? '#00ffcc' : '#667eea'}`,
                cursor: 'pointer'
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleExpandTestimonial(testimonial);
              }}
            />
            {/* Online Indicator */}
            <div
              className="position-absolute bottom-0 end-0 rounded-circle border-2"
              style={{
                width: '14px',
                height: '14px',
                background: '#00B894',
                border: `2px solid ${darkMode ? '#1e293b' : 'white'}`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
          </div>
         
          <div className="flex-grow-1">
            <h6
              className="fw-bold mb-1 d-flex align-items-center gap-2"
              style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}
            >
              {testimonial.name}
              {testimonial.verified && (
                <span
                  className="badge p-1"
                  style={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "white"
                  }}
                >
                  ✓
                </span>
              )}
            </h6>
            <p
              className="small mb-1"
              style={{ color: darkMode ? '#94a3b8' : '#64748b' }}
            >
              {testimonial.position}
            </p>
            <p
              className="small mb-0"
              style={{ color: darkMode ? '#94a3b8' : '#64748b' }}
            >
              📍 {testimonial.location}
            </p>
            <p
              className="small fw-semibold mt-1"
              style={{ color: darkMode ? '#00ffcc' : '#667eea' }}
            >
              🛒 {testimonial.purchase}
            </p>
            <p
              className="small text-muted"
              style={{ fontSize: '0.75rem' }}
            >
              {testimonial.duration}
            </p>
          </div>
        </div>

        {/* Hover Effect */}
        <motion.div
          className="position-absolute top-0 start-0 w-100 h-100 rounded-4"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{
            background: darkMode
              ? 'linear-gradient(135deg, rgba(0, 255, 204, 0.05), rgba(102, 126, 234, 0.05))'
              : 'linear-gradient(135deg, rgba(102, 126, 234, 0.03), rgba(118, 75, 162, 0.03))',
            zIndex: -1
          }}
        />
      </div>
    </motion.div>
  );

  const ExpandedTestimonialModal = () => {
    if (!expandedTestimonial) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 9999,
            backdropFilter: 'blur(10px)'
          }}
          onClick={() => {
            setExpandedTestimonial(null);
            trackEvent('testimonial_expand_close', {
              testimonial_id: expandedTestimonial.id,
              customer_name: expandedTestimonial.name,
              timestamp: new Date().toISOString()
            });
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="position-relative rounded-4 p-4 mx-3"
            style={{
              background: darkMode
                ? "linear-gradient(145deg, #1e293b, #0f172a)"
                : "linear-gradient(145deg, #ffffff, #f8fafc)",
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn btn-sm position-absolute top-0 end-0 m-3 rounded-circle"
              style={{
                background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                border: 'none',
                color: darkMode ? '#fff' : '#000',
                width: '40px',
                height: '40px'
              }}
              onClick={() => {
                setExpandedTestimonial(null);
                trackEvent('testimonial_expand_close', {
                  testimonial_id: expandedTestimonial.id,
                  customer_name: expandedTestimonial.name,
                  timestamp: new Date().toISOString()
                });
              }}
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <img
                src={expandedTestimonial.img}
                alt={expandedTestimonial.name}
                className="rounded-circle mb-3"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  border: `4px solid ${darkMode ? '#00ffcc' : '#667eea'}`
                }}
              />
              <h4 style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}>
                {expandedTestimonial.name}
              </h4>
              <p style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                {expandedTestimonial.position} • {expandedTestimonial.location}
              </p>
              <div className="d-flex justify-content-center gap-1 mb-3">
                {renderStars(expandedTestimonial.rating)}
              </div>
            </div>

            <div
              className="p-4 rounded-3 mb-4"
              style={{
                background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                borderLeft: `4px solid ${darkMode ? '#00ffcc' : '#667eea'}`
              }}
            >
              <FaQuoteLeft className="mb-2" style={{ color: darkMode ? '#00ffcc' : '#667eea' }} />
              <p
                style={{
                  color: darkMode ? '#e2e8f0' : '#475569',
                  lineHeight: '1.8',
                  fontStyle: 'italic',
                  fontSize: '1.1rem'
                }}
              >
                {expandedTestimonial.comment}
              </p>
              <FaQuoteRight className="mt-2 float-end" style={{ color: darkMode ? '#00ffcc' : '#667eea' }} />
            </div>

            <div className="row text-center">
              <div className="col-6">
                <div style={{ color: darkMode ? '#00ffcc' : '#667eea' }} className="fw-bold fs-5">
                  🛒
                </div>
                <div style={{ color: darkMode ? '#94a3b8' : '#64748b' }} className="small">
                  {expandedTestimonial.purchase}
                </div>
              </div>
              <div className="col-6">
                <div style={{ color: darkMode ? '#00ffcc' : '#667eea' }} className="fw-bold fs-5">
                  📅
                </div>
                <div style={{ color: darkMode ? '#94a3b8' : '#64748b' }} className="small">
                  {expandedTestimonial.duration}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <section
      className="py-5 position-relative overflow-hidden"
      style={{
        background: darkMode
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
          : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
      }}
    >
      {/* Background Elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100 opacity-5">
        <motion.div
          className="position-absolute"
          style={{ top: '10%', left: '5%', fontSize: '80px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          💬
        </motion.div>
        <motion.div
          className="position-absolute"
          style={{ top: '60%', right: '10%', fontSize: '100px' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ⭐
        </motion.div>
        <motion.div
          className="position-absolute"
          style={{ bottom: '20%', left: '15%', fontSize: '60px' }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          👥
        </motion.div>
      </div>

      <Container className="position-relative" style={{ zIndex: 2 }}>
        {/* Header Section */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="badge mb-3 px-4 py-2 fw-semibold"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              fontSize: "0.9rem"
            }}
            whileHover={{ scale: 1.05 }}
          >
            ❤️ Customer Love
          </motion.span>
          <h2 className="fw-bold mb-3 display-4">
            <span style={{
              background: darkMode
                ? "linear-gradient(135deg, #00ffcc, #00b894)"
                : "linear-gradient(135deg, #667eea, #764ba2)",
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Voices of Satisfaction
            </span>
          </h2>
          <p className="fs-5 mx-auto" style={{
            color: darkMode ? '#cbd5e0' : '#64748b',
            maxWidth: '600px'
          }}>
            Discover why thousands of customers choose Trendora for exceptional quality and service
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="row text-center mb-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <Col key={index} xs={6} md={4} lg={2} className="mb-4">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-3 rounded-4 h-100"
                style={{
                  background: darkMode
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
                }}
                onClick={() => {
                  trackEvent('testimonial_stat_click', {
                    stat_label: stat.label,
                    stat_value: stat.number,
                    timestamp: new Date().toISOString()
                  });
                }}
              >
                <div className="fs-2 mb-2">{stat.icon}</div>
                <div
                  className="h4 fw-bold mb-2"
                  style={{
                    background: darkMode
                      ? "linear-gradient(135deg, #00ffcc, #00b894)"
                      : "linear-gradient(135deg, #667eea, #764ba2)",
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {stat.number}
                </div>
                <div
                  className="small fw-semibold"
                  style={{ color: darkMode ? '#94a3b8' : '#64748b' }}
                >
                  {stat.label}
                </div>
              </motion.div>
            </Col>
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div
          className="d-flex justify-content-center gap-3 mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn px-3 rounded-pill d-flex align-items-center gap-2"
            style={{
              background: darkMode
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.05)',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
              color: darkMode ? '#fff' : '#000'
            }}
            onClick={() => handleAutoplayToggle(!autoplay)}
          >
            {autoplay ? <FaPause /> : <FaPlay />}
            {autoplay ? 'Pause' : 'Play'} Auto
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn px-3 rounded-pill d-flex align-items-center gap-2"
            style={{
              background: darkMode
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.05)',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
              color: darkMode ? '#fff' : '#000'
            }}
            onClick={() => {
              swiperRef.current?.swiper.slidePrev();
              trackEvent('testimonials_navigation', {
                direction: 'previous',
                timestamp: new Date().toISOString()
              });
            }}
          >
            <FaChevronLeft />
            Prev
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn px-3 rounded-pill d-flex align-items-center gap-2"
            style={{
              background: darkMode
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.05)',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
              color: darkMode ? '#fff' : '#000'
            }}
            onClick={() => {
              swiperRef.current?.swiper.slideNext();
              trackEvent('testimonials_navigation', {
                direction: 'next',
                timestamp: new Date().toISOString()
              });
            }}
          >
            Next
            <FaChevronRight />
          </motion.button>
        </motion.div>

        {/* Testimonials Slider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Swiper
            ref={swiperRef}
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={autoplay ? {
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            } : false}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              renderBullet: (index, className) => {
                return `<span class="${className}" style="background: ${darkMode ? '#00ffcc' : '#667eea'}"></span>`;
              }
            }}
            navigation={true}
            loop={true}
            breakpoints={{
              768: { slidesPerView: 2 },
              1200: { slidesPerView: 3 }
            }}
            onSlideChange={(swiper) => {
              trackEvent('testimonials_slide_change', {
                active_slide: swiper.activeIndex + 1,
                total_slides: testimonials.length,
                timestamp: new Date().toISOString()
              });
            }}
            style={{
              paddingBottom: '60px'
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="text-center mt-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p
            className="small text-uppercase fw-semibold mb-3"
            style={{ color: darkMode ? '#94a3b8' : '#64748b', letterSpacing: '2px' }}
          >
            Why Customers Love Us
          </p>
          <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
            {["🏆 Premium Quality", "🚚 Fast Shipping", "🔒 Secure Payment", "💬 24/7 Support", "💰 Best Prices", "🔄 Easy Returns"].map((item, index) => (
              <motion.span
                key={index}
                className="small fw-semibold d-flex align-items-center gap-1"
                style={{ color: darkMode ? '#cbd5e0' : '#475569' , cursor: 'pointer'}}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  trackEvent('trust_indicator_click', {
                    indicator: item,
                    timestamp: new Date().toISOString()
                  });
                }}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </Container>

      {/* Expanded Testimonial Modal */}
      <ExpandedTestimonialModal />

      <style>
        {`
          .swiper-pagination-bullet {
            background: ${darkMode ? '#00ffcc' : '#667eea'} !important;
            opacity: 0.5;
          }
         
          .swiper-pagination-bullet-active {
            opacity: 1;
            transform: scale(1.2);
          }
         
          .swiper-button-next, .swiper-button-prev {
            color: ${darkMode ? '#00ffcc' : '#667eea'} !important;
            background: ${darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
            width: 50px !important;
            height: 50px !important;
            border-radius: 50%;
            backdrop-filter: blur(10px);
            border: 1px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
          }
         
          .swiper-button-next:after, .swiper-button-prev:after {
            font-size: 1.2rem !important;
          }
        `}
      </style>
    </section>
  );
}

export default Testimonials;