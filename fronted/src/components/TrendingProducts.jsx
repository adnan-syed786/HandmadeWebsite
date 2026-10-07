
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import './TrendingProducts.css';
import { apiUrl } from '../config/api';
import { imageUrl } from '../config/image';

// Fallback data
const fallbackData = [
  {
    img: '/Images/bag1.jpg.jpg',
    title: 'Jute Handbag',
    price: '₹500 - ₹600',
    tag: 'Bestseller',
  },
  {
    img: '/Images/bag2.jpg.jpg',
    title: 'Shelf Ethnic Bohemian Handmade',
    price: '₹300 - ₹480',
    tag: 'New',
  },
  {
    img: '/Images/bag3.jpg.jpg',
    title: 'Ladies Banjara Handmade Bag',
    price: '₹700 - ₹850',
    tag: 'Popular',
  },
  {
    img: '/Images/cloth1.jpg',
    title: 'Fancy Handmade Cardigan',
    price: '₹2000 - ₹2500',
    tag: 'Trending',
  },
];

function TrendingProducts() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const fetchTrendingProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(
          apiUrl('/api/products?sort=rating_desc&limit=8')
        );

        if (!res.ok) {
          throw new Error('Failed to load trending products');
        }

        const data = await res.json();

        if (active) {
          setItems(data);
        }
      } catch (e) {
        if (active) {
          setError('Showing our popular handmade products.');
          setItems(fallbackData);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchTrendingProducts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="trending-product" id="trending">

      {/* Section Header */}
      <div className="trending-header">

        <div className="trending-heading">
          <p className="section-kicker">
            CUSTOMER FAVORITES
          </p>

          <h2>
            Trending <span>Bestsellers</span>
          </h2>

          <p className="section-subtitle">
            Discover the handmade pieces everyone is loving right now.
          </p>
        </div>

        <button
          className="view-all-btn"
          onClick={() => navigate('/shop')}
          type="button"
        >
          View All Products
          <span>→</span>
        </button>

      </div>

      {/* Loading */}
      {loading && (
        <div className="products-loading">
          <div className="loading-card"></div>
          <div className="loading-card"></div>
          <div className="loading-card"></div>
          <div className="loading-card"></div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="products-message">
          {error}
        </p>
      )}

      {/* Products */}
      {!loading && (
        <div className="products">

          {items.map((product, index) => (
            <div
              className="product-wrapper"
              key={product._id || index}
              onClick={() =>
                product._id &&
                navigate(`/product/${product._id}`)
              }
            >
              <ProductCard
                product={product}
                img={imageUrl(
                  product.imageUrl ||
                  product.images?.[0] ||
                  product.img
                )}
                title={product.name || product.title}
                price={product.price}
                tag="Bestseller"
              />
            </div>
          ))}

        </div>
      )}

    </section>
  );
}

export default TrendingProducts;