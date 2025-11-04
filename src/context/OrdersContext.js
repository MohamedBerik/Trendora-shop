import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const isInitializedRef = useRef(false);
  const lastOrderIdRef = useRef(null);

  // تحميل الطلبات من localStorage - معدل
  useEffect(() => {
    if (isInitializedRef.current) return;

    console.log('🔄 Loading orders from localStorage...');
    
    try {
      const savedOrders = localStorage.getItem('userOrders');
     
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        console.log('📦 Found orders in localStorage:', parsedOrders.length);
        
        // تنظيف البيانات والتأكد من عدم وجود تكرارات
        const uniqueOrders = parsedOrders
          .filter(order => order && order.id) // حذف البيانات الفارغة
          .filter((order, index, self) =>
            index === self.findIndex(o => o.id === order.id)
          )
          .map(order => ({
            ...order,
            timestamp: order.timestamp || Date.now(),
            date: order.date || new Date().toISOString(),
            status: order.status || 'processing',
            total: typeof order.total === 'number' ? order.total : 0
          }))
          .sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date));
       
        setOrders(uniqueOrders);
        console.log('✅ Orders loaded successfully:', uniqueOrders.length);
      } else {
        console.log('ℹ️ No orders found in localStorage');
        setOrders([]);
      }
    } catch (error) {
      console.error('❌ Error loading orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
      isInitializedRef.current = true;
      console.log('🏁 Orders context initialized');
    }
  }, []);

  // إضافة طلب جديد - معدل
  const addOrder = useCallback((newOrder) => {
    if (!newOrder || !newOrder.id) {
      console.error('❌ Invalid order data:', newOrder);
      return false;
    }

    // منع تكرار الإضافة لنفس الطلب
    if (lastOrderIdRef.current === newOrder.id) {
      console.log('🛑 Duplicate order detected, skipping:', newOrder.id);
      return false;
    }

    console.log('➕ Adding new order:', newOrder.id);

    setOrders(prevOrders => {
      // التحقق من التكرار مرة أخرى للسلامة
      const orderExists = prevOrders.some(order => order.id === newOrder.id);
      if (orderExists) {
        console.log('🛑 Order already exists:', newOrder.id);
        return prevOrders;
      }

      const orderWithTimestamp = {
        ...newOrder,
        timestamp: newOrder.timestamp || Date.now(),
        date: newOrder.date || new Date().toISOString(),
        status: newOrder.status || 'processing',
        total: typeof newOrder.total === 'number' ? newOrder.total : 0,
        items: Array.isArray(newOrder.items) ? newOrder.items : []
      };

      const updatedOrders = [orderWithTimestamp, ...prevOrders];
      
      // حفظ في localStorage
      try {
        localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
        lastOrderIdRef.current = newOrder.id; // حفظ آخر طلب مضاف
        console.log('💾 Order saved to localStorage:', newOrder.id);
      } catch (error) {
        console.error('❌ Error saving to localStorage:', error);
      }
     
      return updatedOrders;
    });
   
    return true;
  }, []);

  // حذف طلب - معدل
  const removeOrder = useCallback((orderId) => {
    console.log('🗑️ Removing order:', orderId);
    
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.filter(order => order.id !== orderId);
      
      try {
        localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
        console.log('✅ Order removed:', orderId);
      } catch (error) {
        console.error('❌ Error removing order from localStorage:', error);
      }
      
      return updatedOrders;
    });
  }, []);

  // تحديث حالة الطلب - معدل
  const updateOrderStatus = useCallback((orderId, newStatus) => {
    console.log('🔄 Updating order status:', orderId, newStatus);
    
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      
      try {
        localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
        console.log('✅ Order status updated:', orderId, newStatus);
      } catch (error) {
        console.error('❌ Error updating order in localStorage:', error);
      }
      
      return updatedOrders;
    });
  }, []);

  // البحث في الطلبات - معدل
  const searchOrders = useCallback((searchTerm) => {
    if (!searchTerm.trim()) return orders;
    
    return orders.filter(order => {
      if (!order) return false;
      
      const matchesId = order.id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesItems = order.items?.some(item => 
        item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return matchesId || matchesItems;
    });
  }, [orders]);

  // تنظيف جميع الطلبات (للاستكشاف)
  const clearAllOrders = useCallback(() => {
    console.log('🧹 Clearing all orders');
    
    setOrders([]);
    try {
      localStorage.removeItem('userOrders');
      lastOrderIdRef.current = null;
      console.log('✅ All orders cleared');
    } catch (error) {
      console.error('❌ Error clearing orders from localStorage:', error);
    }
  }, []);

  // الحصول على إحصائيات الطلبات
  const getOrderStats = useCallback(() => {
    const total = orders.length;
    const delivered = orders.filter(order => order.status === 'delivered').length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const averageOrderValue = total > 0 ? totalSpent / total : 0;
    
    return {
      total,
      delivered,
      totalSpent,
      averageOrderValue
    };
  }, [orders]);

  const value = {
    orders,
    addOrder,
    removeOrder,
    updateOrderStatus,
    searchOrders,
    clearAllOrders,
    getOrderStats,
    isLoading,
    isInitialized,
    ordersCount: orders.length
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};