import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaCheck, 
  FaTimes,
  FaGoogle,
  FaFacebook,
  FaApple,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    newsletter: true
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Password strength calculator
  useEffect(() => {
    const calculateStrength = () => {
      let strength = 0;
      const { password } = formData;

      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(password)) strength += 25;

      setPasswordStrength(strength);
    };

    calculateStrength();
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (passwordStrength < 75) {
      newErrors.password = "Password is too weak";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Register user (in real app, this would be an API call)
      console.log("User registered:", formData);
      
      // Auto login after registration
      login(formData.email);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (error) {
      setErrors({ submit: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = (provider) => {
    // In a real app, this would integrate with social signup APIs
    console.log(`Signing up with ${provider}`);
    // For demo purposes, we'll simulate a successful registration and login
    login(`user@${provider.toLowerCase()}.com`);
    navigate("/");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "danger";
    if (passwordStrength < 50) return "warning";
    if (passwordStrength < 75) return "info";
    return "success";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Very Weak";
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  };

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "One number", met: /[0-9]/.test(formData.password) },
    { text: "One special character", met: /[^A-Za-z0-9]/.test(formData.password) }
  ];

  return (
    <div className="container-fluid py-5" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", minHeight: "100vh" }}>
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-xl-5 col-lg-6 col-md-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card border-0 shadow-lg rounded-4 overflow-hidden"
          >
            {/* Header Section */}
            <div className="card-header bg-white border-0 py-4 text-center position-relative">
              <Link to="/" className="btn btn-outline-secondary btn-sm position-absolute start-0 top-50 translate-middle-y ms-3">
                <FaArrowLeft />
              </Link>
              
              <Link to="/" className="text-decoration-none">
                <h2 className="fw-bold mb-1" style={{ 
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  🛍️ Trendora
                </h2>
              </Link>
              <p className="text-muted mb-0">Create your account and start shopping</p>
            </div>

            <div className="card-body p-4 p-md-5">
              {/* Progress Steps */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  {[1, 2, 3].map((step) => (
                    <React.Fragment key={step}>
                      <div className="d-flex flex-column align-items-center">
                        <div 
                          className={`rounded-circle d-flex align-items-center justify-content-center ${
                            currentStep >= step 
                              ? 'bg-primary text-white' 
                              : 'bg-light text-muted'
                          }`}
                          style={{ width: '40px', height: '40px' }}
                        >
                          {currentStep > step ? <FaCheck size={14} /> : step}
                        </div>
                        <small className={`mt-1 fw-semibold ${
                          currentStep >= step ? 'text-primary' : 'text-muted'
                        }`}>
                          {step === 1 ? 'Account' : step === 2 ? 'Details' : 'Complete'}
                        </small>
                      </div>
                      {step < 3 && (
                        <div 
                          className={`flex-grow-1 mx-2 h-2 ${
                            currentStep > step ? 'bg-primary' : 'bg-light'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="alert alert-success d-flex align-items-center gap-2"
                  >
                    <FaCheckCircle />
                    Account created successfully! Redirecting...
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="alert alert-danger d-flex align-items-center gap-2"
                  >
                    <FaExclamationTriangle />
                    {errors.submit}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Social Sign Up Options */}
              <div className="mb-4">
                <div className="row g-2">
                  <div className="col-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => handleSocialSignUp("Google")}
                      className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                      <FaGoogle />
                      <span className="d-none d-sm-inline">Google</span>
                    </motion.button>
                  </div>
                  <div className="col-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => handleSocialSignUp("Facebook")}
                      className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                      <FaFacebook />
                      <span className="d-none d-sm-inline">Facebook</span>
                    </motion.button>
                  </div>
                  <div className="col-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => handleSocialSignUp("Apple")}
                      className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2"
                    >
                      <FaApple />
                      <span className="d-none d-sm-inline">Apple</span>
                    </motion.button>
                  </div>
                </div>

                <div className="position-relative text-center my-4">
                  <hr />
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                    Or sign up with email
                  </span>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* First Name */}
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label fw-semibold">
                      <FaUser className="me-2 text-muted" />
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                      placeholder="Enter your first name"
                      disabled={isLoading}
                    />
                    {errors.firstName && (
                      <div className="invalid-feedback d-block">
                        {errors.firstName}
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label fw-semibold">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      placeholder="Enter your last name"
                      disabled={isLoading}
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback d-block">
                        {errors.lastName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="mt-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    <FaEnvelope className="me-2 text-muted" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="mt-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    <FaLock className="me-2 text-muted" />
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Create a password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={togglePasswordVisibility}
                      disabled={isLoading}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  
                  {/* Password Strength Meter */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="text-muted">Password strength:</small>
                        <small className={`text-${getPasswordStrengthColor()} fw-semibold`}>
                          {getPasswordStrengthText()}
                        </small>
                      </div>
                      <div className="progress" style={{ height: '4px' }}>
                        <div 
                          className={`progress-bar bg-${getPasswordStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Password Requirements */}
                  <div className="mt-2">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="d-flex align-items-center gap-2 small">
                        {req.met ? (
                          <FaCheck className="text-success" size={12} />
                        ) : (
                          <FaTimes className="text-muted" size={12} />
                        )}
                        <span className={req.met ? "text-success" : "text-muted"}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {errors.password && (
                    <div className="invalid-feedback d-block">
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mt-3">
                  <label htmlFor="confirmPassword" className="form-label fw-semibold">
                    Confirm Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={toggleConfirmPasswordVisibility}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback d-block">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {/* Terms and Newsletter */}
                <div className="mt-4">
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className={`form-check-input ${errors.agreeToTerms ? 'is-invalid' : ''}`}
                      disabled={isLoading}
                    />
                    <label htmlFor="agreeToTerms" className="form-check-label small">
                      I agree to the{" "}
                      <a href="/terms" className="text-decoration-none">Terms of Service</a> and{" "}
                      <a href="/privacy" className="text-decoration-none">Privacy Policy</a>
                    </label>
                    {errors.agreeToTerms && (
                      <div className="invalid-feedback d-block">
                        {errors.agreeToTerms}
                      </div>
                    )}
                  </div>

                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="newsletter"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleChange}
                      className="form-check-input"
                      disabled={isLoading}
                    />
                    <label htmlFor="newsletter" className="form-check-label small">
                      Send me product updates, special offers, and shopping tips
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="btn btn-primary w-100 py-3 fw-semibold mt-4"
                  style={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    border: "none"
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </motion.button>
              </form>

              {/* Sign In Link */}
              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted mb-0">
                  Already have an account?{" "}
                  <Link 
                    to="/signin" 
                    className="text-decoration-none fw-semibold text-primary"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="card-footer bg-light border-0 py-3 text-center">
              <small className="text-muted">
                Your data is securely encrypted and protected
              </small>
            </div>
          </motion.div>

          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-4"
          >
            <div className="row g-3">
              <div className="col-md-4">
                <div className="text-white small">
                  <div className="fw-semibold">🔒 Secure Data</div>
                  <div>Bank-level encryption</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-white small">
                  <div className="fw-semibold">⚡ Quick Setup</div>
                  <div>Ready in 30 seconds</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-white small">
                  <div className="fw-semibold">🎁 Welcome Bonus</div>
                  <div>Get 10% off first order</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .card {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }
        
        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border: none;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
      `}</style>
    </div>
  );
}

export default SignUp;