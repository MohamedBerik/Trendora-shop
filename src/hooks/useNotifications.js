import { useState, useEffect } from 'react';

export const useNotifications = (initialNotifications = []) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [newNotifications, setNewNotifications] = useState([]);

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
      date: new Date()
    };
    
    setNotifications(prev => [newNotif, ...prev]);
    setNewNotifications(prev => [newNotif.id, ...prev]);
    
    // Remove from new notifications after 3 seconds
    setTimeout(() => {
      setNewNotifications(prev => prev.filter(id => id !== newNotif.id));
    }, 3000);
  };

  // Simulate receiving new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldAddNotification = Math.random() > 0.7;
     
      if (shouldAddNotification) {
        const types = ['order', 'promotion', 'shipping', 'system', 'security'];
        const titles = {
          order: 'New Order',
          promotion: 'Special Offer',
          shipping: 'Order Shipping',
          system: 'System Update',
          security: 'Security Alert'
        };
        
        const type = types[Math.floor(Math.random() * types.length)];
        
        addNotification({
          title: titles[type],
          message: `New ${type} notification - ${new Date().toLocaleTimeString()}`,
          type: type,
          time: 'Now',
          read: false
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    newNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    addNotification
  };
};