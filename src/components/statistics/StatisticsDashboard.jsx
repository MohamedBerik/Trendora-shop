// components/statistics/StatisticsDashboard.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const StatisticsDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // فقط إعادة التوجيه إذا لم يكن هناك بيانات محددة في URL
    if (!location.search && !location.hash) {
      navigate('/admin-dashboard?tab=statistics', { replace: true });
    }
  }, [navigate, location]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري التوجيه إلى لوحة التحكم...</p>
        <button 
          onClick={() => navigate('/admin-dashboard?tab=statistics')}
          className="mt-4 text-blue-600 hover:text-blue-800 underline"
        >
          الانتقال مباشرة
        </button>
      </div>
    </div>
  );
};

export default StatisticsDashboard;