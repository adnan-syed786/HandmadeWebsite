import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SingleProductPage from './pages/SingleProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import WishlistPage from './pages/WishlistPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import ProductList from './pages/admin/ProductList';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK || '');

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500 font-medium">Loading...</div>
      </div>
    );
  }
  return token ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

function AdminRoute({ children }) {
  const { user, loading, token } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500 font-medium">Verifying admin access...</div>
      </div>
    );
  }
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return user?.role === 'admin' ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Elements stripe={stripePromise}>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/product/:id" element={<SingleProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="/my-orders" element={<PrivateRoute><OrderHistoryPage /></PrivateRoute>} />

            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><ProductList /></AdminRoute>} />
            <Route path="/admin/products/new" element={<AdminRoute><AddProduct /></AdminRoute>} />
            <Route path="/admin/products/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><Orders /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </Elements>
        </WishlistProvider>
      </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;