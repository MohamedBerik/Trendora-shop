import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaEdit,
  FaTrash,
  FaShoppingBag,
  FaUser,
  FaCheckCircle,
  FaRegStar,
  FaSearch,
  FaThumbsUp,
  FaExclamationTriangle,
  FaEye,
  FaTimes
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// سياق البيانات المشتركة
import { useOrders } from '../../context/OrdersContext';
import { useReviews } from '../../context/ReviewsContext';

// مكون الإشعارات
const Notification = ({ type, message, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: {
      icon: FaCheckCircle,
      bgColor: 'bg-success',
      textColor: 'text-white',
      borderColor: 'border-success'
    },
    error: {
      icon: FaExclamationTriangle,
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
      icon: FaCheckCircle,
      bgColor: 'bg-info',
      textColor: 'text-white',
      borderColor: 'border-info'
    }
  }[type] || {
    icon: FaCheckCircle,
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
};

// مكون النجوم للتقييم
const StarRating = ({ rating, onRatingChange, readonly = false, size = 20 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="star-rating-component d-flex">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            className="btn btn-link p-1 star-hover"
            onClick={() => !readonly && onRatingChange(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            disabled={readonly}
            style={{ cursor: readonly ? 'default' : 'pointer' }}
          >
            {filled ? (
              <FaStar
                size={size}
                className="text-warning"
                style={{ transition: 'all 0.2s ease' }}
              />
            ) : (
              <FaRegStar
                size={size}
                className="text-muted"
                style={{ transition: 'all 0.2s ease' }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

// نافذة إضافة/تعديل التقييم
const ReviewModal = ({
  order,
  product,
  existingReview,
  onClose,
  onSubmit,
  onDelete
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('يرجى اختيار تقييم');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        id: existingReview?.id || `REV-${Date.now()}`,
        orderId: order.id,
        productId: product.id,
        productName: product.name || product.title,
        productImage: product.image || product.images?.[0],
        rating,
        title: title.trim() || `تقييم ${product.name}`,
        comment: comment.trim(),
        date: new Date().toISOString(),
        verified: true,
        helpful: existingReview?.helpful || 0
      });
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
      onDelete(existingReview.id);
      onClose();
    }
  };

  const ratingLabels = {
    1: 'سيء',
    2: 'مقبول',
    3: 'جيد',
    4: 'جيد جداً',
    5: 'ممتاز'
  };

  return (
    <AnimatePresence>
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
                  <h5 className="modal-title mb-0 fw-bold">
                    {existingReview ? 'تعديل التقييم' : 'إضافة تقييم'}
                  </h5>
                  <small className="opacity-90">{product.name || product.title}</small>
                </div>
              </div>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body py-4">
              <div className="product-info mb-4">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={product.image || product.images?.[0] || "/assets/img/placeholder.jpg"}
                    alt={product.name}
                    className="rounded-3 shadow-sm"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = "/assets/img/placeholder.jpg";
                    }}
                  />
                  <div>
                    <h6 className="fw-bold mb-1">{product.name || product.title}</h6>
                    <small className="text-muted">طلب #{order.id}</small>
                  </div>
                </div>
              </div>

              <div className="rating-section text-center mb-4">
                <h6 className="fw-bold mb-3">تقييم المنتج</h6>
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  size={30}
                />
                <div className="rating-labels mt-2">
                  <small className="text-muted fw-bold">
                    {ratingLabels[rating] || 'اختر التقييم'}
                  </small>
                </div>
              </div>

              <div className="review-form">
                <div className="mb-3">
                  <label className="form-label fw-bold">عنوان التقييم (اختياري)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="اكتب عنواناً موجزاً..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">التعليق</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="شاركنا تجربتك مع هذا المنتج..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <small className="text-muted">
                    {comment.length}/500 حرف
                  </small>
                </div>
              </div>
            </div>

            <div className="modal-footer border-0">
              <div className="d-flex gap-2 w-100">
                {existingReview && (
                  <button
                    className="btn btn-outline-danger flex-fill"
                    onClick={handleDelete}
                  >
                    <FaTrash className="me-2" />
                    حذف
                  </button>
                )}
                <button
                  className="btn btn-outline-secondary flex-fill"
                  onClick={onClose}
                >
                  إلغاء
                </button>
                <button
                  className="btn btn-warning flex-fill"
                  onClick={handleSubmit}
                  disabled={rating === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">جاري الحفظ...</span>
                      </div>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="me-2" />
                      {existingReview ? 'تحديث' : 'نشر التقييم'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

function ReviewsPage() {
  const { orders } = useOrders();
  const {
    reviews,
    isLoading: reviewsLoading,
    addReview,
    updateReview,
    deleteReview,
    incrementHelpful
  } = useReviews();

  // الحالات
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [selectedProductForReview, setSelectedProductForReview] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // إضافة إشعار
  const addNotification = useCallback((type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
  }, []);

  // إزالة إشعار
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // الحصول على الطلبات المؤهلة للتقييم
  const getEligibleOrders = useCallback(() => {
    return orders.filter(order =>
      order.status === 'delivered' &&
      Array.isArray(order.items) &&
      order.items.length > 0
    );
  }, [orders]);

  // فتح نافذة التقييم
  const handleOpenReviewModal = useCallback((order, product, review = null) => {
    setSelectedOrderForReview(order);
    setSelectedProductForReview(product);
    setExistingReview(review);
    setShowReviewModal(true);
  }, []);

  // إغلاق نافذة التقييم
  const handleCloseReviewModal = useCallback(() => {
    setShowReviewModal(false);
    setSelectedOrderForReview(null);
    setSelectedProductForReview(null);
    setExistingReview(null);
  }, []);

  // معالجة إرسال التقييم
  const handleReviewSubmit = useCallback(async (reviewData) => {
    try {
      if (existingReview) {
        await updateReview(existingReview.id, reviewData);
        addNotification('success', 'تم تحديث التقييم بنجاح');
      } else {
        await addReview(reviewData);
        addNotification('success', 'تم إضافة التقييم بنجاح');
      }
    } catch (error) {
      addNotification('error', 'حدث خطأ أثناء حفظ التقييم');
    }
  }, [existingReview, addReview, updateReview, addNotification]);

  // معالجة حذف التقييم
  const handleReviewDelete = useCallback(async (reviewId) => {
    try {
      await deleteReview(reviewId);
      addNotification('success', 'تم حذف التقييم بنجاح');
    } catch (error) {
      addNotification('error', 'حدث خطأ أثناء حذف التقييم');
    }
  }, [deleteReview, addNotification]);

  // معالجة مفيد
  const handleHelpfulClick = useCallback((reviewId) => {
    incrementHelpful(reviewId);
    addNotification('info', 'شكراً لك على التقييم!');
  }, [incrementHelpful, addNotification]);

  // التقييمات المفلترة والمرتبة
  const filteredReviews = useMemo(() => {
    let filtered = reviews;

    // التصفية حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // التصفية حسب التقييم
    if (filter !== "all") {
      const ratingFilter = parseInt(filter);
      filtered = filtered.filter(review => review.rating === ratingFilter);
    }

    // الترتيب
    switch (sortBy) {
      case "newest":
        filtered = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "highest":
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filtered = filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "most_helpful":
        filtered = filtered.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [reviews, searchTerm, filter, sortBy]);

  // الإحصائيات
  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
      : 0;
   
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    return {
      totalReviews,
      averageRating,
      ratingDistribution,
      verifiedReviews: reviews.filter(r => r.verified).length
    };
  }, [reviews]);

  // الطلبات المؤهلة للتقييم
  const eligibleOrders = useMemo(() => getEligibleOrders(), [getEligibleOrders]);

  // المنتجات التي لم يتم تقييمها
  const unreviewedProducts = useMemo(() => {
    const reviewedProductIds = new Set(reviews.map(review => review.productId));
   
    return eligibleOrders.flatMap(order =>
      order.items
        .filter(item => !reviewedProductIds.has(item.id))
        .map(item => ({
          order,
          product: item,
          canReview: true
        }))
    );
  }, [eligibleOrders, reviews]);

  // مكون بطاقة التقييم
  const ReviewCard = React.memo(({ review, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="col-12 mb-4"
    >
      <div className="card review-card border-0 shadow-sm h-100">
        <div className="card-header bg-white border-0">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center">
                <img
                  src={review.productImage || "/assets/img/placeholder.jpg"}
                  alt={review.productName}
                  className="rounded me-3"
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = "/assets/img/placeholder.jpg";
                  }}
                />
                <div>
                  <h6 className="fw-bold mb-1 text-dark">{review.productName}</h6>
                  <small className="text-muted d-flex align-items-center">
                    <FaShoppingBag className="me-1" size={12} />
                    طلب #{review.orderId}
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="d-flex flex-column align-items-md-end">
                <StarRating rating={review.rating} readonly size={18} />
                <small className="text-muted mt-1">
                  {new Date(review.date).toLocaleDateString('ar-SA')}
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {review.title && (
            <h6 className="fw-bold text-dark mb-2">{review.title}</h6>
          )}
          <p className="text-muted mb-3 review-text-collapsed">
            {review.comment}
          </p>
         
          {review.verified && (
            <div className="d-flex align-items-center mb-3">
              <FaCheckCircle className="text-success me-1" size={14} />
              <small className="text-success">تم الشراء وتأكيد الطلب</small>
            </div>
          )}
        </div>

        <div className="card-footer bg-white border-0">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-success btn-sm"
                onClick={() => handleHelpfulClick(review.id)}
              >
                <FaThumbsUp className="me-1" />
                مفيد ({review.helpful || 0})
              </button>
             
              <button
                className="btn btn-outline-warning btn-sm"
                onClick={() => {
                  const order = orders.find(o => o.id === review.orderId);
                  const product = order?.items?.find(item => item.id === review.productId);
                  if (order && product) {
                    handleOpenReviewModal(order, product, review);
                  }
                }}
              >
                <FaEdit className="me-1" />
                تعديل
              </button>
            </div>

            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => handleReviewDelete(review.id)}
            >
              <FaTrash className="me-1" />
              حذف
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  ));

  // مكون بطاقة المنتج المؤهل للتقييم
  const UnreviewedProductCard = React.memo(({ item, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="col-md-6 col-lg-4 mb-4"
    >
      <div className="card unreviewed-card border-0 shadow-sm h-100">
        <div className="card-body text-center p-4">
          <img
            src={item.product.image || item.product.images?.[0] || "/assets/img/placeholder.jpg"}
            alt={item.product.name}
            className="rounded mb-3"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = "/assets/img/placeholder.jpg";
            }}
          />
         
          <h6 className="fw-bold text-dark mb-2">{item.product.name || item.product.title}</h6>
          <small className="text-muted d-block mb-3">
            طلب #{item.order.id}
          </small>
         
          <button
            className="btn btn-warning w-100 rounded-pill"
            onClick={() => handleOpenReviewModal(item.order, item.product)}
          >
            <FaStar className="me-2" />
            أضف تقييمك
          </button>
        </div>
      </div>
    </motion.div>
  ));

  // شاشة التحميل
  if (reviewsLoading) {
    return (
      <div className="container-fluid py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="text-center">
            <div className="spinner-border text-warning mb-3" style={{ width: '3rem', height: '3rem' }} />
            <h5 className="text-muted">جاري تحميل التقييمات...</h5>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 reviews-page">
      {/* الإشعارات */}
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

      {/* نافذة التقييم */}
      {showReviewModal && selectedOrderForReview && selectedProductForReview && (
        <ReviewModal
          order={selectedOrderForReview}
          product={selectedProductForReview}
          existingReview={existingReview}
          onClose={handleCloseReviewModal}
          onSubmit={handleReviewSubmit}
          onDelete={handleReviewDelete}
        />
      )}

      <div className="row">
        <div className="col-12">
          {/* العنوان والإحصائيات */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="d-flex justify-content-between align-items-center mb-4"
          >
            <div>
              <h1 className="h2 fw-bold mb-2 gradient-text">تقييماتي</h1>
              <p className="text-muted mb-0">
                شارك تجربتك واراءك حول المنتجات التي اشتريتها
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/orders" className="btn btn-outline-primary rounded-pill px-4">
                <FaShoppingBag className="me-2" />
                طلباتي
              </Link>
              <Link to="/profile" className="btn btn-outline-secondary rounded-pill px-4">
                <FaUser className="me-2" />
                الملف الشخصي
              </Link>
            </div>
          </motion.div>

          {/* بطاقات الإحصائيات */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="row g-3 mb-5"
          >
            <div className="col-xl-3 col-md-6 col-6">
              <div className="card stat-card border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="stat-icon bg-warning mx-auto mb-3">
                    <FaStar className="text-white" />
                  </div>
                  <h3 className="stat-value fw-bold text-dark mb-1">{stats.totalReviews}</h3>
                  <p className="stat-label text-muted mb-0">إجمالي التقييمات</p>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 col-6">
              <div className="card stat-card border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="stat-icon bg-success mx-auto mb-3">
                    <FaCheckCircle className="text-white" />
                  </div>
                  <h3 className="stat-value fw-bold text-dark mb-1">{stats.averageRating}/5</h3>
                  <p className="stat-label text-muted mb-0">متوسط التقييم</p>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 col-6">
              <div className="card stat-card border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="stat-icon bg-info mx-auto mb-3">
                    <FaThumbsUp className="text-white" />
                  </div>
                  <h3 className="stat-value fw-bold text-dark mb-1">
                    {reviews.reduce((sum, review) => sum + (review.helpful || 0), 0)}
                  </h3>
                  <p className="stat-label text-muted mb-0">تقييمات مفيدة</p>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 col-6">
              <div className="card stat-card border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="stat-icon bg-primary mx-auto mb-3">
                    <FaShoppingBag className="text-white" />
                  </div>
                  <h3 className="stat-value fw-bold text-dark mb-1">{unreviewedProducts.length}</h3>
                  <p className="stat-label text-muted mb-0">منتجات تنتظر التقييم</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* الفلاتر والبحث */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card border-0 shadow-sm mb-4"
          >
            <div className="card-body p-4">
              <div className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label fw-semibold text-dark mb-2">بحث في التقييمات</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <FaSearch className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 rounded-end"
                      placeholder="ابحث في المنتجات أو التعليقات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold text-dark mb-2">تصفية بالتقييم</label>
                  <select
                    className="form-select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">جميع التقييمات</option>
                    <option value="5">5 نجوم</option>
                    <option value="4">4 نجوم</option>
                    <option value="3">3 نجوم</option>
                    <option value="2">2 نجوم</option>
                    <option value="1">1 نجمة</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold text-dark mb-2">ترتيب حسب</label>
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">الأحدث</option>
                    <option value="oldest">الأقدم</option>
                    <option value="highest">الأعلى تقييماً</option>
                    <option value="lowest">الأقل تقييماً</option>
                    <option value="most_helpful">الأكثر مفيدة</option>
                  </select>
                </div>

                <div className="col-md-2">
                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={() => {
                      setSearchTerm("");
                      setFilter("all");
                      setSortBy("newest");
                    }}
                    disabled={!searchTerm && filter === "all" && sortBy === "newest"}
                  >
                    <FaTimes className="me-2" />
                    مسح الكل
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* المنتجات التي تنتظر التقييم */}
          {unreviewedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-5"
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold text-dark mb-0">
                  <FaStar className="me-2 text-warning" />
                  منتجات تنتظر تقييمك ({unreviewedProducts.length})
                </h4>
                <small className="text-muted">المنتجات التي اشتريتها ولم تقيمها بعد</small>
              </div>

              <div className="row">
                {unreviewedProducts.slice(0, 6).map((item, index) => (
                  <UnreviewedProductCard key={`${item.order.id}-${item.product.id}`} item={item} index={index} />
                ))}
              </div>

              {unreviewedProducts.length > 6 && (
                <div className="text-center mt-4">
                  <button className="btn btn-outline-warning rounded-pill px-4">
                    <FaEye className="me-2" />
                    عرض جميع المنتجات ({unreviewedProducts.length})
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* التقييمات الحالية */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-dark mb-0">
                <FaEdit className="me-2 text-primary" />
                تقييماتي السابقة ({filteredReviews.length})
              </h4>
            </div>

            {filteredReviews.length === 0 ? (
              <div className="text-center py-5">
                <FaStar className="text-muted mb-3" size={48} />
                <h4 className="text-muted mb-3">لا توجد تقييمات</h4>
                <p className="text-muted mb-4">
                  {searchTerm || filter !== "all"
                    ? "لم نعثر على تقييمات تطابق معايير البحث الخاصة بك"
                    : "لم تقم بإضافة أي تقييمات بعد. ابدأ بتقييم المنتجات التي اشتريتها!"
                  }
                </p>
                {unreviewedProducts.length > 0 && (
                  <button
                    className="btn btn-warning rounded-pill px-4"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <FaStar className="me-2" />
                    ابدأ بالتقييم الآن
                  </button>
                )}
              </div>
            ) : (
              <div className="row">
                {filteredReviews.map((review, index) => (
                  <ReviewCard key={review.id} review={review} index={index} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* الأنماط */}
      <style>{`
        .reviews-page {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          min-height: 100vh;
        }

        .gradient-text {
          background: linear-gradient(135deg, #f39c12 0%, #e74c3c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-card {
          transition: all 0.3s ease;
          border-radius: 15px;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-value {
          font-size: 1.8rem;
        }

        .review-card, .unreviewed-card {
          transition: all 0.3s ease;
          border-radius: 15px;
        }

        .review-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }

        .unreviewed-card {
          background: linear-gradient(135deg, #fff3cd 0%, #ffffff 100%);
          border: 2px dashed #ffc107;
        }

        .unreviewed-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(255, 193, 7, 0.2) !important;
        }

        .review-text-collapsed {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.6;
        }

        .btn {
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .star-rating-component .star-hover {
          transition: all 0.2s ease-in-out;
        }

        .star-rating-component .star-hover:hover {
          transform: scale(1.2);
        }

        .rating-labels {
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .stat-value {
            font-size: 1.5rem;
          }

          .stat-icon {
            width: 50px;
            height: 50px;
          }

          .review-card .card-body,
          .review-card .card-footer {
            padding: 1rem;
          }

          .btn-group {
            flex-direction: column;
            gap: 0.5rem;
          }

          .btn-group .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default React.memo(ReviewsPage);