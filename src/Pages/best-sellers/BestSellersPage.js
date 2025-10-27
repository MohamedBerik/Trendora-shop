import React, { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { apiValue } from "../../constants/AllData";
import { useCart } from "react-use-cart";
import { useWishlist } from "../../context/WishlistContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaTrophy, FaCrown, FaStar, FaHeart, FaShoppingCart, FaEye, 
  FaSearch, FaFilter, FaTimes, FaSortAmountDown, FaFire, 
  FaChartLine, FaAward, FaMedal, FaRegStar, FaCheckCircle, 
  FaShippingFast, FaArrowRight, FaChartBar, FaUsers, FaBolt, 
  FaRegHeart 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/Page.css";

function BestSellersPage() {
  const data = useContext(apiValue);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // State management
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("bestseller");
  const [showFilters, setShowFilters] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [timeFrame, setTimeFrame] = useState("all");

  // Simulate best sellers data
  const bestSellers = useMemo(() => {
    const bestSellerProducts = data.map((product, index) => {
      const salesCount = Math.floor(Math.random() * 1000) + 100;
      const ratingCount = Math.floor(Math.random() * 500) + 50;
      const isBestseller = salesCount > 800;
      const isTopRated = (product.rating || 0) >= 4.5;
      const isTrending = salesCount > 600 && (product.rating || 0) >= 4.0;

      let rank = 0;
      if (salesCount > 900) rank = 1;
      else if (salesCount > 700) rank = 2;
      else if (salesCount > 500) rank = 3;

      return {
        ...product,
        salesCount,
        ratingCount,
        isBestseller,
        isTopRated,
        isTrending,
        rank,
        monthlySales: Math.floor(salesCount * 0.3),
        weeklySales: Math.floor(salesCount * 0.1),
      };
    });

    return bestSellerProducts.sort((a, b) => b.salesCount - a.salesCount);
  }, [data]);

  // Filter by time frame
  const filteredByTimeFrame = useMemo(() => {
    if (timeFrame === "all") return bestSellers;
    if (timeFrame === "monthly") {
      return [...bestSellers].sort((a, b) => b.monthlySales - a.monthlySales);
    }
    if (timeFrame === "weekly") {
      return [...bestSellers].sort((a, b) => b.weeklySales - a.weeklySales);
    }
    return bestSellers;
  }, [bestSellers, timeFrame]);

  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(filteredByTimeFrame.map((item) => item.category))];
    return ["All", ...uniqueCategories];
  }, [filteredByTimeFrame]);

  // Calculate price stats
  const priceStats = useMemo(() => {
    if (!filteredByTimeFrame.length) return { min: 0, max: 1000 };
    const prices = filteredByTimeFrame.map((item) => item.price);
    const maxPrice = Math.ceil(Math.max(...prices));
    return {
      min: Math.floor(Math.min(...prices)),
      max: maxPrice < 1000 ? 1000 : maxPrice,
    };
  }, [filteredByTimeFrame]);

  // Filter and sort products
  const filteredData = useMemo(() => {
    let filtered = filteredByTimeFrame.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                           item.description?.toLowerCase().includes(search.toLowerCase()) || 
                           item.brand?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });

    switch (sortBy) {
      case "bestseller":
        break;
      case "sales":
        filtered.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        filtered.sort((a, b) => {
          const scoreA = a.salesCount * (a.rating || 1);
          const scoreB = b.salesCount * (b.rating || 1);
          return scoreB - scoreA;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [filteredByTimeFrame, search, selectedCategory, priceRange, sortBy]);

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
  }, [search, selectedCategory, priceRange, sortBy, timeFrame]);

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

  const handleToggleWishlist = useCallback((product, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    toggleWishlist(product);
  }, [toggleWishlist]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory("All");
    setPriceRange([0, priceStats.max]);
    setSortBy("bestseller");
    setTimeFrame("all");
  }, [priceStats.max]);

  const handleProductClick = useCallback(
    (itemId, e) => {
      if (!e.target.closest("button") && !e.target.closest("a")) {
        navigate(`/singleproduct/${itemId}`);
      }
    },
    [navigate]
  );

  // Best Seller Badge Component
  const BestSellerBadge = ({ rank, isBestseller, isTopRated, isTrending }) => {
    if (rank === 1) {
      return (
        <span className="badge bg-gold bestseller-badge">
          <FaCrown className="me-1" />
          #1 Best Seller
        </span>
      );
    } else if (rank === 2) {
      return (
        <span className="badge bg-silver bestseller-badge">
          <FaTrophy className="me-1" />
          Very Popular
        </span>
      );
    } else if (rank === 3) {
      return (
        <span className="badge bg-bronze bestseller-badge">
          <FaMedal className="me-1" />
          Popular Choice
        </span>
      );
    } else if (isTopRated) {
      return (
        <span className="badge bg-warning bestseller-badge">
          <FaStar className="me-1" />
          Top Rated
        </span>
      );
    } else if (isTrending) {
      return (
        <span className="badge bg-danger bestseller-badge">
          <FaFire className="me-1" />
          Trending
        </span>
      );
    } else if (isBestseller) {
      return (
        <span className="badge bg-success bestseller-badge">
          <FaChartLine className="me-1" />
          Best Seller
        </span>
      );
    }
    return null;
  };

  // Sales count formatter
  const formatSalesCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k+`;
    }
    return `${count}+`;
  };

  // Product Card Component - مشابه لتصميم Wishlist
  const ProductCard = React.memo(({ item, index }) => {
    const inWishlist = isInWishlist(item.id);

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: index * 0.1 }} 
        className="bestseller-card-item"
      >
        <div 
          className="card product-card h-100 border-0 shadow-sm" 
          onClick={(e) => handleProductClick(item.id, e)} 
          style={{ cursor: "pointer" }}
        >
          {/* Product Image with Overlay */}
          <div className="position-relative overflow-hidden">
            <div className="image-container" style={{ height: "220px", overflow: "hidden", backgroundColor: "#f8f9fa" }}>
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
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </div>

            {/* Badges Container - مشابه لـ Wishlist */}
            <div className="corner-badges">
              {/* Best Seller Badge */}
              <div className="corner-badge top-left">
                <BestSellerBadge 
                  rank={item.rank} 
                  isBestseller={item.isBestseller} 
                  isTopRated={item.isTopRated} 
                  isTrending={item.isTrending} 
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

              {/* Sales Count Badge */}
              <div className="corner-badge bottom-left">
                <span className="badge bg-dark sales-badge">
                  <FaChartBar className="me-1" />
                  {formatSalesCount(item.salesCount)} sold
                </span>
              </div>

              {/* Stock Badge */}
              <div className="corner-badge bottom-right">
                <span className={`badge ${item.stock > 10 ? "bg-success" : item.stock > 0 ? "bg-warning" : "bg-danger"} stock-badge`}>
                  {item.stock > 10 ? "🟢" : item.stock > 0 ? "🟡" : "🔴"}
                  {item.stock > 0 ? `${item.stock}` : "Out"}
                </span>
              </div>
            </div>

            {/* Quick Actions Overlay - مشابه لـ Wishlist */}
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
                  className={`action-btn wishlist-btn ${inWishlist ? "active" : ""}`}
                  onClick={(e) => handleToggleWishlist(item, e)}
                  title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <FaHeart className={inWishlist ? "text-white" : ""} />
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

            {/* Rating and Reviews */}
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
              <small className="text-muted">
                ({item.rating || "N/A"}) • {formatSalesCount(item.ratingCount)} reviews
              </small>
            </div>

            {/* Price and Add to Cart */}
            <div className="d-flex align-items-center justify-content-between mt-auto">
              <div>
                <span className="h5 fw-bold text-primary mb-0">${item.price}</span>
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

            {/* Sales Progress Bar */}
            <div className="mt-2">
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Popularity</span>
                <span>{Math.min(100, Math.round((item.salesCount / 1000) * 100))}%</span>
              </div>
              <div className="progress" style={{ height: "6px" }}>
                <div 
                  className="progress-bar bg-success" 
                  style={{ 
                    width: `${Math.min(100, Math.round((item.salesCount / 1000) * 100))}%` 
                  }}
                ></div>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
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
                    <BestSellerBadge 
                      rank={quickView.rank} 
                      isBestseller={quickView.isBestseller} 
                      isTopRated={quickView.isTopRated} 
                      isTrending={quickView.isTrending} 
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
                        style={{ height: "300px", objectFit: "cover", width: "100%" }}
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

                      {/* Sales and Rating Info */}
                      <div className="sales-info mb-3">
                        <div className="row text-center">
                          <div className="col-4">
                            <div className="sales-stat">
                              <strong className="text-primary">
                                {formatSalesCount(quickView.salesCount)}
                              </strong>
                              <small className="d-block text-muted">Sold</small>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="sales-stat">
                              <strong className="text-warning">
                                {quickView.rating || "N/A"}
                              </strong>
                              <small className="d-block text-muted">Rating</small>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="sales-stat">
                              <strong className="text-success">
                                {formatSalesCount(quickView.ratingCount)}
                              </strong>
                              <small className="d-block text-muted">Reviews</small>
                            </div>
                          </div>
                        </div>
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
                        <span className="text-muted">
                          Based on {formatSalesCount(quickView.ratingCount)} reviews
                        </span>
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
    ),
    [quickView, handleAddToCart]
  );

  // Collection statistics
  const collectionStats = useMemo(() => {
    const total = bestSellers.length;
    const bestsellers = bestSellers.filter((item) => item.isBestseller).length;
    const topRated = bestSellers.filter((item) => item.isTopRated).length;
    const totalSales = bestSellers.reduce((sum, item) => sum + item.salesCount, 0);

    return { total, bestsellers, topRated, totalSales };
  }, [bestSellers]);

  // Best seller features
  const bestSellerFeatures = [
    {
      icon: <FaTrophy />,
      title: "Customer Favorites",
      description: "Products loved by thousands",
    },
    {
      icon: <FaChartLine />,
      title: "Proven Quality",
      description: "Tested and approved by customers",
    },
    {
      icon: <FaAward />,
      title: "Award Winning",
      description: "Top rated and reviewed",
    },
    {
      icon: <FaUsers />,
      title: "Community Choice",
      description: "Recommended by shoppers like you",
    },
  ];

  return (
    <div className="container-fluid py-4 bestsellers-page">
      {/* Best Sellers Header */}
      <div className="bestsellers-header text-center mb-5 py-5">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bestseller-badge-main mb-3">
            <FaTrophy className="me-2" />
            BEST SELLERS
            <FaTrophy className="ms-2" />
          </div>
          <h1 className="display-4 fw-bold text-white mb-3">Customer Favorites</h1>
          <p className="lead text-light mb-4">
            Discover the most loved products by our community
          </p>

          {/* Collection Statistics */}
          <div className="row justify-content-center mt-4">
            <div className="col-lg-8">
              <div className="bestsellers-stats">
                <div className="row text-center">
                  <div className="col-md-3 col-6">
                    <div className="stat-item">
                      <h3 className="text-white fw-bold">
                        {formatSalesCount(collectionStats.totalSales)}
                      </h3>
                      <p className="text-light mb-0">Total Sales</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="stat-item">
                      <h3 className="text-white fw-bold">{collectionStats.bestsellers}</h3>
                      <p className="text-light mb-0">Best Sellers</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="stat-item">
                      <h3 className="text-white fw-bold">{collectionStats.topRated}</h3>
                      <p className="text-light mb-0">Top Rated</p>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="stat-item">
                      <h3 className="text-white fw-bold">{collectionStats.total}</h3>
                      <p className="text-light mb-0">Products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Time Frame Selector */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="text-center">
                <h5 className="fw-bold mb-3">Top Sellers Time Frame</h5>
                <div className="btn-group time-frame-selector">
                  <button
                    className={`btn ${timeFrame === "all" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setTimeFrame("all")}
                  >
                    All Time
                  </button>
                  <button
                    className={`btn ${timeFrame === "monthly" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setTimeFrame("monthly")}
                  >
                    This Month
                  </button>
                  <button
                    className={`btn ${timeFrame === "weekly" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setTimeFrame("weekly")}
                  >
                    This Week
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h3 fw-bold mb-1">Top Products</h2>
              <p className="text-muted mb-0">
                Explore {filteredData.length} customer favorites
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
                  Sort:{" "}
                  {sortBy === "bestseller"
                    ? "Best Sellers"
                    : sortBy === "sales"
                    ? "Most Sales"
                    : sortBy === "popular"
                    ? "Most Popular"
                    : sortBy.replace("-", " ")}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setSortBy("bestseller")}
                    >
                      <FaTrophy className="me-2 text-warning" />
                      Best Sellers
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setSortBy("sales")}
                    >
                      <FaChartLine className="me-2 text-success" />
                      Most Sales
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setSortBy("popular")}
                    >
                      <FaFire className="me-2 text-danger" />
                      Most Popular
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setSortBy("rating")}
                    >
                      <FaStar className="me-2 text-warning" />
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
                  placeholder="Search best sellers..."
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
        <div className={`col-lg-3 ${showFilters ? "d-block" : "d-none d-lg-block"}`}>
          <div className="card shadow-sm border-0 mb-4 bestsellers-filters">
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
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`nav-link text-start p-2 rounded mb-1 ${
                        selectedCategory === category
                          ? "bg-primary text-white"
                          : "text-dark"
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
                    <small
                      className={`badge ${
                        filteredData.length > 0 ? "bg-success" : "bg-warning"
                      }`}
                    >
                      {filteredData.length} top products
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
              Showing {Math.min(displayedProducts.length, filteredData.length)} of{" "}
              {filteredData.length} best sellers
              {timeFrame !== "all" && ` (${timeFrame})`}
            </p>

            {/* Active Filters */}
            {(search || selectedCategory !== "All" || priceRange[1] < priceStats.max || timeFrame !== "all") && (
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
                {timeFrame !== "all" && (
                  <span className="badge bg-warning">
                    Time: {timeFrame}
                    <button
                      className="btn-close btn-close-white ms-1"
                      onClick={() => setTimeFrame("all")}
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
              <div className="fs-1 mb-3">🏆</div>
              <h4 className="text-muted mb-3">No best sellers found</h4>
              <p className="text-muted mb-4">
                Try adjusting your search criteria or browse all products
              </p>
              <Link to="/products" className="btn btn-primary">
                Browse All Products
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="bestsellers-grid">
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
                    Load More Best Sellers
                    <small className="d-block mt-1 opacity-75">
                      ({Math.min(filteredData.length - visibleProducts, 12)} more top
                      products)
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
      <style>
        {`
        .bestsellers-page {
          background: linear-gradient(135deg, #fffaf0 0%, #fff 50%, #f8f9fa 100%);
          min-height: 100vh;
        }

        .bestsellers-header {
          background: linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%);
          color: white;
          border-radius: 20px;
          margin: 0 -12px;
          position: relative;
          overflow: hidden;
        }

        .bestsellers-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="trophy" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23trophy)"/></svg>');
          opacity: 0.3;
        }

        .bestseller-badge-main {
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

        .bestsellers-stats {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(255,255,255,0.2);
        }

        /* تخطيط البطاقات الجديد - مشابه لـ Wishlist */
        .bestsellers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          padding: 1rem 0;
        }

        .bestseller-card-item {
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
          box-shadow: 0 12px 40px rgba(255, 126, 95, 0.15);
          border-color: #ff7e5f;
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
        .bestseller-badge {
          font-size: 0.65rem;
          padding: 0.35em 0.7em;
          border-radius: 8px;
          font-weight: 600;
        }

        .bg-gold {
          background: linear-gradient(135deg, #ffd700, #ffed4e) !important;
          color: #2c3e50 !important;
        }

        .bg-silver {
          background: linear-gradient(135deg, #c0c0c0, #e0e0e0) !important;
          color: #2c3e50 !important;
        }

        .bg-bronze {
          background: linear-gradient(135deg, #cd7f32, #e89d5d) !important;
          color: white !important;
        }

        .discount-badge {
          background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
          border: none;
          font-weight: 700;
          font-size: 0.7rem;
        }

        .sales-badge {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border: none;
          font-size: 0.65rem;
        }

        .stock-badge {
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
          font-size: 0.65rem;
        }

        /* الأزرار السريعة - مشابه لـ Wishlist */
        .quick-actions-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 126, 95, 0.9), rgba(254, 180, 123, 0.9));
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
          border-color: #ff7e5f;
          box-shadow: 0 0 0 0.2rem rgba(255, 126, 95, 0.25);
        }

        .sales-info {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 10px;
          border: 1px solid #e9ecef;
        }

        .sales-stat strong {
          font-size: 1.25rem;
        }

        .time-frame-selector .btn {
          border-radius: 10px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .bestsellers-header {
            border-radius: 0;
            margin: 0 -12px;
          }

          .display-4 {
            font-size: 2rem;
          }

          .bestsellers-stats {
            padding: 1rem;
          }

          .time-frame-selector {
            flex-direction: column;
            gap: 0.5rem;
          }

          .time-frame-selector .btn {
            width: 100%;
          }

          .bestsellers-grid {
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
        }

        @media (max-width: 576px) {
          .bestsellers-grid {
            grid-template-columns: 1fr;
          }
        }
      `}
      </style>
    </div>
  );
}

export default BestSellersPage;