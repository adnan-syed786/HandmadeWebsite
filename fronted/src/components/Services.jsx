import React from 'react';
import './Services.css';

function Services() {
  return (
    <section className="service">
      <div className="container">
        <ul className="service-list">
          <li className="service-item">
            <div className="service-item-icon">
              <img src="/Images/free.png" alt="" height="100px" width="50px" />
            </div>
            <div className="service-content">
              <p className="service-item-title">Free Shipping</p>
              <p className="service-item-text">On orders over ₹599</p>
            </div>
          </li>
          <li className="service-item">
            <div className="service-item-icon">
              <img src="/Images/return.png" alt="" height="100px" width="65px" />
            </div>
            <div className="service-content">
              <p className="service-item-title">Easy Returns</p>
              <p className="service-item-text">30-day return policy</p>
            </div>
          </li>
          <li className="service-item">
            <div className="service-item-icon">
              <img src="/Images/pay.jpg" alt="" height="100px" width="70px" />
            </div>
            <div className="service-content">
              <p className="service-item-title">Secure Payment</p>
              <p className="service-item-text">100% secure checkout</p>
            </div>
          </li>
          <li className="service-item">
            <div className="service-item-icon">
              <img src="/Images/support.png" alt="" height="100px" width="65px" />
            </div>
            <div className="service-content">
              <p className="service-item-title">Special Support</p>
              <p className="service-item-text">24/7 customer support</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Services;