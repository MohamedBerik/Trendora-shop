import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import { FaRobot, FaUser, FaPaperPlane } from 'react-icons/fa';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "مرحباً! أنا مساعدك الذكي. اسألني عن المنتجات أو العروض 🛍️",
      sender: 'ai'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // إضافة رسالة المستخدم
    const userMessage = { id: Date.now(), text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // محاكاة رد الذكاء الاصطناعي
    setTimeout(() => {
      const aiResponse = getAIResponse(inputMessage);
      const aiMessage = { id: Date.now(), text: aiResponse, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const getAIResponse = (message) => {
    const responses = {
      'منتجات': 'لدينا أحدث المنتجات في جميع الفئات! أي نوع تفضل؟',
      'عروض': '🎁 لدينا عروض رائعة هذا الأسبوع! خصومات تصل إلى 50%',
      'سعر': '💵 يمكنني مساعدتك في العثور على منتجات تناسب ميزانيتك',
      'default': '🤔 يمكنني مساعدتك في: البحث عن منتجات، العروض، التوصيات'
    };

    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('منتج')) return responses['منتجات'];
    if (lowerMsg.includes('عرض')) return responses['عروض'];
    if (lowerMsg.includes('سعر')) return responses['سعر'];
    return responses['default'];
  };

  return (
    <div className="chatbot-wrapper">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="chatbot-window"
            style={{
              position: 'fixed',
              bottom: '80px',
              right: '20px',
              width: '350px',
              zIndex: 1000
            }}
          >
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-primary text-white d-flex align-items-center">
                <FaRobot className="me-2" />
                <span className="fw-bold">مساعد تريندورا</span>
              </Card.Header>
              
              <Card.Body style={{ height: '300px', overflowY: 'auto' }}>
                {messages.map(msg => (
                  <div key={msg.id} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className={`d-flex align-items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`rounded-circle p-2 ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light'}`}>
                        {msg.sender === 'user' ? <FaUser size={12} /> : <FaRobot size={12} />}
                      </div>
                      <div className={`mx-2 p-3 rounded ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light'}`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Body>

              <Card.Footer>
                <InputGroup>
                  <Form.Control
                    placeholder="اكتب رسالتك..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button variant="primary" onClick={handleSendMessage}>
                    <FaPaperPlane />
                  </Button>
                </InputGroup>
              </Card.Footer>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* زر التشغيل */}
      <Button
        variant="primary"
        className="rounded-circle p-3"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1001,
          width: '60px',
          height: '60px'
        }}
      >
        <FaRobot size={20} />
      </Button>
    </div>
  );
};

export default ChatBot;