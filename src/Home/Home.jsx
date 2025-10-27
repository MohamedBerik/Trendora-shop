import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Banner from "./Banner/Banner";
import Categories from "./Categories";
import Features from "./Features";
import SpecialOffers from "./SpecialOffers";
import Testimonials from "./Testimonials";
import CTA from "./CTA";

// ✅ استيراد useAnalytics
import { useAnalytics, useTrackPageView } from "../hooks/hooks-exports";

// مكتبات خارجية
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  // ✅ استخدام هوك التتبع
  const { trackEvent } = useAnalytics();
  
  // ✅ تتبع عرض الصفحة الرئيسية
  useTrackPageView('home_page');

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    
    // ✅ تتبع تحميل الصفحة الرئيسية
    trackEvent('home_page_loaded', {
      load_time: performance.now(),
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  // ✅ تتبع التفاعلات العامة في الصفحة الرئيسية
  const handleSectionView = (sectionName) => {
    trackEvent('section_view', {
      section: sectionName,
      page: 'home',
      timestamp: new Date().toISOString()
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="home-page"
    >
      <Banner onSectionView={handleSectionView} />
      <Categories onSectionView={handleSectionView} />
      <Features onSectionView={handleSectionView} />
      <SpecialOffers onSectionView={handleSectionView} />
      <Testimonials onSectionView={handleSectionView} />
      <CTA onSectionView={handleSectionView} />
    </motion.div>
  );
};

export default Home;