import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { imageUrl } from '../config/image';
import './WishlistPage.css';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <main className="wishlist-page">
        <div className="wishlist-heading">
          <div>
            <p className="wishlist-eyebrow">SAVED FOR LATER</p>
            <h1>My Wishlist</h1>
          </div>
          <span>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>

        {!items.length ? (
          <div className="wishlist-empty">
            <i className="bx bx-heart"></i>
            <h2>Your wishlist is waiting</h2>
            <p>Save the handmade pieces you love and find them here anytime.</p>
            <Link to="/shop" className="wishlist-shop-link">Explore the shop</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {items.map((product) => (
              <article className="wishlist-card" key={product._id}>
                <button
                  type="button"
                  className="wishlist-remove"
                  onClick={() => removeFromWishlist(product._id)}
                  aria-label={`Remove ${product.name} from wishlist`}
                >
                  <i className="bx bxs-heart"></i>
                </button>
                <button
                  type="button"
                  className="wishlist-image-button"
                  onClick={() => navigate(`/product/${product._id}`)}
                  aria-label={`View ${product.name}`}
                >
                  <img src={imageUrl(product.imageUrl || product.images?.[0])} alt={product.name} />
                </button>
                <div className="wishlist-card-content">
                  <h2>{product.name}</h2>
                  <p>₹{Number(product.price).toFixed(2)}</p>
                  <button type="button" className="wishlist-cart-button" onClick={() => addToCart(product)}>
                    <i className="bx bx-cart-add"></i>
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
