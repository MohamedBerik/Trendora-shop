// hooks/useTrackProductView.js
import { useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

export const useTrackProductView = (dependencies = []) => {
  const { trackProductView } = useAnalytics();
  
  const track = useCallback((product, metadata = {}) => {
    return trackProductView(product, {
      ...metadata,
      tracking_source: 'manual_hook',
      hook_name: 'useTrackProductView'
    });
  }, [trackProductView, ...dependencies]);

  return track;
};

export default useTrackProductView;