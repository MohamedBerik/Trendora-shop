import React, { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { apiValue } from "../../constants/AllData";
import { useCart } from "react-use-cart";
import { Link, useNavigate } from "react-router-dom";
import { FaCrown, FaStar, FaHeart, FaShoppingCart, FaEye, FaSearch, FaFilter, FaTimes, FaSortAmountDown, FaAward, FaShieldAlt, FaRocket, FaCheckCircle, FaShippingFast, FaHeadset, FaLeaf, FaGem, FaRegGem, FaChevronRight, FaFire, FaBolt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/Page.css";

function PremiumCollectionPage() {
  const data = useContext(apiValue);
  const navigate = useNavigate();
  const { addItem } = useCart();

  // State management
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([100, 5000]);
  const [sortBy, setSortBy] = useState("premium");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(12);

  // Premium products filter (high price, high rating, luxury items)
  const premiumProducts = useMemo(() => {
    return data.filter((item) => item.price >= 100 || item.rating >= 4.5 || item.category?.toLowerCase().includes("premium") || item.category?.toLowerCase().includes("luxury") || item.title?.toLowerCase().includes("premium") || item.title?.toLowerCase().includes("luxury") || item.brand?.toLowerCase().includes("premium"));
  }, [data]);

  // Extract unique categories from premium products
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(premiumProducts.map((item) => item.category))];
    return ["All", ...uniqueCategories];
  }, [premiumProducts]);

  // Calculate price stats for premium products
  const priceStats = useMemo(() => {
    if (!premiumProducts.length) return { min: 100, max: 5000 };
    const prices = premiumProducts.map((item) => item.price);
    const maxPrice = Math.ceil(Math.max(...prices));
    return {
      min: Math.floor(Math.min(...prices)),
      max: maxPrice < 5000 ? 5000 : maxPrice,
    };
  }, [premiumProducts]);

  // Filter and sort products
  const filteredData = useMemo(() => {
    let filtered = premiumProducts.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase()) || item.brand?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Premium-specific sorting
    switch (sortBy) {
      case "premium":
        // Sort by premium score (price + rating)
        filtered.sort((a, b) => {
          const scoreA = a.price / 100 + (a.rating || 0);
          const scoreB = b.price / 100 + (b.rating || 0);
          return scoreB - scoreA;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "exclusive":
        // Sort by exclusivity (higher price + brand recognition)
        filtered.sort((a, b) => {
          const exclusiveA = a.price * (a.rating || 1);
          const exclusiveB = b.price * (b.rating || 1);
          return exclusiveB - exclusiveA;
        });
        break;
      default:
        filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [premiumProducts, search, selectedCategory, priceRange, sortBy]);

  // Displayed products with pagination
  const displayedProducts = useMemo(() => {
    return filteredData.slice(0, visibleProducts);
  }, [filteredData, visibleProducts]);

  // Load more products
  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 12);
  };

  // Reset visible products when filters change
  useEffect(() => {
    setVisibleProducts(12);
  }, [search, selectedCategory, priceRange, sortBy]);

  // Premium features
  const premiumFeatures = [
    {
      icon: <FaGem />,
      title: "Premium Quality",
      description: "Exceptional craftsmanship and materials",
    },
    {
      icon: <FaAward />,
      title: "Award Winning",
      description: "Recognized excellence in design",
    },
    {
      icon: <FaShieldAlt />,
      title: "Lifetime Support",
      description: "Dedicated customer service",
    },
    {
      icon: <FaShippingFast />,
      title: "White Glove Delivery",
      description: "Premium shipping experience",
    },
  ];

  // Premium benefits
  const premiumBenefits = ["Free luxury gift wrapping", "Priority customer support", "Extended warranty coverage", "Complimentary maintenance", "Exclusive member events", "Personal shopping assistance"];

  // Handlers
  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleAddToCart = useCallback(
    (item, e) => {
      e?.preventDefault();
      e?.stopPropagation();
      addItem(item);
    },
    [addItem]
  );

  const toggleWishlist = useCallback((itemId, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setWishlist((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory("All");
    setPriceRange([100, priceStats.max]);
    setSortBy("premium");
  }, [priceStats.max]);

  const handleProductClick = useCallback(
    (itemId, e) => {
      if (!e.target.closest("button") && !e.target.closest("a")) {
        navigate(`/singleproduct/${itemId}`);
      }
    },
    [navigate]
  );

  // Premium badge component
  const PremiumBadge = ({ level = "premium" }) => {
    const config = {
      premium: { icon: FaGem, color: "primary", text: "Premium" },
      luxury: { icon: FaGem, color: "warning", text: "Luxury" },
      exclusive: { icon: FaCrown, color: "danger", text: "Exclusive" },
    };

    const { icon: Icon, color, text } = config[level] || config.premium;

    return (
      <span className={`badge bg-${color} premium-badge d-flex align-items-center`}>
        <Icon className="me-1" size={12} />
        {text}
      </span>
    );
  };

  // Product Card Component
  const ProductCard = React.memo(({ item, index }) => {
    const getPremiumLevel = () => {
      if (item.price >= 1000) return "exclusive";
      if (item.price >= 500) return "luxury";
      return "premium";
    };

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="col-xl-3 col-lg-4 col-md-6 mb-4">
        <div className="card product-card h-100 border-0 shadow-lg premium-card" onClick={(e) => handleProductClick(item.id, e)} style={{ cursor: "pointer" }}>
          {/* Product Image with Overlay */}
          {/* بدل الـ Overlay الكامل - استخدم هذا */}
          <div className="position-relative">
            <img src={item.images?.[0]} className="card-img-top product-image" alt={item.title} style={{ height: "280px", objectFit: "cover" }} />

            {/* أزرار تظهر عند التمرير */}
            <div className="position-absolute top-0 end-0 m-3 d-flex gap-2">
              <button className="btn btn-light rounded-circle shadow-sm product-action-btn" style={{ width: "45px", height: "45px", opacity: 0 }} onClick={(e) => toggleWishlist(item.id, e)}>
                <FaHeart className={wishlist.includes(item.id) ? "text-danger" : "text-muted"} />
              </button>
              <button className="btn btn-light rounded-circle shadow-sm product-action-btn" style={{ width: "45px", height: "45px", opacity: 0 }} onClick={() => setQuickView(item)}>
                <FaEye className="text-dark" />
              </button>
            </div>

            {/* زر سريع للإضافة للسلة */}
            <div className="position-absolute bottom-0 start-0 end-0 p-3">
              <motion.button whileHover={{ scale: 1.02 }} className="btn btn-gold w-100 add-to-cart-btn" style={{ opacity: 0 }} onClick={(e) => handleAddToCart(item, e)}>
                <FaShoppingCart className="me-2" />
                Add to Cart
              </motion.button>
            </div>
          </div>

          <div className="card-body d-flex flex-column">
            {/* Brand */}
            {item.brand && (
              <div className="mb-2">
                <span className="badge bg-light text-dark small brand-badge">{item.brand}</span>
              </div>
            )}

            {/* Title */}
            <h6 className="card-title fw-semibold mb-2 flex-grow-1 product-title">
              <Link to={`/singleproduct/${item.id}`} className="text-decoration-none text-dark" onClick={(e) => e.stopPropagation()}>
                {item.title}
              </Link>
            </h6>

            {/* Rating */}
            <div className="d-flex align-items-center mb-2">
              <div className="d-flex align-items-center me-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={`${i < Math.floor(item.rating || 0) ? "text-warning" : "text-muted"} me-1`} size={14} />
                ))}
              </div>
              <small className="text-muted">({item.rating || "N/A"})</small>
            </div>

            {/* Price */}
            <div className="d-flex align-items-center justify-content-between mt-auto">
              <div>
                <span className="h5 fw-bold text-gold mb-0">${item.price}</span>
                {item.originalPrice && <span className="text-muted text-decoration-line-through small ms-2">${item.originalPrice}</span>}
              </div>

              {/* Quick Add to Cart */}
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => handleAddToCart(item, e)} className="btn btn-outline-gold rounded-circle" style={{ width: "40px", height: "40px" }}>
                <FaShoppingCart size={14} />
              </motion.button>
            </div>

            {/* Premium Features */}
            <div className="mt-2">
              <div className="d-flex gap-1 flex-wrap">
                {item.price > 500 && (
                  <small className="text-success">
                    <FaCheckCircle className="me-1" />
                    Free Shipping
                  </small>
                )}
                {item.rating >= 4.5 && (
                  <small className="text-warning">
                    <FaBolt className="me-1" />
                    Top Rated
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  });

  // Quick View Modal
  const QuickViewModal = useCallback(
    () => (
      <AnimatePresence>
        {quickView && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.8)" }} onClick={() => setQuickView(null)}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content premium-modal">
                <div className="modal-header">
                  <div className="d-flex align-items-center">
                    <PremiumBadge level={quickView.price >= 1000 ? "exclusive" : quickView.price >= 500 ? "luxury" : "premium"} />
                    <h5 className="modal-title ms-2">{quickView.title}</h5>
                  </div>
                  <button type="button" className="btn-close" onClick={() => setQuickView(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <img src={quickView.images?.[0]} alt={quickView.title} className="img-fluid rounded shadow" style={{ height: "400px", objectFit: "cover", width: "100%" }} />
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-3">
                        <h3 className="text-gold mb-0 me-3">${quickView.price}</h3>
                        {quickView.originalPrice && <h4 className="text-muted text-decoration-line-through mb-0">${quickView.originalPrice}</h4>}
                      </div>

                      {quickView.discountPercentage > 0 && (
                        <div className="alert alert-success mb-3">
                          <FaBolt className="me-2" />
                          <strong>Save ${(quickView.originalPrice - quickView.price || 0).toFixed(2)}!</strong>
                        </div>
                      )}

                      <div className="d-flex align-items-center mb-3">
                        <div className="d-flex align-items-center me-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={`${i < Math.floor(quickView.rating || 0) ? "text-warning" : "text-muted"} me-1`} />
                          ))}
                        </div>
                        <span className="text-muted">({quickView.rating || "N/A"})</span>
                      </div>

                      <p className="text-muted mb-4">{quickView.description}</p>

                      {/* Premium Features */}
                      <div className="premium-features-list mb-4">
                        <h6 className="fw-bold mb-3">Premium Features:</h6>
                        <div className="row g-2">
                          {premiumBenefits.slice(0, 4).map((benefit, index) => (
                            <div key={index} className="col-6">
                              <small className="text-success">
                                <FaCheckCircle className="me-1" />
                                {benefit}
                              </small>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="d-flex gap-2 mt-4">
                        <button
                          onClick={(e) => {
                            handleAddToCart(quickView, e);
                            setQuickView(null);
                          }}
                          className="btn btn-gold flex-fill py-3"
                        >
                          <FaShoppingCart className="me-2" />
                          Add to Premium Cart
                        </button>
                        <Link to={`/singleproduct/${quickView.id}`} className="btn btn-outline-gold py-3" onClick={() => setQuickView(null)}>
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
    ),
    [quickView, handleAddToCart, premiumBenefits]
  );

  // Collection statistics
  const collectionStats = useMemo(() => {
    const total = premiumProducts.length;
    const averagePrice = premiumProducts.reduce((sum, item) => sum + item.price, 0) / total;
    const luxuryCount = premiumProducts.filter((item) => item.price >= 500).length;
    const averageRating = premiumProducts.reduce((sum, item) => sum + (item.rating || 0), 0) / total;

    return { total, averagePrice, luxuryCount, averageRating };
  }, [premiumProducts]);

  return (
    <div className="container-fluid py-4 premium-collection-page">
      {/* Premium Header */}
      <div className="premium-header text-center mb-5 py-5">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="premium-badge mb-3">
            <FaCrown className="me-2" />
            PREMIUM COLLECTION
            <FaCrown className="ms-2" />
          </div>
          <h1 className="display-4 fw-bold text-gold mb-3">Exclusive Luxury Items</h1>
          <p className="lead text-light mb-4">Discover our curated selection of premium products with exceptional quality and design</p>

          {/* Collection Statistics */}
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="premium-stats">
                <div className="row text-center">
                  <div className="col-md-3 col-6">
                    <div className="stat-item">
                      <h3 className="text-gold fw-bold">{collectionStats.total}</h3>
                      <p className="text-light mb-0">Premium Items</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="stat-item">
                      <h3 className="text-gold fw-bold">${Math.round(collectionStats.averagePrice)}</h3>
                      <p className="text-light mb-0">Avg. Price</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="stat-item">
                      <h3 className="text-gold fw-bold">{collectionStats.luxuryCount}</h3>
                      <p className="text-light mb-0">Luxury Items</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="stat-item">
                      <h3 className="text-gold fw-bold">{collectionStats.averageRating.toFixed(1)}</h3>
                      <p className="text-light mb-0">Avg. Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Premium Features */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="text-center mb-4">
            <h2 className="h3 fw-bold text-dark mb-3">Why Choose Premium?</h2>
          </div>
          <div className="row g-4">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="card feature-card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className="feature-icon text-gold mb-3">{feature.icon}</div>
                    <h5 className="fw-bold mb-2">{feature.title}</h5>
                    <p className="text-muted mb-0 small">{feature.description}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h3 fw-bold mb-1">Premium Products</h2>
              <p className="text-muted mb-0">Curated selection of {filteredData.length} exceptional items</p>
            </div>
            <div className="d-flex gap-2">
              {/* Filter Toggle */}
              <button className="btn btn-outline-gold d-lg-none" onClick={() => setShowFilters(!showFilters)}>
                <FaFilter className="me-2" />
                Filters
              </button>

              {/* Sort Dropdown */}
              <div className="dropdown">
                <button className="btn btn-outline-gold dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  <FaSortAmountDown className="me-2" />
                  Sort: {sortBy === "premium" ? "Premium Score" : sortBy === "exclusive" ? "Most Exclusive" : sortBy.replace("-", " ")}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" onClick={() => setSortBy("premium")}>
                      <FaCrown className="me-2 text-warning" />
                      Premium Score
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => setSortBy("exclusive")}>
                      <FaGem className="me-2 text-primary" />
                      Most Exclusive
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => setSortBy("price-high")}>
                      Price: High to Low
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
                  <FaSearch className="text-gold" />
                </span>
                <input type="text" value={search} onChange={handleSearch} className="form-control border-start-0 search-box" placeholder="Search premium products, brands, or categories..." />
                {search && (
                  <button className="btn btn-outline-secondary" onClick={() => setSearch("")}>
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
        <div className={`col-lg-3 ${showFilters ? "d-block" : "d-none d-lg-block"}`}>
          <div className="card shadow-sm border-0 mb-4 premium-filters">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">Premium Filters</h6>
                <button className="btn btn-sm btn-outline-gold" onClick={clearFilters}>
                  Clear All
                </button>
              </div>
            </div>
            <div className="card-body">
              {/* Category Filter */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Categories</h6>
                <div className="nav flex-column">
                  {categories.map((category) => (
                    <button key={category} className={`nav-link text-start p-2 rounded mb-1 ${selectedCategory === category ? "bg-gold text-white" : "text-dark"}`} onClick={() => handleCategoryChange(category)}>
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Price Range</h6>
                <div className="px-2">
                  <input type="range" className="form-range" min={priceStats.min} max={priceStats.max} step="50" value={priceRange[1]} onChange={(e) => setPriceRange([100, parseInt(e.target.value)])} />
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">${priceRange[0]}</small>
                    <div className="text-center">
                      <small className="fw-semibold">Up to ${priceRange[1]}</small>
                    </div>
                    <small className="text-muted">${priceStats.max}</small>
                  </div>

                  <div className="text-center mt-2">
                    <small className="badge bg-gold">{filteredData.length} premium items</small>
                  </div>
                </div>
              </div>

              {/* Premium Tiers */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Premium Tiers</h6>
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-warning btn-sm text-start">
                    <FaGem className="me-2" />
                    Premium ($100 - $499)
                  </button>
                  <button className="btn btn-outline-warning btn-sm text-start">
                    <FaGem className="me-2" />
                    Luxury ($500 - $999)
                  </button>
                  <button className="btn btn-outline-warning btn-sm text-start">
                    <FaCrown className="me-2" />
                    Exclusive ($1000+)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-lg-9">
          {/* Results Info */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <p className="text-muted mb-0">
              Showing {Math.min(displayedProducts.length, filteredData.length)} of {filteredData.length} premium products
            </p>

            {/* Active Filters */}
            {(search || selectedCategory !== "All" || priceRange[1] < priceStats.max) && (
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <small className="text-muted">Active filters:</small>
                {search && (
                  <span className="badge bg-gold">
                    Search: {search}
                    <button className="btn-close btn-close-white ms-1" onClick={() => setSearch("")} />
                  </span>
                )}
                {selectedCategory !== "All" && (
                  <span className="badge bg-secondary">
                    Category: {selectedCategory}
                    <button className="btn-close btn-close-white ms-1" onClick={() => setSelectedCategory("All")} />
                  </span>
                )}
                {priceRange[1] < priceStats.max && (
                  <span className="badge bg-info">
                    Price: ≤ ${priceRange[1]}
                    <button className="btn-close btn-close-white ms-1" onClick={() => setPriceRange([100, priceStats.max])} />
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Products Grid */}
          {filteredData.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-5">
              <div className="fs-1 mb-3">👑</div>
              <h4 className="text-muted mb-3">No premium products found</h4>
              <p className="text-muted mb-4">Try adjusting your search criteria or browse our regular collection</p>
              <Link to="/products" className="btn btn-gold">
                Browse All Products
              </Link>
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

              {/* Load More Button */}
              {visibleProducts < filteredData.length && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-5">
                  <button onClick={loadMoreProducts} className="btn btn-gold btn-lg px-5 py-3">
                    <FaChevronRight className="me-2" />
                    Load More Premium Items
                    <small className="d-block mt-1 opacity-75">({Math.min(filteredData.length - visibleProducts, 12)} more exclusive items)</small>
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
        .premium-collection-page {
          background: linear-gradient(135deg, #fef9e7 0%, #fff 50%, #f8f9fa 100%);
          min-height: 100vh;
        }

        .premium-header {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%);
          color: white;
          border-radius: 20px;
          margin: 0 -12px;
          position: relative;
          overflow: hidden;
        }

        .premium-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }

        .premium-badge {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #2c3e50;
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.9rem;
        }

        .text-gold {
          color: #ffd700 !important;
        }

        .bg-gold {
          background: linear-gradient(135deg, #ffd700, #ffed4e) !important;
          color: #2c3e50 !important;
        }

        .btn-gold {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          border: none;
          color: #2c3e50;
          font-weight: 600;
        }

        .btn-gold:hover {
          background: linear-gradient(135deg, #ffed4e, #ffd700);
          color: #2c3e50;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
        }

        .btn-outline-gold {
          border: 2px solid #ffd700;
          color: #ffd700;
          background: transparent;
        }

        .btn-outline-gold:hover {
          background: #ffd700;
          color: #2c3e50;
        }

        .premium-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 215, 0, 0.1);
        }

        .premium-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(255, 215, 0, 0.2) !important;
          border-color: #ffd700;
        }

        .premium-badge {
          font-size: 0.7rem;
          padding: 0.4em 0.8em;
          border-radius: 10px;
        }

        .brand-badge {
          background: rgba(255, 215, 0, 0.1) !important;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .feature-card {
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #fff, #fef9e7);
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(255, 215, 0, 0.15) !important;
        }

        .feature-icon {
          font-size: 2.5rem;
        }

        .premium-stats {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255, 215, 0, 0.2);
        }

        .premium-modal .modal-content {
          border: 2px solid #ffd700;
          border-radius: 20px;
          overflow: hidden;
        }

        .premium-filters .card-header {
          border-bottom: 2px solid #ffd700;
        }

        .product-image {
          transition: transform 0.3s ease;
        }

        .premium-card:hover .product-image {
          transform: scale(1.08);
        }

        .product-overlay {
          background: rgba(44, 62, 80, 0.9);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .premium-card:hover .product-overlay {
          opacity: 1;
        }

        .wishlist-btn {
          opacity: 0;
          transition: all 0.3s ease;
        }

        .premium-card:hover .wishlist-btn {
          opacity: 1;
        }

        .search-box:focus {
          border-color: #ffd700;
          box-shadow: 0 0 0 0.2rem rgba(255, 215, 0, 0.25);
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
          

        @media (max-width: 768px) {
          .premium-header {
            border-radius: 0;
            margin: 0 -12px;
          }

          .display-4 {
            font-size: 2rem;
          }

          .premium-stats {
            padding: 1rem;
          }
        }

/* ضروري لرؤية الأزرار */
.product-image-container {
  overflow: hidden;
  position: relative;
}

.product-actions {
  transform: translateY(-50%);
  opacity: 0;
  transition: all 0.3s ease;
}

.action-btn {
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.3s ease;
  margin: 0 5px;
}

.product-image-container:hover .product-actions {
  opacity: 1;
}

.product-image-container:hover .action-btn {
  opacity: 1;
  transform: translateY(0);
}

.product-image-container:hover .action-btn:nth-child(1) {
  transition-delay: 0.1s;
}

.product-image-container:hover .action-btn:nth-child(2) {
  transition-delay: 0.2s;
}

.product-image-container:hover .action-btn:nth-child(3) {
  transition-delay: 0.3s;
}

.product-image {
  transition: transform 0.3s ease;
}

.product-image-container:hover .product-image {
  transform: scale(1.05);
}

      `}</style>
    </div>
  );
}

export default PremiumCollectionPage;
