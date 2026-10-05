import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { imageUrl } from '../config/image';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  return (
    <div>
      <Header />
      <section className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        {!items.length ? (
          <div className="text-gray-600">Your cart is empty. <Link className="text-blue-600" to="/shop">Continue shopping</Link></div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product._id} className="flex items-center gap-4 p-3 border rounded">
                  <img src={imageUrl(product.imageUrl || product.images?.[0])} alt={product.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-gray-600">₹{product.price.toFixed(2)}</div>
                  </div>
                  <input type="number" min="1" value={quantity} onChange={(e)=>updateQuantity(product._id, Number(e.target.value))} className="w-16 p-1 border rounded" />
                  <button onClick={()=>removeFromCart(product._id)} className="text-red-600">Remove</button>
                </div>
              ))}
            </div>
            <div className="p-4 border rounded h-fit">
              <div className="flex justify-between mb-2"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <Link to="/checkout" className="block mt-4 text-center bg-green-600 text-white py-2 rounded">Proceed to Checkout</Link>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
