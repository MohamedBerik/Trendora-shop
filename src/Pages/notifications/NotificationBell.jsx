import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Bell, X, ShoppingCart, Gift, Truck, Settings, Shield, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationsContext';
import './NotificationBell.css';

const NotificationBell = ({ darkMode = false }) => {
  const {
    notifications,
    newNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewAllClick = () => {
    navigate('/notifications');
    setShowDropdown(false);
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setShowDropdown(false);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      order: <ShoppingCart size={18} />,
      promotion: <Gift size={18} />,
      shipping: <Truck size={18} />,
      system: <Settings size={18} />,
      security: <Shield size={18} />
    };
    return icons[type] || <Bell size={18} />;
  };

  const getNotificationColor = (type) => {
    const colors = {
      order: '#10b981',
      promotion: '#f59e0b',
      shipping: '#3b82f6',
      system: '#6b7280',
      security: '#ef4444'
    };
    return colors[type] || '#6b7280';
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  return (
    <div className="notification-bell-wrapper" ref={dropdownRef}>
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip>Notifications ({unreadCount})</Tooltip>}
      >
        <Button
          variant="outline-light"
          className={`position-relative border-0 ${darkMode ? 'bg-transparent' : 'bg-transparent'}`}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="notification-badge"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </Button>
      </OverlayTrigger>

      {/* قائمة الإشعارات المنسدلة */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="notification-dropdown"
          >
            {/* الرأس */}
            <div className="dropdown-header">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Notifications ({unreadCount})</h6>
                <div className="d-flex gap-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="link"
                      size="sm"
                      className="text-primary p-0"
                      onClick={markAllAsRead}
                      title="تعيين الكل كمقروء"
                    >
                      <CheckCheck size={14} />
                    </Button>
                  )}
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger p-0"
                    onClick={() => setShowDropdown(false)}
                    title="إغلاق"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* قائمة الإشعارات المصغرة */}
            <div className="dropdown-notifications">
              {notifications.length === 0 ? (
                <div className="text-center p-3 text-muted">
                  <Bell size={32} className="mb-2 opacity-50" />
                  <p className="mb-0 small">لا توجد إشعارات</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <motion.div
                    key={notification.id}
                    layout
                    className={`dropdown-notification-item ${!notification.read ? 'unread' : ''} ${
                      newNotifications.includes(notification.id) ? 'new-notification' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div
                      className="notification-icon-wrapper"
                      style={{ backgroundColor: getNotificationColor(notification.type) + '20' }}
                    >
                      <span style={{ color: getNotificationColor(notification.type) }}>
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">{formatTime(notification.date)}</div>
                    </div>
                    {!notification.read && (
                      <div className="unread-dot" style={{ backgroundColor: getNotificationColor(notification.type) }} />
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* التذييل */}
            <div className="dropdown-footer">
              <Button
                variant="outline-primary"
                size="sm"
                className="w-100"
                onClick={handleViewAllClick}
              >
                عرض جميع الإشعارات
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;