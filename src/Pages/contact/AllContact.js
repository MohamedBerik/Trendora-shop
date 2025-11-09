import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPaperPlane, 
  FaUser, 
  FaEnvelope, 
  FaTag, 
  FaComment,
  FaPhone,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaHeadset,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner
} from "react-icons/fa";
import Map from "./Map";
import axios from "axios";

function AllContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
    inquiryType: "general"
  });
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const contactMethods = [
    {
      icon: <FaHeadset className="text-primary" />,
      title: "الدعم الفني",
      description: "مساعدة فنية على مدار الساعة",
      contact: "support@trendora.com",
      response: "الرد خلال 24 ساعة"
    },
    {
      icon: <FaEnvelope className="text-success" />,
      title: "البريد الإلكتروني",
      description: "للاستفسارات العامة",
      contact: "info@trendora.com",
      response: "الرد خلال 48 ساعة"
    },
    {
      icon: <FaPhone className="text-warning" />,
      title: "الاتصال المباشر",
      description: "محادثة فورية",
      contact: "+20 100 120 42 67",
      response: "متاح 9 ص - 10 م"
    },
    {
      icon: <FaWhatsapp className="text-success" />,
      title: "واتساب",
      description: "مراسلة فورية",
      contact: "+20 100 120 42 67",
      response: "رد فوري"
    }
  ];

  const socialMedia = [
    { icon: <FaFacebook />, name: "Facebook", url: "#", color: "#1877F2" },
    { icon: <FaTwitter />, name: "Twitter", url: "#", color: "#1DA1F2" },
    { icon: <FaInstagram />, name: "Instagram", url: "#", color: "#E4405F" },
    { icon: <FaLinkedin />, name: "LinkedIn", url: "#", color: "#0A66C2" },
    { icon: <FaWhatsapp />, name: "WhatsApp", url: "#", color: "#25D366" }
  ];

  const inquiryTypes = [
    { value: "general", label: "استفسار عام", icon: "❓" },
    { value: "support", label: "دعم العملاء", icon: "💬" },
    { value: "sales", label: "مبيعات", icon: "💰" },
    { value: "partnership", label: "شراكة", icon: "🤝" },
    { value: "complaint", label: "شكوى", icon: "⚠️" },
    { value: "suggestion", label: "اقتراح", icon: "💡" }
  ];

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => setStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === "message") {
      setCharCount(value.length);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "الاسم يجب أن يكون أكثر من حرفين";
    }

    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }

    if (!formData.message.trim()) {
      newErrors.message = "الرسالة مطلوبة";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "الرسالة يجب أن تكون أكثر من 10 أحرف";
    }

    if (formData.phone && !/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "رقم الهاتف غير صالح";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setStatus("loading");

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        {
          ...formData,
          timestamp: new Date().toISOString(),
        }
      );

      console.log("تم الإرسال:", response.data);
      setStatus("success");
      setFormData({ 
        name: "", 
        email: "", 
        subject: "", 
        message: "", 
        phone: "",
        inquiryType: "general" 
      });
      setCharCount(0);
      
    } catch (error) {
      console.error("حدث خطأ:", error);
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pb-5">
      {/* Hero Section */}
      <section 
        className="py-5 text-white position-relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {/* Background Elements */}
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="position-absolute"
            style={{ top: '10%', left: '5%', fontSize: '60px' }}
          >
            💬
          </motion.div>
          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="position-absolute"
            style={{ top: '60%', right: '10%', fontSize: '80px' }}
          >
            📞
          </motion.div>
        </div>

        <Container className="position-relative" style={{ zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="badge mb-3 px-3 py-2 fw-semibold"
              style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)"
              }}
            >
              <FaHeadset className="me-2" />
              الدعم والاتصال
            </motion.span>

            <h1 className="display-4 fw-bold mb-3">
              نحن هنا لـ{" "}
              <span 
                style={{
                  background: "linear-gradient(45deg, #ffd700, #ffed4e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                مساعدتك
              </span>
            </h1>
            
            <p className="lead mb-0 mx-auto text-white-80" style={{ maxWidth: '600px', lineHeight: '1.6' }}>
              فريق الدعم لدينا مستعد للإجابة على جميع استفساراتك وتقديم أفضل خدمة ممكنة. 
              لا تتردد في التواصل معنا بأي طريقة تفضل.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Contact Methods */}
      <section className="py-5 bg-light">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h2 className="fw-bold mb-3">طرق التواصل معنا</h2>
            <p className="text-muted">اختر الطريقة التي تناسبك للتواصل مع فريقنا</p>
          </motion.div>

          <Row className="g-4">
            {contactMethods.map((method, index) => (
              <Col key={index} lg={3} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="card border-0 shadow-sm h-100 text-center"
                >
                  <Card.Body className="p-4">
                    <div 
                      className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                      style={{ 
                        width: '70px', 
                        height: '70px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)'
                      }}
                    >
                      <div className="text-white fs-4">
                        {method.icon}
                      </div>
                    </div>
                    <h5 className="fw-bold mb-2">{method.title}</h5>
                    <p className="text-muted small mb-3">{method.description}</p>
                    <p className="fw-semibold text-primary mb-2">{method.contact}</p>
                    <small className="text-muted">{method.response}</small>
                  </Card.Body>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Map & Contact Form Section */}
      <section className="py-5">
        <Container>
          <Row className="g-5 align-items-stretch">
            {/* Map Section */}
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="h-100"
              >
                <Card className="border-0 shadow-lg h-100">
                  <Card.Header className="bg-white border-0 py-4">
                    <h4 className="mb-0 fw-bold">
                      <FaMapMarkerAlt className="me-2 text-primary" />
                      مواقع فروعنا
                    </h4>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Map />
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            {/* Contact Form */}
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="h-100"
              >
                <Card className="border-0 shadow-lg h-100">
                  <Card.Header className="bg-primary text-white py-4">
                    <h4 className="mb-0 fw-bold">
                      <FaPaperPlane className="me-2" />
                      أرسل رسالتك
                    </h4>
                  </Card.Header>
                  <Card.Body className="p-4 p-lg-5">
                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                              <FaUser className="me-2 text-muted" />
                              الاسم الكامل *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="أدخل اسمك الكامل"
                              isInvalid={!!errors.name}
                              disabled={isSubmitting}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                              <FaEnvelope className="me-2 text-muted" />
                              البريد الإلكتروني *
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="example@email.com"
                              isInvalid={!!errors.email}
                              disabled={isSubmitting}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                              <FaPhone className="me-2 text-muted" />
                              رقم الهاتف
                            </Form.Label>
                            <Form.Control
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+20 123 456 7890"
                              isInvalid={!!errors.phone}
                              disabled={isSubmitting}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.phone}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                              <FaTag className="me-2 text-muted" />
                              نوع الاستفسار
                            </Form.Label>
                            <Form.Select
                              name="inquiryType"
                              value={formData.inquiryType}
                              onChange={handleChange}
                              disabled={isSubmitting}
                            >
                              {inquiryTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.icon} {type.label}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">موضوع الرسالة</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="موضوع الرسالة (اختياري)"
                          disabled={isSubmitting}
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">
                          <FaComment className="me-2 text-muted" />
                          الرسالة *
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="اكتب رسالتك هنا... (10 أحرف على الأقل)"
                          isInvalid={!!errors.message}
                          disabled={isSubmitting}
                          style={{ resize: 'vertical' }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.message}
                        </Form.Control.Feedback>
                        <div className="d-flex justify-content-between mt-2">
                          <small className={`text-muted ${charCount > 500 ? 'text-warning' : ''}`}>
                            {charCount} / 500 حرف
                          </small>
                          <small className="text-muted">* حقل إلزامي</small>
                        </div>
                      </Form.Group>

                      <motion.div
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      >
                        <Button
                          type="submit"
                          className="w-100 py-3 fw-semibold"
                          disabled={isSubmitting}
                          style={{
                            background: "linear-gradient(135deg, #667eea, #764ba2)",
                            border: "none",
                            borderRadius: "12px"
                          }}
                        >
                          {isSubmitting ? (
                            <>
                              <FaSpinner className="me-2 spin" />
                              جاري الإرسال...
                            </>
                          ) : (
                            <>
                              <FaPaperPlane className="me-2" />
                              إرسال الرسالة
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </Form>

                    {/* Status Messages */}
                    <AnimatePresence>
                      {status === "success" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-4"
                        >
                          <Alert variant="success" className="d-flex align-items-center">
                            <FaCheckCircle className="me-2 fs-5" />
                            <div>
                              <strong>تم إرسال رسالتك بنجاح!</strong>
                              <div className="small">سنرد عليك في أقرب وقت ممكن.</div>
                            </div>
                          </Alert>
                        </motion.div>
                      )}

                      {status === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-4"
                        >
                          <Alert variant="danger" className="d-flex align-items-center">
                            <FaExclamationTriangle className="me-2 fs-5" />
                            <div>
                              <strong>حدث خطأ أثناء الإرسال</strong>
                              <div className="small">يرجى المحاولة مرة أخرى لاحقًا.</div>
                            </div>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Social Media Section */}
      <section className="py-5 bg-light">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="fw-bold mb-4">تابعنا على وسائل التواصل</h3>
            <p className="text-muted mb-4">كن أول من يعرف عن عروضنا الجديدة وأحدث المنتجات</p>
            
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              {socialMedia.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style={{ 
                    width: '55px', 
                    height: '55px',
                    color: social.color
                  }}
                  title={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      <style>{`
        .text-white-80 {
          color: rgba(255, 255, 255, 0.8);
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        
        .card {
          transition: all 0.3s ease;
        }
        
        .card:hover {
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </main>
  );
}

export default AllContact;