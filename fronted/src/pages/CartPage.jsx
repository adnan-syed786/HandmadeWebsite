import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { imageUrl } from '../config/image';
import { Link } from 'react-router-dom';

function getProductImages(product) {
  const sources = [
    product?.imageUrl,
    product?.images,
    product?.imageUrls,
    product?.gallery,
  ];
  const images = sources.flatMap((source) => {
    if (Array.isArray(source)) return source;
    if (typeof source === 'string') return source.split(',').map((image) => image.trim());
    return [];
  });

  return [...new Set(images.filter(Boolean).map(imageUrl))];
}

function formatPrice(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? `₹${amount.toFixed(2)}` : '₹0.00';
}

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal, count } = useCart();

  function changeQuantity(productId, value) {
    const quantity = Math.max(1, Number(value) || 1);
    updateQuantity(productId, quantity);
  }

  return (
    <div>
      <Header />
      <section className="px-4 py-8 md:px-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-700">Shopping bag</p>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">Your Cart</h1>
          <p className="text-gray-600 mt-2">
            {items.length ? `${count} product${count === 1 ? '' : 's'} in your cart` : 'Review your products before checkout.'}
          </p>
        </div>
        {!items.length ? (
          <div className="text-center border border-dashed rounded-2xl p-12 bg-gray-50">
            <div className="text-5xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-gray-900">Your cart is empty</h2>
            <p className="text-gray-600 mt-2 mb-6">Discover something handmade for your home.</p>
            <Link className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold" to="/shop">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Your products</h2>
              {items.map(({ product, quantity }) => (
                <div
                  key={product._id}
                  className="p-4 border rounded-2xl bg-white hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <img src={imageUrl(getProductImages(product)[0])} alt={product.name} className="w-24 h-24 object-cover rounded-xl bg-gray-100" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-gray-900 truncate">{product.name}</div>
                          <div className="text-sm text-gray-500 mt-1">{formatPrice(product.price)} each</div>
                        </div>
                      </div>
                      <div className="text-green-700 font-semibold mt-2">
                        {formatPrice(product.price * quantity)}
                        <span className="text-sm font-normal text-gray-500 ml-2">for {quantity} item{quantity === 1 ? '' : 's'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Quantity</span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(product._id, quantity - 1)}
                        disabled={quantity <= 1}
                        className="w-8 h-8 border rounded-lg text-lg disabled:opacity-40"
                        aria-label={`Decrease ${product.name} quantity`}
                      >
                        -
                      </button>
                      <input
                        id={`quantity-${product._id}`}
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(event) => changeQuantity(product._id, event.target.value)}
                        className="w-14 p-2 border rounded-lg text-center"
                        aria-label={`${product.name} quantity`}
                      />
                      <button
                        type="button"
                        onClick={() => changeQuantity(product._id, quantity + 1)}
                        className="w-8 h-8 border rounded-lg text-lg"
                        aria-label={`Increase ${product.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(product._id)} className="text-sm text-red-600 hover:text-red-700 font-medium">Remove product</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 border rounded-2xl bg-white h-fit">
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Total products</span>
                <span>{count}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3 mt-3">
                <span>Final price</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <Link to="/checkout" className="block mt-5 text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold">
                Proceed to Checkout
              </Link>
              <Link to="/shop" className="block mt-3 text-center text-sm text-green-700 hover:underline">
                Continue shopping
              </Link>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
