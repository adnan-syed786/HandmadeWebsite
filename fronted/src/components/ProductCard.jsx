import React, { useState } from "react";
import "./ProductCard.css";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { imageUrl } from "../config/image";

const fallbackImages = [
  "/Images/images1.jpg",
  "/Images/images2.jpg",
  "/Images/images3.jpg",
  "/Images/pot.jpg",
  "/Images/cloth1.jpg",
];

function getImages(product, img) {
  const suppliedImages =
    product?.images || product?.imageUrls || product?.gallery;
  const imageList = Array.isArray(suppliedImages)
    ? suppliedImages
    : typeof suppliedImages === "string"
      ? suppliedImages.split(",").map((image) => image.trim())
      : [];
  const images = [img, ...imageList].filter(Boolean).map(imageUrl);
  const uniqueImages = [...new Set(images)];
  const seed = String(product?._id || product?.name || img || "product")
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);
  const rotatedFallbacks = fallbackImages.map(
    (_, index) => fallbackImages[(index + seed) % fallbackImages.length],
  );

  return [...uniqueImages, ...rotatedFallbacks].slice(0, 5);
}

function ProductCard({ img, title, price, tag, product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const images = getImages(product, img);
  const [activeImage, setActiveImage] = useState(images[0]);
  const saved = product?._id ? isWishlisted(product._id) : false;
  const rating = Number(product?.averageRating || 0);
  const reviewCount = product?.reviews?.length || 0;
  const originalPrice = product?.originalPrice || product?.compareAtPrice;
  const discount =
    originalPrice && product?.price
      ? Math.round((1 - product.price / originalPrice) * 100)
      : null;
  const badge = tag || product?.tag;
  const badgeClass = badge?.toLowerCase().includes("best")
    ? "best-seller"
    : "new-arrival";

  function handleWishlistClick(event) {
    event.stopPropagation();
    if (product) toggleWishlist(product);
  }

  function handleAddToCart(event) {
    event.stopPropagation();
    if (product) addToCart(product);
  }

  return (
    <article className="product-card">
      <div className="product-gallery">
        <img
          className="product-main-image"
          src={activeImage}
          alt={title}
          onError={(event) => {
            const nextImage = fallbackImages.find(
              (fallback) => fallback !== event.currentTarget.src,
            );
            event.currentTarget.src = nextImage || fallbackImages[0];
          }}
        />
        {badge && <div className={`product-badge ${badgeClass}`}>{badge}</div>}
        <button
          type="button"
          className={`heart-icon ${saved ? "saved" : ""}`}
          onClick={handleWishlistClick}
          aria-label={
            saved ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`
          }
        >
          <i className={saved ? "bx bxs-heart" : "bx bx-heart"}></i>
        </button>
        <button
          type="button"
          className="gallery-arrow gallery-arrow-left"
          onClick={(event) => {
            event.stopPropagation();
            setActiveImage(
              images[
                (images.indexOf(activeImage) - 1 + images.length) %
                  images.length
              ],
            );
          }}
          aria-label="Previous product image"
        >
          <i className="bx bx-chevron-left"></i>
        </button>
        <button
          type="button"
          className="gallery-arrow gallery-arrow-right"
          onClick={(event) => {
            event.stopPropagation();
            setActiveImage(
              images[(images.indexOf(activeImage) + 1) % images.length],
            );
          }}
          aria-label="Next product image"
        >
          <i className="bx bx-chevron-right"></i>
        </button>
        <span className="image-count">
          {images.indexOf(activeImage) + 1}/{images.length}
        </span>
      </div>
      <div className="product-thumbnails" aria-label="Product images">
        {images.map((image, index) => (
          <button
            type="button"
            key={`${image}-${index}`}
            className={`product-thumbnail ${activeImage === image ? "active" : ""}`}
            onClick={(event) => {
              event.stopPropagation();
              setActiveImage(image);
            }}
            aria-label={`View product image ${index + 1}`}
          >
            <img src={image} alt="" />
          </button>
        ))}
      </div>
      <div className="product-details">
        <h3>{title}</h3>
        <div
          className="product-rating"
          aria-label={rating ? `${rating} out of 5 stars` : "No reviews yet"}
        >
          {rating ? (
            <>
              <span className="stars">
                {[0, 1, 2, 3, 4].map((star) => (
                  <i
                    key={star}
                    className={
                      star + 0.5 < rating
                        ? "bx bxs-star"
                        : star < rating
                          ? "bx bxs-star-half"
                          : "bx bx-star"
                    }
                  ></i>
                ))}
              </span>
              <span>
                {rating.toFixed(1)}{" "}
                {reviewCount ? `(${reviewCount} reviews)` : ""}
              </span>
            </>
          ) : (
            <span>No reviews yet</span>
          )}
        </div>
        <div className="product-price">
          <strong>
            {typeof price === "number" ? `₹${price.toFixed(0)}` : price}
          </strong>
          {originalPrice && <del>₹{Number(originalPrice).toFixed(0)}</del>}
          {discount > 0 && <span>{discount}% OFF</span>}
        </div>
        <p className="product-description">
          {product?.description ||
            "Beautifully crafted for your home. Designed to add a thoughtful touch to everyday living."}
        </p>
        <div className="product-actions">
          <button
            type="button"
            className="add-cart-button"
            onClick={handleAddToCart}
            disabled={!product || product.stock === 0}
          >
            <i className="bx bx-cart-add"></i> Add to Cart
          </button>
          <button
            type="button"
            className={`icon-action ${saved ? "saved" : ""}`}
            onClick={handleWishlistClick}
            aria-label="Add to wishlist"
          >
            <i className={saved ? "bx bxs-heart" : "bx bx-heart"}></i>
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
