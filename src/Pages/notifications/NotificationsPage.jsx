import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Bell, CheckCheck, Trash2, ShoppingCart, Gift, Truck, Settings, Shield } from 'lucide-react';
import { useNotifications } from '../../context/NotificationsContext';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const {
    notifications,
    newNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  } = useNotifications();

  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="notifications-page"
    >
      <Container className="py-5">
        {/* الرأس */}
        <Row className="mb-4">
          <Col>
            <div className="page-header">
              <div className="header-content">
                <div className="d-flex align-items-center gap-3">
                  <div className="page-icon">
                    <Bell size={32} />
                  </div>
                  <div>
                    <h1 className="page-title">الإشعارات</h1>
                    <p className="page-subtitle">
                      إدارة جميع إشعاراتك في مكان واحد
                    </p>
                  </div>
                </div>
                <Badge bg="primary" className="unread-count">
                  {unreadCount} غير مقروء
                </Badge>
              </div>
            </div>
          </Col>
        </Row>

        {/* أدوات التحكم */}
        <Row className="mb-4">
          <Col>
            <div className="notifications-controls">
              <div className="filter-buttons">
                <Button
                  variant={filter === 'all' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  الكل
                </Button>
                <Button
                  variant={filter === 'unread' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                >
                  غير المقروء
                </Button>
                <Button
                  variant={filter === 'read' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFilter('read')}
                >
                  المقروء
                </Button>
              </div>

              <div className="action-buttons">
                {unreadCount > 0 && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={markAllAsRead}
                  >
                    <CheckCheck size={16} className="me-2" />
                    تعيين الكل كمقروء
                  </Button>
                )}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={clearAll}
                >
                  <Trash2 size={16} className="me-2" />
                  مسح الكل
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* قائمة الإشعارات */}
        <Row>
          <Col lg={8}>
            <AnimatePresence mode="wait">
              {filteredNotifications.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="empty-state"
                >
                  <Bell size={64} className="empty-icon" />
                  <h3 className="empty-title">لا توجد إشعارات</h3>
                  <p className="empty-description">
                    {filter === 'all'
                      ? 'لم تستلم أي إشعارات حتى الآن'
                      : `لا توجد إشعارات ${filter === 'unread' ? 'غير مقروءة' : 'مقروءة'}`
                    }
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="notifications-list"
                >
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`notification-card ${!notification.read ? 'unread' : ''} ${
                        newNotifications.includes(notification.id) ? 'new-notification' : ''
                      }`}
                    >
                      <div className="notification-content">
                        <div
                          className="notification-icon-wrapper"
                          style={{ backgroundColor: getNotificationColor(notification.type) + '20' }}
                        >
                          <span style={{ color: getNotificationColor(notification.type) }}>
                            {getNotificationIcon(notification.type)}
                          </span>
                        </div>
                        <div className="notification-details">
                          <div className="notification-header">
                            <h5 className="notification-title">
                              {notification.title}
                            </h5>
                            <span className="notification-time">
                              {formatTime(notification.date)}
                            </span>
                          </div>
                          <p className="notification-message">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                      <div className="notification-actions">
                        {!notification.read && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            تعيين كمقروء
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          حذف
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

export default NotificationsPage;