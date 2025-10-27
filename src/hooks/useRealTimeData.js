// hooks/useRealTimeData.js
import { useState, useEffect, useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

export const useRealTimeData = (options = {}) => {
  const {
    enabled = true,
    refreshInterval = 30000,
    autoStart = true,
    trackEvents = true // ✅ إضافة خيار للتحكم في التتبع
  } = options;

  const { trackEvent, trackError } = useAnalytics();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // ✅ جلب البيانات المباشرة
  const fetchRealTimeData = useCallback(async (source = 'manual') => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);

    try {
      // ✅ التتبع الشرطي
      if (trackEvents) {
        trackEvent('realtime_data_fetch', { 
          source, 
          refreshInterval,
          tracking_source: 'useRealTimeData' // ✅ تمييز المصدر
        });
      }
      
      // محاكاة جلب البيانات المباشرة
      const mockData = {
        liveVisitors: Math.floor(Math.random() * 100) + 20,
        activeSessions: Math.floor(Math.random() * 50) + 10,
        // ... باقي البيانات
      };

      setData(mockData);
      setLastUpdated(new Date());
      setIsConnected(true);
      
      // ✅ التتبع الشرطي للنجاح
      if (trackEvents) {
        trackEvent('realtime_data_success', { 
          data_points: Object.keys(mockData).length,
          source,
          tracking_source: 'useRealTimeData'
        });
      }

    } catch (err) {
      const errorMsg = `فشل جلب البيانات المباشرة: ${err.message}`;
      setError(errorMsg);
      setIsConnected(false);
      
      // ✅ دائماً تتبع الأخطاء
      trackError('realtime_fetch_failed', errorMsg, 'useRealTimeData', {
        source,
        refreshInterval,
        tracking_source: 'useRealTimeData'
      });
    } finally {
      setLoading(false);
    }
  }, [enabled, refreshInterval, trackEvent, trackError, trackEvents]);

  // ✅ التحديث التلقائي
  useEffect(() => {
    if (!enabled || !autoStart) return;

    fetchRealTimeData('auto');

    const interval = setInterval(() => {
      fetchRealTimeData('auto');
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchRealTimeData, enabled, autoStart, refreshInterval]);

  // ✅ إعادة الاتصال
  const reconnect = useCallback(() => {
    if (trackEvents) {
      trackEvent('realtime_reconnect_attempt', {
        tracking_source: 'useRealTimeData'
      });
    }
    fetchRealTimeData('reconnect');
  }, [fetchRealTimeData, trackEvent, trackEvents]);

  // ✅ الباقي بدون تغيير...
  const toggleRealtime = useCallback((newState) => {
    const state = newState !== undefined ? newState : !enabled;
    if (trackEvents) {
      trackEvent('realtime_toggle', { 
        enabled: state,
        tracking_source: 'useRealTimeData'
      });
    }
    return state;
  }, [enabled, trackEvent, trackEvents]);

  const refreshNow = useCallback(() => {
    if (trackEvents) {
      trackEvent('realtime_manual_refresh', {
        tracking_source: 'useRealTimeData'
      });
    }
    return fetchRealTimeData('manual');
  }, [fetchRealTimeData, trackEvent, trackEvents]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    isConnected,
    fetchRealTimeData,
    refreshNow,
    reconnect,
    toggleRealtime,
    refreshInterval,
    isEnabled: enabled
  };
};

export default useRealTimeData;