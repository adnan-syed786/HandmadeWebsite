import React, { useEffect, useState } from 'react';
import './Hero.css';

function Hero() {
  const images = [
    '/Images/back.jpeg',
    '/Images/back2.jpg',
    '/Images/back3.jpeg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Automatic carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prev) => (prev + 1) % images.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(
      (prev) => (prev + 1) % images.length
    );
  };

  return (
    <section
      className="main-home"
      style={{
        backgroundImage: `url(${images[currentImageIndex]})`
      }}
    >

      {/* Hero Content */}
      <div className="main-text">

        <h5>HANDMADE WITH LOVE</h5>

        <h1>
          Unique Crafts
          <br />
          for a Better <span>Tomorrow</span>
        </h1>

        <p>
          Explore handcrafted treasures that bring beauty,
          culture and sustainability to your home.
        </p>

        <a href="/shop" className="main-btn">
          Shop Now
          <i className="bx bx-right-arrow-alt"></i>
        </a>

      </div>


      {/* Previous Arrow */}
      <button
        className="carousel-arrow carousel-prev"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <i className="bx bx-chevron-left"></i>
      </button>


      {/* Next Arrow */}
      <button
        className="carousel-arrow carousel-next"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <i className="bx bx-chevron-right"></i>
      </button>


      {/* Carousel Dots */}
      <div className="carousel-dots">

        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${
              index === currentImageIndex ? 'active' : ''
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}

      </div>

    </section>
  );
}

export default Hero;