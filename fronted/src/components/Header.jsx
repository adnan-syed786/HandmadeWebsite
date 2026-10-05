import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { apiUrl } from '../config/api';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [orderCount, setOrderCount] = useState(0);

  const { token, logout, user } = useAuth();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();

  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Fetch order count
  useEffect(() => {
    if (!token) {
      setOrderCount(0);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(apiUrl('/api/orders/my'), {
          headers: { authToken: token }
        });

        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          setOrderCount(data.length);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, [token]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = (e) => {
    e.preventDefault();

    const value = search.trim();

    navigate(
      value
        ? `/shop?search=${encodeURIComponent(value)}`
        : '/shop'
    );
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <header className="site-header">

      {/* Logo */}
      <Link to="/" className="logo" onClick={closeMenu}>
        <img
          src="/Images/Logo.2.png"
          alt="Orion Handmade Crafts"
        />
      </Link>

      {/* Navigation */}
      <nav className="main-nav">
        <Link to="/" className="nav-link" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/shop" className="nav-link" onClick={closeMenu}>
          Shop
        </Link>

        <Link to="/about" className="nav-link" onClick={closeMenu}>
          About
        </Link>

        {user?.role === 'admin' && (
          <Link to="/admin" className="nav-link" onClick={closeMenu}>
            Admin
          </Link>
        )}
      </nav>

      {/* Search */}
      <form className="header-search" onSubmit={handleSearch}>
        <i className="bx bx-search"></i>

        <input
          type="text"
          placeholder="Search handicrafts, decor, gifts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
          <button
            type="button"
            className="clear-search"
            onClick={() => setSearch('')}
          >
            <i className="bx bx-x"></i>
          </button>
        )}
      </form>

      {/* Right actions */}
      <div className="header-actions">

        {/* Wishlist */}
        <Link
          to="/wishlist"
          className="wishlist"
          onClick={closeMenu}
          aria-label="Wishlist"
        >
          <span className="icon-badge">
            <i className="bx bx-heart"></i>

            {wishlistCount > 0 && (
              <span className="badge">{wishlistCount}</span>
            )}
          </span>
        </Link>

        {/* Cart */}
        <Link
          to="/cart"
          className="action-item"
          onClick={closeMenu}
        >
          <span className="icon-badge">
            <i className="bx bx-cart"></i>

            {count > 0 && (
              <span className="badge">{count}</span>
            )}
          </span>

          <span>Cart</span>
        </Link>

        {/* Account */}
        <Link
          to={token ? '/my-orders' : '/login'}
          className="action-item"
          onClick={closeMenu}
        >
          <i className="bx bx-user"></i>
          <span>Account</span>
        </Link>

        {/* Three dots */}
        <div className="menu-wrapper" ref={menuRef}>

          <button
            className={`menu-button ${menuOpen ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label="More options"
            aria-expanded={menuOpen}
          >
            <i className={menuOpen ? 'bx bx-x' : 'bx bx-menu'}></i>
          </button>

          {menuOpen && (
            <div className="dropdown">

              <Link
                to="/about"
                className="dropdown-item"
                onClick={closeMenu}
              >
                <i className="bx bx-info-circle"></i>
                <span>About</span>
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="dropdown-item"
                  onClick={closeMenu}
                >
                  <i className="bx bx-shield-quarter"></i>
                  <span>Admin Dashboard</span>
                </Link>
              )}

              <Link
                to={token ? '/my-orders' : '/login'}
                className="dropdown-item"
                onClick={closeMenu}
              >
                <i className="bx bx-package"></i>
                <span>
                  My Orders
                  {token && orderCount > 0
                    ? ` (${orderCount})`
                    : ''}
                </span>
              </Link>

              {!token && (
                <Link
                  to="/login"
                  className="dropdown-item"
                  onClick={closeMenu}
                >
                  <i className="bx bx-log-in"></i>
                  <span>Login</span>
                </Link>
              )}

              {token && (
                <>
                  <div className="dropdown-divider" />

                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <i className="bx bx-log-out"></i>
                    <span>Logout</span>
                  </button>
                </>
              )}

            </div>
          )}

        </div>

      </div>
    </header>
  );
}

export default Header;