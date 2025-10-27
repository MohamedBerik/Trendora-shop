import React, { useState, useMemo, useCallback } from "react";
import { useCart } from "react-use-cart";
import { 
  FaGift,
  FaCreditCard,
  FaEnvelope,
  FaCalendarAlt,
  FaUser,
  FaPalette,
  FaMagic,
  FaRocket,
  FaShieldAlt,
  FaCheckCircle,
  FaStar,
  FaShare,
  FaDownload,
  FaPrint,
  FaShoppingCart,
  FaArrowRight,
  FaRegSmile,
  FaRegHeart,
  FaBirthdayCake,
  FaGlassCheers
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/Page.css";

function GiftCardsPage() {
  const { addItem } = useCart();
  
  // Gift card templates
  const giftCardTemplates = [
    {
      id: 1,
      name: "Classic Elegance",
      image: "/assets/img/giftcards/classic.jpg",
      category: "classic",
      colors: ["#2c3e50", "#34495e"],
      price: 50,
      popular: true
    },
    {
      id: 2,
      name: "Modern Gradient",
      image: "/assets/img/giftcards/modern.jpg",
      category: "modern",
      colors: ["#667eea", "#764ba2"],
      price: 100
    },
    {
      id: 3,
      name: "Luxury Gold",
      image: "/assets/img/giftcards/luxury.jpg",
      category: "luxury",
      colors: ["#ffd700", "#ffed4e"],
      price: 200,
      popular: true
    },
    {
      id: 4,
      name: "Festive Celebration",
      image: "/assets/img/giftcards/festive.jpg",
      category: "festive",
      colors: ["#e74c3c", "#e67e22"],
      price: 75
    },
    {
      id: 5,
      name: "Corporate Professional",
      image: "/assets/img/giftcards/corporate.jpg",
      category: "corporate",
      colors: ["#2c3e50", "#3498db"],
      price: 150
    },
    {
      id: 6,
      name: "Minimalist Clean",
      image: "/assets/img/giftcards/minimalist.jpg",
      category: "minimalist",
      colors: ["#ecf0f1", "#bdc3c7"],
      price: 25
    }
  ];

  // Predefined amounts
  const predefinedAmounts = [25, 50, 75, 100, 150, 200, 250, 500];

  // Gift card data state
  const [giftCardData, setGiftCardData] = useState({
    template: giftCardTemplates[0],
    amount: 50,
    recipientName: "",
    recipientEmail: "",
    senderName: "",
    message: "Wishing you all the best!",
    occasion: "birthday",
    customAmount: ""
  });

  // UI state
  const [activeStep, setActiveStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [previewCard, setPreviewCard] = useState(false);
  const [customDesign, setCustomDesign] = useState({
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    pattern: "none"
  });

  // Filter templates by category
  const filteredTemplates = useMemo(() => {
    if (selectedCategory === "all") return giftCardTemplates;
    return giftCardTemplates.filter(template => template.category === selectedCategory);
  }, [selectedCategory]);

  // Categories for filtering
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(giftCardTemplates.map(template => template.category))];
    return ["all", ...uniqueCategories];
  }, []);

  // Calculate total steps
  const totalSteps = 4;

  // Handlers
  const handleTemplateSelect = useCallback((template) => {
    setGiftCardData(prev => ({ ...prev, template }));
  }, []);

  const handleAmountSelect = useCallback((amount) => {
    setGiftCardData(prev => ({ ...prev, amount, customAmount: "" }));
  }, []);

  const handleCustomAmount = useCallback((amount) => {
    const numericAmount = parseFloat(amount) || 0;
    if (numericAmount >= 10 && numericAmount <= 1000) {
      setGiftCardData(prev => ({ ...prev, amount: numericAmount, customAmount: amount }));
    }
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setGiftCardData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleCustomDesignChange = useCallback((field, value) => {
    setCustomDesign(prev => ({ ...prev, [field]: value }));
  }, []);

  const nextStep = useCallback(() => {
    setActiveStep(prev => Math.min(prev + 1, totalSteps));
  }, []);

  const prevStep = useCallback(() => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  }, []);

  const addToCart = useCallback(() => {
    const giftCardItem = {
      id: `giftcard-${giftCardData.template.id}-${Date.now()}`,
      name: `${giftCardData.template.name} Gift Card - $${giftCardData.amount}`,
      price: giftCardData.amount,
      image: giftCardData.template.image,
      giftCardData: { ...giftCardData },
      quantity: 1
    };
    
    addItem(giftCardItem);
    
    // Show success message or redirect
    alert(`Gift card added to cart! Total: $${giftCardData.amount}`);
  }, [giftCardData, addItem]);

  // Gift card preview component
  const GiftCardPreview = () => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="gift-card-preview"
      style={{
        background: `linear-gradient(135deg, ${giftCardData.template.colors[0]}, ${giftCardData.template.colors[1]})`,
        border: '2px solid gold'
      }}
    >
      <div className="preview-content text-white text-center p-4">
        <FaGift size={40} className="mb-3" />
        <h4 className="fw-bold mb-2">Gift Card</h4>
        <h2 className="display-4 fw-bold mb-3">${giftCardData.amount}</h2>
        <p className="mb-2">To: {giftCardData.recipientName || "Recipient Name"}</p>
        <p className="mb-2">From: {giftCardData.senderName || "Your Name"}</p>
        <p className="small mb-3">"{giftCardData.message}"</p>
        <div className="card-code">
          <small>Code: GC-{Math.random().toString(36).substr(2, 8).toUpperCase()}</small>
        </div>
      </div>
    </motion.div>
  );

  // Step 1: Template Selection
  const Step1TemplateSelection = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="step-content"
    >
      <h3 className="fw-bold mb-4">Choose a Design</h3>
      
      {/* Category Filters */}
      <div className="category-filters mb-4">
        <div className="d-flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              className={`btn btn-sm ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All Designs' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="row g-3">
        {filteredTemplates.map(template => (
          <div key={template.id} className="col-lg-4 col-md-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`card template-card border-0 shadow-sm ${giftCardData.template.id === template.id ? 'selected' : ''}`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div 
                className="template-preview"
                style={{
                  background: `linear-gradient(135deg, ${template.colors[0]}, ${template.colors[1]})`,
                  height: '120px'
                }}
              >
                {template.popular && (
                  <span className="badge bg-warning position-absolute top-0 end-0 m-2">
                    <FaStar className="me-1" />
                    Popular
                  </span>
                )}
              </div>
              <div className="card-body text-center">
                <h6 className="card-title mb-2">{template.name}</h6>
                <p className="text-muted mb-0">Starting at ${template.price}</p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Custom Design Option */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">
            <FaPalette className="me-2 text-primary" />
            Custom Design
          </h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Primary Color</label>
              <input
                type="color"
                className="form-control form-control-color"
                value={customDesign.primaryColor}
                onChange={(e) => handleCustomDesignChange('primaryColor', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Secondary Color</label>
              <input
                type="color"
                className="form-control form-control-color"
                value={customDesign.secondaryColor}
                onChange={(e) => handleCustomDesignChange('secondaryColor', e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Pattern</label>
              <select
                className="form-select"
                value={customDesign.pattern}
                onChange={(e) => handleCustomDesignChange('pattern', e.target.value)}
              >
                <option value="none">None</option>
                <option value="stripes">Stripes</option>
                <option value="dots">Dots</option>
                <option value="waves">Waves</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Step 2: Amount Selection
  const Step2AmountSelection = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="step-content"
    >
      <h3 className="fw-bold mb-4">Select Amount</h3>
      
      {/* Predefined Amounts */}
      <div className="row g-3 mb-4">
        {predefinedAmounts.map(amount => (
          <div key={amount} className="col-lg-3 col-md-4 col-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`btn amount-btn w-100 py-3 ${giftCardData.amount === amount ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleAmountSelect(amount)}
            >
              <span className="fw-bold">${amount}</span>
            </motion.button>
          </div>
        ))}
      </div>

      {/* Custom Amount */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Custom Amount</h5>
          <div className="row align-items-end">
            <div className="col-md-6">
              <label className="form-label">Enter Amount ($10 - $1000)</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className="form-control"
                  min="10"
                  max="1000"
                  value={giftCardData.customAmount}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  placeholder="Enter custom amount"
                />
              </div>
            </div>
            <div className="col-md-6">
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => handleCustomAmount(giftCardData.customAmount)}
              >
                Apply Custom Amount
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Current Selection */}
      <div className="alert alert-info mt-4">
        <FaCreditCard className="me-2" />
        <strong>Selected Amount: ${giftCardData.amount}</strong>
      </div>
    </motion.div>
  );

  // Step 3: Personalization
  const Step3Personalization = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="step-content"
    >
      <h3 className="fw-bold mb-4">Personalize Your Card</h3>
      
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                <FaUser className="me-2 text-primary" />
                Recipient Details
              </h5>
              
              <div className="mb-3">
                <label className="form-label">Recipient Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={giftCardData.recipientName}
                  onChange={(e) => handleInputChange('recipientName', e.target.value)}
                  placeholder="Enter recipient's full name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Recipient Email *</label>
                <input
                  type="email"
                  className="form-control"
                  value={giftCardData.recipientEmail}
                  onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                  placeholder="Enter recipient's email"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Occasion</label>
                <select
                  className="form-select"
                  value={giftCardData.occasion}
                  onChange={(e) => handleInputChange('occasion', e.target.value)}
                >
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="holiday">Holiday</option>
                  <option value="thankyou">Thank You</option>
                  <option value="congratulations">Congratulations</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                <FaEnvelope className="me-2 text-primary" />
                Your Message
              </h5>
              
              <div className="mb-3">
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={giftCardData.senderName}
                  onChange={(e) => handleInputChange('senderName', e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Personal Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={giftCardData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Write a personal message..."
                />
                <small className="text-muted">Max 250 characters</small>
              </div>

              {/* Message Templates */}
              <div className="mb-3">
                <label className="form-label">Quick Messages</label>
                <div className="d-flex flex-wrap gap-2">
                  {[
                    "Happy Birthday! 🎂",
                    "Congratulations! 🎉",
                    "Thank you! 💝",
                    "Thinking of you! 💫"
                  ].map(template => (
                    <button
                      key={template}
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleInputChange('message', template)}
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Step 4: Review & Purchase
  const Step4Review = () => (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="step-content"
    >
      <h3 className="fw-bold mb-4">Review & Complete</h3>
      
      <div className="row">
        <div className="col-lg-6">
          {/* Gift Card Preview */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Gift Card Preview</h5>
              <GiftCardPreview />
            </div>
          </div>

          {/* Order Summary */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Order Summary</h5>
              <div className="order-details">
                <div className="d-flex justify-content-between mb-2">
                  <span>Gift Card Amount:</span>
                  <strong>${giftCardData.amount}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Processing Fee:</span>
                  <strong>$0.00</strong>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total:</span>
                  <span className="text-primary">${giftCardData.amount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          {/* Delivery Information */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Delivery Information</h5>
              <div className="delivery-info">
                <p><strong>To:</strong> {giftCardData.recipientName}</p>
                <p><strong>Email:</strong> {giftCardData.recipientEmail}</p>
                <p><strong>From:</strong> {giftCardData.senderName}</p>
                <p><strong>Occasion:</strong> {giftCardData.occasion}</p>
                <p><strong>Message:</strong> "{giftCardData.message}"</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Gift Card Features</h5>
              <div className="features-list">
                {[
                  { icon: FaRocket, text: "Instant Delivery" },
                  { icon: FaShieldAlt, text: "Secure Payment" },
                  { icon: FaCheckCircle, text: "No Expiration" },
                  { icon: FaShare, text: "Easy to Share" }
                ].map((feature, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <feature.icon className="text-success me-2" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Progress Steps
  const ProgressSteps = () => (
    <div className="progress-steps mb-5">
      <div className="steps-container">
        {[1, 2, 3, 4].map(step => (
          <div key={step} className={`step ${step === activeStep ? 'active' : ''} ${step < activeStep ? 'completed' : ''}`}>
            <div className="step-circle">
              {step < activeStep ? <FaCheckCircle /> : step}
            </div>
            <div className="step-label">
              {step === 1 && 'Design'}
              {step === 2 && 'Amount'}
              {step === 3 && 'Personalize'}
              {step === 4 && 'Review'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4 gift-cards-page">
      <div className="row justify-content-center">
        <div className="col-xxl-10">
          {/* Header */}
          <div className="text-center mb-5">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FaGift className="display-1 text-primary mb-3" />
              <h1 className="display-5 fw-bold mb-3">Gift Cards</h1>
              <p className="lead text-muted mb-4">
                The perfect gift for every occasion. Instant delivery, personalized messages, and no expiration!
              </p>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="card border-0 shadow-lg">
            <div className="card-body p-4">
              {/* Progress Steps */}
              <ProgressSteps />

              {/* Step Content */}
              <div className="step-container">
                <AnimatePresence mode="wait">
                  {activeStep === 1 && <Step1TemplateSelection />}
                  {activeStep === 2 && <Step2AmountSelection />}
                  {activeStep === 3 && <Step3Personalization />}
                  {activeStep === 4 && <Step4Review />}
                </AnimatePresence>
              </div>

              {/* Navigation Buttons */}
              <div className="navigation-buttons mt-5 pt-4 border-top">
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={prevStep}
                    disabled={activeStep === 1}
                  >
                    Previous
                  </button>

                  {activeStep < totalSteps ? (
                    <button
                      className="btn btn-primary"
                      onClick={nextStep}
                    >
                      Next Step <FaArrowRight className="ms-2" />
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-lg"
                      onClick={addToCart}
                      disabled={!giftCardData.recipientName || !giftCardData.recipientEmail || !giftCardData.senderName}
                    >
                      <FaShoppingCart className="me-2" />
                      Add to Cart - ${giftCardData.amount}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="row mt-5">
            <div className="col-12">
              <h3 className="text-center fw-bold mb-4">Why Choose Our Gift Cards?</h3>
              <div className="row g-4">
                {[
                  { icon: FaRocket, title: "Instant Delivery", desc: "Delivered via email within minutes" },
                  { icon: FaMagic, title: "Fully Customizable", desc: "Personalize with messages and designs" },
                  { icon: FaShieldAlt, title: "Secure & Safe", desc: "Protected by advanced security" },
                  { icon: FaRegSmile, title: "Perfect for Any Occasion", desc: "Birthdays, holidays, thank yous" }
                ].map((feature, index) => (
                  <div key={index} className="col-lg-3 col-md-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="card feature-card border-0 shadow-sm text-center h-100"
                    >
                      <div className="card-body p-4">
                        <feature.icon className="display-6 text-primary mb-3" />
                        <h5 className="fw-bold mb-2">{feature.title}</h5>
                        <p className="text-muted mb-0">{feature.desc}</p>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        .gift-cards-page {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          min-height: 100vh;
        }

        .progress-steps {
          position: relative;
        }

        .steps-container {
          display: flex;
          justify-content: space-between;
          position: relative;
          max-width: 800px;
          margin: 0 auto;
        }

        .steps-container::before {
          content: '';
          position: absolute;
          top: 25px;
          left: 0;
          right: 0;
          height: 3px;
          background: #e9ecef;
          z-index: 1;
        }

        .step {
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
          background: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #6c757d;
          margin-bottom: 0.5rem;
          border: 3px solid #e9ecef;
          transition: all 0.3s ease;
        }

        .step.active .step-circle {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .step.completed .step-circle {
          background: #28a745;
          color: white;
          border-color: #28a745;
        }

        .step-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6c757d;
        }

        .step.active .step-label {
          color: #007bff;
        }

        .template-card {
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .template-card.selected {
          border: 3px solid #007bff !important;
          transform: scale(1.02);
        }

        .template-preview {
          border-radius: 8px 8px 0 0;
          position: relative;
        }

        .amount-btn {
          font-size: 1.1rem;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .gift-card-preview {
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          color: white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          min-height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-code {
          background: rgba(255,255,255,0.2);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .feature-card {
          transition: all 0.3s ease;
          border-radius: 15px;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }

        .step-content {
          min-height: 400px;
        }

        .form-control-color {
          height: 45px;
          padding: 0.25rem;
        }

        @media (max-width: 768px) {
          .steps-container {
            flex-direction: column;
            gap: 1rem;
          }

          .steps-container::before {
            display: none;
          }

          .step {
            flex-direction: row;
            gap: 1rem;
          }

          .step-circle {
            margin-bottom: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default GiftCardsPage;