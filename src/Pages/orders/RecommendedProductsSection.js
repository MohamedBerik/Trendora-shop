import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

const RecommendedProductsSection = ({ 
  products, 
  onAddToCart, 
  onToggleWishlist, 
  onProductView,
  isInWishlist 
}) => {
  if (!products || products.length === 0) return null;

  const RecommendedProduct = ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7 + index * 0.1 }}
      className="col-xl-3 col-lg-4 col-md-6 mb-4"
    >
      <div className="card border-0 shadow-sm h-100 product-card">
        <div className="position-relative">
          <img
            src={product.image || "/assets/img/placeholder.jpg"}
            alt={product.name}
            className="card-img-top product-image"
            style={{ height: '140px', objectFit: 'cover', cursor: 'pointer' }}
            onClick={() => onProductView(product)}
            onError={(e) => {
              e.target.src = "/assets/img/placeholder.jpg";
            }}
          />
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-primary small">{product.category}</span>
          </div>
         
          {/* Rating */}
          <div className="position-absolute top-0 start-0 m-2">
            <div className="d-flex align-items-center bg-dark bg-opacity-75 rounded-pill px-2 py-1">
              <FaStar className="text-warning me-1" size={10} />
              <small className="text-white fw-semibold">{product.rating}</small>
            </div>
          </div>
        </div>
       
        <div className="card-body d-flex flex-column">
          <h6
            className="card-title fw-semibold mb-2 product-title"
            style={{ cursor: 'pointer' }}
            onClick={() => onProductView(product)}
          >
            {product.name}
          </h6>
         
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-bold text-primary fs-5">${product.price}</span>
            <small className={`${product.stock > 5 ? 'text-success' : 'text-warning'}`}>
              {product.stock > 5 ? 'متوفر' : 'كمية محدودة'}
            </small>
          </div>
         
          <div className="d-flex gap-2 mt-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAddToCart(product)}
              className="btn btn-primary btn-sm flex-fill"
            >
              <FaShoppingCart className="me-1" />
              أضف إلى السلة
            </motion.button>
           
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`btn btn-sm ${isInWishlist(product.id) ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => onToggleWishlist(product)}
            >
              <FaHeart />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="row mt-5">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-dark">
            <FaStar className="me-2 text-warning" />
            منتجات قد تعجبك
          </h4>
          <Link to="/products" className="btn btn-outline-primary btn-sm">
            عرض الكل
          </Link>
        </div>
        
        <div className="row">
          {products.map((product, index) => (
            <RecommendedProduct 
              key={product.id} 
              product={product} 
              index={index}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              onProductView={onProductView}
              isInWishlist={isInWishlist}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedProductsSection;