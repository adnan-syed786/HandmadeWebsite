import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';
import './SignupPage.css'; // kept in case of legacy overrides

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    zipCode: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // Basic length validation aligned with backend validators
    if (formData.password.length < 5) {
      setError('Password must be at least 5 characters.');
      return;
    }
    setLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        password: formData.password
      });
      setSuccess('🎉 Account created successfully! Redirecting to home page...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 font-inter bg-cover bg-center relative"
      style={{ backgroundImage: 'url(/Images/login.jpg)' }}
    >
      <div className="absolute inset-0 bg-black/40" aria-hidden="true"></div>
      <div className="relative bg-white/95 backdrop-blur-sm w-full max-w-4xl p-6 rounded-xl shadow-2xl">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-sm text-gray-500">Your E-commerce Adventure Starts Here</p>
        </div>
        {error && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
        {success && (
          <div className="mb-3 p-4 bg-green-50 border-2 border-green-300 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-green-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{success}</span>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required placeholder="Rajesh Kumar" className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="rajesh.kumar@example.com" className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required placeholder="+91 98765 43210" className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input name="address" value={formData.address} onChange={handleChange} required placeholder="123 MG Road" className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input name="city" value={formData.city} onChange={handleChange} required placeholder="Mumbai" className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
            <input name="zipCode" value={formData.zipCode} onChange={handleChange} required placeholder="400001" className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••" className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <div className="col-span-2">
            <button type="submit" disabled={loading} className="w-full p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg disabled:opacity-60">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login here</Link></p>
      </div>
    </div>
  );
}

export default SignupPage;
