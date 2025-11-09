import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders } from '../../context/OrdersContext';
import {
  FaCheckCircle,
  FaShippingFast,
  FaEnvelope,
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
  FaQrcode
} from "react-icons/fa";

function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addOrder } = useOrders();
 
  const [orderDetails, setOrderDetails] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [pageViewStartTime, setPageViewStartTime] = useState(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const [autoRedirectEnabled, setAutoRedirectEnabled] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const defaultTracking = {
    number: `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    status: "processing",
    steps: [
      { status: "ordered", label: "تم الطلب", completed: true, time: "الآن" },
      { status: "confirmed", label: "تم التأكيد", completed: false, time: "خلال 5 دقائق" },
      { status: "shipped", label: "تم الشحن", completed: false, time: "1-2 يوم" },
      { status: "delivered", label: "تم التوصيل", completed: false, time: "3-5 أيام" }
    ]
  };

  const getTrackingNumber = () => {
    return orderDetails?.tracking?.number || defaultTracking.number;
  };

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

  const getShippingMethod = () => {
    return orderDetails?.shipping?.method || "الشحن القياسي";
  };

  const getShippingCost = () => {
    return orderDetails?.shipping?.cost || 0;
  };

  const getPaymentTotal = () => {
    return orderDetails?.payment?.total || 0;
  };

  const getOrderItems = () => {
    return orderDetails?.items || [];
  };

  const getOrderId = () => {
    return orderDetails?.id || `ORD-${Date.now()}`;
  };

  useEffect(() => {
    if (orderDetails) return;

    const startTime = Date.now();
    setPageViewStartTime(startTime);

    let orderData = null;
   
    try {
      if (location.state && location.state.orderDetails) {
        orderData = location.state.orderDetails;
        
        if (orderData && !orderData._processed) {
          orderData._processed = true;
          addOrder(orderData);
        }
      } else {
        orderData = {
          id: `ORD-${Date.now()}`,
          date: new Date().toLocaleDateString('ar-SA'),
          time: new Date().toLocaleTimeString('ar-SA'),
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
        
        addOrder(orderData);
      }
     
      setOrderDetails(orderData);
    } catch (error) {
      console.error('Error setting order details:', error);
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
  }, [location.state, addOrder, orderDetails]);

  useEffect(() => {
    if (!autoRedirectEnabled || countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate("/products");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, autoRedirectEnabled, navigate]);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 3) return prev + 1;
        return prev;
      });
    }, 3000);

    return () => clearInterval(progressTimer);
  }, []);

  const cancelAutoRedirect = useCallback(() => {
    setAutoRedirectEnabled(false);
    setCountdown(0);
  }, []);

  const recommendedProducts = [
    {
      id: 1,
      name: "سماعات أذن لاسلكية",
      price: 129.99,
      image: "/assets/img/earbuds.jpg",
      category: "إلكترونيات",
      rating: 4.3,
      stock: 15,
      features: ["مقاومة للماء", "بطارية 24 ساعة"]
    },
    {
      id: 2,
      name: "ساعة ذكية",
      price: 299.99,
      image: "/assets/img/smartwatch.jpg",
      category: "إلكترونيات",
      rating: 4.7,
      stock: 8,
      features: ["تتبع اللياقة", "مقاومة للماء"]
    },
    {
      id: 3,
      name: "غطاء لابتوب",
      price: 39.99,
      image: "/assets/img/laptop-sleeve.jpg",
      category: "إكسسوارات",
      rating: 4.1,
      stock: 25,
      features: ["مقاوم للماء", "حماية متكاملة"]
    },
    {
      id: 4,
      name: "حامل هاتف",
      price: 19.99,
      image: "/assets/img/phone-stand.jpg",
      category: "إكسسوارات",
      rating: 4.0,
      stock: 30,
      features: ["قابل للتعديل", "تصميم مدمج"]
    }
  ];

  const handleDownloadInvoice = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert("✅ تم تحميل الفاتورة بنجاح!");
    }, 2000);
    setInteractionCount(prev => prev + 1);
    cancelAutoRedirect();
  };

  const handleShareOrder = () => {
    setShowShareOptions(true);
    setInteractionCount(prev => prev + 1);
    cancelAutoRedirect();
  };

  const handleShareMethod = (method) => {
    setShowShareOptions(false);
    setInteractionCount(prev => prev + 1);
    alert(`✅ سيتم المشاركة عبر ${method}`);
  };

  const handleAddToCart = (product) => {
    alert(`🛒 ${product.name} تمت الإضافة إلى السلة!`);
    setInteractionCount(prev => prev + 1);
    cancelAutoRedirect();
  };

  const handleProductView = (product) => {
    navigate(`/singleproduct/${product.id}`);
    cancelAutoRedirect();
  };

  const handleContinueShopping = () => {
    navigate("/products");
    setInteractionCount(prev => prev + 1);
  };

  const handleBackToHome = () => {
    navigate("/");
    setInteractionCount(prev => prev + 1);
  };

  const handleViewOrders = () => {
    navigate("/orders");
    setInteractionCount(prev => prev + 1);
    cancelAutoRedirect();
  };

  const handleTrackOrder = () => {
    navigate(`/tracking/${getOrderId()}`);
    setInteractionCount(prev => prev + 1);
    cancelAutoRedirect();
  };

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
    cancelAutoRedirect();
  };

  const RecommendedProduct = ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7 + index * 0.1 }}
      className="recommended-product-card"
    >
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onClick={() => handleProductView(product)}
          onError={(e) => {
            e.target.src = "/assets/img/placeholder.jpg";
          }}
        />
        <div className="product-badges">
          <span className="category-badge">{product.category}</span>
          {product.stock < 10 && (
            <span className="stock-badge">كمية محدودة</span>
          )}
        </div>
       
        <div className="product-rating">
          <FaStar className="star-icon" />
          <span>{product.rating}</span>
        </div>
      </div>
     
      <div className="product-content">
        <h6 className="product-title" onClick={() => handleProductView(product)}>
          {product.name}
        </h6>
       
        <div className="product-features">
          {product.features.slice(0, 2).map((feature, idx) => (
            <span key={idx} className="feature-tag">{feature}</span>
          ))}
        </div>
       
        <div className="product-footer">
          <div className="price-section">
            <span className="current-price">${product.price}</span>
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice}</span>
            )}
          </div>
         
          <div className="product-actions">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAddToCart(product)}
              className="btn-add-to-cart"
            >
              <FaShoppingCart />
            </motion.button>
           
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-wishlist"
              onClick={() => {
                alert(`❤️ تم إضافة "${product.name}" إلى المفضلة`);
              }}
            >
              <FaHeart />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const OrderTimeline = () => (
    <div className="order-timeline">
      {defaultTracking.steps.map((step, index) => (
        <div key={step.status} className={`timeline-step ${index <= currentStep ? 'active' : ''}`}>
          <div className="step-indicator">
            {index < currentStep ? (
              <FaCheck className="step-icon" />
            ) : (
              <span className="step-number">{index + 1}</span>
            )}
          </div>
          <div className="step-content">
            <h6 className="step-title">{step.label}</h6>
            <span className="step-time">{step.time}</span>
          </div>
          {index < defaultTracking.steps.length - 1 && (
            <div className={`step-connector ${index < currentStep ? 'active' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );

  if (!orderDetails) {
    return (
      <div className="confirmation-loading">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="loading-content"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="loading-spinner"
          />
          <h5>جاري تحميل تفاصيل طلبك...</h5>
          <p>نستعد لتأكيد طلبك</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/products")}
            className="btn-back-to-shopping"
          >
            العودة للتسوق
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="analytics-badges">
        <div className="analytics-badge">
          <FaClock />
          <span>{pageViewStartTime ? Math.round((Date.now() - pageViewStartTime) / 1000) : 0}ث</span>
        </div>
        <div className="analytics-badge">
          <span>{interactionCount} تفاعلات</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="success-header"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="success-icon-container"
        >
          <FaCheckCircle className="success-icon" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="success-badge"
          >
            <FaCheck />
          </motion.div>
        </motion.div>
       
        <h1 className="success-title">
          تم تأكيد الطلب!
        </h1>
        <p className="success-message">
          شكراً لشرائك! لقد أرسلنا بريداً إلكترونياً للتأكيد يحتوي على تفاصيل طلبك ومعلومات التتبع.
        </p>
       
        <div className="order-info-actions">
          <div className="order-id">
            <strong>رقم الطلب:</strong>
            <span className="order-number">{getOrderId()}</span>
          </div>
          <div className="quick-actions">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadInvoice}
              disabled={isDownloading}
              className="btn-action"
            >
              {isDownloading ? (
                <>
                  <div className="spinner"></div>
                  جاري التحميل...
                </>
              ) : (
                <>
                  <FaDownload />
                  تحميل الفاتورة
                </>
              )}
            </motion.button>
           
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShareOrder}
              className="btn-action"
            >
              <FaShare />
              مشاركة الطلب
            </motion.button>
           
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTrackOrder}
              className="btn-action btn-track"
            >
              <FaTruck />
              تتبع الطلب
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleQRCode}
              className="btn-action btn-qr"
            >
              <FaQrcode />
              QR كود
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="confirmation-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="timeline-section"
        >
          <div className="section-header">
            <FaClock />
            <h5>حالة الطلب</h5>
          </div>
          <OrderTimeline />
        </motion.div>

        <div className="order-details-grid">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="detail-card summary-card"
          >
            <div className="card-header">
              <FaBox />
              <h5>ملخص الطلب</h5>
            </div>
            <div className="card-content">
              <div className="order-items">
                {getOrderItems().map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="order-item"
                  >
                    <img
                      src={item.image || "/assets/img/placeholder.jpg"}
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-details">
                      <h6>{item.name || "منتج غير معروف"}</h6>
                      <div className="item-meta">
                        <span>الكمية: {item.quantity || 1}</span>
                        <span className="item-price">
                          ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
             
              <div className="order-totals">
                <div className="total-row">
                  <span>المجموع الجزئي:</span>
                  <span>${(getPaymentTotal() - getShippingCost()).toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>الشحن:</span>
                  <span>${getShippingCost().toFixed(2)}</span>
                </div>
                <div className="total-row final-total">
                  <span>الإجمالي:</span>
                  <span>${getPaymentTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="detail-card shipping-card"
          >
            <div className="card-header">
              <FaTruck />
              <h5>الشحن والتتبع</h5>
            </div>
            <div className="card-content">
              <div className="info-section">
                <h6>
                  <FaMapMarkerAlt />
                  عنوان الشحن
                </h6>
                <div className="address-details">
                  <p>{getShippingAddress().name}</p>
                  <p>{getShippingAddress().street}</p>
                  <p>
                    {getShippingAddress().city && `${getShippingAddress().city}, `}
                    {getShippingAddress().state} {getShippingAddress().zipCode}
                  </p>
                  <p>{getShippingAddress().country}</p>
                </div>
              </div>

              <div className="info-section">
                <h6>
                  <FaShippingFast />
                  طريقة الشحن
                </h6>
                <p className="shipping-method">{getShippingMethod()}</p>
                <small>التوصيل المتوقع: {orderDetails?.shipping?.estimatedDelivery || "سيتم التحديد"}</small>
              </div>

              <div className="info-section">
                <h6>📦 رقم التتبع</h6>
                <div className="tracking-info">
                  <code className="tracking-number">{getTrackingNumber()}</code>
                  <small>سيتم إرسال تحديثات التتبع إلى بريدك الإلكتروني</small>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTrackOrder}
                    className="btn-track-order"
                  >
                    <FaTruck />
                    تتبع الطلب الآن
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="recommendations-section"
        >
          <div className="section-header">
            <FaStar />
            <h5>قد يعجبك أيضاً</h5>
            <small>بناءً على مشترياتك الحديثة</small>
          </div>
          <div className="recommendations-grid">
            {recommendedProducts.map((product, index) => (
              <RecommendedProduct key={product.id} product={product} index={index} />
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="action-buttons"
      >
        <div className="buttons-container">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinueShopping}
            className="btn-primary"
          >
            <FaShoppingBag />
            متابعة التسوق
          </motion.button>
         
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTrackOrder}
            className="btn-secondary"
          >
            <FaTruck />
            تتبع الطلب
          </motion.button>
         
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewOrders}
            className="btn-success"
          >
            📋 عرض طلباتي
          </motion.button>
         
          <Link
            to="/"
            className="btn-outline"
            onClick={handleBackToHome}
          >
            <FaHome />
            العودة للرئيسية
          </Link>
        </div>
       
        <div className="countdown-section">
          <p>
            {autoRedirectEnabled ? (
              <>سيتم التحويل إلى المنتجات خلال <strong>{countdown}</strong> ثواني...</>
            ) : (
              <>يمكنك الاستمرار في التصفح دون تحويل تلقائي</>
            )}
          </p>
          {autoRedirectEnabled && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={cancelAutoRedirect}
              className="btn-cancel-redirect"
            >
              إلغاء التحويل التلقائي
            </motion.button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showShareOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowShareOptions(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="share-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h5>مشاركة تفاصيل الطلب</h5>
              </div>
              <div className="modal-content">
                <p>شارك تأكيد طلبك مع الأصدقاء أو العائلة</p>
                <div className="share-options">
                  <button onClick={() => handleShareMethod('email')}>
                    <FaEnvelope />
                    مشاركة عبر البريد
                  </button>
                  <button onClick={() => handleShareMethod('message')}>
                    💬 مشاركة عبر الرسائل
                  </button>
                  <button onClick={() => handleShareMethod('copy_link')}>
                    📋 نسخ رابط الطلب
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQRCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowQRCode(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="qr-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h5>QR كود الطلب</h5>
              </div>
              <div className="modal-content">
                <div className="qr-code-placeholder">
                  <FaQrcode size={120} />
                  <p>مسح الكود لمتابعة حالة الطلب</p>
                </div>
                <div className="order-info-qr">
                  <strong>رقم الطلب: {getOrderId()}</strong>
                  <small>تاريخ الطلب: {orderDetails.date}</small>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .confirmation-page {
          background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
          min-height: 100vh;
          padding: 2rem 1rem;
        }

        .analytics-badges {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .analytics-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f1f5f9;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          color: #64748b;
        }

        .success-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .success-icon-container {
          position: relative;
          display: inline-block;
          margin-bottom: 2rem;
        }

        .success-icon {
          font-size: 5rem;
          color: #10b981;
        }

        .success-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #10b981;
          color: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
        }

        .success-title {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .success-message {
          font-size: 1.25rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto 2rem;
        }

        .order-info-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .order-id {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .order-number {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-weight: bold;
        }

        .quick-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn-action {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 10px;
          background: #f8fafc;
          color: #475569;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-action:hover {
          background: #e2e8f0;
          transform: translateY(-2px);
        }

        .btn-track {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .btn-track:hover {
          background: linear-gradient(135deg, #5a67d8, #6b46c1);
        }

        .btn-qr {
          background: #10b981;
          color: white;
        }

        .btn-qr:hover {
          background: #059669;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .confirmation-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .timeline-section {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          color: #374151;
        }

        .section-header h5 {
          margin: 0;
          font-weight: 600;
        }

        .order-timeline {
          display: flex;
          justify-content: space-between;
          position: relative;
        }

        .timeline-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
        }

        .step-indicator {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          background: #f1f5f9;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .timeline-step.active .step-indicator {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-color: #667eea;
          color: white;
        }

        .step-number {
          font-weight: 600;
        }

        .step-icon {
          font-size: 1.2rem;
        }

        .step-content {
          text-align: center;
        }

        .step-title {
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #374151;
        }

        .timeline-step.active .step-title {
          color: #667eea;
        }

        .step-time {
          font-size: 0.875rem;
          color: #64748b;
        }

        .step-connector {
          position: absolute;
          top: 25px;
          left: 60%;
          width: 100%;
          height: 2px;
          background: #e2e8f0;
          z-index: -1;
        }

        .step-connector.active {
          background: #667eea;
        }

        .order-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .order-details-grid {
            grid-template-columns: 1fr;
          }
        }

        .detail-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem;
          background: white;
          border-bottom: 1px solid #e2e8f0;
        }

        .card-header h5 {
          margin: 0;
          font-weight: 600;
          color: #374151;
        }

        .card-content {
          padding: 1.5rem;
        }

        .order-items {
          space-y: 1rem;
        }

        .order-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
        }

        .item-details {
          flex: 1;
        }

        .item-details h6 {
          margin: 0 0 0.5rem 0;
          font-weight: 600;
          color: #374151;
        }

        .item-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .item-price {
          font-weight: 600;
          color: #667eea;
        }

        .order-totals {
          border-top: 2px solid #f1f5f9;
          padding-top: 1rem;
          margin-top: 1rem;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
        }

        .final-total {
          border-top: 1px solid #e2e8f0;
          font-weight: bold;
          font-size: 1.25rem;
          color: #374151;
        }

        .final-total span:last-child {
          color: #667eea;
        }

        .info-section {
          margin-bottom: 1.5rem;
        }

        .info-section:last-child {
          margin-bottom: 0;
        }

        .info-section h6 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 0.5rem 0;
          font-weight: 600;
          color: #374151;
        }

        .address-details p {
          margin: 0.25rem 0;
          color: #64748b;
        }

        .shipping-method {
          font-weight: 600;
          color: #374151;
          margin: 0.25rem 0;
        }

        .tracking-info {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 8px;
        }

        .tracking-number {
          background: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-family: monospace;
          font-weight: bold;
          color: #667eea;
          display: block;
          margin-bottom: 0.5rem;
        }

        .btn-track-order {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 0.5rem;
          width: 100%;
          justify-content: center;
        }

        .recommendations-section {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .recommendations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .recommended-product-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .recommended-product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }

        .product-image-container {
          position: relative;
          height: 160px;
          overflow: hidden;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .recommended-product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-badges {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .category-badge, .stock-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .category-badge {
          background: #667eea;
          color: white;
        }

        .stock-badge {
          background: #f59e0b;
          color: white;
        }

        .product-rating {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
        }

        .star-icon {
          color: #fbbf24;
        }

        .product-content {
          padding: 1rem;
        }

        .product-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
          cursor: pointer;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
          height: 2.8em;
        }

        .product-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }

        .feature-tag {
          background: #f1f5f9;
          color: #64748b;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price-section {
          display: flex;
          flex-direction: column;
        }

        .current-price {
          font-weight: bold;
          font-size: 1.25rem;
          color: #667eea;
        }

        .original-price {
          font-size: 0.875rem;
          color: #94a3b8;
          text-decoration: line-through;
        }

        .product-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-add-to-cart, .btn-wishlist {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-add-to-cart {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .btn-add-to-cart:hover {
          background: linear-gradient(135deg, #5a67d8, #6b46c1);
        }

        .btn-wishlist {
          background: #f1f5f9;
          color: #64748b;
        }

        .btn-wishlist:hover {
          background: #fecaca;
          color: #dc2626;
        }

        .action-buttons {
          text-align: center;
          margin-top: 3rem;
        }

        .buttons-container {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2rem;
        }

        .btn-primary, .btn-secondary, .btn-success, .btn-outline {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
          background: #06b6d4;
          color: white;
        }

        .btn-secondary:hover {
          background: #0891b2;
          transform: translateY(-2px);
        }

        .btn-success {
          background: #10b981;
          color: white;
        }

        .btn-success:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        .btn-outline {
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .btn-outline:hover {
          border-color: #667eea;
          color: #667eea;
          transform: translateY(-2px);
        }

        .countdown-section {
          border-top: 1px solid #e2e8f0;
          padding-top: 1.5rem;
        }

        .countdown-section p {
          color: #64748b;
          margin-bottom: 1rem;
        }

        .btn-cancel-redirect {
          background: #f59e0b;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-cancel-redirect:hover {
          background: #d97706;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }

        .share-modal, .qr-modal {
          background: white;
          border-radius: 15px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          max-width: 400px;
          width: 90%;
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h5 {
          margin: 0;
          font-weight: 600;
        }

        .modal-content {
          padding: 1.5rem;
        }

        .share-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .share-options button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .share-options button:hover {
          background: #f8fafc;
          border-color: #667eea;
        }

        .qr-code-placeholder {
          text-align: center;
          padding: 2rem;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .order-info-qr {
          text-align: center;
        }

        .confirmation-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
        }

        .loading-content {
          text-align: center;
        }

        .loading-spinner {
          width: 3rem;
          height: 3rem;
          border: 4px solid #f1f5f9;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          margin: 0 auto 1rem;
        }

        .btn-back-to-shopping {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .success-title {
            font-size: 2rem;
          }

          .order-info-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .quick-actions {
            justify-content: center;
          }

          .buttons-container {
            flex-direction: column;
            align-items: center;
          }

          .btn-primary, .btn-secondary, .btn-success, .btn-outline {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }

          .order-timeline {
            flex-direction: column;
            gap: 2rem;
          }

          .step-connector {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default Confirmation;