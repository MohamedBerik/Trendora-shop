import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaCheck, FaTimes } from "react-icons/fa";

const RatingModal = ({ order, onClose, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      alert('يرجى اختيار تقييم');
      return;
    }

    onRatingSubmit({
      orderId: order.id,
      rating,
      review,
      date: new Date().toISOString()
    });
  };

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
            <div className="modal-header bg-warning text-dark border-0">
              <div className="d-flex align-items-center">
                <div className="bg-white bg-opacity-20 rounded-circle p-2 me-3">
                  <FaStar size={20} className="text-dark" />
                </div>
                <div>
                  <h5 className="modal-title mb-0 fw-bold">تقييم الطلب</h5>
                  <small className="opacity-90">{order.id}</small>
                </div>
              </div>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body py-4">
              <div className="text-center mb-4">
                <FaStar size={50} className="text-warning mb-3" />
                <h4 className="fw-bold text-dark mb-2">كيف كانت تجربتك؟</h4>
                <p className="text-muted">شاركنا رأيك في الطلب والمنتجات</p>
              </div>

              <div className="rating-section text-center mb-4">
                <h6 className="fw-bold mb-3">تقييم عام</h6>
                <div className="stars mb-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className="btn btn-link p-1"
                      onClick={() => setRating(star)}
                    >
                      <FaStar
                        size={30}
                        className={star <= rating ? "text-warning" : "text-muted"}
                        style={{ cursor: 'pointer' }}
                      />
                    </button>
                  ))}
                </div>
                <small className="text-muted">
                  {rating === 0 && 'اختر التقييم'}
                  {rating === 1 && 'سيء'}
                  {rating === 2 && 'مقبول'}
                  {rating === 3 && 'جيد'}
                  {rating === 4 && 'جيد جداً'}
                  {rating === 5 && 'ممتاز'}
                </small>
              </div>

              <div className="review-section">
                <label className="form-label fw-bold">تعليقك (اختياري)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="اكتب تعليقك عن الطلب والمنتجات..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
                إلغاء
              </button>
              <button 
                className="btn btn-warning rounded-pill px-4" 
                onClick={handleSubmit}
                disabled={rating === 0}
              >
                <FaCheck className="me-2" />
                إرسال التقييم
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RatingModal;