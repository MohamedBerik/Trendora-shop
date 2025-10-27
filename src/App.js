import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Banner from "./Home/Banner/Banner";
import Categories from "./Home/Categories";
import Features from "./Home/Features";
import SpecialOffers from "./Home/SpecialOffers";
import Testimonials from "./Home/Testimonials";
import CTA from "./Home/CTA";

// مكتبات خارجية
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Banner />
      <Categories />
      <Features />
      <SpecialOffers />
      <Testimonials />
      <CTA />
    </motion.div>
  );
}

export default App;