// خدمة وهمية لمحاكاة الذكاء الاصطناعي للاختبار
class MockAIService {
  constructor() {
    this.responses = {
      'منتجات': '🛍️ لدينا مجموعة رائعة من المنتجات! أي فئة تهمك؟ 👗 الملابس، 📱 الإلكترونيات، 🏠 المنزل، أم شيء آخر؟',
      'ملابس': '👗 قسم الملابس يحتوي على أحدث صيحات الموضة. هل تبحث عن ملابس رجالية، نسائية، أم أطفال؟',
      'إلكترونيات': '📱 لدينا أحدث الأجهزة الإلكترونية! هواتف، لابتوبات، سماعات، وأكثر. أي جهز تبحث عنه؟',
      'عروض': '🎁 لدينا عروض خاصة هذا الأسبوع! خصم 30% على الملابس، 20% على الإلكترونيات، وعروض شحن مجاني.',
      'سعر': '💵 يمكنني مساعدتك في العثور على المنتجات ضمن ميزانيتك. ما هو السعر التقريبي الذي تبحث عنه؟',
      'مساعدة': '🤝 سأسعد بمساعدتك! يمكنني: البحث عن منتجات، تقديم توصيات، الإجابة عن الأسئلة، مساعدة في الشراء.',
      'شحن': '🚚 سياسة الشحن: مجاني للطلبات فوق 200 ريال، التوصيل خلال 2-5 أيام عمل.',
      'إرجاع': '🔄 سياسة الإرجاع: يمكنك إرجاع المنتجات خلال 14 يوم مع الحفاظ على حالتها الأصلية.',
      'default': '🤔 لم أفهم سؤالك تماماً. يمكنني مساعدتك في: البحث عن منتجات، العروض، التوصيات، أو الإجابة عن أسئلتك عن المتجر.'
    };
  }

  async getResponse(message, context = {}) {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const lowerMessage = message.toLowerCase();
    
    // البحث عن أفضل رد
    for (const [key, response] of Object.entries(this.responses)) {
      if (lowerMessage.includes(key.toLowerCase())) {
        return response;
      }
    }

    // إذا كان السؤال عن منتج محدد
    if (lowerMessage.includes('أريد') || lowerMessage.includes('ابحث عن')) {
      return '🔍 يمكنني مساعدتك في العثور على هذا المنتج! هل يمكنك وصفه أكثر أو mentioning الفئة؟';
    }

    return this.responses.default;
  }

  async analyzePreferences(userData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // تحليل وهمي للبيانات
    return {
      preferredCategories: ['إلكترونيات', 'ملابس'],
      priceRange: { min: 100, max: 2000 },
      preferredStyles: ['عصري', 'عملي'],
      favoriteBrands: ['Apple', 'Samsung', 'Nike'],
      shoppingFrequency: 'أسبوعي'
    };
  }

  async generateRecommendations(userPreferences, products) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // توليد توصيات وهمية
    return products
      .filter(product => {
        const inPriceRange = product.price >= userPreferences.priceRange.min && 
                           product.price <= userPreferences.priceRange.max;
        const inPreferredCategory = userPreferences.preferredCategories.includes(product.category);
        return inPriceRange || inPreferredCategory;
      })
      .slice(0, 6)
      .map(product => ({
        ...product,
        matchScore: Math.random() * 0.5 + 0.5, // درجة تطابق بين 0.5-1
        reason: 'يناسب تفضيلاتك في التسوق'
      }));
  }

  async classifyProducts(query, products) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return products
      .filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }

  async analyzeSentiment(text) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // تحليل مشاعر وهمي
    const positiveWords = ['رائع', 'ممتاز', 'جميل', 'جيد', 'مذهل', 'سعيد'];
    const negativeWords = ['سيء', 'مخيب', 'غير جيد', 'مشكلة', 'غالي'];
    
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    
    let sentiment = 'neutral';
    let confidence = 0.5;
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      confidence = 0.7 + (positiveCount * 0.1);
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      confidence = 0.7 + (negativeCount * 0.1);
    }
    
    return {
      sentiment,
      confidence: Math.min(confidence, 0.95),
      keyPoints: [
        'تحليل تلقائي للنص',
        `الكلمات الإيجابية: ${positiveCount}`,
        `الكلمات السلبية: ${negativeCount}`
      ]
    };
  }
}

export const mockAIService = new MockAIService();