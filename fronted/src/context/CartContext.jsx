import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // {product, quantity}

  function addToCart(product, quantity = 1) {
    setItems(prev => {
      const idx = prev.findIndex(i => i.product._id === product._id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + quantity };
        return copy;
      }
      return [...prev, { product, quantity }];
    });
  }

  function removeFromCart(productId) {
    setItems(prev => prev.filter(i => i.product._id !== productId));
  }

  function updateQuantity(productId, quantity) {
    setItems(prev => prev.map(i => i.product._id === productId ? { ...i, quantity } : i));
  }

  function clearCart() { setItems([]); }

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0), [items]);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value = useMemo(() => ({ items, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, count }), [items, subtotal, count]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
