// hooks/hooks-exports.js

// ✅ نظام التحليلات الرئيسي
export * from './useAnalytics';

// ✅ أنظمة البيانات
export * from './useStatistics';
export * from './useSalesData';
export * from './useProducts';
export * from './useCustomers';
export * from './useDashboard';
export * from './useRealTimeData';
export * from './useDataExport';

// ✅ هوكس المساعدة
export * from './useIntersectionObserver';
export * from './useLanguage';
export * from './useNotifications';
export * from './useAI';
export * from './useVoiceRecognition';

// ❌ لا تصدر الهوكس الفرعية للتتبع - موجودة في useAnalytics
// export * from './useTrackPageView';
// export * from './useTrackEvent';
// export * from './useTrackProductView';
// export * from './useTrackAddToCart';
// export * from './useTrackSearch';