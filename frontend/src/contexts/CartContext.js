import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  getCart, 
  addToCart as addToCartAPI, 
  updateCartItem as updateCartItemAPI, 
  removeFromCart as removeFromCartAPI, 
  clearCart as clearCartAPI 
} from '../services/api';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0,
        itemCount: action.payload.itemCount || 0,
        loading: false
      };
    case 'ADD_ITEM':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        itemCount: action.payload.itemCount
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        itemCount: action.payload.itemCount
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        itemCount: action.payload.itemCount
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await getCart();
      dispatch({ type: 'SET_CART', payload: response.data });
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      const response = await addToCartAPI({
        productId: product._id,
        quantity
      });
      dispatch({ type: 'ADD_ITEM', payload: response.data.cart });
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await updateCartItemAPI({
        productId,
        quantity
      });
      dispatch({ type: 'UPDATE_ITEM', payload: response.data.cart });
      return { success: true };
    } catch (error) {
      console.error('Error updating cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await removeFromCartAPI(productId);
      dispatch({ type: 'REMOVE_ITEM', payload: response.data.cart });
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const clearCart = async () => {
    try {
      await clearCartAPI();
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
