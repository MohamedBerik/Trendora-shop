import { createContext, useContext, useReducer, useCallback } from 'react';

const WishlistContext = createContext();

const initialState = {
  wishlist: [],
  isLoading: false,
  isInitialized: false,
  error: null
};

// ✅ إصلاح: دمج الـ reducer المحسن مع الـ reducer الأصلي
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
   
    case 'SET_WISHLIST':
      return {
        ...state,
        wishlist: action.payload,
        isLoading: false,
        isInitialized: true
      };
   
    case 'ADD_TO_WISHLIST':
      const existingItem = state.wishlist.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state; // العنصر موجود بالفعل
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      };
   
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload)
      };
   
    case 'CLEAR_WISHLIST':
      return {
        ...state,
        wishlist: []
      };
   
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
   
    case 'UPDATE_ITEM_NOTE':
      return {
        ...state,
        wishlist: state.wishlist.map(item =>
          item.id === action.payload.itemId
            ? { ...item, note: action.payload.note }
            : item
        )
      };
   
    case 'UPDATE_ITEM_PRIORITY':
      return {
        ...state,
        wishlist: state.wishlist.map(item =>
          item.id === action.payload.itemId
            ? { ...item, priority: action.payload.priority }
            : item
        )
      };
   
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  const initializeWishlist = useCallback(async () => {
    if (state.isInitialized) return;
   
    dispatch({ type: 'SET_LOADING', payload: true });
   
    try {
      // بيانات تجريبية
      const mockWishlist = [
        {
          id: 'WISH-1',
          name: 'Wireless Earbuds',
          price: 99.99,
          originalPrice: 129.99,
          image: '/assets/img/products/earbuds.jpg',
          rating: 4.5,
          inStock: true,
          addedDate: '2024-01-15',
          note: '',
          priority: 'medium'
        },
        {
          id: 'WISH-2',
          name: 'Smart Watch',
          price: 199.99,
          originalPrice: 249.99,
          image: '/assets/img/products/watch.jpg',
          rating: 4.2,
          inStock: true,
          addedDate: '2024-01-10',
          note: 'For birthday gift',
          priority: 'high'
        }
      ];
     
      await new Promise(resolve => setTimeout(resolve, 300));
      dispatch({ type: 'SET_WISHLIST', payload: mockWishlist });
    } catch (error) {
      dispatch({ type: 'SET_WISHLIST', payload: [] });
    }
  }, [state.isInitialized]);

  const addToWishlist = useCallback((item) => {
    // ✅ إضافة قيم افتراضية للملاحظة والأولوية
    const wishlistItem = {
      ...item,
      note: item.note || '',
      priority: item.priority || 'medium',
      addedDate: item.addedDate || new Date().toISOString()
    };
    dispatch({ type: 'ADD_TO_WISHLIST', payload: wishlistItem });
  }, []);

  const removeFromWishlist = useCallback((itemId) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: itemId });
  }, []);

  // ✅ الدالة المفقودة: toggleWishlist
  const toggleWishlist = useCallback((item) => {
    const existingItem = state.wishlist.find(wishlistItem => wishlistItem.id === item.id);
    if (existingItem) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: item.id });
    } else {
      // ✅ إضافة قيم افتراضية عند التبديل
      const wishlistItem = {
        ...item,
        note: item.note || '',
        priority: item.priority || 'medium',
        addedDate: item.addedDate || new Date().toISOString()
      };
      dispatch({ type: 'ADD_TO_WISHLIST', payload: wishlistItem });
    }
  }, [state.wishlist]);

  // ✅ الدالة المفقودة: isInWishlist
  const isInWishlist = useCallback((itemId) => {
    return state.wishlist.some(item => item.id === itemId);
  }, [state.wishlist]);

  // ✅ الدالة المفقودة: clearWishlist
  const clearWishlist = useCallback(() => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  }, []);

  // ✅ الدالة المفقودة: getWishlistCount
  const getWishlistCount = useCallback(() => {
    return state.wishlist.length;
  }, [state.wishlist]);

  // ✅ الدالة المفقودة: updateNote
  const updateNote = useCallback((itemId, note) => {
    dispatch({
      type: 'UPDATE_ITEM_NOTE',
      payload: { itemId, note }
    });
  }, []);

  // ✅ الدالة المفقودة: updatePriority
  const updatePriority = useCallback((itemId, priority) => {
    dispatch({
      type: 'UPDATE_ITEM_PRIORITY',
      payload: { itemId, priority }
    });
  }, []);

  // ✅ الدالة المفقودة: getWishlistStats
  const getWishlistStats = useCallback(() => {
    const total = state.wishlist.length;
    const totalValue = state.wishlist.reduce((sum, item) => sum + (item.price || 0), 0);
    const highPriority = state.wishlist.filter(item => item.priority === 'high').length;
    const withNotes = state.wishlist.filter(item => item.note && item.note.trim()).length;
    const averagePrice = total > 0 ? totalValue / total : 0;

    return {
      total,
      totalValue,
      highPriority,
      withNotes,
      averagePrice
    };
  }, [state.wishlist]);

  // ✅ الدالة المفقودة: getWishlistByPriority
  const getWishlistByPriority = useCallback((priority) => {
    return state.wishlist.filter(item => item.priority === priority);
  }, [state.wishlist]);

  const value = {
    // State
    wishlist: state.wishlist,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
    error: state.error,
    wishlistCount: state.wishlist.length, // ✅ إضافة مباشرة
   
    // Actions
    initializeWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist, // ✅ إضافة الدالة المفقودة
    isInWishlist,   // ✅ إضافة الدالة المفقودة
    clearWishlist,  // ✅ إضافة الدالة المفقودة
    getWishlistCount, // ✅ إضافة الدالة المفقودة
    updateNote,     // ✅ إضافة الدالة المفقودة
    updatePriority, // ✅ إضافة الدالة المفقودة
    getWishlistStats, // ✅ إضافة دالة إحصاءات جديدة
    getWishlistByPriority // ✅ إضافة دالة التصفية بالأولوية
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};