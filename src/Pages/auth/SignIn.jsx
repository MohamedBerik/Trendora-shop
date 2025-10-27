import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaUser, 
  FaGoogle, 
  FaFacebook, 
  FaApple,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

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

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      login(formData.email);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (error) {
      setErrors({ submit: "Failed to sign in. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // In a real app, this would integrate with social login APIs
    console.log(`Logging in with ${provider}`);
    // For demo purposes, we'll simulate a successful login
    login(`user@${provider.toLowerCase()}.com`);
    navigate("/");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
            <div className="card-header bg-white border-0 py-4 text-center">
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
              <p className="text-muted mb-0">Welcome back! Sign in to your account</p>
            </div>

            <div className="card-body p-4 p-md-5">
              {/* Social Login Options */}
              <div className="mb-4">
                <div className="row g-2">
                  <div className="col-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => handleSocialLogin("Google")}
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
                      onClick={() => handleSocialLogin("Facebook")}
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
                      onClick={() => handleSocialLogin("Apple")}
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
                    Or continue with email
                  </span>
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
                    Successfully signed in! Redirecting...
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

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    <FaEnvelope className="me-2 text-muted" />
                    Email Address
                  </label>
                  <div className="input-group">
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
                  </div>
                  {errors.email && (
                    <div className="invalid-feedback d-block">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="mb-3">
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
                      placeholder="Enter your password"
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
                  {errors.password && (
                    <div className="invalid-feedback d-block">
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="form-check-input"
                      disabled={isLoading}
                    />
                    <label htmlFor="rememberMe" className="form-check-label small">
                      Remember me
                    </label>
                  </div>
                  <Link 
                    to="/forgot-password" 
                    className="text-decoration-none small text-primary"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="btn btn-primary w-100 py-3 fw-semibold"
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
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted mb-0">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="text-decoration-none fw-semibold text-primary"
                  >
                    Sign up now
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="card-footer bg-light border-0 py-3 text-center">
              <small className="text-muted">
                By signing in, you agree to our{" "}
                <a href="/terms" className="text-decoration-none">Terms</a> and{" "}
                <a href="/privacy" className="text-decoration-none">Privacy Policy</a>
              </small>
            </div>
          </motion.div>

          {/* Additional Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-4"
          >
            <div className="row g-3">
              <div className="col-md-4">
                <div className="text-white small">
                  <div className="fw-semibold">🔒 Secure Login</div>
                  <div>256-bit encryption</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-white small">
                  <div className="fw-semibold">🚀 Fast Access</div>
                  <div>Instant account access</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-white small">
                  <div className="fw-semibold">💬 24/7 Support</div>
                  <div>Always here to help</div>
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
        
        .input-group .btn-outline-secondary {
          border-color: #dee2e6;
          transition: all 0.3s ease;
        }
        
        .input-group .btn-outline-secondary:hover {
          background-color: #667eea;
          border-color: #667eea;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default SignIn;