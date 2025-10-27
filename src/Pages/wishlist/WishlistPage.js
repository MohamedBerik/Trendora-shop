import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import { useWishlist } from "../../context/WishlistContext";
import { 
  FaHeart,
  FaShoppingCart,
  FaTrash,
  FaSearch,
  FaFilter,
  FaTimes,
  FaEye,
  FaStar,
  FaRegHeart,
  FaPlus,
  FaArrowRight,
  FaShoppingBag,
  FaRegStar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaChartLine,
  FaSortAmountDown,
  FaShare,
  FaDownload,
  FaSync
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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

  // دوال متخصصة للمفضلة
  async trackWishlistAction(action, metadata = {}) {
    return this.trackEvent(`wishlist_${action}`, {
      ...metadata
    });
  }

  async trackProductInteraction(action, product, metadata = {}) {
    return this.trackEvent(`wishlist_${action}`, {
      product_id: product.productId || product.id,
      product_title: product.title,
      product_category: product.category,
      product_price: product.price,
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
    return { success: false, error: error.message };
  }
};

function WishlistPage() {
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const { 
    wishlist, 
    removeFromWishlist, 
    updateNote, 
    updatePriority,
    isInWishlist,
    clearWishlist
  } = useWishlist();
  
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [quickView, setQuickView] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [pageViewStartTime, setPageViewStartTime] = useState(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const [wishlistModifications, setWishlistModifications] = useState(0);

  // Get wishlist products with full product data
  const wishlistProducts = useMemo(() => {
    return wishlist.map(wishlistItem => ({
      ...wishlistItem,
      ...wishlistItem.product
    }));
  }, [wishlist]);

  // Filter and sort wishlist
  const filteredWishlist = useMemo(() => {
    let filtered = wishlistProducts.filter(item => {
      const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      
      const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
      
      const matchesPrice = priceFilter === "all" || 
                          (priceFilter === "under50" && item.price < 50) ||
                          (priceFilter === "50-100" && item.price >= 50 && item.price <= 100) ||
                          (priceFilter === "over100" && item.price > 100);

      return matchesSearch && matchesCategory && matchesPriority && matchesPrice;
    });

    // Sorting
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.title?.localeCompare(b.title));
        break;
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        break;
      default:
        filtered.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
    }

    return filtered;
  }, [wishlistProducts, searchTerm, categoryFilter, priorityFilter, priceFilter, sortBy]);

  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(wishlistProducts.map(item => item.category).filter(Boolean))];
    return ["all", ...uniqueCategories];
  }, [wishlistProducts]);

  // Wishlist statistics with enhanced analytics
  const wishlistStats = useMemo(() => {
    const total = wishlistProducts.length;
    const totalValue = wishlistProducts.reduce((sum, item) => sum + (item.price || 0), 0);
    const highPriority = wishlistProducts.filter(item => item.priority === "high").length;
    const inStock = wishlistProducts.filter(item => item.stock > 0).length;
    const withNotes = wishlistProducts.filter(item => item.note && item.note.trim()).length;
    const averagePrice = total > 0 ? totalValue / total : 0;
    
    // Category distribution
    const categoryDistribution = wishlistProducts.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    
    // Priority distribution
    const priorityDistribution = wishlistProducts.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    }, {});
    
    return { 
      total, 
      totalValue, 
      highPriority, 
      inStock, 
      withNotes,
      averagePrice,
      categoryDistribution,
      priorityDistribution
    };
  }, [wishlistProducts]);

  // Check if product is in cart
  const isInCart = useCallback((productId) => {
    return items.some(item => item.id == productId);
  }, [items]);

  // تتبع أحداث التحليلات
  const trackWishlistAction = useCallback((action, metadata = {}) => {
    safeTrack(analyticsService.trackWishlistAction, action, {
      wishlist_count: wishlist.length,
      wishlist_stats: wishlistStats,
      ...metadata
    });
  }, [wishlist.length, wishlistStats]);

  const trackProductAction = useCallback((action, product, metadata = {}) => {
    safeTrack(analyticsService.trackProductInteraction, action, product, {
      wishlist_context: {
        current_wishlist_size: wishlist.length,
        item_priority: product.priority,
        has_note: !!(product.note && product.note.trim())
      },
      ...metadata
    });
  }, [wishlist.length]);

  // تتبع عرض صفحة المفضلة
  useEffect(() => {
    const startTime = Date.now();
    setPageViewStartTime(startTime);

    // 🔍 تتبع عرض صفحة المفضلة
    safeTrack(analyticsService.trackPageView, 'wishlist', {
      wishlist_items_count: wishlist.length,
      wishlist_total_value: wishlistStats.totalValue,
      wishlist_analytics: {
        categories_count: Object.keys(wishlistStats.categoryDistribution).length,
        priority_breakdown: wishlistStats.priorityDistribution,
        notes_usage: wishlistStats.withNotes
      }
    });
    
    // 🔍 تتبع عرض المفضلة كصفحة
    safeTrack(analyticsService.trackWishlistAction, 'page_view', {
      session_start_time: startTime,
      initial_wishlist_state: {
        items: wishlist.length,
        value: wishlistStats.totalValue,
        categories: Object.keys(wishlistStats.categoryDistribution).length
      }
    });

    // تتبع وقت الجلسة عند مغادرة الصفحة
    return () => {
      if (startTime) {
        const viewDuration = Date.now() - startTime;
        safeTrack(analyticsService.trackWishlistAction, 'session_end', {
          total_duration_ms: viewDuration,
          final_wishlist_state: {
            items: wishlist.length,
            value: wishlistStats.totalValue
          },
          user_interactions: interactionCount,
          wishlist_modifications: wishlistModifications,
          session_engagement: viewDuration > 60000 ? 'high' : viewDuration > 30000 ? 'medium' : 'low'
        });
      }
    };
  }, []);

  // Handlers
  const handleRemoveFromWishlist = useCallback((wishlistId, product, e) => {
    e?.stopPropagation();
    
    // 🔍 تتبع إزالة المنتج من المفضلة
    trackProductAction('remove', product, {
      removal_context: {
        time_on_page: Date.now() - (pageViewStartTime || Date.now()),
        total_interactions: interactionCount + 1,
        was_selected: selectedItems.has(wishlistId)
      }
    });
    
    removeFromWishlist(wishlistId);
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(wishlistId);
      return newSet;
    });
    setInteractionCount(prev => prev + 1);
    setWishlistModifications(prev => prev + 1);
  }, [removeFromWishlist, trackProductAction, pageViewStartTime, interactionCount, selectedItems]);

  const addToCartFromWishlist = useCallback((product, e) => {
    e?.stopPropagation();
    
    // 🔍 تتبع إضافة المنتج إلى السلة من المفضلة
    trackProductAction('add_to_cart', product, {
      from_wishlist: true,
      conversion_context: {
        time_in_wishlist: Date.now() - new Date(product.addedDate),
        wishlist_priority: product.priority,
        had_note: !!(product.note && product.note.trim())
      }
    });
    
    // 🔍 تتبع إضافة إلى السلة للتحليلات العامة
    safeTrack(analyticsService.trackAddToCart,
      product.productId || product.id,
      1,
      product.price,
      product.title,
      {
        source: 'wishlist_page',
        wishlist_metrics: {
          priority: product.priority,
          time_in_wishlist: Date.now() - new Date(product.addedDate),
          had_note: !!(product.note && product.note.trim())
        }
      }
    );
    
    addItem({
      ...product,
      id: product.productId || product.id
    });
    setInteractionCount(prev => prev + 1);
  }, [addItem, trackProductAction]);

  const toggleSelectItem = useCallback((wishlistId, product) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(wishlistId)) {
        newSet.delete(wishlistId);
        // 🔍 تتبع إلغاء تحديد المنتج
        trackProductAction('deselect', product, {
          selection_context: {
            total_selected: newSet.size,
            selection_duration: Date.now() - (pageViewStartTime || Date.now())
          }
        });
      } else {
        newSet.add(wishlistId);
        // 🔍 تتبع تحديد المنتج
        trackProductAction('select', product, {
          selection_context: {
            total_selected: newSet.size,
            selection_duration: Date.now() - (pageViewStartTime || Date.now())
          }
        });
      }
      return newSet;
    });
    setInteractionCount(prev => prev + 1);
  }, [trackProductAction, pageViewStartTime]);

  const selectAllItems = useCallback(() => {
    if (selectedItems.size === filteredWishlist.length) {
      setSelectedItems(new Set());
      // 🔍 تتبع إلغاء تحديد الكل
      trackWishlistAction('deselect_all', {
        previous_selection_count: selectedItems.size
      });
    } else {
      setSelectedItems(new Set(filteredWishlist.map(item => item.id)));
      // 🔍 تتبع تحديد الكل
      trackWishlistAction('select_all', {
        items_count: filteredWishlist.length,
        selection_value: filteredWishlist.reduce((sum, item) => sum + item.price, 0)
      });
    }
    setInteractionCount(prev => prev + 1);
  }, [filteredWishlist, selectedItems.size, trackWishlistAction]);

  const removeSelectedItems = useCallback(() => {
    // 🔍 تتبع إزالة العناصر المحددة
    trackWishlistAction('remove_selected', {
      items_count: selectedItems.size,
      total_value: filteredWishlist
        .filter(item => selectedItems.has(item.id))
        .reduce((sum, item) => sum + item.price, 0),
      selection_analysis: {
        priority_breakdown: filteredWishlist
          .filter(item => selectedItems.has(item.id))
          .reduce((acc, item) => {
            acc[item.priority] = (acc[item.priority] || 0) + 1;
            return acc;
          }, {}),
        categories_removed: [...new Set(filteredWishlist
          .filter(item => selectedItems.has(item.id))
          .map(item => item.category))]
      }
    });
    
    selectedItems.forEach(id => {
      const product = wishlistProducts.find(item => item.id === id);
      if (product) {
        trackProductAction('remove', product, { 
          bulk: true,
          removal_reason: 'bulk_action'
        });
      }
      removeFromWishlist(id);
    });
    setSelectedItems(new Set());
    setInteractionCount(prev => prev + 1);
    setWishlistModifications(prev => prev + selectedItems.size);
  }, [selectedItems, removeFromWishlist, wishlistProducts, filteredWishlist, trackWishlistAction, trackProductAction]);

  const addSelectedToCart = useCallback(() => {
    const selectedProducts = filteredWishlist.filter(item => selectedItems.has(item.id));
    const totalValue = selectedProducts.reduce((sum, item) => sum + item.price, 0);
    
    // 🔍 تتبع إضافة العناصر المحددة إلى السلة
    trackWishlistAction('add_selected_to_cart', {
      items_count: selectedItems.size,
      total_value: totalValue,
      conversion_analysis: {
        average_item_value: totalValue / selectedItems.size,
        priority_distribution: selectedProducts.reduce((acc, item) => {
          acc[item.priority] = (acc[item.priority] || 0) + 1;
          return acc;
        }, {}),
        categories_added: [...new Set(selectedProducts.map(item => item.category))]
      }
    });
    
    selectedProducts.forEach(product => {
      addToCartFromWishlist(product);
    });
    setInteractionCount(prev => prev + 1);
  }, [filteredWishlist, selectedItems, addToCartFromWishlist, trackWishlistAction]);

  const handleUpdatePriority = useCallback((wishlistId, priority, product) => {
    // 🔍 تتبع تحديث الأولوية
    trackProductAction('update_priority', product, {
      old_priority: product.priority,
      new_priority: priority,
      update_context: {
        time_on_page: Date.now() - (pageViewStartTime || Date.now()),
        interaction_sequence: interactionCount + 1
      }
    });
    
    updatePriority(wishlistId, priority);
    setInteractionCount(prev => prev + 1);
    setWishlistModifications(prev => prev + 1);
  }, [updatePriority, trackProductAction, pageViewStartTime, interactionCount]);

  const handleUpdateNote = useCallback((wishlistId, note, product) => {
    // 🔍 تتبع تحديث الملاحظة
    trackProductAction('update_note', product, {
      note_length: note?.length || 0,
      had_previous_note: !!(product.note && product.note.trim()),
      update_type: note ? (product.note ? 'updated' : 'added') : 'removed'
    });
    
    updateNote(wishlistId, note);
    setShowNoteModal(null);
    setInteractionCount(prev => prev + 1);
    setWishlistModifications(prev => prev + 1);
  }, [updateNote, trackProductAction]);

  const clearAllWishlist = useCallback(() => {
    // 🔍 تتبع تفريغ المفضلة
    trackWishlistAction('clear_all', {
      items_count: wishlist.length,
      total_value: wishlistStats.totalValue,
      clearance_analysis: {
        categories_cleared: Object.keys(wishlistStats.categoryDistribution),
        priority_breakdown: wishlistStats.priorityDistribution,
        notes_lost: wishlistStats.withNotes
      }
    });
    
    clearWishlist();
    setSelectedItems(new Set());
    setShowClearConfirm(false);
    setInteractionCount(prev => prev + 1);
    setWishlistModifications(prev => prev + wishlist.length);
  }, [clearWishlist, wishlist.length, wishlistStats, trackWishlistAction]);

  const clearFilters = useCallback(() => {
    // 🔍 تتبع مسح الفلاتر
    trackWishlistAction('clear_filters', {
      previous_filters: {
        search: searchTerm,
        category: categoryFilter,
        priority: priorityFilter,
        price: priceFilter,
        sort: sortBy
      },
      filter_usage_duration: Date.now() - (pageViewStartTime || Date.now())
    });
    
    setSearchTerm("");
    setCategoryFilter("all");
    setPriorityFilter("all");
    setPriceFilter("all");
    setSortBy("recent");
    setInteractionCount(prev => prev + 1);
  }, [searchTerm, categoryFilter, priorityFilter, priceFilter, sortBy, trackWishlistAction, pageViewStartTime]);

  const handleProductClick = useCallback((productId, product, e) => {
    if (!e.target.closest('button') && !e.target.closest('a')) {
      // 🔍 تتبع النقر على المنتج للذهاب إلى صفحة المنتج
      trackProductAction('click_through', product, {
        navigation_context: {
          time_in_wishlist: Date.now() - new Date(product.addedDate),
          wishlist_priority: product.priority,
          had_note: !!(product.note && product.note.trim())
        }
      });
      
      navigate(`/singleproduct/${productId}`);
    }
  }, [navigate, trackProductAction]);

  const handleQuickView = useCallback((product) => {
    // 🔍 تتبع العرض السريع
    trackProductAction('quick_view', product, {
      view_context: {
        time_on_page: Date.now() - (pageViewStartTime || Date.now()),
        interaction_number: interactionCount + 1
      }
    });
    
    setQuickView(product);
    setInteractionCount(prev => prev + 1);
  }, [trackProductAction, pageViewStartTime, interactionCount]);

  const handleSearch = useCallback((term) => {
    // 🔍 تتبع البحث في المفضلة
    if (term) {
      trackWishlistAction('search', {
        search_term: term,
        results_count: filteredWishlist.length,
        search_timing: Date.now() - (pageViewStartTime || Date.now())
      });
    }
    setSearchTerm(term);
    setInteractionCount(prev => prev + 1);
  }, [filteredWishlist.length, trackWishlistAction, pageViewStartTime]);

  const handleFilterChange = useCallback((filterType, value) => {
    // 🔍 تتبع تغيير الفلاتر
    trackWishlistAction('filter_change', {
      filter_type: filterType,
      filter_value: value,
      current_filter_state: {
        search: searchTerm,
        category: categoryFilter,
        priority: priorityFilter,
        price: priceFilter,
        sort: sortBy
      }
    });
    
    switch (filterType) {
      case 'category':
        setCategoryFilter(value);
        break;
      case 'priority':
        setPriorityFilter(value);
        break;
      case 'price':
        setPriceFilter(value);
        break;
      case 'sort':
        setSortBy(value);
        break;
      default:
        break;
    }
    setInteractionCount(prev => prev + 1);
  }, [searchTerm, categoryFilter, priorityFilter, priceFilter, sortBy, trackWishlistAction]);

  // 🔍 تتبع تصدير المفضلة
  const handleExportWishlist = useCallback(() => {
    const exportData = {
      exported_at: new Date().toISOString(),
      total_items: wishlist.length,
      total_value: wishlistStats.totalValue,
      items: wishlist.map(item => ({
        title: item.product.title,
        category: item.product.category,
        price: item.product.price,
        priority: item.priority,
        note: item.note,
        added_date: item.addedDate,
        in_stock: item.product.stock > 0
      }))
    };

    // 🔍 تتبع تصدير المفضلة
    trackWishlistAction('export', {
      items_count: wishlist.length,
      export_format: 'json',
      data_size: JSON.stringify(exportData).length
    });

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wishlist-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    setInteractionCount(prev => prev + 1);
  }, [wishlist, wishlistStats, trackWishlistAction]);

  // Priority badge component
  const PriorityBadge = ({ priority }) => {
    const config = {
      high: { class: "bg-danger", text: "High", icon: FaHeart },
      medium: { class: "bg-warning", text: "Medium", icon: FaRegHeart },
      low: { class: "bg-secondary", text: "Low", icon: FaRegStar }
    };

    const { class: badgeClass, text, icon: Icon } = config[priority] || config.low;

    return (
      <span className={`badge ${badgeClass} priority-badge`}>
        <Icon className="me-1" size={10} />
        {text}
      </span>
    );
  };

  // Wishlist item component
  const WishlistItem = ({ item, index }) => {
    const inCart = isInCart(item.productId || item.id);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="wishlist-card-item"
      >
        <div className={`card wishlist-item border-0 shadow-sm h-100 ${selectedItems.has(item.id) ? 'selected' : ''}`}>
          {/* Selection Checkbox */}
          <div className="position-absolute top-0 start-0 m-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={selectedItems.has(item.id)}
                onChange={() => toggleSelectItem(item.id, item)}
              />
            </div>
          </div>

          {/* Priority Badge */}
          <div className="position-absolute top-0 end-0 m-3">
            <PriorityBadge priority={item.priority} />
          </div>

          {/* Analytics Badge */}
          <div className="position-absolute top-50 start-0 m-2">
            <span className="badge bg-info bg-opacity-90 text-white small">
              <FaClock className="me-1" />
              {Math.round((Date.now() - new Date(item.addedDate)) / (1000 * 60 * 60 * 24))}d
            </span>
          </div>

          {/* Product Image */}
          <div className="position-relative overflow-hidden">
            <img
              src={item.images?.[0] || "/assets/img/placeholder.jpg"}
              className="card-img-top wishlist-image"
              alt={item.title}
              style={{ height: '200px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iMTUwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
              }}
            />
            
            {/* Quick Actions Overlay */}
            <div className="wishlist-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
              <div className="btn-group">
                <button
                  className="btn btn-light btn-sm rounded-circle"
                  onClick={() => handleQuickView(item)}
                  title="Quick View"
                >
                  <FaEye />
                </button>
                <button
                  className="btn btn-light btn-sm rounded-circle"
                  onClick={(e) => handleRemoveFromWishlist(item.id, item, e)}
                  title="Remove from Wishlist"
                >
                  <FaTrash />
                </button>
                <button
                  className="btn btn-light btn-sm rounded-circle"
                  onClick={() => setShowNoteModal(item)}
                  title="Add Note"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Discount Badge */}
            {item.discountPercentage > 0 && (
              <span className="position-absolute top-0 start-0 m-2 badge bg-danger">
                -{Math.round(item.discountPercentage)}%
              </span>
            )}

            {/* In Cart Badge */}
            {inCart && (
              <span className="position-absolute bottom-0 start-0 m-2 badge bg-success">
                <FaCheckCircle className="me-1" />
                In Cart
              </span>
            )}
          </div>

          <div className="card-body d-flex flex-column">
            {/* Category */}
            <div className="mb-2">
              <span className="badge bg-light text-dark small">{item.category}</span>
            </div>

            {/* Title */}
            <h6 className="card-title fw-semibold mb-2 flex-grow-1 wishlist-title">
              <Link 
                to={`/singleproduct/${item.productId || item.id}`}
                className="text-decoration-none text-dark"
                onClick={() => trackProductAction('click_through', item)}
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

            {/* Note */}
            {item.note && (
              <div className="mb-3 p-2 bg-light rounded small">
                <em>"{item.note}"</em>
              </div>
            )}

            {/* Price and Stock */}
            <div className="d-flex justify-content-between align-items-center mb-3">
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
              <small className={`${item.stock > 0 ? 'text-success' : 'text-danger'}`}>
                {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
              </small>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2 mt-auto">
              {inCart ? (
                <button
                  className="btn btn-success btn-sm flex-fill"
                  disabled
                >
                  <FaCheckCircle className="me-1" />
                  In Cart
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-sm flex-fill"
                  onClick={(e) => addToCartFromWishlist(item, e)}
                >
                  <FaShoppingCart className="me-1" />
                  Add to Cart
                </button>
              )}
              
              {/* زر القلب الشفاف */}
              <button
                className="btn btn-outline-danger btn-sm transparent-heart-btn"
                onClick={(e) => handleRemoveFromWishlist(item.id, item, e)}
                title="Remove from Wishlist"
              >
                <FaHeart className="transparent-heart-icon" />
              </button>
            </div>

            {/* Added Date */}
            <div className="text-center mt-2">
              <small className="text-muted">
                Added {new Date(item.addedDate).toLocaleDateString()}
              </small>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Quick View Modal
  const QuickViewModal = () => (
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
                    <p className="text-muted">{quickView.description}</p>
                    
                    {/* Priority and Note */}
                    <div className="mb-3">
                      <strong>Priority:</strong> <PriorityBadge priority={quickView.priority} />
                    </div>
                    {quickView.note && (
                      <div className="mb-3 p-2 bg-light rounded">
                        <strong>Note:</strong> <em>"{quickView.note}"</em>
                      </div>
                    )}

                    {/* Analytics Info */}
                    <div className="mb-3 p-2 bg-info bg-opacity-10 rounded">
                      <small className="text-muted">
                        <FaClock className="me-1" />
                        In wishlist for {Math.round((Date.now() - new Date(quickView.addedDate)) / (1000 * 60 * 60 * 24))} days
                      </small>
                    </div>

                    <div className="d-flex gap-2 mt-4">
                      <button
                        onClick={(e) => {
                          addToCartFromWishlist(quickView, e);
                          setQuickView(null);
                        }}
                        className="btn btn-primary flex-fill"
                        disabled={isInCart(quickView.productId || quickView.id)}
                      >
                        <FaShoppingCart className="me-2" />
                        {isInCart(quickView.productId || quickView.id) ? 'In Cart' : 'Add to Cart'}
                      </button>
                      <Link
                        to={`/singleproduct/${quickView.productId || quickView.id}`}
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

  // Note Modal
  const NoteModal = () => (
    <AnimatePresence>
      {showNoteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowNoteModal(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Note</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowNoteModal(null)}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Add a note for this item (e.g., 'Birthday gift', 'Wait for sale')"
                  defaultValue={showNoteModal.note}
                  onChange={(e) => handleUpdateNote(showNoteModal.id, e.target.value, showNoteModal)}
                />
                <div className="mt-3">
                  <label className="form-label">Priority:</label>
                  <div className="btn-group w-100">
                    <button
                      className={`btn btn-sm ${showNoteModal.priority === 'low' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                      onClick={() => handleUpdatePriority(showNoteModal.id, 'low', showNoteModal)}
                    >
                      Low
                    </button>
                    <button
                      className={`btn btn-sm ${showNoteModal.priority === 'medium' ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => handleUpdatePriority(showNoteModal.id, 'medium', showNoteModal)}
                    >
                      Medium
                    </button>
                    <button
                      className={`btn btn-sm ${showNoteModal.priority === 'high' ? 'btn-danger' : 'btn-outline-danger'}`}
                      onClick={() => handleUpdatePriority(showNoteModal.id, 'high', showNoteModal)}
                    >
                      High
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => setShowNoteModal(null)}
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Clear Confirmation Modal
  const ClearConfirmationModal = () => (
    <AnimatePresence>
      {showClearConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowClearConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">
                  <FaExclamationTriangle className="me-2" />
                  Clear Wishlist
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowClearConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to clear your entire wishlist? This action cannot be undone.</p>
                <p className="text-muted">This will remove {wishlist.length} items from your wishlist.</p>
                
                {/* Analytics Summary */}
                <div className="bg-light rounded-3 p-3 mt-3">
                  <h6 className="fw-semibold mb-2">Wishlist Analytics</h6>
                  <div className="row small text-muted">
                    <div className="col-6">
                      <div>Total Value: ${wishlistStats.totalValue.toFixed(2)}</div>
                      <div>High Priority: {wishlistStats.highPriority}</div>
                    </div>
                    <div className="col-6">
                      <div>With Notes: {wishlistStats.withNotes}</div>
                      <div>Categories: {Object.keys(wishlistStats.categoryDistribution).length}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={clearAllWishlist}
                >
                  Clear All
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="container-fluid py-4 wishlist-page">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 fw-bold mb-2">
                <FaHeart className="text-danger me-2" />
                My Wishlist
                {wishlist.length > 0 && (
                  <span className="badge bg-danger ms-2">{wishlist.length}</span>
                )}
              </h1>
              <p className="text-muted mb-0">
                Save your favorite items for later
              </p>
              
              {/* Analytics Badges */}
              <div className="d-flex gap-2 mt-2">
                <span className="badge bg-info">
                  <FaClock className="me-1" />
                  {pageViewStartTime ? Math.round((Date.now() - pageViewStartTime) / 1000) : 0}s
                </span>
                <span className="badge bg-warning">
                  {interactionCount} interactions
                </span>
                <span className="badge bg-success">
                  {wishlistModifications} modifications
                </span>
              </div>
            </div>
            <div className="d-flex gap-2">
              {wishlist.length > 0 && (
                <>
                  <button
                    className="btn btn-outline-info"
                    onClick={handleExportWishlist}
                  >
                    <FaDownload className="me-2" />
                    Export
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => setShowClearConfirm(true)}
                  >
                    <FaTrash className="me-2" />
                    Clear All
                  </button>
                </>
              )}
              <Link to="/products" className="btn btn-primary">
                <FaShoppingBag className="me-2" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Statistics */}
          {wishlist.length > 0 && (
            <div className="row g-3 mb-4">
              <div className="col-md-3 col-6">
                <div className="card stat-card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div className="stat-icon bg-danger">
                      <FaHeart />
                    </div>
                    <h3 className="stat-value fw-bold mt-3">{wishlistStats.total}</h3>
                    <p className="stat-label text-muted mb-0">Total Items</p>
                    <small className="text-muted">
                      ${wishlistStats.averagePrice.toFixed(2)} avg
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card stat-card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div className="stat-icon bg-primary">
                      <FaShoppingCart />
                    </div>
                    <h3 className="stat-value fw-bold mt-3">${wishlistStats.totalValue.toFixed(2)}</h3>
                    <p className="stat-label text-muted mb-0">Total Value</p>
                    <small className="text-muted">
                      {wishlistStats.withNotes} with notes
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card stat-card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div className="stat-icon bg-warning">
                      <FaRegStar />
                    </div>
                    <h3 className="stat-value fw-bold mt-3">{wishlistStats.highPriority}</h3>
                    <p className="stat-label text-muted mb-0">High Priority</p>
                    <small className="text-muted">
                      {Object.keys(wishlistStats.priorityDistribution).length} levels
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="card stat-card border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div className="stat-icon bg-success">
                      <FaCheckCircle />
                    </div>
                    <h3 className="stat-value fw-bold mt-3">{wishlistStats.inStock}</h3>
                    <p className="stat-label text-muted mb-0">In Stock</p>
                    <small className="text-muted">
                      {Object.keys(wishlistStats.categoryDistribution).length} categories
                    </small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Actions */}
          {filteredWishlist.length > 0 && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectedItems.size === filteredWishlist.length && filteredWishlist.length > 0}
                        onChange={selectAllItems}
                      />
                      <label className="form-check-label">
                        Select All ({selectedItems.size} selected)
                      </label>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2 flex-wrap">
                    {selectedItems.size > 0 && (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={addSelectedToCart}
                        >
                          <FaShoppingCart className="me-1" />
                          Add {selectedItems.size} to Cart
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={removeSelectedItems}
                        >
                          <FaTrash className="me-1" />
                          Remove {selectedItems.size}
                        </button>
                      </>
                    )}
                    
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => {
                        setShowFilters(!showFilters);
                        trackWishlistAction('toggle_filters', { show: !showFilters });
                      }}
                    >
                      <FaFilter className="me-1" />
                      Filters
                    </button>

                    <button
                      className="btn btn-outline-info btn-sm"
                      onClick={handleExportWishlist}
                    >
                      <FaDownload className="me-1" />
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <AnimatePresence>
            {showFilters && filteredWishlist.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="card border-0 shadow-sm mb-4"
              >
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Search</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white">
                          <FaSearch className="text-muted" />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search wishlist..."
                          value={searchTerm}
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={categoryFilter}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                      >
                        <option value="all">All Categories</option>
                        {categories.filter(cat => cat !== 'all').map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        value={priorityFilter}
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                      >
                        <option value="all">All Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Price</label>
                      <select
                        className="form-select"
                        value={priceFilter}
                        onChange={(e) => handleFilterChange('price', e.target.value)}
                      >
                        <option value="all">All Prices</option>
                        <option value="under50">Under $50</option>
                        <option value="50-100">$50 - $100</option>
                        <option value="over100">Over $100</option>
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">Sort By</label>
                      <select
                        className="form-select"
                        value={sortBy}
                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                      >
                        <option value="recent">Most Recent</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="name">Name A-Z</option>
                        <option value="priority">Priority</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Active Filters */}
                  {(searchTerm || categoryFilter !== 'all' || priorityFilter !== 'all' || priceFilter !== 'all') && (
                    <div className="mt-3 d-flex align-items-center gap-2 flex-wrap">
                      <small className="text-muted">Active filters:</small>
                      {searchTerm && (
                        <span className="badge bg-primary">
                          Search: {searchTerm}
                          <button 
                            className="btn-close btn-close-white ms-1"
                            onClick={() => setSearchTerm("")}
                          />
                        </span>
                      )}
                      {categoryFilter !== 'all' && (
                        <span className="badge bg-secondary">
                          Category: {categoryFilter}
                          <button 
                            className="btn-close btn-close-white ms-1"
                            onClick={() => setCategoryFilter("all")}
                          />
                        </span>
                      )}
                      {priorityFilter !== 'all' && (
                        <span className="badge bg-warning">
                          Priority: {priorityFilter}
                          <button 
                            className="btn-close btn-close-white ms-1"
                            onClick={() => setPriorityFilter("all")}
                          />
                        </span>
                      )}
                      {priceFilter !== 'all' && (
                        <span className="badge bg-info">
                          Price: {priceFilter}
                          <button 
                            className="btn-close btn-close-white ms-1"
                            onClick={() => setPriceFilter("all")}
                          />
                        </span>
                      )}
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={clearFilters}
                      >
                        Clear All
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wishlist Items */}
          {filteredWishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-5"
            >
              <div className="fs-1 mb-3">💝</div>
              <h4 className="text-muted mb-3">
                {wishlist.length === 0 
                  ? "Your wishlist is empty"
                  : "No items match your filters"
                }
              </h4>
              <p className="text-muted mb-4">
                {wishlist.length === 0
                  ? "Start adding items you love to your wishlist!"
                  : "Try adjusting your search criteria"
                }
              </p>
              <Link to="/products" className="btn btn-primary">
                <FaShoppingBag className="me-2" />
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="wishlist-grid">
              {filteredWishlist.map((item, index) => (
                <WishlistItem key={item.id} item={item} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <QuickViewModal />
      <NoteModal />
      <ClearConfirmationModal />

      {/* Custom CSS */}
      <style>{`
        .wishlist-page {
          background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
          min-height: 100vh;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          padding: 1rem 0;
        }

        .wishlist-card-item {
          transition: all 0.3s ease;
        }

        .wishlist-item {
          transition: all 0.3s ease;
          border-radius: 15px;
          overflow: hidden;
        }

        .wishlist-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(220, 53, 69, 0.2) !important;
        }

        .wishlist-item.selected {
          border: 2px solid #667eea;
        }

        .wishlist-image {
          transition: transform 0.3s ease;
        }

        .wishlist-item:hover .wishlist-image {
          transform: scale(1.05);
        }

        .wishlist-overlay {
          background: rgba(220, 53, 69, 0.9);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .wishlist-item:hover .wishlist-overlay {
          opacity: 1;
        }

        .wishlist-title {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.4;
          height: 2.8em;
        }

        .priority-badge {
          font-size: 0.7rem;
          padding: 0.25em 0.6em;
        }

        .stat-card {
          transition: all 0.3s ease;
          border-radius: 15px;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: white;
          font-size: 1.25rem;
        }

        .stat-value {
          color: #2c3e50;
          font-size: 1.75rem;
        }

        .stat-label {
          font-size: 0.9rem;
        }

        .badge {
          border-radius: 8px;
          font-size: 0.75rem;
          padding: 0.35em 0.65em;
        }

        .btn {
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        /* زر القلب الشفاف */
        .transparent-heart-btn {
          background: transparent !important;
          border: 1px solid #dc3545 !important;
          padding: 0.375rem 0.75rem;
          transition: all 0.3s ease;
        }

        .transparent-heart-btn:hover {
          background: rgba(220, 53, 69, 0.1) !important;
          transform: scale(1.05);
        }

        .transparent-heart-icon {
          color: #dc3545;
          transition: all 0.3s ease;
        }

        .transparent-heart-btn:hover .transparent-heart-icon {
          color: #fff;
          transform: scale(1.1);
        }

        .form-control, .form-select {
          border-radius: 10px;
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
        }

        .form-control:focus, .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        .card {
          border-radius: 15px;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .stat-value {
            font-size: 1.5rem;
          }
          
          .stat-icon {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }

          .wishlist-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        @media (max-width: 576px) {
          .wishlist-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default WishlistPage;