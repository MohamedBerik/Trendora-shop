import React, { useState, useEffect } from "react";
import axios from "axios";
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
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaInstagram
} from "react-icons/fa";

function StartContact() {
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

  const inquiryTypes = [
    { value: "general", label: "استفسار عام", icon: "❓" },
    { value: "support", label: "دعم العملاء", icon: "💬" },
    { value: "sales", label: "مبيعات", icon: "💰" },
    { value: "partnership", label: "شراكة", icon: "🤝" },
    { value: "complaint", label: "شكوى", icon: "⚠️" },
    { value: "suggestion", label: "اقتراح", icon: "💡" }
  ];

  const contactInfo = [
    {
      icon: <FaPhone className="text-primary" />,
      title: "الهاتف",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      description: "متاح من 8 صباحاً حتى 10 مساءً"
    },
    {
      icon: <FaEnvelope className="text-success" />,
      title: "البريد الإلكتروني",
      details: ["support@trendora.com", "info@trendora.com"],
      description: "الرد خلال 24 ساعة"
    },
    {
      icon: <FaMapMarkerAlt className="text-danger" />,
      title: "المكتب الرئيسي",
      details: ["123 شارع التسوق", "مدينة الموضة، الدولة 12345"],
      description: "مفتوح من الإثنين إلى الجمعة"
    },
    {
      icon: <FaClock className="text-warning" />,
      title: "ساعات العمل",
      details: ["الإثنين - الجمعة: 8 ص - 10 م", "السبت - الأحد: 9 ص - 8 م"],
      description: "دعم على مدار الساعة"
    }
  ];

  const socialLinks = [
    { icon: <FaWhatsapp />, name: "WhatsApp", url: "#", color: "#25D366" },
    { icon: <FaFacebook />, name: "Facebook", url: "#", color: "#1877F2" },
    { icon: <FaTwitter />, name: "Twitter", url: "#", color: "#1DA1F2" },
    { icon: <FaInstagram />, name: "Instagram", url: "#", color: "#E4405F" }
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Character count for message
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        {
          ...formData,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
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
    <Container className="py-5">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-5"
      >
        <span className="badge bg-primary mb-3 px-3 py-2 fw-semibold">
          <FaPaperPlane className="me-2" />
          تواصل معنا
        </span>
        <h1 className="display-5 fw-bold mb-3">نحن هنا لمساعدتك</h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
          فريق الدعم لدينا مستعد للإجابة على جميع استفساراتك وتقديم أفضل خدمة ممكنة
        </p>
      </motion.div>

      <Row className="g-5">
        {/* Contact Information */}
        <Col lg={4}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-0 py-4">
                <h4 className="fw-bold mb-0">معلومات التواصل</h4>
              </Card.Header>
              <Card.Body className="p-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    className="d-flex align-items-start gap-3 mb-4 pb-3 border-bottom"
                  >
                    <div className="flex-shrink-0 fs-5 mt-1">
                      {info.icon}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-semibold mb-2">{info.title}</h6>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="mb-1 text-muted small">{detail}</p>
                      ))}
                      <p className="text-muted small mb-0">{info.description}</p>
                    </div>
                  </motion.div>
                ))}

                {/* Social Links */}
                <div className="mt-4 pt-3 border-top">
                  <h6 className="fw-semibold mb-3">تابعنا على</h6>
                  <div className="d-flex gap-2">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.url}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '45px', 
                          height: '45px',
                          color: social.color
                        }}
                        title={social.name}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        {/* Contact Form */}
        <Col lg={8}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg">
              <Card.Header className="bg-primary text-white py-4">
                <h4 className="mb-0 fw-bold">
                  <FaPaperPlane className="me-2" />
                  أرسل رسالتك
                </h4>
              </Card.Header>
              <Card.Body className="p-4 p-md-5">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    {/* Name Field */}
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

                    {/* Email Field */}
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
                    {/* Phone Field */}
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
                          placeholder="+1 (555) 123-4567"
                          isInvalid={!!errors.phone}
                          disabled={isSubmitting}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Inquiry Type */}
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

                  {/* Subject Field */}
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

                  {/* Message Field */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      <FaComment className="me-2 text-muted" />
                      الرسالة *
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
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

                  {/* Submit Button */}
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

      <style>{`
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
        
        .btn-light:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
      `}</style>
    </Container>
  );
}

export default StartContact;