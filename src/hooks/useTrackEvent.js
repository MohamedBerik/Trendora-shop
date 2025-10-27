// hooks/useTrackEvent.js
import { useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

export const useTrackEvent = (eventType, dependencies = []) => {
  const { trackEvent } = useAnalytics();
  
  const track = useCallback((metadata = {}) => {
    // ✅ منع التتبع إذا كان التتبع التلقائي نشطاً
    if (isEventAutoTracked(eventType)) {
      console.warn(`⚠️ useTrackEvent: "${eventType}" is auto-tracked, skipping manual track`);
      return null;
    }
    
    try {
      return trackEvent(eventType, {
        ...metadata,
        tracking_source: 'manual_hook',
        hook_name: 'useTrackEvent'
      });
    } catch (error) {
      console.error('useTrackEvent: Error tracking event', error);
      return null;
    }
  }, [trackEvent, eventType, ...dependencies]);

  return track;
};

// ✅ دالة مساعدة للتحقق من الأحداث التلقائية
const isEventAutoTracked = (eventType) => {
  const autoTrackedEvents = ['page_view', 'product_view', 'add_to_cart', 'search'];
  return autoTrackedEvents.includes(eventType);
};

export default useTrackEvent;