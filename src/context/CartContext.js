import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (foodItemId, quantity = 1) => {
    if (!user) return false;
    try {
      const res = await api.post('/cart/items', { foodItemId, quantity });
      setCart(res.data);
      return true;
    } catch (err) {
      console.error('Error adding to cart:', err);
      return false;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const res = await api.put(`/cart/items/${cartItemId}?quantity=${quantity}`);
      setCart(res.data);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const res = await api.delete(`/cart/items/${cartItemId}`);
      setCart(res.data);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCart({ items: [] });
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const cartTotal = cart?.items?.reduce((total, item) => total + (item.foodItem.price * item.quantity), 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
