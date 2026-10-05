import React from 'react';
import './Reviews.css';

function Reviews() {
  const reviewsData = [
    {
      id: 1,
      image: '/Images/p1.jpeg',
      review: 'The woven texture and finishing are beautiful. It feels like a piece made to last.',
      name: 'Sufiya Ansari',
      role: 'Verified purchase'
    },
    {
      id: 2,
      image: '/Images/p2.jpg',
      review: 'The earrings are delicate, distinctive, and arrived beautifully packed. I love the details.',
      name: 'Aditya',
      role: 'Verified purchase'
    },
    {
      id: 3,
      image: '/Images/p3.jpg',
      review: 'A warm, one-of-a-kind addition to my home. You can see the care in every little detail.',
      name: 'Priya Sharma',
      role: 'Verified purchase'
    }
  ];

  return (
    <section className="client-reviews">
      <div className="reviews-1">
        <p className="section-kicker">Kind words from thoughtful homes</p>
        <h3>What Our Customers Say</h3>
      </div>
      <br /><br />
      <div className="reviews-2">
        {reviewsData.map((review) => (
          <div key={review.id} className="reviews">
            <div className="review-image-container">
              <img src={review.image} alt={review.name} />
            </div>
            <div className="review-content">
              <div className="review-rating" aria-label="5 out of 5 stars">★★★★★</div>
              <p className="review-text">{review.review}</p>
              <h2>{review.name}</h2>
              <p className="review-role">{review.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Reviews;