import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// ✅ استيراد useAnalytics
import { useAnalytics } from "../hooks/hooks-exports";

function Categories({ onSectionView }) {
  const [darkMode, setDarkMode] = useState(false);
  
  // ✅ استخدام useAnalytics
  const { trackEvent } = useAnalytics();
 
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    
    // ✅ تتبع عرض قسم التصنيفات
    onSectionView('categories');
    trackEvent('categories_section_view', {
      categories_count: categories.length,
      timestamp: new Date().toISOString()
    });
  }, [onSectionView, trackEvent]);

  const categories = [
    {
      name: "Smart Watches",
      img: "/assets/img/apple_mww12ll_a_watch_5_gps_1506024.jpg",
      color: "#00B894",
      gradient: "linear-gradient(135deg, #00B894, #00D8A3)",
      count: "120+ Products",
      icon: "⌚"
    },
    {
      name: "Premium Shoes",
      img: "/assets/img/pexels-jiaxin-ni-3115349-4932920.jpg",
      color: "#0984E3",
      gradient: "linear-gradient(135deg, #0984E3, #1B9CFC)",
      count: "85+ Products",
      icon: "👟"
    },
    {
      name: "Luxury Accessories",
      img: "/assets/img/category_img_03.jpg",
      color: "#E84393",
      gradient: "linear-gradient(135deg, #E84393, #FD79A8)",
      count: "200+ Products",
      icon: "💎"
    },
    {
      name: "Designer Bags",
      img: "/assets/img/travel-bag-4326732_1920.jpg",
      color: "#F39C12",
      gradient: "linear-gradient(135deg, #F39C12, #FDCB6E)",
      count: "65+ Products",
      icon: "👜"
    },
    {
      name: "Fashion Jackets",
      img: "/assets/img/save-the-duck-logo-patch-hooded-jacket.jpg",
      color: "#6C5CE7",
      gradient: "linear-gradient(135deg, #6C5CE7, #A29BFE)",
      count: "95+ Products",
      icon: "🧥"
    },
    {
      name: "Electronics",
      img: "/assets/img/Wireless Bluetooth Headphones.jpg",
      color: "#00CEC9",
      gradient: "linear-gradient(135deg, #00CEC9, #81ECEC)",
      count: "150+ Products",
      icon: "📱"
    }
  ];

  // ✅ تتبع النقر على التصنيفات
  const handleCategoryClick = (category) => {
    trackEvent('category_click', {
      category_name: category.name,
      category_products_count: category.count,
      category_color: category.color,
      source: 'home_page',
      section: 'categories',
      timestamp: new Date().toISOString()
    });
  };

  // ✅ تتبع تغيير الشرائح
  const handleSlideChange = (swiper) => {
    trackEvent('categories_slide_change', {
      active_slide: swiper.activeIndex + 1,
      total_slides: categories.length,
      timestamp: new Date().toISOString()
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section
      className="py-5"
      style={{
        background: darkMode
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
          : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
      }}
    >
      <div className="container">
        {/* Header Section */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span
            className="badge mb-3 px-4 py-2 fw-semibold"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              fontSize: "0.9rem"
            }}
          >
            🔥 Trending Categories
          </span>
          <h2 className="fw-bold mb-3 display-5">
            <span style={{
              background: darkMode
                ? "linear-gradient(135deg, #00ffcc, #00b894)"
                : "linear-gradient(135deg, #667eea, #764ba2)",
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Popular Categories
            </span>
          </h2>
          <p className="fs-5 mx-auto" style={{
            color: darkMode ? '#cbd5e0' : '#64748b',
            maxWidth: '600px'
          }}>
            Discover our most loved collections. From smart wearables to fashion essentials, find what suits your style.
          </p>
        </motion.div>

        {/* Categories Slider */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              renderBullet: function (index, className) {
                return `<span class="${className}" style="background: ${categories[index].color}; width: 12px; height: 12px;"></span>`;
              }
            }}
            navigation={true}
            loop={true}
            breakpoints={{
              320: { slidesPerView: 1 },
              576: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1200: { slidesPerView: 4 }
            }}
            onSlideChange={handleSlideChange}
            style={{
              paddingBottom: '50px'
            }}
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  className="position-relative"
                >
                  <div
                    className="card border-0 text-center p-4 category-card position-relative overflow-hidden"
                    style={{
                      borderRadius: "25px",
                      cursor: "pointer",
                      background: darkMode
                        ? "linear-gradient(135deg, #1e293b, #334155)"
                        : "white",
                      border: darkMode
                        ? "1px solid #334155"
                        : "1px solid #f1f5f9",
                      minHeight: "380px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                  >
                    {/* Background Gradient Effect */}
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
                      style={{
                        background: category.gradient,
                        zIndex: 0
                      }}
                    />
                   
                    {/* Category Icon */}
                    <motion.div
                      className="position-absolute top-0 end-0 m-3"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      style={{ zIndex: 2 }}
                    >
                      <span
                        className="fs-2"
                        style={{ color: category.color }}
                      >
                        {category.icon}
                      </span>
                    </motion.div>

                    {/* Image Container */}
                    <motion.div
                      className="position-relative mx-auto"
                      style={{
                        width: "160px",
                        height: "160px",
                        zIndex: 1
                      }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="rounded-circle overflow-hidden position-relative"
                        style={{
                          width: "100%",
                          height: "100%",
                          border: `4px solid ${category.color}`,
                          boxShadow: `0 8px 25px ${category.color}40`
                        }}
                      >
                        <img
                          src={category.img}
                          alt={category.name}
                          className="img-fluid rounded-circle"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease"
                          }}
                        />
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="position-relative" style={{ zIndex: 1 }}>
                      <h5
                        className="fw-bold mb-2 mt-3"
                        style={{
                          color: darkMode ? '#f1f5f9' : '#1e293b',
                          fontSize: '1.3rem'
                        }}
                      >
                        {category.name}
                      </h5>
                     
                      <p
                        className="small mb-3 fw-semibold"
                        style={{ color: category.color }}
                      >
                        {category.count}
                      </p>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to={`/products?category=${category.name}`}
                          className="btn fw-semibold px-4 py-2 shadow-sm"
                          style={{
                            background: category.gradient,
                            color: 'white',
                            borderRadius: "50px",
                            border: 'none',
                            fontSize: '0.9rem'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.boxShadow = `0 8px 25px ${category.color}80`;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                          }}
                          onClick={() => handleCategoryClick(category)}
                        >
                          Explore Now →
                        </Link>
                      </motion.div>
                    </div>

                    {/* Hover Effect */}
                    <motion.div
                      className="position-absolute bottom-0 start-50 translate-middle-x"
                      initial={{ width: 0 }}
                      whileHover={{ width: "80%" }}
                      transition={{ duration: 0.3 }}
                      style={{
                        height: "4px",
                        background: category.gradient,
                        borderRadius: "2px"
                      }}
                    />
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link
            to="/products"
            className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold"
            style={{
              borderRadius: "50px",
              borderWidth: "2px",
              color: darkMode ? '#00ffcc' : '#667eea',
              borderColor: darkMode ? '#00ffcc' : '#667eea'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = darkMode ? '#00ffcc' : '#667eea';
              e.target.style.color = darkMode ? '#1e293b' : 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = darkMode ? '#00ffcc' : '#667eea';
            }}
            onClick={() => {
              trackEvent('view_all_categories_click', {
                source: 'categories_section',
                total_categories: categories.length,
                timestamp: new Date().toISOString()
              });
            }}
          >
            View All Categories
          </Link>
        </motion.div>
      </div>

      <style>
        {`
          .category-card:hover img {
            transform: scale(1.15);
          }
         
          .swiper-pagination-bullet-active {
            transform: scale(1.3);
            transition: transform 0.3s ease;
          }
         
          .swiper-button-next, .swiper-button-prev {
            color: ${darkMode ? '#00ffcc' : '#667eea'} !important;
            background: ${darkMode ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
            width: 50px !important;
            height: 50px !important;
            border-radius: 50%;
            backdrop-filter: blur(10px);
          }
         
          .swiper-button-next:after, .swiper-button-prev:after {
            font-size: 1.2rem !important;
            font-weight: bold;
          }
        `}
      </style>
    </section>
  );
}

export default Categories;