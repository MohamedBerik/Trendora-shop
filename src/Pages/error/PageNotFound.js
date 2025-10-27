import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="container text-center py-5">
      <div className="row">
        <div className="col-12">
          <div className="error-page">
            <h1 className="display-1 text-gradient">404</h1>
            <h2 className="h3 mb-4">الصفحة غير موجودة</h2>
            <p className="text-muted mb-4">
              عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/" className="btn btn-gradient">
                العودة للرئيسية
              </Link>
              <button 
                onClick={() => window.history.back()} 
                className="btn btn-outline-gradient"
              >
                الرجوع للخلف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;