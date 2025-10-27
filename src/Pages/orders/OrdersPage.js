import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaDownload,
  FaPrint,
  FaShare,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaExclamationTriangle,
  FaBox,
  FaCreditCard,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaShoppingBag,
  FaArrowLeft,
  FaRedo,
  FaUndo,
  FaCalendarAlt,
  FaShoppingCart,
  FaTags,
  FaHeart,
  FaRegHeart,
  FaExpand,
  FaShoppingBasket
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { analyticsService } from "../../services/analyticsService";
import "../../styles/Page.css";

function OrdersPage() {
  // Orders data
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 299.97,
      items: [
        {
          id: 1,
          name: "Wireless Bluetooth Headphones",
          price: 99.99,
          quantity: 1,
          image: "/api/placeholder/300/300",
          rating: 4.5
        },
        {
          id: 2,
          name: "Smartphone Case",
          price: 19.99,
          quantity: 2,
          image: "/api/placeholder/300/300",
          rating: 4.2
        }
      ],
      shipping: {
        address: "123 Main St, New York, NY 10001",
        carrier: "FedEx",
        tracking: "FD123456789",
        estimatedDelivery: "Jan 18, 2024"
      },
      payment: {
        method: "Credit Card",
        last4: "4242",
        status: "paid"
      }
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "shipped",
      total: 156.50,
      items: [
        {
          id: 3,
          name: "Laptop Backpack",
          price: 49.99,
          quantity: 1,
          image: "/api/placeholder/300/300",
          rating: 4.7
        },
        {
          id: 4,
          name: "USB-C Cable",
          price: 15.99,
          quantity: 3,
          image: "/api/placeholder/300/300",
          rating: 4.0
        }
      ],
      shipping: {
        address: "456 Oak Ave, Los Angeles, CA 90210",
        carrier: "UPS",
        tracking: "1Z123456789",
        estimatedDelivery: "Jan 14, 2024"
      },
      payment: {
        method: "PayPal",
        status: "paid"
      }
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      status: "processing",
      total: 89.99,
      items: [
        {
          id: 5,
          name: "Wireless Mouse",
          price: 29.99,
          quantity: 1,
          image: "/api/placeholder/300/300",
          rating: 4.3
        },
        {
          id: 6,
          name: "Mechanical Keyboard",
          price: 59.99,
          quantity: 1,
          image: "/api/placeholder/300/300",
          rating: 4.8
        }
      ],
      shipping: {
        address: "789 Pine Rd, Chicago, IL 60601",
        carrier: "USPS",
        tracking: null,
        estimatedDelivery: "Jan 12, 2024"
      },
      payment: {
        method: "Credit Card",
        last4: "1234",
        status: "paid"
      }
    }
  ]);

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteItems, setFavoriteItems] = useState([]);

  // تتبع أحداث التحليلات
  const trackOrderAction = useCallback((action, metadata = {}) => {
    analyticsService.trackUserAction(`order_${action}`, {
      orders_count: orders.length,
      ...metadata
    });
  }, [orders.length]);

  const trackOrderView = useCallback((order, viewType = 'list') => {
    analyticsService.trackUserAction(`order_view_${viewType}`, {
      order_id: order.id,
      order_status: order.status,
      order_total: order.total,
      items_count: order.items.length,
      order_date: order.date
    });
  }, []);

  const trackProductAction = useCallback((action, product, order, metadata = {}) => {
    analyticsService.trackUserAction(`order_product_${action}`, {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      order_id: order.id,
      order_status: order.status,
      ...metadata
    });
  }, []);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.items.some(item => 
                            item.name.toLowerCase().includes(searchTerm.toLowerCase())
                          );
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      
      const matchesDate = dateFilter === "all" || 
                         (dateFilter === "last30" && 
                          new Date(order.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
                         (dateFilter === "last90" && 
                          new Date(order.date) >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

  // Order statistics
  const orderStats = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter(order => order.status === 'delivered').length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    
    return { total, delivered, totalSpent };
  }, [orders]);

  // Status configuration
  const statusConfig = {
    delivered: {
      icon: FaCheckCircle,
      color: "success",
      bgColor: "bg-success",
      text: "Delivered",
      description: "Your order has been delivered"
    },
    shipped: {
      icon: FaTruck,
      color: "primary", 
      bgColor: "bg-primary",
      text: "Shipped",
      description: "Your order is on the way"
    },
    processing: {
      icon: FaClock,
      color: "warning",
      bgColor: "bg-warning", 
      text: "Processing",
      description: "We're preparing your order"
    },
    cancelled: {
      icon: FaTimesCircle,
      color: "danger",
      bgColor: "bg-danger",
      text: "Cancelled",
      description: "This order has been cancelled"
    }
  };

  // Handlers with analytics tracking
  const toggleFavorite = useCallback((itemId, product, order) => {
    const wasFavorite = favoriteItems.includes(itemId);
    
    setFavoriteItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );

    // تتبع إضافة/إزالة من المفضلة
    trackProductAction(
      wasFavorite ? 'remove_favorite' : 'add_favorite', 
      product, 
      order
    );
  }, [favoriteItems, trackProductAction]);

  const handleSearch = useCallback((term) => {
    if (term) {
      trackOrderAction('search', {
        search_term: term,
        results_count: filteredOrders.length
      });
    }
    setSearchTerm(term);
  }, [filteredOrders.length, trackOrderAction]);

  const handleFilterChange = useCallback((filterType, value) => {
    trackOrderAction('filter_change', {
      filter_type: filterType,
      filter_value: value
    });
    
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
  }, [trackOrderAction]);

  const handleOrderSelect = useCallback((order) => {
    trackOrderView(order, 'detail');
    setSelectedOrder(order);
  }, [trackOrderView]);

  const handleTrackOrder = useCallback((order) => {
    trackOrderAction('track', {
      order_id: order.id,
      carrier: order.shipping.carrier,
      tracking_number: order.shipping.tracking
    });
    
    // في التطبيق الحقيقي، هذا سيفتح صفحة التتبع
    alert(`Tracking order ${order.id} with ${order.shipping.carrier}`);
  }, [trackOrderAction]);

  const handleDownloadInvoice = useCallback((order) => {
    trackOrderAction('download_invoice', {
      order_id: order.id,
      order_total: order.total
    });
    
    // في التطبيق الحقيقي، هذا سيحمل الفاتورة
    alert(`Downloading invoice for order ${order.id}`);
  }, [trackOrderAction]);

  const handleShareOrder = useCallback((order) => {
    trackOrderAction('share', {
      order_id: order.id,
      items_count: order.items.length
    });
    
    // في التطبيق الحقيقي، هذا سيشارك الطلب
    if (navigator.share) {
      navigator.share({
        title: `My Order ${order.id}`,
        text: `Check out my order from ${new Date(order.date).toLocaleDateString()}`,
        url: window.location.href,
      });
    } else {
      alert(`Share order ${order.id}`);
    }
  }, [trackOrderAction]);

  const handleRateProducts = useCallback((order) => {
    trackOrderAction('rate_products', {
      order_id: order.id,
      items_count: order.items.length
    });
    
    // في التطبيق الحقيقي، هذا سيفتح صفحة التقييم
    alert(`Rate products from order ${order.id}`);
  }, [trackOrderAction]);

  const clearFilters = useCallback(() => {
    trackOrderAction('clear_filters');
    
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
  }, [trackOrderAction]);

  // تتبع عرض صفحة الطلبات
  useEffect(() => {
    analyticsService.trackPageView('orders', {
      orders_count: orders.length,
      total_spent: orderStats.totalSpent
    });
    
    trackOrderAction('page_view');
  }, []);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const config = statusConfig[status];
    const IconComponent = config.icon;
    
    return (
      <span className={`badge ${config.bgColor} d-flex align-items-center`}>
        <IconComponent className="me-1" size={12} />
        {config.text}
      </span>
    );
  };

  // Product card component
  const ProductCard = ({ item, showActions = true, size = "medium", order }) => {
    const isFavorite = favoriteItems.includes(item.id);
    
    return (
      <motion.div 
        className={`product-card ${size} rounded-3 overflow-hidden position-relative`}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="product-image-container position-relative">
          <img
            src={item.image}
            alt={item.name}
            className={`product-image w-100 ${size === 'large' ? 'h-100' : ''}`}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iMTUwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
            }}
          />
          
          {/* Product badges */}
          <div className="product-badges position-absolute top-0 start-0 p-2">
            {item.rating >= 4 && (
              <span className="badge bg-warning text-dark me-1">
                <FaStar size={10} className="me-1" />
                Top Rated
              </span>
            )}
            {item.price < 50 && (
              <span className="badge bg-success me-1">Budget</span>
            )}
          </div>
          
          {/* Favorite button */}
          {showActions && (
            <button 
              className="btn-favorite position-absolute top-0 end-0 m-2"
              onClick={() => toggleFavorite(item.id, item, order)}
            >
              {isFavorite ? (
                <FaHeart className="text-danger" size={18} />
              ) : (
                <FaRegHeart className="text-white" size={18} />
              )}
            </button>
          )}
          
          {/* Quick view button */}
          {showActions && (
            <div className="product-overlay position-absolute bottom-0 start-0 w-100 p-3 d-flex justify-content-center">
              <button 
                className="btn btn-primary btn-sm rounded-pill px-3"
                onClick={() => trackProductAction('quick_view', item, order)}
              >
                <FaEye className="me-1" />
                Quick View
              </button>
            </div>
          )}
        </div>
        
        <div className="product-info p-3">
          <h6 className="product-name mb-2 fw-bold">{item.name}</h6>
          
          {/* Rating */}
          <div className="d-flex align-items-center mb-2">
            <div className="d-flex me-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < item.rating ? "text-warning" : "text-muted"}
                  size={12}
                />
              ))}
            </div>
            {item.rating > 0 && (
              <small className="text-muted">({item.rating}.0)</small>
            )}
          </div>
          
          {/* Price and quantity */}
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="text-primary fw-bold fs-6">${item.price}</span>
              {item.quantity > 1 && (
                <small className="text-muted ms-1">× {item.quantity}</small>
              )}
            </div>
            {showActions && (
              <button 
                className="btn btn-outline-primary btn-sm rounded-circle"
                onClick={() => trackProductAction('reorder_click', item, order)}
              >
                <FaShoppingBasket size={12} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Order card component
  const OrderCard = ({ order }) => {
    const config = statusConfig[order.status];
    const IconComponent = config.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card order-card border-0 shadow-sm mb-4"
      >
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1 fw-bold">{order.id}</h6>
              <small className="text-muted">
                <FaCalendarAlt className="me-1" />
                {new Date(order.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </small>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </div>
        
        <div className="card-body">
          {/* Order Items - Improved display */}
          <div className="order-items mb-3">
            <h6 className="fw-bold mb-3 d-flex align-items-center">
              <FaShoppingBag className="me-2 text-primary" />
              Products ({order.items.length})
            </h6>
            
            <div className="row g-3">
              {order.items.slice(0, 3).map((item) => (
                <div key={item.id} className="col-md-4 col-sm-6">
                  <ProductCard item={item} size="small" order={order} />
                </div>
              ))}
            </div>
            
            {order.items.length > 3 && (
              <div className="text-center mt-3">
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => trackOrderView(order, 'expanded')}
                >
                  +{order.items.length - 3} more items
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="order-summary border-top pt-3">
            <div className="row text-center">
              <div className="col-4">
                <div className="summary-item">
                  <small className="text-muted d-block">Items</small>
                  <strong>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</strong>
                </div>
              </div>
              <div className="col-4">
                <div className="summary-item">
                  <small className="text-muted d-block">Total</small>
                  <strong className="text-primary">${order.total}</strong>
                </div>
              </div>
              <div className="col-4">
                <div className="summary-item">
                  <small className="text-muted d-block">Payment</small>
                  <small className={`badge bg-${order.payment.status === 'paid' ? 'success' : 'warning'}`}>
                    {order.payment.status}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-footer bg-white">
          <div className="d-flex gap-2 flex-wrap">
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => handleOrderSelect(order)}
            >
              <FaEye className="me-1" />
              View Details
            </button>
            {order.shipping.tracking && (
              <button 
                className="btn btn-outline-success btn-sm"
                onClick={() => handleTrackOrder(order)}
              >
                <FaTruck className="me-1" />
                Track Order
              </button>
            )}
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handleDownloadInvoice(order)}
            >
              <FaDownload className="me-1" />
              Invoice
            </button>
            {order.status === 'delivered' && (
              <button 
                className="btn btn-outline-warning btn-sm"
                onClick={() => handleRateProducts(order)}
              >
                <FaStar className="me-1" />
                Rate Items
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Order detail modal
  const OrderDetailModal = () => {
    if (!selectedOrder) return null;
    
    const config = statusConfig[selectedOrder.status];
    const IconComponent = config.icon;
    
    return (
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="modal-dialog modal-xl modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title d-flex align-items-center">
                    <FaShoppingBag className="me-2 text-primary" />
                    Order Details - {selectedOrder.id}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedOrder(null)}
                  ></button>
                </div>
                
                <div className="modal-body">
                  {/* Order Status */}
                  <div className={`alert alert-${config.color} d-flex align-items-center`}>
                    <IconComponent className="me-2" size={20} />
                    <div>
                      <strong>{config.text}</strong>
                      <div className="small">{config.description}</div>
                    </div>
                  </div>

                  <div className="row">
                    {/* Order Items - Improved display */}
                    <div className="col-lg-7">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0">Order Items ({selectedOrder.items.length})</h6>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => trackOrderAction('save_all_items', { order_id: selectedOrder.id })}
                          >
                            <FaHeart className="me-1" />
                            Save All
                          </button>
                          <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleShareOrder(selectedOrder)}
                          >
                            <FaShare className="me-1" />
                            Share
                          </button>
                        </div>
                      </div>
                      
                      <div className="row g-3">
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="col-md-6">
                            <ProductCard item={item} showActions={true} size="large" order={selectedOrder} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Information */}
                    <div className="col-lg-5">
                      <h6 className="fw-bold mb-3">Order Information</h6>
                      
                      {/* Shipping Info */}
                      <div className="card border-0 bg-light mb-3">
                        <div className="card-body">
                          <h6 className="card-title d-flex align-items-center">
                            <FaTruck className="me-2 text-primary" />
                            Shipping Information
                          </h6>
                          <p className="mb-1 small">
                            <FaMapMarkerAlt className="me-2" />
                            {selectedOrder.shipping.address}
                          </p>
                          <p className="mb-1 small">
                            <strong>Carrier:</strong> {selectedOrder.shipping.carrier}
                          </p>
                          {selectedOrder.shipping.tracking && (
                            <p className="mb-1 small">
                              <strong>Tracking:</strong> 
                              <a 
                                href="#" 
                                className="ms-1 text-primary"
                                onClick={() => handleTrackOrder(selectedOrder)}
                              >
                                {selectedOrder.shipping.tracking}
                              </a>
                            </p>
                          )}
                          <p className="mb-0 small">
                            <strong>Estimated Delivery:</strong> {selectedOrder.shipping.estimatedDelivery}
                          </p>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="card border-0 bg-light mb-3">
                        <div className="card-body">
                          <h6 className="card-title d-flex align-items-center">
                            <FaCreditCard className="me-2 text-primary" />
                            Payment Information
                          </h6>
                          <p className="mb-1 small">
                            <strong>Method:</strong> {selectedOrder.payment.method}
                            {selectedOrder.payment.last4 && ` (****${selectedOrder.payment.last4})`}
                          </p>
                          <p className="mb-0 small">
                            <strong>Status:</strong> 
                            <span className={`badge bg-${selectedOrder.payment.status === 'paid' ? 'success' : 'warning'} ms-2`}>
                              {selectedOrder.payment.status}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="card border-0 bg-light">
                        <div className="card-body">
                          <h6 className="card-title">Order Summary</h6>
                          <div className="d-flex justify-content-between mb-1">
                            <small>Subtotal:</small>
                            <small>${selectedOrder.total}</small>
                          </div>
                          <div className="d-flex justify-content-between mb-1">
                            <small>Shipping:</small>
                            <small>$0.00</small>
                          </div>
                          <div className="d-flex justify-content-between mb-1">
                            <small>Tax:</small>
                            <small>$0.00</small>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between fw-bold">
                            <span>Total:</span>
                            <span className="text-primary">${selectedOrder.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <div className="d-flex gap-2 flex-wrap">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => trackOrderAction('print_invoice', { order_id: selectedOrder.id })}
                    >
                      <FaPrint className="me-1" />
                      Print Invoice
                    </button>
                    <button 
                      className="btn btn-outline-success"
                      onClick={() => handleDownloadInvoice(selectedOrder)}
                    >
                      <FaDownload className="me-1" />
                      Download PDF
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => handleShareOrder(selectedOrder)}
                    >
                      <FaShare className="me-1" />
                      Share Order
                    </button>
                    {selectedOrder.status === 'delivered' && (
                      <button 
                        className="btn btn-warning"
                        onClick={() => handleRateProducts(selectedOrder)}
                      >
                        <FaStar className="me-1" />
                        Rate Products
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="container-fluid py-4 orders-page">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 fw-bold mb-2">My Orders</h1>
              <p className="text-muted mb-0">
                Track and manage your orders
              </p>
            </div>
            <Link to="/products" className="btn btn-primary">
              <FaShoppingBag className="me-2" />
              Continue Shopping
            </Link>
          </div>

          {/* Statistics */}
          <div className="row g-3 mb-4">
            <div className="col-md-3 col-6">
              <div className="card stat-card border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="stat-icon bg-primary">
                    <FaShoppingBag />
                  </div>
                  <h3 className="stat-value fw-bold mt-3">{orderStats.total}</h3>
                  <p className="stat-label text-muted mb-0">Total Orders</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card stat-card border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="stat-icon bg-success">
                    <FaCheckCircle />
                  </div>
                  <h3 className="stat-value fw-bold mt-3">{orderStats.delivered}</h3>
                  <p className="stat-label text-muted mb-0">Delivered</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card stat-card border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="stat-icon bg-warning">
                    <FaClock />
                  </div>
                  <h3 className="stat-value fw-bold mt-3">
                    {orders.filter(o => o.status === 'processing' || o.status === 'shipped').length}
                  </h3>
                  <p className="stat-label text-muted mb-0">In Progress</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card stat-card border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="stat-icon bg-info">
                    <FaCreditCard />
                  </div>
                  <h3 className="stat-value fw-bold mt-3">${orderStats.totalSpent}</h3>
                  <p className="stat-label text-muted mb-0">Total Spent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <FaSearch className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search orders or products..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={dateFilter}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="last90">Last 90 Days</option>
                  </select>
                </div>
              </div>
              
              {/* Active Filters */}
              {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
                <div className="mt-3 d-flex align-items-center gap-2 flex-wrap">
                  <small className="text-muted">Active filters:</small>
                  {searchTerm && (
                    <span className="badge bg-primary">
                      Search: {searchTerm}
                      <button 
                        className="btn-close btn-close-white ms-1"
                        onClick={() => setSearchTerm("")}
                      />
                    </span>
                  )}
                  {statusFilter !== 'all' && (
                    <span className="badge bg-secondary">
                      Status: {statusFilter}
                      <button 
                        className="btn-close btn-close-white ms-1"
                        onClick={() => setStatusFilter("all")}
                      />
                    </span>
                  )}
                  {dateFilter !== 'all' && (
                    <span className="badge bg-info">
                      Date: {dateFilter === 'last30' ? 'Last 30 Days' : 'Last 90 Days'}
                      <button 
                        className="btn-close btn-close-white ms-1"
                        onClick={() => setDateFilter("all")}
                      />
                    </span>
                  )}
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={clearFilters}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-5"
            >
              <div className="fs-1 mb-3">📦</div>
              <h4 className="text-muted mb-3">No orders found</h4>
              <p className="text-muted mb-4">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                  ? "Try adjusting your search criteria" 
                  : "You haven't placed any orders yet"}
              </p>
              <Link to="/products" className="btn btn-primary">
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="row">
              <div className="col-12">
                {filteredOrders.map((order, index) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal />

      {/* Custom CSS */}
      <style>{`
        .orders-page {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          min-height: 100vh;
        }

        .order-card {
          transition: all 0.3s ease;
          border-radius: 15px;
          overflow: hidden;
        }

        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }

        /* Product Card Styles */
        .product-card {
          background: white;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .product-card:hover {
          box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        }

        .product-card.small {
          height: 100%;
        }

        .product-card.medium .product-image {
          height: 200px;
          object-fit: cover;
        }

        .product-card.large .product-image {
          height: 250px;
          object-fit: cover;
        }

        .product-card.small .product-image {
          height: 120px;
          object-fit: cover;
        }

        .product-image-container {
          overflow: hidden;
        }

        .product-image {
          transition: transform 0.5s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-overlay {
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .product-card:hover .product-overlay {
          opacity: 1;
        }

        .btn-favorite {
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(5px);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .product-card:hover .btn-favorite {
          opacity: 1;
        }

        .btn-favorite:hover {
          background: rgba(255,255,255,0.3);
          transform: scale(1.1);
        }

        .product-name {
          font-size: 0.9rem;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-badges .badge {
          font-size: 0.65rem;
          padding: 0.25em 0.5em;
        }

        .stat-card {
          transition: all 0.3s ease;
          border-radius: 15px;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: white;
          font-size: 1.25rem;
        }

        .stat-value {
          color: #2c3e50;
          font-size: 1.75rem;
        }

        .stat-label {
          font-size: 0.9rem;
        }

        .badge {
          border-radius: 8px;
          font-size: 0.75rem;
          padding: 0.35em 0.65em;
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

        @media (max-width: 768px) {
          .stat-value {
            font-size: 1.5rem;
          }
          
          .stat-icon {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }

          .product-card.large .product-image {
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
}

export default OrdersPage;