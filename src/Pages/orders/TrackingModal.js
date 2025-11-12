import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMap, FaTruck, FaCheckCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const TrackingModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal show d-block"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10000 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
            <div className="modal-header bg-primary text-white border-0">
              <div className="d-flex align-items-center">
                <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                  <FaMap size={20} className="text-white" />
                </div>
                <div>
                  <h5 className="modal-title mb-0 fw-bold">تتبع الشحن</h5>
                  <small className="opacity-90">{order.id}</small>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body text-center py-4">
              <FaTruck size={60} className="text-primary mb-3" />
              <h4 className="fw-bold text-dark mb-3">طلبك في الطريق إليك</h4>
              <p className="text-muted mb-4">نقوم بتوصيل طلبك في أقرب وقت ممكن</p>
              
              <div className="tracking-steps mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="step completed">
                    <div className="step-icon bg-success text-white rounded-circle p-2">
                      <FaCheckCircle size={16} />
                    </div>
                    <small className="d-block mt-1">تم الطلب</small>
                  </div>
                  <div className="step completed">
                    <div className="step-icon bg-success text-white rounded-circle p-2">
                      <FaCheckCircle size={16} />
                    </div>
                    <small className="d-block mt-1">قيد التجهيز</small>
                  </div>
                  <div className="step active">
                    <div className="step-icon bg-primary text-white rounded-circle p-2">
                      <FaTruck size={16} />
                    </div>
                    <small className="d-block mt-1">قيد التوصيل</small>
                  </div>
                  <div className="step">
                    <div className="step-icon bg-light text-muted rounded-circle p-2">
                      <FaCheckCircle size={16} />
                    </div>
                    <small className="d-block mt-1">تم التوصيل</small>
                  </div>
                </div>
              </div>

              <div className="alert alert-info border-0">
                <FaInfoCircle className="me-2" />
                <strong>رقم التتبع:</strong> TRK-{order.id.toUpperCase()}
              </div>
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-primary rounded-pill px-4" onClick={onClose}>
                فهمت
              </button>
              <button 
                className="btn btn-outline-primary rounded-pill px-4"
                onClick={() => {
                  onClose();
                  window.open(`/tracking/${order.id}`, '_blank');
                }}
              >
                <FaMap className="me-2" />
                صفحة التتبع الكاملة
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrackingModal;