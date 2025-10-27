import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  FaUser, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaMapMarkerAlt,
  FaPhone,
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
  FaLock,
  FaGlobe,
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/Page.css";

function ProfilePage() {
  // User data state
  const [userData, setUserData] = useState({
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

  // Mock data for orders, wishlist, etc.
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      date: "2024-03-15",
      total: 149.99,
      status: "delivered",
      items: 3,
      tracking: "TRK123456789"
    },
    {
      id: "ORD-002", 
      date: "2024-03-10",
      total: 89.50,
      status: "shipped",
      items: 2,
      tracking: "TRK987654321"
    },
    {
      id: "ORD-003",
      date: "2024-03-05",
      total: 299.99,
      status: "processing",
      items: 1,
      tracking: null
    }
  ]);

  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: 79.99,
      image: "assets/img/u_10207226.jpg",
      addedDate: "2024-03-12"
    },
    {
      id: 2,
      name: "Smart Watch Series 5",
      price: 199.99,
      image: "assets/img/apple_mww12ll_a_watch_5_gps_1506024.jpg", 
      addedDate: "2024-03-08"
    }
  ]);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      product: "Wireless Earbuds",
      rating: 5,
      comment: "Excellent sound quality and battery life!",
      date: "2024-03-14"
    },
    {
      id: 2,
      product: "Laptop Backpack",
      rating: 4,
      comment: "Good quality but could be more spacious.",
      date: "2024-03-09"
    }
  ]);

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [editForm, setEditForm] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize edit form
  const startEditing = useCallback(() => {
    setEditForm({ ...userData });
    setIsEditing(true);
  }, [userData]);

  // Cancel editing
  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setEditForm({});
  }, []);

  // Save profile changes
  const saveProfile = useCallback(() => {
    setUserData(editForm);
    setIsEditing(false);
    // Here you would typically make an API call to save the data
  }, [editForm]);

  // Handle form input changes
  const handleInputChange = useCallback((field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle preference changes
  const handlePreferenceChange = useCallback((preference, value) => {
    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }));
  }, []);

  // Statistics
  const stats = useMemo(() => ({
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
    wishlistItems: wishlist.length,
    reviewsWritten: reviews.length
  }), [orders, wishlist, reviews]);

  // Order status badge
  const OrderStatusBadge = ({ status }) => {
    const statusConfig = {
      delivered: { class: "bg-success", text: "Delivered", icon: FaCheckCircle },
      shipped: { class: "bg-primary", text: "Shipped", icon: FaTruck },
      processing: { class: "bg-warning", text: "Processing", icon: FaBoxOpen },
      cancelled: { class: "bg-danger", text: "Cancelled", icon: FaTimes }
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
        />
        <button className="btn btn-primary btn-sm avatar-edit-btn rounded-circle">
          <FaCamera size={14} />
        </button>
      </div>
      <h1 className="h2 fw-bold mb-2">{userData.name}</h1>
      <p className="text-muted mb-3">{userData.bio}</p>
      <div className="d-flex justify-content-center gap-3 flex-wrap">
        <div className="d-flex align-items-center text-muted">
          <FaMapMarkerAlt className="me-2" />
          <small>{userData.location}</small>
        </div>
        <div className="d-flex align-items-center text-muted">
          <FaCalendarAlt className="me-2" />
          <small>Member since {userData.joinDate}</small>
        </div>
      </div>
    </motion.div>
  );

  // Statistics Cards
  const StatisticsCards = () => (
    <div className="row g-3 mb-5">
      <div className="col-md-3 col-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="card stat-card border-0 shadow-sm"
        >
          <div className="card-body text-center">
            <div className="stat-icon bg-primary">
              <FaShoppingBag />
            </div>
            <h3 className="stat-value fw-bold mt-3">{stats.totalOrders}</h3>
            <p className="stat-label text-muted mb-0">Total Orders</p>
          </div>
        </motion.div>
      </div>
      <div className="col-md-3 col-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="card stat-card border-0 shadow-sm"
        >
          <div className="card-body text-center">
            <div className="stat-icon bg-success">
              <FaCreditCard />
            </div>
            <h3 className="stat-value fw-bold mt-3">${stats.totalSpent}</h3>
            <p className="stat-label text-muted mb-0">Total Spent</p>
          </div>
        </motion.div>
      </div>
      <div className="col-md-3 col-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="card stat-card border-0 shadow-sm"
        >
          <div className="card-body text-center">
            <div className="stat-icon bg-danger">
              <FaHeart />
            </div>
            <h3 className="stat-value fw-bold mt-3">{stats.wishlistItems}</h3>
            <p className="stat-label text-muted mb-0">Wishlist Items</p>
          </div>
        </motion.div>
      </div>
      <div className="col-md-3 col-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="card stat-card border-0 shadow-sm"
        >
          <div className="card-body text-center">
            <div className="stat-icon bg-warning">
              <FaStar />
            </div>
            <h3 className="stat-value fw-bold mt-3">{stats.reviewsWritten}</h3>
            <p className="stat-label text-muted mb-0">Reviews Written</p>
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
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={editForm.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={editForm.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-control"
              value={editForm.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              value={editForm.location || ""}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Bio</label>
            <textarea
              className="form-control"
              rows="3"
              value={editForm.bio || ""}
              onChange={(e) => handleInputChange("bio", e.target.value)}
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

  // Overview Tab Content
  const OverviewTab = () => (
    <motion.div
      key="overview"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Activity</h5>
              <Link to="/orders" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
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
                      <strong className="text-primary">${order.total}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
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
                <Link to="/wishlist" className="btn btn-outline-danger text-start">
                  <FaHeart className="me-2" />
                  View Wishlist
                </Link>
                <Link to="/orders" className="btn btn-outline-success text-start">
                  <FaHistory className="me-2" />
                  Order History
                </Link>
                <button className="btn btn-outline-warning text-start">
                  <FaBell className="me-2" />
                  Notification Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Orders Tab Content
  const OrdersTab = () => (
    <motion.div
      key="orders"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">Order History</h5>
        </div>
        <div className="card-body p-0">
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
                      <strong className="text-primary">${order.total}</strong>
                    </td>
                    <td>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-primary">
                          View
                        </button>
                        {order.tracking && (
                          <button className="btn btn-sm btn-outline-success">
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
        </div>
      </div>
    </motion.div>
  );

  // Wishlist Tab Content
  const WishlistTab = () => (
    <motion.div
      key="wishlist"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="row g-3">
        {wishlist.map((item) => (
          <div key={item.id} className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="row g-0 h-100">
                <div className="col-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid rounded-start h-100"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="col-8">
                  <div className="card-body d-flex flex-column h-100">
                    <h6 className="card-title">{item.name}</h6>
                    <p className="card-text text-primary fw-bold mb-2">${item.price}</p>
                    <small className="text-muted mb-3">
                      Added on {new Date(item.addedDate).toLocaleDateString()}
                    </small>
                    <div className="mt-auto d-flex gap-2">
                      <button className="btn btn-primary btn-sm flex-fill">
                        Add to Cart
                      </button>
                      <button className="btn btn-outline-danger btn-sm">
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  // Reviews Tab Content
  const ReviewsTab = () => (
    <motion.div
      key="reviews"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">My Reviews</h5>
        </div>
        <div className="card-body">
          {reviews.map((review) => (
            <div key={review.id} className="review-item border-bottom pb-3 mb-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="mb-0">{review.product}</h6>
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
              <p className="text-muted mb-2">{review.comment}</p>
              <small className="text-muted">
                Reviewed on {new Date(review.date).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

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
                <select className="form-select" defaultValue={userData.preferences.language}>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Currency</label>
                <select className="form-select" defaultValue={userData.preferences.currency}>
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

      {/* Custom CSS */}
      <style>{`
        .profile-page {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          min-height: 100vh;
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
        }

        .stat-card {
          transition: all 0.3s ease;
          border-radius: 15px;
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

        .activity-item:last-child {
          border-bottom: none !important;
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
        }

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
      `}</style>
    </div>
  );
}

export default ProfilePage;