import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';

export default function OrderHistoryPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(apiUrl('/api/orders/my'), {
          headers: { authToken: token }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <div>
      <Header />
      <section className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Orders</h1>
          {!loading && orders.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <div>
                <div className="text-xs text-gray-600">Total Orders</div>
                <div className="text-lg font-bold text-blue-600">{orders.length}</div>
              </div>
            </div>
          )}
        </div>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !orders.length && <div>No orders yet.</div>}
        <div className="space-y-4">
          {orders.map(o => {
            const getStatusColor = (status) => {
              switch(status?.toLowerCase()) {
                case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
                case 'processing': return 'bg-blue-100 text-blue-800 border-blue-300';
                case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-300';
                case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
                case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
                default: return 'bg-gray-100 text-gray-800 border-gray-300';
              }
            };
            
            const getStatusIcon = (status) => {
              switch(status?.toLowerCase()) {
                case 'pending': return '⏳';
                case 'processing': return '⚙️';
                case 'shipped': return '🚚';
                case 'delivered': return '✅';
                case 'cancelled': return '❌';
                default: return '📦';
              }
            };

            return (
              <div key={o._id} className="p-5 border-2 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-lg">Order #{o._id.slice(-6)}</div>
                    <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                  </div>
                  <div className={`px-4 py-2 rounded-full font-semibold text-sm border-2 flex items-center gap-2 ${getStatusColor(o.status)}`}>
                    <span>{getStatusIcon(o.status)}</span>
                    <span className="uppercase tracking-wide">{o.status}</span>
                  </div>
                </div>
                
                <div className="border-t pt-3 mb-3">
                  <div className="space-y-2">
                    {o.products.map((p,i)=>(
                      <div key={i} className="flex justify-between text-sm py-1">
                        <span className="text-gray-700">{p.product?.name || 'Product'} <span className="text-gray-500">× {p.quantity}</span></span>
                        <span className="font-medium">₹{(p.price*p.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t-2">
                  <span className="font-bold text-gray-700">Total Amount</span>
                  <span className="font-bold text-xl text-blue-600">₹{o.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <Footer />
    </div>
  );
}
