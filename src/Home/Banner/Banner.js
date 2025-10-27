import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { Link, useNavigate } from "react-router-dom";
import { apiValue } from "../../constants/AllData";

// ✅ استيراد useAnalytics
import { useAnalytics } from "../../hooks/hooks-exports";

// 🎯 ثوابت التطبيق
const APP_CONFIG = {
  AUTO_SLIDE_INTERVAL: 6000,
  IMAGE_LOAD_TIMEOUT: 5000,
  FEATURED_PRODUCTS_LIMIT: 3,
  SLIDE_TRANSITION_DURATION: 0.6
};

// 🎯 أنواع الأزرار
const BUTTON_VARIANTS = {
  GRADIENT: "gradient",
  DANGER: "danger",
  OUTLINE_GRADIENT: "outline-gradient"
};

const Banner = ({ onSectionView }) => {
  const [bannerRef, isBannerVisible] = useIntersectionObserver();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // ✅ استخدام useAnalytics
  const { trackEvent, trackProductView } = useAnalytics();

  // ✅ استخدام البيانات من Context
  const allProducts = useContext(apiValue);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // ✅ بيانات الشرائح الثابتة
  const slides = React.useMemo(() => [
    {
      id: 1,
      title: "Discover Premium",
      highlight: "Sport Wear",
      description: "Explore our exclusive collection of high-performance sports shoes from top brands. Designed for comfort and style.",
      image: "/assets/img/818dad74-3fca-4ef6-8b70-794d12192b52.png",
      badge: "🏃‍♂️ Top Brands",
      features: ["Free Shipping", "30-Day Returns", "Authentic Products"],
      buttonText: "Shop Shoes",
      buttonVariant: BUTTON_VARIANTS.GRADIENT,
      category: "all",
      stats: [
        { value: "4.8/5", label: "Avg Rating" },
        { value: "50%", label: "Discount" },
        { value: "1K+", label: "Sold" },
      ],
    },
    {
      id: 2,
      title: "Amazing Deals",
      highlight: "Up to 70% Off",
      description: "Don't miss our incredible discounts on premium products. Limited time offers with savings you can't resist!",
      image: "/assets/img/soccer-ball-soccer-ball-are-pile-soccer-balls_1126605-2114.jpg",
      badge: "🔥 Hot Deals",
      features: ["Up to 70% Off", "Limited Time", "Best Prices"],
      buttonText: "View Offers",
      buttonVariant: BUTTON_VARIANTS.DANGER,
      category: "all",
      stats: [
        { value: "70%", label: "Max Discount" },
        { value: "24H", label: "Time Left" },
        { value: "500+", label: "Happy Customers" },
      ],
    },
    {
      id: 3,
      title: "Premium Quality",
      highlight: "Smart Electronics",
      description: "Upgrade your fitness journey with our premium sports equipment. From professional gear to home workout essentials.",
      image: "/assets/img/426f3a28-c4b1-46fd-9976-e1b09fb7445e.png",
      badge: "💪 Premium",
      features: ["Quality Guarantee", "Fast Delivery", "Expert Support"],
      buttonText: "Explore Gear",
      buttonVariant: BUTTON_VARIANTS.OUTLINE_GRADIENT,
      category: "all",
      stats: [
        { value: "100+", label: "Products" },
        { value: "4.9/5", label: "Reviews" },
        { value: "24/7", label: "Support" },
      ],
    },
  ], []);

  // ✅ بيانات افتراضية للمنتجات
  const defaultProducts = React.useMemo(() => [
    {
      id: 1,
      name: "Premium Sports Shoes",
      price: 240,
      originalPrice: 199.99,
      discountPercentage: 35,
      rating: 4.8,
      image: "/assets/img/orange shoes.jpg",
      featured: true
    },
    {
      id: 2,
      name: "Professional Gym Set",
      price: 480,
      originalPrice: 399.99,
      discountPercentage: 25,
      rating: 4.9,
      image: "/assets/img/pexels-indigentesce-8979069.jpg",
      featured: true
    },
    {
      id: 3,
      name: "Running Shoes",
      price: 360,
      originalPrice: 129.99,
      discountPercentage: 30,
      rating: 4.6,
      image: "/assets/img/pexels-craytive-1464625.jpg",
      featured: true
    }
  ], []);

  // ✅ تصفية المنتجات المميزة
  const filterFeaturedProducts = useCallback((products) => {
    if (!products || products.length === 0) {
      return defaultProducts;
    }

    try {
      const featured = products
        .filter(product => {
          const hasHighRating = product.rating >= 4.3;
          const hasGoodDiscount = product.discountPercentage >= 15;
          const isFeatured = product.featured || product.isFeatured;
          const isFeaturedCategory = product.category?.toLowerCase().includes('featured');
         
          return isFeatured || hasHighRating || hasGoodDiscount || isFeaturedCategory;
        })
        .slice(0, APP_CONFIG.FEATURED_PRODUCTS_LIMIT);

      return featured.length > 0 ? featured : products.slice(0, APP_CONFIG.FEATURED_PRODUCTS_LIMIT);
    } catch (err) {
      console.error('Error filtering featured products:', err);
      return defaultProducts;
    }
  }, [defaultProducts]);

  // ✅ جلب وتحديث المنتجات المميزة
  useEffect(() => {
    let isMounted = true;
   
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
       
        if (allProducts && allProducts.length > 0) {
          console.log('📦 Total products from context:', allProducts.length);
          const filteredProducts = filterFeaturedProducts(allProducts);
         
          if (isMounted) {
            setFeaturedProducts(filteredProducts);
            console.log('⭐ Featured products loaded:', filteredProducts.length);
          }
        } else {
          console.log('🔄 Using default products');
          if (isMounted) {
            setFeaturedProducts(defaultProducts);
          }
        }
      } catch (err) {
        console.error('❌ Error loading featured products:', err);
        if (isMounted) {
          setError('Failed to load featured products');
          setFeaturedProducts(defaultProducts);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, [allProducts, filterFeaturedProducts, defaultProducts]);

  // ✅ تحميل الصور
  useEffect(() => {
    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setImagesLoaded(true);
      }
    }, APP_CONFIG.IMAGE_LOAD_TIMEOUT);

    const loadImages = async () => {
      try {
        const imageUrls = [
          ...slides.map(slide => slide.image),
          ...featuredProducts.map(product => product.image || product.thumbnail)
        ].filter(Boolean);

        const loadPromises = imageUrls.map((url) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = () => {
              console.warn(`⚠️ Failed to load image: ${url}`);
              resolve();
            };
          });
        });

        await Promise.all(loadPromises);
       
        if (isMounted) {
          setImagesLoaded(true);
          console.log('✅ All images loaded successfully');
        }
      } catch (error) {
        console.log("🔄 Image loading completed with some errors");
        if (isMounted) {
          setImagesLoaded(true);
        }
      }
    };

    if (featuredProducts.length > 0) {
      loadImages();
    }

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [featuredProducts, slides]);

  // ✅ التحكم في الشرائح التلقائية
  useEffect(() => {
    if (isBannerVisible && imagesLoaded) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, APP_CONFIG.AUTO_SLIDE_INTERVAL);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isBannerVisible, imagesLoaded, slides.length]);

  // ✅ تتبع عرض القسم
  useEffect(() => {
    if (isBannerVisible) {
      onSectionView('banner');
      trackEvent('banner_section_view', {
        slides_count: slides.length,
        featured_products_count: featuredProducts.length,
        timestamp: new Date().toISOString()
      });
    }
  }, [isBannerVisible, onSectionView, trackEvent, slides.length, featuredProducts.length]);

  // ✅ الانتقال للفئات مع التتبع
  const handleCategoryNavigation = useCallback((category) => {
    trackEvent('banner_category_navigation', {
      category: category,
      slide_title: slides[currentSlide].title,
      slide_id: slides[currentSlide].id,
      button_text: slides[currentSlide].buttonText,
      timestamp: new Date().toISOString()
    });
    
    const path = category === "all" ? "/products" : `/products?category=${category}`;
    navigate(path);
  }, [navigate, trackEvent, slides, currentSlide]);

  // ✅ الانتقال للمنتج مع التتبع
  const handleProductNavigation = useCallback((productId, product) => {
    trackProductView(product, {
      source: 'banner_featured',
      slide_id: slides[currentSlide].id,
      section: 'banner',
      timestamp: new Date().toISOString()
    });
    
    navigate(`/singleproduct/${productId}`);
  }, [navigate, trackProductView, slides, currentSlide]);

  // ✅ تتبع النقر على بطاقة الإحصائيات
  const handleStatCardClick = useCallback((cardType) => {
    trackEvent('stat_card_click', {
      card_type: cardType,
      section: 'banner',
      slide_id: slides[currentSlide].id,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent, slides, currentSlide]);

  // ✅ تتبع النقر على شريحة
  const handleSlideClick = useCallback((slide) => {
    trackEvent('banner_slide_click', {
      slide_id: slide.id,
      slide_title: slide.title,
      slide_category: slide.category,
      button_text: slide.buttonText,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  // ✅ معالجة أخطاء الصور
  const handleImageError = useCallback((e, fallbackImage = "/images/placeholder.jpg") => {
    e.target.src = fallbackImage;
  }, []);

  // ✅ عرض النجوم
  const renderStars = useCallback((rating) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFullStar = rating >= starValue;
      const isHalfStar = rating >= starValue - 0.5 && rating < starValue;
     
      return (
        <span
          key={index}
          className={`${isFullStar || isHalfStar ? "text-warning" : "text-muted"}`}
          style={{ fontSize: "0.6rem" }}
        >
          ★
        </span>
      );
    });
  }, []);

  // ✅ تنسيق السعر
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  }, []);

  // ✅ مكون المنتجات المميزة
  const FeaturedProductsPreview = React.memo(() => {
    if (loading) {
      return (
        <div className="featured-products-loading mt-4">
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border text-primary me-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="text-muted">Loading featured products...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="featured-products-error mt-4">
          <div className="alert alert-warning d-flex align-items-center" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            <div>{error}</div>
          </div>
        </div>
      );
    }

    if (featuredProducts.length === 0) {
      return (
        <div className="featured-products-empty mt-4">
          <div className="alert alert-info d-flex align-items-center" role="alert">
            <i className="fas fa-info-circle me-2"></i>
            <div>No featured products available at the moment.</div>
          </div>
        </div>
      );
    }

    return (
      <div className="featured-products-preview mt-4">
        <h6 className="fw-bold mb-3 text-dark">Featured Products:</h6>
        <div className="d-flex gap-3 flex-wrap justify-content-center">
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              className="featured-product-card position-relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleProductNavigation(product.id, product)}
              style={{
                cursor: "pointer",
                background: "white",
                borderRadius: "12px",
                padding: "12px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                border: "1px solid #e9ecef",
                minWidth: "120px",
                maxWidth: "140px",
                flex: "1 0 auto",
              }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleProductNavigation(product.id, product)}
            >
              {(product.discountPercentage > 0) && (
                <div
                  className="position-absolute top-0 start-0 badge bg-danger"
                  style={{
                    transform: "translate(-5px, -5px)",
                    fontSize: "0.7rem",
                    padding: "4px 8px",
                  }}
                >
                  -{Math.round(product.discountPercentage)}%
                </div>
              )}

              <img
                src={product.image || product.thumbnail || "/images/placeholder.jpg"}
                alt={product.name || product.title}
                className="rounded mb-2"
                style={{
                  width: "100%",
                  height: "80px",
                  objectFit: "cover",
                }}
                onError={(e) => handleImageError(e)}
                loading="lazy"
              />
             
              <div className="text-center">
                <small
                  className="fw-bold d-block text-truncate text-dark"
                  style={{ fontSize: "0.75rem" }}
                  title={product.name || product.title}
                >
                  {product.name || product.title}
                </small>
               
                <div className="d-flex align-items-center justify-content-center gap-1 mt-1">
                  <span className="text-primary fw-bold" style={{ fontSize: "0.8rem" }}>
                    {formatPrice(product.price)}
                  </span>
                  {(product.originalPrice > product.price) && (
                    <span className="text-muted text-decoration-line-through" style={{ fontSize: "0.7rem" }}>
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
               
                <div className="d-flex align-items-center justify-content-center gap-1 mt-1">
                  {renderStars(product.rating)}
                  <small className="text-muted" style={{ fontSize: "0.65rem" }}>
                    ({product.rating?.toFixed(1) || "0.0"})
                  </small>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {allProducts && allProducts.length > APP_CONFIG.FEATURED_PRODUCTS_LIMIT && (
          <div className="text-center mt-3">
            <motion.button
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                trackEvent('view_all_products_click', {
                  source: 'banner',
                  total_products: allProducts.length,
                  timestamp: new Date().toISOString()
                });
                navigate("/products");
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All {allProducts.length} Products
            </motion.button>
          </div>
        )}
      </div>
    );
  });

  const currentSlideData = slides[currentSlide];

  return (
    <>
      <Helmet>
        <title>SportStore - Premium Sports Equipment & Shoes | Best Deals & Quality</title>
        <meta name="description" content="Discover premium sports shoes, equipment, and gear at SportStore. Best prices, top brands with free shipping and 30-day returns." />
        <meta name="keywords" content="sports shoes, sports equipment, fitness gear, workout equipment" />
        <link rel="canonical" href={window.location.origin} />
      </Helmet>

      <section
        ref={bannerRef}
        className="banner-section position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
        role="banner"
        aria-label="Main banner section"
      >
        {/* 🎨 Dynamic background shapes */}
        <div className="position-absolute w-100 h-100" style={{ top: 0, left: 0, zIndex: 1 }}>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20 * (i + 1), 0],
                x: [0, 15 * (i % 2 === 0 ? 1 : -1), 0],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 12 + i * 4,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                top: `${15 + i * 20}%`,
                left: `${5 + i * 15}%`,
                width: `${60 + i * 20}px`,
                height: `${60 + i * 20}px`,
                background: `rgba(74, 144, 226, ${0.03 - i * 0.01})`,
                borderRadius: i % 2 === 0 ? "50%" : "20%",
                border: `1px dashed rgba(37, 117, 252, ${0.1 - i * 0.03})`,
              }}
            />
          ))}
        </div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center min-vh-100 py-5">
            {/* 🎯 Content Section */}
            <div className="col-lg-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlideData.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: APP_CONFIG.SLIDE_TRANSITION_DURATION }}
                  onClick={() => handleSlideClick(currentSlideData)}
                >
                  <SlideContent
                    slide={currentSlideData}
                    onCategoryNavigate={handleCategoryNavigation}
                    featuredProducts={<FeaturedProductsPreview />}
                    formatPrice={formatPrice}
                    onStatCardClick={handleStatCardClick}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 🖼️ Image Section */}
            <div className="col-lg-6 position-relative">
              <SlideImage
                slide={currentSlideData}
                imagesLoaded={imagesLoaded}
                featuredProducts={featuredProducts}
                currentSlide={currentSlide}
                slides={slides}
                onImageError={handleImageError}
                onSlideChange={setCurrentSlide}
                formatPrice={formatPrice}
                onSlideClick={handleSlideClick}
              />
            </div>
          </div>
        </div>

        {/* 🔽 Scroll Indicator */}
        <ScrollIndicator />
      </section>

      <BannerStyles />
    </>
  );
};

// 🎯 مكون محتوى الشريحة
const SlideContent = React.memo(({ slide, onCategoryNavigate, featuredProducts, formatPrice, onStatCardClick }) => (
  <>
    {/* Badge */}
    <motion.span
      className="badge px-3 py-2 mb-3 d-inline-flex align-items-center gap-2"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        borderRadius: "20px",
        fontSize: "0.9rem",
        fontWeight: "600",
      }}
      whileHover={{ scale: 1.05 }}
    >
      {slide.badge}
    </motion.span>

    {/* Main Title */}
    <motion.h1
      className="display-4 fw-bold mb-4"
      style={{
        lineHeight: "1.2",
        fontSize: "clamp(2rem, 5vw, 3.5rem)",
        color: "#2c3e50",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {slide.title}{" "}
      <span className="text-gradient">
        {slide.highlight}
      </span>
    </motion.h1>

    {/* Description */}
    <motion.p
      className="lead mb-4 fs-5"
      style={{
        color: "#6c757d",
        lineHeight: "1.8",
        maxWidth: "90%",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {slide.description}
    </motion.p>

    {/* Statistics */}
    <motion.div
      className="d-flex gap-4 mb-4 flex-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {slide.stats.map((stat, index) => (
        <div 
          key={index} 
          className="text-center"
          onClick={() => onStatCardClick(stat.label.toLowerCase().replace(' ', '_'))}
          style={{ cursor: 'pointer' }}
        >
          <div className="text-gradient h4 fw-bold mb-1">
            {stat.value}
          </div>
          <div className="small text-muted text-nowrap" style={{ fontSize: "0.8rem" }}>
            {stat.label}
          </div>
        </div>
      ))}
    </motion.div>

    {/* Features */}
    <motion.div
      className="d-flex flex-wrap gap-3 mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {slide.features.map((feature, index) => (
        <FeatureBadge key={index} feature={feature} index={index} />
      ))}
    </motion.div>

    {/* Buttons */}
    <motion.div
      className="d-flex flex-wrap gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <SlideButton
        slide={slide}
        onCategoryNavigate={onCategoryNavigate}
      />
      <Link to="/products" className="text-decoration-none">
        <motion.button
          className="btn btn-outline-dark btn-lg px-4 py-3 fw-semibold"
          whileHover={{
            scale: 1.05,
            backgroundColor: "#2c3e50",
            color: "white",
          }}
          whileTap={{ scale: 0.95 }}
          style={{
            borderRadius: "15px",
            border: "2px solid #2c3e50",
            color: "#2c3e50",
          }}
        >
          View All Products
        </motion.button>
      </Link>
    </motion.div>

    {/* Featured Products */}
    {featuredProducts}
  </>
));

// 🎯 مكون صورة الشريحة
const SlideImage = React.memo(({
  slide,
  imagesLoaded,
  featuredProducts,
  currentSlide,
  slides,
  onImageError,
  onSlideChange,
  formatPrice,
  onSlideClick
}) => (
  <motion.div
    className="image-container position-relative"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
    onClick={() => onSlideClick(slide)}
  >
    <AnimatePresence mode="wait">
      {imagesLoaded ? (
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, rotateY: 90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: -90 }}
          transition={{ duration: 0.8 }}
          className="position-relative"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="img-fluid w-100 rounded-4 shadow-lg"
            style={{
              height: "500px",
              objectFit: "cover",
              border: "2px solid #e9ecef",
            }}
            onError={(e) => onImageError(e, featuredProducts[0]?.image || "/images/placeholder.jpg")}
            loading="eager"
          />

          {/* Best Seller Badge */}
          <motion.div
            className="position-absolute top-0 start-0 m-3"
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="bg-white rounded-3 shadow-lg p-2 d-flex align-items-center gap-2 glass-effect">
              <div className="status-dot bg-success"></div>
              <span className="fw-bold text-dark" style={{ fontSize: "0.8rem" }}>
                ⭐ Best Seller
              </span>
            </div>
          </motion.div>

          {/* Price Badge */}
          <motion.div
            className="position-absolute bottom-0 end-0 m-3"
            animate={{
              y: [0, 8, 0],
              scale: [1, 1.03, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="bg-success text-white rounded-3 shadow-lg p-2 text-center">
              <div style={{ fontSize: "0.7rem", opacity: 0.9 }}>From</div>
              <div className="h6 fw-bold mb-0">
                {formatPrice(featuredProducts[0]?.price || 129)}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <ImageLoader />
      )}
    </AnimatePresence>

    {/* Slide Indicators */}
    <SlideIndicators
      slides={slides}
      currentSlide={currentSlide}
      onSlideChange={onSlideChange}
    />
  </motion.div>
));

// 🎯 مكونات مساعدة إضافية
const FeatureBadge = React.memo(({ feature, index }) => (
  <motion.div
    className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill feature-badge"
    whileHover={{
      scale: 1.05,
      background: "rgba(102, 126, 234, 0.15)",
    }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.span
      style={{ color: "#667eea" }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
    >
      ✓
    </motion.span>
    <span className="feature-text">
      {feature}
    </span>
  </motion.div>
));

const SlideButton = React.memo(({ slide, onCategoryNavigate }) => (
  <motion.button
    className={`btn ${
      slide.buttonVariant === BUTTON_VARIANTS.GRADIENT ? "btn-gradient" :
      slide.buttonVariant === BUTTON_VARIANTS.DANGER ? "btn-danger" :
      "btn-outline-gradient"
    } btn-lg px-5 py-3 fw-semibold`}
    whileHover={{
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    }}
    whileTap={{ scale: 0.95 }}
    onClick={() => onCategoryNavigate(slide.category)}
    style={{
      borderRadius: "15px",
      fontSize: "1.1rem",
      border: "none",
    }}
  >
    {slide.buttonText} →
  </motion.button>
));

const SlideIndicators = React.memo(({ slides, currentSlide, onSlideChange }) => (
  <div className="d-flex justify-content-center gap-2 mt-4">
    {slides.map((_, index) => (
      <motion.button
        key={index}
        className={`btn ${index === currentSlide ? "btn-gradient" : "btn-outline-secondary"} rounded-pill slide-indicator`}
        onClick={() => onSlideChange(index)}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))}
  </div>
));

const ImageLoader = React.memo(() => (
  <div className="d-flex align-items-center justify-content-center bg-light rounded-4" style={{ height: "500px" }}>
    <div className="text-center">
      <div className="spinner-border mb-3 text-primary" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="text-muted">Loading amazing products...</div>
    </div>
  </div>
));

const ScrollIndicator = React.memo(() => (
  <motion.div
    className="position-absolute bottom-0 start-50 translate-middle-x mb-4"
    animate={{
      y: [0, 8, 0],
      opacity: [0.7, 1, 0.7],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    style={{ zIndex: 3 }}
  >
    <div
      className="text-center cursor-pointer"
      onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
      style={{ cursor: "pointer" }}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
    >
      <div className="small text-muted mb-2" style={{ fontSize: "0.8rem" }}>
        Discover More
      </div>
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ fontSize: "1.1rem", color: "#667eea" }}
      >
        ⌄
      </motion.div>
    </div>
  </motion.div>
));

// 🎯 الأنماط المخصصة
const BannerStyles = React.memo(() => (
  <style>{`
    .banner-section {
      font-family: 'Inter', sans-serif;
    }
   
    .btn-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      transition: all 0.3s ease;
    }
   
    .btn-gradient:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }
   
    .btn-outline-gradient {
      background: transparent;
      border: 2px solid;
      border-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-image-slice: 1;
      color: #667eea;
      transition: all 0.3s ease;
    }
   
    .btn-outline-gradient:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      transform: translateY(-2px);
    }
   
    .text-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .feature-badge {
      background: rgba(102, 126, 234, 0.1);
      border: 1px solid rgba(102, 126, 234, 0.2);
      backdrop-filter: blur(10px);
    }

    .feature-text {
      color: #2c3e50;
      fontSize: 0.9rem;
      fontWeight: 500;
    }

    .glass-effect {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .slide-indicator {
      width: 12px;
      height: 12px;
      padding: 0;
      border: none;
      transition: all 0.3s ease;
    }

    .slide-indicator.btn-gradient {
      width: 35px;
    }

    .featured-product-card {
      transition: all 0.3s ease;
      flex: 1 0 auto;
    }

    .featured-product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    }

    @media (max-width: 768px) {
      .banner-section {
        text-align: center;
      }
     
      .display-4 {
        font-size: 2.5rem !important;
      }

      .featured-products-preview {
        text-align: center;
      }

      .featured-product-card {
        min-width: 100px !important;
        max-width: 110px !important;
      }

      .slide-indicator {
        width: 10px;
        height: 10px;
      }

      .slide-indicator.btn-gradient {
        width: 25px;
      }
    }

    @media (max-width: 576px) {
      .featured-product-card {
        min-width: 85px !important;
        max-width: 95px !important;
        padding: 8px !important;
      }
    }
  `}</style>
));

export default React.memo(Banner);