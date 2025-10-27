import React, { useState, useEffect } from "react";
import { useCart } from "react-use-cart";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTrash, 
  FaPlus, 
  FaMinus, 
  FaShoppingBag, 
  FaArrowRight, 
  FaArrowLeft,
  FaShoppingCart,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaStar,
  FaExclamationTriangle,
  FaCheck,
  FaClock
} from "react-icons/fa";

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

  // دوال متخصصة للسلة
  async trackCartAction(action, productId = null, quantity = 1, price = 0, title = '', metadata = {}) {
    return this.trackEvent('cart_action', {
      action,
      product_id: productId,
      quantity,
      price,
      product_title: title,
      ...metadata
    });
  }

  async trackCartView(cartItemsCount, totalAmount, uniqueItemsCount, metadata = {}) {
    return this.trackEvent('cart_view', {
      cart_items_count: cartItemsCount,
      total_amount: totalAmount,
      unique_items_count: uniqueItemsCount,
      ...metadata
    });
  }

  async trackCheckoutIntent(totalAmount, itemsCount, metadata = {}) {
    return this.trackEvent('checkout_intent', {
      total_amount: totalAmount,
      items_count: itemsCount,
      ...metadata
    });
  }

  async trackCartEmptied(itemsCount, totalAmount, metadata = {}) {
    return this.trackEvent('cart_emptied', {
      items_count: itemsCount,
      total_amount: totalAmount,
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
    return { success: false, error: error.message };
  }
};

function Cart() {
  const { 
    items, 
    updateItemQuantity, 
    removeItem, 
    isEmpty, 
    totalItems, 
    cartTotal, 
    totalUniqueItems, 
    emptyCart 
  } = useCart();
  
  const navigate = useNavigate();
  const [removingItem, setRemovingItem] = useState(null);
  const [showEmptyCartConfirm, setShowEmptyCartConfirm] = useState(false);
  const [pageViewStartTime, setPageViewStartTime] = useState(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const [cartModifications, setCartModifications] = useState(0);

  // Calculate shipping (free over $50)
  const shippingCost = cartTotal >= 50 ? 0 : 10;
  const finalTotal = cartTotal + shippingCost;
  const freeShippingProgress = Math.min((cartTotal / 50) * 100, 100);

  // 🔍 تتبع مشاهدة صفحة السلة
  useEffect(() => {
    const startTime = Date.now();
    setPageViewStartTime(startTime);

    if (!isEmpty) {
      safeTrack(analyticsService.trackCartView, totalItems, cartTotal, totalUniqueItems, {
        session_start_time: startTime,
        cart_value_analysis: cartTotal > 100 ? 'high_value' : cartTotal > 50 ? 'medium_value' : 'low_value',
        potential_free_shipping: cartTotal >= 50
      });

      // 🔍 تتبع تحليل محتويات السلة
      safeTrack(analyticsService.trackEvent, 'cart_content_analysis', {
        total_items: totalItems,
        unique_items: totalUniqueItems,
        total_value: cartTotal,
        average_item_value: cartTotal / totalItems,
        items_by_category: items.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        }, {}),
        has_discounted_items: items.some(item => item.discountPercentage > 0)
      });
    }

    // تتبع وقت الجلسة عند مغادرة الصفحة
    return () => {
      if (startTime) {
        const viewDuration = Date.now() - startTime;
        safeTrack(analyticsService.trackEvent, 'cart_page_session_end', {
          total_duration_ms: viewDuration,
          final_cart_state: {
            items_count: totalItems,
            total_value: cartTotal,
            unique_items: totalUniqueItems
          },
          user_interactions: interactionCount,
          cart_modifications: cartModifications,
          session_completion: viewDuration > 30000 ? 'extended_engagement' : 'brief_view'
        });
      }
    };
  }, []);

  // Handle item removal with animation and analytics
  const handleRemoveItem = (item) => {
    setRemovingItem(item.id);
    
    // 🔍 تتبع إزالة المنتج من السلة
    safeTrack(analyticsService.trackCartAction, 'remove_item', item.id, item.quantity, item.title, {
      item_total_value: item.price * item.quantity,
      removal_reason: 'user_action',
      position_in_cart: items.findIndex(i => i.id === item.id),
      cart_state_after_removal: {
        remaining_items: totalItems - item.quantity,
        new_total: cartTotal - (item.price * item.quantity)
      }
    });

    // 🔍 تتبع الحدث التفصيلي
    safeTrack(analyticsService.trackEvent, 'cart_item_removed', {
      product_id: item.id,
      product_title: item.title,
      quantity_removed: item.quantity,
      value_removed: item.price * item.quantity,
      removal_context: {
        time_on_page: Date.now() - (pageViewStartTime || Date.now()),
        total_interactions: interactionCount + 1,
        cart_modifications: cartModifications + 1
      }
    });
    
    setTimeout(() => {
      removeItem(item.id);
      setRemovingItem(null);
      setInteractionCount(prev => prev + 1);
      setCartModifications(prev => prev + 1);
    }, 300);
  };

// Handle quantity update with analytics
const handleQuantityUpdate = (itemId, newQuantity, action, item) => {
  const oldQuantity = items.find(item => item.id === itemId)?.quantity || 0;
  const quantityChange = newQuantity - oldQuantity;
  
  // 🔍 تتبع تغيير الكمية
  safeTrack(analyticsService.trackCartAction, 
    action, 
    itemId, 
    Math.abs(quantityChange), 
    item.title, 
    {
      old_quantity: oldQuantity,
      new_quantity: newQuantity,  // ✅ تصحيح: newQuantity بدلاً من new_quantity
      change_direction: quantityChange > 0 ? 'increase' : 'decrease',
      value_change: item.price * quantityChange,
      item_new_total: item.price * newQuantity,
      cart_impact: {
        new_item_count: totalItems + quantityChange,
        new_cart_total: cartTotal + (item.price * quantityChange)
      }
    }
  );

  // 🔍 تتبع حدث تعديل الكمية التفصيلي
  safeTrack(analyticsService.trackEvent, 'cart_quantity_modified', {
    product_id: itemId,
    product_title: item.title,
    modification_type: action,
    quantity_change: Math.abs(quantityChange),
    oldQuantity,  // ✅ استخدام oldQuantity مباشرة
    newQuantity,  // ✅ استخدام newQuantity مباشرة
    price_impact: item.price * quantityChange,
    modification_context: {
      time_on_page: Date.now() - (pageViewStartTime || Date.now()),
      interaction_sequence: interactionCount + 1,
      free_shipping_progress: freeShippingProgress
    }
  });
  
  updateItemQuantity(itemId, newQuantity);
  setInteractionCount(prev => prev + 1);
  setCartModifications(prev => prev + 1);
};

  // Handle empty cart with confirmation and analytics
  const handleEmptyCart = () => {
    if (showEmptyCartConfirm) {
      // 🔍 تتبع تفريغ السلة
      safeTrack(analyticsService.trackCartEmptied, totalItems, cartTotal, {
        cart_emptied_reason: 'user_action',
        session_metrics: {
          time_on_page: Date.now() - (pageViewStartTime || Date.now()),
          total_interactions: interactionCount,
          modifications_before_empty: cartModifications
        },
        cart_composition_analysis: {
          had_discounted_items: items.some(item => item.discountPercentage > 0),
          category_distribution: items.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
          }, {}),
          average_item_value: cartTotal / totalItems
        }
      });

      // 🔍 تتبع حدث تفريغ السلة التفصيلي
      safeTrack(analyticsService.trackEvent, 'cart_emptied_detailed', {
        items_removed: totalItems,
        total_value_lost: cartTotal,
        items_breakdown: items.map(item => ({
          product_id: item.id,
          title: item.title,
          quantity: item.quantity,
          value: item.price * item.quantity,
          category: item.category
        })),
        user_behavior: {
          time_to_empty: Date.now() - (pageViewStartTime || Date.now()),
          interactions_before_empty: interactionCount,
          abandonment_reason: 'manual_empty'
        }
      });
      
      emptyCart();
      setShowEmptyCartConfirm(false);
      setInteractionCount(prev => prev + 1);
    } else {
      setShowEmptyCartConfirm(true);
      setTimeout(() => setShowEmptyCartConfirm(false), 3000);
      
      // 🔍 تتبع محاولة تفريغ السلة
      safeTrack(analyticsService.trackEvent, 'cart_empty_attempt', {
        confirmation_required: true,
        cart_state: {
          items_count: totalItems,
          total_value: cartTotal
        }
      });
    }
  };

  // Continue shopping handler
  const continueShopping = () => {
    // 🔍 تتبع متابعة التسوق
    safeTrack(analyticsService.trackEvent, 'continue_shopping_click', {
      from_page: 'cart',
      cart_state_at_exit: {
        items_count: totalItems,
        total_value: cartTotal,
        has_potential_free_shipping: cartTotal >= 50
      },
      session_metrics: {
        time_on_cart: Date.now() - (pageViewStartTime || Date.now()),
        interactions: interactionCount,
        modifications: cartModifications
      }
    });
    
    navigate("/products");
  };

  // Proceed to checkout with analytics
  const proceedToCheckout = () => {
    // 🔍 تتبع نية الدفع
    safeTrack(analyticsService.trackCheckoutIntent, finalTotal, totalItems, {
      checkout_readiness: {
        has_free_shipping: shippingCost === 0,
        cart_value_tier: cartTotal > 200 ? 'premium' : cartTotal > 100 ? 'standard' : 'basic',
        item_variety: totalUniqueItems
      },
      user_engagement: {
        time_on_cart: Date.now() - (pageViewStartTime || Date.now()),
        interactions_before_checkout: interactionCount,
        cart_modifications: cartModifications
      },
      cart_composition: items.map(item => ({
        product_id: item.id,
        category: item.category,
        quantity: item.quantity,
        value: item.price * item.quantity
      }))
    });

    // 🔍 تتبع حدث الدفع التفصيلي
    safeTrack(analyticsService.trackEvent, 'checkout_proceed_detailed', {
      cart_summary: {
        total_items: totalItems,
        unique_items: totalUniqueItems,
        subtotal: cartTotal,
        shipping: shippingCost,
        final_total: finalTotal
      },
      conversion_metrics: {
        free_shipping_achieved: shippingCost === 0,
        average_item_value: cartTotal / totalItems,
        items_per_category: items.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + item.quantity;
          return acc;
        }, {})
      },
      user_journey: {
        cart_session_duration: Date.now() - (pageViewStartTime || Date.now()),
        total_interactions: interactionCount,
        modification_intensity: cartModifications / (Date.now() - (pageViewStartTime || Date.now())) * 1000 // modifications per second
      }
    });
    
    navigate("/checkout");
  };

  // 🔍 تتبع النقر على المنتج من السلة
  const handleProductClick = (item) => {
    safeTrack(analyticsService.trackCartAction, 'product_click', item.id, item.quantity, item.title, {
      navigation_context: {
        from_page: 'cart',
        item_position: items.findIndex(i => i.id === item.id),
        cart_value_at_click: cartTotal
      },
      product_metrics: {
        item_value: item.price * item.quantity,
        is_discounted: item.discountPercentage > 0,
        category: item.category
      }
    });

    // 🔍 تتبع حدث النقر التفصيلي
    safeTrack(analyticsService.trackEvent, 'cart_product_click_detailed', {
      product_id: item.id,
      product_title: item.title,
      click_context: {
        time_in_cart: Date.now() - (pageViewStartTime || Date.now()),
        interaction_number: interactionCount + 1,
        current_cart_size: totalItems
      },
      product_details: {
        quantity_in_cart: item.quantity,
        total_value: item.price * item.quantity,
        category: item.category,
        rating: item.rating
      }
    });

    setInteractionCount(prev => prev + 1);
  };

  // 🔍 تتبع مشاهدة توصيات المنتجات
  const handleRecommendationView = (recommendationType) => {
    safeTrack(analyticsService.trackEvent, 'cart_recommendation_view', {
      recommendation_type: recommendationType,
      cart_context: {
        current_items: totalItems,
        current_total: cartTotal,
        needs_free_shipping: cartTotal < 50
      },
      view_timing: Date.now() - (pageViewStartTime || Date.now())
    });
  };

  if (isEmpty) {
    return (
      <div className="container py-5">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-5"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-4"
          >
            <div className="fs-1 mb-3">🛒</div>
            <h3 className="text-muted mb-3">Your Cart is Empty</h3>
            <p className="text-muted mb-4">
              Looks like you haven't added any items to your cart yet.
            </p>
            
            {/* Session Analytics Badge */}
            <div className="d-flex justify-content-center gap-2 mb-4">
              <span className="badge bg-info">
                <FaClock className="me-1" />
                Session: {pageViewStartTime ? Math.round((Date.now() - pageViewStartTime) / 1000) : 0}s
              </span>
              <span className="badge bg-warning">
                Interactions: {interactionCount}
              </span>
            </div>
          </motion.div>
          
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={continueShopping}
              className="btn btn-primary btn-lg px-5"
            >
              <FaShoppingBag className="me-2" />
              Start Shopping
            </motion.button>
            <Link to="/" className="btn btn-outline-secondary btn-lg">
              <FaArrowLeft className="me-2" />
              Back to Home
            </Link>
          </div>

          {/* Popular Categories Suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-5"
          >
            <h5 className="mb-4">Popular Categories</h5>
            <div className="row g-3 justify-content-center">
              {[
                { name: "Electronics", icon: "📱", link: "/products?category=electronics" },
                { name: "Fashion", icon: "👕", link: "/products?category=fashion" },
                { name: "Home & Garden", icon: "🏠", link: "/products?category=home" },
                { name: "Sports", icon: "⚽", link: "/products?category=sports" }
              ].map((category, index) => (
                <div key={index} className="col-auto">
                  <Link 
                    to={category.link}
                    className="btn btn-outline-primary d-flex align-items-center gap-2"
                    onClick={() => handleRecommendationView('category_suggestion')}
                  >
                    <span>{category.icon}</span>
                    {category.name}
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="row mb-4"
      >
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="h2 fw-bold mb-1">
                <FaShoppingCart className="me-2 text-primary" />
                Shopping Cart
              </h1>
              <p className="text-muted mb-0">
                {totalUniqueItems} unique item{totalUniqueItems !== 1 ? 's' : ''} • {totalItems} total item{totalItems !== 1 ? 's' : ''}
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
                  {cartModifications} modifications
                </span>
              </div>
            </div>
            
            <div className="d-flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEmptyCart}
                className={`btn ${showEmptyCartConfirm ? 'btn-danger' : 'btn-outline-danger'}`}
              >
                <FaTrash className="me-2" />
                {showEmptyCartConfirm ? 'Click Again to Confirm' : 'Empty Cart'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={continueShopping}
                className="btn btn-outline-primary"
              >
                <FaArrowLeft className="me-2" />
                Continue Shopping
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="row g-4">
        {/* Cart Items */}
        <div className="col-lg-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card border-0 shadow-sm"
          >
            <div className="card-header bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold">Cart Items ({totalItems})</h5>
                <div className="text-muted small">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
            
            <div className="card-body p-0">
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: removingItem === item.id ? 0 : 1, 
                      scale: removingItem === item.id ? 0.8 : 1,
                      x: removingItem === item.id ? 100 : 0 
                    }}
                    exit={{ opacity: 0, scale: 0.8, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="border-bottom p-4"
                    style={{ borderColor: '#f1f5f9' }}
                  >
                    <div className="row align-items-center">
                      {/* Product Image */}
                      <div className="col-md-2 col-4">
                        <Link 
                          to={`/singleproduct/${item.id}`}
                          onClick={() => handleProductClick(item)}
                        >
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            src={item.images?.[0] || "/assets/img/placeholder.jpg"}
                            alt={item.title}
                            className="img-fluid rounded-3"
                            style={{ 
                              height: '100px', 
                              objectFit: 'cover',
                              width: '100%'
                            }}
                          />
                        </Link>
                      </div>

                      {/* Product Details */}
                      <div className="col-md-4 col-8">
                        <Link 
                          to={`/singleproduct/${item.id}`}
                          className="text-decoration-none"
                          onClick={() => handleProductClick(item)}
                        >
                          <h6 className="fw-semibold text-dark mb-2" style={{ lineHeight: '1.4' }}>
                            {item.title}
                          </h6>
                        </Link>
                        
                        <div className="d-flex align-items-center mb-2">
                          <div className="d-flex align-items-center me-3">
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
                        
                        <div className="mb-2">
                          <span className="badge bg-light text-dark">{item.category}</span>
                          {item.discountPercentage > 0 && (
                            <span className="badge bg-success ms-1">
                              -{Math.round(item.discountPercentage)}% OFF
                            </span>
                          )}
                        </div>

                        {/* Item Analytics */}
                        <div className="small text-muted">
                          Value: ${(item.price * item.quantity).toFixed(2)}
                          {item.quantity > 1 && (
                            <span> (${item.price} × {item.quantity})</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-md-3 col-6">
                        <div className="d-flex align-items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '35px', height: '35px' }}
                            onClick={() => handleQuantityUpdate(
                              item.id, 
                              item.quantity - 1, 
                              'decrease_quantity', 
                              item
                            )}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus size={12} />
                          </motion.button>
                          
                          <span className="fw-bold mx-3" style={{ minWidth: '30px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '35px', height: '35px' }}
                            onClick={() => handleQuantityUpdate(
                              item.id, 
                              item.quantity + 1, 
                              'increase_quantity', 
                              item
                            )}
                          >
                            <FaPlus size={12} />
                          </motion.button>
                        </div>
                        
                        {/* Quantity Analytics */}
                        <div className="small text-muted text-center mt-1">
                          Position: {index + 1} of {items.length}
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="col-md-3 col-6 text-end">
                        <div className="mb-2">
                          <span className="h5 fw-bold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <div className="small text-muted">
                            ${item.price} each
                          </div>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveItem(item)}
                          className="btn btn-outline-danger btn-sm"
                          title="Remove item"
                        >
                          <FaTrash size={12} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Trust Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="row g-3 mt-4"
          >
            {[
              { icon: <FaShieldAlt />, title: "Secure Payment", desc: "100% Protected" },
              { icon: <FaTruck />, title: "Free Shipping", desc: "On orders over $50" },
              { icon: <FaUndo />, title: "Easy Returns", desc: "30 days policy" },
            ].map((feature, index) => (
              <div key={index} className="col-md-4">
                <div className="card border-0 bg-light h-100 text-center p-3">
                  <div className="text-primary fs-4 mb-2">{feature.icon}</div>
                  <h6 className="fw-semibold mb-1">{feature.title}</h6>
                  <small className="text-muted">{feature.desc}</small>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card border-0 shadow-sm sticky-top"
            style={{ top: '20px' }}
          >
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-semibold">Order Summary</h5>
            </div>
            
            <div className="card-body">
              {/* Summary Items */}
              <div className="space-y-3 mb-4">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Subtotal ({totalItems} items):</span>
                  <span className="fw-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Shipping:</span>
                  <span className={shippingCost === 0 ? "text-success fw-semibold" : "fw-semibold"}>
                    {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                
                {shippingCost > 0 && (
                  <div className="small text-muted">
                    Add ${(50 - cartTotal).toFixed(2)} more for free shipping!
                  </div>
                )}
                
                <div className="d-flex justify-content-between border-top pt-3">
                  <span className="fw-bold fs-5">Total:</span>
                  <span className="fw-bold fs-5 text-primary">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Progress Bar for Free Shipping */}
              {cartTotal < 50 && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span>Free shipping at $50</span>
                    <span>${cartTotal.toFixed(2)} of $50</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{ width: `${freeShippingProgress}%` }}
                    ></div>
                  </div>
                  <div className="small text-center text-muted mt-1">
                    {freeShippingProgress >= 50 ? (
                      <FaCheck className="text-success me-1" />
                    ) : (
                      <FaExclamationTriangle className="text-warning me-1" />
                    )}
                    {freeShippingProgress >= 50 ? 'Halfway there!' : 'Keep shopping to save!'}
                  </div>
                </div>
              )}

              {/* Cart Analytics Summary */}
              <div className="border-top pt-3 mb-4">
                <h6 className="fw-semibold mb-2">Cart Analytics</h6>
                <div className="row small text-muted">
                  <div className="col-6">
                    <div>Items: {totalItems}</div>
                    <div>Unique: {totalUniqueItems}</div>
                  </div>
                  <div className="col-6 text-end">
                    <div>Avg/Item: ${(cartTotal / totalItems).toFixed(2)}</div>
                    <div>Modifications: {cartModifications}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={proceedToCheckout}
                  className="btn btn-primary btn-lg py-3 fw-semibold"
                >
                  Proceed to Checkout
                  <FaArrowRight className="ms-2" />
                </motion.button>
                
                <Link to="/products" className="btn btn-outline-secondary">
                  Continue Shopping
                </Link>
              </div>

              {/* Security Badge */}
              <div className="text-center mt-4 pt-3 border-top">
                <small className="text-muted">
                  🔒 Secure checkout • 256-bit SSL encryption
                </small>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recently Viewed Suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="row mt-5"
      >
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-semibold mb-0">You Might Also Like</h5>
            <small className="text-muted">
              Based on your cart • {totalItems} items
            </small>
          </div>
          <div className="row g-3">
            {/* This would typically come from your recently viewed or recommended products */}
            {[
              { type: "Popular Items", icon: "🔥", desc: "Trending now" },
              { type: "Best Sellers", icon: "🎯", desc: "Customer favorites" },
              { type: "Flash Sale", icon: "⚡", desc: "Limited time offers" },
              { type: "New Arrivals", icon: "🆕", desc: "Just added" }
            ].map((rec, index) => (
              <div key={index} className="col-md-3 col-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="card border-0 shadow-sm text-center p-3 cursor-pointer"
                  onClick={() => handleRecommendationView(rec.type.toLowerCase().replace(' ', '_'))}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="fs-2 mb-2">{rec.icon}</div>
                  <small className="fw-semibold d-block">{rec.type}</small>
                  <small className="text-muted">{rec.desc}</small>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <style>{`
        .sticky-top {
          position: sticky;
          z-index: 10;
        }
        
        .card {
          transition: all 0.3s ease;
        }
        
        .card:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default Cart;