import React, { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { apiValue } from "../../constants/AllData";
import { useCart } from "react-use-cart";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaSearch, 
  FaFilter, 
  FaStar, 
  FaHeart, 
  FaShoppingCart, 
  FaEye,
  FaTimes,
  FaSortAmountDown,
  FaFire,
  FaClock,
  FaTag,
  FaPercent,
  FaArrowRight,
  FaBolt,
  FaRegClock
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/Page.css";

function SaleItemsPage() {
  const data = useContext(apiValue);
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  // State management
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("discount");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [timeLeft, setTimeLeft] = useState({});

  // Extract unique categories from sale items only
  const categories = useMemo(() => {
    const saleItems = data.filter(item => item.discountPercentage > 0);
    const uniqueCategories = [...new Set(saleItems.map(item => item.category))];
    return ["All", ...uniqueCategories];
  }, [data]);

  // حساب نطاق السعر تلقائياً للمنتجات المخفضة فقط
  const priceStats = useMemo(() => {
    const saleItems = data.filter(item => item.discountPercentage > 0);
    if (!saleItems.length) return { min: 0, max: 1000 };
    const prices = saleItems.map(item => item.price);
    const maxPrice = Math.ceil(Math.max(...prices));
    return {
      min: Math.floor(Math.min(...prices)),
      max: maxPrice < 1000 ? 1000 : maxPrice
    };
  }, [data]);

  // Filter only sale items with discount
  const saleData = useMemo(() => {
    return data.filter(item => item.discountPercentage > 0);
  }, [data]);

  // Filter and sort products
  const filteredData = useMemo(() => {
    let filtered = saleData.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                           item.description?.toLowerCase().includes(search.toLowerCase()) ||
                           item.category?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sorting logic for sale items
    switch (sortBy) {
      case "discount":
        filtered.sort((a, b) => b.discountPercentage - a.discountPercentage);
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
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Discount - default sorting
        filtered.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
    }

    return filtered;
  }, [saleData, search, selectedCategory, priceRange, sortBy]);

  // المنتجات المعروضة حالياً
  const displayedProducts = useMemo(() => {
    return filteredData.slice(0, visibleProducts);
  }, [filteredData, visibleProducts]);

  // تحميل المزيد من المنتجات
  const loadMoreProducts = () => {
    setVisibleProducts(prev => prev + 12);
  };

  // إعادة تعيين عدد المنتجات المعروضة عند تغيير الفلاتر
  useEffect(() => {
    setVisibleProducts(12);
  }, [search, selectedCategory, priceRange, sortBy]);

  // Countdown timer for sale items
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
    e.preventDefault();
    e.stopPropagation();
    addItem(item);
    
    const button = e.target.closest('button');
    if (button) {
      button.style.transform = 'scale(0.9)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    }
  }, [addItem]);

  const toggleWishlist = useCallback((itemId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setWishlist(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory("All");
    setPriceRange([0, priceStats.max]);
    setSortBy("discount");
  }, [priceStats.max]);

  // Navigate to product detail page
  const handleProductClick = useCallback((itemId, e) => {
    if (!e.target.closest('button') && !e.target.closest('a')) {
      navigate(`/singleproduct/${itemId}`);
    }
  }, [navigate]);

  // Sale Badge Component
  const SaleBadge = ({ discount, size = "normal" }) => (
    <div className={`sale-badge ${size} ${discount > 50 ? 'hot' : discount > 30 ? 'popular' : 'normal'}`}>
      <FaPercent className="me-1" />
      {Math.round(discount)}% OFF
    </div>
  );

  // Countdown Timer Component
  const CountdownTimer = () => (
    <div className="countdown-timer">
      <div className="countdown-header">
        <FaClock className="me-2" />
        <strong>Sale Ends In:</strong>
      </div>
      <div className="countdown-display">
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.hours}</span>
          <span className="countdown-label">HRS</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.minutes}</span>
          <span className="countdown-label">MIN</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <span className="countdown-value">{timeLeft.seconds}</span>
          <span className="countdown-label">SEC</span>
        </div>
      </div>
    </div>
  );

  // Product Card Component
  const ProductCard = React.memo(({ item, index }) => {
    const savings = item.originalPrice ? (item.originalPrice - item.price).toFixed(2) : 0;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="col-xl-3 col-lg-4 col-md-6 mb-4"
      >
        <div 
          className="card product-card h-100 border-0 shadow-sm sale-product-card"
          onClick={(e) => handleProductClick(item.id, e)}
          style={{ cursor: 'pointer' }}
        >
          {/* Product Image with Overlay */}
          <div className="position-relative overflow-hidden">
            <div className="image-container" style={{ height: '250px', overflow: 'hidden' }}>
              <img
                src={item.images?.[0] || "/assets/img/placeholder.jpg"}
                className="card-img-top product-image"
                alt={item.title}
                loading="lazy"
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>
            
            {/* Wishlist Button */}
            <button
              onClick={(e) => toggleWishlist(item.id, e)}
              className={`btn wishlist-btn position-absolute top-0 end-0 m-2 rounded-circle ${
                wishlist.includes(item.id) ? 'btn-danger' : 'btn-light'
              }`}
              style={{ width: '40px', height: '40px' }}
              aria-label={wishlist.includes(item.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FaHeart className={wishlist.includes(item.id) ? 'text-white' : 'text-danger'} />
            </button>

            {/* Quick View Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuickView(item);
              }}
              className="btn btn-dark position-absolute top-0 start-0 m-2 rounded-circle"
              style={{ width: '40px', height: '40px' }}
              aria-label="Quick view"
            >
              <FaEye className="text-white" />
            </button>

            {/* Sale Badge */}
            <SaleBadge discount={item.discountPercentage} />

            {/* Savings Badge */}
            {savings > 0 && (
              <div className="position-absolute bottom-0 start-0 m-2">
                <span className="badge bg-success savings-badge">
                  Save ${savings}
                </span>
              </div>
            )}

            {/* Hover Overlay */}
            <div className="product-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleAddToCart(item, e)}
                className="btn btn-danger rounded-pill px-4 py-2"
              >
                <FaShoppingCart className="me-2" />
                Add to Cart
              </motion.button>
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
                    size={14}
                  />
                ))}
              </div>
              <small className="text-muted">({item.rating || "N/A"})</small>
            </div>

            {/* Price */}
            <div className="d-flex align-items-center justify-content-between mt-auto">
              <div>
                <span className="h5 fw-bold text-danger mb-0">
                  ${item.price}
                </span>
                {item.originalPrice && (
                  <span className="text-muted text-decoration-line-through small ms-2">
                    ${item.originalPrice}
                  </span>
                )}
              </div>
              
              {/* Quick Add to Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleAddToCart(item, e)}
                className="btn btn-outline-danger rounded-circle"
                style={{ width: '40px', height: '40px' }}
                aria-label="Add to cart"
              >
                <FaShoppingCart size={14} />
              </motion.button>
            </div>

            {/* Progress Bar for Limited Stock */}
            {item.stock < 20 && (
              <div className="mt-2">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Limited Stock</span>
                  <span>{item.stock} left</span>
                </div>
                <div className="progress" style={{ height: '4px' }}>
                  <div 
                    className="progress-bar bg-warning" 
                    style={{ width: `${(item.stock / 20) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  });

  // Quick View Modal
  const QuickViewModal = useCallback(() => (
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
                <h5 className="modal-title">{quickView.title}</h5>
                <SaleBadge discount={quickView.discountPercentage} size="large" />
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setQuickView(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <img
                      src={quickView.images?.[0]}
                      alt={quickView.title}
                      className="img-fluid rounded"
                      style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <h4 className="text-danger mb-0 me-3">${quickView.price}</h4>
                      {quickView.originalPrice && (
                        <h5 className="text-muted text-decoration-line-through mb-0">
                          ${quickView.originalPrice}
                        </h5>
                      )}
                    </div>
                    
                    <div className="savings-alert alert alert-success mb-3">
                      <FaTag className="me-2" />
                      <strong>You Save ${((quickView.originalPrice - quickView.price) || 0).toFixed(2)}!</strong>
                    </div>

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
                    
                    <p className="text-muted">{quickView.description}</p>
                    
                    <div className="sale-countdown mb-3">
                      <FaRegClock className="me-2 text-danger" />
                      <small className="text-muted">Sale ends in {timeLeft.hours}h {timeLeft.minutes}m</small>
                    </div>

                    <div className="d-flex gap-2 mt-4">
                      <button
                        onClick={(e) => {
                          handleAddToCart(quickView, e);
                          setQuickView(null);
                        }}
                        className="btn btn-danger flex-fill"
                      >
                        <FaShoppingCart className="me-2" />
                        Add to Cart
                      </button>
                      <Link
                        to={`/singleproduct/${quickView.id}`}
                        className="btn btn-outline-danger"
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
  ), [quickView, handleAddToCart, timeLeft]);

  // Sale Statistics
  const saleStats = useMemo(() => {
    const totalSavings = saleData.reduce((sum, item) => {
      return sum + (item.originalPrice - item.price) || 0;
    }, 0);
    
    const averageDiscount = saleData.reduce((sum, item) => {
      return sum + item.discountPercentage;
    }, 0) / saleData.length;

    return {
      totalItems: saleData.length,
      totalSavings: totalSavings.toFixed(2),
      averageDiscount: averageDiscount.toFixed(1)
    };
  }, [saleData]);

  return (
    <div className="container-fluid py-4 sale-page">
      {/* Sale Header */}
      <div className="sale-header text-center mb-5">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4"
        >
          <div className="sale-title-badge mb-3">
            <FaFire className="me-2" />
            MEGA SALE
            <FaFire className="ms-2" />
          </div>
          <h1 className="display-4 fw-bold text-danger mb-3">Hot Deals & Discounts</h1>
          <p className="lead text-muted mb-4">
            Don't miss out on these amazing offers! Limited time only.
          </p>
          
          {/* Countdown Timer */}
          <CountdownTimer />
          
          {/* Sale Statistics */}
          <div className="row justify-content-center mt-4">
            <div className="col-md-8">
              <div className="sale-stats">
                <div className="row text-center">
                  <div className="col-md-4">
                    <div className="stat-item">
                      <h3 className="text-danger fw-bold">{saleStats.totalItems}</h3>
                      <p className="text-muted mb-0">Sale Items</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-item">
                      <h3 className="text-danger fw-bold">${saleStats.totalSavings}</h3>
                      <p className="text-muted mb-0">Total Savings</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-item">
                      <h3 className="text-danger fw-bold">{saleStats.averageDiscount}%</h3>
                      <p className="text-muted mb-0">Avg. Discount</p>
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
              <h2 className="h3 fw-bold mb-1">Sale Products</h2>
              <p className="text-muted mb-0">
                Discover {filteredData.length} amazing deals
              </p>
            </div>
            <div className="d-flex gap-2">
              {/* Filter Toggle for Mobile */}
              <button
                className="btn btn-outline-danger d-lg-none"
                onClick={() => setShowFilters(!showFilters)}
                aria-label="Toggle filters"
              >
                <FaFilter className="me-2" />
                Filters
              </button>
              
              {/* Sort Dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-outline-danger dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaSortAmountDown className="me-2" />
                  Sort: {sortBy === 'discount' ? 'Best Discount' : sortBy.replace('-', ' ')}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={() => setSortBy("discount")}
                    >
                      <FaBolt className="me-2 text-warning" />
                      Best Discount
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={() => setSortBy("price-low")}
                    >
                      Price: Low to High
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={() => setSortBy("price-high")}
                    >
                      Price: High to Low
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={() => setSortBy("rating")}
                    >
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
                  <FaSearch className="text-danger" />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  className="form-control border-start-0 search-box"
                  placeholder="Search sale items..."
                  aria-label="Search sale items"
                />
                {search && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
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
          <div className="card shadow-sm border-0 mb-4 sale-filters">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">Filters</h6>
                <button
                  className="btn btn-sm btn-outline-danger"
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
                          ? 'bg-danger text-white' 
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
                    <small className="text-muted">$0</small>
                    <div className="text-center">
                      <small className="fw-semibold">Up to ${priceRange[1]}</small>
                    </div>
                    <small className="text-muted">${priceStats.max}</small>
                  </div>
                  
                  <div className="text-center mt-2">
                    <small className={`badge ${filteredData.length > 0 ? 'bg-success' : 'bg-warning'}`}>
                      {filteredData.length} deals match
                    </small>
                  </div>
                </div>
                
                {priceRange[1] < priceStats.max && (
                  <div className="mt-3">
                    <button
                      className="btn btn-outline-danger btn-sm w-100"
                      onClick={() => setPriceRange([0, priceStats.max])}
                    >
                      Reset Price Filter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-lg-9">
          {/* Results Info */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <p className="text-muted mb-0">
              Showing {Math.min(displayedProducts.length, filteredData.length)} of {filteredData.length} sale items
            </p>
            
            {/* عرض الفلاتر النشطة */}
            {(search || selectedCategory !== "All" || priceRange[1] < priceStats.max) && (
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <small className="text-muted">Active filters:</small>
                {search && (
                  <span className="badge bg-danger d-flex align-items-center">
                    Search: {search}
                    <button 
                      className="btn-close btn-close-white ms-1" 
                      style={{fontSize: '0.6rem'}}
                      onClick={() => setSearch("")}
                      aria-label="Remove search filter"
                    />
                  </span>
                )}
                {selectedCategory !== "All" && (
                  <span className="badge bg-secondary d-flex align-items-center">
                    Category: {selectedCategory}
                    <button 
                      className="btn-close btn-close-white ms-1" 
                      style={{fontSize: '0.6rem'}}
                      onClick={() => setSelectedCategory("All")}
                      aria-label="Remove category filter"
                    />
                  </span>
                )}
                {priceRange[1] < priceStats.max && (
                  <span className="badge bg-info d-flex align-items-center">
                    Price: ≤ ${priceRange[1]}
                    <button 
                      className="btn-close btn-close-white ms-1" 
                      style={{fontSize: '0.6rem'}}
                      onClick={() => setPriceRange([0, priceStats.max])}
                      aria-label="Remove price filter"
                    />
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Products */}
          {filteredData.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-5"
            >
              <div className="fs-1 mb-3">🔥</div>
              <h4 className="text-muted mb-3">No sale items found</h4>
              <p className="text-muted mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                className="btn btn-danger"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            </motion.div>
          ) : (
            <>
              <div className="row">
                <AnimatePresence>
                  {displayedProducts.map((item, index) => (
                    <ProductCard key={item.id} item={item} index={index} />
                  ))}
                </AnimatePresence>
              </div>

              {/* زر تحميل المزيد */}
              {visibleProducts < filteredData.length && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-5"
                >
                  <button
                    onClick={loadMoreProducts}
                    className="btn btn-danger btn-lg px-5 py-3"
                  >
                    <FaArrowRight className="me-2" />
                    Load More Deals 
                    <small className="d-block mt-1 opacity-75">
                      ({Math.min(filteredData.length - visibleProducts, 12)} more deals available)
                    </small>
                  </button>
                </motion.div>
              )}

              {/* رسالة نهاية القائمة */}
              {visibleProducts >= filteredData.length && filteredData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-5 py-4"
                >
                  <div className="text-muted">
                    <FaFire className="mb-2 text-danger" />
                    <p className="mb-0 fw-semibold">You've seen all the hot deals!</p>
                    <small>Showing all {filteredData.length} sale items</small>
                  </div>
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
        .sale-page {
          background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
        }

        .sale-header {
          background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
          color: white;
          border-radius: 20px;
          margin: 0 -12px;
        }

        .sale-header .text-muted {
          color: rgba(255,255,255,0.8) !important;
        }

        .sale-title-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(255,255,255,0.2);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .sale-product-card {
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .sale-product-card:hover {
          border-color: #dc3545;
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(220, 53, 69, 0.2) !important;
        }

        .sale-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #dc3545;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 2;
          display: inline-flex;
          align-items: center;
        }

        .sale-badge.normal {
          background: #dc3545;
        }

        .sale-badge.popular {
          background: #fd7e14;
        }

        .sale-badge.hot {
          background: #ffc107;
          color: #000;
        }

        .sale-badge.large {
          font-size: 1rem;
          padding: 0.5rem 1rem;
        }

        .savings-badge {
          font-size: 0.7rem;
          backdrop-filter: blur(10px);
        }

        .countdown-timer {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 1rem;
          margin: 1rem auto;
          max-width: 400px;
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

        .sale-stats {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 1.5rem;
        }

        .stat-item {
          padding: 1rem;
        }

        .sale-filters .card-header {
          border-bottom: 2px solid #dc3545;
        }

        .savings-alert {
          border-left: 4px solid #198754;
        }

        .sale-countdown {
          display: flex;
          align-items: center;
          background: #fff5f5;
          padding: 0.5rem;
          border-radius: 8px;
          border: 1px solid #ffcccc;
        }

        .product-image {
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-overlay {
          background: rgba(220, 53, 69, 0.9);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .product-card:hover .product-overlay {
          opacity: 1;
        }

        .wishlist-btn {
          opacity: 0;
          transition: all 0.3s ease;
        }

        .product-card:hover .wishlist-btn {
          opacity: 1;
        }

        .search-box:focus {
          border-color: #dc3545;
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
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

        .image-container {
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .image-container {
            height: 200px !important;
          }

          .sale-header {
            border-radius: 0;
            margin: 0 -12px;
          }

          .display-4 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}

export default SaleItemsPage;