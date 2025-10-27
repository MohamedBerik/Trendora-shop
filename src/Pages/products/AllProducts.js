import React, { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { apiValue } from "../../constants/AllData";
import { useCart } from "react-use-cart";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { 
  FaSearch, 
  FaFilter, 
  FaStar, 
  FaHeart, 
  FaShoppingCart, 
  FaEye,
  FaTimes,
  FaSortAmountDown,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/Page.css";

// 🔍 خدمة الإحصائيات المحسنة
class EnhancedAnalyticsService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
    this.sessionId = this.generateSessionId();
  }

  generateSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  async trackEvent(eventName, metadata = {}) {
    const data = {
      type: 'user_action',
      event_name: eventName,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      url: window.location.href,
      path: window.location.pathname,
      ...metadata
    };
    return this.sendToBackend(data);
  }

  // دعم التوافق مع useAnalytics
  trackUserAction = this.trackEvent;
  
  async trackPageView(pageName, additionalData = {}) {
    return this.trackEvent('page_view', {
      page_name: pageName,
      ...additionalData
    });
  }

  async trackError(errorType, message, component = '', metadata = {}) {
    return this.trackEvent('error_occurred', {
      error_type: errorType,
      error_message: message,
      component,
      ...metadata
    });
  }

  // الدوال الحالية محسنة
  async trackProductView(productId, category, title = '', metadata = {}) {
    return this.trackEvent('product_view', {
      product_id: productId,
      category,
      product_title: title,
      ...metadata
    });
  }

  async trackAddToCart(productId, quantity, price, title = '', metadata = {}) {
    return this.trackEvent('add_to_cart', {
      product_id: productId,
      quantity,
      price,
      product_title: title,
      total_value: price * quantity,
      ...metadata
    });
  }

  async trackSearch(term, resultsCount = 0, metadata = {}) {
    return this.trackEvent('search', {
      term,
      results_count: resultsCount,
      search_type: 'product_search',
      ...metadata
    });
  }

  async trackCategoryView(category, metadata = {}) {
    return this.trackEvent('category_view', {
      category,
      view_type: 'products_listing',
      ...metadata
    });
  }

  // دوال جديدة لتحليلات أكثر دقة
  async trackFilterApplied(filterType, value, resultsCount, metadata = {}) {
    return this.trackEvent('filter_applied', {
      filter_type: filterType,
      filter_value: value,
      results_count_after_filter: resultsCount,
      ...metadata
    });
  }

  async trackSortApplied(sortBy, resultsCount, metadata = {}) {
    return this.trackEvent('sort_applied', {
      sort_by: sortBy,
      results_count: resultsCount,
      ...metadata
    });
  }

  async trackProductInteraction(action, productId, metadata = {}) {
    return this.trackEvent(`product_${action}`, {
      product_id: productId,
      ...metadata
    });
  }

  async sendToBackend(data) {
    try {
      const response = await fetch(`${this.baseURL}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Analytics error:', error);
      this.saveOffline(data);
      // لا ترمي خطأ حتى لا تؤثر على تجربة المستخدم
      return { success: false, offline: true };
    }
  }

  saveOffline(data) {
    try {
      const offlineData = JSON.parse(localStorage.getItem('offline_analytics') || '[]');
      offlineData.push({
        ...data, 
        offline: true,
        offline_saved_at: new Date().toISOString()
      });
      
      // حفظ فقط آخر 100 حدث لتجنب امتلاء التخزين
      const trimmedData = offlineData.slice(-100);
      localStorage.setItem('offline_analytics', JSON.stringify(trimmedData));
    } catch (error) {
      console.error('Failed to save offline analytics:', error);
    }
  }

  // دالة لمحاولة إرسال البيانات المخزنة
  async flushOfflineData() {
    try {
      const offlineData = JSON.parse(localStorage.getItem('offline_analytics') || '[]');
      
      for (const data of offlineData) {
        await this.sendToBackend(data);
      }
      
      // مسح البيانات بعد الإرسال الناجح
      localStorage.removeItem('offline_analytics');
      return { success: true, sent_count: offlineData.length };
    } catch (error) {
      console.error('Failed to flush offline data:', error);
      return { success: false, error: error.message };
    }
  }

  // تنظيف البيانات القديمة
  cleanupOldData() {
    try {
      const offlineData = JSON.parse(localStorage.getItem('offline_analytics') || '[]');
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const freshData = offlineData.filter(item => {
        const itemDate = new Date(item.offline_saved_at || item.timestamp);
        return itemDate > oneWeekAgo;
      });
      
      localStorage.setItem('offline_analytics', JSON.stringify(freshData));
      return { cleaned_count: offlineData.length - freshData.length };
    } catch (error) {
      console.error('Failed to cleanup old data:', error);
      return { success: false, error: error.message };
    }
  }

  // الحصول على معلومات الجلسة
  getSessionInfo() {
    return {
      session_id: this.sessionId,
      session_start: sessionStorage.getItem('session_start_time'),
      user_agent: navigator.userAgent
    };
  }

  // الحصول على ID المستخدم
  _getUserId() {
    return localStorage.getItem('user_id') || 'anonymous';
  }
}

export const analyticsService = new EnhancedAnalyticsService();

// 🔧 دالة مساعدة للتتبع الآمن
const safeTrack = (trackingFunction, ...args) => {
  try {
    return trackingFunction(...args);
  } catch (error) {
    console.error('Tracking error:', error);
    // لا ترمي خطأ حتى لا تؤثر على تجربة المستخدم
    return { success: false, error: error.message };
  }
};

function AllProductsPage() {
  const data = useContext(apiValue);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  // State management
  const [search, setSearch] = useState(searchParams.get('search') || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "All");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [expandedSearch, setExpandedSearch] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);

  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(data.map(item => item.category))];
    return ["All", ...uniqueCategories];
  }, [data]);

  // حساب نطاق السعر تلقائياً
  const priceStats = useMemo(() => {
    if (!data.length) return { min: 0, max: 1000 };
    const prices = data.map(item => item.price);
    const maxPrice = Math.ceil(Math.max(...prices));
    return {
      min: Math.floor(Math.min(...prices)),
      max: maxPrice < 1000 ? 1000 : maxPrice
    };
  }, [data]);

  const [priceRange, setPriceRange] = useState([0, priceStats.max]);

  // Get search parameters from URL
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const categoryParam = searchParams.get('category');
    
    if (searchParam) setSearch(searchParam);
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [searchParams]);

  // 🔍 تتبع مشاهدة الفئة عند التغيير
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "All") {
      safeTrack(analyticsService.trackCategoryView, selectedCategory, {
        source: 'filter_selection',
        previous_category: searchParams.get('category') || 'All'
      });
    }
  }, [selectedCategory, searchParams]);

  // 🔍 تتبع تطبيق الفلاتر
  useEffect(() => {
    if (selectedCategory !== "All") {
      safeTrack(analyticsService.trackFilterApplied, 'category', selectedCategory, filteredData.length, {
        applied_via: 'category_sidebar'
      });
    }
  }, [selectedCategory, filteredData.length]);

  // 🔍 تتبع تطبيق نطاق السعر
  useEffect(() => {
    if (priceRange[1] < priceStats.max) {
      safeTrack(analyticsService.trackFilterApplied, 'price_range', `up_to_${priceRange[1]}`, filteredData.length, {
        price_min: priceRange[0],
        price_max: priceRange[1]
      });
    }
  }, [priceRange, filteredData.length, priceStats.max]);

  // 🔍 تتبع الترتيب
  useEffect(() => {
    if (sortBy !== "featured") {
      safeTrack(analyticsService.trackSortApplied, sortBy, filteredData.length, {
        previous_sort: 'featured'
      });
    }
  }, [sortBy, filteredData.length]);

  // 🔍 تتبع وقت مشاهدة الصفحة
  useEffect(() => {
    const pageLoadTime = performance.now();
    
    safeTrack(analyticsService.trackEvent, 'products_page_loaded', {
      load_time: Math.round(pageLoadTime),
      total_products: data.length,
      initial_view_count: Math.min(visibleProducts, filteredData.length),
      has_search_query: !!search,
      active_category: selectedCategory
    });

    // تتبع وقت الجلسة في الصفحة
    return () => {
      const timeSpent = Math.round(performance.now() - pageLoadTime);
      safeTrack(analyticsService.trackEvent, 'products_page_unloaded', {
        time_spent_ms: timeSpent,
        products_viewed: displayedProducts.length,
        interactions_count: interactionCount,
        search_queries_performed: search ? 1 : 0,
        filters_applied: (selectedCategory !== "All" ? 1 : 0) + (priceRange[1] < priceStats.max ? 1 : 0)
      });
    };
  }, []);

  // Filter and sort products
  const filteredData = useMemo(() => {
    let filtered = data.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                           item.description?.toLowerCase().includes(search.toLowerCase()) ||
                           item.category?.toLowerCase().includes(search.toLowerCase()) ||
                           item.brand?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sorting logic
    switch (sortBy) {
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
        // Featured - default sorting
        break;
    }

    return filtered;
  }, [data, search, selectedCategory, priceRange, sortBy]);

  // المنتجات المعروضة حالياً
  const displayedProducts = useMemo(() => {
    return filteredData.slice(0, visibleProducts);
  }, [filteredData, visibleProducts]);

  // تحميل المزيد من المنتجات
  const loadMoreProducts = () => {
    const previousCount = visibleProducts;
    setVisibleProducts(prev => prev + 12);
    
    safeTrack(analyticsService.trackEvent, 'load_more_products', {
      previous_count: previousCount,
      new_count: Math.min(previousCount + 12, filteredData.length),
      total_available: filteredData.length,
      load_type: 'pagination',
      remaining_products: filteredData.length - previousCount
    });
  };

  // إعادة تعيين عدد المنتجات المعروضة عند تغيير الفلاتر
  useEffect(() => {
    setVisibleProducts(12);
  }, [search, selectedCategory, priceRange, sortBy]);

  // Handlers with useCallback for optimization
  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    const previousSearch = search;
    setSearch(value);
    
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);

    // تتبع تغيير البحث
    if (value && value !== previousSearch) {
      safeTrack(analyticsService.trackEvent, 'search_changed', {
        previous_term: previousSearch,
        new_term: value,
        term_length: value.length,
        has_previous_results: previousSearch ? true : false
      });
    }
  }, [search, searchParams, setSearchParams]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category !== "All") {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
    
    // زيادة عداد التفاعلات
    setInteractionCount(prev => prev + 1);
  }, [searchParams, setSearchParams]);

  // 🔍 تتبع تفاعلات إضافية
  const handleQuickView = useCallback((item) => {
    setQuickView(item);
    setInteractionCount(prev => prev + 1);
    
    safeTrack(analyticsService.trackProductInteraction, 'quick_view', item.id, {
      category: item.category,
      price: item.price,
      position: displayedProducts.findIndex(p => p.id === item.id),
      source: 'quick_view_button'
    });
    
    // تتبع مشاهدة المنتج أيضاً
    safeTrack(analyticsService.trackProductView, item.id, item.category, item.title, {
      view_type: 'quick_view',
      trigger: 'button_click'
    });
  }, [displayedProducts]);

  const handleWishlistToggle = useCallback((itemId, action, item) => {
    setWishlist(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
    
    setInteractionCount(prev => prev + 1);
    
    safeTrack(analyticsService.trackProductInteraction, action ? 'added_to_wishlist' : 'removed_from_wishlist', itemId, {
      product_title: item?.title,
      category: item?.category,
      price: item?.price,
      current_wishlist_count: wishlist.length + (action ? 1 : -1)
    });
  }, [wishlist.length]);

  const handleAddToCart = useCallback((item, e, source = 'product_card') => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item);
    
    setInteractionCount(prev => prev + 1);
    
    // 🔍 تتبع محسن مع مصدر الإضافة
    safeTrack(analyticsService.trackAddToCart, item.id, 1, item.price, item.title, {
      source,
      category: item.category,
      stock: item.stock,
      has_discount: item.discountPercentage > 0,
      position: displayedProducts.findIndex(p => p.id === item.id),
      rating: item.rating
    });
    
    // إضافة تتبع للحدث التفاعلي
    safeTrack(analyticsService.trackProductInteraction, 'cart_add', item.id, {
      source,
      interface: 'button_click',
      from_page: 'products_listing'
    });

    // Add animation feedback
    const button = e.target.closest('button');
    if (button) {
      button.style.transform = 'scale(0.9)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    }
  }, [addItem, displayedProducts]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory("All");
    setPriceRange([0, priceStats.max]);
    setSortBy("featured");
    setSearchParams({});
    
    safeTrack(analyticsService.trackEvent, 'filters_cleared', {
      previous_search: search,
      previous_category: selectedCategory,
      previous_price_max: priceRange[1]
    });
  }, [setSearchParams, priceStats.max, search, selectedCategory, priceRange]);

  // Navigate to product detail page
  const handleProductClick = useCallback((itemId, e) => {
    // Only navigate if the click wasn't on a button
    if (!e.target.closest('button') && !e.target.closest('a')) {
      setInteractionCount(prev => prev + 1);
      
      safeTrack(analyticsService.trackProductInteraction, 'card_click', itemId, {
        navigation_type: 'product_details',
        click_target: 'card_background'
      });
      
      navigate(`/singleproduct/${itemId}`);
    }
  }, [navigate]);

  // 🔍 تتبع البحث عند الضغط على Enter
  const handleSearchKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && search.trim()) {
      safeTrack(analyticsService.trackSearch, search.trim(), filteredData.length, {
        trigger: 'enter_key',
        has_results: filteredData.length > 0,
        results_quality: filteredData.length > 10 ? 'high' : filteredData.length > 0 ? 'medium' : 'low'
      });
    }
  }, [search, filteredData.length]);

  // Product Card Component
  const ProductCard = React.memo(({ item, index }) => {
    
    // 🔍 تتبع محسن لمشاهدة المنتج
    useEffect(() => {
      if (index < 8) { // تتبع فقط المنتجات في العرض الأولي
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            safeTrack(analyticsService.trackProductView, item.id, item.category, item.title, {
              position: index,
              in_viewport: true,
              load_type: 'initial',
              visibility_ratio: entry.intersectionRatio,
              time_to_visible: performance.now()
            });
            observer.disconnect();
          }
        }, { threshold: 0.3 });

        const element = document.getElementById(`product-${item.id}`);
        if (element) observer.observe(element);

        return () => observer.disconnect();
      }
    }, [item.id, item.category, item.title, index]);

    return (
      <motion.div
        id={`product-${item.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="col-xl-3 col-lg-4 col-md-6 mb-4"
      >
        <div 
          className="card product-card h-100 border-0 shadow-sm"
          onClick={(e) => handleProductClick(item.id, e)}
          style={{ cursor: 'pointer' }}
        >
          {/* Product Image with Overlay */}
          <div className="position-relative overflow-hidden">
            <div className="image-container" style={{ height: '280px', overflow: 'hidden' }}>
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
              onClick={(e) => {
                e.stopPropagation();
                handleWishlistToggle(item.id, !wishlist.includes(item.id), item);
              }}
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
                handleQuickView(item);
              }}
              className="btn btn-dark position-absolute top-0 start-0 m-2 rounded-circle"
              style={{ width: '40px', height: '40px' }}
              aria-label="Quick view"
            >
              <FaEye className="text-white" />
            </button>

            {/* Discount Badge */}
            {item.discountPercentage > 0 && (
              <span className="position-absolute top-0 start-0 m-2 badge bg-danger">
                -{Math.round(item.discountPercentage)}%
              </span>
            )}

            {/* Hover Overlay */}
            <div className="product-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleAddToCart(item, e, 'hover_overlay')}
                className="btn btn-primary rounded-pill px-4 py-2"
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
                onClick={(e) => {
                  e.stopPropagation();
                  setInteractionCount(prev => prev + 1);
                  safeTrack(analyticsService.trackProductInteraction, 'title_click', item.id, {
                    navigation_type: 'product_details',
                    click_target: 'title_link'
                  });
                }}
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
                <span className="h5 fw-bold text-primary mb-0">
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
                onClick={(e) => handleAddToCart(item, e, 'quick_cart_button')}
                className="btn btn-outline-primary rounded-circle"
                style={{ width: '40px', height: '40px' }}
                aria-label="Add to cart"
              >
                <FaShoppingCart size={14} />
              </motion.button>
            </div>
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
                    <p className="text-muted">{quickView.description}</p>
                    <div className="d-flex gap-2 mt-4">
                      <button
                        onClick={(e) => {
                          handleAddToCart(quickView, e, 'quick_view_modal');
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
                        onClick={() => {
                          setQuickView(null);
                          safeTrack(analyticsService.trackProductInteraction, 'view_details', quickView.id, {
                            source: 'quick_view_modal'
                          });
                        }}
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
  ), [quickView, handleAddToCart]);

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 fw-bold mb-1">All Products</h1>
              <p className="text-muted mb-0">
                Discover our amazing collection of {filteredData.length} products
              </p>
            </div>
            <div className="d-flex gap-2">
              {/* Filter Toggle for Mobile */}
              <button
                className="btn btn-outline-primary d-lg-none"
                onClick={() => {
                  setShowFilters(!showFilters);
                  safeTrack(analyticsService.trackEvent, 'filter_panel_toggled', {
                    action: showFilters ? 'closed' : 'opened',
                    device_type: 'mobile'
                  });
                }}
                aria-label="Toggle filters"
              >
                <FaFilter className="me-2" />
                Filters
              </button>
              
              {/* Sort Dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaSortAmountDown className="me-2" />
                  Sort: {sortBy.replace('-', ' ')}
                </button>
                <ul className="dropdown-menu">
                  {[
                    { value: "featured", label: "Featured" },
                    { value: "price-low", label: "Price: Low to High" },
                    { value: "price-high", label: "Price: High to Low" },
                    { value: "rating", label: "Highest Rated" },
                    { value: "name", label: "Name A-Z" }
                  ].map(option => (
                    <li key={option.value}>
                      <button 
                        className="dropdown-item" 
                        onClick={() => {
                          setSortBy(option.value);
                          safeTrack(analyticsService.trackEvent, 'sort_option_selected', {
                            previous_sort: sortBy,
                            new_sort: option.value,
                            option_label: option.label
                          });
                        }}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Search Bar - محسن */}
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="search-container">
                <div className="input-group input-group-lg shadow-sm">
                  <span className="input-group-text bg-white border-end-0">
                    <FaSearch className="text-muted" />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    onKeyPress={handleSearchKeyPress}
                    className="form-control border-start-0 search-box"
                    placeholder="Search products, brands, categories, or descriptions..."
                    aria-label="Search products"
                    onFocus={() => setExpandedSearch(true)}
                    onBlur={() => setTimeout(() => setExpandedSearch(false), 200)}
                  />
                  {search && (
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setSearch("");
                        safeTrack(analyticsService.trackEvent, 'search_cleared', {
                          previous_term: search,
                          had_results: filteredData.length > 0
                        });
                      }}
                      aria-label="Clear search"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
                
                {/* Search Suggestions */}
                <AnimatePresence>
                  {expandedSearch && search && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="search-suggestions card mt-2 shadow-sm"
                    >
                      <div className="card-body p-3">
                        <small className="text-muted d-block mb-2">
                          Search in: Title, Description, Category, Brand
                        </small>
                        <div className="d-flex flex-wrap gap-2">
                          {categories.filter(cat => 
                            cat !== "All" && 
                            cat.toLowerCase().includes(search.toLowerCase())
                          ).slice(0, 3).map(category => (
                            <button
                              key={category}
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                setSelectedCategory(category);
                                setSearch("");
                                safeTrack(analyticsService.trackSearch, category, filteredData.length, {
                                  source: 'search_suggestion',
                                  suggestion_type: 'category'
                                });
                              }}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Filters Sidebar */}
        <div className={`col-lg-3 ${showFilters ? 'd-block' : 'd-none d-lg-block'}`}>
          <div className="card shadow-sm border-0 mb-4">
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
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value);
                      setPriceRange([0, newValue]);
                      safeTrack(analyticsService.trackEvent, 'price_slider_changed', {
                        previous_max: priceRange[1],
                        new_max: newValue,
                        percentage_of_range: (newValue / priceStats.max) * 100
                      });
                    }}
                  />
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">$0</small>
                    <div className="text-center">
                      <small className="fw-semibold">Up to ${priceRange[1]}</small>
                    </div>
                    <small className="text-muted">${priceStats.max}</small>
                  </div>
                  
                  {/* مؤشر عدد المنتجات */}
                  <div className="text-center mt-2">
                    <small className={`badge ${filteredData.length > 0 ? 'bg-success' : 'bg-warning'}`}>
                      {filteredData.length} products match
                    </small>
                  </div>
                </div>
                
                {/* زر إعادة تعيين السعر */}
                {priceRange[1] < priceStats.max && (
                  <div className="mt-3">
                    <button
                      className="btn btn-outline-secondary btn-sm w-100"
                      onClick={() => {
                        setPriceRange([0, priceStats.max]);
                        safeTrack(analyticsService.trackEvent, 'price_filter_reset', {
                          previous_max: priceRange[1]
                        });
                      }}
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
              Showing {Math.min(displayedProducts.length, filteredData.length)} of {filteredData.length} products
              {filteredData.length !== data.length && ` (from ${data.length} total)`}
            </p>
            
            {/* عرض الفلاتر النشطة */}
            {(search || selectedCategory !== "All" || priceRange[1] < priceStats.max) && (
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <small className="text-muted">Active filters:</small>
                {search && (
                  <span className="badge bg-primary d-flex align-items-center">
                    Search: {search}
                    <button 
                      className="btn-close btn-close-white ms-1" 
                      style={{fontSize: '0.6rem'}}
                      onClick={() => {
                        setSearch("");
                        safeTrack(analyticsService.trackEvent, 'search_filter_removed', {
                          removed_term: search
                        });
                      }}
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
                      onClick={() => {
                        setSelectedCategory("All");
                        safeTrack(analyticsService.trackEvent, 'category_filter_removed', {
                          removed_category: selectedCategory
                        });
                      }}
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
                      onClick={() => {
                        setPriceRange([0, priceStats.max]);
                        safeTrack(analyticsService.trackEvent, 'price_filter_removed', {
                          removed_max_price: priceRange[1]
                        });
                      }}
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
              <div className="fs-1 mb-3">🔍</div>
              <h4 className="text-muted mb-3">No products found</h4>
              <p className="text-muted mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                className="btn btn-primary"
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
                    className="btn btn-primary btn-lg px-5 py-3"
                  >
                    <FaChevronDown className="me-2" />
                    Load More Products 
                    <small className="d-block mt-1 opacity-75">
                      ({Math.min(filteredData.length - visibleProducts, 12)} more available)
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
                    <FaChevronUp className="mb-2" />
                    <p className="mb-0">You've reached the end of the products list</p>
                    <small>Showing all {filteredData.length} products</small>
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
        .product-card {
          transition: all 0.3s ease;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        .product-image {
          transition: transform 0.3s ease;
        }
        
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        
        .product-overlay {
          background: rgba(0,0,0,0.7);
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
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
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
        
        .search-suggestions {
          border: 1px solid #667eea;
          border-top: none;
          border-radius: 0 0 0.375rem 0.375rem;
        }
        
        .search-container {
          position: relative;
        }
        
        @media (max-width: 768px) {
          .image-container {
            height: 250px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AllProductsPage;