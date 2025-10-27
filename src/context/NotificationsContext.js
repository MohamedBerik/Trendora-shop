import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [newNotifications, setNewNotifications] = useState([]);

  // تحميل الإشعارات من localStorage عند التحميل
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        // تحويل تاريخ الإشعارات إلى كائنات Date
        const notificationsWithDates = parsed.map(notif => ({
          ...notif,
          date: new Date(notif.date)
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error('Error loading notifications:', error);
        // بيانات ابتدائية في حالة وجود خطأ
        setNotifications(getInitialNotifications());
      }
    } else {
      setNotifications(getInitialNotifications());
    }
  }, []);

  // حفظ الإشعارات في localStorage عند التغيير
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const getInitialNotifications = () => [
    {
      id: 1,
      title: 'مرحباً بك!',
      message: 'تم تسجيل دخولك بنجاح إلى متجرنا',
      type: 'system',
      time: 'الآن',
      read: false,
      date: new Date()
    },
    {
      id: 2,
      title: 'عرض خاص',
      message: 'خصم 30٪ على المنتجات الجديدة',
      type: 'promotion',
      time: 'منذ ساعة',
      read: false,
      date: new Date(Date.now() - 3600000)
    },
    {
      id: 3,
      title: 'طلب جديد',
      message: 'تم استلام طلبك #12345 بنجاح',
      type: 'order',
      time: 'منذ 3 ساعات',
      read: true,
      date: new Date(Date.now() - 10800000)
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const addNotification = (notification) => {
    const newNotif = {
      ...notification,
      id: Date.now(),
      date: new Date(),
      time: 'الآن'
    };
    
    setNotifications(prev => [newNotif, ...prev]);
    setNewNotifications(prev => [newNotif.id, ...prev]);
    
    // إزالة من الإشعارات الجديدة بعد 3 ثواني
    setTimeout(() => {
      setNewNotifications(prev => prev.filter(id => id !== newNotif.id));
    }, 3000);
  };

  // محاكاة استقبال إشعارات جديدة
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldAddNotification = Math.random() > 0.8; // 20% فرصة
     
      if (shouldAddNotification) {
        const types = ['order', 'promotion', 'shipping', 'system', 'security'];
        const titles = {
          order: 'طلب جديد',
          promotion: 'عرض خاص',
          shipping: 'شحن الطلب',
          system: 'تحديث النظام',
          security: 'تنبيه أمني'
        };
        
        const messages = {
          order: 'تم استلام طلب جديد في نظامك',
          promotion: 'عروض حصرية تنتظرك! تفقدها الآن',
          shipping: 'طلبك في طريق إليه إليك',
          system: 'تم تحديث النظام لتحسين الأداء',
          security: 'تم تسجيل دخول من جهاز جديد'
        };
        
        const type = types[Math.floor(Math.random() * types.length)];
        
        addNotification({
          title: titles[type],
          message: messages[type],
          type: type,
          read: false
        });
      }
    }, 15000); // كل 15 ثانية

    return () => clearInterval(interval);
  }, []);

  const value = {
    notifications,
    newNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    addNotification
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};