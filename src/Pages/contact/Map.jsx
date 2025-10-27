import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaMapMarkerAlt, 
  FaDirections, 
  FaExpand, 
  FaCompress,
  FaLocationArrow,
  FaStore,
  FaPhone,
  FaClock,
  FaCar,
  FaSubway,
  FaWalking
} from "react-icons/fa";

function Map() {
  const mapContainer = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeLocation, setActiveLocation] = useState(0);

  const locations = [
    {
      id: 1,
      name: "المقر الرئيسي",
      address: "برج القاهرة، الزمالك، القاهرة",
      phone: "+20 123 456 7890",
      hours: "9:00 ص - 10:00 م",
      coordinates: "30.0444, 31.2357",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.257403998615!2d31.235711915114387!3d30.044419981880033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458410a5b8a2f7f%3A0x8e67a83088db9abf!2sCairo%20Tower!5e0!3m2!1sen!2seg!4v1689433412000!5m2!1sen!2seg"
    },
    {
      id: 2,
      name: "فرع مدينة نصر",
      address: "مجمع العرب، مدينة نصر، القاهرة",
      phone: "+20 123 456 7891",
      hours: "10:00 ص - 11:00 م",
      coordinates: "30.0659, 31.3362",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.698550312345!2d31.336215315114!3d30.065918981885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583f8b4d0b0b0b%3A0x8e67a83088db9abf!2sArab%20Mall!5e0!3m2!1sen!2seg!4v1689433412000!5m2!1sen!2seg"
    },
    {
      id: 3,
      name: "فرع المعادي",
      address: "شارع 9، المعادي، القاهرة",
      phone: "+20 123 456 7892",
      hours: "9:30 ص - 9:30 م",
      coordinates: "29.9594, 31.2589",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3455.123456789012!2d31.258915315114!3d29.959418981890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583f8b4d0b0b0b%3A0x8e67a83088db9abf!2sMaadi%20Street%209!5e0!3m2!1sen!2seg!4v1689433412000!5m2!1sen!2seg"
    }
  ];

  const transportOptions = [
    { icon: <FaCar />, type: "سيارة", time: "15 دقيقة", distance: "5 كم" },
    { icon: <FaSubway />, type: "مترو", time: "20 دقيقة", distance: "6 كم" },
    { icon: <FaWalking />, type: "مشي", time: "45 دقيقة", distance: "3.5 كم" }
  ];

  useEffect(() => {
    const mapEl = mapContainer.current;
    if (mapEl) {
      const timer = setTimeout(() => {
        mapEl.classList.add("map-animate");
        setIsLoaded(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLocationChange = (index) => {
    setActiveLocation(index);
    setIsLoaded(false);
    setTimeout(() => setIsLoaded(true), 500);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getDirections = () => {
    const location = locations[activeLocation];
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates}`;
    window.open(url, '_blank');
  };

  return (
    <Container className={`py-5 ${isExpanded ? 'container-fluid' : ''}`}>
      <Row className="g-4">
        {/* Map Section */}
        <Col lg={isExpanded ? 12 : 8}>
          <motion.div
            layout
            transition={{ duration: 0.5 }}
            className="position-relative"
          >
            {/* Map Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="fw-bold mb-1">
                  <FaMapMarkerAlt className="me-2 text-primary" />
                  مواقع فروعنا
                </h4>
                <p className="text-muted mb-0">
                  اكتشف أقرب فرع إليك وقم بزيارتنا
                </p>
              </div>
              <div className="d-flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={getDirections}
                  className="btn btn-outline-primary d-flex align-items-center gap-2"
                >
                  <FaDirections />
                  <span className="d-none d-md-inline">الاتجاهات</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleExpand}
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                >
                  {isExpanded ? <FaCompress /> : <FaExpand />}
                  <span className="d-none d-md-inline">
                    {isExpanded ? 'تصغير' : 'تكبير'}
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Map Container */}
            <motion.div
              ref={mapContainer}
              layout
              className="shadow-lg rounded-4 overflow-hidden bg-white position-relative"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? "scale(1)" : "scale(0.95)",
                transition: "all 0.8s ease-out",
                height: isExpanded ? "70vh" : "500px"
              }}
            >
              <iframe
                title={`Trendora Location - ${locations[activeLocation].name}`}
                src={locations[activeLocation].embedUrl}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "hue-rotate(260deg) saturate(1.1) brightness(1.05) contrast(1.05)",
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setIsLoaded(true)}
              />
              
              {/* Loading Overlay */}
              <AnimatePresence>
                {!isLoaded && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light"
                    style={{ borderRadius: '14px' }}
                  >
                    <div className="text-center">
                      <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">جاري التحميل...</span>
                      </div>
                      <p className="text-muted mb-0">جاري تحميل الخريطة...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Location Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="position-absolute top-0 end-0 m-3"
              >
                <div 
                  className="bg-white rounded-3 shadow-sm px-3 py-2 d-flex align-items-center gap-2"
                  style={{ backdropFilter: 'blur(10px)' }}
                >
                  <div 
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                    style={{ width: '30px', height: '30px' }}
                  >
                    <FaLocationArrow className="text-white" size={14} />
                  </div>
                  <div>
                    <div className="fw-semibold small">{locations[activeLocation].name}</div>
                    <div className="text-muted small">موقعك الحالي</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Location Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="d-flex gap-2 mt-3 flex-wrap"
            >
              {locations.map((location, index) => (
                <motion.button
                  key={location.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLocationChange(index)}
                  className={`btn d-flex align-items-center gap-2 ${
                    activeLocation === index 
                      ? 'btn-primary' 
                      : 'btn-outline-primary'
                  }`}
                  style={{ borderRadius: '20px' }}
                >
                  <FaStore size={14} />
                  {location.name}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </Col>

        {/* Location Details - Only show when not expanded */}
        <AnimatePresence>
          {!isExpanded && (
            <Col lg={4}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 shadow-lg h-100">
                  <Card.Header className="bg-white border-0 py-4">
                    <h5 className="mb-0 fw-bold">
                      <FaStore className="me-2 text-primary" />
                      {locations[activeLocation].name}
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    {/* Location Info */}
                    <div className="mb-4">
                      <h6 className="fw-semibold mb-3">معلومات الفرع</h6>
                      <div className="space-y-3">
                        <div className="d-flex align-items-center gap-3">
                          <FaMapMarkerAlt className="text-muted flex-shrink-0" />
                          <div>
                            <div className="fw-semibold small">العنوان</div>
                            <div className="text-muted small">{locations[activeLocation].address}</div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <FaPhone className="text-muted flex-shrink-0" />
                          <div>
                            <div className="fw-semibold small">الهاتف</div>
                            <div className="text-muted small">{locations[activeLocation].phone}</div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <FaClock className="text-muted flex-shrink-0" />
                          <div>
                            <div className="fw-semibold small">ساعات العمل</div>
                            <div className="text-muted small">{locations[activeLocation].hours}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transport Options */}
                    <div className="mb-4">
                      <h6 className="fw-semibold mb-3">وسائل الوصول</h6>
                      <div className="row g-2">
                        {transportOptions.map((option, index) => (
                          <div key={index} className="col-12">
                            <div className="d-flex align-items-center justify-content-between p-2 bg-light rounded-3">
                              <div className="d-flex align-items-center gap-2">
                                <div className="text-primary">{option.icon}</div>
                                <span className="small fw-semibold">{option.type}</span>
                              </div>
                              <div className="text-muted small">
                                {option.time} • {option.distance}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-grid gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={getDirections}
                        className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                      >
                        <FaDirections />
                        الحصول على الاتجاهات
                      </motion.button>
                      <Button 
                        variant="outline-primary" 
                        className="d-flex align-items-center justify-content-center gap-2"
                        onClick={() => window.open(`tel:${locations[activeLocation].phone}`, '_self')}
                      >
                        <FaPhone />
                        اتصل بالفرع
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          )}
        </AnimatePresence>
      </Row>

      <style>{`
        .map-animate {
          opacity: 1 !important;
          transform: scale(1) !important;
        }
        
        .space-y-3 > * + * {
          margin-top: 1rem;
        }
        
        .btn-outline-primary {
          border-color: #667eea;
          color: #667eea;
        }
        
        .btn-outline-primary:hover {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-color: #667eea;
          color: white;
        }
        
        @media (max-width: 768px) {
          .container-fluid {
            padding-left: 15px;
            padding-right: 15px;
          }
        }
      `}</style>
    </Container>
  );
}

export default Map;