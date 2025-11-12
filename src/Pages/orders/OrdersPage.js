import React, { useState, useMemo, useCallback, useEffect, lazy, Suspense } from "react";
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

// ✅ تحسين: تحميل المكونات الكبيرة بشكل كسول
const TrackingModal = lazy(() => import('./TrackingModal'));
const RatingModal = lazy(() => import('./RatingModal'));
const QuickViewModal = lazy(() => import('./QuickViewModal'));
const RecommendedProductsSection = lazy(() => import('./RecommendedProductsSection'));

// ✅ مكون الإشعارات المحسن
const Notification = React.memo(({ type, message, onClose, duration = 4000 }) => {
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
  }[type] || {
    icon: FaInfoCircle,
    bgColor: 'bg-info',
    textColor: 'text-white',
    borderColor: 'border-info'
  };

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
});

// ✅ نقل تعريف المكونات المساعدة قبل استخدامها
const StatusBadge = React.memo(({ status, statusConfig }) => {
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
});

// ✅ مكون بطاقة الإحصائيات المحسن
const StatCard = React.memo(({ icon: Icon, value, label, subtext, color, delay = 0 }) => (
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
));

// ✅ مكون بطاقة الطلب المحسن مع React.memo
const OrderCard = React.memo(({ 
  order, 
  index, 
  statusConfig, 
  calculateOrderValues, 
  isOrderEligibleForRating, 
  isOrderEligibleForTracking,
  handleQuickView,
  handleTrackOrder,
  handleOpenRatingModal,
  handleDownloadInvoice,
  generatingInvoice
}) => {
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
                <StatusBadge status={order.status} statusConfig={statusConfig} />
                <div className="mt-2">
                  <strong className="text-primary fs-4">$${orderValues.total.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
       
        <div className="card-body">
          {/* ✅ تبسيط عرض المنتجات */}
          <div className="order-items mb-4">
            <h6 className="fw-bold mb-3 d-flex align-items-center text-dark">
              <FaShoppingBag className="me-2 text-primary" />
              المنتجات ({items.length})
            </h6>
           
            <div className="row g-2">
              {items.slice(0, 4).map((item, itemIndex) => (
                <div key={item.id || itemIndex} className="col-lg-3 col-md-4 col-sm-6 col-6">
                  <div className="product-item-card border-0 bg-white rounded-3 h-100 d-flex flex-column shadow-sm p-2">
                    <div className="product-image-container position-relative overflow-hidden rounded-top">
                      <img
                        src={item.image || item.images?.[0] || "/assets/img/placeholder.jpg"}
                        alt={item.name}
                        className="product-image w-100"
                        style={{ height: '80px', objectFit: 'cover' }}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/assets/img/placeholder.jpg";
                        }}
                      />
                      <span className="position-absolute top-0 start-0 badge bg-dark bg-opacity-75 m-1 small">
                        {item.quantity}x
                      </span>
                    </div>
                    <div className="product-info flex-grow-1 d-flex flex-column mt-2">
                      <h6 className="product-name fw-semibold mb-1 text-dark small text-truncate">
                        {item.name || item.title || "منتج غير معروف"}
                      </h6>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-primary small">
                            $${(item.price || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {items.length > 4 && (
                <div className="col-12 text-center mt-2">
                  <span className="text-muted small">+ {items.length - 4} منتجات إضافية</span>
                </div>
              )}
            </div>
          </div>

          {/* ✅ تبسيط ملخص الطلب */}
          <div className="order-summary border-top pt-3">
            <div className="row g-2">
              <div className="col-lg-3 col-md-6 col-6">
                <div className="summary-item text-center p-2 rounded-3 bg-light h-100">
                  <small className="text-muted d-block mb-1">حالة الطلب</small>
                  <StatusBadge status={order.status} statusConfig={statusConfig} />
                </div>
              </div>
             
              <div className="col-lg-3 col-md-6 col-6">
                <div className="summary-item text-center p-2 rounded-3 bg-light h-100">
                  <small className="text-muted d-block mb-1">القيمة الإجمالية</small>
                  <strong className="text-success fs-6 d-block">
                    $${orderValues.subtotal.toFixed(2)}
                  </strong>
                </div>
              </div>
             
              <div className="col-lg-3 col-md-6 col-6">
                <div className="summary-item text-center p-2 rounded-3 bg-light h-100">
                  <small className="text-muted d-block mb-1">الإجمالي النهائي</small>
                  <strong className="text-primary fs-6 d-block">
                    $${orderValues.total.toFixed(2)}
                  </strong>
                </div>
              </div>
             
              <div className="col-lg-3 col-md-6 col-6">
                <div className="summary-item text-center p-2 rounded-3 bg-light h-100">
                  <small className="text-muted d-block mb-1">طريقة الدفع</small>
                  <strong className="text-info d-block small">
                    {order.payment?.method || "غير محدد"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
       
        <div className="card-footer bg-white border-top-0 pt-0">
          <div className="d-flex gap-2 flex-wrap justify-content-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary btn-sm rounded-pill px-3"
              onClick={() => handleQuickView(order)}
            >
              <FaEye className="me-1" />
              عرض سريع
            </motion.button>
           
            {canTrack && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-info btn-sm rounded-pill px-3"
                onClick={() => handleTrackOrder(order)}
              >
                <FaTruck className="me-1" />
                تتبع الشحن
              </motion.button>
            )}

            {canRate && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-warning btn-sm rounded-pill px-3"
                onClick={() => handleOpenRatingModal(order)}
              >
                <FaStar className="me-1" />
                تقييم
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-success btn-sm rounded-pill px-3"
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
                  فاتورة
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// ✅ نموذج تأكيد الحذف المحسن
const ClearOrdersConfirmationModal = React.memo(({ showClearOrdersConfirm, setShowClearOrdersConfirm, handleConfirmClearOrders }) => (
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
              <h5 className="modal-title mb-0 fw-bold">تأكيد الحذف</h5>
            </div>
            <div className="modal-body py-4 text-center">
              <h4 className="fw-bold text-dark mb-3">حذف جميع الطلبات</h4>
              <p className="text-muted mb-4">هل أنت متأكد من رغبتك في حذف جميع الطلبات؟ لا يمكن التراجع عن هذا الإجراء.</p>
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
));

function OrdersPage() {
  const { orders, isLoading, isInitialized, clearAllOrders } = useOrders();
  const navigate = useNavigate();
 
  // State management محسنة
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
 
  // ✅ تحسين: State للنوافذ مع تهيئة افتراضية
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedOrderForRating, setSelectedOrderForRating] = useState(null);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);

  // ✅ تحسين: استخدام useCallback مع dependencies محددة
  const addNotification = useCallback((type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // ✅ تحسين: تبسيط دوال التحقق من الحالة
  const isOrderEligibleForRating = useCallback((order) => {
    return order.status === 'delivered';
  }, []);

  const isOrderEligibleForTracking = useCallback((order) => {
    return ['shipped', 'out_for_delivery', 'delivered'].includes(order.status);
  }, []);

  // ✅ تحسين: تبسيط دوال فتح النوافذ
  const handleOpenRatingModal = useCallback((order) => {
    setSelectedOrderForRating(order);
    setRatingModalOpen(true);
  }, []);

  const handleOpenTrackingModal = useCallback((order) => {
    setSelectedOrderForTracking(order);
    setTrackingModalOpen(true);
    addNotification('info', `جاري تتبع طلبك ${order.id}`);
  }, [addNotification]);

  // ✅ تحسين: معالجة التقييم مع تحسين الأداء
  const handleProductRating = useCallback((ratingData) => {
    console.log('تقييم الطلب:', ratingData);
    addNotification('success', 'شكراً لتقييمك! تم حفظ التقييم بنجاح');
    setRatingModalOpen(false);
    setSelectedOrderForRating(null);
  }, [addNotification]);

  // ✅ تحسين: دوال المفضلة مع تحسين الأداء
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

  // ✅ تحسين: دالة تتبع الطلب
  const handleTrackOrder = useCallback((order) => {
    handleOpenTrackingModal(order);
  }, [handleOpenTrackingModal]);

  // ✅ تحسين: دالة الحصول على مستوى العضوية
  const getPremiumLevel = useCallback((totalSpent) => {
    if (totalSpent >= 1000) return { level: "مميز", color: "warning", discount: 15 };
    if (totalSpent >= 500) return { level: "فضي", color: "secondary", discount: 10 };
    if (totalSpent >= 200) return { level: "برونزي", color: "danger", discount: 5 };
    return { level: "عادي", color: "light", discount: 0 };
  }, []);

  // ✅ تحسين: بيانات المنتجات الموصى بها مع useMemo
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

  // ✅ تحسين: دوال المنتجات الموصى بها
  const handleAddToCart = useCallback((product) => {
    addNotification('success', `تم إضافة ${product.name} إلى سلة التسوق`);
  }, [addNotification]);

  const handleProductView = useCallback((product) => {
    navigate(`/singleproduct/${product.id}`);
  }, [navigate]);

  // ✅ تحسين: حساب عدد الفلاتر النشطة مع تحسين الأداء
  useEffect(() => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== 'all') count++;
    if (dateFilter !== 'all') count++;
    setActiveFilterCount(count);
  }, [searchTerm, statusFilter, dateFilter]);

  // ✅ تحسين: دالة مساعدة للحصول على نص الحالة
  const getStatusText = useCallback((status) => {
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
  }, []);

  // ✅ تحسين كبير: تبسيط دوال حساب القيم
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

  // ✅ تحسين كبير: تبسيط دالة إنشاء الفاتورة
  const generateAndDownloadInvoice = useCallback(async (order) => {
    setGeneratingInvoice(order.id);
   
    try {
      // محاكاة تأخير قصير
      await new Promise(resolve => setTimeout(resolve, 800));
     
      const orderValues = calculateOrderValues(order);
     
      const invoiceContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <title>فاتورة ${order.id}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .invoice-container { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007bff; padding-bottom: 20px; }
                .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .items-table th, .items-table td { padding: 10px; border: 1px solid #ddd; text-align: right; }
                .summary { background: #f8f9fa; padding: 15px; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <div class="header">
                    <div>فاتورة مبيعات - ${order.id}</div>
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
                    <div>المجموع الجزئي: $${orderValues.subtotal.toFixed(2)}</div>
                    <div>الشحن: $${orderValues.shipping.toFixed(2)}</div>
                    <div><strong>الإجمالي: $${orderValues.total.toFixed(2)}</strong></div>
                </div>
            </div>
        </body>
        </html>
      `;

      // ✅ تحسين: التحميل المباشر كملف HTML
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
  }, [addNotification, calculateOrderValues]);

  // ✅ تحسين كبير: تبسيط الفلترة مع تقليل العمليات الحسابية
  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
   
    const now = Date.now();
    const last30Days = now - (30 * 24 * 60 * 60 * 1000);
    const last90Days = now - (90 * 24 * 60 * 60 * 1000);
   
    return orders
      .filter(order => {
        if (!order || typeof order !== 'object') return false;
       
        const matchesSearch = searchTerm ?
          (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.items && Array.isArray(order.items) && order.items.some(item =>
            item && item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )) : true;
       
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
       
        const orderDate = order.date ? new Date(order.date).getTime() : now;
        const matchesDate = dateFilter === "all" ||
                           (dateFilter === "last30" && orderDate >= last30Days) ||
                           (dateFilter === "last90" && orderDate >= last90Days);
       
        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  // ✅ تحسين: تبسيط الإحصائيات
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
   
    const totalSpent = validOrders.reduce((sum, order) => sum + (order.total || 0), 0);
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

  // ✅ تحسين: تكوين الحالة مع قيم افتراضية
  const statusConfig = useMemo(() => ({
    delivered: {
      icon: FaCheckCircle,
      color: "success",
      bgColor: "bg-success",
      text: "تم التوصيل",
      description: "تم توصيل طلبك"
    },
    shipped: {
      icon: FaTruck,
      color: "primary",
      bgColor: "bg-primary",
      text: "تم الشحن",
      description: "طلبك في الطريق"
    },
    processing: {
      icon: FaClock,
      color: "warning",
      bgColor: "bg-warning",
      text: "قيد المعالجة",
      description: "نحن نجهز طلبك"
    },
    cancelled: {
      icon: FaTimesCircle,
      color: "danger",
      bgColor: "bg-danger",
      text: "ملغي",
      description: "تم إلغاء هذا الطلب"
    },
    unknown: {
      icon: FaExclamationCircle,
      color: "secondary",
      bgColor: "bg-secondary",
      text: "غير معروف",
      description: "حالة غير معروفة"
    }
  }), []);

  // ✅ الحصول على مستوى العضوية للإحصائيات
  const premiumLevel = useMemo(() => {
    return getPremiumLevel(orderStats.totalSpent);
  }, [orderStats.totalSpent, getPremiumLevel]);

  // ✅ تحسين: تبسيط معالجات الأحداث
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

  // ✅ تحسين: شاشة التحميل المحسنة
  if (isLoading || !isInitialized) {
    return (
      <div className="container-fluid py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
            <h5 className="text-muted mb-2">جاري تحميل طلباتك...</h5>
          </div>
        </div>
      </div>
    );
  }

  const ordersToShow = filteredOrders.slice(0, visibleOrders);
  const hasMoreOrders = visibleOrders < filteredOrders.length;

  return (
    <div className="container-fluid py-4 orders-page">
      {/* ✅ تحسين: عرض الإشعارات */}
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

      {/* ✅ تحسين: تحميل المكونات الكبيرة بشكل كسول */}
      <Suspense fallback={<div className="loading-placeholder" />}>
        {trackingModalOpen && (
          <TrackingModal
            order={selectedOrderForTracking}
            onClose={() => {
              setTrackingModalOpen(false);
              setSelectedOrderForTracking(null);
            }}
          />
        )}

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

        {quickViewOrder && (
          <QuickViewModal
            order={quickViewOrder}
            onClose={() => setQuickViewOrder(null)}
            onTrackOrder={handleTrackOrder}
            onOpenRatingModal={handleOpenRatingModal}
            onDownloadInvoice={handleDownloadInvoice}
            generatingInvoice={generatingInvoice}
            addNotification={addNotification}
          />
        )}
      </Suspense>

      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 fw-bold mb-2 gradient-text">طلباتي</h1>
              <p className="text-muted mb-0">تابع وأدر جميع طلباتك في مكان واحد</p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/products" className="btn btn-primary rounded-pill px-4">
                <FaShoppingBag className="me-2" />
                متابعة التسوق
              </Link>
              {process.env.NODE_ENV === 'development' && orders.length > 0 && (
                <button
                  className="btn btn-outline-danger rounded-pill px-4"
                  onClick={handleClearAllOrders}
                >
                  <FaTrash className="me-2" />
                  مسح الكل
                </button>
              )}
            </div>
          </div>

          {/* ✅ تحسين: إحصائيات مبسطة */}
          <div className="row g-3 mb-4">
            <StatCard
              icon={FaShoppingBag}
              value={orderStats.total}
              label="إجمالي الطلبات"
              subtext={`$${orderStats.averageOrderValue.toFixed(2)} متوسط`}
              color="primary"
            />
            <StatCard
              icon={FaCheckCircle}
              value={orderStats.delivered}
              label="تم التوصيل"
              subtext={`${orderStats.deliverySuccessRate.toFixed(1)}% نجاح`}
              color="success"
            />
            <StatCard
              icon={FaClock}
              value={orderStats.statusBreakdown.processing || 0}
              label="قيد المعالجة"
              subtext="طلبات نشطة"
              color="warning"
            />
            <StatCard
              icon={FaCreditCard}
              value={`$${orderStats.totalSpent.toFixed(2)}`}
              label="إجمالي الإنفاق"
              subtext="القيمة الإجمالية"
              color="info"
            />
          </div>

          {/* ✅ تحسين: فلترة مبسطة */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-3">
              <div className="row g-2 align-items-center">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ابحث في الطلبات..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="processing">قيد المعالجة</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="delivered">تم التوصيل</option>
                  </select>
                </div>
                <div className="col-md-3">
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
                <div className="col-md-2">
                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={clearFilters}
                    disabled={activeFilterCount === 0}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-5">
              <FaBox className="text-muted mb-3" size={60} />
              <h4 className="text-muted mb-3">لا توجد طلبات</h4>
              <Link to="/products" className="btn btn-primary btn-lg rounded-pill px-5">
                ابدأ التسوق الآن
              </Link>
            </div>
          ) : (
            <>
              <div className="row">
                {ordersToShow.map((order, index) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    index={index}
                    statusConfig={statusConfig}
                    calculateOrderValues={calculateOrderValues}
                    isOrderEligibleForRating={isOrderEligibleForRating}
                    isOrderEligibleForTracking={isOrderEligibleForTracking}
                    handleQuickView={handleQuickView}
                    handleTrackOrder={handleTrackOrder}
                    handleOpenRatingModal={handleOpenRatingModal}
                    handleDownloadInvoice={handleDownloadInvoice}
                    generatingInvoice={generatingInvoice}
                  />
                ))}
              </div>
             
              {hasMoreOrders && (
                <div className="text-center mt-4">
                  <button onClick={handleLoadMore} className="btn btn-primary btn-lg rounded-pill px-5">
                    <FaSync className="me-2" />
                    تحميل المزيد ({filteredOrders.length - visibleOrders} متبقي)
                  </button>
                </div>
              )}

              {/* ✅ تحسين: تحميل القسم بشكل كسول */}
              <Suspense fallback={<div className="loading-placeholder" />}>
                <RecommendedProductsSection
                  products={recommendedProducts}
                  onAddToCart={handleAddToCart}
                  onProductView={handleProductView}
                  onToggleWishlist={toggleWishlist}
                  isInWishlist={isInWishlist}
                />
              </Suspense>
            </>
          )}
        </div>
      </div>

      <ClearOrdersConfirmationModal 
        showClearOrdersConfirm={showClearOrdersConfirm}
        setShowClearOrdersConfirm={setShowClearOrdersConfirm}
        handleConfirmClearOrders={handleConfirmClearOrders}
      />

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
          border-radius: 15px;
          overflow: hidden;
        }

        .order-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }

        .product-item-card {
          transition: all 0.3s ease;
        }

        .product-item-card:hover {
          transform: translateY(-2px);
        }

        .loading-placeholder {
          height: 100px;
          background: #f8f9fa;
          border-radius: 10px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.8; }
          100% { opacity: 0.6; }
        }

        @media (max-width: 768px) {
          .order-card {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default React.memo(OrdersPage);