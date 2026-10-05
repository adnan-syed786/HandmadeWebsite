import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiUrl } from '../config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchProfile();
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function fetchProfile() {
    try {
      setLoading(true);
      const res = await fetch(apiUrl('/api/auth/getuser'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authToken: token },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
        localStorage.removeItem('token');
        setToken('');
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || (Array.isArray(data.errors) ? data.errors[0]?.msg : null) || 'Login failed');
    localStorage.setItem('token', data.authToken);
    setToken(data.authToken);
    try {
      const profileRes = await fetch(apiUrl('/api/auth/getuser'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authToken: data.authToken },
      });
      if (profileRes.ok) {
        const userData = await profileRes.json();
        setUser(userData);
        return { ...data, user: userData };
      }
    } catch {
      // ignore
    }
    return data;
  }

  async function signup(payload) {
    const res = await fetch(apiUrl('/api/auth/createuser'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || (Array.isArray(data.errors) ? data.errors[0]?.msg : null) || 'Signup failed');
    localStorage.setItem('token', data.authToken);
    setToken(data.authToken);
    try {
      const profileRes = await fetch(apiUrl('/api/auth/getuser'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authToken: data.authToken },
      });
      if (profileRes.ok) {
        const userData = await profileRes.json();
        setUser(userData);
        return { ...data, user: userData };
      }
    } catch {
      // ignore
    }
    return data;
  }

  function logout() {
    setToken('');
    setUser(null);
  }

  const value = useMemo(() => ({ token, user, loading, login, signup, logout }), [token, user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
