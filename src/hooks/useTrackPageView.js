// hooks/useTrackPageView.js
import { useEffect } from 'react';
import { useAnalytics } from './useAnalytics';

export const useTrackPageView = (pageName, options = {}) => {
  const { trackPageView } = useAnalytics();
  const { 
    enabled = true, 
    dependencies = [],
    skipIfAutoTracked = true 
  } = options;

  useEffect(() => {
    if (!enabled) return;
    
    // ✅ تخطي إذا كان التتبع التلقائي نشطاً
    if (skipIfAutoTracked && isPageAutoTracked()) {
      console.warn('⚠️ useTrackPageView: Auto page tracking active, skipping manual track');
      return;
    }
    
    trackPageView(pageName, {
      tracking_source: 'manual_hook',
      hook_name: 'useTrackPageView',
      manual_override: true
    });
  }, [trackPageView, pageName, enabled, skipIfAutoTracked, ...dependencies]);
};

// ✅ التحقق من التتبع التلقائي للصفحات
const isPageAutoTracked = () => {
  return window.location.pathname !== '/custom-page'; // صفحات مخصصة لا يتم تتبعها تلقائياً
};

export default useTrackPageView;