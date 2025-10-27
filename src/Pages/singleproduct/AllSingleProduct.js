import React, { useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { apiValue } from "../../constants/AllData";
import { useCart } from "react-use-cart";
import { 
  FaStar, 
  FaShoppingCart, 
  FaHeart, 
  FaShare, 
  FaTruck, 
  FaShieldAlt, 
  FaUndo,
  FaCheck,
  FaMinus,
  FaPlus,
  FaExclamationTriangle,
  FaEye,
  FaClock,
  FaArrowLeft
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// 🔍 استيراد خدمة التحليلات المحسنة
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
      view_type: 'single_product_page',
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
  };
};

function SingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = useContext(apiValue);
  const { addItem, items, updateItemQuantity } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [pageViewStartTime, setPageViewStartTime] = useState(null);
  const [imagesViewed, setImagesViewed] = useState(new Set());
  const [interactionCount, setInteractionCount] = useState(0);
  const [tabViewTimes, setTabViewTimes] = useState({
    description: 0,
    specifications: 0,
    reviews: 0
  });
  const [currentTabStartTime, setCurrentTabStartTime] = useState(null);

  // استخدام useMemo للتحسينات
  const product = useMemo(() => 
    data.find((item) => item.id == id), 
    [data, id]
  );

  const isInCart = useMemo(() => 
    items.some(item => item.id == id), 
    [items, id]
  );

  // تحسين الصور ذات الصلة
  const relatedProducts = useMemo(() => 
    data
      .filter(item => item.category === product?.category && item.id != product?.id)
      .slice(0, 4),
    [data, product]
  );

  // بيانات ثابتة
  const productFeatures = useMemo(() => [
    { icon: <FaTruck />, text: "Free Shipping", subtext: "On orders over $50" },
    { icon: <FaUndo />, text: "Easy Returns", subtext: "30 days return policy" },
    { icon: <FaShieldAlt />, text: "Secure Payment", subtext: "100% protected" },
  ], []);

  const specifications = useMemo(() => [
    { label: "Brand", value: product?.brand || "Unknown" },
    { label: "Category", value: product?.category || "N/A" },
    { label: "SKU", value: product?.id || "N/A" },
    { label: "Availability", value: product?.stock > 0 ? "In Stock" : "Out of Stock" },
    { label: "Weight", value: "0.5 kg" },
    { label: "Dimensions", value: "10 × 5 × 3 cm" },
  ], [product]);

  // 🔍 تتبع مشاهدة صفحة المنتج
  useEffect(() => {
    if (product) {
      const startTime = Date.now();
      setPageViewStartTime(startTime);
      setCurrentTabStartTime(startTime);
      
      // 🔍 تتبع فتح صفحة المنتج
      safeTrack(analyticsService.trackProductView, product.id, product.category, product.title, {
        source: document.referrer,
        entry_point: window.location.search || 'direct',
        user_previous_interactions: interactionCount
      });

      // 🔍 تتبع بدء جلسة المشاهدة
      safeTrack(analyticsService.trackUserAction, 'product_page_session_start', {
        product_id: product.id,
        product_title: product.title,
        initial_tab: activeTab
      });

      // تتبع وقت المشاهدة عند مغادرة الصفحة
      return () => {
        if (startTime) {
          const viewDuration = Date.now() - startTime;
          
          // تحديث وقت التبويب النشط الأخير
          if (currentTabStartTime) {
            const currentTabTime = Date.now() - currentTabStartTime;
            setTabViewTimes(prev => ({
              ...prev,
              [activeTab]: prev[activeTab] + currentTabTime
            }));
          }

          // 🔍 تتبع انتهاء جلسة المشاهدة
          safeTrack(analyticsService.trackUserAction, 'product_page_session_end', {
            product_id: product.id,
            product_title: product.title,
            total_duration_ms: viewDuration,
            images_viewed_count: imagesViewed.size,
            tabs_visited: Object.keys(tabViewTimes).filter(tab => tabViewTimes[tab] > 0),
            total_interactions: interactionCount,
            completed_view: viewDuration > 30000, // 30 ثانية
            purchase_intent: isInCart ? 'high' : interactionCount > 5 ? 'medium' : 'low'
          });

          // 🔍 تتحليل زمن التبويبات
          safeTrack(analyticsService.trackUserAction, 'product_tabs_analysis', {
            product_id: product.id,
            tab_times: tabViewTimes,
            most_engaged_tab: Object.keys(tabViewTimes).reduce((a, b) => 
              tabViewTimes[a] > tabViewTimes[b] ? a : b
            ),
            total_tab_time: Object.values(tabViewTimes).reduce((a, b) => a + b, 0)
          });
        }
      };
    }
  }, [product, activeTab, imagesViewed.size, interactionCount, tabViewTimes, currentTabStartTime, isInCart]);

  // 🔍 تتبع تغيير التبويبات
  useEffect(() => {
    if (currentTabStartTime && product) {
      const tabTimeSpent = Date.now() - currentTabStartTime;
      
      // تحديث وقت التبويب السابق
      setTabViewTimes(prev => ({
        ...prev,
        [activeTab]: prev[activeTab] + tabTimeSpent
      }));

      // 🔍 تتبع تغيير التبويب
      safeTrack(analyticsService.trackUserAction, 'product_tab_switch', {
        product_id: product.id,
        from_tab: activeTab,
        time_spent_on_tab: tabTimeSpent,
        total_tabs_viewed: Object.keys(tabViewTimes).filter(tab => tabViewTimes[tab] > 0).length
      });

      // بدء توقيت التبويب الجديد
      setCurrentTabStartTime(Date.now());
    }
  }, [activeTab]);

  // 🔍 تتبع تغيير الصور
  const handleImageChange = useCallback((index) => {
    setSelectedImage(index);
    
    if (product && !imagesViewed.has(index)) {
      const newImagesViewed = new Set([...imagesViewed, index]);
      setImagesViewed(newImagesViewed);
      
      // 🔍 تتبع مشاهدة الصورة
      safeTrack(analyticsService.trackUserAction, 'product_image_view', {
        product_id: product.id,
        image_index: index,
        total_images_viewed: newImagesViewed.size,
        image_position: index,
        product_total_images: product.images?.length || 1,
        view_completion: (newImagesViewed.size / (product.images?.length || 1)) * 100
      });
    }

    // 🔍 تتبع تغيير الصورة بغض النظر عن المشاهدة الجديدة
    safeTrack(analyticsService.trackUserAction, 'product_image_change', {
      product_id: product?.id,
      from_image: selectedImage,
      to_image: index,
      interaction_type: 'image_gallery_navigation'
    });

    setInteractionCount(prev => prev + 1);
  }, [product, imagesViewed, selectedImage]);

  // تأثيرات محسنة
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setImageLoading(true);
    setImageError(false);
    setSelectedImage(0);
    setQuantity(1);
    setImagesViewed(new Set([0])); // تتبع الصورة الأولى تلقائياً
    setInteractionCount(0);
    setTabViewTimes({ description: 0, specifications: 0, reviews: 0 });
    setCurrentTabStartTime(Date.now());

    // 🔍 تتبع تحميل صفحة المنتج
    safeTrack(analyticsService.trackUserAction, 'product_page_load', {
      product_id: id,
      load_type: 'navigation',
      previous_page: document.referrer
    });
  }, [id]);

  // 🔍 تتبع تغيير التبويبات
  const handleTabChange = useCallback((tabName) => {
    const previousTab = activeTab;
    setActiveTab(tabName);
    
    if (product) {
      // 🔍 تتبع النقر على التبويب
      safeTrack(analyticsService.trackUserAction, 'product_tab_click', {
        product_id: product.id,
        product_title: product.title,
        from_tab: previousTab,
        to_tab: tabName,
        click_sequence: interactionCount + 1
      });
    }

    setInteractionCount(prev => prev + 1);
  }, [product, activeTab, interactionCount]);

  // معالجات محسنة
  const handleAddToCart = useCallback((source = 'main_button') => {
    if (!product) return;
    
    const existingItem = items.find(item => item.id == product.id);
    
    if (existingItem) {
      updateItemQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      addItem({ ...product, quantity });
    }
    
    // 🔍 تتبع إضافة إلى السلة
    safeTrack(analyticsService.trackAddToCart, product.id, quantity, product.price, product.title, {
      source: source,
      category: product.category,
      stock: product.stock,
      has_discount: product.discountPercentage > 0,
      position: selectedImage,
      rating: product.rating,
      time_on_page: Date.now() - (pageViewStartTime || Date.now()),
      interactions_before_add: interactionCount
    });
    
    // 🔍 تتبع حدث إضافة إلى السلة
    safeTrack(analyticsService.trackUserAction, 'add_to_cart_from_product_page', {
      product_id: product.id,
      product_title: product.title,
      quantity: quantity,
      total_price: product.price * quantity,
      was_in_cart: !!existingItem,
      source: source,
      page_engagement: {
        time_spent: Date.now() - (pageViewStartTime || Date.now()),
        images_viewed: imagesViewed.size,
        tabs_visited: Object.keys(tabViewTimes).filter(tab => tabViewTimes[tab] > 0).length,
        total_interactions: interactionCount
      }
    });
    
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    setInteractionCount(prev => prev + 1);
  }, [product, quantity, addItem, updateItemQuantity, items, selectedImage, pageViewStartTime, interactionCount, imagesViewed.size, tabViewTimes]);

  const handleBuyNow = useCallback(() => {
    if (!product) return;
    
    // 🔍 تتبع النقر على "Buy Now"
    safeTrack(analyticsService.trackUserAction, 'buy_now_click', {
      product_id: product.id,
      product_title: product.title,
      quantity: quantity,
      total_price: product.price * quantity,
      purchase_urgency: 'immediate',
      engagement_metrics: {
        time_on_page: Date.now() - (pageViewStartTime || Date.now()),
        images_viewed: imagesViewed.size,
        interactions: interactionCount
      }
    });
    
    handleAddToCart('buy_now_button');
    setTimeout(() => navigate("/cart"), 500);
  }, [handleAddToCart, navigate, product, quantity, pageViewStartTime, imagesViewed.size, interactionCount]);

  // 🔍 تتبع إضافة/إزالة من المفضلة
  const handleWishlistToggle = useCallback(() => {
    const newWishlistState = !isInWishlist;
    setIsInWishlist(newWishlistState);
    
    if (product) {
      safeTrack(analyticsService.trackUserAction, newWishlistState ? 'wishlist_add' : 'wishlist_remove', {
        product_id: product.id,
        product_title: product.title,
        source: 'product_page',
        price: product.price,
        engagement_context: {
          time_on_page: Date.now() - (pageViewStartTime || Date.now()),
          current_image: selectedImage,
          active_tab: activeTab
        },
        wishlist_decision: newWishlistState ? 'added' : 'removed'
      });
    }

    setInteractionCount(prev => prev + 1);
  }, [isInWishlist, product, pageViewStartTime, selectedImage, activeTab]);

  // 🔍 تتبع مشاركة المنتج
  const handleShareProduct = useCallback(async () => {
    if (!product) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href
        });
        
        // 🔍 تتبع المشاركة الناجحة
        safeTrack(analyticsService.trackUserAction, 'product_share_success', {
          product_id: product.id,
          product_title: product.title,
          share_method: 'native_share',
          share_context: {
            time_on_page: Date.now() - (pageViewStartTime || Date.now()),
            engagement_level: interactionCount > 10 ? 'high' : interactionCount > 5 ? 'medium' : 'low'
          }
        });
      } else {
        // نسخ الرابط
        await navigator.clipboard.writeText(window.location.href);
        
        // 🔍 تتبع نسخ الرابط
        safeTrack(analyticsService.trackUserAction, 'product_link_copied', {
          product_id: product.id,
          product_title: product.title,
          copy_method: 'clipboard',
          user_engagement: {
            interactions: interactionCount,
            images_viewed: imagesViewed.size
          }
        });
        
        alert('Product link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing product:', error);
      
      // 🔍 تتبع خطأ المشاركة
      safeTrack(analyticsService.trackUserAction, 'product_share_error', {
        product_id: product.id,
        error: error.message,
        share_method: navigator.share ? 'native_share' : 'clipboard'
      });
    }

    setInteractionCount(prev => prev + 1);
  }, [product, pageViewStartTime, interactionCount, imagesViewed.size]);

  // 🔍 تتبع النقر على المنتجات ذات الصلة
  const handleRelatedProductClick = useCallback((relatedProduct) => {
    safeTrack(analyticsService.trackUserAction, 'related_product_click', {
      main_product_id: product?.id,
      main_product_title: product?.title,
      related_product_id: relatedProduct.id,
      related_product_title: relatedProduct.title,
      category: relatedProduct.category,
      engagement_with_main_product: {
        time_spent: Date.now() - (pageViewStartTime || Date.now()),
        images_viewed: imagesViewed.size,
        interactions: interactionCount,
        added_to_cart: isInCart
      },
      navigation_reason: 'related_products_section'
    });

    setInteractionCount(prev => prev + 1);
  }, [product, pageViewStartTime, imagesViewed.size, interactionCount, isInCart]);

  // 🔍 تتبع العودة إلى القائمة
  const handleBackToProducts = useCallback(() => {
    if (product) {
      safeTrack(analyticsService.trackUserAction, 'back_to_products_click', {
        product_id: product.id,
        product_title: product.title,
        final_engagement: {
          total_time: Date.now() - (pageViewStartTime || Date.now()),
          total_interactions: interactionCount,
          images_viewed: imagesViewed.size,
          tabs_visited: Object.keys(tabViewTimes).filter(tab => tabViewTimes[tab] > 0).length,
          added_to_cart: isInCart,
          added_to_wishlist: isInWishlist
        },
        exit_intent: 'back_to_products'
      });
    }
  }, [product, pageViewStartTime, interactionCount, imagesViewed.size, tabViewTimes, isInCart, isInWishlist]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
    
    // 🔍 تتبع تحميل الصورة بنجاح
    if (product) {
      safeTrack(analyticsService.trackUserAction, 'product_image_load_success', {
        product_id: product.id,
        image_index: selectedImage,
        load_time: Date.now() - (pageViewStartTime || Date.now())
      });
    }
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    
    // 🔍 تتبع خطأ تحميل الصورة
    if (product) {
      safeTrack(analyticsService.trackUserAction, 'product_image_error', {
        product_id: product.id,
        image_index: selectedImage,
        error_type: 'load_failed',
        fallback_used: true
      });
    }
  };

  const handleQuantityChange = useCallback((newQuantity) => {
    const oldQuantity = quantity;
    
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
      
      // 🔍 تتبع تغيير الكمية
      if (product) {
        safeTrack(analyticsService.trackUserAction, 'quantity_changed', {
          product_id: product.id,
          old_quantity: oldQuantity,
          new_quantity: newQuantity,
          change_direction: newQuantity > oldQuantity ? 'increase' : 'decrease',
          total_price: product.price * newQuantity,
          price_difference: product.price * (newQuantity - oldQuantity),
          interaction_context: {
            current_tab: activeTab,
            current_image: selectedImage,
            total_interactions: interactionCount + 1
          }
        });
      }
    }

    setInteractionCount(prev => prev + 1);
  }, [product, quantity, activeTab, selectedImage, interactionCount]);

  // حالة التحميل
  if (!data.length) {
    return (
      <div className="container text-center py-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-5"
        >
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-muted">Loading Products...</h4>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    // 🔍 تتبع منتج غير موجود
    safeTrack(analyticsService.trackUserAction, 'product_not_found', {
      product_id: id,
      attempted_url: window.location.href,
      referrer: document.referrer,
      user_attempts: 1
    });
    
    return (
      <div className="container text-center py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-5"
        >
          <FaExclamationTriangle className="text-warning mb-3" size={64} />
          <h3 className="text-muted mb-3">Product Not Found</h3>
          <p className="text-muted mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/products" 
            className="btn btn-primary btn-lg"
            onClick={handleBackToProducts}
          >
            <FaArrowLeft className="me-2" />
            Back to Products
          </Link>
        </motion.div>
      </div>
    );
  }

  // مكون الصورة المحسن
  const ProductImage = ({ src, alt, className, ...props }) => (
    <div className="position-relative">
      {imageLoading && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {imageError ? (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light text-muted">
          <div className="text-center">
            <FaExclamationTriangle size={32} className="mb-2" />
            <small>Image not available</small>
          </div>
        </div>
      ) : (
        <img
          src={src || "/assets/img/placeholder.jpg"}
          alt={alt}
          className={className}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...props}
        />
      )}
    </div>
  );

  return (
    <div className="container-fluid py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link 
              to="/" 
              className="text-decoration-none"
              onClick={() => {
                safeTrack(analyticsService.trackUserAction, 'breadcrumb_home_click', {
                  product_id: product.id,
                  current_engagement: {
                    time_spent: Date.now() - (pageViewStartTime || Date.now()),
                    interactions: interactionCount
                  }
                });
              }}
            >
              Home
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link 
              to="/products" 
              className="text-decoration-none"
              onClick={handleBackToProducts}
            >
              Products
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link 
              to={`/products?category=${product.category}`} 
              className="text-decoration-none"
              onClick={() => {
                safeTrack(analyticsService.trackUserAction, 'breadcrumb_category_click', {
                  product_id: product.id,
                  category: product.category,
                  navigation_type: 'breadcrumb'
                });
              }}
            >
              {product.category}
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.title}
          </li>
        </ol>
      </nav>

      <div className="row g-5">
        {/* Product Images */}
        <div className="col-lg-6">
          <div className="row g-3">
            {/* Main Image */}
            <div className="col-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="card border-0 shadow-sm rounded-3 overflow-hidden"
              >
                <ProductImage
                  src={product.images?.[selectedImage]}
                  alt={product.title}
                  className="img-fluid w-100"
                  style={{ 
                    height: "500px", 
                    objectFit: "cover",
                    cursor: "zoom-in"
                  }}
                />
                
                {/* Discount Badge */}
                {product.discountPercentage > 0 && (
                  <div className="position-absolute top-0 start-0 m-3">
                    <span className="badge bg-danger fs-6 px-3 py-2">
                      -{Math.round(product.discountPercentage)}% OFF
                    </span>
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  className={`btn position-absolute top-0 end-0 m-3 rounded-circle ${
                    isInWishlist ? 'btn-danger' : 'btn-light'
                  }`}
                  style={{ width: '50px', height: '50px' }}
                  aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <FaHeart className={isInWishlist ? 'text-white' : 'text-danger'} />
                </button>

                {/* Image Counter */}
                <div className="position-absolute bottom-0 end-0 m-3">
                  <span className="badge bg-dark bg-opacity-75 text-white">
                    <FaEye className="me-1" />
                    {selectedImage + 1} / {product.images?.length || 1}
                  </span>
                </div>

                {/* Engagement Badge */}
                <div className="position-absolute bottom-0 start-0 m-3">
                  <span className="badge bg-info bg-opacity-90 text-white">
                    <FaClock className="me-1" />
                    {Math.round((pageViewStartTime ? (Date.now() - pageViewStartTime) / 1000 : 0))}s
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Thumbnail Images */}
            <div className="col-12">
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                {product.images?.slice(0, 5).map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`btn p-0 border rounded-2 overflow-hidden ${
                      selectedImage === index ? 'border-primary border-2' : 'border-light'
                    }`}
                    style={{ width: '80px', height: '80px' }}
                    onClick={() => handleImageChange(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <ProductImage
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="img-fluid w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                    {imagesViewed.has(index) && (
                      <div className="position-absolute top-0 end-0 m-1">
                        <FaCheck className="text-success" size={12} />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="col-lg-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Category & Brand */}
            <div className="mb-3">
              <span className="badge bg-light text-dark me-2">{product.category}</span>
              {product.brand && (
                <span className="badge bg-secondary">{product.brand}</span>
              )}
              {/* Engagement Badge */}
              <span className="badge bg-info ms-2">
                <FaClock className="me-1" />
                {Math.round((pageViewStartTime ? (Date.now() - pageViewStartTime) / 1000 : 0))}s
              </span>
              {/* Interactions Badge */}
              <span className="badge bg-warning ms-2">
                {interactionCount} interactions
              </span>
            </div>

            {/* Title */}
            <h1 className="fw-bold mb-3 display-6" style={{ lineHeight: '1.2' }}>
              {product.title}
            </h1>

            {/* Rating */}
            <div className="d-flex align-items-center mb-3 flex-wrap gap-2">
              <div className="d-flex align-items-center me-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < Math.floor(product.rating || 0) 
                        ? "text-warning" 
                        : "text-muted"
                    } me-1`}
                  />
                ))}
                <span className="ms-2 fw-semibold">({product.rating || "N/A"})</span>
              </div>
              <span className="text-muted d-none d-md-inline">•</span>
              <span className={`ms-3 fw-semibold ${
                product.stock > 0 ? 'text-success' : 'text-danger'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <div className="d-flex align-items-baseline gap-3 flex-wrap">
                <h2 className="text-primary fw-bold mb-0">
                  ${product.price}
                </h2>
                {product.originalPrice && product.originalPrice > product.price && (
                  <h4 className="text-muted text-decoration-line-through mb-0">
                    ${product.originalPrice}
                  </h4>
                )}
                {product.discountPercentage > 0 && (
                  <span className="badge bg-success fs-6">
                    Save ${((product.originalPrice - product.price) * quantity).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-muted fs-6 mb-4" style={{ lineHeight: '1.6' }}>
              {product.description || "Premium quality product with excellent features and durability. Designed to meet your highest expectations and provide outstanding performance."}
            </p>

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Quantity:</label>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div className="btn-group">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <FaMinus />
                  </button>
                  <span className="btn btn-light px-4" style={{ minWidth: '60px' }}>
                    {quantity}
                  </span>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= (product.stock || 10)}
                    aria-label="Increase quantity"
                  >
                    <FaPlus />
                  </button>
                </div>
                <span className="text-muted">
                  Total: <strong>${(product.price * quantity).toFixed(2)}</strong>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3 mb-4 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddToCart('main_button')}
                className={`btn btn-lg flex-fill ${
                  isInCart ? 'btn-success' : 'btn-primary'
                }`}
                style={{ minWidth: '200px' }}
                disabled={product.stock === 0}
              >
                <FaShoppingCart className="me-2" />
                {isInCart ? 'Added to Cart' : 'Add to Cart'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                className="btn btn-dark btn-lg flex-fill"
                style={{ minWidth: '200px' }}
                disabled={product.stock === 0}
              >
                Buy Now
              </motion.button>
            </div>

            {/* Product Features */}
            <div className="row g-3 mb-4">
              {productFeatures.map((feature, index) => (
                <div key={index} className="col-md-4 col-sm-6">
                  <div className="d-flex align-items-center gap-2 p-3 rounded-3 bg-light h-100">
                    <div className="text-primary fs-5">
                      {feature.icon}
                    </div>
                    <div>
                      <div className="fw-semibold small">{feature.text}</div>
                      <div className="text-muted small">{feature.subtext}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Share & Social */}
            <div className="d-flex align-items-center gap-3 border-top pt-4 flex-wrap">
              <span className="fw-semibold">Share:</span>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={handleShareProduct}
              >
                <FaShare className="me-1" />
                Share Product
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <ul className="nav nav-tabs nav-justified border-0 flex-nowrap">
                <li className="nav-item flex-fill">
                  <button
                    className={`nav-link w-100 ${activeTab === "description" ? "active fw-bold" : ""}`}
                    onClick={() => handleTabChange("description")}
                  >
                    Description
                    {tabViewTimes.description > 0 && (
                      <small className="ms-1 text-muted">
                        ({Math.round(tabViewTimes.description / 1000)}s)
                      </small>
                    )}
                  </button>
                </li>
                <li className="nav-item flex-fill">
                  <button
                    className={`nav-link w-100 ${activeTab === "specifications" ? "active fw-bold" : ""}`}
                    onClick={() => handleTabChange("specifications")}
                  >
                    Specifications
                    {tabViewTimes.specifications > 0 && (
                      <small className="ms-1 text-muted">
                        ({Math.round(tabViewTimes.specifications / 1000)}s)
                      </small>
                    )}
                  </button>
                </li>
                <li className="nav-item flex-fill">
                  <button
                    className={`nav-link w-100 ${activeTab === "reviews" ? "active fw-bold" : ""}`}
                    onClick={() => handleTabChange("reviews")}
                  >
                    Reviews ({product.reviews?.length || 0})
                    {tabViewTimes.reviews > 0 && (
                      <small className="ms-1 text-muted">
                        ({Math.round(tabViewTimes.reviews / 1000)}s)
                      </small>
                    )}
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body p-4">
              <AnimatePresence mode="wait">
                {activeTab === "description" && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h5 className="mb-4">Product Description</h5>
                    <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
                      {product.description || "This premium product is crafted with attention to detail and built to last. Featuring innovative design and superior materials, it offers exceptional value and performance. Perfect for everyday use while maintaining style and functionality."}
                    </p>
                    <ul className="text-muted list-unstyled">
                      <li className="mb-2">✅ High-quality materials and construction</li>
                      <li className="mb-2">✅ Designed for durability and long-term use</li>
                      <li className="mb-2">✅ User-friendly and intuitive design</li>
                      <li className="mb-2">✅ Excellent value for money</li>
                    </ul>
                  </motion.div>
                )}

                {activeTab === "specifications" && (
                  <motion.div
                    key="specifications"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h5 className="mb-4">Product Specifications</h5>
                    <div className="row">
                      {specifications.map((spec, index) => (
                        <div key={index} className="col-md-6 mb-3">
                          <div className="d-flex justify-content-between border-bottom py-2">
                            <span className="fw-semibold text-dark">{spec.label}:</span>
                            <span className="text-muted">{spec.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h5 className="mb-4">Customer Reviews</h5>
                    {product.reviews && product.reviews.length > 0 ? (
                      <div>
                        {product.reviews.map((review, index) => (
                          <div key={index} className="border-bottom pb-3 mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <strong className="text-dark">{review.author}</strong>
                              <div className="d-flex align-items-center">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar
                                    key={i}
                                    className={`${
                                      i < review.rating ? "text-warning" : "text-muted"
                                    } me-1`}
                                    size={14}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted mb-0">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <FaStar className="text-muted mb-3" size={48} />
                        <p className="text-muted mb-4">No reviews yet. Be the first to review this product!</p>
                        <button className="btn btn-outline-primary">
                          Write a Review
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <h3 className="fw-bold mb-0">Related Products</h3>
              <Link 
                to={`/products?category=${product.category}`} 
                className="btn btn-outline-primary"
                onClick={handleBackToProducts}
              >
                View All in {product.category}
              </Link>
            </div>
            <div className="row g-4">
              {relatedProducts.map((item, index) => (
                <div key={item.id} className="col-xl-3 col-lg-4 col-md-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card product-card h-100 border-0 shadow-sm"
                  >
                    <Link 
                      to={`/singleproduct/${item.id}`} 
                      className="text-decoration-none text-dark"
                      onClick={() => handleRelatedProductClick(item)}
                    >
                      <div className="position-relative overflow-hidden">
                        <ProductImage
                          src={item.images?.[0]}
                          alt={item.title}
                          className="card-img-top"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        {item.discountPercentage > 0 && (
                          <span className="position-absolute top-0 start-0 m-2 badge bg-danger">
                            -{Math.round(item.discountPercentage)}%
                          </span>
                        )}
                      </div>
                      <div className="card-body">
                        <h6 className="card-title mb-2 product-title">{item.title}</h6>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-primary fw-bold">${item.price}</span>
                          <div className="d-flex align-items-center">
                            <FaStar className="text-warning me-1" />
                            <small className="text-muted">({item.rating || "N/A"})</small>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add to Cart Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="position-fixed start-50 bottom-0 mb-4 z-3"
            style={{ zIndex: 1050 }}
          >
            <div className="alert alert-success shadow-lg d-flex align-items-center gap-3 border-0">
              <FaCheck className="text-success flex-shrink-0" />
              <div className="flex-grow-1">
                <strong>Success!</strong> {quantity} {quantity === 1 ? 'item' : 'items'} added to cart.
              </div>
              <Link 
                to="/cart" 
                className="btn btn-sm btn-outline-success ms-2"
                onClick={() => {
                  safeTrack(analyticsService.trackUserAction, 'view_cart_from_notification', {
                    product_id: product.id,
                    notification_type: 'add_to_cart_success'
                  });
                }}
              >
                View Cart
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom CSS */}
      <style>{`
        .product-card {
          transition: all 0.3s ease;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        .nav-tabs .nav-link {
          color: #6c757d;
          border: none;
          padding: 1rem 1.5rem;
          white-space: nowrap;
        }
        
        .nav-tabs .nav-link.active {
          color: #667eea;
          border-bottom: 3px solid #667eea;
          background: transparent;
        }
        
        .breadcrumb {
          background: transparent;
          padding: 0;
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
          .display-6 {
            font-size: 1.75rem;
          }
          
          .nav-tabs .nav-link {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default SingleProduct;