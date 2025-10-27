import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Badge, Spinner, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart, FaEye, FaTimes, FaPlus, FaMinus, FaShare, FaCheck, FaTruck, FaShieldAlt, FaSync } from "react-icons/fa";
import { useCart } from "react-use-cart";
import { useWishlist } from "../context/WishlistContext";

// ✅ استيراد useAnalytics
import { useAnalytics } from "../hooks/hooks-exports";

function Features({ onSectionView }) {
  const [darkMode, setDarkMode] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [imageLoaded, setImageLoaded] = useState({});
  const [quickView, setQuickView] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const navigate = useNavigate();
  const { addItem, updateItemQuantity, getItem } = useCart();

  // ✅ استخدام useAnalytics
  const { trackEvent, trackProductView, trackAddToCart } = useAnalytics();

  const { wishlist, wishlistCount, toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    
    // ✅ تتبع عرض قسم المنتجات المميزة
    onSectionView('featured_products');
    trackEvent('featured_products_section_view', {
      products_count: products.length,
      section: 'features',
      timestamp: new Date().toISOString()
    });
  }, [onSectionView, trackEvent]);

  // بيانات المنتجات المحسنة
  const products = [
    {
      id: 1,
      productId: 1,
      images: ["/assets/img/orange shoes.jpg", "/assets/img/Mosha-Belle-Back-Support-Shoes.png", "/assets/img/exercise-sneakers-men-isolated-white-background_506134-17127.jpg"],
      title: "Men's Nike Air Max Running Shoes",
      description: "Professional grade fitness equipment for home workouts with advanced cushioning technology for maximum comfort during runs.",
      price: 240.0,
      originalPrice: 299.0,
      discountPercentage: 20,
      rating: 4.5,
      reviewCount: 124,
      category: "Fitness",
      tags: ["Hot", "Sale", "Limited"],
      colors: [
        { name: "Red", value: "#FF6B6B" },
        { name: "Blue", value: "#4ECDC4" },
        { name: "Black", value: "#2D3748" },
      ],
      sizes: ["US 8", "US 9", "US 10", "US 11", "US 12"],
      featured: true,
      inStock: true,
      stock: 9,
      specifications: {
        material: "Mesh & Synthetic",
        weight: "320g",
        sole: "Rubber",
        closure: "Lace-Up",
      },
      features: ["Air Cushioning Technology", "Breathable Mesh Upper", "Durable Rubber Sole", "Lightweight Design"],
      addedDate: new Date().toISOString(),
      priority: "high",
    },
    {
      id: 2,
      productId: 2,
      images: ["/assets/img/Mosha-Belle-Back-Support-Shoes.png", "/assets/img/orange shoes.jpg"],
      title: "Nike Air Cloud Shoes",
      description: "Ultra-comfortable running shoes with cloud-like cushioning perfect for daily workouts and long distance running.",
      price: 480.0,
      originalPrice: 550.0,
      discountPercentage: 13,
      rating: 4.8,
      reviewCount: 89,
      category: "Footwear",
      tags: ["Popular", "Limited", "New"],
      colors: [
        { name: "White", value: "#FFFFFF" },
        { name: "Black", value: "#000000" },
        { name: "Gray", value: "#718096" },
      ],
      sizes: ["US 7", "US 8", "US 9", "US 10"],
      featured: true,
      inStock: true,
      stock: 8,
      specifications: {
        material: "Premium Leather",
        weight: "280g",
        sole: "Cloud Foam",
        closure: "Lace-Up",
      },
      features: ["Cloud Foam Cushioning", "Premium Leather Upper", "Enhanced Arch Support", "Flexible Design"],
      addedDate: new Date().toISOString(),
      priority: "medium",
    },
    {
      id: 3,
      productId: 3,
      images: ["/assets/img/exercise-sneakers-men-isolated-white-background_506134-17127.jpg", "/assets/img/orange shoes.jpg"],
      title: "Adidas Summer Collection",
      description: "Breathable sports shoes perfect for summer activities with advanced ventilation system and stylish design.",
      price: 360.0,
      originalPrice: 400.0,
      discountPercentage: 10,
      rating: 5.0,
      reviewCount: 156,
      category: "Footwear",
      tags: ["New", "Trending", "Summer"],
      colors: [
        { name: "Navy", value: "#1e40af" },
        { name: "Red", value: "#dc2626" },
        { name: "Green", value: "#059669" },
      ],
      sizes: ["US 8", "US 9", "US 10", "US 11"],
      featured: true,
      inStock: true,
      stock: 6,
      specifications: {
        material: "Breathable Fabric",
        weight: "250g",
        sole: "Lightweight Foam",
        closure: "Lace-Up",
      },
      features: ["Summer Breathable Design", "Lightweight Construction", "Quick Dry Technology", "Style & Comfort"],
      addedDate: new Date().toISOString(),
      priority: "high",
    },
  ];

  // ✅ دالة محسنة لعرض النجوم
  const renderStars = useCallback((rating) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;

      if (rating >= starValue) {
        return <FaStar key={index} className="text-warning" />;
      } else if (rating >= starValue - 0.5) {
        return <FaStarHalfAlt key={index} className="text-warning" />;
      } else {
        return <FaRegStar key={index} className="text-muted" />;
      }
    });
  }, []);

  // ✅ دالة لتنسيق السعر
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  }, []);

  // ✅ إضافة إلى السلة مع التتبع
  const addToCart = useCallback(
    (product, e, source = 'card') => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const cartItem = {
        id: product.id.toString(),
        name: product.title,
        price: product.price,
        quantity: quantity,
        image: product.images?.[0],
        category: product.category,
        description: product.description,
        color: selectedColor,
        size: selectedSize,
      };

      addItem(cartItem);

      // ✅ تتبع إضافة إلى السلة
      trackAddToCart(product, quantity, {
        source: source,
        section: 'featured_products',
        color: selectedColor?.name,
        size: selectedSize,
        timestamp: new Date().toISOString()
      });

      // إظهار تأكيد الإضافة
      if (quickView) {
        console.log("Product added to cart:", product.title);
      }
    },
    [addItem, quantity, selectedColor, selectedSize, quickView, trackAddToCart]
  );

  // ✅ فتح QuickView مع التتبع
  const openQuickView = useCallback((product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setQuickView(product);
    setSelectedColor(product.colors?.[0] || null);
    setSelectedSize(product.sizes?.[0] || null);
    setQuantity(1);
    setActiveImageIndex(0);

    // ✅ تتبع فتح QuickView
    trackEvent('quickview_open', {
      product_id: product.id,
      product_name: product.title,
      source: 'featured_products',
      section: 'features',
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  // ✅ إغلاق QuickView
  const closeQuickView = useCallback(() => {
    setQuickView(null);
    setSelectedColor(null);
    setSelectedSize(null);
    setQuantity(1);
    setActiveImageIndex(0);
  }, []);

  // ✅ زيادة الكمية
  const increaseQuantity = useCallback(() => {
    setQuantity((prev) => prev + 1);
  }, []);

  // ✅ تقليل الكمية
  const decreaseQuantity = useCallback(() => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }, []);

  // ✅ معالجة أخطاء الصور
  const handleImageError = useCallback((productId) => {
    setImageErrors((prev) => ({ ...prev, [productId]: true }));
  }, []);

  // ✅ تأكيد تحميل الصور
  const handleImageLoad = useCallback((productId) => {
    setImageLoaded((prev) => ({ ...prev, [productId]: true }));
  }, []);

  // ✅ إدارة hover بالكارد
  const handleCardHover = useCallback((productId) => {
    setHoveredCard(productId);
  }, []);

  const handleCardLeave = useCallback(() => {
    setHoveredCard(null);
  }, []);

  // ✅ إضافة/إزالة من المفضلة مع التتبع
  const handleToggleWishlist = useCallback(
    (product, e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const wishlistProduct = {
        ...product,
        productId: product.productId || product.id,
        images: product.images || [product.img],
        addedDate: product.addedDate || new Date().toISOString(),
        priority: product.priority || "medium",
        note: product.note || "",
      };

      const isAdding = !isInWishlist(product.productId || product.id);
      
      toggleWishlist(wishlistProduct);

      // ✅ تتبع إضافة/إزالة من المفضلة
      trackEvent('wishlist_toggle', {
        product_id: product.id,
        product_name: product.title,
        action: isAdding ? 'add' : 'remove',
        source: 'featured_products',
        section: 'features',
        timestamp: new Date().toISOString()
      });
    },
    [toggleWishlist, isInWishlist, trackEvent]
  );

  // ✅ التنقل لصفحة المنتج مع التتبع
  const handleProductClick = useCallback(
    (productId, product, e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // ✅ تتبع عرض المنتج
      trackProductView(product, {
        source: 'featured_products_card',
        section: 'features',
        timestamp: new Date().toISOString()
      });
      
      navigate(`/singleproduct/${productId}`);
    },
    [navigate, trackProductView]
  );

  // ✅ الحصول على مصدر الصورة
  const getImageSource = useCallback(
    (product, index = 0) => {
      const imageSrc = product.images?.[index] || product.img;

      if (imageErrors[product.id]) {
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iMTUwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+";
      }

      return imageSrc;
    },
    [imageErrors]
  );

  // ✅ QuickView Modal Component - مصغر
  const QuickViewModal = useCallback(
    () => (
      <AnimatePresence>
        {quickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal show d-block"
            style={{
              backgroundColor: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(5px)",
            }}
            onClick={closeQuickView}
          >
            <motion.div initial={{ scale: 0.8, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 50 }} className="modal-dialog modal-lg modal-dialog-centered quickview-modal" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "85vh" }}>
              <div
                className="modal-content border-0 h-100"
                style={{
                  borderRadius: "15px",
                  background: darkMode ? "#1e293b" : "#ffffff",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                  maxHeight: "85vh",
                  overflow: "hidden",
                }}
              >
                {/* Header مضغوط */}
                <div className="modal-header border-0 position-relative py-3">
                  <div className="d-flex align-items-center w-100">
                    {quickView.discountPercentage > 0 && (
                      <Badge bg="danger" className="px-2 py-1 fw-bold me-2" style={{ fontSize: "0.75rem" }}>
                        -{quickView.discountPercentage}%
                      </Badge>
                    )}
                    <h6
                      className="modal-title fw-bold mb-0 flex-grow-1"
                      style={{
                        color: darkMode ? "#f1f5f9" : "#1e293b",
                        fontSize: "1rem",
                      }}
                    >
                      {quickView.title}
                    </h6>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeQuickView}
                      style={{
                        filter: darkMode ? "invert(1)" : "none",
                      }}
                    ></button>
                  </div>
                </div>

                <div className="modal-body p-3" style={{ overflowY: "auto", maxHeight: "calc(85vh - 120px)" }}>
                  <div className="row g-3">
                    {/* Images Section - مصغر */}
                    <div className="col-md-5">
                      <div className="position-relative">
                        {/* Main Image */}
                        <div className="text-center">
                          <img
                            src={quickView.images?.[activeImageIndex]}
                            alt={quickView.title}
                            className="img-fluid rounded-2"
                            style={{
                              height: "200px",
                              width: "100%",
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                            onError={() => handleImageError(quickView.id)}
                          />
                        </div>

                        {/* Thumbnail Images */}
                        {quickView.images && quickView.images.length > 1 && (
                          <div className="d-flex justify-content-center gap-1 mt-2">
                            {quickView.images.slice(0, 3).map((image, index) => (
                              <div
                                key={index}
                                className={`thumbnail ${activeImageIndex === index ? "active" : ""}`}
                                onClick={() => {
                                  setActiveImageIndex(index);
                                  trackEvent('quickview_image_change', {
                                    product_id: quickView.id,
                                    image_index: index,
                                    timestamp: new Date().toISOString()
                                  });
                                }}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "8px",
                                  overflow: "hidden",
                                  cursor: "pointer",
                                  border: activeImageIndex === index ? (darkMode ? "2px solid #00ffcc" : "2px solid #667eea") : "1px solid transparent",
                                  opacity: activeImageIndex === index ? 1 : 0.6,
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <img src={image} alt={`${quickView.title} ${index + 1}`} className="w-100 h-100" style={{ objectFit: "cover" }} onError={() => handleImageError(quickView.id)} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Details - مضغوط */}
                    <div className="col-md-7">
                      <div className="d-flex flex-column h-100">
                        {/* Rating and Price مضغوط */}
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="d-flex align-items-center">
                            <div className="d-flex align-items-center me-2">{renderStars(quickView.rating)}</div>
                            <small
                              className="fw-semibold me-2"
                              style={{
                                color: darkMode ? "#cbd5e0" : "#475569",
                              }}
                            >
                              {quickView.rating}
                            </small>
                            <small className="text-muted">({quickView.reviewCount})</small>
                          </div>

                          <div className="text-end">
                            <h5
                              className="fw-bold mb-0"
                              style={{
                                color: darkMode ? "#00ffcc" : "#667eea",
                              }}
                            >
                              {formatPrice(quickView.price)}
                            </h5>
                            {quickView.originalPrice && (
                              <small className="text-decoration-line-through" style={{ color: darkMode ? "#94a3b8" : "#94a3b8" }}>
                                {formatPrice(quickView.originalPrice)}
                              </small>
                            )}
                          </div>
                        </div>

                        {/* Description مختصر */}
                        <p
                          className="small mb-3"
                          style={{
                            color: darkMode ? "#cbd5e0" : "#64748b",
                            lineHeight: "1.4",
                          }}
                        >
                          {quickView.description}
                        </p>

                        {/* Color Selection مضغوط */}
                        {quickView.colors && quickView.colors.length > 0 && (
                          <div className="mb-3">
                            <small
                              className="fw-semibold mb-1 d-block"
                              style={{
                                color: darkMode ? "#f1f5f9" : "#1e293b",
                              }}
                            >
                              Color:
                            </small>
                            <div className="d-flex gap-1">
                              {quickView.colors.map((color, index) => (
                                <button
                                  key={index}
                                  className={`btn rounded-circle p-0 border ${selectedColor === color ? "border-primary" : "border-secondary"}`}
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    background: color,
                                    borderWidth: "2px",
                                  }}
                                  onClick={() => {
                                    setSelectedColor(color);
                                    trackEvent('quickview_color_select', {
                                      product_id: quickView.id,
                                      color: color.name,
                                      timestamp: new Date().toISOString()
                                    });
                                  }}
                                  title={`Color ${index + 1}`}
                                >
                                  {selectedColor === color && <FaCheck className="text-white" size={8} />}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Size Selection مضغوط */}
                        {quickView.sizes && quickView.sizes.length > 0 && (
                          <div className="mb-3">
                            <small
                              className="fw-semibold mb-1 d-block"
                              style={{
                                color: darkMode ? "#f1f5f9" : "#1e293b",
                              }}
                            >
                              Size:
                            </small>
                            <div className="d-flex flex-wrap gap-1">
                              {quickView.sizes.map((size, index) => (
                                <button
                                  key={index}
                                  className={`btn ${selectedSize === size ? "btn-primary" : darkMode ? "btn-outline-light" : "btn-outline-dark"} py-1 px-2`}
                                  style={{
                                    borderRadius: "6px",
                                    fontSize: "0.75rem",
                                    minWidth: "40px",
                                  }}
                                  onClick={() => {
                                    setSelectedSize(size);
                                    trackEvent('quickview_size_select', {
                                      product_id: quickView.id,
                                      size: size,
                                      timestamp: new Date().toISOString()
                                    });
                                  }}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quantity and Add to Cart مضغوط */}
                        <div className="mt-auto">
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <small
                              className="fw-semibold"
                              style={{
                                color: darkMode ? "#f1f5f9" : "#1e293b",
                              }}
                            >
                              Qty:
                            </small>
                            <div className="d-flex align-items-center border rounded-pill">
                              <button
                                className="btn btn-link text-decoration-none p-1"
                                onClick={decreaseQuantity}
                                style={{
                                  color: darkMode ? "#00ffcc" : "#667eea",
                                  width: "30px",
                                  height: "30px",
                                }}
                              >
                                <FaMinus size={10} />
                              </button>
                              <span
                                className="mx-2 fw-bold"
                                style={{
                                  color: darkMode ? "#f1f5f9" : "#1e293b",
                                  minWidth: "20px",
                                  textAlign: "center",
                                  fontSize: "0.9rem",
                                }}
                              >
                                {quantity}
                              </span>
                              <button
                                className="btn btn-link text-decoration-none p-1"
                                onClick={increaseQuantity}
                                style={{
                                  color: darkMode ? "#00ffcc" : "#667eea",
                                  width: "30px",
                                  height: "30px",
                                }}
                              >
                                <FaPlus size={10} />
                              </button>
                            </div>

                            <div className="flex-grow-1 text-end">
                              <small
                                className="fw-bold"
                                style={{
                                  color: darkMode ? "#00ffcc" : "#667eea",
                                }}
                              >
                                Total: {formatPrice(quickView.price * quantity)}
                              </small>
                            </div>
                          </div>

                          {/* Action Buttons مضغوطة */}
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-primary flex-fill py-2 fw-semibold"
                              style={{
                                background: "linear-gradient(135deg, #667eea, #764ba2)",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "0.9rem",
                              }}
                              onClick={(e) => addToCart(quickView, e, 'quickview')}
                            >
                              <FaShoppingCart className="me-1" size={12} />
                              Add to Cart
                            </button>

                            <button
                              className={`btn ${isInWishlist(quickView.productId || quickView.id) ? "btn-danger" : darkMode ? "btn-outline-light" : "btn-outline-dark"} py-2`}
                              style={{
                                borderRadius: "8px",
                                width: "40px",
                              }}
                              onClick={(e) => handleToggleWishlist(quickView, e)}
                            >
                              <FaHeart size={12} className={isInWishlist(quickView.productId || quickView.id) ? "text-white" : ""} />
                            </button>
                          </div>
                        </div>

                        {/* Quick Features */}
                        <div className="d-flex justify-content-around text-center mt-3 pt-3 border-top">
                          <div>
                            <FaTruck className="text-primary mb-1" size={14} />
                            <div
                              className="small"
                              style={{
                                color: darkMode ? "#cbd5e0" : "#64748b",
                                fontSize: "0.7rem",
                              }}
                            >
                              Free Shipping
                            </div>
                          </div>
                          <div>
                            <FaShieldAlt className="text-success mb-1" size={14} />
                            <div
                              className="small"
                              style={{
                                color: darkMode ? "#cbd5e0" : "#64748b",
                                fontSize: "0.7rem",
                              }}
                            >
                              Warranty
                            </div>
                          </div>
                          <div>
                            <FaSync className="text-info mb-1" size={14} />
                            <div
                              className="small"
                              style={{
                                color: darkMode ? "#cbd5e0" : "#64748b",
                                fontSize: "0.7rem",
                              }}
                            >
                              Returns
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer مضغوط */}
                <div className="modal-footer border-0 py-2">
                  <div className="d-flex gap-2 w-100 justify-content-end">
                    <Link
                      to={`/singleproduct/${quickView.id}`}
                      className="btn btn-outline-primary btn-sm"
                      style={{
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                      }}
                      onClick={() => {
                        closeQuickView();
                        trackEvent('quickview_full_details_click', {
                          product_id: quickView.id,
                          product_name: quickView.title,
                          timestamp: new Date().toISOString()
                        });
                      }}
                    >
                      Full Details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    ),
    [quickView, darkMode, activeImageIndex, selectedColor, selectedSize, quantity, closeQuickView, handleImageError, renderStars, formatPrice, isInWishlist, handleToggleWishlist, addToCart, decreaseQuantity, increaseQuantity, trackEvent]
  );

  // variants للرسوم المتحركة
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      y: 30,
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      className="py-5"
      style={{
        background: darkMode ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      }}
    >
      <Container>
        {/* Header Section */}
        <motion.div className="text-center mb-5" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <span
            className="badge mb-3 px-4 py-2 fw-semibold"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              fontSize: "0.9rem",
            }}
          >
            ⭐ Featured Collection
          </span>

          <h2 className="fw-bold mb-3 display-5">
            <span
              style={{
                background: darkMode ? "linear-gradient(135deg, #00ffcc, #00b894)" : "linear-gradient(135deg, #667eea, #764ba2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Featured Products
            </span>
          </h2>
          <p
            className="fs-5 mx-auto"
            style={{
              color: darkMode ? "#cbd5e0" : "#64748b",
              maxWidth: "600px",
            }}
          >
            Discover our handpicked selection of premium products. Quality meets style in every item.
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          <Row className="g-4">
            {products.map((product) => (
              <Col key={product.id} xs={12} md={6} lg={4}>
                <motion.div variants={cardVariants} whileHover="hover" onHoverStart={() => handleCardHover(product.id)} onHoverEnd={handleCardLeave}>
                  <Card
                    className="h-100 border-0 product-card position-relative overflow-hidden"
                    style={{
                      background: darkMode ? "#1e293b" : "#ffffff",
                      borderRadius: "20px",
                      cursor: "pointer",
                      transition: "all 0.4s ease",
                    }}
                    onClick={(e) => handleProductClick(product.id, product, e)}
                  >
                    {/* Product Image Container */}
                    <div className="position-relative overflow-hidden">
                      <Card.Img
                        variant="top"
                        src={getImageSource(product)}
                        alt={product.title}
                        onError={() => handleImageError(product.id)}
                        onLoad={() => handleImageLoad(product.id)}
                        style={{
                          height: "280px",
                          objectFit: "cover",
                          transition: "transform 0.6s ease",
                          transform: hoveredCard === product.id ? "scale(1.1)" : "scale(1)",
                          opacity: imageLoaded[product.id] ? 1 : 0.7,
                          transition: "opacity 0.3s ease, transform 0.6s ease",
                        }}
                      />

                      {/* Loading Spinner */}
                      {!imageLoaded[product.id] && !imageErrors[product.id] && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: darkMode ? "#374151" : "#f3f4f6" }}>
                          <Spinner animation="border" variant={darkMode ? "light" : "primary"} role="status">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        </div>
                      )}

                      {/* Overlay with Actions */}
                      <motion.div
                        className="position-absolute top-0 end-0 m-3 d-flex flex-column gap-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{
                          opacity: hoveredCard === product.id ? 1 : 0.7,
                          x: hoveredCard === product.id ? 0 : 20,
                        }}
                      >
                        {/* زر المفضلة */}
                        <button className={`btn rounded-circle p-2 shadow ${isInWishlist(product.productId || product.id) ? "btn-danger" : "btn-light"}`} style={{ width: "40px", height: "40px" }} aria-label={`${isInWishlist(product.productId || product.id) ? "Remove from" : "Add to"} wishlist`} onClick={(e) => handleToggleWishlist(product, e)}>
                          <FaHeart className={isInWishlist(product.productId || product.id) ? "text-white" : darkMode ? "text-dark" : "text-muted"} />
                        </button>

                        {/* زر QuickView - العين */}
                        <button className="btn btn-light rounded-circle p-2 shadow d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }} aria-label={`Quick view ${product.title}`} onClick={(e) => openQuickView(product, e)}>
                          <FaEye className={darkMode ? "text-dark" : "text-muted"} />
                        </button>
                      </motion.div>

                      {/* Badges */}
                      <div className="position-absolute top-0 start-0 m-3 d-flex flex-column gap-2">
                        {product.discountPercentage > 0 && (
                          <Badge bg="danger" className="px-3 py-2 fw-semibold" style={{ fontSize: "0.8rem" }}>
                            -{product.discountPercentage}%
                          </Badge>
                        )}
                        {product.featured && (
                          <Badge bg="success" className="px-3 py-2 fw-semibold" style={{ fontSize: "0.8rem" }}>
                            FEATURED
                          </Badge>
                        )}
                        {!product.inStock && (
                          <Badge bg="secondary" className="px-3 py-2 fw-semibold" style={{ fontSize: "0.8rem" }}>
                            OUT OF STOCK
                          </Badge>
                        )}
                      </div>

                      {/* Quick Add to Cart */}
                      <motion.div
                        className="position-absolute bottom-0 start-0 end-0 p-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: hoveredCard === product.id && product.inStock ? 1 : 0,
                          y: hoveredCard === product.id && product.inStock ? 0 : 20,
                        }}
                      >
                        <button
                          className="btn btn-primary w-100 fw-semibold py-3"
                          style={{
                            background: "linear-gradient(135deg, #667eea, #764ba2)",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "0.9rem",
                          }}
                          onClick={(e) => addToCart(product, e, 'card_hover')}
                          disabled={!product.inStock}
                        >
                          <FaShoppingCart className="me-2" />
                          {product.inStock ? "Add to Cart" : "Out of Stock"}
                        </button>
                      </motion.div>
                    </div>

                    <Card.Body className="p-4 d-flex flex-column">
                      {/* Product Info */}
                      <div className="flex-grow-1">
                        {/* Category Tags */}
                        <div className="mb-2">
                          {product.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} bg={darkMode ? "light" : "secondary"} text={darkMode ? "dark" : "light"} className="me-1 mb-1" style={{ fontSize: "0.7rem" }}>
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Title */}
                        <h5
                          className="mb-2"
                          style={{
                            color: darkMode ? "#f1f5f9" : "#1e293b",
                            lineHeight: "1.4",
                          }}
                        >
                          {product.title}
                        </h5>

                        {/* Description */}
                        <p
                          className="small mb-3"
                          style={{
                            color: darkMode ? "#94a3b8" : "#64748b",
                            lineHeight: "1.5",
                          }}
                        >
                          {product.description}
                        </p>

                        {/* Color Options */}
                        <div className="mb-3">
                          <span className="small fw-semibold" style={{ color: darkMode ? "#cbd5e0" : "#475569" }}>
                            Colors:
                          </span>
                          <div className="d-flex gap-2 mt-1">
                            {product.colors.map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="rounded-circle border"
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  background: color.value,
                                  cursor: "pointer",
                                  border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
                                }}
                                title={color.name}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Rating and Price */}
                      <div>
                        {/* Rating */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="d-flex align-items-center gap-1">
                            {renderStars(product.rating)}
                            <small className="ms-1 fw-semibold" style={{ color: darkMode ? "#cbd5e0" : "#475569" }}>
                              ({product.rating})
                            </small>
                          </div>
                          <small className="text-muted" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                            {product.reviewCount} reviews
                          </small>
                        </div>

                        {/* Price */}
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span
                              className="h4 fw-bold me-2"
                              style={{
                                color: darkMode ? "#00ffcc" : "#667eea",
                              }}
                            >
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && product.discountPercentage > 0 && (
                              <span className="text-decoration-line-through small" style={{ color: darkMode ? "#94a3b8" : "#94a3b8" }}>
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>

                          {/* Quick Action */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="btn btn-outline-primary rounded-circle p-2"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderColor: darkMode ? "#00ffcc" : "#667eea",
                              color: darkMode ? "#00ffcc" : "#667eea",
                            }}
                            onClick={(e) => addToCart(product, e, 'quick_button')}
                            disabled={!product.inStock}
                            aria-label={`Quick add ${product.title} to cart`}
                          >
                            <FaShoppingCart />
                          </motion.button>
                        </div>

                        {/* Stock Info */}
                        {product.stock < 10 && product.inStock && (
                          <div className="mt-2">
                            <small className="text-warning fw-semibold">Only {product.stock} left in stock!</small>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* View All Button */}
        <motion.div className="text-center mt-5" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}>
          <button
            onClick={() => {
              trackEvent('view_all_products_click', {
                source: 'featured_products_section',
                section: 'features',
                timestamp: new Date().toISOString()
              });
              navigate("/products");
            }}
            className="btn btn-outline-primary btn-lg px-5 py-3 fw-semibold"
            style={{
              borderRadius: "50px",
              borderWidth: "2px",
              color: darkMode ? "#00ffcc" : "#667eea",
              borderColor: darkMode ? "#00ffcc" : "#667eea",
              background: "transparent",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = darkMode ? "#00ffcc" : "#667eea";
              e.target.style.color = darkMode ? "#1e293b" : "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = darkMode ? "#00ffcc" : "#667eea";
            }}
          >
            View All Products
          </button>
        </motion.div>
      </Container>

      {/* QuickView Modal */}
      <QuickViewModal />

      <style>
        {`
          .product-card {
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
         
          .product-card:hover {
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          }
         
          .btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            border: none;
          }
         
          .btn-primary:hover:not(:disabled) {
            background: linear-gradient(135deg, #764ba2, #667eea);
            transform: translateY(-2px);
          }

          .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .btn-outline-primary:hover:not(:disabled) {
            transform: translateY(-2px);
          }

          .thumbnail:hover {
            opacity: 1 !important;
            transform: scale(1.05);
          }

          .thumbnail.active {
            opacity: 1;
            border-color: #667eea !important;
          }

          @media (max-width: 768px) {
            .modal-dialog {
              margin: 20px;
            }
           
            .modal-content {
              border-radius: 15px !important;
            }
          }
                .quickview-modal {
      max-width: 600px;
    }
   
    .thumbnail:hover {
      opacity: 1 !important;
      transform: scale(1.05);
    }

    .thumbnail.active {
      opacity: 1;
      border-color: #667eea !important;
    }

    /* إخفاء scrollbar ولكن مع الحفاظ على functionality */
    .modal-body::-webkit-scrollbar {
      width: 4px;
    }

    .modal-body::-webkit-scrollbar-track {
      background: transparent;
    }

    .modal-body::-webkit-scrollbar-thumb {
      background: #667eea;
      border-radius: 2px;
    }

    @media (max-width: 768px) {
      .quickview-modal {
        margin: 10px;
      }
     
      .modal-content {
        border-radius: 12px !important;
      }
    }
        `}
      </style>
    </section>
  );
}

export default Features;