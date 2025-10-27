import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  FaCheck
} from "react-icons/fa";

function Confirmation() {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Mock order data - in real app, this would come from context or API
  useEffect(() => {
    const mockOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      items: [
        { id: 1, name: "Premium Wireless Headphones", quantity: 1, price: 199.99, image: "/assets/img/headphones.jpg" },
        { id: 2, name: "Phone Case", quantity: 2, price: 24.99, image: "/assets/img/phone-case.jpg" }
      ],
      shipping: {
        method: "Express Shipping",
        cost: 15.00,
        estimatedDelivery: "2-3 business days",
        address: {
          name: "John Doe",
          street: "123 Main Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States"
        }
      },
      payment: {
        method: "Credit Card",
        lastFour: "4242",
        total: 264.97
      },
      tracking: {
        number: `TRK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: "processing"
      }
    };
    
    setOrderDetails(mockOrder);
  }, []);

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
    { status: "ordered", label: "Order Placed", time: "Just now", active: true },
    { status: "confirmed", label: "Order Confirmed", time: "Within 5 min", active: false },
    { status: "shipped", label: "Shipped", time: "1-2 days", active: false },
    { status: "delivered", label: "Delivered", time: "3-5 days", active: false }
  ];

  // Recommended products
  const recommendedProducts = [
    { id: 1, name: "Wireless Earbuds", price: 129.99, image: "/assets/img/earbuds.jpg", category: "Electronics" },
    { id: 2, name: "Smart Watch", price: 299.99, image: "/assets/img/smartwatch.jpg", category: "Electronics" },
    { id: 3, name: "Laptop Sleeve", price: 39.99, image: "/assets/img/laptop-sleeve.jpg", category: "Accessories" },
    { id: 4, name: "Phone Stand", price: 19.99, image: "/assets/img/phone-stand.jpg", category: "Accessories" }
  ];

  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    alert("Invoice download would start here!");
  };

  const handleShareOrder = () => {
    setShowShareOptions(true);
  };

  if (!orderDetails) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading your order details...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
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
        
        <h1 className="fw-bold mb-3 display-4">
          Order Confirmed!
        </h1>
        <p className="fs-5 text-muted mb-4 mx-auto" style={{ maxWidth: '600px' }}>
          Thank you for your purchase! We've sent a confirmation email with your order details and tracking information.
        </p>
        
        {/* Order ID & Quick Actions */}
        <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap mb-4">
          <div className="bg-light rounded-3 px-4 py-2">
            <strong>Order ID:</strong> <span className="text-primary">{orderDetails.id}</span>
          </div>
          <div className="d-flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadInvoice}
              className="btn btn-outline-primary btn-sm"
            >
              <FaDownload className="me-2" />
              Download Invoice
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShareOrder}
              className="btn btn-outline-secondary btn-sm"
            >
              <FaShare className="me-2" />
              Share Order
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
            className="card border-0 shadow-sm mb-4"
          >
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-semibold">
                <FaClock className="me-2 text-primary" />
                Order Status
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row">
                {orderTimeline.map((step, index) => (
                  <div key={step.status} className="col-3 text-center">
                    <div className="d-flex flex-column align-items-center">
                      <div 
                        className={`rounded-circle d-flex align-items-center justify-content-center mb-3 ${
                          step.active 
                            ? 'bg-primary text-white' 
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
                    {index < orderTimeline.length - 1 && (
                      <div 
                        className={`position-absolute top-30 start-50 w-75 h-2 ${
                          step.active ? 'bg-primary' : 'bg-light'
                        }`}
                        style={{ 
                          transform: 'translate(50%, -50%)',
                          zIndex: -1 
                        }}
                      />
                    )}
                  </div>
                ))}
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
                className="card border-0 shadow-sm h-100"
              >
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="mb-0 fw-semibold">
                    <FaBox className="me-2 text-primary" />
                    Order Summary
                  </h5>
                </div>
                <div className="card-body">
                  {orderDetails.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="rounded-3"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="fw-semibold mb-1 small">{item.name}</h6>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">Qty: {item.quantity}</small>
                          <span className="fw-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>${(orderDetails.payment.total - orderDetails.shipping.cost).toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping:</span>
                      <span>${orderDetails.shipping.cost.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold fs-5">
                      <span>Total:</span>
                      <span className="text-primary">${orderDetails.payment.total.toFixed(2)}</span>
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
                className="card border-0 shadow-sm h-100"
              >
                <div className="card-header bg-white border-0 py-3">
                  <h5 className="mb-0 fw-semibold">
                    <FaTruck className="me-2 text-primary" />
                    Shipping & Tracking
                  </h5>
                </div>
                <div className="card-body">
                  {/* Shipping Address */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-2">
                      <FaMapMarkerAlt className="me-2 text-muted" />
                      Shipping Address
                    </h6>
                    <p className="text-muted small mb-0">
                      {orderDetails.shipping.address.name}<br/>
                      {orderDetails.shipping.address.street}<br/>
                      {orderDetails.shipping.address.city}, {orderDetails.shipping.address.state} {orderDetails.shipping.address.zipCode}<br/>
                      {orderDetails.shipping.address.country}
                    </p>
                  </div>

                  {/* Shipping Method */}
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-2">
                      <FaShippingFast className="me-2 text-muted" />
                      Shipping Method
                    </h6>
                    <p className="text-muted small mb-0">
                      {orderDetails.shipping.method}<br/>
                      <small>Estimated delivery: {orderDetails.shipping.estimatedDelivery}</small>
                    </p>
                  </div>

                  {/* Tracking Information */}
                  <div>
                    <h6 className="fw-semibold mb-2">
                      📦 Tracking Number
                    </h6>
                    <div className="bg-light rounded-3 p-3">
                      <code className="text-primary fw-bold">{orderDetails.tracking.number}</code>
                      <small className="d-block text-muted mt-1">
                        Tracking updates will be sent to your email
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
            className="card border-0 shadow-sm mt-4"
          >
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-semibold">You Might Also Like</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {recommendedProducts.map((product, index) => (
                  <div key={product.id} className="col-md-3 col-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="card border-0 text-center h-100"
                    >
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="card-img-top"
                        style={{ height: '120px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h6 className="card-title small fw-semibold mb-1">{product.name}</h6>
                        <small className="text-muted d-block mb-2">{product.category}</small>
                        <span className="fw-bold text-primary">${product.price}</span>
                      </div>
                    </motion.div>
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
            onClick={() => navigate("/products")}
            className="btn btn-primary btn-lg px-5"
          >
            <FaShoppingBag className="me-2" />
            Continue Shopping
          </motion.button>
          
          <Link to="/" className="btn btn-outline-secondary btn-lg">
            <FaHome className="me-2" />
            Back to Home
          </Link>
        </div>
        
        <p className="text-muted small mt-3">
          Redirecting to products in <strong>{countdown}</strong> seconds...
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
                <h5 className="mb-0 fw-semibold">Share Order Details</h5>
              </div>
              <div className="card-body">
                <p className="text-muted mb-3">
                  Share your order confirmation with friends or family
                </p>
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary">
                    <FaEnvelope className="me-2" />
                    Share via Email
                  </button>
                  <button className="btn btn-outline-info">
                    💬 Share via Message
                  </button>
                  <button className="btn btn-outline-secondary">
                    📋 Copy Order Link
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .top-30 {
          top: 30%;
        }
        
        .card {
          transition: all 0.3s ease;
        }
        
        .card:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
}

export default Confirmation;