import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // تتبع التمرير
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // التمرير للأعلى بسلاسة
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top btn btn-gradient shadow-lg"
          aria-label="التمرير إلى الأعلى"
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '2rem',
            zIndex: 1000,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            border: 'none',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease'
          }}
        >
          ↑
        </button>
      )}
    </>
  );
};

export default ScrollToTop;