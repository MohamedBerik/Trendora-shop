import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaArrowUp, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShieldAlt, FaTruck, FaHeadset, FaRecycle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// ✅ استيراد useAnalytics
import { useAnalytics } from "../hooks/hooks-exports";

function InteractiveFooter({ darkMode }) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // ✅ استخدام useAnalytics
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);

    // ✅ تتبع تحميل الفوتر
    trackEvent("footer_loaded", {
      dark_mode: darkMode,
      timestamp: new Date().toISOString(),
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [darkMode, trackEvent]);

  // 🎨 الألوان المتناغمة مع التصميم العام
  const footerBg = darkMode ? "linear-gradient(145deg, #0a0a0a, #111111, #0d0d0d)" : "linear-gradient(145deg, #ffffff, #f8fafc, #f1f5f9)";

  const textColor = darkMode ? "#e2e8f0" : "#475569";
  const highlight = "#00ffcc";
  const borderColor = darkMode ? "#334155" : "#e2e8f0";

  const footerLinks = {
    "Quick Links": [
      { label: "Home", to: "/", icon: "🏠" },
      { label: "About Us", to: "/about", icon: "👥" },
      { label: "Shop", to: "/products", icon: "🛍️" },
      { label: "Contact", to: "/contact", icon: "📞" },
      { label: "Blog", to: "/blog", className: "btn btn-outline-light", icon: "📝" },
    ],
    Products: [
      { label: "New Arrivals", to: "/new-arrivals?category=new", icon: "🆕" },
      { label: "Best Sellers", to: "/best-sellers?category=bestsellers", icon: "🔥" },
      { label: "Sale Items", to: "/sale-items?category=sale", icon: "💸" },
      { label: "Premium Collection", to: "/premium-collection?category=premium", icon: "⭐" },
      { label: "Gift Cards", to: "/gift-cards", icon: "🎁" },
    ],
    Categories: [
      { label: "Men's Fashion", to: "/products?category=men", icon: "👔" },
      { label: "Women's Fashion", to: "/products?category=women", icon: "👗" },
      { label: "Kids & Babies", to: "/products?category=kids", icon: "👶" },
      { label: "Accessories", to: "/products?category=accessories", icon: "💎" },
      { label: "Sports & Outdoor", to: "/products?category=sports", icon: "🏃" },
    ],
    Support: [
      { label: "Help Center", to: "/help", icon: "❓" },
      { label: "Shipping Info", to: "/shipping", icon: "🚚" },
      { label: "Returns & Refunds", to: "/returns", icon: "🔄" },
      { label: "Size Guide", to: "/size-guide", icon: "📏" },
      { label: "Track Order", to: "/track-order", icon: "📦" },
    ],
  };

  const trustFeatures = [
    { icon: <FaShieldAlt />, text: "Secure Payment", subtext: "100% Protected" },
    { icon: <FaTruck />, text: "Free Shipping", subtext: "Orders over $50" },
    { icon: <FaHeadset />, text: "24/7 Support", subtext: "Always Available" },
    { icon: <FaRecycle />, text: "Easy Returns", subtext: "30 Days Policy" },
  ];

  const socialLinks = [
    { icon: FaFacebookF, url: "#", color: "#1877F2", name: "Facebook" },
    { icon: FaInstagram, url: "#", color: "#E4405F", name: "Instagram" },
    { icon: FaTwitter, url: "#", color: "#1DA1F2", name: "Twitter" },
    { icon: FaLinkedin, url: "#", color: "#0A66C2", name: "LinkedIn" },
  ];

  const paymentMethods = [
    { name: "Visa", icon: "💳" },
    { name: "Mastercard", icon: "💳" },
    { name: "PayPal", icon: "🔵" },
    { name: "Apple Pay", icon: "🍎" },
    { name: "Google Pay", icon: "🔴" },
    { name: "Amazon Pay", icon: "📦" },
  ];

  // ✅ تتبع النقر على روابط الفوتر
  const handleFooterLinkClick = (link) => {
    trackEvent("footer_link_click", {
      link_label: link.label,
      link_url: link.to,
      link_category: Object.keys(footerLinks).find((key) => footerLinks[key].some((item) => item.label === link.label)),
      timestamp: new Date().toISOString(),
    });
  };

  // ✅ تتبع النقر على روابط التواصل الاجتماعي
  const handleSocialLinkClick = (social) => {
    trackEvent("social_media_click", {
      platform: social.name,
      url: social.url,
      source: "footer",
      timestamp: new Date().toISOString(),
    });
  };

  // ✅ تتبع الاشتراك في النشرة البريدية
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // تتبع محاولة الاشتراك
      trackEvent("newsletter_subscribe_attempt", {
        email_length: email.length,
        source: "footer",
        has_dark_mode: darkMode,
        timestamp: new Date().toISOString(),
      });

      setIsSubscribed(true);

      // تتبع الاشتراك الناجح
      trackEvent("newsletter_subscribe_success", {
        email_domain: email.split("@")[1],
        source: "footer",
        timestamp: new Date().toISOString(),
      });

      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    } else {
      // تتبع فشل الاشتراك
      trackEvent("newsletter_subscribe_failed", {
        reason: "empty_email",
        source: "footer",
        timestamp: new Date().toISOString(),
      });
    }
  };

  // ✅ تتبع النقر على ميزات الثقة
  const handleTrustFeatureClick = (feature) => {
    trackEvent("trust_feature_click", {
      feature_name: feature.text,
      feature_description: feature.subtext,
      source: "footer_trust_bar",
      timestamp: new Date().toISOString(),
    });
  };

  // ✅ تتبع النقر على زر العودة للأعلى
  const scrollToTop = () => {
    trackEvent("back_to_top_click", {
      scroll_position: window.scrollY,
      source: "footer",
      timestamp: new Date().toISOString(),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ تتبع النقر على الشعار
  const handleLogoClick = () => {
    trackEvent("footer_logo_click", {
      source: "footer",
      timestamp: new Date().toISOString(),
    });
  };


                      {/* تتبع مشاهدة رسالة النجاح */}
                    {useEffect(() => {
                      trackEvent("newsletter_success_message_view", {
                        source: "footer",
                        timestamp: new Date().toISOString(),
                      });
                    }, [])}

  return (
    <footer
      style={{
        background: footerBg,
        color: textColor,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Effects */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${highlight}50, transparent)`,
        }}
      />

      {/* Trust Bar */}
      <motion.div
        className="py-4"
        style={{
          background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
          borderBottom: `1px solid ${borderColor}`,
        }}
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <div className="row g-4 text-center">
            {trustFeatures.map((feature, index) => (
              <motion.div key={index} className="col-6 col-md-3" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }} onClick={() => handleTrustFeatureClick(feature)} style={{ cursor: "pointer" }}>
                <div className="d-flex align-items-center justify-content-center gap-3">
                  <div
                    style={{
                      color: highlight,
                      fontSize: "1.5rem",
                    }}
                  >
                    {feature.icon}
                  </div>
                  <div className="text-start">
                    <div className="fw-bold small" style={{ color: darkMode ? "#f8fafc" : "#1e293b" }}>
                      {feature.text}
                    </div>
                    <div className="small" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                      {feature.subtext}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Footer Content */}
      <div className="container py-5 position-relative">
        <div className="row gy-5">
          {/* Brand Column */}
          <div className="col-lg-4 col-md-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Link to="/" className="text-decoration-none" onClick={handleLogoClick}>
                <h3
                  className="fw-bold mb-3"
                  style={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  🛍️ Trendora
                </h3>
              </Link>
              <p
                className="mb-4"
                style={{
                  color: darkMode ? "#cbd5e0" : "#64748b",
                  lineHeight: "1.6",
                }}
              >
                Your premier destination for fashion and lifestyle. We bring you the latest trends with quality you can trust and service you deserve.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="d-flex align-items-center gap-3">
                  <FaMapMarkerAlt style={{ color: highlight }} />
                  <span style={{ color: darkMode ? "#cbd5e0" : "#64748b" }}>123 Fashion Street, Style City</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <FaPhone style={{ color: highlight }} />
                  <span style={{ color: darkMode ? "#cbd5e0" : "#64748b" }}>+1 (555) 123-4567</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <FaEnvelope style={{ color: highlight }} />
                  <span style={{ color: darkMode ? "#cbd5e0" : "#64748b" }}>support@trendora.com</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([section, links], idx) => (
            <div key={section} className="col-lg-2 col-md-3 col-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: idx * 0.1 }}>
                <h6
                  className="fw-bold mb-4"
                  style={{
                    color: highlight,
                    fontSize: "1rem",
                  }}
                >
                  {section}
                </h6>
                <ul className="list-unstyled">
                  {links.map((link, i) => (
                    <motion.li key={i} className="mb-3" whileHover={{ x: 5 }}>
                      <Link to={link.to} className="footer-link d-flex align-items-center gap-2 text-decoration-none" style={{ color: textColor }} onClick={() => handleFooterLinkClick(link)}>
                        <span>{link.icon}</span>
                        <span>{link.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          ))}

          {/* Newsletter Column */}
          <div className="col-lg-3 col-md-6">
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h6 className="fw-bold mb-4" style={{ color: highlight }}>
                📧 Newsletter
              </h6>
              <p className="small mb-4" style={{ color: darkMode ? "#cbd5e0" : "#64748b" }}>
                Subscribe to get exclusive offers, style tips, and early access to new collections.
              </p>

              <AnimatePresence>
                {isSubscribed ? (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="alert alert-success text-center">
                    🎉 Thank you for subscribing!

                  </motion.div>
                ) : (
                  <motion.form onSubmit={handleSubscribe} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="input-group mb-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          // تتبع كتابة البريد الإلكتروني
                          if (e.target.value.length > 0) {
                            trackEvent("newsletter_email_input", {
                              input_length: e.target.value.length,
                              has_value: e.target.value.length > 0,
                              source: "footer",
                              timestamp: new Date().toISOString(),
                            });
                          }
                        }}
                        className="form-control"
                        placeholder="Enter your email"
                        required
                        style={{
                          border: `1px solid ${borderColor}`,
                          background: darkMode ? "#1e293b" : "#fff",
                          color: textColor,
                          borderRadius: "10px 0 0 10px",
                        }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn fw-semibold"
                        type="submit"
                        style={{
                          background: "linear-gradient(135deg, #667eea, #764ba2)",
                          color: "white",
                          border: "none",
                          borderRadius: "0 10px 10px 0",
                        }}
                      >
                        Subscribe
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Social Links */}
              <div className="mt-4">
                <p className="small fw-semibold mb-3" style={{ color: darkMode ? "#cbd5e0" : "#64748b" }}>
                  Follow Us
                </p>
                <div className="d-flex gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      className="social-icon rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: darkMode ? "#334155" : "#f1f5f9",
                        color: social.color,
                        textDecoration: "none",
                      }}
                      whileHover={{
                        scale: 1.1,
                        background: social.color,
                        color: "white",
                      }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={social.name}
                      onClick={() => handleSocialLinkClick(social)}
                    >
                      <social.icon />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div className="border-top mt-5 pt-4" style={{ borderColor: borderColor + " !important" }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="small" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                © {new Date().getFullYear()} <span style={{ color: highlight }}>Trendora</span>. All rights reserved. | Designed with ❤️ by <b>Mohamed Berik</b>
              </div>
            </div>

            <div className="col-md-6 text-md-end">
              <div className="d-flex align-items-center justify-content-md-end gap-3 flex-wrap">
                <span className="small fw-semibold" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                  We Accept:
                </span>
                <div className="d-flex gap-2">
                  {paymentMethods.map((method, index) => (
                    <motion.span
                      key={index}
                      className="small"
                      style={{ color: darkMode ? "#cbd5e0" : "#475569", cursor: "pointer" }}
                      whileHover={{ scale: 1.2 }}
                      onClick={() => {
                        // تتبع النقر على طريقة الدفع
                        trackEvent("payment_method_view", {
                          method_name: method.name,
                          source: "footer",
                          timestamp: new Date().toISOString(),
                        });
                      }}
                    >
                      {method.icon}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="btn back-to-top shadow"
            style={{
              position: "fixed",
              bottom: "30px",
              right: "30px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              zIndex: 1000,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>

      <style>{`
        .footer-link {
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }
        
        .footer-link:hover {
          color: ${highlight} !important;
          transform: translateX(5px);
        }
        
        .social-icon {
          transition: all 0.3s ease;
        }
      `}</style>
    </footer>
  );
}

export default InteractiveFooter;
