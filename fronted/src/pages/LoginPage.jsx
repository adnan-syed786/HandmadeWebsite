import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;
  const { login } = useAuth();

  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(formData.email, formData.password);
      const userRole = res?.user?.role;

      if (role === 'admin' && userRole !== 'admin') {
        throw new Error('This account does not have admin access.');
      }
      if (role === 'customer' && userRole === 'admin') {
        throw new Error('Please select Admin Login for this account.');
      }

      if (from && role === 'customer') {
        navigate(from, { replace: true });
      } else {
        navigate(userRole === 'admin' ? '/admin' : '/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const isCust = role === 'customer';

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-overlay" />
      </div>
      
      <div className="login-card">
        {/* Left Branding Panel with Rich Background */}
        <div className="login-brand">
          <div className="brand-content">
            <span className="brand-small">WELCOME TO</span>
            <h1>Handcrafted<br /><span>Stories.</span></h1>
            <p>Discover unique handmade products crafted with passion, creativity, and tradition.</p>
            <div className="brand-line" />
            <span className="brand-bottom">SHOP • CREATE • INSPIRE</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="login-form-section">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your account</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="role-selector">
            {['customer', 'admin'].map((r) => (
              <button
                key={r}
                type="button"
                className={`role-option ${role === r ? 'active' : ''}`}
                onClick={() => { setRole(r); setError(''); }}
              >
                <span className="role-icon">{r === 'customer' ? '🛍️' : '⚙️'}</span>
                <span className="role-text">
                  <strong>{r === 'customer' ? 'Customer' : 'Admin'}</strong>
                  <small>{r === 'customer' ? 'Shop products' : 'Manage store'}</small>
                </span>
              </button>
            ))}
          </div>

          {error && <div className="login-error"><span>!</span><p>{error}</p></div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  id="email" type="email" name="email"
                  value={formData.email} onChange={handleChange}
                  placeholder="Enter your email" autoComplete="email" required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-label">
                <label htmlFor="password">Password</label>
                <button type="button" className="forgot-password" onClick={() => alert('Reset password flow TBD')}>
                  Forgot Password?
                </button>
              </div>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="password" type="password" name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Enter your password" autoComplete="current-password" required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className={`login-submit ${!isCust ? 'admin-login' : ''}`}>
              {loading ? (
                <><span className="loader" />Logging in...</>
              ) : (
                <>{isCust ? 'Login as Customer' : 'Login as Admin'}<span className="arrow">→</span></>
              )}
            </button>
          </form>

          {/* Footer Navigation Options */}
          <div className="auth-footer-links">
            {isCust ? (
              <p className="signup-text">
                Don't have an account? <Link to="/signup">Create an account</Link>
              </p>
            ) : (
              <p className="admin-note">Admin access is restricted to authorized store administrators.</p>
            )}
            <div className="login-footer">
              <span>Secure Login</span> • <span>Your information is protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}