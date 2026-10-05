import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiUrl } from '../config/api';
import { imageUrl } from '../config/image';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReviewForm from '../components/ReviewForm';
import './SingleProductPage.css';

export default function SingleProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        console.log('Fetching product with ID:', id);
        const res = await fetch(apiUrl(`/api/products/${id}`));
        console.log('Response status:', res.status);
        const data = await res.json();
        console.log('Response data:', data);
        if (!res.ok) throw new Error(data.error || 'Failed to fetch product');
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
        // Auto redirect to shop after 3 seconds
        setTimeout(() => navigate('/shop'), 3000);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  function onReviewSubmitted(updated) {
    setProduct(updated);
  }

  const productImages = product
    ? [...new Set([
        product.imageUrl,
        ...(Array.isArray(product.images) ? product.images : []),
      ].filter(Boolean).map(imageUrl))]
    : [];

  if (loading) return (
    <div>
      <Header />
      <div className="p-8">Loading...</div>
      <Footer />
    </div>
  );
  
  if (error || !product) return (
    <div>
      <Header />
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Product not found</h1>
        <p className="text-gray-600 mb-2">
          {error || 'The product you are looking for does not exist or has been removed.'}
        </p>
        <p className="text-gray-500 mb-6 text-sm">
          Redirecting to shop in 3 seconds...
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Shop
        </button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="single-product-page">
      <Header />
      <main className="single-product-container">
        <section className="single-product-main">
          <div className="single-product-gallery">
            <div className="single-product-image-frame">
              <img
                src={productImages[0] || '/Images/placeholder.png'}
                alt={product.name}
                className="single-product-image"
                onError={(event) => { event.currentTarget.src = '/Images/placeholder.png'; }}
              />
            </div>
            {productImages.length > 1 && (
              <div className="single-product-thumbnails">
                {productImages.map((image, index) => (
                  <img key={`${image}-${index}`} src={image} alt={`${product.name} view ${index + 1}`} />
                ))}
              </div>
            )}
          </div>
          <div className="single-product-details">
            <p className="single-product-kicker">HANDCRAFTED COLLECTION</p>
            <h1>{product.name}</h1>
            <div className="single-product-rating">★ {Number(product.averageRating || 0).toFixed(1)} <span>({product.reviews?.length || 0} reviews)</span></div>
            <p className="single-product-description">{product.description}</p>
            <div className="single-product-price">₹{Number(product.price || 0).toFixed(2)}</div>
            <p className={product.stock > 0 ? 'single-product-stock in-stock' : 'single-product-stock out-of-stock'}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </p>
            <div className="single-product-actions">
              <input
                type="number"
                min="1"
                max={product.stock}
                value={qty}
                onChange={(e)=>setQty(Math.max(1, Number(e.target.value)))}
                className="single-product-quantity"
              />
              <button
                disabled={product.stock <= 0}
                onClick={()=>addToCart(product, qty)}
                className="single-product-cart"
              >Add to Cart</button>
              <button
                disabled={product.stock <= 0}
                onClick={()=>{ addToCart(product, qty || 1); navigate('/checkout'); }}
                className="single-product-buy"
              >Buy Now</button>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`single-product-wishlist ${isWishlisted(product._id) ? 'saved' : ''}`}
              >
                <i className={isWishlisted(product._id) ? 'bx bxs-heart' : 'bx bx-heart'}></i>
                <span>{isWishlisted(product._id) ? 'Saved' : 'Save to wishlist'}</span>
              </button>
            </div>
          </div>
        </section>

        <div className="single-product-reviews">
          <div>
            <h2>Customer Reviews</h2>
            <div className="review-list">
              {product.reviews?.length ? product.reviews.map(r => (
                <div key={r._id} className="review-item">
                  <strong>{r.user?.name || 'User'} · ★ {r.rating}</strong>
                  <p>{r.comment}</p>
                </div>
              )) : <div className="empty-reviews">No reviews yet.</div>}
            </div>
          </div>
          <div>
            <h2>Write a review</h2>
            <ReviewForm productId={product._id} onSubmitted={onReviewSubmitted} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
