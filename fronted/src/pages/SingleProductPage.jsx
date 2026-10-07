import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        setLoading(true);
        // Fetch current product
        const res = await fetch(apiUrl(`/api/products/${id}`));
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch product');
        
        setProduct(data);
        
        const initialImages = [
          data.imageUrl,
          ...(Array.isArray(data.images) ? data.images : []),
        ].filter(Boolean).map(imageUrl);
        
        if (initialImages.length > 0) {
          setSelectedImage(initialImages[0]);
        }

        // Fetch related products for the bottom grid
        const allRes = await fetch(apiUrl('/api/products'));
        if (allRes.ok) {
          const allData = await allRes.json();
          const list = Array.isArray(allData) ? allData : allData.products || [];
          setRelatedProducts(list.filter(p => p._id !== id).slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
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
    <div className="single-product-page">
      <Header />
      <div className="single-product-loading">Loading masterpiece...</div>
      <Footer />
    </div>
  );
  
  if (error || !product) return (
    <div className="single-product-page">
      <Header />
      <div className="single-product-error-container">
        <h1>Product not found</h1>
        <p>{error || 'The product you are looking for does not exist or has been removed.'}</p>
        <span>Redirecting to shop in 3 seconds...</span>
        <button onClick={() => navigate('/shop')} className="single-product-shop-btn">
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
        {/* Main Product Section */}
        <section className="single-product-main">
          <div className="single-product-gallery">
            <div className="single-product-image-frame">
              <img
                src={selectedImage || productImages[0] || '/Images/placeholder.png'}
                alt={product.name}
                className="single-product-image"
                onError={(event) => { event.currentTarget.src = '/Images/placeholder.png'; }}
              />
            </div>
            {productImages.length > 1 && (
              <div className="single-product-thumbnails">
                {productImages.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    onClick={() => setSelectedImage(image)}
                    className={selectedImage === image ? 'thumbnail-active' : ''}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="single-product-details">
            <p className="single-product-kicker">HANDCRAFTED COLLECTION</p>
            <h1>{product.name}</h1>
            <div className="single-product-rating">
              <span className="stars">★</span> {Number(product.averageRating || 0).toFixed(1)} 
              <span className="review-count">({product.reviews?.length || 0} customer reviews)</span>
            </div>
            <div className="single-product-price">₹{Number(product.price || 0).toFixed(2)}</div>
            <p className="single-product-description">{product.description}</p>

            <div className={`single-product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✕ Out of stock'}
            </div>

            <div className="single-product-actions">
              <div className="quantity-wrapper">
                <label htmlFor="qty">Qty</label>
                <input
                  id="qty"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  className="single-product-quantity"
                />
              </div>
              <button
                disabled={product.stock <= 0}
                onClick={() => addToCart(product, Number(qty))}
                className="single-product-cart"
              >
                Add to Cart
              </button>
              <button
                disabled={product.stock <= 0}
                onClick={() => {
                  addToCart(product, Number(qty));
                  navigate('/checkout');
                }}
                className="single-product-buy"
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`single-product-wishlist ${isWishlisted(product._id) ? 'saved' : ''}`}
              >
                <i className={isWishlisted(product._id) ? 'bx bxs-heart' : 'bx bx-heart'}></i>
                <span>{isWishlisted(product._id) ? 'Saved' : 'Wishlist'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="single-product-reviews-section">
          <h2>Customer Feedback & Reviews</h2>
          <div className="single-product-reviews-grid">
            <div className="reviews-list-wrapper">
              {product.reviews?.length ? (
                <div className="review-list">
                  {product.reviews.map(r => (
                    <div key={r._id} className="review-item">
                      <div className="review-header">
                        <strong>{r.user?.name || 'Verified Buyer'}</strong>
                        <span className="review-stars">★ {r.rating}.0</span>
                      </div>
                      <p>{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-reviews">
                  <p>No reviews yet for this item. Be the first to share your experience!</p>
                </div>
              )}
            </div>

            <div className="review-form-wrapper">
              <div className="review-form-card">
                <h3>Write a Review</h3>
                <ReviewForm productId={product._id} onSubmitted={onReviewSubmitted} />
              </div>
            </div>
          </div>
        </section>

        {/* You May Also Like / More Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products-section">
            <h2>You May Also Like</h2>
            <div className="related-products-grid">
              {relatedProducts.map((item) => (
                <Link to={`/product/${item._id}`} key={item._id} className="related-product-card">
                  <div className="related-image-wrap">
                    <img
                      src={imageUrl(item.imageUrl) || '/Images/placeholder.png'}
                      alt={item.name}
                      onError={(e) => { e.currentTarget.src = '/Images/placeholder.png'; }}
                    />
                  </div>
                  <div className="related-info">
                    <h4>{item.name}</h4>
                    <span className="related-price">₹{Number(item.price || 0).toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}