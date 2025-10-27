import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Form, InputGroup, Badge } from 'react-bootstrap';
import { FaRobot, FaUser, FaPaperPlane, FaTimes, FaMicrophone, FaSearch, FaGift, FaStar, FaShoppingCart } from 'react-icons/fa';

const AIShoppingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "مرحباً! أنا مساعدك الذكي للتسوق. كيف يمكنني مساعدتك اليوم؟ 🤖",
      sender: 'ai'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [quickSuggestions, setQuickSuggestions] = useState([]);
  const chatRef = useRef(null);

  // ✅ الإجراءات السريعة المقترحة
  const quickActions = [
    { 
      text: "أحدث المنتجات", 
      icon: "🆕",
      prompt: "ما هي أحدث المنتجات لديكم؟"
    },
    { 
      text: "أفضل العروض", 
      icon: "🎁",
      prompt: "عرض لي أفضل العروض والتخفيضات"
    },
    { 
      text: "توصيات لك", 
      icon: "⭐", 
      prompt: "أعطني توصيات مخصصة للمنتجات"
    },
    { 
      text: "مساعدة في البحث", 
      icon: "🔍",
      prompt: "ساعدني في البحث عن منتج محدد"
    }
  ];

  // ✅ إغلاق النافذة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // ✅ تحميل الإجراءات السريعة عند فتح الشات
      setQuickSuggestions(quickActions);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // ✅ البحث الصوتي
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      handleSendMessage("المتصفح لا يدعم البحث الصوتي");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
      // إرسال تلقائي بعد الانتهاء من الكلام
      setTimeout(() => {
        handleSendMessage(transcript, true);
      }, 500);
    };

    recognition.onerror = () => {
      setIsListening(false);
      handleSendMessage("حدث خطأ في التعرف على الصوت. حاول مرة أخرى.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // ✅ محاكاة ردود الذكاء الاصطناعي
  const getAIResponse = (userMessage) => {
    const responses = {
      'منتجات': {
        text: "🛍️ لدينا مجموعة رائعة من المنتجات في عدة فئات:\n\n• 👗 **الملابس** - أحدث صيحات الموضة\n• 📱 **الإلكترونيات** - هواتف، لابتوبات، أجهزة\n• 🏠 **المنزل** - ديكور وأثاث\n• 💄 **الجمال** - مستحضرات تجميل وعناية\n\nأي فئة تهمك أكثر؟",
        suggestions: ['👗 عرض الملابس', '📱 الإلكترونيات', '🏠 منتجات المنزل', '💄 الجمال والعناية']
      },
      'عروض': {
        text: "🎁 **العروض الحالية:**\n\n• خصم 30% على جميع الملابس\n• عرض 2×1 على منتجات العناية\n• شحن مجاني للطلبات فوق 200 ريال\n• خصم 20% على الإلكترونيات\n\nأي منتج تريد معرفة المزيد عنه؟",
        suggestions: ['👗 عروض الملابس', '📱 عروض الإلكترونيات', '🚚 شحن مجاني', '💳 طرق الدفع']
      },
      'سعر': {
        text: "💵 يمكنني مساعدتك في العثور على المنتجات المناسبة لميزانيتك.\n\nما هو نطاق السعر الذي تبحث عنه؟\n• 💰 اقتصادي (50-200 ريال)\n• 💰💎 متوسط (200-500 ريال) \n• 💎💎💎 مميز (500+ ريال)",
        suggestions: ['💰 اقتصادي', '💰💎 متوسط', '💎💎💎 مميز', '🔍 بحث في الفئة']
      },
      'مساعدة': {
        text: "🤝 **كيف يمكنني مساعدتك؟**\n\nيمكنني:\n• 🔍 البحث عن منتجات محددة\n• 💡 تقديم توصيات مخصصة\n• 🎁 إعلامك بأفضل العروض\n• ❓ الإجابة على أسئلتك\n• 🛒 مساعدتك في عملية الشراء\n\nما الذي تحتاج إليه؟",
        suggestions: ['🔍 بحث عن منتج', '💡 توصيات', '🎁 عروض', '🛒 مساعدة في الشراء']
      },
      'default': {
        text: "🤔 لم أفهم سؤالك تماماً. يمكنني مساعدتك في:\n\n• البحث عن منتجات محددة\n• العروض والتخفيضات\n• التوصيات المخصصة\n• استفسارات الشراء\n\nما الذي تريد معرفته؟",
        suggestions: ['🛍️ عرض المنتجات', '🎁 العروض', '💡 المساعدة', '🔍 البحث']
      }
    };

    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('منتج') || lowerMsg.includes('سلع')) return responses['منتجات'];
    if (lowerMsg.includes('عرض') || lowerMsg.includes('خصم')) return responses['عروض'];
    if (lowerMsg.includes('سعر') || lowerMsg.includes('ثمن')) return responses['سعر'];
    if (lowerMsg.includes('مساعدة') || lowerMsg.includes('مساعدة')) return responses['مساعدة'];
    
    return responses['default'];
  };

  const handleSendMessage = (customMessage = null, isVoice = false) => {
    const messageToSend = customMessage || inputMessage;
    
    if (!messageToSend.trim()) return;

    // إضافة رسالة المستخدم
    const userMessage = { 
      id: Date.now(), 
      text: messageToSend, 
      sender: 'user',
      isVoice 
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    if (!isVoice) {
      setInputMessage('');
    }

    // محاكاة رد الذكاء الاصطناعي
    setTimeout(() => {
      const aiResponse = getAIResponse(messageToSend);
      
      const aiMessage = { 
        id: Date.now() + 1, 
        text: aiResponse.text, 
        sender: 'ai',
        suggestions: aiResponse.suggestions
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setQuickSuggestions(aiResponse.suggestions || []);
    }, 1000);
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action.prompt || action.text);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  return (
    <div ref={chatRef} className="ai-shopping-assistant">
      {/* ✅ نافذة المحادثة */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="chat-window"
            style={{
              position: 'fixed',
              bottom: '80px',
              right: '20px',
              width: '380px',
              height: '550px',
              zIndex: 1000,
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* الهيدر */}
            <div className="chat-header" style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              padding: '1rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div className="d-flex align-items-center gap-2">
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                >
                  <FaRobot size={20} />
                </motion.div>
                <div>
                  <div className="fw-bold">مساعد تريندورا</div>
                  <small className="opacity-80">متصل ●</small>
                </div>
              </div>
              <Button
                variant="link"
                className="text-white p-0"
                onClick={() => setIsOpen(false)}
                style={{ opacity: 0.8 }}
              >
                <FaTimes size={16} />
              </Button>
            </div>

            {/* ✅ الإجراءات السريعة */}
            {quickSuggestions.length > 0 && (
              <div className="quick-actions" style={{
                padding: '0.75rem 1rem',
                background: '#f8f9fa',
                borderBottom: '1px solid #e9ecef'
              }}>
                <div className="d-flex flex-wrap gap-2">
                  {quickSuggestions.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => typeof action === 'string' ? handleSuggestionClick(action) : handleQuickAction(action)}
                      style={{
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        padding: '6px 12px',
                        border: '1px solid #667eea',
                        color: '#667eea',
                        background: 'white'
                      }}
                    >
                      {action.icon || '💡'} {typeof action === 'string' ? action : action.text}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* منطقة الرسائل */}
            <div className="chat-messages" style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
            }}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`message ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}
                  style={{
                    display: 'flex',
                    marginBottom: '1rem',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div className="d-flex align-items-start gap-2" style={{
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                    maxWidth: '85%'
                  }}>
                    <div className={`avatar ${msg.sender === 'user' ? 'user-avatar' : 'ai-avatar'}`}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: msg.sender === 'user' ? '#007bff' : '#28a745',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '0.8rem'
                      }}>
                      {msg.sender === 'user' ? <FaUser /> : <FaRobot />}
                    </div>
                    
                    <div className={`message-content ${msg.sender === 'user' ? 'user-content' : 'ai-content'}`}
                      style={{
                        background: msg.sender === 'user' ? '#007bff' : 'white',
                        color: msg.sender === 'user' ? 'white' : '#333',
                        padding: '0.75rem 1rem',
                        borderRadius: '18px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                        border: msg.sender === 'ai' ? '1px solid #e9ecef' : 'none',
                        whiteSpace: 'pre-line'
                      }}>
                      {msg.isVoice && (
                        <Badge bg="info" className="mb-1" style={{ fontSize: '0.6rem' }}>
                          🎤 صوتي
                        </Badge>
                      )}
                      {msg.text}
                      
                      {/* ✅ عرض المقترحات بعد رد الذكاء الاصطناعي */}
                      {msg.sender === 'ai' && msg.suggestions && (
                        <div className="suggestions mt-2">
                          {msg.suggestions.map((suggestion, idx) => (
                            <motion.button
                              key={idx}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="btn btn-outline-primary btn-sm me-1 mb-1"
                              onClick={() => handleSuggestionClick(suggestion)}
                              style={{
                                borderRadius: '15px',
                                fontSize: '0.7rem',
                                padding: '4px 8px',
                                border: '1px solid rgba(255,255,255,0.3)',
                                color: msg.sender === 'user' ? 'white' : '#667eea',
                                background: 'transparent'
                              }}
                            >
                              {suggestion}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* منطقة الإدخال */}
            <div className="chat-input" style={{
              padding: '1rem',
              borderTop: '1px solid #e9ecef',
              background: 'white'
            }}>
              <InputGroup>
                <Form.Control
                  placeholder="اكتب رسالتك أو استخدم الصوت..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  style={{
                    borderRadius: '20px',
                    border: '1px solid #e9ecef',
                    padding: '12px 16px'
                  }}
                />
                
                {/* ✅ زر الصوت */}
                <Button
                  variant={isListening ? "danger" : "outline-secondary"}
                  onClick={startVoiceSearch}
                  disabled={isListening}
                  style={{
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 4px'
                  }}
                >
                  <FaMicrophone size={14} />
                </Button>
                
                {/* ✅ زر الإرسال */}
                <Button
                  variant="primary"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  style={{
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    border: 'none'
                  }}
                >
                  <FaPaperPlane size={14} />
                </Button>
              </InputGroup>
              
              {/* ✅ مؤشر الاستماع للصوت */}
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center mt-2"
                >
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{
                        width: '12px',
                        height: '12px',
                        background: '#dc3545',
                        borderRadius: '50%'
                      }}
                    />
                    <small className="text-muted">🎤 أستمع إليك... تحدث الآن</small>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ زر التشغيل الرئيسي */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1001,
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
          border: '3px solid white'
        }}
      >
        {isOpen ? <FaTimes size={20} /> : <FaRobot size={20} />}
        
        {/* ✅ مؤشر النبض عندما يكون مغلقاً */}
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              width: '20px',
              height: '20px',
              background: '#00ffcc',
              borderRadius: '50%',
              border: '3px solid white'
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default AIShoppingAssistant;