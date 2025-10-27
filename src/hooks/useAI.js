import { useState, useEffect, useCallback } from 'react';
import { mockAIService } from '../services/mockAIService';
import { openAIService } from '../services/openAIService';

export const useAI = () => {
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiConfig, setAiConfig] = useState({
    useMock: true, // استخدام البيانات الوهمية للاختبار
    apiKey: null
  });

  // إرسال رسالة للذكاء الاصطناعي
  const sendMessage = useCallback(async (message, context = {}) => {
    setIsLoading(true);
    
    try {
      let response;
      
      if (aiConfig.useMock || !aiConfig.apiKey) {
        // استخدام الخدمة الوهمية
        response = await mockAIService.getResponse(message, context);
      } else {
        // استخدام OpenAI الحقيقي
        response = await openAIService.chat(message, context);
      }

      const aiMessage = {
        id: Date.now(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };

      setConversation(prev => [...prev, aiMessage]);
      return response;
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage = {
        id: Date.now(),
        text: 'عذراً، حدث خطأ في المعالجة. يرجى المحاولة مرة أخرى.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'error'
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [aiConfig]);

  // تحليل تفضيلات المستخدم
  const analyzeUserPreferences = useCallback(async (userBehavior) => {
    const preferences = await mockAIService.analyzePreferences(userBehavior);
    return preferences;
  }, []);

  // توليد توصيات المنتجات
  const generateRecommendations = useCallback(async (userPreferences, products) => {
    const recommendations = await mockAIService.generateRecommendations(userPreferences, products);
    return recommendations;
  }, []);

  // تصنيف المنتجات بناءً على البحث
  const classifyProducts = useCallback(async (searchQuery, products) => {
    const classified = await mockAIService.classifyProducts(searchQuery, products);
    return classified;
  }, []);

  // تفعيل/تعطيل الذكاء الاصطناعي الحقيقي
  const enableRealAI = useCallback((apiKey) => {
    setAiConfig(prev => ({
      ...prev,
      useMock: false,
      apiKey
    }));
  }, []);

  const disableRealAI = useCallback(() => {
    setAiConfig(prev => ({
      ...prev,
      useMock: true,
      apiKey: null
    }));
  }, []);

  // مسح المحادثة
  const clearConversation = useCallback(() => {
    setConversation([]);
  }, []);

  return {
    conversation,
    isLoading,
    sendMessage,
    analyzeUserPreferences,
    generateRecommendations,
    classifyProducts,
    enableRealAI,
    disableRealAI,
    clearConversation,
    aiConfig
  };
};