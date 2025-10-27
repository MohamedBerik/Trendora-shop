import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaPaypal, 
  FaApple, 
  FaGoogle, 
  FaLock, 
  FaShippingFast,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaClock,
  FaExclamationTriangle,
  FaCheck
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

  // دوال متخصصة للدفع
  async trackCheckoutStarted(totalAmount, itemsCount, items = [], metadata = {}) {
    return this.trackEvent('checkout_started', {
      total_amount: totalAmount,
      items_count: itemsCount,
      cart_composition: items.map(item => ({
        product_id: item.id,
        category: item.category,
        quantity: item.quantity,
        value: item.price * item.quantity
      })),
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

  async trackPurchase(orderId, totalAmount, items = [], metadata = {}) {
    return this.trackEvent('purchase', {
      order_id: orderId,
      total_amount: totalAmount,
      items: items.map(item => ({
        product_id: item.id,
        product_title: item.title,
        category: item.category,
        quantity: item.quantity,
        price: item.price
      })),
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

function Checkout() {
  const { items, cartTotal, totalItems, emptyCart } = useCart();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [orderComplete, setOrderComplete] = useState(false);
  const [pageViewStartTime, setPageViewStartTime] = useState(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const [stepCompletionTimes, setStepCompletionTimes] = useState({});
  const [currentStepStartTime, setCurrentStepStartTime] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Shipping Address
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    
    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    
    // Additional Options
    saveInfo: false,
    newsletter: true,
    shippingMethod: "standard"
  });

  // Calculate costs
  const shippingCost = formData.shippingMethod === "express" ? 15 : 
                     formData.shippingMethod === "standard" ? 5 : 0;
  const tax = cartTotal * 0.08; // 8% tax
  const finalTotal = cartTotal + shippingCost + tax;

  // تتبع عرض صفحة الدفع عند التحميل
  useEffect(() => {
    const startTime = Date.now();
    setPageViewStartTime(startTime);
    setCurrentStepStartTime(startTime);

    // 🔍 تتبع بدء عملية الدفع
    safeTrack(analyticsService.trackCheckoutStarted, finalTotal, totalItems, items, {
      session_start_time: startTime,
      initial_step: currentStep,
      cart_analysis: {
        total_value: cartTotal,
        items_count: totalItems,
        unique_categories: [...new Set(items.map(item => item.category))],
        has_discounted_items: items.some(item => item.discountPercentage > 0)
      }
    });

    // 🔍 تتبع عرض صفحة الدفع
    safeTrack(analyticsService.trackPageView, 'checkout', {
      cart_items_count: totalItems,
      cart_total: cartTotal,
      current_step: currentStep,
      potential_order_value: finalTotal
    });

    // تتبع وقت الجلسة عند مغادرة الصفحة
    return () => {
      if (startTime) {
        const viewDuration = Date.now() - startTime;
        safeTrack(analyticsService.trackEvent, 'checkout_session_end', {
          total_duration_ms: viewDuration,
          final_step_reached: currentStep,
          steps_completed: Object.keys(stepCompletionTimes).length,
          total_interactions: interactionCount,
          order_completed: orderComplete,
          checkout_abandonment: !orderComplete && currentStep < 4 ? 'abandoned' : 'completed'
        });
      }
    };
  }, []);

  // تتبع تغيير الخطوات
  useEffect(() => {
    if (currentStepStartTime && currentStep > 1) {
      const stepTime = Date.now() - currentStepStartTime;
      
      // تحديث وقت إكمال الخطوة السابقة
      setStepCompletionTimes(prev => ({
        ...prev,
        [currentStep - 1]: stepTime
      }));

      // 🔍 تتبع إكمال الخطوة
      safeTrack(analyticsService.trackEvent, 'checkout_step_completed', {
        step: currentStep - 1,
        step_name: getStepName(currentStep - 1),
        time_spent_ms: stepTime,
        interactions_during_step: interactionCount,
        form_data_progress: calculateFormProgress()
      });

      // بدء توقيت الخطوة الجديدة
      setCurrentStepStartTime(Date.now());
    }
  }, [currentStep]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // مسح الخطأ عند التعديل
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    setInteractionCount(prev => prev + 1);
  };

  // التحقق من صحة النموذج
  const validateForm = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) errors.firstName = 'First name is required';
      if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
      if (!formData.email.trim()) errors.email = 'Email is required';
      if (!formData.phone.trim()) errors.phone = 'Phone number is required';
      if (!formData.address.trim()) errors.address = 'Address is required';
      if (!formData.city.trim()) errors.city = 'City is required';
      if (!formData.state.trim()) errors.state = 'State is required';
      if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required';
      
      // تحقق من صحة البريد الإلكتروني
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    if (step === 2 && paymentMethod === "credit-card") {
      if (!formData.cardNumber.trim()) errors.cardNumber = 'Card number is required';
      if (!formData.expiryDate.trim()) errors.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) errors.cvv = 'CVV is required';
      if (!formData.nameOnCard.trim()) errors.nameOnCard = 'Name on card is required';
      
      // تحقق من صحة رقم البطاقة
      const cardRegex = /^\d{16}$/;
      if (formData.cardNumber && !cardRegex.test(formData.cardNumber.replace(/\s/g, ''))) {
        errors.cardNumber = 'Please enter a valid card number';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Track step changes
  const handleStepChange = (newStep) => {
    if (newStep > currentStep && !validateForm(currentStep)) {
      // 🔍 تتبع أخطاء التحقق من الصحة
      safeTrack(analyticsService.trackEvent, 'checkout_validation_error', {
        step: currentStep,
        errors: formErrors,
        form_completion: calculateFormProgress()
      });
      return;
    }

    // 🔍 تتبع تغيير الخطوة
    safeTrack(analyticsService.trackUserAction, 'checkout_step_change', {
      from_step: currentStep,
      to_step: newStep,
      step_name: getStepName(newStep),
      cart_items_count: totalItems,
      cart_total: cartTotal,
      form_completion_percentage: calculateFormProgress(),
      time_on_previous_step: currentStepStartTime ? Date.now() - currentStepStartTime : 0
    });
    
    setCurrentStep(newStep);
    setInteractionCount(prev => prev + 1);
  };

  // حساب تقدم تعبئة النموذج
  const calculateFormProgress = () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'
    ];
    if (paymentMethod === 'credit-card') {
      requiredFields.push('cardNumber', 'expiryDate', 'cvv', 'nameOnCard');
    }
    
    const filledFields = requiredFields.filter(field => 
      formData[field] && formData[field].toString().trim() !== ''
    ).length;
    
    return Math.round((filledFields / requiredFields.length) * 100);
  };

  // Get step name for analytics
  const getStepName = (step) => {
    const stepNames = {
      1: 'shipping',
      2: 'payment',
      3: 'review',
      4: 'confirmation'
    };
    return stepNames[step] || `step_${step}`;
  };

  // Track payment method selection
  const handlePaymentMethodChange = (methodId) => {
    setPaymentMethod(methodId);
    
    // 🔍 تتبع اختيار طريقة الدفع
    safeTrack(analyticsService.trackUserAction, 'payment_method_selected', {
      payment_method: methodId,
      cart_total: finalTotal,
      step: currentStep,
      selection_context: {
        time_on_step: Date.now() - (currentStepStartTime || Date.now()),
        total_interactions: interactionCount + 1
      }
    });

    setInteractionCount(prev => prev + 1);
  };

  // Track shipping method selection
  const handleShippingMethodChange = (methodId) => {
    setFormData(prev => ({
      ...prev,
      shippingMethod: methodId
    }));
    
    // 🔍 تتبع اختيار طريقة الشحن
    safeTrack(analyticsService.trackUserAction, 'shipping_method_selected', {
      shipping_method: methodId,
      shipping_cost: shippingCost,
      impact_on_total: finalTotal,
      free_shipping_eligible: cartTotal >= 50,
      selection_timing: {
        step: currentStep,
        time_on_page: Date.now() - (pageViewStartTime || Date.now())
      }
    });

    setInteractionCount(prev => prev + 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep < 3) {
      if (!validateForm(currentStep)) {
        return;
      }

      // 🔍 تتبع إكمال الخطوة بنجاح
      safeTrack(analyticsService.trackUserAction, 'checkout_step_completed', {
        step: currentStep,
        step_name: getStepName(currentStep),
        cart_items_count: totalItems,
        cart_total: cartTotal,
        form_completion_percentage: calculateFormProgress(),
        time_spent_on_step: currentStepStartTime ? Date.now() - currentStepStartTime : 0
      });
      
      handleStepChange(currentStep + 1);
    } else {
      // Process order
      await processOrder();
    }
  };

  // Process the final order
  const processOrder = async () => {
    if (!validateForm(3)) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // 🔍 تتبع بدء عملية الدفع النهائية
      await safeTrack(analyticsService.trackCheckoutStarted, finalTotal, totalItems, items, {
        final_checkout_metrics: {
          total_steps: 3,
          steps_completed: Object.keys(stepCompletionTimes).length,
          total_time: Date.now() - (pageViewStartTime || Date.now()),
          total_interactions: interactionCount,
          form_completion: calculateFormProgress()
        },
        order_breakdown: {
          subtotal: cartTotal,
          shipping: shippingCost,
          tax: tax,
          final_total: finalTotal
        }
      });
      
      // 🔍 تتبع نية الشراء النهائية
      await safeTrack(analyticsService.trackCheckoutIntent, finalTotal, totalItems, {
        conversion_metrics: {
          payment_method: paymentMethod,
          shipping_method: formData.shippingMethod,
          cart_size: totalItems,
          average_item_value: cartTotal / totalItems
        },
        user_behavior: {
          steps_timing: stepCompletionTimes,
          total_session_time: Date.now() - (pageViewStartTime || Date.now()),
          interaction_intensity: interactionCount / (Date.now() - (pageViewStartTime || Date.now())) * 1000
        }
      });
      
      // إنشاء معرف الطلب
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // 🔍 تتبع اكتمال الشراء
      await safeTrack(analyticsService.trackPurchase, orderId, finalTotal, items, {
        order_analysis: {
          items_count: totalItems,
          unique_categories: [...new Set(items.map(item => item.category))],
          has_discounted_items: items.some(item => item.discountPercentage > 0),
          shipping_cost: shippingCost,
          tax_amount: tax
        },
        customer_journey: {
          total_checkout_time: Date.now() - (pageViewStartTime || Date.now()),
          steps_completion_time: stepCompletionTimes,
          total_interactions: interactionCount,
          form_completion_rate: calculateFormProgress()
        },
        revenue_metrics: {
          subtotal: cartTotal,
          shipping: shippingCost,
          tax: tax,
          final_total: finalTotal,
          average_order_value: finalTotal
        }
      });
      
      // 🔍 تتبع إجراء اكتمال الطلب
      await safeTrack(analyticsService.trackUserAction, 'order_completed', {
        order_id: orderId,
        total_amount: finalTotal,
        items_count: totalItems,
        payment_method: paymentMethod,
        shipping_method: formData.shippingMethod,
        checkout_performance: {
          total_time: Date.now() - (pageViewStartTime || Date.now()),
          step_times: stepCompletionTimes,
          interactions: interactionCount,
          conversion_success: true
        }
      });

      setOrderComplete(true);
      
      // 🔍 تتبع نجاح العملية
      safeTrack(analyticsService.trackEvent, 'checkout_success', {
        order_id: orderId,
        performance_metrics: {
          total_processing_time: Date.now() - (pageViewStartTime || Date.now()),
          steps_efficiency: Object.values(stepCompletionTimes).reduce((a, b) => a + b, 0),
          user_engagement: interactionCount
        }
      });

      // تفريغ السلة بعد تأكيد الطلب
      setTimeout(() => {
        emptyCart();
        
        // 🔍 تتبع تفريغ السلة بعد الشراء
        safeTrack(analyticsService.trackCartEmptied, totalItems, finalTotal, {
          order_id: orderId,
          post_purchase_cleanup: true
        });
        
        navigate("/confirmation", { 
          state: { 
            orderId,
            totalAmount: finalTotal,
            itemsCount: totalItems,
            checkoutMetrics: {
              totalTime: Date.now() - (pageViewStartTime || Date.now()),
              steps: stepCompletionTimes,
              interactions: interactionCount
            }
          }
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error processing order:', error);
      
      // 🔍 تتبع خطأ في عملية الشراء
      safeTrack(analyticsService.trackError, 'checkout_error', error.message, 'Checkout', {
        step: currentStep,
        form_data: formData,
        payment_method: paymentMethod,
        error_context: {
          time_on_page: Date.now() - (pageViewStartTime || Date.now()),
          interactions: interactionCount
        }
      });
      
      setIsProcessing(false);
    }
  };

  // Progress steps
  const steps = [
    { number: 1, title: "Shipping", icon: "🚚" },
    { number: 2, title: "Payment", icon: "💳" },
    { number: 3, title: "Review", icon: "📋" },
    { number: 4, title: "Confirm", icon: "✅" }
  ];

  // Payment methods
  const paymentMethods = [
    { id: "credit-card", name: "Credit Card", icon: <FaCreditCard />, popular: true },
    { id: "paypal", name: "PayPal", icon: <FaPaypal />, popular: true },
    { id: "apple-pay", name: "Apple Pay", icon: <FaApple /> },
    { id: "google-pay", name: "Google Pay", icon: <FaGoogle /> },
    { id: "cash", name: "Cash on Delivery", icon: <FaMoneyBillWave /> }
  ];

  // Shipping methods
  const shippingMethods = [
    { id: "free", name: "Free Shipping", cost: 0, days: "5-7 business days" },
    { id: "standard", name: "Standard Shipping", cost: 5, days: "3-5 business days" },
    { id: "express", name: "Express Shipping", cost: 15, days: "1-2 business days" }
  ];

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="container py-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-5"
        >
          <div className="fs-1 mb-3">🛒</div>
          <h3 className="text-muted mb-3">Your Cart is Empty</h3>
          <p className="text-muted mb-4">Add some items to your cart before proceeding to checkout.</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Continue Shopping
          </Link>
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
              <h1 className="h2 fw-bold mb-1">Checkout</h1>
              <p className="text-muted mb-0">Complete your purchase in a few simple steps</p>
              
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
                  {calculateFormProgress()}% completed
                </span>
              </div>
            </div>
            <Link to="/cart" className="btn btn-outline-primary">
              <FaArrowLeft className="me-2" />
              Back to Cart
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="row g-4">
        {/* Main Checkout Form */}
        <div className="col-lg-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card border-0 shadow-sm"
          >
            {/* Progress Steps */}
            <div className="card-header bg-white border-0 py-4">
              <div className="row align-items-center position-relative">
                {steps.map((step, index) => (
                  <div key={step.number} className="col-3 text-center position-relative">
                    <div className="d-flex flex-column align-items-center">
                      <div 
                        className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                          currentStep >= step.number 
                            ? 'bg-primary text-white' 
                            : 'bg-light text-muted'
                        }`}
                        style={{ width: '40px', height: '40px' }}
                      >
                        {currentStep > step.number ? (
                          <FaCheckCircle />
                        ) : (
                          <span className="fw-bold">{step.number}</span>
                        )}
                      </div>
                      <small className={`fw-semibold ${
                        currentStep >= step.number ? 'text-primary' : 'text-muted'
                      }`}>
                        {step.title}
                      </small>
                      {stepCompletionTimes[step.number] && (
                        <small className="text-muted mt-1">
                          {Math.round(stepCompletionTimes[step.number] / 1000)}s
                        </small>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-body p-4">
              <AnimatePresence mode="wait">
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h5 className="fw-bold mb-4">
                      <FaUser className="me-2 text-primary" />
                      Shipping Information
                    </h5>
                    
                    <div className="row g-3">
                      {[
                        { name: 'firstName', label: 'First Name *', type: 'text', col: 6 },
                        { name: 'lastName', label: 'Last Name *', type: 'text', col: 6 },
                        { name: 'email', label: 'Email Address *', type: 'email', col: 6, icon: <FaEnvelope /> },
                        { name: 'phone', label: 'Phone Number *', type: 'tel', col: 6, icon: <FaPhone /> },
                        { name: 'address', label: 'Street Address *', type: 'text', col: 12, icon: <FaMapMarkerAlt /> },
                        { name: 'city', label: 'City *', type: 'text', col: 4 },
                        { name: 'state', label: 'State *', type: 'text', col: 4 },
                        { name: 'zipCode', label: 'ZIP Code *', type: 'text', col: 4 }
                      ].map((field) => (
                        <div key={field.name} className={`col-md-${field.col}`}>
                          <label className="form-label fw-semibold">
                            {field.icon && <>{field.icon} </>}
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className={`form-control ${formErrors[field.name] ? 'is-invalid' : ''}`}
                            required
                          />
                          {formErrors[field.name] && (
                            <div className="invalid-feedback d-flex align-items-center">
                              <FaExclamationTriangle className="me-1" size={12} />
                              {formErrors[field.name]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Shipping Method */}
                    <div className="mt-4">
                      <h6 className="fw-bold mb-3">
                        <FaShippingFast className="me-2 text-primary" />
                        Shipping Method
                      </h6>
                      <div className="row g-3">
                        {shippingMethods.map((method) => (
                          <div key={method.id} className="col-md-4">
                            <div 
                              className={`card border-2 cursor-pointer ${
                                formData.shippingMethod === method.id 
                                  ? 'border-primary' 
                                  : 'border-light'
                              }`}
                              onClick={() => handleShippingMethodChange(method.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="card-body text-center p-3">
                                <h6 className="fw-semibold mb-1">{method.name}</h6>
                                <div className="text-primary fw-bold mb-1">
                                  {method.cost === 0 ? 'FREE' : `$${method.cost}`}
                                </div>
                                <small className="text-muted">{method.days}</small>
                                {formData.shippingMethod === method.id && (
                                  <div className="mt-2">
                                    <FaCheck className="text-success" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment Method */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h5 className="fw-bold mb-4">
                      <FaCreditCard className="me-2 text-primary" />
                      Payment Method
                    </h5>

                    {/* Payment Method Selection */}
                    <div className="row g-3 mb-4">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="col-md-6">
                          <div 
                            className={`card border-2 cursor-pointer ${
                              paymentMethod === method.id 
                                ? 'border-primary' 
                                : 'border-light'
                            }`}
                            onClick={() => handlePaymentMethodChange(method.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="card-body">
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                  <div className="text-primary fs-5 me-3">
                                    {method.icon}
                                  </div>
                                  <div>
                                    <h6 className="fw-semibold mb-0">{method.name}</h6>
                                    {method.popular && (
                                      <small className="text-success">Most popular</small>
                                    )}
                                  </div>
                                </div>
                                <div 
                                  className={`rounded-circle border ${
                                    paymentMethod === method.id 
                                      ? 'bg-primary border-primary' 
                                      : 'border-secondary'
                                  }`}
                                  style={{ width: '20px', height: '20px' }}
                                >
                                  {paymentMethod === method.id && (
                                    <div className="w-100 h-100 rounded-circle bg-white d-flex align-items-center justify-content-center">
                                      <div className="rounded-circle bg-primary" style={{ width: '8px', height: '8px' }}></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Credit Card Form */}
                    {paymentMethod === "credit-card" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="border rounded-3 p-4 bg-light"
                      >
                        <h6 className="fw-bold mb-3">Card Details</h6>
                        <div className="row g-3">
                          {[
                            { name: 'cardNumber', label: 'Card Number', placeholder: '1234 5678 9012 3456', maxLength: 19 },
                            { name: 'expiryDate', label: 'Expiry Date', placeholder: 'MM/YY', maxLength: 5 },
                            { name: 'cvv', label: 'CVV', placeholder: '123', maxLength: 3 },
                            { name: 'nameOnCard', label: 'Name on Card', placeholder: 'John Doe' }
                          ].map((field) => (
                            <div key={field.name} className={field.name === 'nameOnCard' ? 'col-12' : 'col-md-6'}>
                              <label className="form-label fw-semibold">{field.label}</label>
                              <input
                                type="text"
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleInputChange}
                                className={`form-control ${formErrors[field.name] ? 'is-invalid' : ''}`}
                                placeholder={field.placeholder}
                                maxLength={field.maxLength}
                              />
                              {formErrors[field.name] && (
                                <div className="invalid-feedback d-flex align-items-center">
                                  <FaExclamationTriangle className="me-1" size={12} />
                                  {formErrors[field.name]}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Security Notice */}
                    <div className="d-flex align-items-center gap-2 mt-4 p-3 bg-light rounded-3">
                      <FaLock className="text-success" />
                      <small className="text-muted">
                        Your payment information is secure and encrypted
                      </small>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Order Review */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h5 className="fw-bold mb-4">Order Review</h5>

                    {/* Order Summary */}
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">Order Items ({totalItems})</h6>
                        {items.map((item) => (
                          <div key={item.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                            <div className="d-flex align-items-center gap-3">
                              <img 
                                src={item.images?.[0]} 
                                alt={item.title}
                                className="rounded"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                              <div>
                                <h6 className="fw-semibold mb-0 small">{item.title}</h6>
                                <small className="text-muted">Qty: {item.quantity}</small>
                                {item.discountPercentage > 0 && (
                                  <small className="text-success ms-2">
                                    -{Math.round(item.discountPercentage)}% OFF
                                  </small>
                                )}
                              </div>
                            </div>
                            <span className="fw-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="row g-3 mt-4">
                      <div className="col-md-6">
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body">
                            <h6 className="fw-bold mb-3">Shipping Address</h6>
                            <p className="mb-0">
                              {formData.firstName} {formData.lastName}<br/>
                              {formData.address}<br/>
                              {formData.city}, {formData.state} {formData.zipCode}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body">
                            <h6 className="fw-bold mb-3">Payment Method</h6>
                            <div className="d-flex align-items-center gap-2">
                              {paymentMethods.find(m => m.id === paymentMethod)?.icon}
                              <span>{paymentMethods.find(m => m.id === paymentMethod)?.name}</span>
                            </div>
                            <div className="mt-2">
                              <small className="text-muted">
                                Shipping: {shippingMethods.find(m => m.id === formData.shippingMethod)?.name}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Analytics Summary */}
                    <div className="card border-0 bg-info bg-opacity-10 mt-4">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">Checkout Analytics</h6>
                        <div className="row small text-muted">
                          <div className="col-6">
                            <div>Time on Checkout: {pageViewStartTime ? Math.round((Date.now() - pageViewStartTime) / 1000) : 0}s</div>
                            <div>Steps Completed: {Object.keys(stepCompletionTimes).length}/3</div>
                          </div>
                          <div className="col-6">
                            <div>Interactions: {interactionCount}</div>
                            <div>Form Progress: {calculateFormProgress()}%</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="form-check mt-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="terms"
                        required
                      />
                      <label className="form-check-label small" htmlFor="terms">
                        I agree to the <a href="/terms" className="text-primary">Terms and Conditions</a> and <a href="/privacy" className="text-primary">Privacy Policy</a>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                <button
                  type="button"
                  onClick={() => handleStepChange(currentStep - 1)}
                  disabled={currentStep === 1}
                  className="btn btn-outline-secondary"
                >
                  <FaArrowLeft className="me-2" />
                  Previous
                </button>
                
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="btn btn-primary px-5"
                >
                  {isProcessing ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {currentStep === 3 ? 'Place Order' : 'Continue'}
                      <FaArrowRight className="ms-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Summary Sidebar */}
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
              {/* Price Breakdown */}
              <div className="space-y-3 mb-4">
                <div className="d-flex justify-content-between">
                  <span>Subtotal ({totalItems} items):</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="d-flex justify-content-between">
                  <span>Shipping:</span>
                  <span className={shippingCost === 0 ? "text-success fw-semibold" : ""}>
                    {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="d-flex justify-content-between">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="d-flex justify-content-between border-top pt-3">
                  <span className="fw-bold fs-5">Total:</span>
                  <span className="fw-bold fs-5 text-primary">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Order Value Analysis */}
              <div className="border-top pt-3 mb-4">
                <h6 className="fw-semibold mb-2">Order Analysis</h6>
                <div className="row small text-muted">
                  <div className="col-6">
                    <div>Items: {totalItems}</div>
                    <div>Categories: {[...new Set(items.map(item => item.category))].length}</div>
                  </div>
                  <div className="col-6 text-end">
                    <div>Avg/Item: ${(cartTotal / totalItems).toFixed(2)}</div>
                    <div>Savings: ${items.reduce((acc, item) => 
                      acc + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0), 0
                    ).toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="text-center small text-muted border-top pt-3">
                <div className="d-flex justify-content-center gap-3 mb-2">
                  <span>🔒 Secure</span>
                  <span>🚚 Fast Delivery</span>
                  <span>💬 24/7 Support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Order Complete Overlay */}
      <AnimatePresence>
        {orderComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ 
              background: 'rgba(0,0,0,0.8)', 
              zIndex: 9999 
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="card border-0 shadow-lg text-center p-5"
              style={{ maxWidth: '400px' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-success mb-3"
                style={{ fontSize: '4rem' }}
              >
                ✅
              </motion.div>
              <h3 className="fw-bold mb-3">Order Placed!</h3>
              <p className="text-muted mb-4">
                Thank you for your purchase. Your order is being processed.
              </p>
              
              {/* Order Analytics Summary */}
              <div className="bg-light rounded-3 p-3 mb-4">
                <h6 className="fw-semibold mb-2">Checkout Summary</h6>
                <div className="row small text-muted">
                  <div className="col-6">
                    <div>Total Time: {pageViewStartTime ? Math.round((Date.now() - pageViewStartTime) / 1000) : 0}s</div>
                    <div>Interactions: {interactionCount}</div>
                  </div>
                  <div className="col-6">
                    <div>Steps: {Object.keys(stepCompletionTimes).length}/3</div>
                    <div>Form: {calculateFormProgress()}%</div>
                  </div>
                </div>
              </div>
              
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <small className="text-muted">Redirecting to confirmation...</small>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .sticky-top {
          position: sticky;
          z-index: 10;
        }
        
        .cursor-pointer {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .cursor-pointer:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

export default Checkout;