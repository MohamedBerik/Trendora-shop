import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaTrash,
  FaEye,
  FaDownload,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBox,
  FaCreditCard,
  FaStar,
  FaShoppingBag,
  FaCalendarAlt,
  FaSync,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaShoppingCart,
  FaHeart,
  FaTimes,
  FaReceipt,
  FaPrint,
  FaCheck,
  FaInfoCircle,
  FaMap
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders } from '../../context/OrdersContext';

// ✅ مكون الإشعارات
const Notification = ({ type, message, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: {
      icon: FaCheck,
      bgColor: 'bg-success',
      textColor: 'text-white',
      borderColor: 'border-success'
    },
    error: {
      icon: FaTimesCircle,
      bgColor: 'bg-danger',
      textColor: 'text-white',
      borderColor: 'border-danger'
    },
    warning: {
      icon: FaExclamationTriangle,
      bgColor: 'bg-warning',
      textColor: 'text-dark',
      borderColor: 'border-warning'
    },
    info: {
      icon: FaInfoCircle,
      bgColor: 'bg-info',
      textColor: 'text-white',
      borderColor: 'border-info'
    }
  }[type] || config.info;

  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`toast show position-fixed ${config.bgColor} ${config.textColor} border-0 shadow-lg`}
      style={{
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px'
      }}
      role="alert"
    >
      <div className="toast-header border-0 bg-transparent text-white">
        <IconComponent className="me-2" />
        <strong className="me-auto">
          {type === 'success' && 'نجاح'}
          {type === 'error' && 'خطأ'}
          {type === 'warning' && 'تحذير'}
          {type === 'info' && 'معلومات'}
        </strong>
        <button
          type="button"
          className="btn-close btn-close-white"
          onClick={onClose}
        ></button>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </motion.div>
  );
};

// ✅ نافذة تتبع الشحن المبسطة
const TrackingModal = ({ order, onClose }) => (
  <AnimatePresence>
    {order && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal show d-block"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10000 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
            <div className="modal-header bg-primary text-white border-0">
              <div className="d-flex align-items-center">
                <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                  <FaMap size={20} className="text-white" />
                </div>
                <div>
                  <h5 className="modal-title mb-0 fw-bold">تتبع الشحن</h5>
                  <small className="opacity-90">{order.id}</small>
                </div>
              </div>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            <div className="modal-body text-center py-4">
              <FaTruck size={60} className="text-primary mb-3" />
              <h4 className="fw-bold text-dark mb-3">طلبك في الطريق إليك</h4>
              <p className="text-muted mb-4">نقوم بتوصيل طلبك في أقرب وقت ممكن</p>
              
              <div className="tracking-steps mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="step completed">
                    <div className="step-icon bg-success text-white rounded-circle p-2">
                      <FaCheckCircle size={16} />
                    </div>
                    <small className="d-block mt-1">تم الطلب</small>
                  </div>
                  <div className="step completed">
                    <div className="step-icon bg-success text-white rounded-circle p-2">
                      <FaCheckCircle size={16} />
                    </div>
                    <small className="d-block mt-1">قيد التجهيز</small>
                  </div>
                  <div className="step active">
                    <div className="step-icon bg-primary text-white rounded-circle p-2">
                      <FaTruck size={16} />
                    </div>
                    <small className="d-block mt-1">قيد التوصيل</small>
                  </div>
                  <div className="step">
                    <div className="step-icon bg-light text-muted rounded-circle p-2">
                      <FaCheckCircle size={16} />
                    </div>
                    <small className="d-block mt-1">تم التوصيل</small>
                  </div>
                </div>
              </div>

              <div className="alert alert-info border-0">
                <FaInfoCircle className="me-2" />
                <strong>رقم التتبع:</strong> TRK-{order.id.toUpperCase()}
              </div>
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-primary rounded-pill px-4" onClick={onClose}>
                فهمت
              </button>
              <button 
                className="btn btn-outline-primary rounded-pill px-4"
                onClick={() => {
                  onClose();
                  window.open(`/tracking/${order.id}`, '_blank');
                }}
              >
                <FaMap className="me-2" />
                صفحة التتبع الكاملة
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ✅ نافذة التقييم المبسطة
const RatingModal = ({ order, onClose, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    onRatingSubmit({
      orderId: order.id,
      rating,
      review,
      date: new Date().toISOString()
    });
  };

  return (
    <AnimatePresence>
      {order && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10000 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <div className="modal-header bg-warning text-dark border-0">
                <div className="d-flex align-items-center">
                  <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                    <FaStar size={20} className="text-dark" />
                  </div>
                  <div>
                    <h5 className="modal-title mb-0 fw-bold">تقييم الطلب</h5>
                    <small className="opacity-90">{order.id}</small>
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={onClose}></button>
              </div>
              <div className="modal-body py-4">
                <div className="text-center mb-4">
                  <FaStar size={50} className="text-warning mb-3" />
                  <h4 className="fw-bold text-dark mb-2">كيف كانت تجربتك؟</h4>
                  <p className="text-muted">شاركنا رأيك في الطلب والمنتجات</p>
                </div>

                <div className="rating-section text-center mb-4">
                  <h6 className="fw-bold mb-3">تقييم عام</h6>
                  <div className="stars mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className="btn btn-link p-1"
                        onClick={() => setRating(star)}
                      >
                        <FaStar
                          size={30}
                          className={star <= rating ? "text-warning" : "text-muted"}
                          style={{ cursor: 'pointer' }}
                        />
                      </button>
                    ))}
                  </div>
                  <small className="text-muted">
                    {rating === 0 && 'اختر التقييم'}
                    {rating === 1 && 'سيء'}
                    {rating === 2 && 'مقبول'}
                    {rating === 3 && 'جيد'}
                    {rating === 4 && 'جيد جداً'}
                    {rating === 5 && 'ممتاز'}
                  </small>
                </div>

                <div className="review-section">
                  <label className="form-label fw-bold">تعليقك (اختياري)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="اكتب تعليقك عن الطلب والمنتجات..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
                  إلغاء
                </button>
                <button 
                  className="btn btn-warning rounded-pill px-4" 
                  onClick={handleSubmit}
                  disabled={rating === 0}
                >
                  <FaCheck className="me-2" />
                  إرسال التقييم
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ✅ مكون المنتج الموصى به
const RecommendedProduct = ({ product, index, onAddToCart, onProductView, onToggleWishlist, isInWishlist }) => (
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
        onClick={() => onProductView(product)}
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
        onClick={() => onProductView(product)}
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
          onClick={() => onAddToCart(product)}
          className="btn btn-primary btn-sm flex-fill"
        >
          <FaShoppingCart className="me-1" />
          أضف إلى السلة
        </motion.button>
       
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`btn btn-sm ${isInWishlist ? 'btn-danger' : 'btn-outline-danger'}`}
          onClick={() => onToggleWishlist(product)}
        >
          <FaHeart />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

// ✅ مكون قسم المنتجات الموصى بها
const RecommendedProductsSection = ({ 
  products, 
  onAddToCart, 
  onProductView, 
  onToggleWishlist, 
  isInWishlist 
}) => {
  if (!products || products.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="row mt-5 mb-4"
    >
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-dark mb-0">منتجات قد تعجبك</h4>
          <Link to="/products" className="btn btn-outline-primary btn-sm">
            عرض الكل
          </Link>
        </div>
        <div className="row g-3">
          {products.map((product, index) => (
            <div key={product.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
              <RecommendedProduct
                product={product}
                index={index}
                onAddToCart={onAddToCart}
                onProductView={onProductView}
                onToggleWishlist={onToggleWishlist}
                isInWishlist={isInWishlist(product.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

function OrdersPage() {
  const { orders, isLoading, isInitialized, clearAllOrders } = useOrders();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [visibleOrders, setVisibleOrders] = useState(6);
  const [quickViewOrder, setQuickViewOrder] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [showClearOrdersConfirm, setShowClearOrdersConfirm] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [generatingInvoice, setGeneratingInvoice] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  // ✅ إصلاح: تعريف State للنوافذ بشكل صحيح
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedOrderForRating, setSelectedOrderForRating] = useState(null);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);

  // ✅ إضافة إشعار جديد
  const addNotification = useCallback((type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
  }, []);

  // ✅ إزالة إشعار
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // ✅ دوال التحقق من الحالة
  const isOrderEligibleForRating = useCallback((order) => {
    return order.status === 'delivered';
  }, []);

  const isOrderEligibleForTracking = useCallback((order) => {
    return ['shipped', 'out_for_delivery', 'delivered'].includes(order.status);
  }, []);

  // ✅ إصلاح: دوال فتح النوافذ الجديدة
  const handleOpenRatingModal = useCallback((order) => {
    setSelectedOrderForRating(order);
    setRatingModalOpen(true);
  }, []);

  const handleOpenTrackingModal = useCallback((order) => {
    setSelectedOrderForTracking(order);
    setTrackingModalOpen(true);
    addNotification('info', `جاري تتبع طلبك ${order.id}`);
  }, [addNotification]);

  // ✅ إصلاح: معالجة تقييم المنتجات
  const handleProductRating = useCallback((ratingData) => {
    console.log('تقييم الطلب:', ratingData);
    addNotification('success', 'شكراً لتقييمك! تم حفظ التقييم بنجاح');
    setRatingModalOpen(false);
    setSelectedOrderForRating(null);
  }, [addNotification]);

  // ✅ دوال المفضلة
  const isInWishlist = useCallback((productId) => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  const toggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const isInList = prev.some(item => item.id === product.id);
      if (isInList) {
        addNotification('info', `تم إزالة ${product.name} من المفضلة`);
        return prev.filter(item => item.id !== product.id);
      } else {
        addNotification('success', `تم إضافة ${product.name} إلى المفضلة`);
        return [...prev, product];
      }
    });
  }, [addNotification]);

  // ✅ إصلاح: دالة تتبع الطلب - استخدام النافذة المنبثقة
  const handleTrackOrder = useCallback((order) => {
    handleOpenTrackingModal(order);
  }, [handleOpenTrackingModal]);

  // ✅ إصلاح: دالة الحصول على مستوى العضوية
  const getPremiumLevel = useCallback((totalSpent) => {
    if (totalSpent >= 1000) return { level: "مميز", color: "warning", discount: 15 };
    if (totalSpent >= 500) return { level: "فضي", color: "secondary", discount: 10 };
    if (totalSpent >= 200) return { level: "برونزي", color: "danger", discount: 5 };
    return { level: "عادي", color: "light", discount: 0 };
  }, []);

  // ✅ بيانات المنتجات الموصى بها
  const recommendedProducts = useMemo(() => [
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
  ], []);

  // ✅ دوال المنتجات الموصى بها
  const handleAddToCart = useCallback((product) => {
    addNotification('success', `تم إضافة ${product.name} إلى سلة التسوق`);
  }, [addNotification]);

  const handleProductView = useCallback((product) => {
    navigate(`/singleproduct/${product.id}`);
  }, [navigate]);

  // حساب عدد الفلاتر النشطة
  useEffect(() => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== 'all') count++;
    if (dateFilter !== 'all') count++;
    setActiveFilterCount(count);
  }, [searchTerm, statusFilter, dateFilter]);

  // ✅ دالة مساعدة للحصول على نص الحالة
  const getStatusText = (status) => {
    const statusMap = {
      'processing': 'قيد المعالجة',
      'shipped': 'تم الشحن', 
      'delivered': 'تم التوصيل',
      'cancelled': 'ملغي',
      'confirmed': 'تم التأكيد',
      'preparing': 'قيد التجهيز',
      'out_for_delivery': 'قيد التوصيل'
    };
    return statusMap[status] || 'غير معروف';
  };

  // ✅ دوال حساب القيم - بدون ضريبة
  const calculateOrderValues = useCallback((order) => {
    const items = order.items || [];
    
    // حساب إجمالي المنتجات بدون ضريبة
    const itemsTotal = items.reduce((sum, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
    
    // تكلفة الشحن
    const shippingCost = order.shipping?.cost || 0;
    
    // السعر الإجمالي (من البيانات المخزنة أو المحسوب) - بدون ضريبة
    const totalAmount = order.total || (itemsTotal + shippingCost);
    
    return {
      subtotal: itemsTotal,
      shipping: shippingCost,
      total: totalAmount,
      itemsCount: items.reduce((sum, item) => sum + (item.quantity || 1), 0)
    };
  }, []);

  // ✅ دالة إنشاء وتحميل الفاتورة الحقيقية - بدون ضريبة
  const generateAndDownloadInvoice = useCallback(async (order) => {
    setGeneratingInvoice(order.id);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const orderValues = calculateOrderValues(order);
      
      const invoiceContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <title>فاتورة ${order.id}</title>
            <style>
                body {
                    font-family: 'Arial', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                    line-height: 1.6;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }
                .invoice-container {
                    max-width: 800px;
                    margin: 20px auto;
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                    border: 3px solid #007bff;
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding-bottom: 30px;
                    border-bottom: 3px solid #007bff;
                    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                    margin: -40px -40px 40px -40px;
                    padding: 40px;
                    border-radius: 20px 20px 0 0;
                    color: white;
                }
                .company-name {
                    font-size: 32px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: white;
                }
                .invoice-title {
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .order-number {
                    font-size: 18px;
                    opacity: 0.9;
                }
                .order-info {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-bottom: 40px;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    padding: 30px;
                    border-radius: 15px;
                    border: 2px solid #e9ecef;
                }
                .info-section h3 {
                    color: #007bff;
                    margin-bottom: 15px;
                    font-size: 18px;
                    border-bottom: 2px solid #007bff;
                    padding-bottom: 8px;
                }
                .info-section div {
                    margin-bottom: 8px;
                    font-size: 15px;
                }
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 40px;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                .items-table th {
                    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                    color: white;
                    padding: 15px;
                    text-align: right;
                    font-weight: 600;
                    font-size: 16px;
                }
                .items-table td {
                    padding: 15px;
                    border-bottom: 1px solid #dee2e6;
                    text-align: right;
                    font-size: 15px;
                }
                .items-table tr:nth-child(even) {
                    background: #f8f9fa;
                }
                .items-table tr:hover {
                    background: #e3f2fd;
                }
                .summary {
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                    padding: 30px;
                    border-radius: 15px;
                    color: white;
                    margin-bottom: 40px;
                }
                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    padding: 8px 0;
                    font-size: 16px;
                }
                .total-row {
                    border-top: 3px solid rgba(255,255,255,0.3);
                    padding-top: 15px;
                    font-weight: bold;
                    font-size: 22px;
                    margin-top: 10px;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 30px;
                    border-top: 2px solid #dee2e6;
                    color: #6c757d;
                    font-size: 14px;
                }
                .thank-you {
                    text-align: center;
                    margin: 30px 0;
                    font-style: italic;
                    color: #007bff;
                    font-size: 18px;
                    background: #e3f2fd;
                    padding: 20px;
                    border-radius: 10px;
                    border-right: 4px solid #007bff;
                }
                @media print {
                    body {
                        background: white !important;
                        padding: 0;
                    }
                    .invoice-container {
                        box-shadow: none;
                        border: 1px solid #ddd;
                        margin: 0;
                        border-radius: 0;
                    }
                }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <div class="header">
                    <div class="company-name">متجرنا الإلكتروني</div>
                    <div class="invoice-title">فاتورة مبيعات</div>
                    <div class="order-number">رقم الفاتورة: ${order.id}</div>
                </div>
                
                <div class="order-info">
                    <div class="info-section">
                        <h3>معلومات العميل</h3>
                        <div><strong>اسم العميل:</strong> عميل متجرنا</div>
                        <div><strong>البريد الإلكتروني:</strong> customer@example.com</div>
                        <div><strong>الهاتف:</strong> +966 55 123 4567</div>
                        <div><strong>العنوان:</strong> الرياض، المملكة العربية السعودية</div>
                    </div>
                    <div class="info-section">
                        <h3>معلومات الطلب</h3>
                        <div><strong>رقم الطلب:</strong> ${order.id}</div>
                        <div><strong>تاريخ الطلب:</strong> ${order.date ? new Date(order.date).toLocaleDateString('ar-SA') : "غير محدد"}</div>
                        <div><strong>حالة الطلب:</strong> ${getStatusText(order.status)}</div>
                        <div><strong>طريقة الدفع:</strong> ${order.payment?.method || "بطاقة ائتمان"}</div>
                    </div>
                </div>
                
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>المنتج</th>
                            <th>السعر</th>
                            <th>الكمية</th>
                            <th>المجموع</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items?.map(item => `
                            <tr>
                                <td><strong>${item.name || item.title || "منتج غير معروف"}</strong></td>
                                <td>$${(item.price || 0).toFixed(2)}</td>
                                <td>${item.quantity || 1}</td>
                                <td><strong>$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="summary">
                    <div class="summary-row">
                        <span>المجموع الجزئي:</span>
                        <span>$${orderValues.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>تكلفة الشحن:</span>
                        <span>$${orderValues.shipping.toFixed(2)}</span>
                    </div>
                    <div class="summary-row total-row">
                        <span>المجموع الكلي:</span>
                        <span>$${orderValues.total.toFixed(2)}</span>
                    </div>
                </div>
                
                ${order.shipping?.address ? `
                <div class="info-section">
                    <h3>عنوان الشحن</h3>
                    <div>${order.shipping.address.street}, ${order.shipping.address.city}, ${order.shipping.address.country}</div>
                </div>
                ` : ''}
                
                <div class="thank-you">
                    شكراً لثقتكم بنا! نتمنى لكم تجربة تسوق ممتعة 🌟
                </div>
                
                <div class="footer">
                    <div style="margin-bottom: 10px; font-size: 16px; color: #007bff;">
                        <strong>© 2024 متجرنا الإلكتروني. جميع الحقوق محفوظة.</strong>
                    </div>
                    <div>هاتف: +966 55 123 4567 | البريد الإلكتروني: info@ourstore.com</div>
                    <div>الموقع الإلكتروني: www.ourstore.com</div>
                </div>
            </div>
        </body>
        </html>
      `;

      // ✅ التحميل المباشر كملف HTML
      const blob = new Blob([invoiceContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order.id}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addNotification('success', `تم تحميل فاتورة الطلب ${order.id} بنجاح`);

    } catch (error) {
      console.error('Error generating invoice:', error);
      addNotification('error', 'حدث خطأ أثناء إنشاء الفاتورة');
    } finally {
      setGeneratingInvoice(null);
    }
  }, [addNotification, calculateOrderValues, getStatusText]);

  // تحسين الفلترة مع تقييد النتائج
  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    
    const filtered = orders.filter(order => {
      if (!order || typeof order !== 'object') return false;
      
      const matchesSearch = 
        (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.items && Array.isArray(order.items) && order.items.some(item =>
          item && item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));
     
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
     
      const orderDate = order.date ? new Date(order.date) : new Date();
      const matchesDate = dateFilter === "all" ||
                         (dateFilter === "last30" && orderDate >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
                         (dateFilter === "last90" && orderDate >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));
     
      return matchesSearch && matchesStatus && matchesDate;
    });

    return filtered.sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(0);
      const dateB = b.date ? new Date(b.date) : new Date(0);
      return dateB - dateA;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  // تحسين الإحصائيات مع التحقق من البيانات
  const orderStats = useMemo(() => {
    if (!orders || !Array.isArray(orders)) {
      return {
        total: 0,
        delivered: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        deliverySuccessRate: 0,
        statusBreakdown: {}
      };
    }

    const validOrders = orders.filter(order => order && typeof order === 'object');
    const total = validOrders.length;
    const delivered = validOrders.filter(order => order.status === 'delivered').length;
    
    // ✅ التصحيح: استخدام order.total مباشرة
    const totalSpent = validOrders.reduce((sum, order) => {
      const orderTotal = order.total || 0;
      return sum + orderTotal;
    }, 0);
    
    const averageOrderValue = total > 0 ? totalSpent / total : 0;
    const deliverySuccessRate = total > 0 ? (delivered / total) * 100 : 0;
   
    const statusBreakdown = validOrders.reduce((acc, order) => {
      const status = order.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
   
    return {
      total,
      delivered,
      totalSpent,
      averageOrderValue,
      deliverySuccessRate,
      statusBreakdown
    };
  }, [orders]);

  // تكوين الحالة مع قيم افتراضية
  const statusConfig = {
    delivered: {
      icon: FaCheckCircle,
      color: "success",
      bgColor: "bg-success",
      text: "تم التوصيل",
      description: "تم توصيل طلبك",
      gradient: "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
    },
    shipped: {
      icon: FaTruck,
      color: "primary",
      bgColor: "bg-primary",
      text: "تم الشحن",
      description: "طلبك في الطريق",
      gradient: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)"
    },
    processing: {
      icon: FaClock,
      color: "warning",
      bgColor: "bg-warning",
      text: "قيد المعالجة",
      description: "نحن نجهز طلبك",
      gradient: "linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)"
    },
    cancelled: {
      icon: FaTimesCircle,
      color: "danger",
      bgColor: "bg-danger",
      text: "ملغي",
      description: "تم إلغاء هذا الطلب",
      gradient: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)"
    },
    unknown: {
      icon: FaExclamationCircle,
      color: "secondary",
      bgColor: "bg-secondary",
      text: "غير معروف",
      description: "حالة غير معروفة",
      gradient: "linear-gradient(135deg, #6c757d 0%, #495057 100%)"
    }
  };

  // ✅ الحصول على مستوى العضوية للإحصائيات
  const premiumLevel = useMemo(() => {
    return getPremiumLevel(orderStats.totalSpent);
  }, [orderStats.totalSpent, getPremiumLevel]);

  // معالجات الأحداث
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    setVisibleOrders(6);
  }, []);

  const handleFilterChange = useCallback((filterType, value) => {
    switch (filterType) {
      case 'status':
        setStatusFilter(value);
        break;
      case 'date':
        setDateFilter(value);
        break;
      default:
        break;
    }
    setVisibleOrders(6);
  }, []);

  const handleClearAllOrders = useCallback(() => {
    setShowClearOrdersConfirm(true);
  }, []);

  const handleConfirmClearOrders = useCallback(() => {
    clearAllOrders();
    setShowClearOrdersConfirm(false);
    addNotification('success', 'تم مسح جميع الطلبات بنجاح');
  }, [clearAllOrders, addNotification]);

  const handleQuickView = useCallback((order) => {
    setQuickViewOrder(order);
  }, []);

  const handleDownloadInvoice = useCallback(async (order) => {
    await generateAndDownloadInvoice(order);
  }, [generateAndDownloadInvoice]);

  const handleLoadMore = useCallback(() => {
    setVisibleOrders(prev => prev + 6);
    addNotification('info', 'جاري تحميل المزيد من الطلبات...');
  }, [addNotification]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
    setVisibleOrders(6);
    addNotification('info', 'تم مسح جميع الفلاتر');
  }, [addNotification]);

  // مكون شارة الحالة المحسن
  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.unknown;
    const IconComponent = config.icon;
   
    return (
      <motion.span
        whileHover={{ scale: 1.05 }}
        className={`badge ${config.bgColor} text-white d-flex align-items-center shadow-sm`}
        style={{ 
          borderRadius: '20px',
          padding: '8px 12px',
          fontSize: '0.75rem',
          fontWeight: '600'
        }}
      >
        <IconComponent className="me-1" size={12} />
        {config.text}
      </motion.span>
    );
  };

  // مكون بطاقة الإحصائيات المحسن
  const StatCard = ({ icon: Icon, value, label, subtext, color, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="col-xl-3 col-md-6 col-6 mb-3"
    >
      <div className="card stat-card border-0 shadow-sm h-100">
        <div className="card-body p-4">
          <div className="d-flex align-items-center">
            <div className={`stat-icon me-3 bg-${color}`}>
              <Icon className="text-white" size={24} />
            </div>
            <div className="flex-grow-1">
              <h3 className="stat-value fw-bold mb-1 text-dark">{value}</h3>
              <p className="stat-label text-muted mb-1">{label}</p>
              {subtext && <small className="text-muted">{subtext}</small>}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // ✅ إصلاح: QuickViewModal كمكون منفصل
  const QuickViewModal = () => {
    const generateInvoiceContent = (order) => {
      const orderValues = calculateOrderValues(order);
      
      return `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <title>فاتورة ${order.id}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    line-height: 1.6; 
                    background: white;
                }
                .invoice-container { 
                    max-width: 800px; 
                    margin: 0 auto; 
                    padding: 20px; 
                    border: 1px solid #ddd; 
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 30px; 
                    border-bottom: 2px solid #007bff; 
                    padding-bottom: 20px; 
                }
                .company-name { 
                    font-size: 24px; 
                    font-weight: bold; 
                    color: #007bff; 
                }
                .order-info { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    gap: 20px; 
                    margin: 20px 0; 
                }
                .items-table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 20px 0; 
                }
                .items-table th, .items-table td { 
                    padding: 10px; 
                    border: 1px solid #ddd; 
                    text-align: right; 
                }
                .items-table th { 
                    background: #007bff; 
                    color: white; 
                }
                .summary { 
                    background: #f8f9fa; 
                    padding: 15px; 
                    border-radius: 5px; 
                }
                .summary-row { 
                    display: flex; 
                    justify-content: space-between; 
                    margin: 5px 0; 
                }
                .total-row { 
                    border-top: 2px solid #007bff; 
                    padding-top: 10px; 
                    font-weight: bold; 
                }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <div class="header">
                    <div class="company-name">متجرنا الإلكتروني</div>
                    <div>فاتورة مبيعات - ${order.id}</div>
                </div>
                
                <div class="order-info">
                    <div>
                        <h3>معلومات العميل</h3>
                        <div>عميل متجرنا</div>
                        <div>customer@example.com</div>
                    </div>
                    <div>
                        <h3>معلومات الطلب</h3>
                        <div>التاريخ: ${order.date ? new Date(order.date).toLocaleDateString('ar-SA') : "غير محدد"}</div>
                        <div>الحالة: ${getStatusText(order.status)}</div>
                    </div>
                </div>
                
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>المنتج</th>
                            <th>السعر</th>
                            <th>الكمية</th>
                            <th>المجموع</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items?.map(item => `
                            <tr>
                                <td>${item.name || item.title || "منتج غير معروف"}</td>
                                <td>$${(item.price || 0).toFixed(2)}</td>
                                <td>${item.quantity || 1}</td>
                                <td>$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="summary">
                    <div class="summary-row">
                        <span>المجموع الجزئي:</span>
                        <span>$${orderValues.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>الشحن:</span>
                        <span>$${orderValues.shipping.toFixed(2)}</span>
                    </div>
                    <div class="summary-row total-row">
                        <span>الإجمالي:</span>
                        <span>$${orderValues.total.toFixed(2)}</span>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px; color: #666;">
                    شكراً لشرائك من متجرنا
                </div>
            </div>
        </body>
        </html>
      `;
    };

    return (
      <AnimatePresence>
        {quickViewOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999 }}
            onClick={() => setQuickViewOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              className="modal-dialog modal-xl modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                <div className="modal-header bg-primary text-white border-0">
                  <div className="d-flex align-items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="bg-white bg-opacity-20 rounded-circle p-3 me-3"
                    >
                      <FaBox size={24} className="text-white" />
                    </motion.div>
                    <div>
                      <h5 className="modal-title mb-1 fw-bold">تفاصيل الطلب</h5>
                      <small className="opacity-90">{quickViewOrder.id}</small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white position-relative"
                    onClick={() => setQuickViewOrder(null)}
                    style={{ opacity: 0.8 }}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-light bg-opacity-50 border-0">
                          <h6 className="mb-0 fw-bold text-dark">
                            <FaReceipt className="me-2 text-primary" />
                            معلومات الطلب
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-6">
                              <small className="text-muted d-block">رقم الطلب</small>
                              <strong className="text-dark">{quickViewOrder.id}</strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">التاريخ</small>
                              <strong className="text-dark">
                                {quickViewOrder.date ? new Date(quickViewOrder.date).toLocaleDateString('ar-SA') : "غير محدد"}
                              </strong>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">الحالة</small>
                              <StatusBadge status={quickViewOrder.status} />
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">طريقة الدفع</small>
                              <strong className="text-info">{quickViewOrder.payment?.method || "غير محدد"}</strong>
                            </div>
                          </div>

                          <div className="border-top pt-3 mt-3">
                            <h6 className="fw-bold mb-3 text-dark">تفاصيل الفاتورة</h6>
                            {[
                              { label: "المنتجات", value: `$${calculateOrderValues(quickViewOrder).subtotal.toFixed(2)}` },
                              { label: "الشحن", value: `$${calculateOrderValues(quickViewOrder).shipping.toFixed(2)}` },
                            ].map((item, index) => (
                              <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted">{item.label}</span>
                                <strong>{item.value}</strong>
                              </div>
                            ))}
                            <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-2">
                              <span className="text-dark fw-bold">الإجمالي</span>
                              <strong className="text-primary fs-5">
                                ${calculateOrderValues(quickViewOrder).total.toFixed(2)}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-light bg-opacity-50 border-0">
                          <h6 className="mb-0 fw-bold text-dark">
                            <FaShoppingBag className="me-2 text-primary" />
                            المنتجات (${quickViewOrder.items?.length || 0})
                          </h6>
                        </div>
                        <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                          {quickViewOrder.items?.map((item, index) => (
                            <motion.div
                              key={item.id || index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom"
                            >
                              <div className="position-relative flex-shrink-0">
                                <img
                                  src={item.image || item.images?.[0] || "/assets/img/placeholder.jpg"}
                                  alt={item.name}
                                  className="rounded-3 shadow-sm"
                                  style={{ 
                                    width: '80px', 
                                    height: '80px', 
                                    objectFit: 'cover'
                                  }}
                                  onError={(e) => {
                                    e.target.src = "/assets/img/placeholder.jpg";
                                  }}
                                />
                                <span className="position-absolute top-0 start-0 badge bg-dark bg-opacity-75 m-1">
                                  {item.quantity}x
                                </span>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="fw-semibold mb-1 text-dark small">${item.name}</h6>
                                <div className="d-flex justify-content-between align-items-center">
                                  <small className="text-muted">$${(item.price || 0).toFixed(2)}</small>
                                  <strong className="text-primary">
                                    $${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                  </strong>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="d-flex gap-2 justify-content-center flex-wrap">
                        {/* أزرار الإجراءات الجديدة */}
                        {isOrderEligibleForTracking(quickViewOrder) && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-info px-4 rounded-pill"
                            onClick={() => handleTrackOrder(quickViewOrder)}
                          >
                            <FaMap className="me-2" />
                            تتبع الشحن
                          </motion.button>
                        )}

                        {isOrderEligibleForRating(quickViewOrder) && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-warning px-4 rounded-pill"
                            onClick={() => handleOpenRatingModal(quickViewOrder)}
                          >
                            <FaStar className="me-2" />
                            تقييم المنتجات
                          </motion.button>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn btn-success px-4 rounded-pill"
                          onClick={() => handleDownloadInvoice(quickViewOrder)}
                          disabled={generatingInvoice === quickViewOrder.id}
                        >
                          {generatingInvoice === quickViewOrder.id ? (
                            <>
                              <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">جاري التحميل...</span>
                              </div>
                              جاري التحميل...
                            </>
                          ) : (
                            <>
                              <FaDownload className="me-2" />
                              تحميل الفاتورة
                            </>
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn btn-primary px-4 rounded-pill"
                          onClick={async () => {
                            setGeneratingInvoice(quickViewOrder.id);
                            try {
                              await new Promise(resolve => setTimeout(resolve, 500));
                              const invoiceContent = generateInvoiceContent(quickViewOrder);
                              const printWindow = window.open('', '_blank');
                              printWindow.document.write(invoiceContent);
                              printWindow.document.close();
                              printWindow.print();
                              addNotification('info', 'تم فتح نافذة الطباعة');
                            } catch (error) {
                              addNotification('error', 'حدث خطأ أثناء الطباعة');
                            } finally {
                              setGeneratingInvoice(null);
                            }
                          }}
                          disabled={generatingInvoice === quickViewOrder.id}
                        >
                          <FaPrint className="me-2" />
                          طباعة الفاتورة
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn btn-outline-secondary px-4 rounded-pill"
                          onClick={() => setQuickViewOrder(null)}
                        >
                          إغلاق
                        </motion.button>
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
  };

  // ✅ مكون بطاقة الطلب المحسن - مع الميزات الجديدة
  const OrderCard = React.memo(({ order, index }) => {
    const config = statusConfig[order.status] || statusConfig.unknown;
    const items = order.items || [];
    const orderValues = calculateOrderValues(order);
    
    const canRate = isOrderEligibleForRating(order);
    const canTrack = isOrderEligibleForTracking(order);
   
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="col-12 mb-4"
      >
        <div className="card order-card border-0 shadow-lg h-100">
          <div className="card-header bg-white border-0 pb-0">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <div className="order-icon">
                      <FaBox className="text-primary fs-4" />
                    </div>
                  </div>
                  <div>
                    <h5 className="mb-1 fw-bold text-dark">{order.id || "طلب غير معروف"}</h5>
                    <small className="text-muted d-flex align-items-center">
                      <FaCalendarAlt className="me-1" size={12} />
                      {order.date ? new Date(order.date).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : "تاريخ غير معروف"}
                    </small>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-md-end">
                <div className="d-flex flex-column align-items-md-end">
                  <StatusBadge status={order.status} />
                  <div className="mt-2">
                    <strong className="text-primary fs-4">$${orderValues.total.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
         
          <div className="card-body">
            <div className="order-items mb-4">
              <h6 className="fw-bold mb-3 d-flex align-items-center text-dark">
                <FaShoppingBag className="me-2 text-primary" />
                المنتجات (${items.length})
              </h6>
             
              <div className="row g-3">
                {items.slice(0, 6).map((item, itemIndex) => (
                  <div key={item.id || itemIndex} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6">
                    <div className="product-item-card border-0 bg-white rounded-3 h-100 d-flex flex-column shadow-sm">
                      <div className="product-image-container position-relative overflow-hidden rounded-top">
                        <img
                          src={item.image || item.images?.[0] || "/assets/img/placeholder.jpg"}
                          alt={item.name}
                          className="product-image w-100"
                          style={{ height: '120px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = "/assets/img/placeholder.jpg";
                          }}
                        />
                        <span className="position-absolute top-0 start-0 badge bg-dark bg-opacity-75 m-2">
                          {item.quantity}x
                        </span>
                      </div>
                      <div className="product-info p-2 flex-grow-1 d-flex flex-column">
                        <h6 className="product-name fw-semibold mb-2 text-dark small">
                          {item.name || item.title || "منتج غير معروف"}
                        </h6>
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-bold text-primary small">
                              $${(item.price || 0).toFixed(2)}
                            </span>
                            <strong className="text-dark small">
                              $${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {items.length > 6 && (
                  <div className="col-12 text-center">
                    <span className="text-muted">+ {items.length - 6} منتجات إضافية</span>
                  </div>
                )}
              </div>
            </div>

            <div className="order-summary border-top pt-4">
              <div className="row g-3">
                <div className="col-lg-3 col-md-6 col-6">
                  <div className="summary-item text-center p-3 rounded-3 bg-light h-100">
                    <small className="text-muted d-block mb-2">حالة الطلب</small>
                    <StatusBadge status={order.status} />
                    <small className="text-muted mt-2 d-block">
                      {config.description}
                    </small>
                  </div>
                </div>
                
                <div className="col-lg-3 col-md-6 col-6">
                  <div className="summary-item text-center p-3 rounded-3 bg-light h-100">
                    <small className="text-muted d-block mb-2">القيمة الإجمالية</small>
                    <strong className="text-success fs-5 d-block">
                      $${orderValues.subtotal.toFixed(2)}
                    </strong>
                    <small className="text-muted">
                      {orderValues.itemsCount} منتج
                    </small>
                  </div>
                </div>
                
                <div className="col-lg-3 col-md-6 col-6">
                  <div className="summary-item text-center p-3 rounded-3 bg-light h-100">
                    <small className="text-muted d-block mb-2">الإجمالي النهائي</small>
                    <strong className="text-primary fs-5 d-block">
                      $${orderValues.total.toFixed(2)}
                    </strong>
                    <div className="d-flex justify-content-center gap-2 small mt-1">
                      <span className="text-muted">شحن</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-3 col-md-6 col-6">
                  <div className="summary-item text-center p-3 rounded-3 bg-light h-100">
                    <small className="text-muted d-block mb-2">معلومات الدفع</small>
                    <strong className="text-info d-block">
                      {order.payment?.method || "غير محدد"}
                    </strong>
                    <small className="text-muted">
                      {order.shipping?.method || "شحن قياسي"}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
         
          <div className="card-footer bg-white border-top-0 pt-0">
            <div className="d-flex gap-2 flex-wrap justify-content-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary btn-sm rounded-pill px-4"
                onClick={() => handleQuickView(order)}
              >
                <FaEye className="me-1" />
                عرض سريع
              </motion.button>
              
              {/* زر تتبع الشحن - يظهر فقط للطلبات المشحونة */}
              {canTrack && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-info btn-sm rounded-pill px-4"
                  onClick={() => handleTrackOrder(order)}
                >
                  <FaTruck className="me-1" />
                  تتبع الشحن
                </motion.button>
              )}

              {/* زر تقييم المنتجات - يظهر فقط للطلبات المسلمة */}
              {canRate && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-warning btn-sm rounded-pill px-4"
                  onClick={() => handleOpenRatingModal(order)}
                >
                  <FaStar className="me-1" />
                  تقييم المنتجات
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-success btn-sm rounded-pill px-4"
                onClick={() => handleDownloadInvoice(order)}
                disabled={generatingInvoice === order.id}
              >
                {generatingInvoice === order.id ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">جاري التحميل...</span>
                    </div>
                    جاري التحميل...
                  </>
                ) : (
                  <>
                    <FaDownload className="me-1" />
                    تحميل الفاتورة
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  });

  // نموذج تأكيد الحذف المحسن
  const ClearOrdersConfirmationModal = () => (
    <AnimatePresence>
      {showClearOrdersConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999 }}
          onClick={() => setShowClearOrdersConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
              <div className="modal-header bg-danger text-white border-0">
                <div className="d-flex align-items-center">
                  <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                    <FaExclamationTriangle size={20} className="text-white" />
                  </div>
                  <div>
                    <h5 className="modal-title mb-0 fw-bold">تأكيد الحذف</h5>
                  </div>
                </div>
              </div>

              <div className="modal-body py-4 text-center">
                <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                  <FaTrash className="text-danger" size={32} />
                </div>
                <h4 className="fw-bold text-dark mb-3">حذف جميع الطلبات</h4>
                
                <div className="alert alert-warning border-0 mb-4">
                  <div className="d-flex">
                    <FaExclamationTriangle className="text-warning me-2 mt-1" />
                    <div>
                      <strong>تنبيه مهم:</strong>
                      <p className="mb-0 small">هذا الإجراء سيحذف جميع الطلبات ولا يمكن التراجع عنه</p>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="border rounded p-3 bg-light">
                      <div className="fw-bold text-danger fs-4">{orders?.length || 0}</div>
                      <small className="text-muted">عدد الطلبات</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="border rounded p-3 bg-light">
                      <div className="fw-bold text-primary fs-4">
                        {orders?.reduce((total, order) => total + (order.items?.length || order.products?.length || 0), 0)}
                      </div>
                      <small className="text-muted">إجمالي المنتجات</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-0 bg-light">
                <div className="d-flex gap-2 w-100">
                  <button
                    className="btn btn-outline-secondary flex-fill rounded-pill"
                    onClick={() => setShowClearOrdersConfirm(false)}
                  >
                    إلغاء
                  </button>
                  <button
                    className="btn btn-danger flex-fill rounded-pill"
                    onClick={handleConfirmClearOrders}
                  >
                    نعم، احذف الكل
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // شاشة التحميل المحسنة
  if (isLoading || !isInitialized) {
    return (
      <div className="container-fluid py-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '50vh' }}
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="spinner-border text-primary mb-3"
              style={{ width: '3rem', height: '3rem' }}
            />
            <h5 className="text-muted mb-2">جاري تحميل طلباتك...</h5>
            <p className="text-muted small">نستعد لعرض جميع طلباتك</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const ordersToShow = filteredOrders.slice(0, visibleOrders);
  const hasMoreOrders = visibleOrders < filteredOrders.length;

  return (
    <div className="container-fluid py-4 orders-page">
      {/* ✅ عرض الإشعارات */}
      <AnimatePresence>
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>

      {/* ✅ نافذة تتبع الشحن */}
      {trackingModalOpen && (
        <TrackingModal 
          order={selectedOrderForTracking} 
          onClose={() => {
            setTrackingModalOpen(false);
            setSelectedOrderForTracking(null);
          }} 
        />
      )}

      {/* ✅ نافذة تقييم المنتجات */}
      {ratingModalOpen && (
        <RatingModal 
          order={selectedOrderForRating} 
          onClose={() => {
            setRatingModalOpen(false);
            setSelectedOrderForRating(null);
          }}
          onRatingSubmit={handleProductRating}
        />
      )}

      <div className="row">
        <div className="col-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex justify-content-between align-items-center mb-4"
          >
            <div>
              <h1 className="h2 fw-bold mb-2 gradient-text">طلباتي</h1>
              <p className="text-muted mb-0">
                تابع وأدر جميع طلباتك في مكان واحد
              </p>
              {/* ✅ عرض مستوى العضوية */}
              <div className="mt-2">
                <span className={`badge bg-${premiumLevel.color} text-dark`}>
                  مستوى العضوية: {premiumLevel.level} ({premiumLevel.discount}% خصم)
                </span>
              </div>
            </div>
            <div className="d-flex gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/products" className="btn btn-primary rounded-pill px-4">
                  <FaShoppingBag className="me-2" />
                  متابعة التسوق
                </Link>
              </motion.div>
              {process.env.NODE_ENV === 'development' && orders.length > 0 && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    className="btn btn-outline-danger rounded-pill px-4"
                    onClick={handleClearAllOrders}
                  >
                    <FaTrash className="me-2" />
                    مسح الكل
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="row g-3 mb-4"
          >
            <StatCard
              icon={FaShoppingBag}
              value={orderStats.total}
              label="إجمالي الطلبات"
              subtext={`$${orderStats.averageOrderValue.toFixed(2)} متوسط`}
              color="primary"
              delay={0}
            />
            <StatCard
              icon={FaCheckCircle}
              value={orderStats.delivered}
              label="تم التوصيل"
              subtext={`${orderStats.deliverySuccessRate.toFixed(1)}% نجاح`}
              color="success"
              delay={0.1}
            />
            <StatCard
              icon={FaClock}
              value={orderStats.statusBreakdown.processing || 0}
              label="قيد المعالجة"
              subtext="طلبات نشطة"
              color="warning"
              delay={0.2}
            />
            <StatCard
              icon={FaCreditCard}
              value={`$${orderStats.totalSpent.toFixed(2)}`}
              label="إجمالي الإنفاق"
              subtext="القيمة الإجمالية"
              color="info"
              delay={0.3}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card border-0 shadow-sm mb-4"
          >
            <div className="card-body p-4">
              <div className="row g-3 align-items-end">
                <div className="col-md-5">
                  <label className="form-label fw-semibold text-dark mb-2">بحث في الطلبات</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <FaSearch className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 rounded-end"
                      placeholder="ابحث في الطلبات أو المنتجات..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold text-dark mb-2">حالة الطلب</label>
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="processing">قيد المعالجة</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="delivered">تم التوصيل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold text-dark mb-2">الفترة الزمنية</label>
                  <select
                    className="form-select"
                    value={dateFilter}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  >
                    <option value="all">كل الوقت</option>
                    <option value="last30">آخر 30 يوم</option>
                    <option value="last90">آخر 90 يوم</option>
                  </select>
                </div>
                <div className="col-md-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-outline-danger w-100"
                    onClick={clearFilters}
                    disabled={activeFilterCount === 0}
                  >
                    <FaTimes />
                  </motion.button>
                </div>
              </div>
             
              {activeFilterCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-top"
                >
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <small className="text-muted fw-semibold">الفلاتر النشطة:</small>
                    {searchTerm && (
                      <span className="badge bg-primary text-white">
                        بحث: {searchTerm}
                        <button
                          className="btn-close btn-close-white ms-1"
                          onClick={() => setSearchTerm("")}
                          style={{ fontSize: '0.6rem' }}
                        />
                      </span>
                    )}
                    {statusFilter !== 'all' && (
                      <span className="badge bg-secondary text-white">
                        الحالة: {statusFilter}
                        <button
                          className="btn-close btn-close-white ms-1"
                          onClick={() => setStatusFilter("all")}
                          style={{ fontSize: '0.6rem' }}
                        />
                      </span>
                    )}
                    {dateFilter !== 'all' && (
                      <span className="badge bg-info text-white">
                        التاريخ: {dateFilter === 'last30' ? 'آخر 30 يوم' : 'آخر 90 يوم'}
                        <button
                          className="btn-close btn-close-white ms-1"
                          onClick={() => setDateFilter("all")}
                          style={{ fontSize: '0.6rem' }}
                        />
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-5"
            >
              <div className="empty-state-icon mb-4">
                <FaBox className="text-muted" size={80} />
              </div>
              <h4 className="text-muted mb-3">لا توجد طلبات</h4>
              <p className="text-muted mb-4">
                {activeFilterCount > 0
                  ? "لم نعثر على طلبات تطابق معايير البحث الخاصة بك"
                  : "لم تقم بأي طلبات بعد. ابدأ رحلتك في التسوق الآن!"}
              </p>
              <Link to="/products" className="btn btn-primary btn-lg rounded-pill px-5">
                ابدأ التسوق الآن
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="row">
                {ordersToShow.map((order, index) => (
                  <OrderCard key={order.id} order={order} index={index} />
                ))}
              </div>
              
              {hasMoreOrders && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-5"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary btn-lg rounded-pill px-5"
                    onClick={handleLoadMore}
                  >
                    <FaSync className="me-2" />
                    تحميل المزيد ({filteredOrders.length - visibleOrders} متبقي)
                  </motion.button>
                </motion.div>
              )}

              {/* ✅ قسم المنتجات الموصى بها */}
              <RecommendedProductsSection
                products={recommendedProducts}
                onAddToCart={handleAddToCart}
                onProductView={handleProductView}
                onToggleWishlist={toggleWishlist}
                isInWishlist={isInWishlist}
              />
            </>
          )}
        </div>
      </div>

      <QuickViewModal />
      <ClearOrdersConfirmationModal />

      <style>{`
        .orders-page {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          min-height: 100vh;
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .order-card {
          transition: all 0.3s ease;
          border-radius: 20px;
          overflow: hidden;
          border: none;
        }

        .order-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
        }

        .order-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .product-item-card {
          transition: all 0.3s ease;
          overflow: hidden;
          border: none !important;
        }

        .product-item-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }

        .product-image-container {
          height: 120px;
          overflow: hidden;
          position: relative;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-item-card:hover .product-image {
          transform: scale(1.1);
        }

        .product-name {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.9rem;
          line-height: 1.4;
          min-height: 2.8em;
        }

        .stat-card {
          transition: all 0.3s ease;
          border-radius: 16px;
          border: none;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-value {
          color: #2c3e50;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .stat-label {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .summary-item {
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .summary-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .badge {
          border-radius: 20px;
          font-size: 0.75rem;
          padding: 0.5em 1em;
          font-weight: 600;
        }

        .btn {
          border-radius: 12px;
          transition: all 0.3s ease;
          font-weight: 500;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a42a8 100%);
          transform: translateY(-2px);
        }

        .empty-state-icon {
          opacity: 0.3;
        }

        /* تتبع الشحن */
        .tracking-steps .step {
          text-align: center;
          flex: 1;
        }

        .step-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .step.completed .step-icon {
          background: #28a745 !important;
        }

        .step.active .step-icon {
          background: #007bff !important;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        @media (max-width: 768px) {
          .stat-value {
            font-size: 1.5rem;
          }
         
          .stat-icon {
            width: 40px;
            height: 40px;
          }

          .product-image-container {
            height: 100px;
          }

          .order-card {
            margin-bottom: 1.5rem;
          }

          .summary-item {
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 576px) {
          .stat-value {
            font-size: 1.25rem;
          }

          .product-image-container {
            height: 80px;
          }

          .col-6 {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default React.memo(OrdersPage);