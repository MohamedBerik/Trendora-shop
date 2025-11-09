import { useState, useCallback, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaShoppingBag,
  FaHeart,
  FaStar,
  FaHistory,
  FaCreditCard,
  FaShieldAlt,
  FaSignOutAlt,
  FaCamera,
  FaBell,
  FaGlobe,
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaShoppingCart,
  FaEye,
  FaDownload,
  FaTrash,
  FaThumbsUp
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// سياق البيانات المشتركة
import { useOrders } from '../../context/OrdersContext';
import { useWishlist } from '../../context/WishlistContext';
import { useReviews } from '../../context/ReviewsContext';

function ProfilePage() {
  const navigate = useNavigate();
 
  // استخدام البيانات من السياقات المختلفة
  const { orders: contextOrders , isInitialized: ordersInitialized, fetchOrders } = useOrders();
  const { wishlist: contextWishlist, isInitialized: wishlistInitialized, initializeWishlist } = useWishlist();
  const { reviews: contextReviews, isLoading: reviewsLoading, isInitialized: reviewsInitialized, initializeReviews , deleteReview, incrementHelpful } = useReviews();

  // حالة التهيئة
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // User data state
  const [userData, setUserData] = useState(null);

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [editForm, setEditForm] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 🔧 دالة لتصفية وتطبيع بيانات الطلبات
  const normalizeOrders = useCallback((ordersData) => {
    if (!ordersData || !Array.isArray(ordersData)) return [];
   
    return ordersData
      .filter(order => {
        if (!order || typeof order !== 'object') return false;
       
        // 🔥 الإصلاح: إزالة كائنات المنتج (التي تحتوي على خصائص المنتج)
        if (order.title || order.description || order.category || order.images) {
          console.warn('🔴 Removing product object from orders:', order.id || order.title);
          return false;
        }
       
        // الاحتفاظ بالطلبات الحقيقية فقط
        return order.id && order.date;
      })
      .map(order => ({
        id: order.id || `ORD-${Date.now()}`,
        date: order.date || new Date().toISOString().split('T')[0],
        total: typeof order.total === 'number' ? order.total : 0,
        status: order.status || 'processing',
        items: Array.isArray(order.items)
          ? order.items.reduce((total, item) => total + (item.quantity || 1), 0)
          : typeof order.items === 'number' ? order.items : 0,
        tracking: order.tracking || null,
        products: order.products || [],
        shippingAddress: order.shippingAddress || {},
        paymentMethod: order.paymentMethod || 'Unknown'
      }));
  }, []);

  // 🔧 تهيئة البيانات عند تحميل المكون
  useEffect(() => {
    const initializeAllData = async () => {
      setIsLoading(true);
     
      try {
        // بيانات المستخدم الافتراضية فقط
        const defaultUserData = {
          id: 1,
          name: "Karim Adel",
          email: "karim.adel@example.com",
          phone: "01000002233",
          location: "Cairo, Egypt",
          joinDate: "January 2024",
          avatar: "/assets/img/person1.jpg",
          bio: "Passionate shopper who loves finding great deals and quality products. Always looking for the best customer experience.",
          preferences: {
            newsletter: true,
            smsNotifications: false,
            emailNotifications: true,
            language: "Arabic",
            currency: "EGP"
          }
        };

        setUserData(defaultUserData);
        
        // جلب البيانات من السياقات بالتوازي
        await Promise.all([
          fetchOrders(),
          initializeWishlist(),
          initializeReviews()
        ]);
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing profile data:', error);
        // البيانات الافتراضية للمستخدم فقط في حالة الخطأ
        setUserData({
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          location: "New York, USA",
          joinDate: "January 2024",
          avatar: "/assets/img/person1.jpg",
          bio: "Passionate shopper who loves finding great deals and quality products.",
          preferences: {
            newsletter: true,
            smsNotifications: false,
            emailNotifications: true,
            language: "English",
            currency: "USD"
          }
        });
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAllData();
  }, [fetchOrders, initializeWishlist, initializeReviews]);

  // استخدام البيانات الحقيقية من السياقات فقط
  const orders = useMemo(() => {
    return contextOrders && contextOrders.length > 0 ? normalizeOrders(contextOrders) : [];
  }, [contextOrders, normalizeOrders]);

  const wishlist = useMemo(() => {
    return contextWishlist && contextWishlist.length > 0 ? contextWishlist : [];
  }, [contextWishlist]);

  const reviews = useMemo(() => {
    return contextReviews && contextReviews.length > 0 ? contextReviews : [];
  }, [contextReviews]);

  // ✅ تحديث شرط التحميل
  const shouldShowLoading = isLoading || 
    !isInitialized || 
    !ordersInitialized || 
    !wishlistInitialized || 
    !reviewsInitialized;

  // 🔄 دوال التنقل
  const navigateToOrders = useCallback(() => {
    navigate('/orders');
  }, [navigate]);

  const navigateToWishlist = useCallback(() => {
    navigate('/wishlist');
  }, [navigate]);

  const navigateToReviews = useCallback(() => {
    navigate('/reviews');
  }, [navigate]);

  // دوال التحرير
  const startEditing = useCallback(() => {
    if (userData) {
      setEditForm({ ...userData });
      setIsEditing(true);
    }
  }, [userData]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setEditForm({});
  }, []);

  const saveProfile = useCallback(() => {
    if (editForm.name && editForm.email) {
      setUserData(editForm);
      setIsEditing(false);
    }
  }, [editForm]);

  const handleInputChange = useCallback((field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handlePreferenceChange = useCallback((preference, value) => {
    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }));
  }, []);

  // الإحصائيات - باستخدام البيانات الحقيقية فقط
  const stats = useMemo(() => {
    if (!userData) {
      return {
        totalOrders: 0,
        totalSpent: 0,
        wishlistItems: 0,
        reviewsWritten: 0,
        averageRating: 0,
        pendingOrders: 0
      };
    }

    return {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + (order.total || 0), 0),
      wishlistItems: wishlist.length,
      reviewsWritten: reviews.length,
      averageRating: reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
        : 0,
      pendingOrders: orders.filter(order => order.status === 'processing').length
    };
  }, [userData, orders, wishlist, reviews]);

  // Order status badge
  const OrderStatusBadge = ({ status }) => {
    const statusConfig = {
      delivered: {
        class: "bg-success",
        text: "Delivered",
        icon: FaCheckCircle
      },
      shipped: {
        class: "bg-primary",
        text: "Shipped",
        icon: FaTruck
      },
      processing: {
        class: "bg-warning",
        text: "Processing",
        icon: FaBoxOpen
      },
      cancelled: {
        class: "bg-danger",
        text: "Cancelled",
        icon: FaTimes
      }
    };

    const config = statusConfig[status] || statusConfig.processing;
    const IconComponent = config.icon;

    return (
      <span className={`badge ${config.class} d-flex align-items-center`}>
        <IconComponent className="me-1" size={12} />
        {config.text}
      </span>
    );
  };

  // 🎯 شاشة التحميل
  if (shouldShowLoading) {
    return (
      <div className="container-fluid py-4 profile-page">
        <div className="row justify-content-center">
          <div className="col-xxl-10">
            <div className="text-center py-5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="spinner-border text-primary mb-3"
                style={{ width: '3rem', height: '3rem' }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </motion.div>
              <h4 className="text-muted">Loading Your Profile...</h4>
              <p className="text-muted">
                {!ordersInitialized && "Loading orders... "}
                {!wishlistInitialized && "Loading wishlist... "}
                {!reviewsInitialized && "Loading reviews... "}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🎯 إذا لم يتم تحميل بيانات المستخدم
  if (!userData) {
    return (
      <div className="container-fluid py-4 profile-page">
        <div className="row justify-content-center">
          <div className="col-xxl-10">
            <div className="text-center py-5">
              <div className="alert alert-warning">
                <h5>Profile Not Available</h5>
                <p>Unable to load profile data. Please try refreshing the page.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Profile Header Component
  const ProfileHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="profile-header text-center py-5 mb-4"
    >
      <div className="avatar-container position-relative mx-auto mb-3">
        <img
          src={userData.avatar || "/assets/img/avatar-placeholder.jpg"}
          alt={userData.name}
          className="avatar-img rounded-circle shadow"
          onError={(e) => {
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNjAiIHk9IjYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjM1ZW0iPkF2YXRhcjwvdGV4dD48L3N2Zz4=";
          }}
        />
        <button className="btn btn-primary btn-sm avatar-edit-btn rounded-circle">
          <FaCamera size={14} />
        </button>
      </div>
      <h1 className="h2 fw-bold mb-2 text-white">{userData.name}</h1>
      <p className="text-white-50 mb-3">{userData.bio}</p>
      <div className="d-flex justify-content-center gap-3 flex-wrap">
        <div className="d-flex align-items-center text-white-50">
          <FaMapMarkerAlt className="me-2" />
          <small>{userData.location}</small>
        </div>
        <div className="d-flex align-items-center text-white-50">
          <FaEnvelope className="me-2" />
          <small>{userData.email}</small>
        </div>
        <div className="d-flex align-items-center text-white-50">
          <FaCalendarAlt className="me-2" />
          <small>Member since {userData.joinDate}</small>
        </div>
      </div>
    </motion.div>
  );

  // Statistics Cards
  const StatisticsCards = () => (
    <div className="row g-3 mb-5">
      {/* Order Card */}
      <div className="col-md-3 col-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="card stat-card border-0 shadow-sm clickable-card"
          onClick={navigateToOrders}
        >
          <div className="card-body text-center">
            <div className="stat-icon bg-primary">
              <FaShoppingBag />
            </div>
            <h3 className="stat-value fw-bold mt-3">{stats.totalOrders}</h3>
            <p className="stat-label text-muted mb-0">Total Orders</p>
            <div className="stat-link mt-2">
              <small className="text-primary">
                View All <FaArrowRight size={10} />
              </small>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wishlist Card */}
      <div className="col-md-3 col-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="card stat-card border-0 shadow-sm clickable-card"
          onClick={navigateToWishlist}
        >
          <div className="card-body text-center">
            <div className="stat-icon bg-danger">
              <FaHeart />
            </div>
            <h3 className="stat-value fw-bold mt-3">{stats.wishlistItems}</h3>
            <p className="stat-label text-muted mb-0">Wishlist Items</p>
            <div className="stat-link mt-2">
              <small className="text-primary">
                View All <FaArrowRight size={10} />
              </small>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews Card */}
      <div className="col-md-3 col-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="card stat-card border-0 shadow-sm clickable-card"
          onClick={navigateToReviews}
        >
          <div className="card-body text-center">
            <div className="stat-icon bg-warning">
              <FaStar />
            </div>
            <h3 className="stat-value fw-bold mt-3">{stats.reviewsWritten}</h3>
            <p className="stat-label text-muted mb-0">Reviews Written</p>
            <div className="stat-link mt-1">
              <small className="text-primary">
                View All <FaArrowRight size={10} />
              </small>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Spending Card */}
      <div className="col-md-3 col-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="card stat-card border-0 shadow-sm"
        >
          <div className="card-body text-center">
            <div className="stat-icon bg-success">
              <FaCreditCard />
            </div>
            <h3 className="stat-value fw-bold mt-3">${stats.totalSpent.toFixed(2)}</h3>
            <p className="stat-label text-muted mb-1">Total Spent</p>
            <small className="text-muted">
              {orders.length > 0 ? `$${(stats.totalSpent / orders.length).toFixed(0)} avg` : 'No orders'}
            </small>
          </div>
        </motion.div>
      </div>
    </div>
  );

  // Navigation Tabs
  const ProfileTabs = () => (
    <div className="profile-tabs mb-4">
      <ul className="nav nav-pills nav-justified flex-nowrap overflow-auto">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <FaUser className="me-2" />
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <FaShoppingBag className="me-2" />
            Orders
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "wishlist" ? "active" : ""}`}
            onClick={() => setActiveTab("wishlist")}
          >
            <FaHeart className="me-2" />
            Wishlist
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            <FaStar className="me-2" />
            Reviews
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <FaShieldAlt className="me-2" />
            Settings
          </button>
        </li>
      </ul>
    </div>
  );

  // Edit Profile Form
  const EditProfileForm = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="card border-0 shadow-sm mb-4"
    >
      <div className="card-header bg-white">
        <h5 className="mb-0">Edit Profile</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              value={editForm.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-control"
              value={editForm.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-control"
              value={editForm.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              value={editForm.location || ""}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Enter your location"
            />
          </div>
          <div className="col-12">
            <label className="form-label">Bio</label>
            <textarea
              className="form-control"
              rows="3"
              value={editForm.bio || ""}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>
      <div className="card-footer bg-white">
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={saveProfile}>
            <FaSave className="me-2" />
            Save Changes
          </button>
          <button className="btn btn-outline-secondary" onClick={cancelEditing}>
            <FaTimes className="me-2" />
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Overview Tab Content - يعرض ملخص من جميع الصفحات
  const OverviewTab = () => (
    <motion.div
      key="overview"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="row">
        <div className="col-lg-8">
          {/* Recent Orders */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Orders</h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={navigateToOrders}
              >
                View All
              </button>
            </div>
            <div className="card-body">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="activity-item border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">Order #{order.id}</h6>
                      <p className="text-muted mb-1">
                        {new Date(order.date).toLocaleDateString()} • {order.items} items
                      </p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="text-end">
                      <strong className="text-primary">${order.total?.toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="text-center py-4">
                  <FaShoppingBag className="text-muted mb-3" size={32} />
                  <p className="text-muted">No orders yet</p>
                  <Link to="/products" className="btn btn-primary btn-sm">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Reviews</h5>
              <button
                className="btn btn-sm btn-outline-warning"
                onClick={navigateToReviews}
              >
                View All
              </button>
            </div>
            <div className="card-body">
              {reviews.slice(0, 2).map((review) => (
                <div key={review.id} className="review-item border-bottom pb-3 mb-3">
                  <div className="d-flex align-items-start">
                    <img
                      src={review.productImage}
                      alt={review.productName}
                      className="rounded me-3"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjI1IiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj5Qcm9kdWN0PC90ZXh0Pjwvc3ZnPg==";
                      }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">{review.productName}</h6>
                        <div className="d-flex align-items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={i < review.rating ? "text-warning" : "text-muted"}
                              size={14}
                            />
                          ))}
                        </div>
                      </div>
                      <h6 className="text-dark mb-1">{review.title}</h6>
                      <p className="text-muted mb-2 small">{review.comment}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {new Date(review.date).toLocaleDateString()}
                        </small>
                        {review.verified && (
                          <span className="badge bg-success small">
                            <FaCheckCircle size={10} className="me-1" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="text-center py-4">
                  <FaStar className="text-muted mb-3" size={32} />
                  <p className="text-muted">No reviews yet</p>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={navigateToReviews}
                  >
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
       
        <div className="col-lg-4">
          {/* Quick Actions */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary text-start" onClick={startEditing}>
                  <FaEdit className="me-2" />
                  Edit Profile
                </button>
                <button
                  className="btn btn-outline-danger text-start"
                  onClick={navigateToWishlist}
                >
                  <FaHeart className="me-2" />
                  View Wishlist ({wishlist.length})
                </button>
                <button
                  className="btn btn-outline-success text-start"
                  onClick={navigateToOrders}
                >
                  <FaHistory className="me-2" />
                  Order History ({orders.length})
                </button>
                <button
                  className="btn btn-outline-warning text-start"
                  onClick={navigateToReviews}
                >
                  <FaStar className="me-2" />
                  My Reviews ({reviews.length})
                </button>
              </div>
            </div>
          </div>

          {/* Wishlist Preview */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Wishlist Preview</h5>
            </div>
            <div className="card-body">
              {wishlist.slice(0, 2).map((item) => (
                <div key={item.id} className="d-flex align-items-center mb-3">
                  <img
                    src={item.image || item.images}
                    alt={item.name || item.title}
                    className="rounded me-3"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjI1IiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj5Qcm9kdWN0PC90ZXh0Pjwvc3ZnPg==";
                    }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1 small">{item.name || item.title}</h6>
                    <div className="d-flex align-items-center">
                      <strong className="text-primary">${item.price}</strong>
                      {item.originalPrice && (
                        <small className="text-muted text-decoration-line-through ms-2">
                          ${item.originalPrice}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {wishlist.length === 0 && (
                <div className="text-center py-3">
                  <FaHeart className="text-muted mb-2" />
                  <p className="text-muted small mb-0">No wishlist items</p>
                </div>
              )}
              {wishlist.length > 2 && (
                <button
                  className="btn btn-outline-danger btn-sm w-100 mt-2"
                  onClick={navigateToWishlist}
                >
                  View All {wishlist.length} Items
                </button>
              )}
            </div>
          </div>

          {/* Account Summary */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">Account Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Member Since</span>
                <strong>{userData.joinDate}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Total Orders</span>
                <strong>{stats.totalOrders}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Wishlist Items</span>
                <strong>{stats.wishlistItems}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Reviews Written</span>
                <strong>{stats.reviewsWritten}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Orders Tab Content - يعرض بيانات حقيقية من صفحة الطلبات
  const OrdersTab = () => (
    <motion.div
      key="orders"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Order History</h5>
          <button className="btn btn-sm btn-outline-primary" onClick={navigateToOrders}>
            View Full History
          </button>
        </div>
        <div className="card-body p-0">
          {orders.length === 0 ? (
            <div className="text-center py-5">
              <FaShoppingBag className="text-muted mb-3" size={48} />
              <h5 className="text-muted">No Orders Yet</h5>
              <p className="text-muted mb-4">You haven't placed any orders yet.</p>
              <Link to="/products" className="btn btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.id}</strong>
                      </td>
                      <td>{new Date(order.date).toLocaleDateString()}</td>
                      <td>{order.items} items</td>
                      <td>
                        <strong className="text-primary">${order.total?.toFixed(2)}</strong>
                      </td>
                      <td>
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <FaEye className="me-1" />
                            View
                          </button>
                          {order.tracking && (
                            <button className="btn btn-sm btn-outline-success">
                              <FaTruck className="me-1" />
                              Track
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  // Wishlist Tab Content - يعرض بيانات حقيقية من صفحة المفضلة
  const WishlistTab = () => (
    <motion.div
      key="wishlist"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">My Wishlist</h5>
          <button className="btn btn-sm btn-outline-danger" onClick={navigateToWishlist}>
            View Full Wishlist
          </button>
        </div>
        <div className="card-body">
          {wishlist.length === 0 ? (
            <div className="text-center py-5">
              <FaHeart className="text-muted mb-3" size={48} />
              <h5 className="text-muted">Your Wishlist is Empty</h5>
              <p className="text-muted mb-4">Save items you love for later.</p>
              <Link to="/products" className="btn btn-danger">
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="row g-3">
              {wishlist.map((item) => (
                <div key={item.id} className="col-md-6 col-lg-4">
                  <div className="card product-card border-0 shadow-sm h-100">
                    <div className="position-relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iMTUwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvZHVjdCBJbWFnZTwvdGV4dD48L3N2Zz4=";
                        }}
                      />
                      {!item.inStock && (
                        <div className="position-absolute top-0 start-0 m-2">
                          <span className="badge bg-danger">Out of Stock</span>
                        </div>
                      )}
                      <button className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2">
                        <FaTrash size={12} />
                      </button>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title">{item.name}</h6>
                      <div className="d-flex align-items-center mb-2">
                        <div className="text-primary fw-bold">${item.price}</div>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <div className="text-muted text-decoration-line-through ms-2 small">
                            ${item.originalPrice}
                          </div>
                        )}
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < Math.floor(item.rating) ? "text-warning" : "text-muted"}
                            size={12}
                          />
                        ))}
                        <small className="text-muted ms-1">({item.rating})</small>
                      </div>
                      <small className="text-muted mb-3">
                        Added on {new Date(item.addedDate).toLocaleDateString()}
                      </small>
                      <div className="mt-auto d-flex gap-2">
                        <button className="btn btn-primary btn-sm flex-fill">
                          <FaShoppingCart className="me-1" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  // Reviews Tab Content
  const ReviewsTab = () => {
    const handleDeleteReview = useCallback((reviewId) => {
      if (window.confirm('Are you sure you want to delete this review?')) {
        deleteReview(reviewId);
      }
    }, [deleteReview]);

    const handleHelpfulClick = useCallback((reviewId) => {
      incrementHelpful(reviewId);
    }, [incrementHelpful]);

    return (
      <motion.div
        key="reviews"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">My Reviews</h5>
            <button className="btn btn-sm btn-outline-warning" onClick={navigateToReviews}>
              View All Reviews
            </button>
          </div>
          <div className="card-body">
            {reviewsLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-5">
                <FaStar className="text-muted mb-3" size={48} />
                <h5 className="text-muted">No Reviews Yet</h5>
                <p className="text-muted mb-4">Share your thoughts on products you've purchased.</p>
                <button className="btn btn-warning" onClick={navigateToReviews}>
                  Write a Review
                </button>
              </div>
            ) : (
              reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="review-item border-bottom pb-3 mb-3">
                  <div className="d-flex align-items-start mb-3">
                    <img
                      src={review.productImage}
                      alt={review.productName}
                      className="rounded me-3"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjMwIiB5PSIzMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj5Qcm9kdWN0PC90ZXh0Pjwvc3ZnPg==";
                      }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">{review.productName}</h6>
                        <div className="d-flex align-items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={i < review.rating ? "text-warning" : "text-muted"}
                              size={14}
                            />
                          ))}
                        </div>
                      </div>
                      <h6 className="text-dark mb-2">{review.title}</h6>
                      <p className="text-muted mb-2">
                        {review.comment.length > 150
                          ? `${review.comment.substring(0, 150)}...`
                          : review.comment
                        }
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Reviewed on {new Date(review.date).toLocaleDateString()}
                        </small>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleHelpfulClick(review.id)}
                          >
                            <FaThumbsUp className="me-1" />
                            Helpful ({review.helpful || 0})
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Settings Tab Content
  const SettingsTab = () => (
    <motion.div
      key="settings"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="row">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <FaBell className="me-2" />
                Notification Preferences
              </h5>
            </div>
            <div className="card-body">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={userData.preferences.newsletter}
                  onChange={(e) => handlePreferenceChange("newsletter", e.target.checked)}
                />
                <label className="form-check-label">Newsletter & Promotions</label>
              </div>
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={userData.preferences.smsNotifications}
                  onChange={(e) => handlePreferenceChange("smsNotifications", e.target.checked)}
                />
                <label className="form-check-label">SMS Notifications</label>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={userData.preferences.emailNotifications}
                  onChange={(e) => handlePreferenceChange("emailNotifications", e.target.checked)}
                />
                <label className="form-check-label">Email Notifications</label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <FaGlobe className="me-2" />
                Language & Currency
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Language</label>
                <select
                  className="form-select"
                  value={userData.preferences.language}
                  onChange={(e) => handlePreferenceChange("language", e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Currency</label>
                <select
                  className="form-select"
                  value={userData.preferences.currency}
                  onChange={(e) => handlePreferenceChange("currency", e.target.value)}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="AED">AED - UAE Dirham</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0 text-danger">
            <FaExclamationTriangle className="me-2" />
            Danger Zone
          </h5>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">Delete Account</h6>
              <p className="text-muted mb-0">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              className="btn btn-outline-danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Order Details Modal
  const OrderDetailsModal = () => (
    <AnimatePresence>
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          onClick={() => setSelectedOrder(null)}
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
                <h5 className="modal-title">Order Details - {selectedOrder.id}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6>Order Information</h6>
                    <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <OrderStatusBadge status={selectedOrder.status} /></p>
                    <p><strong>Items:</strong> {selectedOrder.items}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Payment & Shipping</h6>
                    <p><strong>Total:</strong> ${selectedOrder.total}</p>
                    {selectedOrder.tracking && (
                      <p><strong>Tracking:</strong> {selectedOrder.tracking}</p>
                    )}
                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                  </div>
                </div>
               
                <h6>Shipping Address</h6>
                <p className="text-muted mb-4">
                  {selectedOrder.shippingAddress.street}<br/>
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br/>
                  {selectedOrder.shippingAddress.country}
                </p>
               
                <h6>Products</h6>
                {selectedOrder.products?.map((product) => (
                  <div key={product.id} className="d-flex align-items-center border-bottom pb-2 mb-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="rounded me-3"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{product.name}</h6>
                      <p className="text-muted mb-0">Qty: {product.quantity} • ${product.price} each</p>
                      <small className="text-muted">{product.category}</small>
                    </div>
                    <div className="text-end">
                      <strong className="text-primary">${(product.price * product.quantity).toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
                <button className="btn btn-primary">
                  <FaDownload className="me-2" />
                  Download Invoice
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => (
    <AnimatePresence>
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
          onClick={() => setShowDeleteConfirm(false)}
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
                  Delete Account
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <p className="text-muted">
                  All your data including orders, wishlist, and reviews will be permanently deleted.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger">
                  Delete Account
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Tab Content Renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "orders":
        return <OrdersTab />;
      case "wishlist":
        return <WishlistTab />;
      case "reviews":
        return <ReviewsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="container-fluid py-4 profile-page">
      <div className="row justify-content-center">
        <div className="col-xxl-10">
          {/* Profile Header */}
          <ProfileHeader />

          {/* Statistics Cards */}
          <StatisticsCards />

          {/* Edit Profile Form */}
          <AnimatePresence>
            {isEditing && <EditProfileForm />}
          </AnimatePresence>

          {/* Action Buttons */}
          {!isEditing && (
            <div className="d-flex justify-content-between align-items-center mb-4">
              <ProfileTabs />
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={startEditing}>
                  <FaEdit className="me-2" />
                  Edit Profile
                </button>
                <button className="btn btn-outline-danger">
                  <FaSignOutAlt className="me-2" />
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <OrderDetailsModal />
      <DeleteConfirmationModal />

      {/* Custom CSS */}
      <style>{`
        .profile-page {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          min-height: 100vh;
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .profile-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 20px;
          margin: 0 -12px;
        }

        .avatar-container {
          width: 120px;
          height: 120px;
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border: 4px solid rgba(255,255,255,0.3);
        }

        .avatar-edit-btn {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 36px;
          height: 36px;
          border: 2px solid white;
          background: #667eea;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-edit-btn:hover {
          background: #5a6fd8;
          transform: scale(1.1);
        }

        .stat-card {
          transition: all 0.3s ease;
          border-radius: 15px;
          cursor: pointer;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
        }

        .clickable-card {
          cursor: pointer;
        }

        .clickable-card:hover .stat-link {
          transform: translateX(3px);
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
          font-size: 0.9rem;
        }

        .stat-link {
          transition: all 0.3s ease;
        }

        .profile-tabs .nav-pills .nav-link {
          border-radius: 10px;
          padding: 1rem 1.5rem;
          color: #6c757d;
          border: none;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .profile-tabs .nav-pills .nav-link.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .profile-tabs .nav-pills .nav-link:hover:not(.active) {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

        .activity-item:last-child,
        .review-item:last-child {
          border-bottom: none !important;
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
        }

        .table th {
          border-top: none;
          font-weight: 600;
          color: #6c757d;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .product-card {
          transition: all 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }

        .btn {
          border-radius: 10px;
          transition: all 0.3s ease;
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

        .badge {
          border-radius: 8px;
          font-size: 0.75rem;
          padding: 0.35em 0.65em;
        }

        /* تحسينات الأداء */
        .motion-div {
          will-change: transform;
        }

        /* تأكد من أن كل شيء مرئي */
        .container-fluid, .row, .col-xxl-10 {
          opacity: 1 !important;
          visibility: visible !important;
        }

        @media (max-width: 768px) {
          .profile-header {
            border-radius: 0;
            margin: 0 -12px;
          }

          .avatar-container {
            width: 100px;
            height: 100px;
          }

          .stat-value {
            font-size: 1.5rem;
          }

          .profile-tabs .nav-link {
            padding: 0.75rem 1rem;
            font-size: 0.9rem;
          }

          .d-flex.justify-content-between.align-items-center.mb-4 {
            flex-direction: column;
            gap: 1rem;
          }

          .profile-tabs {
            width: 100%;
            overflow-x: auto;
          }
        }

        @media (max-width: 576px) {
          .stat-card .card-body {
            padding: 1rem;
          }

          .stat-icon {
            width: 50px;
            height: 50px;
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;