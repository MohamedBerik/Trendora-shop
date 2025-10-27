import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
import { useAuth } from "../../context/AuthContext";
import { FaShoppingCart, FaUserCircle, FaBell, FaBars, FaSearch, FaTrash, FaMoon, FaSun, FaHeart, FaStar, FaChevronDown, FaTimes, FaHistory, FaFire } from "react-icons/fa";
import AuthModal from "../../Pages/auth/AuthModal";
import { apiValue } from "../../constants/AllData";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "../../Pages/notifications/NotificationBell";
import AIChatButton from "../../components/ai/AIChatButton";
import LanguageSwitcher from "../../components/common/LanguageSwitcher";
import { useWishlist } from "../../context/WishlistContext";

// ✅ استيراد useAnalytics
import { useAnalytics } from "../../hooks/hooks-exports";

export default function ModernNavbar() {
  const { items, totalItems, removeItem, cartTotal, updateItemQuantity, emptyCart } = useCart();
  const { getWishlistCount } = useWishlist();

  const { user, logout } = useAuth();
  const data = useContext(apiValue);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoverCart, setHoverCart] = useState(false);
  const [hoverMega, setHoverMega] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [bellHover, setBellHover] = useState(false);
  const [bellActive, setBellActive] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // ✅ استخدام useAnalytics
  const { trackEvent, trackSearch, trackProductView, trackAddToCart } = useAnalytics();

  // 🔧 Enhanced Categories Structure
  const enhancedDropdownSections = {
    "👕 Fashion": {
      Men: ["T-Shirts", "Jeans", "Shoes", "Accessories", "Suits", "Sportswear"],
      Women: ["Dresses", "Tops", "Shoes", "Bags", "Jewelry", "Activewear"],
      Kids: ["Boys Clothing", "Girls Clothing", "Baby Items", "Shoes", "Toys"],
    },
    "💻 Electronics": {
      "Mobile & Tablets": ["Smartphones", "Tablets", "Accessories", "Wearables"],
      Computers: ["Laptops", "Desktops", "Monitors", "Accessories"],
      Audio: ["Headphones", "Speakers", "Earbuds", "Home Audio"],
    },
    "🏠 Home & Living": {
      Furniture: ["Living Room", "Bedroom", "Kitchen", "Office"],
      Decor: ["Lighting", "Wall Art", "Plants", "Rugs"],
      Kitchen: ["Cookware", "Appliances", "Utensils", "Storage"],
    },
    "🎯 Sports & Outdoors": {
      Fitness: ["Gym Equipment", "Yoga", "Cardio", "Strength Training"],
      Outdoor: ["Camping", "Hiking", "Cycling", "Water Sports"],
      "Team Sports": ["Soccer", "Basketball", "Tennis", "Football"],
    },
  };

  // 🏷️ Popular Searches - مع تحسين الأسماء
  const popularSearches = [
    { term: "Smartphone", icon: "📱" },
    { term: "Laptop", icon: "💻" },
    { term: "Shoes", icon: "👟" },
    { term: "Watch", icon: "⌚" },
    { term: "Headphones", icon: "🎧" },
    { term: "Dress", icon: "👗" },
    { term: "Jacket", icon: "🧥" },
    { term: "Camera", icon: "📷" },
  ];

  // 🔍 Enhanced Search State
  const [suggestions, setSuggestions] = useState([]);
  const [showPopularSearches, setShowPopularSearches] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  // ✅ تتبع عرض النافبار
  useEffect(() => {
    trackEvent('navbar_loaded', {
      user_logged_in: !!user,
      cart_items_count: totalItems,
      wishlist_count: getWishlistCount(),
      dark_mode: darkMode,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent, user, totalItems, getWishlistCount, darkMode]);

  // 📝 Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // 💾 Save search history to localStorage
  const saveToSearchHistory = useCallback(
    (term) => {
      const trimmedTerm = term.trim();
      if (!trimmedTerm) return;

      const updatedHistory = [trimmedTerm, ...searchHistory.filter((item) => item !== trimmedTerm)].slice(0, 5);

      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    },
    [searchHistory]
  );

  // 🗑️ Clear search history
  const clearSearchHistory = useCallback(() => {
    // ✅ تتبع مسح سجل البحث
    trackEvent('search_history_cleared', {
      previous_history_count: searchHistory.length,
      timestamp: new Date().toISOString()
    });
    
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  }, [trackEvent, searchHistory.length]);

  // 🎯 Enhanced Search Handler مع تتبع الإحصائيات
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      const trimmedTerm = searchTerm.trim();

      if (trimmedTerm) {
        // ✅ تتبع عملية البحث في الإحصائيات
        trackSearch(trimmedTerm, {
          results_count: suggestions.length,
          has_suggestions: suggestions.length > 0,
          source: 'navbar_search',
          search_history_count: searchHistory.length,
          timestamp: new Date().toISOString()
        });
        
        saveToSearchHistory(trimmedTerm);
        navigate(`/products?search=${encodeURIComponent(trimmedTerm)}`);
        setSearchTerm("");
        setSuggestions([]);
        setShowPopularSearches(false);
        setIsSearchFocused(false);
      }
    },
    [searchTerm, navigate, saveToSearchHistory, suggestions.length, searchHistory.length, trackSearch]
  );

  // 🔍 Enhanced Search Suggestions with Performance Optimizations
  useEffect(() => {
    const trimmedTerm = searchTerm.trim();

    if (!trimmedTerm) {
      setSuggestions([]);
      setShowPopularSearches(true);
      return;
    }

    const timer = setTimeout(() => {
      const searchTerms = new Set(trimmedTerm.toLowerCase().split(" "));

      const filtered = data
        .filter((item) => {
          const itemTitle = item.title?.toLowerCase() || "";
          const itemCategory = item.category?.toLowerCase() || "";
          const itemBrand = item.brand?.toLowerCase() || "";

          return Array.from(searchTerms).every((term) => itemTitle.includes(term) || itemCategory.includes(term) || itemBrand.includes(term));
        })
        .sort((a, b) => {
          const aTitleMatch = a.title?.toLowerCase().includes(trimmedTerm.toLowerCase());
          const bTitleMatch = b.title?.toLowerCase().includes(trimmedTerm.toLowerCase());

          if (aTitleMatch && !bTitleMatch) return -1;
          if (!aTitleMatch && bTitleMatch) return 1;

          return (b.rating || 0) - (a.rating || 0);
        })
        .slice(0, 8);

      setSuggestions(filtered);
      setShowPopularSearches(false);

      // ✅ تتبع توليد الاقتراحات
      if (filtered.length > 0) {
        trackEvent('search_suggestions_generated', {
          search_term: trimmedTerm,
          suggestions_count: filtered.length,
          timestamp: new Date().toISOString()
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, data, trackEvent]);

  // 🎯 Enhanced Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
        setShowPopularSearches(false);
        setHoverMega(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  // ⌨️ Enhanced Keyboard Navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        setSuggestions([]);
        setShowPopularSearches(false);
        setIsSearchFocused(false);
        
        // ✅ تتبع استخدام مفتاح Escape
        trackEvent('search_escape_pressed', {
          search_term: searchTerm,
          has_suggestions: suggestions.length > 0,
          timestamp: new Date().toISOString()
        });
      }

      if (e.key === "Enter" && searchTerm.trim()) {
        handleSearch(e);
      }
    },
    [searchTerm, handleSearch, suggestions.length, trackEvent]
  );

  // 🔄 Enhanced Search Input Handler
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // ✅ تتبع كتابة البحث
    if (value.length > 0) {
      trackEvent('search_typing', {
        input_length: value.length,
        has_focus: true,
        timestamp: new Date().toISOString()
      });
    }

    if (!value.trim()) {
      setSuggestions([]);
      setShowPopularSearches(true);
    }
  }, [trackEvent]);

  // 🎯 Handle Popular Search Click مع تتبع الإحصائيات
  const handlePopularSearchClick = useCallback(
    (popularTerm) => {
      setSearchTerm(popularTerm);
      saveToSearchHistory(popularTerm);
      
      // ✅ تتبع عملية البحث الشائعة
      trackSearch(popularTerm, {
        results_count: 0,
        source: 'popular_search',
        is_popular: true,
        timestamp: new Date().toISOString()
      });
      
      navigate(`/products?search=${encodeURIComponent(popularTerm)}`);
      setSuggestions([]);
      setShowPopularSearches(false);
      setIsSearchFocused(false);
    },
    [navigate, saveToSearchHistory, trackSearch]
  );

  // 🎯 Handle Suggestion Click مع تتبع الإحصائيات
  const handleSuggestionClick = useCallback(
    (item) => {
      saveToSearchHistory(item.title);
      
      // ✅ تتبع مشاهدة المنتج من البحث
      trackProductView(item, {
        source: 'search_suggestion',
        search_term: searchTerm,
        suggestion_rank: suggestions.findIndex(s => s.id === item.id) + 1,
        timestamp: new Date().toISOString()
      });
      
      navigate(`/singleproduct/${item.id}`);
      setSearchTerm("");
      setSuggestions([]);
      setShowPopularSearches(false);
      setIsSearchFocused(false);
    },
    [navigate, saveToSearchHistory, trackProductView, searchTerm, suggestions]
  );

  // 🎯 Handle Search History Click
  const handleSearchHistoryClick = useCallback((term) => {
    setSearchTerm(term);
    inputRef.current?.focus();
    
    // ✅ تتبع استخدام سجل البحث
    trackEvent('search_history_used', {
      search_term: term,
      history_position: searchHistory.indexOf(term) + 1,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent, searchHistory]);

  // 🌙 Dark Mode Handler
  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true" || window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.body.style.background = newDarkMode ? "#0f172a" : "#f8fafc";
    document.body.style.color = newDarkMode ? "#e2e8f0" : "#1e293b";
    document.body.style.transition = "all 0.3s ease";
    
    // ✅ تتبع تغيير وضع الظلام
    trackEvent('dark_mode_toggled', {
      new_mode: newDarkMode ? 'dark' : 'light',
      timestamp: new Date().toISOString()
    });
  };

  // 🎯 Handle Category Navigation - الدالة الجديدة للتنقل
  const handleCategoryNavigation = useCallback(
    (categoryType, value) => {
      let queryParam = "";

      switch (categoryType) {
        case "mainCategory":
          queryParam = `category=${encodeURIComponent(value)}`;
          break;
        case "subCategory":
          queryParam = `category=${encodeURIComponent(value)}`;
          break;
        case "item":
          queryParam = `subcategory=${encodeURIComponent(value)}`;
          break;
        default:
          queryParam = `category=${encodeURIComponent(value)}`;
      }

      // ✅ تتبع التنقل في التصنيفات
      trackEvent('category_navigation', {
        category_type: categoryType,
        category_value: value,
        source: 'navbar_mega_menu',
        timestamp: new Date().toISOString()
      });

      navigate(`/products?${queryParam}`);
      setHoverMega(false);
      setMobileMenuOpen(false);
    },
    [navigate, trackEvent]
  );

  // 🛒 Handle Cart Interactions with Analytics
  const handleCartItemClick = useCallback((item) => {
    // ✅ تتبع النقر على عنصر في السلة
    trackEvent('cart_item_click', {
      product_id: item.id,
      product_name: item.title,
      product_price: item.price,
      quantity: item.quantity,
      source: 'navbar_cart_dropdown',
      timestamp: new Date().toISOString()
    });
    
    navigate(`/singleproduct/${item.id}`);
    setHoverCart(false);
  }, [navigate, trackEvent]);

  const handleViewCart = useCallback(() => {
    // ✅ تتبع النقر على عرض السلة
    trackEvent('view_cart_click', {
      cart_items_count: totalItems,
      cart_total: cartTotal,
      source: 'navbar_cart_dropdown',
      timestamp: new Date().toISOString()
    });
    
    navigate("/cart");
    setHoverCart(false);
  }, [navigate, trackEvent, totalItems, cartTotal]);

  const handleCheckout = useCallback(() => {
    // ✅ تتبع بدء عملية الدفع
    trackEvent('checkout_initiated', {
      cart_items_count: totalItems,
      cart_total: cartTotal,
      source: 'navbar_cart_dropdown',
      timestamp: new Date().toISOString()
    });
    
    navigate("/checkout");
    setHoverCart(false);
  }, [navigate, trackEvent, totalItems, cartTotal]);

  const handleClearCart = useCallback(() => {
    // ✅ تتبع مسح السلة
    trackEvent('cart_cleared', {
      previous_items_count: totalItems,
      previous_total: cartTotal,
      source: 'navbar_cart_dropdown',
      timestamp: new Date().toISOString()
    });
    
    emptyCart();
  }, [emptyCart, trackEvent, totalItems, cartTotal]);

  // 👤 Handle User Actions with Analytics
  const handleUserLogin = useCallback(() => {
    // ✅ تتبع فتح نموذج تسجيل الدخول
    trackEvent('login_modal_opened', {
      source: 'navbar',
      timestamp: new Date().toISOString()
    });
    
    setShowAuthModal(true);
  }, [trackEvent]);

  const handleUserLogout = useCallback(() => {
    // ✅ تتبع تسجيل الخروج
    trackEvent('user_logged_out', {
      user_name: user?.name,
      timestamp: new Date().toISOString()
    });
    
    logout();
  }, [logout, trackEvent, user]);

  const handleUserProfileNavigation = useCallback((section) => {
    // ✅ تتبع التنقل في ملف المستخدم
    trackEvent('user_profile_navigation', {
      section: section,
      source: 'navbar_dropdown',
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  // 🎨 Navbar Styles
  const navbarStyle = {
    background: darkMode ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: darkMode ? "#e2e8f0" : "#fff",
    transition: "all 0.3s ease",
    zIndex: 2000,
    backdropFilter: "blur(10px)",
    borderBottom: darkMode ? "1px solid #334155" : "1px solid rgba(255,255,255,0.1)",
  };

  // أيقونة السلة الشفافة ذات الحواف البيضاء
  const CartIcon = () => (
    <motion.div 
      animate={hoverCart ? { scale: [1, 1.1, 1] } : {}} 
      transition={{ duration: 0.4 }} 
      className="d-inline-block" 
      onMouseEnter={() => {
        setHoverCart(true);
        // ✅ تتبع عرض dropdown السلة
        trackEvent('cart_dropdown_opened', {
          cart_items_count: totalItems,
          timestamp: new Date().toISOString()
        });
      }} 
      onMouseLeave={() => setHoverCart(false)}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          border: "2px solid #fff",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          e.currentTarget.style.borderColor = "#00ffcc";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          e.currentTarget.style.borderColor = "#fff";
        }}
      >
        <FaShoppingCart
          size={20}
          style={{
            color: "#fff",
            transition: "all 0.3s ease",
          }}
        />
      </div>
      
      {totalItems > 0 && (
        <span
          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          style={{
            transform: "translate(-30%, -30%)",
            minWidth: "22px",
            height: "22px",
            fontSize: "0.75rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700",
            border: "2px solid rgba(255, 255, 255, 0.8)",
            boxShadow: "0 2px 8px rgba(220, 53, 69, 0.4)",
            animation: "pulse 2s infinite",
          }}
        >
          {totalItems}
        </span>
      )}
    </motion.div>
  );

  return (
    <nav className="navbar navbar-expand-lg shadow sticky-top py-2" style={navbarStyle}>
      <div className="container-fluid">
        {/* Logo */}
        <Link 
          className="navbar-brand fw-bold fs-3 me-4 text-white d-flex align-items-center" 
          to="/" 
          style={{ textDecoration: "none" }}
          onClick={() => {
            // ✅ تتبع النقر على الشعار
            trackEvent('logo_click', {
              source: 'navbar',
              timestamp: new Date().toISOString()
            });
          }}
        >
          <motion.span whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }} className="me-2">
            🛍️
          </motion.span>
          Trendora
        </Link>

        {/* Mobile Toggle */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            // ✅ تتبع فتح/إغلاق القائمة المتنقلة
            trackEvent('mobile_menu_toggled', {
              action: mobileMenuOpen ? 'close' : 'open',
              timestamp: new Date().toISOString()
            });
          }} 
          style={{ background: "transparent" }}
        >
          <motion.div animate={mobileMenuOpen ? { rotate: 90 } : { rotate: 0 }} transition={{ duration: 0.3 }}>
            <FaBars color={darkMode ? "#e2e8f0" : "#fff"} />
          </motion.div>
        </button>

        <div className={`collapse navbar-collapse ${mobileMenuOpen ? "show" : ""}`} id="navbarModern">
          {/* 🔍 Enhanced Search Section */}
          <div className="d-flex align-items-center flex-fill me-4 position-relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="d-flex flex-fill position-relative">
              <div className="input-group search-container-modern">
                {/* Categories Dropdown */}
                <div className="dropdown">
                  <button
                    className="btn dropdown-toggle fw-semibold border-0 d-flex align-items-center gap-2"
                    style={{
                      background: darkMode ? "#00ffcc" : "#00ffcc",
                      color: "#000",
                      padding: "12px 20px",
                      borderRadius: "12px 0 0 12px",
                      border: "none",
                      minWidth: "160px",
                      fontSize: "0.9rem",
                      borderRight: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
                    }}
                    type="button"
                    onClick={() => {
                      setHoverMega(!hoverMega);
                      // ✅ تتبع فتح القائمة الميجا
                      trackEvent('mega_menu_toggled', {
                        action: hoverMega ? 'close' : 'open',
                        source: 'navbar_button',
                        timestamp: new Date().toISOString()
                      });
                    }}
                    onMouseEnter={() => setHoverMega(true)}
                  >
                    <span>All Categories</span>
                    <FaChevronDown size={12} />
                  </button>
                </div>

                {/* Search Input Container */}
                <div className="position-relative flex-fill" style={{ zIndex: 1000 }}>
                  <input
                    ref={inputRef}
                    type="search"
                    className="form-control border-0"
                    placeholder="Search for products, brands, or categories..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      setIsSearchFocused(true);
                      if (!searchTerm.trim()) {
                        setShowPopularSearches(true);
                      }
                      // ✅ تتبع تركيز حقل البحث
                      trackEvent('search_input_focused', {
                        has_search_term: !!searchTerm.trim(),
                        timestamp: new Date().toISOString()
                      });
                    }}
                    onKeyDown={handleKeyDown}
                    style={{
                      background: darkMode ? "#1e293b" : "#fff",
                      color: darkMode ? "#f1f5f9" : "#333",
                      fontSize: "1rem",
                      padding: "12px 50px 12px 20px",
                      height: "100%",
                      borderRadius: "0",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                    }}
                  />

                  {/* Clear Search Button */}
                  {searchTerm && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      type="button"
                      className="btn btn-sm border-0 position-absolute"
                      style={{
                        right: "70px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        color: darkMode ? "#94a3b8" : "#64748b",
                        zIndex: 1002,
                        width: "32px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                      }}
                      whileHover={{ 
                        scale: 1.1,
                        background: darkMode ? "rgba(148, 163, 184, 0.1)" : "rgba(100, 116, 139, 0.1)"
                      }}
                      onClick={() => {
                        setSearchTerm("");
                        inputRef.current?.focus();
                        // ✅ تتبع مسح حقل البحث
                        trackEvent('search_input_cleared', {
                          previous_term_length: searchTerm.length,
                          timestamp: new Date().toISOString()
                        });
                      }}
                    >
                      <FaTimes size={14} />
                    </motion.button>
                  )}

                  {/* Search Icon inside input */}
                  <div className="position-absolute"
                    style={{
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: darkMode ? "#94a3b8" : "#64748b",
                      zIndex: 1001,
                    }}
                  >
                    <FaSearch size={16} />
                  </div>

                  {/* Enhanced Suggestions Dropdown */}
                  <AnimatePresence>
                    {(suggestions.length > 0 || showPopularSearches) && isSearchFocused && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="position-absolute w-100 mt-2"
                        style={{
                          zIndex: 9999,
                          top: "100%",
                          left: 0,
                        }}
                      >
                        <div
                          className="shadow-lg rounded-3 overflow-hidden"
                          style={{
                            background: darkMode ? "#1e293b" : "#fff",
                            border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
                            maxHeight: "500px",
                            overflowY: "auto",
                            backdropFilter: "blur(20px)",
                          }}
                        >
                          {/* Search History */}
                          {searchHistory.length > 0 && suggestions.length === 0 && !searchTerm && (
                            <div className="p-3 border-bottom" style={{ borderColor: darkMode ? "#334155" : "#e2e8f0" }}>
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="small fw-semibold d-flex align-items-center gap-2" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                                  <FaHistory size={12} />
                                  Recent Searches
                                </div>
                                <button 
                                  className="btn btn-sm p-0 text-decoration-none" 
                                  style={{ color: darkMode ? "#94a3b8" : "#64748b" }} 
                                  onClick={clearSearchHistory}
                                >
                                  <small>Clear</small>
                                </button>
                              </div>
                              <div className="d-flex flex-column gap-1">
                                {searchHistory.map((term, index) => (
                                  <motion.div
                                    key={index}
                                    className="d-flex align-items-center justify-content-between p-2 rounded-2"
                                    style={{
                                      cursor: "pointer",
                                      background: darkMode ? "#334155" : "#f8fafc",
                                      transition: "all 0.2s ease",
                                    }}
                                    whileHover={{ background: darkMode ? "#475569" : "#e2e8f0" }}
                                    onClick={() => handleSearchHistoryClick(term)}
                                  >
                                    <div className="d-flex align-items-center gap-2">
                                      <FaHistory size={12} style={{ color: darkMode ? "#94a3b8" : "#64748b" }} />
                                      <span style={{ color: darkMode ? "#e2e8f0" : "#1e293b", fontSize: "0.9rem" }}>{term}</span>
                                    </div>
                                    <FaSearch size={10} style={{ color: darkMode ? "#94a3b8" : "#64748b" }} />
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Popular Searches */}
                          {suggestions.length === 0 && showPopularSearches && (
                            <div className="p-4 border-bottom" style={{ borderColor: darkMode ? "#334155" : "#e2e8f0" }}>
                              <div className="small fw-semibold mb-3 d-flex align-items-center gap-2" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                                <FaFire size={14} style={{ color: "#ff6b35" }} />
                                Popular Searches
                              </div>
                              <div className="d-flex flex-wrap gap-2">
                                {popularSearches.map((item, index) => (
                                  <motion.button
                                    key={index}
                                    className="btn d-flex align-items-center gap-2 px-3 py-2"
                                    style={{
                                      background: darkMode ? "rgba(0, 255, 204, 0.1)" : "rgba(102, 126, 234, 0.1)",
                                      color: darkMode ? "#00ffcc" : "#667eea",
                                      border: `1px solid ${darkMode ? "#00ffcc" : "#667eea"}`,
                                      borderRadius: "25px",
                                      fontSize: "0.85rem",
                                      cursor: "pointer",
                                      transition: "all 0.3s ease",
                                    }}
                                    whileHover={{
                                      scale: 1.05,
                                      background: darkMode ? "#00ffcc" : "#667eea",
                                      color: "#fff",
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handlePopularSearchClick(item.term)}
                                  >
                                    <span style={{ fontSize: "0.9rem" }}>{item.icon}</span>
                                    <span>{item.term}</span>
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Search Suggestions */}
                          {suggestions.length > 0 && (
                            <div className="p-2">
                              <div className="small fw-semibold mb-2 p-2 d-flex align-items-center gap-2" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                                <FaSearch size={12} />
                                Products ({suggestions.length})
                              </div>
                              {suggestions.map((item) => (
                                <motion.div
                                  key={item.id}
                                  className="d-flex align-items-center p-3 border-bottom"
                                  style={{
                                    cursor: "pointer",
                                    background: darkMode ? "#1e293b" : "#fff",
                                    borderColor: darkMode ? "#334155" : "#f1f5f9",
                                    transition: "all 0.2s ease",
                                  }}
                                  whileHover={{ background: darkMode ? "#334155" : "#f8fafc" }}
                                  onClick={() => handleSuggestionClick(item)}
                                >
                                  <img
                                    src={item.image || item.images?.[0]}
                                    alt={item.title}
                                    style={{
                                      width: "45px",
                                      height: "45px",
                                      objectFit: "cover",
                                      borderRadius: "8px",
                                      marginRight: "12px",
                                    }}
                                  />
                                  <div className="flex-grow-1">
                                    <div
                                      className="fw-semibold text-truncate"
                                      style={{
                                        color: darkMode ? "#e2e8f0" : "#1e293b",
                                        fontSize: "0.9rem",
                                      }}
                                    >
                                      {item.title}
                                    </div>
                                    <div
                                      className="small text-truncate"
                                      style={{
                                        color: darkMode ? "#94a3b8" : "#64748b",
                                      }}
                                    >
                                      {item.category} {item.brand && `• ${item.brand}`}
                                    </div>
                                    <div className="d-flex align-items-center gap-2 mt-1">
                                      <div className="d-flex align-items-center gap-1">
                                        <FaStar size={12} color="#ffc107" />
                                        <small style={{ color: darkMode ? "#cbd5e0" : "#475569" }}>{item.rating || "4.5"}</small>
                                      </div>
                                      <small
                                        style={{
                                          color: darkMode ? "#00ffcc" : "#667eea",
                                          fontWeight: "600",
                                        }}
                                      >
                                        ${item.price}
                                      </small>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}

                          {/* Quick Actions */}
                          {searchTerm.trim() && suggestions.length === 0 && (
                            <div className="p-4 text-center" style={{ borderColor: darkMode ? "#334155" : "#e2e8f0" }}>
                              <div className="fs-1 mb-2">🔍</div>
                              <div className="fw-semibold mb-2" style={{ color: darkMode ? "#e2e8f0" : "#1e293b" }}>
                                No results found for "{searchTerm}"
                              </div>
                              <small style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>Try different keywords or browse categories</small>
                              <div className="mt-3">
                                <motion.button
                                  className="btn btn-sm"
                                  style={{
                                    background: darkMode ? "#00ffcc" : "#667eea",
                                    color: darkMode ? "#000" : "#fff",
                                    border: "none",
                                    borderRadius: "20px",
                                    padding: "8px 16px",
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  onClick={() => setHoverMega(true)}
                                >
                                  Browse Categories
                                </motion.button>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search Button */}
                <motion.button
                  className="btn border-0 fw-bold d-flex align-items-center gap-2"
                  type="submit"
                  style={{
                    background: "#00ffcc",
                    color: "#000",
                    padding: "12px 24px",
                    borderRadius: "0 12px 12px 0",
                    zIndex: 1001,
                    fontSize: "0.9rem",
                    borderLeft: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSearch />
                  <span className="d-none d-md-inline">Search</span>
                </motion.button>
              </div>
            </form>

            {/* ✅ Enhanced Mega Menu */}
            <AnimatePresence>
              {hoverMega && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="position-absolute shadow-lg rounded-4 p-1 mega-menu"
                  style={{
                    top: "100%",
                    left: "0",
                    width: "850px",
                    background: darkMode ? "linear-gradient(135deg, #1e293b, #334155)" : "linear-gradient(135deg, #ffffff, #f8fafc)",
                    border: darkMode ? "1px solid #475569" : "1px solid #e2e8f0",
                    zIndex: 9998,
                    marginTop: "8px",
                  }}
                  onMouseEnter={() => setHoverMega(true)}
                  onMouseLeave={() => setHoverMega(false)}
                >
                  <div className="row g-3">
                    {Object.entries(enhancedDropdownSections).map(([mainCategory, subCategories], idx) => (
                      <div key={mainCategory} className="col-6 col-lg-3">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="category-section">
                          {/* Main Category Header - قابل للنقر */}
                          <div
                            className="d-flex align-items-center mb-2 p-2 rounded-3"
                            style={{
                              background: darkMode ? "rgba(0, 255, 204, 0.1)" : "rgba(102, 126, 234, 0.1)",
                              cursor: "pointer",
                              minHeight: "45px",
                            }}
                            onClick={() => handleCategoryNavigation("mainCategory", mainCategory.replace("👕 ", "").replace("💻 ", "").replace("🏠 ", "").replace("🎯 ", ""))}
                          >
                            <span className="fs-5 me-2">{mainCategory.split(" ")[0]}</span>
                            <h6
                              className="fw-bold mb-0 flex-grow-1"
                              style={{
                                color: darkMode ? "#00ffcc" : "#667eea",
                                fontSize: "0.9rem",
                                lineHeight: "1.2",
                              }}
                            >
                              {mainCategory.split(" ").slice(1).join(" ")}
                            </h6>
                          </div>

                          <ul className="list-unstyled ps-1">
                            {Object.entries(subCategories).map(([subCategory, items]) => (
                              <li key={subCategory} className="mb-1">
                                {/* Sub Category - قابل للنقر */}
                                <div
                                  className="fw-semibold small mb-1"
                                  style={{
                                    color: darkMode ? "#e2e8f0" : "#475569",
                                    cursor: "pointer",
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    transition: "all 0.2s ease",
                                  }}
                                  onClick={() => handleCategoryNavigation("subCategory", subCategory)}
                                  onMouseEnter={(e) => {
                                    e.target.style.background = darkMode ? "#334155" : "#f1f5f9";
                                    e.target.style.color = darkMode ? "#00ffcc" : "#667eea";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.background = "transparent";
                                    e.target.style.color = darkMode ? "#e2e8f0" : "#475569";
                                  }}
                                >
                                  {subCategory}
                                </div>
                                <ul className="list-unstyled ps-2">
                                  {items.slice(0, 3).map((item) => (
                                    <motion.li
                                      key={item}
                                      style={{
                                        color: darkMode ? "#94a3b8" : "#64748b",
                                        fontSize: "0.75rem",
                                        padding: "2px 6px",
                                        cursor: "pointer",
                                        borderRadius: "4px",
                                        transition: "all 0.2s ease",
                                        lineHeight: "1.2",
                                        marginBottom: "2px",
                                      }}
                                      whileHover={{
                                        color: darkMode ? "#00ffcc" : "#667eea",
                                        x: 2,
                                        background: darkMode ? "#334155" : "#f1f5f9",
                                      }}
                                      transition={{ duration: 0.15 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCategoryNavigation("item", item);
                                      }}
                                    >
                                      • {item}
                                    </motion.li>
                                  ))}
                                </ul>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      </div>
                    ))}
                  </div>

                  {/* Mega Menu Footer */}
                  <motion.div className="border-top mt-3 pt-2 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ borderColor: darkMode ? "#475569" : "#e2e8f0" }}>
                    <div className="row align-items-center">
                      <div className="col-md-8 text-start">
                        <small style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                          🚚 <strong>Free shipping</strong> on orders over $50 • 🔄 <strong>Easy returns</strong> within 30 days • 💳 <strong>Secure payment</strong> guaranteed
                        </small>
                      </div>
                      <div className="col-md-4 text-end">
                        <motion.button
                          className="btn btn-sm fw-semibold"
                          style={{
                            background: "linear-gradient(135deg, #667eea, #764ba2)",
                            color: "white",
                            border: "none",
                            borderRadius: "18px",
                            padding: "6px 14px",
                            fontSize: "0.75rem",
                          }}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => {
                            // ✅ تتبع النقر على عرض جميع المنتجات
                            trackEvent('view_all_products_click', {
                              source: 'mega_menu_footer',
                              timestamp: new Date().toISOString()
                            });
                            navigate("/products");
                            setHoverMega(false);
                          }}
                        >
                          View All Products
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side Icons */}
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            {/* Change language */}
            <li className="nav-item">
              <LanguageSwitcher />
            </li>

            {/* Dark Mode Toggle */}
            <li className="nav-item">
              <motion.button
                className="btn btn-sm border-0 d-flex align-items-center justify-content-center"
                onClick={toggleDarkMode}
                style={{
                  background: darkMode ? "rgba(0, 255, 204, 0.1)" : "rgba(255, 255, 255, 0.1)",
                  color: darkMode ? "#00ffcc" : "#fff",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
              </motion.button>
            </li>

            {/* Wishlist */}
            <li className="nav-item position-relative">
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  // ✅ تتبع النقر على المفضلة
                  trackEvent('wishlist_icon_click', {
                    wishlist_count: getWishlistCount(),
                    source: 'navbar',
                    timestamp: new Date().toISOString()
                  });
                }}
              >
                <Link className="nav-link position-relative" to="/wishlist">
                  <div className="position-relative">
                    <FaHeart
                      className="heart-icon"
                      style={{
                        color: "#fff",
                        transition: "color 0.3s ease, transform 0.3s ease",
                      }}
                    />
                    {getWishlistCount() > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{
                          transform: "translate(-35%, -35%)",
                          minWidth: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.65rem",
                          fontWeight: "700",
                          padding: "0 5px",
                          border: "2px solid white",
                          boxShadow: "0 2px 8px rgba(220, 53, 69, 0.4)",
                          animation: "pulse 2s infinite",
                        }}
                      >
                        {getWishlistCount()}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            </li>

            {/* Notifications */}
            <li className="nav-item position-relative">
              <NotificationBell darkMode={darkMode} />
            </li>

            {/* Shopping Cart */}
            <li className="nav-item position-relative">
              <CartIcon />

              {/* 🛒 Enhanced Cart Dropdown */}
              <AnimatePresence>
                {hoverCart && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="position-absolute shadow-lg rounded-4 p-3 cart-dropdown"
                    style={{
                      top: "120%",
                      right: 0,
                      width: "380px",
                      background: darkMode ? "#1e293b" : "#fff",
                      zIndex: 9999,
                      border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
                    }}
                    onMouseEnter={() => setHoverCart(true)}
                    onMouseLeave={() => setHoverCart(false)}
                  >
                    {/* Cart Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0" style={{ color: darkMode ? "#e2e8f0" : "#1e293b" }}>
                        Shopping Cart ({totalItems})
                      </h6>
                      {items.length > 0 && (
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={handleClearCart} 
                          style={{ fontSize: "0.8rem" }}
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {items && items.length > 0 ? (
                      <>
                        {/* Cart Items */}
                        <div
                          className="d-flex flex-column gap-3 mb-3"
                          style={{
                            maxHeight: "280px",
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                          }}
                        >
                          {items.map((item) => (
                            <motion.div
                              key={item.id}
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="d-flex align-items-center p-3 rounded-3"
                              style={{
                                background: darkMode ? "#334155" : "#f8fafc",
                                border: darkMode ? "1px solid #475569" : "1px solid #e2e8f0",
                                transition: "all 0.3s ease",
                              }}
                            >
                              {/* Product Image */}
                              <img
                                src={item.image || item.images?.[0]}
                                alt={item.title}
                                onClick={() => handleCartItemClick(item)}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  borderRadius: "10px",
                                  marginRight: "12px",
                                  cursor: "pointer",
                                  flexShrink: 0,
                                }}
                              />

                              {/* Product Details */}
                              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                <div
                                  className="fw-semibold text-truncate mb-1"
                                  onClick={() => handleCartItemClick(item)}
                                  style={{
                                    color: darkMode ? "#00ffcc" : "#667eea",
                                    cursor: "pointer",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  {item.title}
                                </div>

                                {/* Quantity Controls */}
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                  <div className="d-flex align-items-center gap-2">
                                    <button 
                                      className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center" 
                                      style={{ width: "24px", height: "24px", padding: 0 }} 
                                      onClick={() => {
                                        updateItemQuantity(item.id, item.quantity - 1);
                                        // ✅ تتبع تقليل الكمية
                                        trackEvent('cart_quantity_decreased', {
                                          product_id: item.id,
                                          product_name: item.title,
                                          new_quantity: item.quantity - 1,
                                          timestamp: new Date().toISOString()
                                        });
                                      }} 
                                      disabled={item.quantity <= 1}
                                    >
                                      −
                                    </button>
                                    <span
                                      className="fw-bold mx-2"
                                      style={{
                                        fontSize: "0.9rem",
                                        minWidth: "20px",
                                        textAlign: "center",
                                        color: darkMode ? "#e2e8f0" : "#1e293b",
                                      }}
                                    >
                                      {item.quantity}
                                    </span>
                                    <button 
                                      className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center" 
                                      style={{ width: "24px", height: "24px", padding: 0 }} 
                                      onClick={() => {
                                        updateItemQuantity(item.id, item.quantity + 1);
                                        // ✅ تتبع زيادة الكمية
                                        trackEvent('cart_quantity_increased', {
                                          product_id: item.id,
                                          product_name: item.title,
                                          new_quantity: item.quantity + 1,
                                          timestamp: new Date().toISOString()
                                        });
                                      }}
                                    >
                                      +
                                    </button>
                                  </div>
                                  <div
                                    className="fw-bold"
                                    style={{
                                      fontSize: "0.9rem",
                                      color: darkMode ? "#e2e8f0" : "#1e293b",
                                    }}
                                  >
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </div>
                                </div>
                              </div>

                              {/* Remove Button */}
                              <button
                                className="btn btn-sm btn-outline-danger rounded-circle ms-2 d-flex align-items-center justify-content-center"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  padding: 0,
                                  flexShrink: 0,
                                }}
                                onClick={() => {
                                  removeItem(item.id);
                                  // ✅ تتبع إزالة العنصر من السلة
                                  trackEvent('cart_item_removed', {
                                    product_id: item.id,
                                    product_name: item.title,
                                    removed_quantity: item.quantity,
                                    timestamp: new Date().toISOString()
                                  });
                                }}
                              >
                                <FaTrash size={12} />
                              </button>
                            </motion.div>
                          ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="border-top pt-3" style={{ borderColor: darkMode ? "#475569" : "#e2e8f0" }}>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="fw-semibold" style={{ color: darkMode ? "#e2e8f0" : "#1e293b" }}>
                              Subtotal:
                            </span>
                            <span
                              className="fw-bold h5 mb-0"
                              style={{
                                color: darkMode ? "#00ffcc" : "#667eea",
                              }}
                            >
                              ${cartTotal.toFixed(2)}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="d-flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="btn btn-outline-primary flex-fill"
                              onClick={handleViewCart}
                              style={{
                                borderRadius: "10px",
                                borderColor: darkMode ? "#00ffcc" : "#667eea",
                                color: darkMode ? "#00ffcc" : "#667eea",
                                background: "transparent",
                              }}
                            >
                              View Cart
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="btn flex-fill"
                              onClick={handleCheckout}
                              style={{
                                background: "linear-gradient(135deg, #667eea, #764ba2)",
                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                              }}
                            >
                              Checkout
                            </motion.button>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Empty Cart State */
                      <motion.div className="text-center py-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className="fs-1 mb-3">🛒</div>
                        <div className="fw-semibold mb-2" style={{ color: darkMode ? "#e2e8f0" : "#1e293b" }}>
                          Your cart is empty
                        </div>
                        <div className="small mb-3" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>
                          Add some items to get started
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn"
                          onClick={() => {
                            // ✅ تتبع البدء في التسوق من السلة الفارغة
                            trackEvent('start_shopping_from_empty_cart', {
                              source: 'navbar_cart_dropdown',
                              timestamp: new Date().toISOString()
                            });
                            navigate("/products");
                            setHoverCart(false);
                          }}
                          style={{
                            background: "linear-gradient(135deg, #667eea, #764ba2)",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            padding: "8px 20px",
                          }}
                        >
                          Start Shopping
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* User Account */}
            <li className="nav-item">
              {user ? (
                <div className="dropdown">
                  <button
                    className="btn btn-outline-light border-0 d-flex align-items-center gap-2 dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      padding: "8px 16px",
                    }}
                  >
                    <FaUserCircle />
                    <span className="d-none d-md-inline">{user.name || "Account"}</span>
                  </button>
                  <ul
                    className="dropdown-menu shadow-lg border-0"
                    style={{
                      background: darkMode ? "#1e293b" : "#fff",
                      border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
                      borderRadius: "12px",
                    }}
                  >
                    <li>
                      <Link
                        className="dropdown-item d-flex align-items-center gap-2"
                        to="/profile"
                        style={{
                          color: darkMode ? "#e2e8f0" : "#1e293b",
                        }}
                        onClick={() => handleUserProfileNavigation('profile')}
                      >
                        👤 Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item d-flex align-items-center gap-2"
                        to="/orders"
                        style={{
                          color: darkMode ? "#e2e8f0" : "#1e293b",
                        }}
                        onClick={() => handleUserProfileNavigation('orders')}
                      >
                        📦 Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item d-flex align-items-center gap-2"
                        to="/wishlist"
                        style={{
                          color: darkMode ? "#e2e8f0" : "#1e293b",
                        }}
                        onClick={() => handleUserProfileNavigation('wishlist')}
                      >
                        ❤️ Wishlist
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button 
                        className="dropdown-item d-flex align-items-center gap-2 text-danger" 
                        onClick={handleUserLogout}
                      >
                        🚪 Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-light d-flex align-items-center gap-2"
                  onClick={handleUserLogin}
                  style={{
                    borderRadius: "10px",
                    padding: "8px 20px",
                    fontSize: "0.9rem",
                  }}
                >
                  <FaUserCircle />
                  <span className="d-none d-md-inline">Sign In</span>
                </motion.button>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal show={showAuthModal} handleClose={() => setShowAuthModal(false)} />

      {/* Custom Styles */}
      <style>{`
        .search-container-modern {
          border-radius: 12px;
          overflow: visible;
          background: transparent;
          width: 100%;
        }
        
        .mega-menu {
          backdrop-filter: blur(20px);
        }
        
        .cart-dropdown {
          backdrop-filter: blur(20px);
        }
        
        .dropdown-menu {
          backdrop-filter: blur(20px);
        }
        
        /* Scrollbar Styling */
        .cart-dropdown div[style*="overflowY: auto"]::-webkit-scrollbar {
          width: 6px;
        }
        
        .cart-dropdown div[style*="overflowY: auto"]::-webkit-scrollbar-track {
          background: ${darkMode ? "#334155" : "#f1f5f9"};
          border-radius: 3px;
        }
        
        .cart-dropdown div[style*="overflowY: auto"]::-webkit-scrollbar-thumb {
          background: ${darkMode ? "#00ffcc" : "#667eea"};
          border-radius: 3px;
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .search-container-modern {
            flex-direction: column;
            gap: 10px;
          }
          
          .mega-menu {
            width: 95vw !important;
            left: 2.5vw !important;
          }
          
          .cart-dropdown {
            width: 95vw !important;
            right: 2.5vw !important;
          }
        }
        
        /* تأثيرات الزر */
        .nav-link:hover .heart-icon {
          color: #dc3545 !important;
          transform: scale(1.1);
        }

        .nav-link:active .heart-icon {
          color: #dc3545 !important;
          transform: scale(0.9);
        }

        .nav-link.active .heart-icon {
          color: #dc3545 !important;
        }

        /* تأثير النبض للعداد */
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(220, 53, 69, 0); }
          100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
        }
        
        /* تأثيرات خاصة لأيقونة السلة */
        .cart-icon-container {
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .cart-icon-container:hover {
          transform: scale(1.05);
        }
      `}</style>
    </nav>
  );
}