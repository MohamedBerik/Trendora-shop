import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaPaperPlane,
  FaUser,
  FaComment,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaStore,
  FaCheckCircle
} from "react-icons/fa";

// Fix for default markers in Leaflet
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ContentPage() {
  const [map, setMap] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone: "",
    subject: "استفسار عام"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const locations = [
    {
      id: 1,
      name: "المقر الرئيسي",
      position: [30.0444, 31.2357],
      address: "القاهرة، مصر",
      phone: "+20 123 456 7890",
      hours: "9:00 ص - 10:00 م"
    },
    {
      id: 2,
      name: "فرع الأسكندرية",
      position: [31.2001, 29.9187],
      address: "الأسكندرية، مصر",
      phone: "+20 123 456 7891",
      hours: "9:00 ص - 9:00 م"
    },
    {
      id: 3,
      name: "فرع الجيزة",
      position: [30.0131, 31.2089],
      address: "الجيزة، مصر",
      phone: "+20 123 456 7892",
      hours: "10:00 ص - 10:00 م"
    }
  ];

  const contactInfo = [
    {
      icon: <FaPhone className="text-primary" />,
      title: "الهاتف",
      content: "+20 123 456 7890",
      description: "دعم على مدار الساعة"
    },
    {
      icon: <FaEnvelope className="text-success" />,
      title: "البريد الإلكتروني",
      content: "support@trendora.com",
      description: "الرد خلال 24 ساعة"
    },
    {
      icon: <FaClock className="text-warning" />,
      title: "ساعات العمل",
      content: "9:00 ص - 10:00 م",
      description: "جميع أيام الأسبوع"
    },
    {
      icon: <FaStore className="text-info" />,
      title: "الفروع",
      content: "3 فروع",
      description: "في جميع أنحاء مصر"
    }
  ];

  const socialMedia = [
    { icon: <FaFacebook />, name: "Facebook", url: "#", color: "#1877F2" },
    { icon: <FaTwitter />, name: "Twitter", url: "#", color: "#1DA1F2" },
    { icon: <FaInstagram />, name: "Instagram", url: "#", color: "#E4405F" },
    { icon: <FaWhatsapp />, name: "WhatsApp", url: "#", color: "#25D366" },
    { icon: <FaLinkedin />, name: "LinkedIn", url: "#", color: "#0A66C2" }
  ];

  useEffect(() => {
    // Initialize map
    const initializeMap = () => {
      const mapInstance = L.map('contact-map', {
        zoomControl: true,
        scrollWheelZoom: true
      }).setView([30.0444, 31.2357], 8);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(mapInstance);

      // Custom icon
      const customIcon = L.divIcon({
        html: '<div style="background-color: #667eea; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">🏪</div>',
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // Add markers for each location
      locations.forEach(location => {
        const marker = L.marker(location.position, { icon: customIcon })
          .addTo(mapInstance)
          .bindPopup(`
            <div style="min-width: 200px;">
              <h6 style="margin: 0 0 8px 0; color: #667eea;">${location.name}</h6>
              <p style="margin: 4px 0; font-size: 14px;">📍 ${location.address}</p>
              <p style="margin: 4px 0; font-size: 14px;">📞 ${location.phone}</p>
              <p style="margin: 4px 0; font-size: 14px;">🕒 ${location.hours}</p>
            </div>
          `);

        // Open popup for main location
        if (location.id === 1) {
          marker.openPopup();
        }
      });

      setMap(mapInstance);

      // Fit bounds to show all markers
      const group = new L.featureGroup(locations.map(loc => L.marker(loc.position)));
      mapInstance.fitBounds(group.getBounds().pad(0.1));

      return mapInstance;
    };

    const mapInstance = initializeMap();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({ name: "", email: "", message: "", phone: "", subject: "استفسار عام" });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const flyToLocation = (position) => {
    if (map) {
      map.flyTo(position, 15, {
        duration: 1.5
      });
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
          <FaMapMarkerAlt className="me-2" />
          تواصل معنا
        </span>
        <h1 className="display-5 fw-bold mb-3">نحن هنا لمساعدتك</h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
          فريق الدعم لدينا مستعد للإجابة على استفساراتك وتقديم أفضل خدمة عملاء
        </p>
      </motion.div>

      {/* Contact Information Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-5"
      >
        <Row className="g-4">
          {contactInfo.map((info, index) => (
            <Col key={index} lg={3} md={6}>
              <Card className="border-0 shadow-sm h-100 text-center">
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <div 
                      className="mx-auto rounded-circle d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '60px', 
                        height: '60px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)'
                      }}
                    >
                      <div className="text-white fs-5">
                        {info.icon}
                      </div>
                    </div>
                  </div>
                  <h6 className="fw-bold mb-2">{info.title}</h6>
                  <p className="text-primary fw-semibold mb-2">{info.content}</p>
                  <small className="text-muted">{info.description}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </motion.div>

      <Row className="g-5">
        {/* Contact Form */}
        <Col lg={6}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg h-100">
              <Card.Header className="bg-primary text-white py-4">
                <h4 className="mb-0 fw-bold">
                  <FaPaperPlane className="me-2" />
                  أرسل رسالتك
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
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
                          onChange={handleInputChange}
                          placeholder="أدخل اسمك الكامل"
                          required
                          disabled={isSubmitting}
                        />
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
                          onChange={handleInputChange}
                          placeholder="example@email.com"
                          required
                          disabled={isSubmitting}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">رقم الهاتف</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+20 123 456 7890"
                      disabled={isSubmitting}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">نوع الاستفسار</Form.Label>
                    <Form.Select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="استفسار عام">استفسار عام</option>
                      <option value="دعم فني">دعم فني</option>
                      <option value="مبيعات">مبيعات</option>
                      <option value="شكوى">شكوى</option>
                      <option value="اقتراح">اقتراح</option>
                    </Form.Select>
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
                      onChange={handleInputChange}
                      placeholder="اكتب رسالتك هنا..."
                      required
                      disabled={isSubmitting}
                      style={{ resize: 'vertical' }}
                    />
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
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">جاري الإرسال...</span>
                          </div>
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

                {/* Success Message */}
                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4"
                    >
                      <div className="alert alert-success d-flex align-items-center">
                        <FaCheckCircle className="me-2 fs-5" />
                        <div>
                          <strong>تم إرسال رسالتك بنجاح!</strong>
                          <div className="small">سنرد عليك في أقرب وقت ممكن.</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        {/* Map and Locations */}
        <Col lg={6}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Map Card */}
            <Card className="border-0 shadow-lg mb-4">
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">
                  <FaMapMarkerAlt className="me-2 text-primary" />
                  مواقع فروعنا
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div 
                  id="contact-map"
                  style={{ 
                    height: '400px', 
                    width: '100%',
                    borderRadius: '0 0 12px 12px'
                  }}
                />
              </Card.Body>
            </Card>

            {/* Locations List */}
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light border-0 py-3">
                <h6 className="mb-0 fw-semibold">الفروع المتاحة</h6>
              </Card.Header>
              <Card.Body className="p-3">
                {locations.map((location, index) => (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    className="d-flex align-items-center gap-3 p-3 border-bottom cursor-pointer"
                    style={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8f9fa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                    onClick={() => flyToLocation(location.position)}
                  >
                    <div 
                      className="flex-shrink-0 rounded-circle d-flex align-items-center justify-content-center text-white"
                      style={{ 
                        width: '40px', 
                        height: '40px',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)'
                      }}
                    >
                      <FaStore size={14} />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-semibold mb-1">{location.name}</h6>
                      <p className="text-muted small mb-1">{location.address}</p>
                      <p className="text-muted small mb-0">{location.phone} • {location.hours}</p>
                    </div>
                  </motion.div>
                ))}
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Social Media Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="text-center mt-5"
      >
        <h5 className="fw-bold mb-4">تابعنا على وسائل التواصل</h5>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          {socialMedia.map((social, index) => (
            <motion.a
              key={index}
              href={social.url}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{ 
                width: '50px', 
                height: '50px',
                color: social.color
              }}
              title={social.name}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>
      </motion.div>

      <style>{`
        .cursor-pointer {
          cursor: pointer;
        }
        
        .leaflet-container {
          border-radius: 0 0 12px 12px;
        }
        
        .custom-div-icon {
          background: transparent;
          border: none;
        }
        
        .form-control:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
      `}</style>
    </Container>
  );
}

export default ContentPage;