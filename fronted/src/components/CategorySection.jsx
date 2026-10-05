import React from "react";
import { Link } from "react-router-dom";
import "./CategorySection.css";

const categories = [
  {
    name: "Bags",
    label: "Everyday pieces with character",
    image: "/Images/Category/Bags.jpg",
  },
  {
    name: "Pottery",
    label: "Made slowly for warm spaces",
    image: "/Images/Category/Pottery.jpg",
  },
  {
    name: "Home Decor",
    label: "Small details, lasting feeling",
    image: "/Images/Category/HomeDecor.jpeg",
  },
  {
    name: "Jewelry",
    label: "Quietly distinctive adornments",
    image: "/Images/Category/jwellery.jpg",
  },
  {
    name: "Wooden Crafts",
    label: "Natural forms for modern homes",
    image: "/Images/Category/wooden.jpg",
  },
  {
    name: "Textiles",
    label: "Woven color and tradition",
    image: "/Images/Category/Textiles.jpg",
  },
];

function CategorySection() {
  return (
    <section
      className="category-section"
      aria-labelledby="category-heading"
    >
      <div className="section-heading">
        <div>
          <p className="section-kicker">
            Find your next favorite piece
          </p>

          <h2 id="category-heading">
            Explore Our <span>Collections</span>
          </h2>
        </div>

        <p className="section-description">
          Discover handcrafted pieces made with care.
        </p>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <Link
            className="category-card"
            to={`/shop?category=${encodeURIComponent(
              category.name.toLowerCase()
            )}`}
            key={category.name}
          >
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
            />

            <span className="category-card-overlay"></span>

            <div className="category-card-copy">
              <h3>{category.name}</h3>
              <p>{category.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;