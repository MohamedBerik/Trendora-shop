import { createContext, useContext, useReducer, useCallback } from 'react';

const ReviewsContext = createContext();

const initialState = {
  reviews: [],
  isLoading: false,
  isInitialized: false,
  error: null
};

const reviewsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_REVIEWS':
      return {
        ...state,
        reviews: action.payload,
        isLoading: false,
        isInitialized: true
      };
    
    case 'ADD_REVIEW':
      return {
        ...state,
        reviews: [action.payload, ...state.reviews]
      };
    
    case 'DELETE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.filter(review => review.id !== action.payload)
      };
    
    case 'INCREMENT_HELPFUL':
      return {
        ...state,
        reviews: state.reviews.map(review =>
          review.id === action.payload
            ? { ...review, helpful: (review.helpful || 0) + 1 }
            : review
        )
      };
    
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    
    default:
      return state;
  }
};

export const ReviewsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reviewsReducer, initialState);

  const initializeReviews = useCallback(async () => {
    if (state.isInitialized) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // بيانات تجريبية
      const mockReviews = [
        {
          id: 'REV-1',
          productId: 'PROD-1',
          productName: 'Wireless Headphones',
          productImage: '/assets/img/products/headphones.jpg',
          rating: 5,
          title: 'Excellent sound quality!',
          comment: 'The sound quality is amazing and the battery life is great.',
          date: '2024-01-12',
          verified: true,
          helpful: 3
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      dispatch({ type: 'SET_REVIEWS', payload: mockReviews });
    } catch (error) {
      dispatch({ type: 'SET_REVIEWS', payload: [] });
    }
  }, [state.isInitialized]);

  const addReview = useCallback((review) => {
    const newReview = {
      id: `REV-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      verified: true,
      helpful: 0,
      ...review
    };
    dispatch({ type: 'ADD_REVIEW', payload: newReview });
  }, []);

  const deleteReview = useCallback((reviewId) => {
    dispatch({ type: 'DELETE_REVIEW', payload: reviewId });
  }, []);

  const incrementHelpful = useCallback((reviewId) => {
    dispatch({ type: 'INCREMENT_HELPFUL', payload: reviewId });
  }, []);

  const value = {
    reviews: state.reviews,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
    initializeReviews,
    addReview,
    deleteReview,
    incrementHelpful
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};