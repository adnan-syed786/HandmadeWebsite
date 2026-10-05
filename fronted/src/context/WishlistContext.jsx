import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'orion-wishlist';

function readWishlist() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(readWishlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function isWishlisted(productId) {
    return items.some((product) => product._id === productId);
  }

  function toggleWishlist(product) {
    if (!product?._id) return;
    setItems((current) => current.some((item) => item._id === product._id)
      ? current.filter((item) => item._id !== product._id)
      : [...current, product]);
  }

  function removeFromWishlist(productId) {
    setItems((current) => current.filter((product) => product._id !== productId));
  }

  const value = useMemo(() => ({
    items,
    count: items.length,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
  }), [items]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
