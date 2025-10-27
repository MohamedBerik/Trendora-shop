import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // تحميل الـ Wishlist من localStorage عند التحميل
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // حفظ الـ Wishlist في localStorage عند التغيير
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // إضافة منتج إلى الـ Wishlist
  const addToWishlist = (product) => {
    const wishlistItem = {
      id: Date.now(), // إنشاء ID فريد
      productId: product.id,
      product: product,
      addedDate: new Date().toISOString().split('T')[0],
      note: "",
      priority: "medium"
    };

    setWishlist(prev => {
      // التحقق من عدم وجود المنتج مسبقاً
      const exists = prev.find(item => item.productId === product.id);
      if (exists) {
        return prev; // إذا كان موجوداً بالفعل، لا نضيفه مرة أخرى
      }
      return [...prev, wishlistItem];
    });
  };

  // إزالة منتج من الـ Wishlist
  const removeFromWishlist = (wishlistId) => {
    setWishlist(prev => prev.filter(item => item.id !== wishlistId));
  };

  // إزالة منتج باستخدام productId
  const removeFromWishlistByProductId = (productId) => {
    setWishlist(prev => prev.filter(item => item.productId !== productId));
  };

  // التحقق مما إذا كان المنتج في الـ Wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.productId === productId);
  };

  // الحصول على عدد العناصر في الـ Wishlist
  const getWishlistCount = () => {
    return wishlist.length;
  };

  // تبديل حالة المنتج (إضافة/إزالة)
  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlistByProductId(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // تحديث ملاحظة المنتج
  const updateNote = (wishlistId, note) => {
    setWishlist(prev => 
      prev.map(item => 
        item.id === wishlistId ? { ...item, note } : item
      )
    );
  };

  // تحديث أولوية المنتج
  const updatePriority = (wishlistId, priority) => {
    setWishlist(prev => 
      prev.map(item => 
        item.id === wishlistId ? { ...item, priority } : item
      )
    );
  };

  // تنظيف الـ Wishlist بالكامل
  const clearWishlist = () => {
    setWishlist([]);
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    removeFromWishlistByProductId,
    isInWishlist,
    getWishlistCount,
    toggleWishlist,
    updateNote,
    updatePriority,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};