import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import { motion, AnimatePresence } from "framer-motion";
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
  FaCheck
} from "react-icons/fa";

function Checkout() {
  const { items, cartTotal, totalItems, emptyCart } = useCart();
  const navigate = useNavigate();
 
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [orderComplete, setOrderComplete] = useState(false);
  const [pageViewStartTime] = useState(Date.now());
  const [interactionCount, setInteractionCount] = useState(0);
  const [stepCompletionTimes, setStepCompletionTimes] = useState({});
  const [currentStepStartTime, setCurrentStepStartTime] = useState(Date.now());
  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    saveInfo: false,
    newsletter: true,
    shippingMethod: "standard"
  });

  // Calculate costs
  const shippingCost = formData.shippingMethod === "express" ? 15 :
                     formData.shippingMethod === "standard" ? 5 : 0;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + shippingCost + tax;

  // تتبع تغيير الخطوات
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

  // Handle form input changes
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

  // التحقق من صحة النموذج
  const validateForm = (step) => {
    const errors = {};
   
    if (step === 1) {
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

  // Track step changes
  const handleStepChange = (newStep) => {
    if (newStep > currentStep && !validateForm(currentStep)) {
      return;
    }
   
    setCurrentStep(newStep);
    setInteractionCount(prev => prev + 1);
  };

  // Track payment method selection
  const handlePaymentMethodChange = (methodId) => {
    setPaymentMethod(methodId);
    setInteractionCount(prev => prev + 1);
  };

  // Track shipping method selection
  const handleShippingMethodChange = (methodId) => {
    setFormData(prev => ({
      ...prev,
      shippingMethod: methodId
    }));
    setInteractionCount(prev => prev + 1);
  };

  // Handle form submission
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

  // Process the final order
  const processOrder = async () => {
    if (!validateForm(3)) {
      return;
    }

    setIsProcessing(true);
   
    try {
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
     
      setOrderComplete(true);
     
      setTimeout(() => {
        emptyCart();
       
        navigate("/confirmation", {
          state: {
            orderId,
            totalAmount: finalTotal,
            itemsCount: totalItems,
            orderDetails: {
              id: orderId,
              date: new Date().toISOString(),
              status: "processing",
              items: items,
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
                total: finalTotal
              }
            }
          }
        });
      }, 2000);
     
    } catch (error) {
      console.error('Error processing order:', error);
      setIsProcessing(false);
    }
  };

  // Progress steps
  const steps = [
    { number: 1, title: "Shipping", icon: "🚚" },
    { number: 2, title: "Payment", icon: "💳" },
    { number: 3, title: "Review", icon: "📋" },
    { number: 4, title: "Confirm", icon: "✅" }
  ];

  // Payment methods
  const paymentMethods = [
    { id: "credit-card", name: "Credit Card", icon: <FaCreditCard />, popular: true },
    { id: "paypal", name: "PayPal", icon: <FaPaypal />, popular: true },
    { id: "apple-pay", name: "Apple Pay", icon: <FaApple /> },
    { id: "google-pay", name: "Google Pay", icon: <FaGoogle /> },
    { id: "cash", name: "Cash on Delivery", icon: <FaMoneyBillWave /> }
  ];

  // Shipping methods
  const shippingMethods = [
    { id: "free", name: "Free Shipping", cost: 0, days: "5-7 business days" },
    { id: "standard", name: "Standard Shipping", cost: 5, days: "3-5 business days" },
    { id: "express", name: "Express Shipping", cost: 15, days: "1-2 business days" }
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
    <div className="container-fluid py-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="row mb-4"
      >
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="h2 fw-bold mb-1">Checkout</h1>
              <p className="text-muted mb-0">Complete your purchase in a few simple steps</p>
            </div>
            <Link to="/cart" className="btn btn-outline-primary">
              <FaArrowLeft className="me-2" />
              Back to Cart
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="row g-4">
        {/* Main Checkout Form */}
        <div className="col-lg-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card border-0 shadow-sm"
          >
            {/* Progress Steps */}
            <div className="card-header bg-white border-0 py-4">
              <div className="row align-items-center position-relative">
                {steps.map((step, index) => (
                  <div key={step.number} className="col-3 text-center position-relative">
                    <div className="d-flex flex-column align-items-center">
                      <div
                        className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                          currentStep >= step.number
                            ? 'bg-primary text-white'
                            : 'bg-light text-muted'
                        }`}
                        style={{ width: '40px', height: '40px' }}
                      >
                        {currentStep > step.number ? (
                          <FaCheckCircle />
                        ) : (
                          <span className="fw-bold">{step.number}</span>
                        )}
                      </div>
                      <small className={`fw-semibold ${
                        currentStep >= step.number ? 'text-primary' : 'text-muted'
                      }`}>
                        {step.title}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-body p-4">
              <AnimatePresence mode="wait">
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h5 className="fw-bold mb-4">
                      <FaUser className="me-2 text-primary" />
                      Shipping Information
                    </h5>
                   
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
                            {field.icon && <>{field.icon} </>}
                            {field.label}
                          </label>
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className={`form-control ${formErrors[field.name] ? 'is-invalid' : ''}`}
                            required
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

                    {/* Shipping Method */}
                    <div className="mt-4">
                      <h6 className="fw-bold mb-3">
                        <FaShippingFast className="me-2 text-primary" />
                        Shipping Method
                      </h6>
                      <div className="row g-3">
                        {shippingMethods.map((method) => (
                          <div key={method.id} className="col-md-4">
                            <div
                              className={`card border-2 cursor-pointer ${
                                formData.shippingMethod === method.id
                                  ? 'border-primary'
                                  : 'border-light'
                              }`}
                              onClick={() => handleShippingMethodChange(method.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="card-body text-center p-3">
                                <h6 className="fw-semibold mb-1">{method.name}</h6>
                                <div className="text-primary fw-bold mb-1">
                                  {method.cost === 0 ? 'FREE' : `$${method.cost}`}
                                </div>
                                <small className="text-muted">{method.days}</small>
                                {formData.shippingMethod === method.id && (
                                  <div className="mt-2">
                                    <FaCheck className="text-success" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment Method */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h5 className="fw-bold mb-4">
                      <FaCreditCard className="me-2 text-primary" />
                      Payment Method
                    </h5>

                    {/* Payment Method Selection */}
                    <div className="row g-3 mb-4">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="col-md-6">
                          <div
                            className={`card border-2 cursor-pointer ${
                              paymentMethod === method.id
                                ? 'border-primary'
                                : 'border-light'
                            }`}
                            onClick={() => handlePaymentMethodChange(method.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="card-body">
                              <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                  <div className="text-primary fs-5 me-3">
                                    {method.icon}
                                  </div>
                                  <div>
                                    <h6 className="fw-semibold mb-0">{method.name}</h6>
                                    {method.popular && (
                                      <small className="text-success">Most popular</small>
                                    )}
                                  </div>
                                </div>
                                <div
                                  className={`rounded-circle border ${
                                    paymentMethod === method.id
                                      ? 'bg-primary border-primary'
                                      : 'border-secondary'
                                  }`}
                                  style={{ width: '20px', height: '20px' }}
                                >
                                  {paymentMethod === method.id && (
                                    <div className="w-100 h-100 rounded-circle bg-white d-flex align-items-center justify-content-center">
                                      <div className="rounded-circle bg-primary" style={{ width: '8px', height: '8px' }}></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Credit Card Form */}
                    {paymentMethod === "credit-card" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="border rounded-3 p-4 bg-light"
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

                    {/* Security Notice */}
                    <div className="d-flex align-items-center gap-2 mt-4 p-3 bg-light rounded-3">
                      <FaLock className="text-success" />
                      <small className="text-muted">
                        Your payment information is secure and encrypted
                      </small>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Order Review */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h5 className="fw-bold mb-4">Order Review</h5>

                    {/* Order Summary */}
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="fw-bold mb-3">Order Items ({totalItems})</h6>
                        {items.map((item) => (
                          <div key={item.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={item.images || "/assets/img/placeholder.jpg"}
                                alt={item.title}
                                className="rounded"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                              <div>
                                <h6 className="fw-semibold mb-0 small">{item.title}</h6>
                                <small className="text-muted">Qty: {item.quantity}</small>
                              </div>
                            </div>
                            <span className="fw-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="row g-3 mt-4">
                      <div className="col-md-6">
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body">
                            <h6 className="fw-bold mb-3">Shipping Address</h6>
                            <p className="mb-0">
                              {formData.firstName} {formData.lastName}<br/>
                              {formData.address}<br/>
                              {formData.city}, {formData.state} {formData.zipCode}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body">
                            <h6 className="fw-bold mb-3">Payment Method</h6>
                            <div className="d-flex align-items-center gap-2">
                              {paymentMethods.find(m => m.id === paymentMethod)?.icon}
                              <span>{paymentMethods.find(m => m.id === paymentMethod)?.name}</span>
                            </div>
                            <div className="mt-2">
                              <small className="text-muted">
                                Shipping: {shippingMethods.find(m => m.id === formData.shippingMethod)?.name}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="form-check mt-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="terms"
                        required
                      />
                      <label className="form-check-label small" htmlFor="terms">
                        I agree to the <a href="/terms" className="text-primary">Terms and Conditions</a> and <a href="/privacy" className="text-primary">Privacy Policy</a>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                <button
                  type="button"
                  onClick={() => handleStepChange(currentStep - 1)}
                  disabled={currentStep === 1}
                  className="btn btn-outline-secondary"
                >
                  <FaArrowLeft className="me-2" />
                  Previous
                </button>
               
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="btn btn-primary px-5"
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

        {/* Order Summary Sidebar */}
        <div className="col-lg-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card border-0 shadow-sm sticky-top"
            style={{ top: '20px' }}
          >
            <div className="card-header bg-white border-0 py-3">
              <h5 className="mb-0 fw-semibold">Order Summary</h5>
            </div>
           
            <div className="card-body">
              {/* Price Breakdown */}
              <div className="space-y-3 mb-4">
                <div className="d-flex justify-content-between">
                  <span>Subtotal ({totalItems} items):</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
               
                <div className="d-flex justify-content-between">
                  <span>Shipping:</span>
                  <span className={shippingCost === 0 ? "text-success fw-semibold" : ""}>
                    {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
               
                <div className="d-flex justify-content-between">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
               
                <div className="d-flex justify-content-between border-top pt-3">
                  <span className="fw-bold fs-5">Total:</span>
                  <span className="fw-bold fs-5 text-primary">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="text-center small text-muted border-top pt-3">
                <div className="d-flex justify-content-center gap-3 mb-2">
                  <span>🔒 Secure</span>
                  <span>🚚 Fast Delivery</span>
                  <span>💬 24/7 Support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Order Complete Overlay */}
      <AnimatePresence>
        {orderComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              background: 'rgba(0,0,0,0.8)',
              zIndex: 9999
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="card border-0 shadow-lg text-center p-5"
              style={{ maxWidth: '400px' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-success mb-3"
                style={{ fontSize: '4rem' }}
              >
                ✅
              </motion.div>
              <h3 className="fw-bold mb-3">Order Placed!</h3>
              <p className="text-muted mb-4">
                Thank you for your purchase. Your order is being processed.
              </p>
             
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <small className="text-muted">Redirecting to confirmation...</small>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .sticky-top {
          position: sticky;
          z-index: 10;
        }
       
        .cursor-pointer {
          cursor: pointer;
          transition: all 0.3s ease;
        }
       
        .cursor-pointer:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}

export default Checkout;