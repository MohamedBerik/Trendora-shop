import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar/Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet /> {/* هنا يظهر محتوى كل صفحة */}
      <Footer />
    </>
  );
}
