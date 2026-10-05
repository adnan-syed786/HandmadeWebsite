import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(event) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  }

  return (
    <>
      <footer className="contact">
        <div className="footer-inner">
          <div className="first-info">
            <Link to="/" className="footer-logo">
              <img src="/Images/Logo.2.png" alt="Orion Handmade Crafts" />
            </Link>
            <p className="footer-intro">Thoughtful, handmade pieces that bring warmth, culture, and character into your everyday spaces.</p>
            <div className="social-icon" aria-label="Social media links">
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><i className="bx bxl-facebook"></i></a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="bx bxl-instagram"></i></a>
              <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><i className="bx bxl-youtube"></i></a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="bx bxl-linkedin"></i></a>
            </div>
          </div>

          <div className="second-info">
            <h4>Support</h4>
            <Link to="/about">About us</Link>
            <Link to="/about">Contact us</Link>
            <Link to="/cart">Shipping & returns</Link>
            <Link to="/about">Privacy policy</Link>
          </div>

          <div className="third-info">
            <h4>Shop</h4>
            <Link to="/shop">All handmade products</Link>
            <Link to="/shop?category=pottery">Pottery</Link>
            <Link to="/shop?category=textiles">Textiles</Link>
            <Link to="/shop?category=jewelry">Jewelry</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>

          <div className="footer-newsletter">
            <h4>Subscribe</h4>
            <p>Get first access to new collections, thoughtful offers, and stories from our makers.</p>
            <form className="subscribe-form" onSubmit={handleSubscribe}>
              <label className="sr-only" htmlFor="footer-email">Email address</label>
              <input id="footer-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setSubscribed(false); }} placeholder="Your email address" required />
              <button type="submit" aria-label="Subscribe"><i className="bx bx-arrow-up-right"></i></button>
            </form>
            {subscribed && <p className="subscribe-success">Thanks, you are on the list.</p>}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 ORION Handmade Crafts</span>
          <span>Made with care, one piece at a time.</span>
        </div>
      </footer>

    </>
  );
}

export default Footer;