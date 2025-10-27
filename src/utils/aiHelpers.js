// دوال مساعدة للذكاء الاصطناعي

// تحليل نص البحث واستخراج الكلمات المفتاحية
export const extractKeywords = (text) => {
  const stopWords = ['في', 'من', 'على', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'الذي', 'التي'];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  
  return [...new Set(words)]; // إزالة التكرارات
};

// حساب درجة التطابق بين البحث والمنتج
export const calculateRelevanceScore = (query, product) => {
  const queryWords = extractKeywords(query);
  const productText = `${product.name} ${product.category} ${product.description}`.toLowerCase();
  
  let score = 0;
  
  queryWords.forEach(word => {
    if (productText.includes(word)) {
      score += 1;
    }
  });
  
  // تطبيع الدرجة
  return score / Math.max(queryWords.length, 1);
};

// تصنيف نية المستخدم من البحث
export const classifyUserIntent = (query) => {
  const lowerQuery = query.toLowerCase();
  
  const intents = {
    productSearch: ['أريد', 'ابحث عن', 'محتاج', 'أبحث', 'شراء', 'اشتري'],
    priceInquiry: ['سعر', 'كم', 'ثمن', 'تكلفة', 'غالي', 'رخيص'],
    categoryBrowse: ['قسم', 'فئة', 'نوع', 'أقسام', 'فئات'],
    support: ['مساعدة', 'مساعده', 'دعم', 'استفسار', 'سؤال'],
    offers: ['عرض', 'خصم', 'تخفيض', 'عروض', 'promotion']
  };
  
  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      return intent;
    }
  }
  
  return 'general';
};

// تنسيق رد الذكاء الاصطناعي
export const formatAIResponse = (response, type = 'text') => {
  const formattedResponse = {
    text: response,
    type,
    timestamp: new Date(),
    hasProducts: false
  };
  
  // اكتشاف إذا كان الرد يحتوي على توصيات منتجات
  if (response.includes('منتج') || response.includes('سلعة') || response.includes('أوصي')) {
    formattedResponse.hasProducts = true;
  }
  
  return formattedResponse;
};

// تحليل سلوك المستخدم للتوصيات
export const analyzeUserBehavior = (userActions) => {
  const analysis = {
    viewedCategories: new Set(),
    searchedTerms: [],
    favoritePriceRange: { min: Infinity, max: 0 },
    preferredBrands: new Set(),
    activityFrequency: 'low'
  };
  
  userActions.forEach(action => {
    if (action.type === 'view_product' && action.product) {
      analysis.viewedCategories.add(action.product.category);
      analysis.preferredBrands.add(action.product.brand);
      
      // تحديث نطاق السعر
      analysis.favoritePriceRange.min = Math.min(
        analysis.favoritePriceRange.min, 
        action.product.price
      );
      analysis.favoritePriceRange.max = Math.max(
        analysis.favoritePriceRange.max, 
        action.product.price
      );
    }
    
    if (action.type === 'search') {
      analysis.searchedTerms.push(action.query);
    }
  });
  
  // تحويل الـ Sets إلى Arrays
  analysis.viewedCategories = Array.from(analysis.viewedCategories);
  analysis.preferredBrands = Array.from(analysis.preferredBrands);
  
  // تحديد تردد النشاط
  if (userActions.length > 20) analysis.activityFrequency = 'high';
  else if (userActions.length > 10) analysis.activityFrequency = 'medium';
  
  return analysis;
};

// إنشاء وصف ذكي للمنتج
export const generateProductDescription = (product) => {
  const templates = [
    `منتج ${product.category} ${product.brand ? `من ${product.brand}` : ''} يتميز بـ ${product.features?.join(' و ') || 'جودة عالية'}`,
    `اكتشف ${product.name} - ${product.category} ${product.rating ? `بتقييم ${product.rating} نجوم` : 'بجودة ممتازة'}`,
    `${product.name} هو اختيار مثالي ${product.price < 100 ? 'بسعر معقول' : 'بجودة فائقة'} ${product.features ? `مع ${product.features[0]}` : ''}`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
};

// تصفية المنتجات بناءً على تفضيلات الذكاء الاصطناعي
export const filterProductsByAIPreferences = (products, userPreferences) => {
  return products
    .map(product => {
      let score = 0;
      
      // مطابقة الفئة
      if (userPreferences.preferredCategories.includes(product.category)) {
        score += 0.4;
      }
      
      // مطابقة نطاق السعر
      if (product.price >= userPreferences.priceRange.min && 
          product.price <= userPreferences.priceRange.max) {
        score += 0.3;
      }
      
      // مطابقة العلامة التجارية
      if (userPreferences.favoriteBrands.includes(product.brand)) {
        score += 0.3;
      }
      
      return { ...product, aiScore: score };
    })
    .filter(product => product.aiScore > 0.3)
    .sort((a, b) => b.aiScore - a.aiScore);
};