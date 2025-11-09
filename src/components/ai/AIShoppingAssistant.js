import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Form, InputGroup, Badge, Row, Col, Spinner } from 'react-bootstrap';
import { FaRobot, FaUser, FaPaperPlane, FaTimes, FaMicrophone, FaStar, FaShoppingCart,FaRegHeart, FaImage} from 'react-icons/fa';

const AIShoppingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "🛍️ **مرحباً! أنا مساعدك الذكي للتسوق في تريندورا**\n\nيمكنني مساعدتك في:\n• 🔍 البحث عن المنتجات\n• 💡 تقديم توصيات مخصصة\n• 🎁 العروض والتخفيضات\n• 📸 البحث بالصورة\n• 🤖 مساعدة ذكية في الشراء\n\nكيف يمكنني خدمتك اليوم؟",
      sender: 'ai'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [quickSuggestions, setQuickSuggestions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [imageSearchFile, setImageSearchFile] = useState(null);
  const chatRef = useRef(null);

  // ✅ الإجراءات السريعة
  const quickActions = [
    {
      text: "أحدث المنتجات",
      icon: "🆕",
      prompt: "ما هي أحدث المنتجات لديكم؟",
      tab: 'chat'
    },
    {
      text: "توصيات مخصصة",
      icon: "🤖",
      prompt: "أعطني توصيات مخصصة",
      tab: 'recommendations'
    },
    {
      text: "البحث بالصورة",
      icon: "📸",
      prompt: "أريد البحث عن منتج بالصورة",
      tab: 'imageSearch'
    },
    {
      text: "أفضل العروض",
      icon: "🎁",
      prompt: "عرض لي أفضل العروض والتخفيضات",
      tab: 'chat'
    }
  ];

  // ✅ بيانات المنتجات الموصى بها
  const mockRecommendations = [
    {
      id: 1,
      name: 'هاتف ذكي متطور - الجيل الجديد',
      price: 1999,
      originalPrice: 2499,
      image: '/images/products/smartphone.jpg',
      category: 'إلكترونيات',
      rating: 4.8,
      reason: 'بناءً على مشاهداتك الأخيرة',
      features: ['شاشة 6.7 بوصة', 'كاميرا 108 ميجابكسل', 'بطارية 5000 مللي أمبير'],
      discount: 20
    },
    {
      id: 2,
      name: 'حذاء رياضي مريح - تصميم حديث',
      price: 299,
      originalPrice: 399,
      image: '/images/products/shoes.jpg',
      category: 'أحذية',
      rating: 4.5,
      reason: 'يكمل أسلوبك الحالي',
      features: ['مضاد للانزلاق', 'مريح للمشي الطويل', 'تنفس طبيعي'],
      discount: 25
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
      setQuickSuggestions(quickActions);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // ✅ البحث الصوتي
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      handleSendMessage("المتصفح لا يدعم البحث الصوتي. يرجى استخدام متصفح Chrome أو Edge.");
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
        text: "🛍️ **مجموعة منتجاتنا الرائعة:**\n\n• 👗 **الملابس** - أحدث صيحات الموضة\n• 📱 **الإلكترونيات** - هواتف، لابتوبات، أجهزة ذكية\n• 🏠 **المنزل** - ديكور، أثاث، أدوات مطبخ\n• 💄 **الجمال** - مستحضرات تجميل وعناية\n• 👟 **الأحذية** - رياضية، رسمية، مريحة\n\nأي فئة تهمك أكثر؟",
        suggestions: ['👗 عرض الملابس', '📱 الإلكترونيات', '🏠 منتجات المنزل', '💄 الجمال والعناية', '👟 الأحذية'],
        tab: 'chat'
      },
      'default': {
        text: "🤔 **لم أفهم سؤالك تماماً**\n\nيمكنني مساعدتك في:\n• البحث عن منتجات محددة\n• العروض والتخفيضات الحالية\n• التوصيات المخصصة\n• استفسارات الشراء والدفع\n• البحث عن منتجات بالصورة\n\nما الذي تريد معرفته؟",
        suggestions: ['🛍️ عرض المنتجات', '🎁 العروض', '💡 المساعدة', '🔍 البحث', '🤖 توصيات'],
        tab: 'chat'
      }
    };

    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes('منتج') || lowerMsg.includes('سلع')) return responses['منتجات'];
    return responses['default'];
  };

  const handleSendMessage = (customMessage = null, isVoice = false) => {
    const messageToSend = customMessage || inputMessage;
   
    if (!messageToSend.trim()) return;

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
      
      if (aiResponse.tab && aiResponse.tab !== activeTab) {
        setActiveTab(aiResponse.tab);
        if (aiResponse.tab === 'recommendations') {
          loadRecommendations();
        }
      }
    }, 1000);
  };

  const handleQuickAction = (action) => {
    if (action.tab) {
      setActiveTab(action.tab);
      if (action.tab === 'recommendations') {
        loadRecommendations();
      }
    }
    handleSendMessage(action.prompt || action.text);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const loadRecommendations = () => {
    setRecommendationsLoading(true);
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setRecommendationsLoading(false);
    }, 2000);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageSearchFile(file);
      setTimeout(() => {
        handleSendMessage("📸 جاري تحليل الصورة والعثور على منتجات مشابهة...");
        setRecommendations(mockRecommendations.slice(0, 2));
        setActiveTab('recommendations');
      }, 1500);
    }
  };

  // ✅ مكون التوصيات الذكية
  const RecommendationsTab = () => {
    if (recommendationsLoading) {
      return (
        <div className="recommendations-loading text-center py-5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <FaRobot size={40} className="text-primary mb-3" />
          </motion.div>
          <h5>جاري تحليل تفضيلاتك...</h5>
          <p className="text-muted">🤖 الذكاء الاصطناعي يختار أفضل المنتجات لك</p>
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

    return (
      <div className="recommendations-tab">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center">
            <FaRobot className="text-primary me-2" size={24} />
            <h5 className="mb-0 fw-bold">توصيات مخصصة لك</h5>
          </div>
          <Badge bg="primary" className="ai-badge">ذكي</Badge>
        </div>

        <Row>
          {recommendations.map((product, index) => (
            <Col md={6} key={product.id} className="mb-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-100 recommendation-card">
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={product.image}
                      style={{ height: '120px', objectFit: 'cover' }}
                    />
                    <Badge bg="success" className="position-absolute top-0 start-0 m-2">
                      ⭐ موصى به
                    </Badge>
                    {product.discount && (
                      <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                        خصم {product.discount}%
                      </Badge>
                    )}
                  </div>
                 
                  <Card.Body className="p-3">
                    <div className="mb-2">
                      <Badge bg="outline-primary" text="primary" className="small">
                        {product.category}
                      </Badge>
                    </div>
                   
                    <Card.Title className="h6 mb-2" style={{ fontSize: '0.9rem' }}>
                      {product.name}
                    </Card.Title>
                   
                    <div className="d-flex align-items-center mb-2">
                      <FaStar className="text-warning me-1" size={12} />
                      <span className="small">{product.rating}</span>
                    </div>
                   
                    <div className="price-section mb-2">
                      <span className="h6 text-primary fw-bold" style={{ fontSize: '1rem' }}>
                        {product.price} ر.س
                      </span>
                      {product.originalPrice && (
                        <span className="text-muted text-decoration-line-through small ms-2">
                          {product.originalPrice} ر.س
                        </span>
                      )}
                    </div>
                   
                    <div className="reason-badge mb-3">
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {product.reason}
                      </small>
                    </div>
                   
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="flex-fill"
                      >
                        <FaRegHeart size={12} />
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="flex-fill"
                      >
                        <FaShoppingCart size={12} className="me-1" />
                        شراء
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  // ✅ مكون البحث بالصورة
  const ImageSearchTab = () => {
    return (
      <div className="image-search-tab text-center py-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <FaImage size={48} className="text-primary mb-3" />
        </motion.div>
        
        <h5 className="fw-bold mb-3">البحث عن منتجات بالصورة</h5>
        <p className="text-muted mb-4">
          ارفع صورة لأي منتج تريده وسأجد لك منتجات مشابهة
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="image-upload-area border rounded-3 p-5 mb-3"
          style={{ borderStyle: 'dashed', cursor: 'pointer' }}
          onClick={() => document.getElementById('imageUpload').click()}
        >
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <FaImage size={32} className="text-muted mb-2" />
          <div className="fw-bold">انقر لرفع صورة</div>
          <small className="text-muted">أو اسحب وأفلت الصورة هنا</small>
        </motion.div>

        {imageSearchFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="uploaded-image-info"
          >
            <Badge bg="success" className="mb-2">
              ✓ تم رفع الصورة
            </Badge>
            <div className="small text-muted">
              {imageSearchFile.name}
            </div>
          </motion.div>
        )}
      </div>
    );
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
              bottom: '90px', // أعلى من الأيقونة بمسافة كافية
              right: '20px',
              width: '380px',
              height: '550px',
              maxHeight: '70vh',
              zIndex: 1050, // أعلى من زر العودة للأعلى
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              fontFamily: 'Segoe UI, system-ui'
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
                  <div className="fw-bold">مساعد تريندورا الذكي</div>
                  <small className="opacity-80">
                    <span className="status-dot"></span>
                    متصل
                  </small>
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

            {/* ✅ التبويبات */}
            <div className="chat-tabs" style={{
              background: '#f8f9fa',
              borderBottom: '1px solid #e9ecef',
              padding: '0.5rem 1rem'
            }}>
              <div className="d-flex gap-2">
                {[
                  { id: 'chat', label: '💬 محادثة', icon: FaRobot },
                  { id: 'recommendations', label: '🤖 توصيات', icon: FaStar },
                  { id: 'imageSearch', label: '📸 بحث بالصورة', icon: FaImage }
                ].map(tab => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id === 'recommendations') {
                        loadRecommendations();
                      }
                    }}
                    className="d-flex align-items-center gap-1"
                    style={{
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      padding: '6px 12px'
                    }}
                  >
                    <tab.icon size={12} />
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* ✅ الإجراءات السريعة */}
            {activeTab === 'chat' && quickSuggestions.length > 0 && (
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

            {/* منطقة المحتوى */}
            <div className="chat-content" style={{
              flex: 1,
              overflowY: 'auto',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
            }}>
              {activeTab === 'chat' && (
                <div className="chat-messages" style={{ padding: '1rem' }}>
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
              )}

              {activeTab === 'recommendations' && <RecommendationsTab />}
              {activeTab === 'imageSearch' && <ImageSearchTab />}
            </div>

            {/* ✅ منطقة الإدخال */}
            {activeTab === 'chat' && (
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
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ زر التشغيل الرئيسي - الموقع المعدل */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '30px', // 🔥 تغيير الموقع: أعلى من الزاوية
          left: '30px',   // 🔥 تغيير الموقع: أبعد قليلاً عن الحافة
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1060, // 🔥 أعلى من نافذة المحادثة
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
          border: '3px solid white'
        }}
      >
        {isOpen ? <FaTimes size={20} /> : <FaRobot size={20} />}
       
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

      {/* ✅ إضافة الـ CSS */}
      <style jsx>{`
        .ai-shopping-assistant {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .chat-messages {
          padding: 1rem;
          background: #f8f9fa;
        }

        .message {
          display: flex;
          margin-bottom: 1rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .user-message {
          justify-content: flex-end;
        }

        .ai-message {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 70%;
          background: white;
          padding: 12px 16px;
          border-radius: 18px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .user-message .message-content {
          background: #007bff;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .ai-message .message-content {
          background: white;
          border-bottom-left-radius: 4px;
          border: 1px solid #e9ecef;
        }

        .quick-action-btn {
          border-radius: 20px;
          font-size: 0.8rem;
          padding: 6px 12px;
          transition: all 0.3s ease;
        }

        .quick-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .recommendation-card {
          transition: all 0.3s ease;
          border-radius: 12px;
          overflow: hidden;
        }

        .recommendation-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .image-upload-area {
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .image-upload-area:hover {
          background: #e9ecef;
          border-color: #667eea !important;
        }

        .status-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #00ff88;
          border-radius: 50%;
          margin-left: 8px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .chat-window {
            width: calc(100vw - 40px) !important;
            right: 20px !important;
            left: 20px !important;
            bottom: 80px !important;
          }
         
          .message-content {
            max-width: 85%;
          }

          .chat-toggle-btn {
            bottom: 90px !important;
            right: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AIShoppingAssistant;