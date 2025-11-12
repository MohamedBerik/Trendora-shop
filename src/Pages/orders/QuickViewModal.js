import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBox, 
  FaShoppingBag, 
  FaReceipt, 
  FaDownload, 
  FaPrint, 
  FaMap, 
  FaStar,
  FaTimes 
} from "react-icons/fa";

const QuickViewModal = ({ order, onClose, onDownloadInvoice, onTrackOrder, onRateOrder }) => {
  if (!order) return null;

  const calculateOrderValues = (order) => {
    const items = order.items || [];
    const itemsTotal = items.reduce((sum, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
    
    const shippingCost = order.shipping?.cost || 0;
    const totalAmount = order.total || (itemsTotal + shippingCost);
    
    return {
      subtotal: itemsTotal,
      shipping: shippingCost,
      total: totalAmount,
      itemsCount: items.reduce((sum, item) => sum + (item.quantity || 1), 0)
    };
  };

  const orderValues = calculateOrderValues(order);
  const isOrderEligibleForRating = order.status === 'delivered';
  const isOrderEligibleForTracking = ['shipped', 'out_for_delivery', 'delivered'].includes(order.status);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal show d-block"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25 }}
          className="modal-dialog modal-xl modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div className="modal-header bg-primary text-white border-0">
              <div className="d-flex align-items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="bg-white bg-opacity-20 rounded-circle p-3 me-3"
                >
                  <FaBox size={24} className="text-white" />
                </motion.div>
                <div>
                  <h5 className="modal-title mb-1 fw-bold">تفاصيل الطلب</h5>
                  <small className="opacity-90">{order.id}</small>
                </div>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white position-relative"
                onClick={onClose}
                style={{ opacity: 0.8 }}
              ></button>
            </div>

            <div className="modal-body p-4">
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-light bg-opacity-50 border-0">
                      <h6 className="mb-0 fw-bold text-dark">
                        <FaReceipt className="me-2 text-primary" />
                        معلومات الطلب
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-6">
                          <small className="text-muted d-block">رقم الطلب</small>
                          <strong className="text-dark">{order.id}</strong>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">التاريخ</small>
                          <strong className="text-dark">
                            {order.date ? new Date(order.date).toLocaleDateString('ar-SA') : "غير محدد"}
                          </strong>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">الحالة</small>
                          <span className={`badge bg-${order.status === 'delivered' ? 'success' : order.status === 'shipped' ? 'primary' : 'warning'} text-white`}>
                            {order.status === 'delivered' ? 'تم التوصيل' : 
                             order.status === 'shipped' ? 'تم الشحن' : 
                             order.status === 'processing' ? 'قيد المعالجة' : order.status}
                          </span>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">طريقة الدفع</small>
                          <strong className="text-info">{order.payment?.method || "غير محدد"}</strong>
                        </div>
                      </div>

                      <div className="border-top pt-3 mt-3">
                        <h6 className="fw-bold mb-3 text-dark">تفاصيل الفاتورة</h6>
                        {[
                          { label: "المنتجات", value: `$${orderValues.subtotal.toFixed(2)}` },
                          { label: "الشحن", value: `$${orderValues.shipping.toFixed(2)}` },
                        ].map((item, index) => (
                          <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">{item.label}</span>
                            <strong>{item.value}</strong>
                          </div>
                        ))}
                        <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-2">
                          <span className="text-dark fw-bold">الإجمالي</span>
                          <strong className="text-primary fs-5">
                            ${orderValues.total.toFixed(2)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-light bg-opacity-50 border-0">
                      <h6 className="mb-0 fw-bold text-dark">
                        <FaShoppingBag className="me-2 text-primary" />
                        المنتجات ({order.items?.length || 0})
                      </h6>
                    </div>
                    <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {order.items?.map((item, index) => (
                        <motion.div
                          key={item.id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom"
                        >
                          <div className="position-relative flex-shrink-0">
                            <img
                              src={item.image || item.images?.[0] || "/assets/img/placeholder.jpg"}
                              alt={item.name}
                              className="rounded-3 shadow-sm"
                              style={{ 
                                width: '80px', 
                                height: '80px', 
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                e.target.src = "/assets/img/placeholder.jpg";
                              }}
                            />
                            <span className="position-absolute top-0 start-0 badge bg-dark bg-opacity-75 m-1">
                              {item.quantity}x
                            </span>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="fw-semibold mb-1 text-dark small">{item.name}</h6>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">${(item.price || 0).toFixed(2)}</small>
                              <strong className="text-primary">
                                ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                              </strong>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-12">
                  <div className="d-flex gap-2 justify-content-center flex-wrap">
                    {isOrderEligibleForTracking && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-info px-4 rounded-pill"
                        onClick={() => onTrackOrder(order)}
                      >
                        <FaMap className="me-2" />
                        تتبع الشحن
                      </motion.button>
                    )}

                    {isOrderEligibleForRating && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-warning px-4 rounded-pill"
                        onClick={() => onRateOrder(order)}
                      >
                        <FaStar className="me-2" />
                        تقييم المنتجات
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-success px-4 rounded-pill"
                      onClick={() => onDownloadInvoice(order)}
                    >
                      <FaDownload className="me-2" />
                      تحميل الفاتورة
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-primary px-4 rounded-pill"
                      onClick={() => window.print()}
                    >
                      <FaPrint className="me-2" />
                      طباعة الفاتورة
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-outline-secondary px-4 rounded-pill"
                      onClick={onClose}
                    >
                      إغلاق
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickViewModal;