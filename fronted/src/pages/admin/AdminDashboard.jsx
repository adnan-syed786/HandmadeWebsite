import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { apiUrl } from '../../config/api';
import './AdminDashboard.css';

const statConfig = [
  { key: 'totalUsers', label: 'Customers', icon: '◉', tone: 'terracotta' },
  { key: 'totalProducts', label: 'Products', icon: '◇', tone: 'sage' },
  { key: 'totalOrders', label: 'Orders', icon: '▣', tone: 'ochre' },
  { key: 'totalSales', label: 'Total sales', icon: '₹', tone: 'forest', money: true },
];

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setError('');
        const res = await fetch(apiUrl('/api/admin/stats'), { headers: { authToken: token } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch statistics');
        if (active) setStats(data);
      } catch (err) {
        if (active) setError(err.message);
      }
    })();
    return () => { active = false; };
  }, [token]);

  return (
    <div className="admin-page">
      <Header />
      <main className="admin-shell">
        <section className="admin-hero">
          <div className="admin-hero-content">
            <span className="admin-kicker">Handmade studio · Admin</span>
            <h1>Your craft, beautifully organised.</h1>
            <p>Manage your products, customers and orders from one calm workspace built for your store.</p>
          </div>
          <div className="admin-hero-art" aria-hidden="true"><span>✦</span><i /></div>
        </section>

        {error && <div className="admin-alert" role="alert">{error}</div>}

        <section className="admin-section">
          <div className="admin-section-head">
            <div>
              <span className="admin-kicker">Overview</span>
              <h2>Store at a glance</h2>
            </div>
            <span className="admin-live"><b /> Live data</span>
          </div>

          {!stats ? (
            <div className="admin-loading"><span className="admin-spinner" /> Loading your store...</div>
          ) : (
            <div className="admin-stats-grid">
              {statConfig.map((item) => (
                <article className={`admin-stat-card ${item.tone}`} key={item.key}>
                  <div className="admin-stat-icon">{item.icon}</div>
                  <div className="admin-stat-value">
                    {item.money ? `₹${Number(stats[item.key] || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : Number(stats[item.key] || 0).toLocaleString('en-IN')}
                  </div>
                  <div className="admin-stat-label">{item.label}</div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="admin-content-grid">
          <div className="admin-panel">
            <div className="admin-panel-head">
              <div><span className="admin-kicker">Shortcuts</span><h2>Quick actions</h2></div>
              <span className="admin-panel-count">03</span>
            </div>
            <div className="admin-action-list">
              <Link to="/admin/products/new" className="admin-action">
                <span className="admin-action-number">01</span><span><strong>Add a product</strong><small>Publish a new handmade item</small></span><b>↗</b>
              </Link>
              <Link to="/admin/products" className="admin-action">
                <span className="admin-action-number">02</span><span><strong>Manage catalogue</strong><small>Edit products and inventory</small></span><b>↗</b>
              </Link>
              <Link to="/admin/orders" className="admin-action">
                <span className="admin-action-number">03</span><span><strong>Review orders</strong><small>Track fulfilment and status</small></span><b>↗</b>
              </Link>
            </div>
          </div>

          <div className="admin-panel admin-menu-panel">
            <div className="admin-panel-head">
              <div><span className="admin-kicker">Workspace</span><h2>Admin menu</h2></div>
            </div>
            <nav className="admin-menu-list">
              <Link to="/admin/orders"><span>Orders management</span><b>→</b></Link>
              <Link to="/admin/products"><span>Product catalogue</span><b>→</b></Link>
              <Link to="/admin/products/new"><span>Add new product</span><b>→</b></Link>
              <Link to="/admin/users"><span>Customer accounts</span><b>→</b></Link>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
