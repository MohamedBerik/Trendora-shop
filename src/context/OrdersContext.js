import { createContext, useContext, useReducer, useCallback } from 'react';

const OrdersContext = createContext();

const initialState = {
  orders: [],
  isLoading: false,
  isInitialized: false,
  error: null
};

const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ORDERS: 'SET_ORDERS',
  SET_ERROR: 'SET_ERROR',
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
  CLEAR_ORDERS: 'CLEAR_ORDERS',
  SET_INITIALIZED: 'SET_INITIALIZED'
};

const ordersReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: action.payload ? state.error : null
      };
   
    case actionTypes.SET_ORDERS:
      return {
        ...state,
        orders: Array.isArray(action.payload) ? action.payload : [],
        isLoading: false,
        isInitialized: true,
        error: null
      };
   
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
   
    case actionTypes.ADD_ORDER:
      const newOrder = Array.isArray(action.payload) ? action.payload[0] : action.payload;
      
      const orderExists = state.orders.some(order => order.id === newOrder.id);
      if (orderExists) {
        console.warn('Order already exists:', newOrder.id);
        return state;
      }
      
      return {
        ...state,
        orders: [newOrder, ...state.orders],
        isLoading: false
      };
   
    case actionTypes.UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, ...action.payload.updates }
            : order
        )
      };
   
    case actionTypes.CLEAR_ORDERS:
      return {
        ...state,
        orders: [],
        isInitialized: true
      };
   
    case actionTypes.SET_INITIALIZED:
      return {
        ...state,
        isInitialized: action.payload
      };
   
    default:
      return state;
  }
};

export const OrdersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ordersReducer, initialState);

  const fetchOrders = useCallback(async () => {
    if (state.isInitialized && state.orders.length > 0) {
      return;
    }

    dispatch({ type: actionTypes.SET_LOADING, payload: true });
   
    try {
      const mockOrders = [
        {
          id: 'ORD-001',
          date: '2024-01-15',
          total: 150.00,
          status: 'delivered',
          items: [
            {
              id: 'PROD-1',
              name: 'Wireless Headphones',
              price: 75.00,
              quantity: 2,
              image: '/assets/img/products/headphones.jpg',
              category: 'Electronics'
            }
          ],
          itemsCount: 2,
          paymentMethod: 'Credit Card',
          shippingAddress: {
            street: '123 Main St',
            city: 'Cairo',
            state: 'Cairo',
            zipCode: '12345',
            country: 'Egypt'
          },
          tracking: 'TRK-123456',
          shipping: {
            cost: 10.00,
            method: 'Standard Shipping',
            address: {
              street: '123 Main St',
              city: 'Cairo',
              state: 'Cairo',
              zipCode: '12345',
              country: 'Egypt'
            }
          },
          payment: {
            method: 'Credit Card',
            status: 'completed'
          }
        },
        {
          id: 'ORD-002',
          date: '2024-01-10',
          total: 89.99,
          status: 'shipped',
          items: [
            {
              id: 'PROD-2',
              name: 'Smart Watch',
              price: 89.99,
              quantity: 1,
              image: '/assets/img/products/watch.jpg',
              category: 'Electronics'
            }
          ],
          itemsCount: 1,
          paymentMethod: 'PayPal',
          shippingAddress: {
            street: '456 Oak Ave',
            city: 'Alexandria',
            state: 'Alexandria',
            zipCode: '54321',
            country: 'Egypt'
          },
          tracking: 'TRK-789012',
          shipping: {
            cost: 5.00,
            method: 'Express Shipping',
            address: {
              street: '456 Oak Ave',
              city: 'Alexandria',
              state: 'Alexandria',
              zipCode: '54321',
              country: 'Egypt'
            }
          },
          payment: {
            method: 'PayPal',
            status: 'completed'
          }
        },
        {
          id: 'ORD-003',
          date: '2024-01-05',
          total: 45.50,
          status: 'processing',
          items: [
            {
              id: 'PROD-3',
              name: 'Phone Case',
              price: 15.50,
              quantity: 1,
              image: '/assets/img/products/case.jpg',
              category: 'Accessories'
            },
            {
              id: 'PROD-4',
              name: 'Screen Protector',
              price: 10.00,
              quantity: 2,
              image: '/assets/img/products/protector.jpg',
              category: 'Accessories'
            }
          ],
          itemsCount: 3,
          paymentMethod: 'Credit Card',
          shippingAddress: {
            street: '789 Palm St',
            city: 'Giza',
            state: 'Giza',
            zipCode: '67890',
            country: 'Egypt'
          },
          tracking: 'TRK-345678',
          shipping: {
            cost: 0.00,
            method: 'Free Shipping',
            address: {
              street: '789 Palm St',
              city: 'Giza',
              state: 'Giza',
              zipCode: '67890',
              country: 'Egypt'
            }
          },
          payment: {
            method: 'Credit Card',
            status: 'pending'
          }
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 500));
     
      dispatch({ type: actionTypes.SET_ORDERS, payload: mockOrders });
    } catch (error) {
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: 'Failed to fetch orders'
      });
    }
  }, [state.isInitialized, state.orders.length]);

  const addOrder = useCallback((orderData) => {
    if (!orderData || !orderData.id) {
      console.error('Invalid order data');
      return;
    }

    const newOrder = {
      id: orderData.id || `ORD-${Date.now()}`,
      date: orderData.date || new Date().toISOString().split('T')[0],
      total: orderData.total || 0,
      status: orderData.status || 'processing',
      items: Array.isArray(orderData.items) ? orderData.items : [],
      itemsCount: Array.isArray(orderData.items) 
        ? orderData.items.reduce((sum, item) => sum + (item.quantity || 1), 0) 
        : 1,
      paymentMethod: orderData.payment?.method || 'Credit Card',
      shippingAddress: orderData.shipping?.address || {},
      tracking: orderData.tracking || `TRK-${Date.now()}`,
      shipping: orderData.shipping || { cost: 0, method: 'Standard Shipping' },
      payment: orderData.payment || { method: 'Credit Card', status: 'pending' },
      ...orderData
    };
   
    dispatch({ type: actionTypes.ADD_ORDER, payload: newOrder });
  }, []);

  const updateOrder = useCallback((orderId, updates) => {
    dispatch({
      type: actionTypes.UPDATE_ORDER,
      payload: { orderId, updates }
    });
  }, []);

  const clearAllOrders = useCallback(() => {
    dispatch({ type: actionTypes.CLEAR_ORDERS });
  }, []);

  const setInitialized = useCallback((initialized) => {
    dispatch({
      type: actionTypes.SET_INITIALIZED,
      payload: initialized
    });
  }, []);

  const value = {
    orders: state.orders,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
    error: state.error,
   
    fetchOrders,
    addOrder,
    updateOrder,
    clearAllOrders,
    setInitialized
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