import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders } from '../../context/OrdersContext';
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaPaypal,
  FaApple,
  FaGoogle,
  FaLock,
  FaShippingFast,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
  FaClock,
  FaExclamationTriangle,
  FaCheck,
  FaShieldAlt,
  FaGift,
  FaAward,
  FaHeadset,
  FaUndo
} from "react-icons/fa";

function Checkout() {
  const { items, cartTotal, totalItems, emptyCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
 
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [orderComplete, setOrderComplete] = useState(false);
  const [setInteractionCount] = useState(0);
  const [setStepCompletionTimes] = useState({});
  const [currentStepStartTime, setCurrentStepStartTime] = useState(Date.now());
  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showCouponInput, setShowCouponInput] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Egypt",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    saveInfo: false,
    newsletter: true,
    shippingMethod: "standard"
  });

  const shippingCost = formData.shippingMethod === "express" ? 15 :
                     formData.shippingMethod === "standard" ? 5 : 0;
 
  const finalTotal = cartTotal + shippingCost - discount;

  useEffect(() => {
    if (currentStepStartTime && currentStep > 1) {
      const stepTime = Date.now() - currentStepStartTime;
      setStepCompletionTimes(prev => ({
        ...prev,
        [currentStep - 1]: stepTime
      }));
      setCurrentStepStartTime(Date.now());
    }
  }, [currentStep]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    setInteractionCount(prev => prev + 1);
  };

  const applyCoupon = () => {
    const coupons = {
      "WELCOME10": 10,
      "SAVE15": 15,
      "SUMMER20": 20,
      "FREESHIP": shippingCost
    };

    if (coupons[couponCode.toUpperCase()]) {
      setDiscount(coupons[couponCode.toUpperCase()]);
      setInteractionCount(prev => prev + 1);
    } else {
      setFormErrors(prev => ({ ...prev, coupon: 'Invalid coupon code' }));
    }
  };

  const validateForm = (step) => {
    const errors = {};
   
    if (step === 0) {
      if (!formData.firstName.trim()) errors.firstName = 'First name is required';
      if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
      if (!formData.email.trim()) errors.email = 'Email is required';
      if (!formData.phone.trim()) errors.phone = 'Phone number is required';
      if (!formData.address.trim()) errors.address = 'Address is required';
      if (!formData.city.trim()) errors.city = 'City is required';
      if (!formData.state.trim()) errors.state = 'State is required';
      if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required';
     
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
   
    if (step === 2 && paymentMethod === "credit-card") {
      if (!formData.cardNumber.trim()) errors.cardNumber = 'Card number is required';
      if (!formData.expiryDate.trim()) errors.expiryDate = 'Expiry date is required';
      if (!formData.cvv.trim()) errors.cvv = 'CVV is required';
      if (!formData.nameOnCard.trim()) errors.nameOnCard = 'Name on card is required';
    }
   
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStepChange = (newStep) => {
    if (newStep > currentStep && !validateForm(currentStep)) {
      return;
    }
   
    setCurrentStep(newStep);
    setInteractionCount(prev => prev + 1);
  };

  const handlePaymentMethodChange = (methodId) => {
    setPaymentMethod(methodId);
    setInteractionCount(prev => prev + 1);
  };

  const handleShippingMethodChange = (methodId) => {
    setFormData(prev => ({
      ...prev,
      shippingMethod: methodId
    }));
    setInteractionCount(prev => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (currentStep < 3) {
      if (!validateForm(currentStep)) {
        return;
      }
      handleStepChange(currentStep + 1);
    } else {
      await processOrder();
    }
  };

  const processOrder = async () => {
    if (!validateForm(3)) {
      return;
    }

    setIsProcessing(true);
   
    try {
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const orderData = {
        id: orderId,
        date: new Date().toISOString(),
        status: "processing",
        items: items.map(item => ({
          ...item,
          id: item.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
        })),
        total: finalTotal,
        itemsCount: totalItems,
        shipping: {
          method: formData.shippingMethod,
          cost: shippingCost,
          address: {
            name: `${formData.firstName} ${formData.lastName}`,
            street: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country
          }
        },
        payment: {
          method: paymentMethod,
          total: finalTotal,
          status: 'completed'
        },
        discount: discount,
        _processed: true
      };

      addOrder(orderData);
     
      setOrderComplete(true);
     
      setTimeout(() => {
        emptyCart();
        navigate("/confirmation", {
          state: {
            orderId,
            totalAmount: finalTotal,
            itemsCount: totalItems,
            orderDetails: orderData
          }
        });
      }, 2000);
     
    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false);
    }
  };

  const steps = [
    { number: 1, title: "Shipping", icon: "🚚" },
    { number: 2, title: "Payment", icon: "💳" },
    { number: 3, title: "Review", icon: "📋" },
    { number: 4, title: "Confirm", icon: "✅" }
  ];

  const paymentMethods = [
    { id: "credit-card", name: "Credit Card", icon: <FaCreditCard />, popular: true, description: "Pay with Visa, Mastercard, or American Express" },
    { id: "paypal", name: "PayPal", icon: <FaPaypal />, popular: true, description: "Fast and secure payment" },
    { id: "apple-pay", name: "Apple Pay", icon: <FaApple />, description: "Pay with your Apple device" },
    { id: "google-pay", name: "Google Pay", icon: <FaGoogle />, description: "Quick Google payment" },
    { id: "cash", name: "Cash on Delivery", icon: <FaMoneyBillWave />, description: "Pay when you receive your order" }
  ];

  const shippingMethods = [
    { id: "free", name: "Free Shipping", cost: 0, days: "5-7 business days", icon: <FaGift /> },
    { id: "standard", name: "Standard Shipping", cost: 5, days: "3-5 business days", icon: <FaShippingFast /> },
    { id: "express", name: "Express Shipping", cost: 15, days: "1-2 business days", icon: <FaAward /> }
  ];

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="container py-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-5"
        >
          <div className="fs-1 mb-3">🛒</div>
          <h3 className="text-muted mb-3">Your Cart is Empty</h3>
          <p className="text-muted mb-4">Add some items to your cart before proceeding to checkout.</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 checkout-page">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="row mb-4"
      >
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="h2 fw-bold mb-1 gradient-text">Secure Checkout</h1>
              <p className="text-muted mb-0">Complete your purchase in a few simple steps</p>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <span className="badge bg-primary">
                <FaShieldAlt className="me-1" />
                100% Secure
              </span>
              <Link to="/cart" className="btn btn-outline-primary">
                <FaArrowLeft className="me-2" />
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="row g-4">
        <div className="col-lg-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card border-0 shadow-sm checkout-card"
          >
            <div className="card-header bg-white border-0 py-4">
              <div className="progress-steps position-relative">
                {steps.map((step, index) => (
                  <div key={step.number} className="step-item">
                    <div className={`step-circle ${currentStep >= step.number ? 'active' : ''}`}>
                      {currentStep > step.number ? (
                        <FaCheckCircle className="step-icon" />
                      ) : (
                        <span className="step-number">{step.number}</span>
                      )}
                    </div>
                    <div className={`step-label ${currentStep >= step.number ? 'active' : ''}`}>
                      {step.title}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`step-connector ${currentStep > step.number ? 'active' : ''}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="card-body p-4">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="step-header mb-4">
                      <div className="step-icon-wrapper">
                        <FaUser className="step-main-icon" />
                      </div>
                      <div>
                        <h5 className="fw-bold mb-1">Shipping Information</h5>
                        <p className="text-muted mb-0">Enter your delivery details</p>
                      </div>
                    </div>
                   
                    <div className="row g-3">
                      {[
                        { name: 'firstName', label: 'First Name *', type: 'text', col: 6 },
                        { name: 'lastName', label: 'Last Name *', type: 'text', col: 6 },
                        { name: 'email', label: 'Email Address *', type: 'email', col: 6, icon: <FaEnvelope /> },
                        { name: 'phone', label: 'Phone Number *', type: 'tel', col: 6, icon: <FaPhone /> },
                        { name: 'address', label: 'Street Address *', type: 'text', col: 12, icon: <FaMapMarkerAlt /> },
                        { name: 'city', label: 'City *', type: 'text', col: 4 },
                        { name: 'state', label: 'State *', type: 'text', col: 4 },
                        { name: 'zipCode', label: 'ZIP Code *', type: 'text', col: 4 }
                      ].map((field) => (
                        <div key={field.name} className={`col-md-${field.col}`}>
                          <label className="form-label fw-semibold">
                            {field.icon && <span className="input-icon">{field.icon}</span>}
                            {field.label}
                          </label>
                          <div className="input-group">
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleInputChange}
                              className={`form-control ${formErrors[field.name] ? 'is-invalid' : ''}`}
                              placeholder={field.label}
                              required
                            />
                          </div>
                          {formErrors[field.name] && (
                            <div className="invalid-feedback d-flex align-items-center mt-1">
                              <FaExclamationTriangle className="me-1" size={12} />
                              {formErrors[field.name]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-5">
                      <div className="step-header mb-4">
                        <div className="step-icon-wrapper">
                          <FaShippingFast className="step-main-icon" />
                        </div>
                        <div>
                          <h5 className="fw-bold mb-1">Shipping Method</h5>
                          <p className="text-muted mb-0">Choose how you want to receive your order</p>
                        </div>
                      </div>
                      <div className="row g-3">
                        {shippingMethods.map((method) => (
                          <div key={method.id} className="col-md-4">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`shipping-method-card ${
                                formData.shippingMethod === method.id
                                  ? 'active'
                                  : ''
                              }`}
                              onClick={() => handleShippingMethodChange(method.id)}
                            >
                              <div className="shipping-icon">
                                {method.icon}
                              </div>
                              <h6 className="fw-semibold mb-1">{method.name}</h6>
                              <div className="shipping-price">
                                {method.cost === 0 ? 'FREE' : `$${method.cost}`}
                              </div>
                              <small className="shipping-days">{method.days}</small>
                              {formData.shippingMethod === method.id && (
                                <div className="selected-indicator">
                                  <FaCheck />
                                </div>
                              )}
                            </motion.div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="step-header mb-4">
                      <div className="step-icon-wrapper">
                        <FaCreditCard className="step-main-icon" />
                      </div>
                      <div>
                        <h5 className="fw-bold mb-1">Payment Method</h5>
                        <p className="text-muted mb-0">Choose your preferred payment option</p>
                      </div>
                    </div>

                    <div className="row g-3 mb-4">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="col-md-6">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`payment-method-card ${
                              paymentMethod === method.id
                                ? 'active'
                                : ''
                            }`}
                            onClick={() => handlePaymentMethodChange(method.id)}
                          >
                            <div className="payment-method-header">
                              <div className="payment-icon">
                                {method.icon}
                              </div>
                              <div className="payment-info">
                                <h6 className="fw-semibold mb-0">{method.name}</h6>
                                <small className="text-muted">{method.description}</small>
                              </div>
                            </div>
                            <div className="payment-selector">
                              <div className={`selector-dot ${paymentMethod === method.id ? 'active' : ''}`}>
                                {paymentMethod === method.id && <div className="selector-inner"></div>}
                              </div>
                            </div>
                            {method.popular && (
                              <div className="popular-badge">Most Popular</div>
                            )}
                          </motion.div>
                        </div>
                      ))}
                    </div>

                    {paymentMethod === "credit-card" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="payment-details-card"
                      >
                        <h6 className="fw-bold mb-3">Card Details</h6>
                        <div className="row g-3">
                          {[
                            { name: 'cardNumber', label: 'Card Number', placeholder: '1234 5678 9012 3456', maxLength: 19 },
                            { name: 'expiryDate', label: 'Expiry Date', placeholder: 'MM/YY', maxLength: 5 },
                            { name: 'cvv', label: 'CVV', placeholder: '123', maxLength: 3 },
                            { name: 'nameOnCard', label: 'Name on Card', placeholder: 'John Doe' }
                          ].map((field) => (
                            <div key={field.name} className={field.name === 'nameOnCard' ? 'col-12' : 'col-md-6'}>
                              <label className="form-label fw-semibold">{field.label}</label>
                              <input
                                type="text"
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleInputChange}
                                className={`form-control ${formErrors[field.name] ? 'is-invalid' : ''}`}
                                placeholder={field.placeholder}
                                maxLength={field.maxLength}
                              />
                              {formErrors[field.name] && (
                                <div className="invalid-feedback d-flex align-items-center">
                                  <FaExclamationTriangle className="me-1" size={12} />
                                  {formErrors[field.name]}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div className="security-notice">
                      <FaLock className="security-icon" />
                      <div>
                        <small className="fw-semibold">Secure Payment</small>
                        <small className="text-muted d-block">Your payment information is encrypted and secure</small>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="step-header mb-4">
                      <div className="step-icon-wrapper">
                        <FaCheckCircle className="step-main-icon" />
                      </div>
                      <div>
                        <h5 className="fw-bold mb-1">Order Review</h5>
                        <p className="text-muted mb-0">Review your order before placing it</p>
                      </div>
                    </div>

                    <div className="order-items-card">
                      <h6 className="fw-bold mb-3">Order Items ({totalItems})</h6>
                      <div className="order-items-list">
                        {items.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="order-item"
                          >
                            <div className="item-image">
                              <img
                                src={item.image || "/assets/img/placeholder.jpg"}
                                alt={item.name}
                                className="img-fluid"
                              />
                            </div>
                            <div className="item-details">
                              <h6 className="item-name">{item.name}</h6>
                              <small className="item-meta">Qty: {item.quantity}</small>
                            </div>
                            <div className="item-price">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="row g-3 mt-4">
                      <div className="col-md-6">
                        <div className="summary-card">
                          <h6 className="fw-bold mb-3">Shipping Address</h6>
                          <div className="address-details">
                            <p className="mb-1 fw-semibold">{formData.firstName} {formData.lastName}</p>
                            <p className="mb-1 text-muted">{formData.address}</p>
                            <p className="mb-0 text-muted">
                              {formData.city}, {formData.state} {formData.zipCode}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="summary-card">
                          <h6 className="fw-bold mb-3">Payment & Shipping</h6>
                          <div className="method-details">
                            <div className="d-flex align-items-center gap-2 mb-2">
                              {paymentMethods.find(m => m.id === paymentMethod)?.icon}
                              <span className="fw-semibold">{paymentMethods.find(m => m.id === paymentMethod)?.name}</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <FaShippingFast />
                              <span className="text-muted">
                                {shippingMethods.find(m => m.id === formData.shippingMethod)?.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="terms-section mt-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="terms"
                          required
                        />
                        <label className="form-check-label" htmlFor="terms">
                          I agree to the <a href="/terms" className="text-primary">Terms and Conditions</a> and <a href="/privacy" className="text-primary">Privacy Policy</a>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="checkout-navigation">
                <button
                  type="button"
                  onClick={() => handleStepChange(currentStep - 1)}
                  disabled={currentStep === 1}
                  className="btn btn-navigation btn-previous"
                >
                  <FaArrowLeft className="me-2" />
                  Previous
                </button>
               
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="btn btn-navigation btn-next"
                >
                  {isProcessing ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {currentStep === 3 ? 'Place Order' : 'Continue'}
                      <FaArrowRight className="ms-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-lg-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="order-summary-sidebar"
          >
            <div className="summary-card">
              <div className="card-header">
                <h5 className="mb-0 fw-semibold">Order Summary</h5>
              </div>
             
              <div className="card-body">
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                 
                  <div className="price-row">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? "text-success fw-semibold" : ""}>
                      {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  {discount > 0 ? (
                    <div className="price-row text-success">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="coupon-section">
                      {!showCouponInput ? (
                        <button
                          className="btn-coupon"
                          onClick={() => setShowCouponInput(true)}
                        >
                          <FaGift className="me-1" />
                          Add coupon code
                        </button>
                      ) : (
                        <div className="coupon-input-group">
                          <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="form-control form-control-sm"
                          />
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={applyCoupon}
                          >
                            Apply
                          </button>
                        </div>
                      )}
                      {formErrors.coupon && (
                        <small className="text-danger">{formErrors.coupon}</small>
                      )}
                    </div>
                  )}
                 
                  <div className="price-row total-row">
                    <span className="fw-bold fs-5">Total</span>
                    <span className="fw-bold fs-5 text-primary">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="trust-badges">
                  <div className="trust-item">
                    <FaLock className="trust-icon" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="trust-item">
                    <FaShippingFast className="trust-icon" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="trust-item">
                    <FaHeadset className="trust-icon" />
                    <span>24/7 Support</span>
                  </div>
                  <div className="trust-item">
                    <FaUndo className="trust-icon" />
                    <span>Easy Returns</span>
                  </div>
                </div>

                <div className="delivery-estimate">
                  <FaClock className="text-primary me-2" />
                  <small className="text-muted">
                    Estimated delivery: {
                      formData.shippingMethod === 'express' ? '1-2 business days' :
                      formData.shippingMethod === 'standard' ? '3-5 business days' :
                      '5-7 business days'
                    }
                  </small>
                </div>
              </div>
            </div>

            <div className="support-card">
              <div className="support-header">
                <FaHeadset className="support-icon" />
                <h6 className="mb-0">Need Help?</h6>
              </div>
              <p className="support-text">
                Our customer support team is here to help
              </p>
              <div className="support-contacts">
                <small>📞 +1 (555) 123-4567</small>
                <small>✉️ support@example.com</small>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {orderComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="order-complete-overlay"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="order-complete-card"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="success-icon"
              >
                ✅
              </motion.div>
              <h3 className="fw-bold mb-3">Order Placed Successfully!</h3>
              <p className="text-muted mb-4">
                Thank you for your purchase. Your order is being processed and you'll receive a confirmation email shortly.
              </p>
             
              <div className="processing-indicator">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <small className="text-muted">Redirecting to confirmation...</small>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .checkout-page {
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          min-height: 100vh;
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .checkout-card {
          border-radius: 20px;
          overflow: hidden;
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .step-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
          margin-bottom: 8px;
        }

        .step-circle.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-color: #667eea;
          color: white;
        }

        .step-number {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .step-icon {
          font-size: 1.2rem;
        }

        .step-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #94a3b8;
          transition: all 0.3s ease;
        }

        .step-label.active {
          color: #667eea;
          font-weight: 600;
        }

        .step-connector {
          position: absolute;
          top: 25px;
          left: 60%;
          width: 100%;
          height: 2px;
          background: #e2e8f0;
          z-index: 1;
        }

        .step-connector.active {
          background: #667eea;
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .step-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .step-main-icon {
          font-size: 1.2rem;
        }

        .shipping-method-card {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .shipping-method-card.active {
          border-color: #667eea;
          background: linear-gradient(135deg, #f8faff, #f0f4ff);
        }

        .shipping-method-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .shipping-icon {
          font-size: 1.5rem;
          color: #667eea;
          margin-bottom: 0.5rem;
        }

        .shipping-price {
          font-size: 1.25rem;
          font-weight: 600;
          color: #667eea;
          margin: 0.5rem 0;
        }

        .shipping-days {
          color: #64748b;
        }

        .selected-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          color: #10b981;
        }

        .payment-method-card {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .payment-method-card.active {
          border-color: #667eea;
          background: linear-gradient(135deg, #f8faff, #f0f4ff);
        }

        .payment-method-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .payment-method-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .payment-icon {
          font-size: 1.5rem;
          color: #667eea;
        }

        .payment-selector {
          margin-left: auto;
        }

        .selector-dot {
          width: 20px;
          height: 20px;
          border: 2px solid #cbd5e0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .selector-dot.active {
          border-color: #667eea;
          background: #667eea;
        }

        .selector-inner {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        }

        .popular-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #10b981;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .security-notice {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .security-icon {
          color: #10b981;
          font-size: 1.2rem;
        }

        .order-items-card {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .order-items-list {
          space-y: 1rem;
        }

        .order-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          overflow: hidden;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details {
          flex: 1;
        }

        .item-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .item-meta {
          color: #64748b;
        }

        .item-price {
          font-weight: 600;
          color: #667eea;
        }

        .summary-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .summary-card .card-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 1.25rem 1.5rem;
        }

        .summary-card .card-body {
          padding: 1.5rem;
        }

        .price-breakdown {
          space-y: 0.75rem;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
        }

        .price-row:not(:last-child) {
          border-bottom: 1px solid #f1f5f9;
        }

        .total-row {
          border-top: 2px solid #e2e8f0;
          padding-top: 1rem;
          margin-top: 0.5rem;
        }

        .coupon-section {
          margin: 1rem 0;
        }

        .btn-coupon {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .coupon-input-group {
          display: flex;
          gap: 0.5rem;
        }

        .trust-badges {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin: 1.5rem 0;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #64748b;
        }

        .trust-icon {
          color: #667eea;
        }

        .support-card {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }

        .support-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .support-icon {
          font-size: 1.2rem;
        }

        .support-text {
          opacity: 0.9;
          margin-bottom: 1rem;
        }

        .support-contacts {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .checkout-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          margin-top: 2rem;
          border-top: 1px solid #e2e8f0;
        }

        .btn-navigation {
          padding: 0.75rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-previous {
          background: white;
          border: 2px solid #e2e8f0;
          color: #64748b;
        }

        .btn-previous:hover:not(:disabled) {
          border-color: #667eea;
          color: #667eea;
        }

        .btn-next {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          color: white;
        }

        .btn-next:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .order-complete-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(5px);
        }

        .order-complete-card {
          background: white;
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .processing-indicator {
          margin-top: 1.5rem;
        }

        @media (max-width: 768px) {
          .progress-steps {
            flex-direction: column;
            gap: 1rem;
          }

          .step-connector {
            display: none;
          }

          .checkout-navigation {
            flex-direction: column;
            gap: 1rem;
          }

          .btn-navigation {
            width: 100%;
          }

          .trust-badges {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Checkout;