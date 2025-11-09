import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrders } from '../../context/OrdersContext';
import { 
  FaTruck, 
  FaMapMarkerAlt, 
  FaClock, 
  FaBox, 
  FaShippingFast,
  FaHome,
  FaArrowLeft,
  FaShare,
  FaDownload,
  FaPhone,
  FaUser,
  FaCheckCircle,
  FaBoxOpen
} from 'react-icons/fa';

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders } = useOrders();
  const [order, setOrder] = useState(null);
  const [trackingInfo, setTrackingInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  // دالة مساعدة لإنشاء خطوات التتبع بناءً على حالة الطلب
  const generateTrackingSteps = (currentStatus) => {
    const allSteps = [
      { 
        status: 'confirmed', 
        label: 'تم تأكيد الطلب', 
        description: 'تم تأكيد طلبك بنجاح',
        time: '10:30 ص',
        completed: true 
      },
      { 
        status: 'preparing', 
        label: 'قيد التجهيز', 
        description: 'يتم تجهيز طلبك للتغليف',
        time: '11:45 ص', 
        completed: currentStatus !== 'confirmed' 
      },
      { 
        status: 'shipped', 
        label: 'تم الشحن', 
        description: 'طلبك في طريق إليك',
        time: '02:15 م',
        completed: ['shipped', 'out_for_delivery', 'delivered'].includes(currentStatus) 
      },
      { 
        status: 'out_for_delivery', 
        label: 'قيد التوصيل', 
        description: 'سائق التوصيل في طريق إليك',
        time: 'الآن',
        completed: currentStatus === 'delivered' 
      },
      { 
        status: 'delivered', 
        label: 'تم التوصيل', 
        description: 'تم توصيل طلبك بنجاح',
        time: '--:--',
        completed: currentStatus === 'delivered' 
      }
    ];

    return allSteps.map(step => ({
      ...step,
      active: step.status === currentStatus,
      time: step.time
    }));
  };

  // دالة للحصول على نص الحالة
  const getStatusText = (status) => {
    const statusMap = {
      'processing': 'قيد المعالجة',
      'shipped': 'تم الشحن', 
      'delivered': 'تم التوصيل',
      'cancelled': 'ملغي',
      'confirmed': 'تم التأكيد',
      'preparing': 'قيد التجهيز',
      'out_for_delivery': 'قيد التوصيل'
    };
    return statusMap[status] || 'غير معروف';
  };

  useEffect(() => {
    const fetchOrderTracking = async () => {
      try {
        if (orders && orderId) {
          const foundOrder = orders.find(order => order.id === orderId);
          if (foundOrder) {
            setOrder(foundOrder);
            
            // إنشاء trackingSteps بناءً على حالة الطلب
            const steps = generateTrackingSteps(foundOrder.status);
            setTrackingInfo(steps);
          } else {
            // إذا لم يتم العثور على الطلب، استخدام بيانات افتراضية
            const defaultOrder = {
              id: orderId,
              date: new Date().toISOString(),
              status: 'shipped',
              total: 199.99,
              shipping: {
                method: 'شحن سريع',
                cost: 15,
                address: {
                  name: 'أحمد محمد',
                  street: 'شارع الملك فهد',
                  city: 'الرياض',
                  state: 'الرياض',
                  zipCode: '12345',
                  country: 'المملكة العربية السعودية'
                }
              },
              payment: {
                method: 'بطاقة ائتمان'
              },
              items: [
                {
                  id: 1,
                  name: 'سماعات لاسلكية متميزة',
                  quantity: 1,
                  price: 199.99
                }
              ],
              driver: {
                name: 'محمد أحمد',
                phone: '+966500000000',
                vehicle: 'مركبة ١٢٣'
              },
              trackingNumber: `TRK-${orderId}`
            };
            
            setOrder(defaultOrder);
            const steps = generateTrackingSteps(defaultOrder.status);
            setTrackingInfo(steps);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tracking info:', error);
        setLoading(false);
      }
    };

    fetchOrderTracking();
  }, [orders, orderId]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="spinner-border text-primary mb-3"
          style={{ width: '3rem', height: '3rem' }}
          role="status"
        >
          <span className="visually-hidden">جاري التحميل...</span>
        </motion.div>
        <p className="text-muted">جاري تحميل معلومات التتبع...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning">
          <h5>لم يتم العثور على الطلب</h5>
          <p>تعذر العثور على معلومات التتبع للطلب المطلوب.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/orders')}
          >
            العودة إلى الطلبات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 order-tracking-page">
      {/* رأس الصفحة */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" />
          رجوع
        </button>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary">
            <FaShare className="me-2" />
            مشاركة
          </button>
          <button className="btn btn-outline-primary">
            <FaDownload className="me-2" />
            حفظ
          </button>
        </div>
      </div>

      {/* معلومات الطلب */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card shadow-sm border-0 mb-4"
      >
        <div className="card-header bg-white">
          <h5 className="mb-0">
            <FaBox className="me-2 text-primary" />
            معلومات الطلب
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>رقم الطلب:</strong> {order.id}</p>
              <p><strong>رقم التتبع:</strong> {order.trackingNumber || `TRK-${order.id}`}</p>
              <p><strong>شركة الشحن:</strong> {order.carrier || 'شركة التوصيل السريع'}</p>
            </div>
            <div className="col-md-6">
              <p><strong>تاريخ الطلب:</strong> {new Date(order.date).toLocaleDateString('ar-SA')}</p>
              <p><strong>التوصيل المتوقع:</strong> {order.shipping?.estimatedDelivery || '2-3 أيام عمل'}</p>
              <p><strong>الحالة الحالية:</strong> 
                <span className={`badge ${
                  order.status === 'delivered' ? 'bg-success' :
                  order.status === 'shipped' ? 'bg-primary' :
                  order.status === 'processing' ? 'bg-warning' : 'bg-secondary'
                } me-2`}>
                  {getStatusText(order.status)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* شريط التتبع */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card shadow-sm border-0 mb-4"
      >
        <div className="card-header bg-white">
          <h5 className="mb-0">
            <FaShippingFast className="me-2 text-primary" />
            حالة الشحن
          </h5>
        </div>
        <div className="card-body">
          <div className="tracking-timeline">
            {trackingInfo.map((step, index) => (
              <div key={step.status} className="tracking-step">
                <div className="step-indicator">
                  <div className={`step-icon ${
                    step.completed ? 'completed' : ''} ${
                    step.active ? 'active' : ''} ${
                    step.status === order.status ? 'current' : ''
                  }`}>
                    {step.completed ? (
                      <FaCheckCircle className="text-white" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {index < trackingInfo.length - 1 && (
                    <div className={`step-connector ${step.completed ? 'completed' : ''}`} />
                  )}
                </div>
                <div className="step-content">
                  <h6 className={`fw-bold ${
                    step.active ? 'text-primary' : 
                    step.completed ? 'text-success' : 'text-muted'
                  }`}>
                    {step.label}
                  </h6>
                  <p className="text-muted mb-1 small">{step.description}</p>
                  <small className="text-muted">
                    <FaClock className="me-1" />
                    {step.time}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* معلومات السائق */}
      {order.driver && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card shadow-sm border-0 mb-4"
        >
          <div className="card-header bg-white">
            <h5 className="mb-0">
              <FaTruck className="me-2 text-primary" />
              معلومات السائق
            </h5>
          </div>
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="d-flex align-items-center mb-3">
                  <div className="driver-avatar me-3">
                    <FaUser className="text-muted" size={24} />
                  </div>
                  <div>
                    <h6 className="mb-1 fw-bold">{order.driver.name}</h6>
                    <small className="text-muted">{order.driver.vehicle}</small>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-md-end">
                <a 
                  href={`tel:${order.driver.phone}`}
                  className="btn btn-primary btn-sm"
                >
                  <FaPhone className="me-2" />
                  اتصل بالسائق
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* عنوان التوصيل */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card shadow-sm border-0 mb-4"
      >
        <div className="card-header bg-white">
          <h5 className="mb-0">
            <FaMapMarkerAlt className="me-2 text-primary" />
            عنوان التوصيل
          </h5>
        </div>
        <div className="card-body">
          {order.shipping?.address ? (
            <>
              <p className="mb-1"><strong>{order.shipping.address.name}</strong></p>
              <p className="mb-1">{order.shipping.address.street}</p>
              <p className="mb-1">
                {order.shipping.address.city}, {order.shipping.address.state} {order.shipping.address.zipCode}
              </p>
              <p className="mb-0">{order.shipping.address.country}</p>
            </>
          ) : (
            <p className="text-muted">لا يتوفر عنوان الشحن</p>
          )}
        </div>
      </motion.div>

      {/* تفاصيل المنتجات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card shadow-sm border-0"
      >
        <div className="card-header bg-white">
          <h5 className="mb-0">
            <FaBoxOpen className="me-2 text-primary" />
            المنتجات ({order.items?.length || 0})
          </h5>
        </div>
        <div className="card-body">
          {order.items?.map((item, index) => (
            <div key={item.id || index} className="d-flex align-items-center border-bottom pb-3 mb-3">
              <div className="flex-grow-1">
                <h6 className="fw-semibold mb-1">{item.name}</h6>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">الكمية: {item.quantity}</small>
                  <strong className="text-primary">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</strong>
                </div>
              </div>
            </div>
          ))}
          {(!order.items || order.items.length === 0) && (
            <p className="text-muted text-center">لا توجد منتجات</p>
          )}
        </div>
      </motion.div>

      {/* أزرار التنقل */}
      <div className="text-center mt-5">
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/orders" className="btn btn-primary">
            <FaBox className="me-2" />
            جميع طلباتي
          </Link>
          <Link to="/products" className="btn btn-outline-primary">
            متابعة التسوق
          </Link>
          <Link to="/" className="btn btn-outline-secondary">
            <FaHome className="me-2" />
            الرئيسية
          </Link>
        </div>
      </div>

      <style jsx>{`
        .order-tracking-page {
          background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
          min-height: 100vh;
        }
        
        .tracking-timeline {
          position: relative;
          padding: 20px 0;
        }
        
        .tracking-step {
          display: flex;
          align-items: flex-start;
          margin-bottom: 30px;
        }
        
        .step-indicator {
          position: relative;
          margin-right: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .step-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e9ecef;
          color: #6c757d;
          font-weight: bold;
          z-index: 2;
          transition: all 0.3s ease;
        }
        
        .step-icon.completed {
          background: #28a745;
          color: white;
        }
        
        .step-icon.active {
          background: #007bff;
          color: white;
          animation: pulse 2s infinite;
        }
        
        .step-icon.current {
          box-shadow: 0 0 0 5px rgba(0, 123, 255, 0.3);
        }
        
        .step-connector {
          width: 2px;
          height: 40px;
          background: #e9ecef;
          margin-top: 10px;
        }
        
        .step-connector.completed {
          background: #28a745;
        }
        
        .driver-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @media (max-width: 768px) {
          .tracking-step {
            margin-bottom: 20px;
          }
          
          .step-icon {
            width: 40px;
            height: 40px;
          }
          
          .step-connector {
            height: 30px;
          }
        }
      `}</style>
    </div>
  );
}

export default OrderTracking;