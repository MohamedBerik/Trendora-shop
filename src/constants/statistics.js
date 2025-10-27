// constants/statistics.js

// ==================== نطاقات التاريخ ====================
export const DATE_RANGES = {
  TODAY: 'today',
  WEEK: 'week', 
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
  CUSTOM: 'custom'
};

// إعدادات افتراضية لكل نطاق
export const DATE_RANGE_CONFIGS = {
  [DATE_RANGES.TODAY]: {
    label: 'اليوم',
    days: 1,
    getDateRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 1);
      return { start, end };
    }
  },
  [DATE_RANGES.WEEK]: {
    label: 'أسبوع',
    days: 7,
    getDateRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      return { start, end };
    }
  },
  [DATE_RANGES.MONTH]: {
    label: 'شهر', 
    days: 30,
    getDateRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      return { start, end };
    }
  },
  [DATE_RANGES.QUARTER]: {
    label: 'ربع سنة',
    days: 90,
    getDateRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 90);
      return { start, end };
    }
  },
  [DATE_RANGES.YEAR]: {
    label: 'سنة',
    days: 365,
    getDateRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 365);
      return { start, end };
    }
  }
};

// ==================== أنواع المخططات ====================
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie', 
  DOUGHNUT: 'doughnut',
  RADAR: 'radar',
  POLAR_AREA: 'polarArea'
};

// إعدادات كل نوع مخطط
export const CHART_TYPE_CONFIGS = {
  [CHART_TYPES.LINE]: {
    label: 'مخطط خطي',
    description: 'مناسب لبيانات السلاسل الزمنية',
    icon: '📈'
  },
  [CHART_TYPES.BAR]: {
    label: 'مخطط أعمدة', 
    description: 'مناسب للمقارنات بين الفئات',
    icon: '📊'
  },
  [CHART_TYPES.PIE]: {
    label: 'مخطط دائري',
    description: 'مناسب لتوزيع النسب المئوية',
    icon: '🥧'
  },
  [CHART_TYPES.DOUGHNUT]: {
    label: 'مخطط دائري مجوف',
    description: 'بديل للمخطط الدائري مع مركز فارغ',
    icon: '🍩'
  }
};

// ==================== تبويبات الإحصائيات ====================
export const STATISTICS_TABS = {
  OVERVIEW: 'overview',
  SALES: 'sales', 
  PRODUCTS: 'products',
  CUSTOMERS: 'customers',
  INVENTORY: 'inventory',
  ANALYTICS: 'analytics',
  REPORTS: 'reports'
};

// إعدادات التبويبات
export const TAB_CONFIGS = {
  [STATISTICS_TABS.OVERVIEW]: {
    label: 'نظرة عامة',
    icon: '📊',
    description: 'نظرة شاملة على جميع الإحصائيات'
  },
  [STATISTICS_TABS.SALES]: {
    label: 'المبيعات',
    icon: '💰', 
    description: 'إحصائيات المبيعات والإيرادات'
  },
  [STATISTICS_TABS.PRODUCTS]: {
    label: 'المنتجات',
    icon: '📦',
    description: 'تحليل أداء المنتجات'
  },
  [STATISTICS_TABS.CUSTOMERS]: {
    label: 'العملاء',
    icon: '👥',
    description: 'تحليل سلوك العملاء'
  },
  [STATISTICS_TABS.INVENTORY]: {
    label: 'المخزون',
    icon: '🏪',
    description: 'إدارة وتحليل المخزون'
  },
  [STATISTICS_TABS.ANALYTICS]: {
    label: 'التحليلات',
    icon: '🔍',
    description: 'تحليلات الزوار والبحث'
  },
  [STATISTICS_TABS.REPORTS]: {
    label: 'التقارير',
    icon: '📋',
    description: 'إنشاء وتصدير التقارير'
  }
};

// ==================== أنواع التقارير ====================
export const REPORT_TYPES = {
  SALES: 'sales',
  PRODUCTS: 'products',
  CUSTOMERS: 'customers', 
  INVENTORY: 'inventory',
  ANALYTICS: 'analytics'
};

export const REPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
  JSON: 'json'
};

// ==================== حالات البيانات ====================
export const DATA_STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success', 
  ERROR: 'error',
  EMPTY: 'empty'
};

// ==================== دوال مساعدة ====================
export const getDateRangeByKey = (rangeKey) => {
  return DATE_RANGE_CONFIGS[rangeKey]?.getDateRange() || DATE_RANGE_CONFIGS[DATE_RANGES.WEEK].getDateRange();
};

export const getTabConfig = (tabKey) => {
  return TAB_CONFIGS[tabKey] || TAB_CONFIGS[STATISTICS_TABS.OVERVIEW];
};

export const getChartConfig = (chartType) => {
  return CHART_TYPE_CONFIGS[chartType] || CHART_TYPE_CONFIGS[CHART_TYPES.LINE];
};

// تصدير افتراضي لسهولة الاستيراد
export default {
  DATE_RANGES,
  DATE_RANGE_CONFIGS,
  CHART_TYPES, 
  CHART_TYPE_CONFIGS,
  STATISTICS_TABS,
  TAB_CONFIGS,
  REPORT_TYPES,
  REPORT_FORMATS,
  DATA_STATUS,
  getDateRangeByKey,
  getTabConfig,
  getChartConfig
};