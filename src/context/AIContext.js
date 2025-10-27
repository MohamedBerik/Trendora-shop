import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { mockAIService } from '../services/mockAIService';

const AIContext = createContext();

// أنواع الإجراءات
const AI_ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  ADD_MESSAGE: 'ADD_MESSAGE',
  CLEAR_CONVERSATION: 'CLEAR_CONVERSATION',
  SET_RECOMMENDATIONS: 'SET_RECOMMENDATIONS',
  SET_ERROR: 'SET_ERROR',
  TOGGLE_AI_ASSISTANT: 'TOGGLE_AI_ASSISTANT'
};

// الحالة الابتدائية
const initialState = {
  conversation: [],
  recommendations: [],
  isLoading: false,
  isAssistantOpen: false,
  error: null,
  aiConfig: {
    useMock: true,
    apiKey: null,
    model: 'gpt-3.5-turbo'
  }
};

// Reducer للإجراءات
const aiReducer = (state, action) => {
  switch (action.type) {
    case AI_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case AI_ACTION_TYPES.ADD_MESSAGE:
      return {
        ...state,
        conversation: [...state.conversation, action.payload],
        error: null
      };
    
    case AI_ACTION_TYPES.CLEAR_CONVERSATION:
      return {
        ...state,
        conversation: []
      };
    
    case AI_ACTION_TYPES.SET_RECOMMENDATIONS:
      return {
        ...state,
        recommendations: action.payload
      };
    
    case AI_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case AI_ACTION_TYPES.TOGGLE_AI_ASSISTANT:
      return {
        ...state,
        isAssistantOpen: action.payload
      };
    
    default:
      return state;
  }
};

// Provider component
export const AIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(aiReducer, initialState);

  // إرسال رسالة
  const sendMessage = useCallback(async (message, context = {}) => {
    dispatch({ type: AI_ACTION_TYPES.SET_LOADING, payload: true });

    try {
      // إضافة رسالة المستخدم أولاً
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date()
      };
      
      dispatch({ type: AI_ACTION_TYPES.ADD_MESSAGE, payload: userMessage });

      // الحصول على رد الذكاء الاصطناعي
      const response = await mockAIService.getResponse(message, context);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'ai',
        timestamp: new Date()
      };
      
      dispatch({ type: AI_ACTION_TYPES.ADD_MESSAGE, payload: aiMessage });
      
      return response;
    } catch (error) {
      dispatch({ 
        type: AI_ACTION_TYPES.SET_ERROR, 
        payload: 'فشل في التواصل مع الذكاء الاصطناعي' 
      });
    }
  }, []);

  // توليد توصيات
  const generateRecommendations = useCallback(async (userPreferences, products) => {
    try {
      const recommendations = await mockAIService.generateRecommendations(userPreferences, products);
      dispatch({ type: AI_ACTION_TYPES.SET_RECOMMENDATIONS, payload: recommendations });
      return recommendations;
    } catch (error) {
      dispatch({ 
        type: AI_ACTION_TYPES.SET_ERROR, 
        payload: 'فشل في توليد التوصيات' 
      });
    }
  }, []);

  // مسح المحادثة
  const clearConversation = useCallback(() => {
    dispatch({ type: AI_ACTION_TYPES.CLEAR_CONVERSATION });
  }, []);

  // فتح/إغلاق المساعد
  const toggleAssistant = useCallback((isOpen) => {
    dispatch({ type: AI_ACTION_TYPES.TOGGLE_AI_ASSISTANT, payload: isOpen });
  }, []);

  const value = {
    ...state,
    sendMessage,
    generateRecommendations,
    clearConversation,
    toggleAssistant
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};

// Hook لاستخدام Context
export const useAIContext = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIContext must be used within an AIProvider');
  }
  return context;
};