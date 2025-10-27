import React, { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { apiValue } from "../../constants/AllData";
import { useCart } from "react-use-cart";
import { useWishlist } from "../../context/WishlistContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaRocket,
  FaFire,
  FaClock,
  FaStar,
  FaHeart,
  FaShoppingCart,
  FaEye,
  FaSearch,
  FaFilter,
  FaTimes,
  FaSortAmountDown,
  FaTag,
  FaBolt,
  FaRegClock,
  FaCalendarAlt,
  FaShippingFast,
  FaCheckCircle,
  FaArrowRight,
  FaRegHeart
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/Page.css";

function NewArrivalsPage() {
  const data = useContext(apiValue);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { 
    addToWishlist, 
    removeFromWishlist, 
    isInWishlist,
    getWishlistCount 
  } = useWishlist();

  // State management
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlistNotification, setWishlistNotification] = useState(null);
  const [quickView, setQuickView] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(12);

  // إشعار عند إضافة/إزالة من المفضلة
  const showWishlistNotification = (message, type = 'success') => {
    setWishlistNotification({ message, type });
    setTimeout(() => setWishlistNotification(null), 3000);
  };

  // Simulate new arrivals
  const newArrivals = useMemo(() => {
    const recentProducts = [...data]
      .sort(() => Math.random() - 0.5)
      .slice(0, 30)
      .map((product, index) => ({
        ...product,
        isNew: true,
        daysAgo: Math.floor(Math.random() * 14) + 1,
        isTrending: Math.random() > 0.7,
        isLimited: Math.random() > 0.8,
      }));
    
    return recentProducts;
  }, [data]);

  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(newArrivals.map(item => item.category))];
    return ["All", ...uniqueCategories];
  }, [newArrivals]);

  // Calculate price stats
  const priceStats = useMemo(() => {
    if (!newArrivals.length) return { min: 0, max: 1000 };
    const prices = newArrivals.map(item => item.price);
    const maxPrice = Math.ceil(Math.max(...prices));
    return {
      min: Math.floor(Math.min(...prices)),
      max: maxPrice < 1000 ? 1000 : maxPrice
    };
  }, [newArrivals]);

  // Filter and sort products
  const filteredData = useMemo(() => {
    let filtered = newArrivals.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                           item.description?.toLowerCase().includes(search.toLowerCase()) ||
                           item.brand?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => a.daysAgo - b.daysAgo);
        break;
      case "trending":
        filtered.sort((a, b) => {
          if (a.isTrending && !b.isTrending) return -1;
          if (!a.isTrending && b.isTrending) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        filtered.sort((a, b) => a.daysAgo - b.daysAgo);
    }

    return filtered;
  }, [newArrivals, search, selectedCategory, priceRange, sortBy]);

  // Displayed products with pagination
  const displayedProducts = useMemo(() => {
    return filteredData.slice(0, visibleProducts);
  }, [filteredData, visibleProducts]);

  // Load more products
  const loadMoreProducts = () => {
    setVisibleProducts(prev => prev + 12);
  };

  // Reset visible products when filters change
  useEffect(() => {
    setVisibleProducts(12);
  }, [search, selectedCategory, priceRange, sortBy]);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const difference = endOfDay - now;
      
      if (difference > 0) {
        return {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      return { hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handlers
  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleAddToCart = useCallback((item, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    addItem(item);
  }, [addItem]);

  // دالة جديدة للتعامل مع المفضلة
  const handleWishlistToggle = useCallback((item, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
      showWishlistNotification('تمت الإزالة من المفضلة', 'info');
    } else {
      addToWishlist(item);
      showWishlistNotification('تمت الإضافة إلى المفضلة', 'success');
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory("All");
    setPriceRange([0, priceStats.max]);
    setSortBy("newest");
  }, [priceStats.max]);

  const handleProductClick = useCallback((itemId, e) => {
    if (!e.target.closest('button') && !e.target.closest('a')) {
      navigate(`/singleproduct/${itemId}`);
    }
  }, [navigate]);

  // New Arrival Badge Component
  const NewArrivalBadge = ({ daysAgo, isTrending, isLimited }) => {
    if (daysAgo <= 3) {
      return (
        <span className="badge bg-danger new-badge">
          <FaBolt className="me-1" />
          Just In
        </span>
      );
    } else if (isTrending) {
      return (
        <span className="badge bg-warning new-badge">
          <FaFire className="me-1" />
          Trending
        </span>
      );
    } else if (isLimited) {
      return (
        <span className="badge bg-info new-badge">
          <FaClock className="me-1" />
          Limited
        </span>
      );
    } else {
      return (
        <span className="badge bg-success new-badge">
          <FaRocket className="me-1" />
          New
        </span>
      );
    }
  };

  // Days ago text
  const getDaysText = (daysAgo) => {
    if (daysAgo === 1) return "Yesterday";
    if (daysAgo <= 7) return `${daysAgo} days ago`;
    return "Recently";
  };

  // Countdown Timer Component
  const CountdownTimer = () => (
    <div className="countdown-timer">
      <div className="countdown-header">
        <FaClock className="me-2" />
        <strong>Today's New Arrivals End In:</strong>
      </div>
      <div className="countdown-display">
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.hours?.toString().padStart(2, '0')}</span>
          <span className="countdown-label">HRS</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.minutes?.toString().padStart(2, '0')}</span>
          <span className="countdown-label">MIN</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.seconds?.toString().padStart(2, '0')}</span>
          <span className="countdown-label">SEC</span>
        </div>
      </div>
    </div>
  );

  // Product Card Component - محدث بدعم Wishlist
  const ProductCard = React.memo(({ item, index }) => {
    const isInWishlistItem = isInWishlist(item.id);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="new-arrival-card-item"
      >
        <div 
          className="card product-card h-100 border-0 shadow-sm" 
          onClick={(e) => handleProductClick(item.id, e)}
          style={{ cursor: 'pointer' }}
        >
          {/* Product Image with Overlay */}
          <div className="position-relative overflow-hidden">
            <div className="image-container" style={{ height: '220px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
              <img
                src={item.images?.[0] || "/assets/img/placeholder.jpg"}
                className="card-img-top product-image"
                alt={item.title}
                loading="lazy"
                onError={(e) => {
                  const img = e.target;
                  if (item.images?.[1]) {
                    img.src = item.images[1];
                  } else {
                    img.src = `data:image/svg+xml;base64,${btoa(`
                      <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#f8f9fa"/>
                        <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#999" text-anchor="middle" dy=".3em">
                          ${item.title}
                        </text>
                      </svg>
                    `)}`;
                  }
                }}
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>
            
            {/* Badges Container */}
            <div className="corner-badges">
              {/* New Arrival Badge */}
              <div className="corner-badge top-left">
                <NewArrivalBadge 
                  daysAgo={item.daysAgo} 
                  isTrending={item.isTrending}
                  isLimited={item.isLimited}
                />
              </div>
              
              {/* Discount Badge */}
              {item.discountPercentage > 0 && (
                <div className="corner-badge top-right">
                  <span className="badge bg-danger discount-badge">
                    ⚡ -{Math.round(item.discountPercentage)}%
                  </span>
                </div>
              )}
              
              {/* Limited Stock Badge */}
              {item.isLimited && item.stock < 20 && (
                <div className="corner-badge bottom-left">
                  <span className="badge bg-warning stock-badge">
                    Only {item.stock} left!
                  </span>
                </div>
              )}
              
              {/* Days Ago Badge */}
              <div className="corner-badge bottom-right">
                <span className="badge bg-dark time-badge">
                  <FaRegClock className="me-1" />
                  {getDaysText(item.daysAgo)}
                </span>
              </div>
            </div>

            {/* Quick Actions Overlay */}
            <div className="quick-actions-overlay">
              <div className="action-buttons">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="action-btn view-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuickView(item);
                  }}
                  title="Quick View"
                >
                  <FaEye />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="action-btn cart-btn"
                  onClick={(e) => handleAddToCart(item, e)}
                  title="Add to Cart"
                >
                  <FaShoppingCart />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`action-btn wishlist-btn ${isInWishlistItem ? 'active' : ''}`}
                  onClick={(e) => handleWishlistToggle(item, e)}
                  title={isInWishlistItem ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <FaHeart className={isInWishlistItem ? 'text-danger' : ''} />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="card-body d-flex flex-column">
            {/* Category */}
            <div className="mb-2">
              <span className="badge bg-light text-dark small">{item.category}</span>
            </div>

            {/* Title */}
            <h6 className="card-title fw-semibold mb-2 flex-grow-1 product-title">
              <Link 
                to={`/singleproduct/${item.id}`}
                className="text-decoration-none text-dark"
                onClick={(e) => e.stopPropagation()}
              >
                {item.title}
              </Link>
            </h6>

            {/* Rating */}
            <div className="d-flex align-items-center mb-2">
              <div className="d-flex align-items-center me-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < Math.floor(item.rating || 0) 
                        ? "text-warning" 
                        : "text-muted"
                    } me-1`}
                    size={12}
                  />
                ))}
              </div>
              <small className="text-muted">({item.rating || "N/A"})</small>
            </div>

            {/* Price and Add to Cart */}
            <div className="d-flex align-items-center justify-content-between mt-auto">
              <div>
                <span className="h5 fw-bold text-primary mb-0">
                  ${item.price}
                </span>
                {item.originalPrice && (
                  <span className="text-muted text-decoration-line-through small ms-2">
                    ${item.originalPrice}
                  </span>
                )}
              </div>
              
              {/* Add to Cart Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleAddToCart(item, e)}
                className="btn btn-primary btn-sm"
              >
                <FaShoppingCart className="me-1" />
                Add
              </motion.button>
            </div>

            {/* Stock Progress for Limited Items */}
            {item.isLimited && item.stock < 20 && (
              <div className="mt-2">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Selling Fast</span>
                  <span>{item.stock} left</span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar bg-warning" 
                    style={{ width: `${((20 - item.stock) / 20) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  });

  // Quick View Modal - محدث بدعم Wishlist
  const QuickViewModal = useCallback(() => {
    const isInWishlistItem = quickView ? isInWishlist(quickView.id) : false;
    
    return (
      <AnimatePresence>
        {quickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setQuickView(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="modal-dialog modal-lg modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <div className="d-flex align-items-center">
                    <NewArrivalBadge 
                      daysAgo={quickView.daysAgo}
                      isTrending={quickView.isTrending}
                      isLimited={quickView.isLimited}
                    />
                    <h5 className="modal-title ms-2">{quickView.title}</h5>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setQuickView(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <img
                        src={quickView.images?.[0]}
                        alt={quickView.title}
                        className="img-fluid rounded"
                        style={{ height: '300px', objectFit: 'cover', width: '100%' }}
                      />
                    </div>
                    <div className="col-md-6">
                      <h4 className="text-primary">${quickView.price}</h4>
                      {quickView.discountPercentage > 0 && (
                        <div className="mb-2">
                          <span className="text-muted text-decoration-line-through me-2">
                            ${quickView.originalPrice}
                          </span>
                          <span className="badge bg-danger">
                            Save {Math.round(quickView.discountPercentage)}%
                          </span>
                        </div>
                      )}

                      <div className="d-flex align-items-center mb-3">
                        <div className="d-flex align-items-center me-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`${
                                i < Math.floor(quickView.rating || 0) 
                                  ? "text-warning" 
                                  : "text-muted"
                              } me-1`}
                            />
                          ))}
                        </div>
                        <span className="text-muted">({quickView.rating || "N/A"})</span>
                      </div>

                      <div className="new-arrival-info mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <small className="text-muted">
                            <FaCalendarAlt className="me-1" />
                            Added {getDaysText(quickView.daysAgo)}
                          </small>
                          {quickView.isTrending && (
                            <small className="text-warning">
                              <FaFire className="me-1" />
                              Trending Now
                            </small>
                          )}
                          {quickView.isLimited && (
                            <small className="text-danger">
                              <FaClock className="me-1" />
                              Limited Stock
                            </small>
                          )}
                        </div>
                      </div>

                      <p className="text-muted">{quickView.description}</p>

                      <div className="d-flex gap-2 mt-4">
                        <button
                          onClick={(e) => {
                            handleAddToCart(quickView, e);
                            setQuickView(null);
                          }}
                          className="btn btn-primary flex-fill"
                        >
                          <FaShoppingCart className="me-2" />
                          Add to Cart
                        </button>
                        
                        {/* زر Wishlist في الـ Quick View */}
                        <button
                          onClick={(e) => handleWishlistToggle(quickView, e)}
                          className={`btn ${isInWishlistItem ? 'btn-danger' : 'btn-outline-danger'}`}
                        >
                          <FaHeart className="me-2" />
                          {isInWishlistItem ? 'In Wishlist' : 'Add to Wishlist'}
                        </button>
                        
                        <Link
                          to={`/singleproduct/${quickView.id}`}
                          className="btn btn-outline-primary"
                          onClick={() => setQuickView(null)}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }, [quickView, handleAddToCart, handleWishlistToggle, isInWishlist]);

  // Collection statistics
  const collectionStats = useMemo(() => {
    const total = newArrivals.length;
    const trending = newArrivals.filter(item => item.isTrending).length;
    const limited = newArrivals.filter(item => item.isLimited).length;
    const justIn = newArrivals.filter(item => item.daysAgo <= 3).length;

    return { total, trending, limited, justIn };
  }, [newArrivals]);

  // Wishlist Notification Component
  const WishlistNotification = () => (
    <AnimatePresence>
      {wishlistNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`wishlist-notification alert ${
            wishlistNotification.type === 'success' 
              ? 'alert-success' 
              : 'alert-info'
          } alert-dismissible fade show`}
          role="alert"
        >
          <FaHeart className="me-2" />
          {wishlistNotification.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setWishlistNotification(null)}
          ></button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="container-fluid py-4 new-arrivals-page">
      {/* Wishlist Notification */}
      <WishlistNotification />


















      {/* New Arrivals Header */}
      <div className="new-arrivals-header text-center mb-5 py-5">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="new-arrival-badge mb-3">
            <FaRocket className="me-2" />
            NEW ARRIVALS
            <FaRocket className="ms-2" />
          </div>
          <h1 className="display-4 fw-bold text-white mb-3">Fresh & Trending</h1>
          <p className="lead text-light mb-4">
            Discover the latest products that just landed in our store
          </p>
          
          {/* Countdown Timer */}
          <CountdownTimer />
          
          {/* Collection Statistics */}
          <div className="row justify-content-center mt-4">
            <div className="col-lg-8">
              <div className="new-arrivals-stats">
                <div className="row text-center">
                  <div className="col-md-3 col-6">
                    <div className="stat-item">
                      <h3 className="text-white fw-bold">{collectionStats.total}</h3>
                      <p className="text-light mb-0">New Items</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="stat-item">
                      <h3 className="text-white fw-bold">{collectionStats.justIn}</h3>
                      <p className="text-light mb-0">Just In</p>
                    </div>
                  </div>
                <div className="col-md-3 col-6">
                    <div className="stat-item">
                      <h3 className="text-white fw-bold">{getWishlistCount()}</h3>
                      <p className="text-light mb-0">In Your Wishlist</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="stat-item">
                      <h3 className="text-white fw-bold">{collectionStats.limited}</h3>

                      <p className="text-light mb-0">Limited</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h3 fw-bold mb-1">Latest Products</h2>
              <p className="text-muted mb-0">
                Explore {filteredData.length} fresh arrivals
              </p>
            </div>
            <div className="d-flex gap-2">
              {/* Filter Toggle */}
              <button
                className="btn btn-outline-primary d-lg-none"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="me-2" />
                Filters
              </button>
              
              {/* Sort Dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <FaSortAmountDown className="me-2" />
                  Sort: {sortBy === 'newest' ? 'Newest First' : 
                         sortBy === 'trending' ? 'Trending' : sortBy.replace('-', ' ')}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" onClick={() => setSortBy("newest")}>
                      <FaRocket className="me-2 text-primary" />
                      Newest First
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => setSortBy("trending")}>
                      <FaFire className="me-2 text-warning" />
                      Trending
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => setSortBy("price-low")}>
                      Price: Low to High
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => setSortBy("rating")}>
                      Highest Rated
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="input-group input-group-lg shadow-sm">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-primary" />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  className="form-control border-start-0 search-box"
                  placeholder="Search new arrivals..."
                />
                {search && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSearch("")}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Filters Sidebar */}
        <div className={`col-lg-3 ${showFilters ? 'd-block' : 'd-none d-lg-block'}`}>
          <div className="card shadow-sm border-0 mb-4 new-arrivals-filters">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">Filters</h6>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className="card-body">
              {/* Category Filter */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Categories</h6>
                <div className="nav flex-column">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`nav-link text-start p-2 rounded mb-1 ${
                        selectedCategory === category 
                          ? 'bg-primary text-white' 
                          : 'text-dark'
                      }`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Price Range</h6>
                <div className="px-2">
                  <input
                    type="range"
                    className="form-range"
                    min={priceStats.min}
                    max={priceStats.max}
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  />
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">${priceRange[0]}</small>
                    <div className="text-center">
                      <small className="fw-semibold">Up to ${priceRange[1]}</small>
                    </div>
                    <small className="text-muted">${priceStats.max}</small>
                  </div>
                  
                  <div className="text-center mt-2">
                    <small className={`badge ${filteredData.length > 0 ? 'bg-success' : 'bg-warning'}`}>
                      {filteredData.length} new items
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid - باستخدام تخطيط مشابه لـ Wishlist */}
        <div className="col-lg-9">
          {/* Results Info */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <p className="text-muted mb-0">
              Showing {Math.min(displayedProducts.length, filteredData.length)} of {filteredData.length} new arrivals
            </p>
            
            {/* Active Filters */}
            {(search || selectedCategory !== "All" || priceRange[1] < priceStats.max) && (
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <small className="text-muted">Active filters:</small>
                {search && (
                  <span className="badge bg-primary">
                    Search: {search}
                    <button 
                      className="btn-close btn-close-white ms-1"
                      onClick={() => setSearch("")}
                    />
                  </span>
                )}
                {selectedCategory !== "All" && (
                  <span className="badge bg-secondary">
                    Category: {selectedCategory}
                    <button 
                      className="btn-close btn-close-white ms-1"
                      onClick={() => setSelectedCategory("All")}
                    />
                  </span>
                )}
                {priceRange[1] < priceStats.max && (
                  <span className="badge bg-info">
                    Price: ≤ ${priceRange[1]}
                    <button 
                      className="btn-close btn-close-white ms-1"
                      onClick={() => setPriceRange([0, priceStats.max])}
                    />
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Products Grid - باستخدام CSS Grid مشابه لـ Wishlist */}
          {filteredData.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-5"
            >
              <div className="fs-1 mb-3">🚀</div>
              <h4 className="text-muted mb-3">No new arrivals found</h4>
              <p className="text-muted mb-4">
                Try adjusting your search criteria or check back later for new products
              </p>
              <Link to="/products" className="btn btn-primary">
                Browse All Products
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="new-arrivals-grid">
                <AnimatePresence>
                  {displayedProducts.map((item, index) => (
                    <ProductCard key={item.id} item={item} index={index} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Load More Button */}
              {visibleProducts < filteredData.length && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-5"
                >
                  <button
                    onClick={loadMoreProducts}
                    className="btn btn-primary btn-lg px-5 py-3"
                  >
                    <FaArrowRight className="me-2" />
                    Load More New Arrivals
                    <small className="d-block mt-1 opacity-75">
                      ({Math.min(filteredData.length - visibleProducts, 12)} more fresh items)
                    </small>
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal />

      {/* Custom CSS */}
      <style>{`
        .wishlist-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          min-width: 300px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          border: none;
          border-radius: 10px;
        }
        .new-arrivals-page {
          background: linear-gradient(135deg, #f0f8ff 0%, #fff 50%, #f8f9fa 100%);
          min-height: 100vh;
        }

        .new-arrivals-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 20px;
          margin: 0 -12px;
          position: relative;
          overflow: hidden;
        }

        .new-arrivals-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stars" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.3)"/><circle cx="50" cy="50" r="0.5" fill="rgba(255,255,255,0.2)"/><circle cx="80" cy="80" r="1" fill="rgba(255,255,255,0.3)"/></pattern></defs><rect width="100" height="100" fill="url(%23stars)"/></svg>');
          opacity: 0.3;
        }

        .new-arrival-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(255,255,255,0.2);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.9rem;
          backdrop-filter: blur(10px);
        }

        .new-arrivals-stats {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255,255,255,0.2);
        }

        /* تخطيط البطاقات الجديد - مشابه لـ Wishlist */
        .new-arrivals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          padding: 1rem 0;
        }

        .new-arrival-card-item {
          transition: all 0.3s ease;
        }

        .product-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
          border-color: #667eea;
        }

        /* الإشارات في الزوايا - مشابه لـ Wishlist */
        .corner-badges {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .corner-badge {
          position: absolute;
          pointer-events: auto;
        }

        .top-left { top: 12px; left: 12px; }
        .top-right { top: 12px; right: 12px; }
        .bottom-left { bottom: 12px; left: 12px; }
        .bottom-right { bottom: 12px; right: 12px; }

        /* تحسين مظهر الإشارات */
        .new-badge {
          font-size: 0.7rem;
          padding: 0.4em 0.8em;
          border-radius: 10px;
          font-weight: 600;
        }

        .discount-badge {
          background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
          border: none;
          font-weight: 700;
          font-size: 0.7rem;
        }

        .stock-badge {
          background: linear-gradient(135deg, #ffc107, #ffd93d);
          border: none;
          font-size: 0.65rem;
        }

        .time-badge {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border: none;
          font-size: 0.65rem;
        }

        /* الأزرار السريعة - مشابه لـ Wishlist */
        .quick-actions-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
          border-radius: 18px;
        }

        .product-card:hover .quick-actions-overlay {
          opacity: 1;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          width: 45px;
          height: 45px;
          border: none;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .view-btn { background: rgba(255,255,255,0.2); }
        .cart-btn { background: rgba(40, 167, 69, 0.8); }
        .wishlist-btn { background: rgba(255, 255, 255, 0.2); }
        .wishlist-btn.active { background: rgba(220, 53, 69, 0.8); }

        .action-btn:hover {
          transform: scale(1.1);
        }

        .product-image {
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-title {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.4;
          height: 2.8em;
        }

        .search-box:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        .countdown-timer {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 1rem;
          margin: 1rem auto;
          max-width: 400px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .countdown-header {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .countdown-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .countdown-item {
          text-align: center;
          background: rgba(255,255,255,0.2);
          padding: 0.5rem;
          border-radius: 10px;
          min-width: 60px;
        }

        .countdown-value {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .countdown-label {
          font-size: 0.7rem;
          opacity: 0.8;
        }

        .countdown-separator {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0 0.25rem;
        }

        @media (max-width: 768px) {
          .new-arrivals-header {
            border-radius: 0;
            margin: 0 -12px;
          }

          .display-4 {
            font-size: 2rem;
          }

          .new-arrivals-stats {
            padding: 1rem;
          }

          .new-arrivals-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .action-buttons {
            gap: 8px;
          }

          .action-btn {
            width: 40px;
            height: 40px;
            font-size: 0.9rem;
          }

          .countdown-timer {
            max-width: 100%;
            margin: 1rem;
          }

          .countdown-item {
            min-width: 50px;
            padding: 0.4rem;
          }

          .countdown-value {
            font-size: 1.25rem;
          }
        }

        @media (max-width: 576px) {
          .new-arrivals-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default NewArrivalsPage;