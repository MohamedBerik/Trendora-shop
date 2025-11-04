import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders } from '../../context/OrdersContext';
import {
  FaCheckCircle,
  FaShippingFast,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaHome,
  FaDownload,
  FaShare,
  FaClock,
  FaBox,
  FaTruck,
  FaCheck,
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaExclamationTriangle
} from "react-icons/fa";

function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addOrder } = useOrders();
  
  const [orderDetails, setOrderDetails] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [pageViewStartTime, setPageViewStartTime] = useState(null);
  const [interactionCount, setInteractionCount] = useState(0);

  // بيانات افتراضية آمنة للتتبع
  const defaultTracking = {
    number: `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    status: "processing"
  };

  // الحصول على رقم التتبع بشكل آمن
  const getTrackingNumber = () => {
    return orderDetails?.tracking?.number || defaultTracking.number;
  };

  // الحصول على عنوان الشحن بشكل آمن
  const getShippingAddress = () => {
    if (!orderDetails?.shipping?.address) {
      return {
        name: "معلومات غير متوفرة",
        street: "جاري تحميل البيانات",
        city: "",
        state: "",
        zipCode: "",
        country: ""
      };
    }
    return orderDetails.shipping.address;
  };

  // الحصول على طريقة الشحن بشكل آمن
  const getShippingMethod = () => {
    return orderDetails?.shipping?.method || "الشحن القياسي";
  };

  // الحصول على تكلفة الشحن بشكل آمن
  const getShippingCost = () => {
    return orderDetails?.shipping?.cost || 0;
  };

  // الحصول على إجمالي الدفع بشكل آمن
  const getPaymentTotal = () => {
    return orderDetails?.payment?.total || 0;
  };

  // الحصول على العناصر بشكل آمن
  const getOrderItems = () => {
    return orderDetails?.items || [];
  };

  // الحصول على معرف الطلب بشكل آمن
  const getOrderId = () => {
    return orderDetails?.id || `ORD-${Date.now()}`;
  };

  // Mock order data - مع معالجة أفضل للأخطاء
  useEffect(() => {
    const startTime = Date.now();
    setPageViewStartTime(startTime);

    let orderData = null;
    
    try {
      if (location.state && location.state.orderDetails) {
        orderData = location.state.orderDetails;
        console.log('✅ Using order data from location.state:', orderData.id);
      } else {
        orderData = {
          id: `ORD-${Date.now()}`,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          items: [
            {
              id: 1,
              name: "سماعات لاسلكية متميزة",
              quantity: 1,
              price: 199.99,
              image: "/assets/img/headphones.jpg",
              category: "إلكترونيات",
              rating: 4.5
            },
            {
              id: 2,
              name: "غطاء هاتف",
              quantity: 2,
              price: 24.99,
              image: "/assets/img/phone-case.jpg",
              category: "إكسسوارات",
              rating: 4.2
            }
          ],
          shipping: {
            method: "شحن سريع",
            cost: 15.00,
            estimatedDelivery: "2-3 أيام عمل",
            address: {
              name: "أحمد محمد",
              street: "شارع 123 الرئيسي",
              city: "الرياض",
              state: "الرياض",
              zipCode: "12345",
              country: "المملكة العربية السعودية"
            }
          },
          payment: {
            method: "بطاقة ائتمان",
            lastFour: "4242",
            total: 264.97
          },
          tracking: defaultTracking
        };
        console.log('⚠️ Using mock order data');
      }
     
      setOrderDetails(orderData);

      if (orderData) {
        addOrder(orderData);
        console.log('💾 Order saved to system:', orderData.id);
      }
    } catch (error) {
      console.error('❌ Error setting order details:', error);
      // تعيين بيانات افتراضية في حالة الخطأ
      setOrderDetails({
        id: `ORD-${Date.now()}`,
        items: [],
        shipping: {
          method: "شحن قياسي",
          cost: 0,
          estimatedDelivery: "سيتم التحديد",
          address: getShippingAddress()
        },
        payment: {
          method: "غير محدد",
          total: 0
        },
        tracking: defaultTracking
      });
    }

    return () => {
      if (startTime) {
        const viewDuration = Date.now() - startTime;
        console.log('Session duration:', viewDuration);
      }
    };
  }, [location.state, addOrder]);

  // Auto redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/products");
    }
  }, [countdown, navigate]);

  // Order timeline
  const orderTimeline = [
    { status: "ordered", label: "تم الطلب", time: "الآن", active: true },
    { status: "confirmed", label: "تم التأكيد", time: "خلال 5 دقائق", active: false },
    { status: "shipped", label: "تم الشحن", time: "1-2 يوم", active: false },
    { status: "delivered", label: "تم التوصيل", time: "3-5 أيام", active: false }
  ];

  // Recommended products
  const recommendedProducts = [
    {
      id: 1,
      name: "سماعات أذن لاسلكية",
      price: 129.99,
      image: "/assets/img/earbuds.jpg",
      category: "إلكترونيات",
      rating: 4.3,
      stock: 15
    },
    {
      id: 2,
      name: "ساعة ذكية",
      price: 299.99,
      image: "/assets/img/smartwatch.jpg",
      category: "إلكترونيات",
      rating: 4.7,
      stock: 8
    },
    {
      id: 3,
      name: "غطاء لابتوب",
      price: 39.99,
      image: "/assets/img/laptop-sleeve.jpg",
      category: "إكسسوارات",
      rating: 4.1,
      stock: 25
    },
    {
      id: 4,
      name: "حامل هاتف",
      price: 19.99,
      image: "/assets/img/phone-stand.jpg",
      category: "إكسسوارات",
      rating: 4.0,
      stock: 30
    }
  ];

  const handleDownloadInvoice = () => {
    alert("سيبدأ تحميل الفاتورة هنا!");
    setInteractionCount(prev => prev + 1);
  };

  const handleShareOrder = () => {
    setShowShareOptions(true);
    setInteractionCount(prev => prev + 1);
  };

  const handleShareMethod = (method) => {
    setShowShareOptions(false);
    setInteractionCount(prev => prev + 1);
  };

  const handleAddToCart = (product) => {
    alert(`${product.name} تمت الإضافة إلى السلة!`);
    setInteractionCount(prev => prev + 1);
  };

  const handleProductView = (product) => {
    navigate(`/singleproduct/${product.id}`);
  };

  const handleContinueShopping = () => {
    navigate("/products");
    setInteractionCount(prev => prev + 1);
  };

  const handleBackToHome = () => {
    setInteractionCount(prev => prev + 1);
  };

  // Recommended Product Component
  const RecommendedProduct = ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7 + index * 0.1 }}
      className="card border-0 shadow-sm h-100 product-card"
    >
      <div className="position-relative">
        <img
          src={product.image}
          alt={product.name}
          className="card-img-top product-image"
          style={{ height: '140px', objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => handleProductView(product)}
          onError={(e) => {
            e.target.src = "/assets/img/placeholder.jpg";
          }}
        />
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge bg-primary small">{product.category}</span>
        </div>
       
        {/* Rating */}
        <div className="position-absolute top-0 start-0 m-2">
          <div className="d-flex align-items-center bg-dark bg-opacity-75 rounded-pill px-2 py-1">
            <FaStar className="text-warning me-1" size={10} />
            <small className="text-white fw-semibold">{product.rating}</small>
          </div>
        </div>
      </div>
     
      <div className="card-body d-flex flex-column">
        <h6
          className="card-title fw-semibold mb-2 product-title"
          style={{ cursor: 'pointer' }}
          onClick={() => handleProductView(product)}
        >
          {product.name}
        </h6>
       
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fw-bold text-primary fs-5">${product.price}</span>
          <small className={`${product.stock > 5 ? 'text-success' : 'text-warning'}`}>
            {product.stock > 5 ? 'متوفر' : 'كمية محدودة'}
          </small>
        </div>
       
        <div className="d-flex gap-2 mt-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAddToCart(product)}
            className="btn btn-primary btn-sm flex-fill"
          >
            <FaShoppingCart className="me-1" />
            أضف إلى السلة
          </motion.button>
         
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-outline-danger btn-sm"
          >
            <FaHeart />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  if (!orderDetails) {
    return (
      <div className="container-fluid py-5 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '50vh' }}
        >
          <div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="spinner-border text-primary mb-3"
              style={{ width: '3rem', height: '3rem' }}
              role="status"
            >
              <span className="visually-hidden">جاري التحميل...</span>
            </motion.div>
            <h5 className="text-muted">جاري تحميل تفاصيل طلبك...</h5>
            <p className="text-muted small">نستعد لتأكيد طلبك</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/products")}
              className="btn btn-outline-primary mt-3"
            >
              العودة للتسوق
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 confirmation-page">
      {/* Analytics Badge */}
      <div className="row justify-content-center mb-3">
        <div className="col-lg-8">
          <div className="d-flex justify-content-end gap-2">
            <span className="badge bg-info">
              <FaClock className="me-1" />
              {pageViewStartTime ? Math.round((Date.now() - pageViewStartTime) / 1000) : 0}ث
            </span>
            <span className="badge bg-warning">
              {interactionCount} تفاعلات
            </span>
          </div>
        </div>
      </div>

      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-4"
        >
          <div className="position-relative d-inline-block">
            <FaCheckCircle className="text-success" size={80} />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="position-absolute top-0 start-100 translate-middle p-2 bg-success border border-3 border-white rounded-circle"
            >
              <FaCheck className="text-white" size={12} />
            </motion.div>
          </div>
        </motion.div>
       
        <h1 className="fw-bold mb-3 display-4 gradient-text">
          تم تأكيد الطلب!
        </h1>
        <p className="fs-5 text-muted mb-4 mx-auto" style={{ maxWidth: '600px' }}>
          شكراً لشرائك! لقد أرسلنا بريداً إلكترونياً للتأكيد يحتوي على تفاصيل طلبك ومعلومات التتبع.
        </p>
       
        {/* Order ID & Quick Actions */}
        <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap mb-4">
          <div className="bg-light rounded-3 px-4 py-2">
            <strong>رقم الطلب:</strong> <span className="text-primary fw-bold">{getOrderId()}</span>
          </div>
          <div className="d-flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadInvoice}
              className="btn btn-outline-primary btn-sm"
            >
              <FaDownload className="me-2" />
              تحميل الفاتورة
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShareOrder}
              className="btn btn-outline-secondary btn-sm"
            >
              <FaShare className="me-2" />
              مشاركة الطلب
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="row g-4">
        {/* Order Timeline */}
        <div className="col-lg-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card border-0 shadow-sm mb-4 timeline-card"
          >
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-semibold">
                <FaClock className="me-2 text-primary" />
                حالة الطلب
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row position-relative">
                {orderTimeline.map((step, index) => (
                  <div key={step.status} className="col-3 text-center">
                    <div className="d-flex flex-column align-items-center">
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center mb-3 ${
                          step.active
                            ? 'bg-primary text-white shadow-primary'
                            : 'bg-light text-muted'
                        }`}
                        style={{
                          width: '60px',
                          height: '60px',
                          position: 'relative'
                        }}
                      >
                        {step.active ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.2 }}
                          >
                            <FaCheckCircle size={24} />
                          </motion.div>
                        ) : (
                          <span className="fw-bold">{index + 1}</span>
                        )}
                      </div>
                      <h6 className={`fw-semibold mb-1 ${step.active ? 'text-primary' : 'text-muted'}`}>
                        {step.label}
                      </h6>
                      <small className="text-muted">{step.time}</small>
                    </div>
                  </div>
                ))}
               
                {/* Timeline Connector */}
                <div className="position-absolute top-30 start-0 w-100 h-2 bg-light"
                     style={{ transform: 'translateY(-50%)', zIndex: -1 }}>
                  <div
                    className="h-100 bg-primary rounded-pill"
                    style={{ width: '25%', transition: 'all 0.5s ease' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-lg-8 mx-auto">
          <div className="row g-4">
            {/* Order Summary */}
            <div className="col-md-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="card border-0 shadow-sm h-100 summary-card"
              >
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="mb-0 fw-semibold">
                    <FaBox className="me-2 text-primary" />
                    ملخص الطلب
                  </h5>
                </div>
                <div className="card-body">
                  {getOrderItems().map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom"
                    >
                      <img
                        src={item.image || "/assets/img/placeholder.jpg"}
                        alt={item.name}
                        className="rounded-3"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = "/assets/img/placeholder.jpg";
                        }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="fw-semibold mb-1 small">{item.name || "منتج غير معروف"}</h6>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">الكمية: {item.quantity || 1}</small>
                          <span className="fw-semibold">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                 
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>المجموع الجزئي:</span>
                      <span>${(getPaymentTotal() - getShippingCost()).toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>الشحن:</span>
                      <span>${getShippingCost().toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold fs-5">
                      <span>الإجمالي:</span>
                      <span className="text-primary">${getPaymentTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Shipping & Tracking */}
            <div className="col-md-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="card border-0 shadow-sm h-100 shipping-card"
              >
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="mb-0 fw-semibold">
                    <FaTruck className="me-2 text-primary" />
                    الشحن والتتبع
                  </h5>
                </div>
                <div className="card-body">
                  {/* Shipping Address */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-2">
                      <FaMapMarkerAlt className="me-2 text-muted" />
                      عنوان الشحن
                    </h6>
                    <p className="text-muted small mb-0">
                      {getShippingAddress().name}<br/>
                      {getShippingAddress().street}<br/>
                      {getShippingAddress().city && `${getShippingAddress().city}, `}
                      {getShippingAddress().state} {getShippingAddress().zipCode}<br/>
                      {getShippingAddress().country}
                    </p>
                  </div>

                  {/* Shipping Method */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-2">
                      <FaShippingFast className="me-2 text-muted" />
                      طريقة الشحن
                    </h6>
                    <p className="text-muted small mb-0">
                      {getShippingMethod()}<br/>
                      <small>التوصيل المتوقع: {orderDetails?.shipping?.estimatedDelivery || "سيتم التحديد"}</small>
                    </p>
                  </div>

                  {/* Tracking Information */}
                  <div>
                    <h6 className="fw-semibold mb-2">
                      📦 رقم التتبع
                    </h6>
                    <div className="bg-light rounded-3 p-3">
                      <code className="text-primary fw-bold">{getTrackingNumber()}</code>
                      <small className="d-block text-muted mt-1">
                        سيتم إرسال تحديثات التتبع إلى بريدك الإلكتروني
                      </small>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="col-lg-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card border-0 shadow-sm mt-4 recommendations-card"
          >
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-semibold">
                <FaStar className="me-2 text-warning" />
                قد يعجبك أيضاً
              </h5>
              <small className="text-muted">بناءً على مشترياتك الحديثة</small>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {recommendedProducts.map((product, index) => (
                  <div key={product.id} className="col-md-3 col-6">
                    <RecommendedProduct product={product} index={index} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-5"
      >
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinueShopping}
            className="btn btn-primary btn-lg px-5"
          >
            <FaShoppingBag className="me-2" />
            متابعة التسوق
          </motion.button>
         
          {/* زر عرض الطلبات */}
          <Link
            to="/orders"
            className="btn btn-success btn-lg"
          >
            📋 عرض طلباتي
          </Link>
         
          <Link
            to="/"
            className="btn btn-outline-secondary btn-lg"
            onClick={handleBackToHome}
          >
            <FaHome className="me-2" />
            العودة للرئيسية
          </Link>
        </div>
       
        <p className="text-muted small mt-3">
          سيتم التحويل إلى المنتجات خلال <strong>{countdown}</strong> ثواني...
        </p>
      </motion.div>

      {/* Share Options Modal */}
      <AnimatePresence>
        {showShareOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              background: 'rgba(0,0,0,0.5)',
              zIndex: 9999
            }}
            onClick={() => setShowShareOptions(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="card border-0 shadow-lg"
              style={{ maxWidth: '400px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-semibold">مشاركة تفاصيل الطلب</h5>
              </div>
              <div className="card-body">
                <p className="text-muted mb-3">
                  شارك تأكيد طلبك مع الأصدقاء أو العائلة
                </p>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleShareMethod('email')}
                  >
                    <FaEnvelope className="me-2" />
                    مشاركة عبر البريد
                  </button>
                  <button
                    className="btn btn-outline-info"
                    onClick={() => handleShareMethod('message')}
                  >
                    💬 مشاركة عبر الرسائل
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handleShareMethod('copy_link')}
                  >
                    📋 نسخ رابط الطلب
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .confirmation-page {
          background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
          min-height: 100vh;
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .top-30 {
          top: 30%;
        }
       
        .card {
          transition: all 0.3s ease;
          border-radius: 15px;
        }
       
        .card:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }

        .shadow-primary {
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3) !important;
        }

        .product-card {
          transition: all 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
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

        .timeline-card .bg-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }

        .summary-card, .shipping-card, .recommendations-card {
          border-radius: 15px;
          overflow: hidden;
        }

        .btn {
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .badge {
          border-radius: 8px;
          font-size: 0.75rem;
          padding: 0.35em 0.65em;
        }

        @media (max-width: 768px) {
          .display-4 {
            font-size: 2.5rem;
          }
         
          .timeline-card .col-3 {
            margin-bottom: 2rem;
          }
        }

        @media (max-width: 576px) {
          .display-4 {
            font-size: 2rem;
          }
         
          .btn-lg {
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Confirmation;