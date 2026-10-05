import React, { useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Only COD available
  const [shipping, setShipping] = useState(() => ({
    name: user?.name || '',
    address: user?.address || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
    phoneNumber: user?.phoneNumber || '',
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const orderItems = useMemo(() => items.map(({product, quantity}) => ({ product: product._id, quantity, price: product.price })), [items]);

  async function createPaymentIntent() {
    const res = await fetch(apiUrl('/api/payments/create-payment-intent'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authToken: token },
      body: JSON.stringify({ amount: Math.round(subtotal * 100), currency: 'usd' })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to initiate payment');
    return data.clientSecret;
  }

  async function placeOrder(paymentId = '') {
    const res = await fetch(apiUrl('/api/orders'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authToken: token },
      body: JSON.stringify({ 
        products: orderItems, 
        totalAmount: subtotal, 
        shippingAddress: shipping, 
        paymentMethod,
        paymentId 
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create order');
    return data;
  }

  async function pay(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Only Cash on Delivery - no payment processing needed
      await placeOrder();
      clearCart();
      setSuccess('Order placed successfully! Pay cash on delivery.');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header />
      <section className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Shipping Address</h2>
            {['name','address','city','zipCode','phoneNumber'].map((k) => (
              <div key={k}>
                <label className="block text-sm font-medium mb-1">{k}</label>
                <input className="w-full p-2 border rounded" value={shipping[k]||''} onChange={(e)=>setShipping(s=>({...s,[k]:e.target.value}))} />
              </div>
            ))}
            <button onClick={()=>setStep(2)} className="px-4 py-2 bg-blue-600 text-white rounded">Continue to Payment</button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={pay} className="space-y-4">
            <h2 className="text-xl font-semibold">Payment Method</h2>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">💵</span>
                <h3 className="font-semibold text-lg">Cash on Delivery</h3>
              </div>
              <p className="text-gray-700">
                You will pay <strong className="text-blue-600">₹{subtotal.toFixed(2)}</strong> in cash when your order is delivered to your doorstep.
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total to Pay on Delivery:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {error && <div className="text-red-600 p-3 bg-red-50 rounded">{error}</div>}
            <button 
              disabled={loading} 
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 font-semibold"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="mb-4 text-6xl">✅</div>
            <div className="p-6 border rounded-lg bg-green-50 text-green-700">
              <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
              <p className="text-lg">{success}</p>
              <p className="mt-4 text-gray-600">Thank you for your order. We'll contact you shortly to confirm delivery details.</p>
              <button 
                onClick={() => window.location.href = '/'} 
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
