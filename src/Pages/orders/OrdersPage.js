import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
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
  FaShoppingCart,
  FaHeart,
  FaMapMarkerAlt,
  FaPhone,
  FaTimes,
  FaReceipt,
  FaMoneyBillWave,
  FaTag
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders } from '../../context/OrdersContext';

function OrdersPage() {
  const { orders, isLoading, isInitialized, clearAllOrders } = useOrders();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [visibleOrders, setVisibleOrders] = useState(6);
  const [quickViewOrder, setQuickViewOrder] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);

  // دوال حساب القيم
  const calculateOrderValues = useCallback((order) => {
    const items = order.items || [];
    
    // حساب إجمالي المنتجات
    const itemsTotal = items.reduce((sum, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
    
    // تكلفة الشحن
    const shippingCost = order.shipping?.cost || 0;
    
    // السعر الإجمالي (من البيانات المخزنة أو المحسوب)
    const totalAmount = order.total || (itemsTotal + shippingCost);
    
    // الضرائب (افتراضي 15%)
    const taxAmount = itemsTotal * 0.15;
    
    // القيمة قبل الضريبة
    const subtotal = itemsTotal;
    
    return {
      subtotal: subtotal,
      shipping: shippingCost,
      tax: taxAmount,
      total: totalAmount,
      itemsCount: items.reduce((sum, item) => sum + (item.quantity || 1), 0)
    };
  }, []);

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

    // ترتيب حسب التاريخ (الأحدث أولاً)
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
    
    const totalSpent = validOrders.reduce((sum, order) => {
      const orderTotal = typeof order.total === 'number' ? order.total : 0;
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
  };

  // تحسين معالجات الأحداث
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

  const handleOrderSelect = useCallback((order) => {
    setSelectedOrder(order);
  }, []);

  const handleDownloadInvoice = useCallback((order) => {
    alert(`جاري تحميل الفاتورة للطلب ${order.id}`);
  }, []);

  const handleLoadMore = useCallback(() => {
    setVisibleOrders(prev => prev + 6);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
    setVisibleOrders(6);
  }, []);

  const handleClearAllOrders = useCallback(() => {
    if (window.confirm('هل أنت متأكد من حذف جميع الطلبات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      clearAllOrders();
    }
  }, [clearAllOrders]);

  const handleQuickView = useCallback((order) => {
    setQuickViewOrder(order);
  }, []);

  const handleWishlistToggle = useCallback((itemId) => {
    setWishlistItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  // تحسين مكون شارة الحالة
  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.unknown;
    const IconComponent = config.icon;
   
    return (
      <span className={`badge ${config.bgColor} text-white d-flex align-items-center`}>
        <IconComponent className="me-1" size={12} />
        {config.text}
      </span>
    );
  };

  // مكون Quick View Modal مستوحى من صفحة المنتجات
  const QuickViewModal = useCallback(() => (
    <AnimatePresence>
      {quickViewOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}
          onClick={() => setQuickViewOrder(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="modal-dialog modal-xl modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <FaBox className="me-2" />
                  تفاصيل الطلب: {quickViewOrder.id}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setQuickViewOrder(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row">
                  {/* معلومات الطلب المحسنة */}
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 fw-bold">معلومات الطلب</h6>
                      </div>
                      <div className="card-body">
                        {/* المعلومات الأساسية */}
                        <div className="row mb-3">
                          <div className="col-6">
                            <small className="text-muted d-block">رقم الطلب</small>
                            <strong>{quickViewOrder.id}</strong>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">التاريخ</small>
                            <strong>
                              {quickViewOrder.date ? new Date(quickViewOrder.date).toLocaleDateString('ar-SA') : "غير محدد"}
                            </strong>
                          </div>
                        </div>
                        
                        {/* الخانات الأربعة */}
                        {/* <div className="row mb-4">
                          <div className="col-6 mb-3">
                            <small className="text-muted d-block mb-1">الحالة</small>
                            <StatusBadge status={quickViewOrder.status} />
                          </div>
                          <div className="col-6 mb-3">
                            <small className="text-muted d-block mb-1">القيمة الإجمالية</small>
                            <strong className="text-success">${calculateOrderValues(quickViewOrder).subtotal.toFixed(2)}</strong>
                          </div>
                          <div className="col-6 mb-3">
                            <small className="text-muted d-block mb-1">الإجمالي النهائي</small>
                            <strong className="text-primary fs-5">${calculateOrderValues(quickViewOrder).total.toFixed(2)}</strong>
                          </div>
                          <div className="col-6 mb-3">
                            <small className="text-muted d-block mb-1">طريقة الدفع</small>
                            <strong className="text-info">{quickViewOrder.payment?.method || "غير محدد"}</strong>
                          </div>
                        </div> */}
                        
                        {/* تفاصيل الأسعار */}
                        <div className="border-top pt-3">
                          <h6 className="fw-bold mb-2">تفاصيل الفاتورة</h6>
                          <div className="row small">
                            <div className="col-6">
                              <span className="text-muted">المنتجات:</span>
                            </div>
                            <div className="col-6 text-end">
                              <strong>${calculateOrderValues(quickViewOrder).subtotal.toFixed(2)}</strong>
                            </div>
                          </div>
                          <div className="row small">
                            <div className="col-6">
                              <span className="text-muted">الشحن:</span>
                            </div>
                            <div className="col-6 text-end">
                              <strong>${calculateOrderValues(quickViewOrder).shipping.toFixed(2)}</strong>
                            </div>
                          </div>
                          <div className="row small">
                            <div className="col-6">
                              <span className="text-muted">الضريبة (15%):</span>
                            </div>
                            <div className="col-6 text-end">
                              <strong>${calculateOrderValues(quickViewOrder).tax.toFixed(2)}</strong>
                            </div>
                          </div>
                          <div className="row small mt-2 border-top pt-2">
                            <div className="col-6">
                              <span className="text-muted fw-bold">الإجمالي:</span>
                            </div>
                            <div className="col-6 text-end">
                              <strong className="text-primary fs-5">${calculateOrderValues(quickViewOrder).total.toFixed(2)}</strong>
                            </div>
                          </div>
                        </div>
                        
                        {/* معلومات الشحن */}
                        {quickViewOrder.shipping && (
                          <div className="border-top pt-3 mt-3">
                            <h6 className="fw-bold mb-2">
                              <FaTruck className="me-2 text-muted" />
                              معلومات الشحن
                            </h6>
                            <p className="text-muted small mb-1">
                              <strong>الطريقة:</strong> {quickViewOrder.shipping.method}
                            </p>
                            <p className="text-muted small mb-1">
                              <strong>التكلفة:</strong> ${quickViewOrder.shipping.cost?.toFixed(2)}
                            </p>
                            {quickViewOrder.shipping.estimatedDelivery && (
                              <p className="text-muted small mb-0">
                                <strong>موعد التوصيل:</strong> {quickViewOrder.shipping.estimatedDelivery}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* المنتجات */}
                  <div className="col-md-6">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-header bg-light">
                        <h6 className="mb-0 fw-bold">المنتجات ({quickViewOrder.items?.length || 0})</h6>
                      </div>
                      <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {quickViewOrder.items?.map((item, index) => (
                          <div key={item.id || index} className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                            <div className="position-relative">
                              <img
                                src={item.image || item.images?.[0] || "/assets/img/placeholder.jpg"}
                                alt={item.name}
                                className="rounded-3"
                                style={{ 
                                  width: '80px', 
                                  height: '80px', 
                                  objectFit: 'cover',
                                  objectPosition: 'center'
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
                              <h6 className="fw-semibold mb-1 small">{item.name}</h6>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">${(item.price || 0).toFixed(2)}</small>
                                <strong className="text-primary">
                                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                </strong>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="d-flex gap-2 justify-content-center flex-wrap">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleDownloadInvoice(quickViewOrder)}
                      >
                        <FaDownload className="me-2" />
                        تحميل الفاتورة
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setQuickViewOrder(null)}
                      >
                        إغلاق
                      </button>
                      {quickViewOrder.status === 'delivered' && (
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => alert(`تقييم منتجات الطلب ${quickViewOrder.id}`)}
                        >
                          <FaStar className="me-2" />
                          تقييم المنتجات
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  ), [quickViewOrder, handleDownloadInvoice, calculateOrderValues]);

  // تحسين مكون بطاقة الطلب مع تصميم الصور المشابه لصفحة المنتجات
  const OrderCard = React.memo(({ order }) => {
    const config = statusConfig[order.status] || statusConfig.unknown;
    const items = order.items || [];
    const orderValues = calculateOrderValues(order);
   
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card order-card border-0 shadow-sm mb-4"
      >
        <div className="card-header bg-white border-bottom-0 pb-0">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <FaBox className="text-primary fs-4" />
                </div>
                <div>
                  <h5 className="mb-1 fw-bold text-dark">{order.id || "طلب غير معروف"}</h5>
                  <small className="text-muted d-flex align-items-center">
                    <FaCalendarAlt className="me-1" size={12} />
                    {order.date ? new Date(order.date).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : "تاريخ غير معروف"}
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="d-flex flex-column align-items-md-end">
                <StatusBadge status={order.status} />
                <div className="mt-2">
                  <strong className="text-primary fs-5">${orderValues.total.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
       
        <div className="card-body">
          {/* عنوان الشحن إن وجد */}
          {order.shipping?.address && (
            <div className="shipping-info mb-4 p-3 bg-light rounded-3">
              <h6 className="fw-bold mb-2 d-flex align-items-center">
                <FaMapMarkerAlt className="me-2 text-muted" />
                عنوان الشحن
              </h6>
              <p className="text-muted mb-0 small">
                {order.shipping.address.street}, {order.shipping.address.city}, {order.shipping.address.country}
              </p>
            </div>
          )}

          {/* عناصر الطلب - تصميم محسن مشابه لصفحة المنتجات */}
          <div className="order-items">
            <h6 className="fw-bold mb-3 d-flex align-items-center text-dark">
              <FaShoppingBag className="me-2 text-primary" />
              المنتجات ({items.length})
            </h6>
           
            <div className="row g-3">
              {items.map((item, index) => (
                <div key={item.id || index} className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
                  <div className="product-item-card border-0 bg-white rounded-3 h-100 d-flex flex-column shadow-sm position-relative">
                    {/* صورة المنتج - بنفس تصميم صفحة المنتجات */}
                    <div className="product-image-container position-relative overflow-hidden rounded-top">
                      <img
                        src={item.image || item.images?.[0] || "/assets/img/placeholder.jpg"}
                        alt={item.name || "منتج"}
                        className="product-image"
                        style={{ 
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover',
                          objectPosition: 'center'
                        }}
                        onError={(e) => {
                          e.target.src = "/assets/img/placeholder.jpg";
                        }}
                      />
                      
                      {/* شارة الكمية */}
                      <span className="position-absolute top-0 start-0 badge bg-dark bg-opacity-75 m-2">
                        {item.quantity}x
                      </span>
                      
                      {/* شارة الفئة */}
                      {item.category && (
                        <div className="position-absolute top-0 end-0 m-2">
                          <span className="badge bg-primary">
                            {item.category}
                          </span>
                        </div>
                      )}
                      
                      {/* طبقة Hover Overlay */}
                      <div className="product-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickView(order);
                          }}
                          className="btn btn-primary rounded-pill px-3 py-2"
                          style={{ zIndex: 3 }}
                        >
                          <FaEye className="me-1" />
                          عرض الطلب
                        </motion.button>
                      </div>
                    </div>

                    {/* معلومات المنتج */}
                    <div className="product-info p-3 flex-grow-1 d-flex flex-column">
                      <h6 className="product-name fw-semibold mb-2 text-dark">
                        {item.title || "منتج غير معروف"}
                      </h6>
                      
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted d-block">سعر الوحدة</small>
                            <span className="fw-bold text-primary">
                              ${(item.price || 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="text-end">
                            <small className="text-muted d-block">المجموع</small>
                            <span className="fw-bold text-dark">
                              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ملخص الطلب المحسن مع الخانات الجديدة */}
          <div className="order-summary border-top pt-4 mt-4">
            <div className="row g-3">
              {/* الحالة */}
              <div className="col-lg-3 col-md-6 col-6">
                <div className="summary-item text-center p-3 rounded-3 bg-light h-100">
                  <small className="text-muted d-block mb-2">حالة الطلب</small>
                  <div className="mb-2">
                    <StatusBadge status={order.status} />
                  </div>
                  <small className="text-muted">
                    {config.description}
                  </small>
                </div>
              </div>
              
              {/* القيمة الإجمالية (قبل الخصم والضريبة) */}
              <div className="col-lg-3 col-md-6 col-6">
                <div className="summary-item text-center p-3 rounded-3 bg-light h-100">
                  <small className="text-muted d-block mb-2">القيمة الإجمالية</small>
                  <div className="d-flex flex-column">
                    <strong className="text-success fs-5 mb-1">
                      ${orderValues.subtotal.toFixed(2)}
                    </strong>
                    <small className="text-muted">
                      {orderValues.itemsCount} منتج
                    </small>
                  </div>
                </div>
              </div>
              
              {/* الإجمالي (بعد الخصم والضريبة) */}
              <div className="col-lg-3 col-md-6 col-6">
                <div className="summary-item text-center p-3 rounded-3 bg-light h-100">
                  <small className="text-muted d-block mb-2">الإجمالي النهائي</small>
                  <div className="d-flex flex-column">
                    <strong className="text-primary fs-5 mb-1">
                      ${orderValues.total.toFixed(2)}
                    </strong>
                    <div className="d-flex justify-content-center gap-2 small">
                      <span className="text-muted">شحن: ${orderValues.shipping.toFixed(2)}</span>
                      <span className="text-muted">ضريبة: ${orderValues.tax.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* معلومات إضافية */}
              <div className="col-lg-3 col-md-6 col-6">
                <div className="summary-item text-center p-3 rounded-3 bg-light h-100">
                  <small className="text-muted d-block mb-2">معلومات الدفع</small>
                  <div className="d-flex flex-column">
                    <strong className="text-info fs-6 mb-1">
                      {order.payment?.method || "غير محدد"}
                    </strong>
                    {order.payment?.lastFour && (
                      <small className="text-muted">
                      ‎**** {order.payment.lastFour}
                      </small>
                    )}
                    <small className="text-muted mt-1">
                      {order.shipping?.method || "شحن قياسي"}
                    </small>
                  </div>
                </div>
              </div>
            </div>
            
            {/* تفاصيل الأسعار (اختياري) */}
            {/* <div className="row mt-3">
              <div className="col-12">
                <div className="price-details bg-light rounded-3 p-3">
                  <div className="row text-center small">
                    <div className="col-3">
                      <span className="text-muted">المنتجات:</span>
                      <strong className="d-block">${orderValues.subtotal.toFixed(2)}</strong>
                    </div>
                    <div className="col-3">
                      <span className="text-muted">الشحن:</span>
                      <strong className="d-block">${orderValues.shipping.toFixed(2)}</strong>
                    </div>
                    <div className="col-3">
                      <span className="text-muted">الضريبة:</span>
                      <strong className="d-block">${orderValues.tax.toFixed(2)}</strong>
                    </div>
                    <div className="col-3">
                      <span className="text-muted">الإجمالي:</span>
                      <strong className="d-block text-primary">${orderValues.total.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
       
        <div className="card-footer bg-white border-top-0">
          <div className="d-flex gap-2 flex-wrap justify-content-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary btn-sm rounded-pill px-4"
              onClick={() => handleQuickView(order)}
            >
              <FaEye className="me-1" />
              عرض سريع
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-outline-secondary btn-sm rounded-pill px-4"
              onClick={() => handleDownloadInvoice(order)}
            >
              <FaDownload className="me-1" />
              تحميل الفاتورة
            </motion.button>
            {order.status === 'delivered' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline-warning btn-sm rounded-pill px-4"
                onClick={() => alert(`تقييم منتجات الطلب ${order.id}`)}
              >
                <FaStar className="me-1" />
                تقييم المنتجات
              </motion.button>
            )}
            {order.shipping?.tracking && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline-success btn-sm rounded-pill px-4"
                onClick={() => alert(`تتبع الطلب ${order.id}`)}
              >
                <FaTruck className="me-1" />
                تتبع الشحنة
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    );
  });

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
              role="status"
            >
              <span className="visually-hidden">جاري التحميل...</span>
            </motion.div>
            <h5 className="text-muted mb-2">جاري تحميل طلباتك...</h5>
            <p className="text-muted small">نستعد لعرض جميع طلباتك</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // الطلبات المرئية فقط (تحميل تدريجي)
  const ordersToShow = filteredOrders.slice(0, visibleOrders);
  const hasMoreOrders = visibleOrders < filteredOrders.length;

  return (
    <div className="container-fluid py-4 orders-page">
      <div className="row">
        <div className="col-12">
          {/* الرأس */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 fw-bold mb-2 gradient-text">طلباتي</h1>
              <p className="text-muted mb-0">
                تابع وأدر جميع طلباتك في مكان واحد
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/products" className="btn btn-primary">
                <FaShoppingBag className="me-2" />
                متابعة التسوق
              </Link>
              {process.env.NODE_ENV === 'development' && orders.length > 0 && (
                <button 
                  onClick={handleClearAllOrders}
                  className="btn btn-outline-danger"
                  title="للتطوير فقط"
                >
                  🧹 تنظيف
                </button>
              )}
            </div>
          </div>

          {/* الإحصائيات */}
          <div className="row g-3 mb-4">
            <div className="col-xl-3 col-md-6 col-6">
              <div className="card stat-card border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="stat-icon bg-primary">
                    <FaShoppingBag />
                  </div>
                  <h3 className="stat-value fw-bold mt-3">{orderStats.total}</h3>
                  <p className="stat-label text-muted mb-0">إجمالي الطلبات</p>
                  <small className="text-muted">
                    ${orderStats.averageOrderValue.toFixed(2)} متوسط
                  </small>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 col-6">
              <div className="card stat-card border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="stat-icon bg-success">
                    <FaCheckCircle />
                  </div>
                  <h3 className="stat-value fw-bold mt-3">{orderStats.delivered}</h3>
                  <p className="stat-label text-muted mb-0">تم التوصيل</p>
                  <small className="text-muted">
                    {orderStats.deliverySuccessRate.toFixed(1)}% نجاح
                  </small>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 col-6">
              <div className="card stat-card border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="stat-icon bg-warning">
                    <FaClock />
                  </div>
                  <h3 className="stat-value fw-bold mt-3">
                    {orderStats.statusBreakdown.processing || 0}
                  </h3>
                  <p className="stat-label text-muted mb-0">قيد المعالجة</p>
                  <small className="text-muted">
                    طلبات نشطة
                  </small>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 col-6">
              <div className="card stat-card border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="stat-icon bg-info">
                    <FaCreditCard />
                  </div>
                  <h3 className="stat-value fw-bold mt-3">${orderStats.totalSpent.toFixed(2)}</h3>
                  <p className="stat-label text-muted mb-0">إجمالي الإنفاق</p>
                  <small className="text-muted">
                    القيمة الإجمالية
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* الفلترة والبحث */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <FaSearch className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="ابحث في الطلبات أو المنتجات..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setSearchTerm("")}
                        aria-label="Clear search"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
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
                    <option value="cancelled">ملغي</option>
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
              </div>
             
              {/* الفلاتر النشطة */}
              {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
                <div className="mt-3 d-flex align-items-center gap-2 flex-wrap">
                  <small className="text-muted">فلاتر نشطة:</small>
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
                  <button
                    className="btn btn-sm btn-outline-danger rounded-pill"
                    onClick={clearFilters}
                  >
                    مسح الكل
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* قائمة الطلبات */}
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-5"
            >
              <div className="empty-state-icon mb-4">
                <FaBox className="text-muted" size={64} />
              </div>
              <h4 className="text-muted mb-3">لا توجد طلبات</h4>
              <p className="text-muted mb-4">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? "حاول تعديل معايير البحث الخاصة بك"
                  : "لم تقم بأي طلبات بعد"}
              </p>
              <Link to="/products" className="btn btn-primary btn-lg">
                ابدأ التسوق
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="row">
                <div className="col-12">
                  {ordersToShow.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              </div>
              
              {/* زر تحميل المزيد */}
              {hasMoreOrders && (
                <div className="text-center mt-5">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary btn-lg px-5 rounded-pill"
                    onClick={handleLoadMore}
                  >
                    <FaSync className="me-2" />
                    تحميل المزيد ({filteredOrders.length - visibleOrders} متبقي)
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal />

      <style>{`
        .orders-page {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
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
          border: 1px solid rgba(0,0,0,0.05);
        }

        .order-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15) !important;
        }

        .product-item-card {
          transition: all 0.3s ease;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.08) !important;
        }

        .product-item-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.12) !important;
        }

        .product-image-container {
          height: 180px;
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
          transform: scale(1.08);
        }

        .product-overlay {
          background: rgba(0,0,0,0.7);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .product-item-card:hover .product-overlay {
          opacity: 1;
        }

        .wishlist-btn {
          opacity: 0;
          transition: all 0.3s ease;
        }

        .product-item-card:hover .wishlist-btn {
          opacity: 1;
        }

        .product-name {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.95rem;
          line-height: 1.3;
        }

        .stat-card {
          transition: all 0.3s ease;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: white;
          font-size: 1.5rem;
        }

        .stat-value {
          color: #2c3e50;
          font-size: 2rem;
        }

        .stat-label {
          font-size: 0.95rem;
        }

        .badge {
          border-radius: 10px;
          font-size: 0.75rem;
          padding: 0.4em 0.8em;
        }

        .btn {
          border-radius: 12px;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .empty-state-icon {
          opacity: 0.5;
        }

        .shipping-info {
          border-left: 4px solid #007bff;
        }

        .summary-item {
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.05);
        }

        .summary-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .price-details {
          border-left: 4px solid #28a745;
        }

        /* تصميم متجاوب للخانات */
        @media (max-width: 768px) {
          .stat-value {
            font-size: 1.5rem;
          }
         
          .stat-icon {
            width: 50px;
            height: 50px;
            font-size: 1.25rem;
          }
          
          .product-image-container {
            height: 150px;
          }

          .order-card {
            margin-bottom: 1.5rem;
          }

          .summary-item {
            margin-bottom: 1rem;
          }
          
          .order-summary .row.g-3 > div {
            margin-bottom: 1rem;
          }
        }

        @media (max-width: 576px) {
          .stat-value {
            font-size: 1.25rem;
          }

          .product-image-container {
            height: 120px;
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