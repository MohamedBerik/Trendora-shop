// hooks/useTrackSearch.js
import { useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

export const useTrackSearch = (dependencies = []) => {
  const { trackSearch } = useAnalytics();
  
  const track = useCallback((term, resultsCount = 0, metadata = {}) => {
    return trackSearch(term, resultsCount, {
      ...metadata,
      tracking_source: 'manual_hook',
      hook_name: 'useTrackSearch'
    });
  }, [trackSearch, ...dependencies]);

  return track;
};

export default useTrackSearch;