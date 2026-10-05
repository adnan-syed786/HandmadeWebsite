import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css'; // legacy styles kept if needed

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(formData.email, formData.password);
      if (from) {
        navigate(from, { replace: true });
      } else if (res?.user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 font-inter bg-cover bg-center relative"
      style={{ backgroundImage: 'url(/Images/login.jpeg)' }}
    >
      {/* Optional dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true"></div>
      <div className="relative bg-white/90 backdrop-blur-sm w-full max-w-md p-8 rounded-xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500">Login to continue shopping</p>
        </div>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="text-right">
            <button type="button" className="text-sm text-blue-600 hover:underline" onClick={() => alert('Reset password flow TBD')}>Forgot Password?</button>
          </div>
          <button type="submit" disabled={loading} className="w-full p-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-6 text-center">Don't have an account? <Link to="/signup" className="text-blue-600 font-medium hover:underline">Create one</Link></p>
      </div>
    </div>
  );
}

export default LoginPage;