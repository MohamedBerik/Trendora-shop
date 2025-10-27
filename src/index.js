import React, { useEffect } from "react";
import ReactGA from "react-ga4";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// ✅ استيراد مكونات الذكاء الاصطناعي
import { AIProvider } from "./context/AIContext";
import AIShoppingAssistant from "./components/ai/AIShoppingAssistant";

// ✅ استيراد الصفحات الجديدة
import NotificationsPage from "./Pages/notifications/NotificationsPage";
import Blog from "./Pages/blog/Blog";
import { LanguageProvider } from "./context/LanguageContext";

// ✅ المكونات الرئيسية
import MainLayout from "./layout/MainLayout";
import Home from "./Home/Home";
import { AllData } from "./constants/AllData";
import AllAbout from "./Pages/about/AllAbout";
import AllContact from "./Pages/contact/AllContact";
import AllProducts from "./Pages/products/AllProducts";
import AllSingleProduct from "./Pages/singleproduct/AllSingleProduct";
import AllCart from "./Pages/cart/AllCart";
import Checkout from "./Pages/checkout/Checkout";
import Confirmation from "./Pages/confirmation/Confirmation";
import SignIn from "./Pages/auth/SignIn";
import SignUp from "./Pages/auth/SignUp";
import NewArrivalsPage from "./Pages/new-arrivals/NewArrivalsPage";
import ProfilePage from "./components/profile/ProfilePage";
import SaleItemsPage from "./Pages/sale-items/SaleItems";
import OrdersPage from "./Pages/orders/OrdersPage";
import WishlistPage from "./Pages/wishlist/WishlistPage";
import PremiumCollectionPage from "./Pages/premium-collection/PremiumCollectionPage";
import GiftCardsPage from "./Pages/gift-cards/GiftCardsPage";
import BestSellersPage from "./Pages/best-sellers/BestSellersPage";

// ✅ السياقات (Contexts)
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "react-use-cart";
import { ThemeProvider } from "./context/ThemeContext";
import { LoadingProvider } from "./context/LoadingContext";
import { WishlistProvider } from "./context/WishlistContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import StatisticsDashboard from "./components/statistics/StatisticsDashboard";
import AdminStatisticsDashboard from "./components/dashboard/AdminStatisticsDashboard";

// ✅ نظام التحليلات - مسارات مصححة
import AnalyticsProvider from "./components/providers/AnalyticsProvider";
import { StatisticsProvider } from "./components/providers/StatisticsProvider";
import serviceRegistry from "./services/serviceRegistry"; // ✅ استخدام serviceRegistry

// ✅ حدود الأخطاء
import ErrorBoundary from "./Pages/error/ErrorBoundary";
import PageNotFound from "./Pages/error/PageNotFound";

// 🎯 مكون تهيئة التحليلات
const AnalyticsInitializer = () => {
  useEffect(() => {
    // ✅ تهيئة Google Analytics
    ReactGA.initialize("G-05CY1F12HT");
    ReactGA.send("pageview");

    // ✅ تهيئة تحليلات التطبيق
    const initializeAppAnalytics = () => {
      try {
        // تنظيف البيانات القديمة
        serviceRegistry.analytics.cleanupOldData();

        // محاولة إرسال البيانات المخزنة محلياً
        serviceRegistry.analytics.flushOfflineData();

        // تتبع بدء التطبيق
        serviceRegistry.analytics.trackUserAction("app_started", {
          app_version: process.env.REACT_APP_VERSION || "1.0.0",
          environment: process.env.NODE_ENV,
        });
      } catch (error) {
        console.error("Error initializing analytics:", error);
      }
    };

    initializeAppAnalytics();
  }, []);

  return null;
};

// 🚀 إعداد الـ Router مع تحسينات
const router = createBrowserRouter([
  {
    element: <MainLayout />, // ✅ AIShoppingAssistant سيتم وضعه داخل MainLayout
    errorElement: <PageNotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <AllAbout />,
      },
      {
        path: "/contact",
        element: <AllContact />,
      },
      {
        path: "/shop",
        element: <AllProducts />,
      },
      {
        path: "/products",
        element: <AllProducts />,
      },
      {
        path: "/singleproduct/:id",
        element: <AllSingleProduct />,
      },
      {
        path: "/cart",
        element: <AllCart />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/confirmation",
        element: <Confirmation />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/category/:category",
        element: <AllProducts />,
      },
      {
        path: "/search",
        element: <AllProducts />,
      },
      {
        path: "/notifications",
        element: <NotificationsPage />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/new-arrivals",
        element: <NewArrivalsPage />,
      },
      {
        path: "/best-sellers",
        element: <BestSellersPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/sale-items",
        element: <SaleItemsPage />,
      },
      {
        path: "/orders",
        element: <OrdersPage />,
      },
      {
        path: "/wishlist",
        element: <WishlistPage />,
      },
      {
        path: "/premium-collection",
        element: <PremiumCollectionPage />,
      },
      {
        path: "/gift-cards",
        element: <GiftCardsPage />,
      },
      {
        path: "/statistics",
        element: <StatisticsDashboard />,
      },
      {
        path: "/admin-dashboard",
        element: <AdminStatisticsDashboard />,
      },
    ],
  },
]);

// 🎯 مكون التطبيق الرئيسي
const App = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <LoadingProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <NotificationsProvider>
                    <AnalyticsProvider>
                      <StatisticsProvider>
                        <AIProvider>
                          <LanguageProvider>
                            <AllData>
                              {/* ✅ مكون تهيئة التحليلات */}
                              <AnalyticsInitializer />
                              {/* ✅ مساعد الذكاء الاصطناعي */}
                              <AIShoppingAssistant />
                              <RouterProvider router={router} />
                              <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={true} pauseOnFocusLoss draggable pauseOnHover theme="colored" style={{ fontSize: "14px" }} />
                            </AllData>
                          </LanguageProvider>
                        </AIProvider>
                      </StatisticsProvider>
                    </AnalyticsProvider>
                  </NotificationsProvider>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </LoadingProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

// 🎯 Render التطبيق
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
