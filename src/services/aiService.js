import { mockAIService } from './mockAIService';
import { openAIService } from './openAIService';

class AIService {
  constructor() {
    this.useMock = true;
    this.apiKey = null;
  }

  // تهيئة الخدمة
  initialize(apiKey, useMock = false) {
    this.apiKey = apiKey;
    this.useMock = useMock;
    
    if (!useMock && apiKey) {
      openAIService.initialize(apiKey);
    }
  }

  // محادثة مع الذكاء الاصطناعي
  async chat(message, context = {}) {
    if (this.useMock || !this.apiKey) {
      return await mockAIService.getResponse(message, context);
    } else {
      return await openAIService.chat(message, context);
    }
  }

  // تحليل تفضيلات المستخدم
  async analyzeUserBehavior(userData) {
    if (this.useMock || !this.apiKey) {
      return await mockAIService.analyzePreferences(userData);
    } else {
      return await openAIService.analyzePreferences(userData);
    }
  }

  // توليد توصيات المنتجات
  async generateProductRecommendations(userPreferences, products) {
    if (this.useMock || !this.apiKey) {
      return await mockAIService.generateRecommendations(userPreferences, products);
    } else {
      return await openAIService.generateRecommendations(userPreferences, products);
    }
  }

  // تصنيف البحث
  async classifySearchQuery(query, products) {
    if (this.useMock || !this.apiKey) {
      return await mockAIService.classifyProducts(query, products);
    } else {
      return await openAIService.classifyProducts(query, products);
    }
  }

  // تحليل المشاعر (للتقييمات)
  async analyzeSentiment(text) {
    if (this.useMock || !this.apiKey) {
      return await mockAIService.analyzeSentiment(text);
    } else {
      return await openAIService.analyzeSentiment(text);
    }
  }
}

export const aiService = new AIService();