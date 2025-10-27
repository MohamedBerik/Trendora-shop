// hooks/useTrackAddToCart.js
import { useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

export const useTrackAddToCart = (dependencies = []) => {
  const { trackAddToCart } = useAnalytics();
  
  const track = useCallback((product, quantity = 1, metadata = {}) => {
    return trackAddToCart(product, quantity, {
      ...metadata,
      tracking_source: 'manual_hook', 
      hook_name: 'useTrackAddToCart'
    });
  }, [trackAddToCart, ...dependencies]);

  return track;
};

export default useTrackAddToCart;