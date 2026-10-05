import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import "./ShopPage.css";

import Header from "../components/Header";
import ProductCard from "../components/ProductCard";

import { apiUrl } from "../config/api";
import { imageUrl } from "../config/image";

const categories = [
  "Bags",
  "Pottery",
  "Home Decor",
  "Jewelry",
  "Wooden Crafts",
  "Textiles",
];

const materials = [
  "Cotton",
  "Jute",
  "Wood",
  "Clay",
  "Ceramic",
  "Metal",
];

const sortOptions = [
  {
    value: "recommended",
    label: "Recommended",
  },
  {
    value: "created_desc",
    label: "Newest",
  },
  {
    value: "price_asc",
    label: "Price: Low to High",
  },
  {
    value: "price_desc",
    label: "Price: High to Low",
  },
  {
    value: "rating_desc",
    label: "Highest Rated",
  },
  {
    value: "best_selling",
    label: "Best Selling",
  },
];

function ShopPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState(
    searchParams.get("search") ||
      searchParams.get("q") ||
      ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [sort, setSort] = useState("recommended");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [rating, setRating] = useState("");
  const [availability, setAvailability] = useState("");
  const [material, setMaterial] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtersOpen, setFiltersOpen] = useState(false);

  /*
   * Load products
   */
  async function load() {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("q", search.trim());
      }

      if (category) {
        params.append("category", category);
      }

      if (minPrice) {
        params.append("minPrice", minPrice);
      }

      if (maxPrice) {
        params.append("maxPrice", maxPrice);
      }

      /*
       * We handle sorting on frontend.
       * This prevents the previous stale-state issue.
       */
      const response = await fetch(
        apiUrl(`/api/products?${params.toString()}`)
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load products"
        );
      }

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Shop products error:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  /*
   * Initial load
   */
  useEffect(() => {
    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * Best sellers
   *
   * Uses soldCount when available.
   *
   * Only the top 3 products are considered Best Sellers.
   */
  const bestSellerIds = useMemo(() => {
    const sortedBySales = [...products].sort(
      (a, b) =>
        Number(b.soldCount || 0) -
        Number(a.soldCount || 0)
    );

    return new Set(
      sortedBySales
        .filter(
          (product) =>
            Number(product.soldCount || 0) > 0
        )
        .slice(0, 3)
        .map((product) => product._id)
    );
  }, [products]);

  /*
   * Filter products
   */
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productRating = Number(
        product.averageRating || product.rating || 0
      );

      const stock = Number(product.stock || 0);

      const inStock = stock > 0;

      const matchesRating =
        !rating ||
        productRating >= Number(rating);

      const matchesAvailability =
        !availability ||
        (availability === "in_stock"
          ? inStock
          : !inStock);

      const matchesMaterial =
        !material ||
        product.material?.toLowerCase() ===
          material.toLowerCase();

      return (
        matchesRating &&
        matchesAvailability &&
        matchesMaterial
      );
    });
  }, [
    products,
    rating,
    availability,
    material,
  ]);

  /*
   * Sort products
   */
  const visibleProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sort) {
      case "price_asc":
        return sorted.sort(
          (a, b) =>
            Number(a.price || 0) -
            Number(b.price || 0)
        );

      case "price_desc":
        return sorted.sort(
          (a, b) =>
            Number(b.price || 0) -
            Number(a.price || 0)
        );

      case "rating_desc":
        return sorted.sort(
          (a, b) =>
            Number(
              b.averageRating || b.rating || 0
            ) -
            Number(
              a.averageRating || a.rating || 0
            )
        );

      case "best_selling":
        return sorted.sort(
          (a, b) =>
            Number(b.soldCount || 0) -
            Number(a.soldCount || 0)
        );

      case "created_desc":
        return sorted.sort((a, b) => {
          const dateA = new Date(
            a.createdAt || 0
          ).getTime();

          const dateB = new Date(
            b.createdAt || 0
          ).getTime();

          return dateB - dateA;
        });

      case "recommended":
      default:
        /*
         * Recommended:
         * Best Sellers first,
         * then higher rated products.
         */
        return sorted.sort((a, b) => {
          const bestA = bestSellerIds.has(a._id)
            ? 1
            : 0;

          const bestB = bestSellerIds.has(b._id)
            ? 1
            : 0;

          if (bestA !== bestB) {
            return bestB - bestA;
          }

          return (
            Number(
              b.averageRating || b.rating || 0
            ) -
            Number(
              a.averageRating || a.rating || 0
            )
          );
        });
    }
  }, [
    filteredProducts,
    sort,
    bestSellerIds,
  ]);

  /*
   * Clear all filters
   */
  function clearFilters() {
    setSearch("");
    setCategory("");
    setSort("recommended");
    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setAvailability("");
    setMaterial("");

    setFiltersOpen(false);

    /*
     * Reload all products
     */
    setTimeout(() => {
      load();
    }, 0);
  }

  /*
   * Apply filters
   */
  function applyFilters(event) {
    event?.preventDefault();

    setFiltersOpen(false);

    load();
  }

  /*
   * Sort change
   *
   * IMPORTANT:
   * We don't call load() here.
   * Sorting is handled instantly by useMemo.
   */
  function updateSort(event) {
    setSort(event.target.value);
  }

  /*
   * Product click
   */
  function handleProductClick(product) {
    if (!product?._id) return;

    navigate(`/product/${product._id}`);
  }

  /*
   * Render filter sidebar
   */
  function renderFilters() {
    return (
      <form
        className="shop-filters"
        onSubmit={applyFilters}
      >
        <div className="filter-heading">
          <span>Filters</span>

          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            aria-label="Close filters"
          >
            <i className="bx bx-x" />
          </button>
        </div>

        {/* Search */}
        <label className="filter-search">
          <span className="sr-only">
            Search products
          </span>

          <i className="bx bx-search" />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search products..."
          />
        </label>

        {/* Categories */}
        <fieldset>
          <legend>Categories</legend>

          <label>
            <input
              type="radio"
              name="category"
              checked={!category}
              onChange={() => setCategory("")}
            />

            All Products
          </label>

          {categories.map((item) => (
            <label key={item}>
              <input
                type="radio"
                name="category"
                checked={
                  category ===
                  item.toLowerCase()
                }
                onChange={() =>
                  setCategory(
                    item.toLowerCase()
                  )
                }
              />

              {item}
            </label>
          ))}
        </fieldset>

        {/* Price */}
        <fieldset>
          <legend>Price Range</legend>

          <div className="price-inputs">
            <label>
              <span>Min</span>

              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(event) =>
                  setMinPrice(
                    event.target.value
                  )
                }
                placeholder="₹0"
              />
            </label>

            <label>
              <span>Max</span>

              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(
                    event.target.value
                  )
                }
                placeholder="₹5000"
              />
            </label>
          </div>
        </fieldset>

        {/* Rating */}
        <fieldset>
          <legend>Rating</legend>

          {[5, 4, 3].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="rating"
                checked={
                  rating === String(value)
                }
                onChange={() =>
                  setRating(String(value))
                }
              />

              <span className="filter-stars">
                {"★".repeat(value)}

                <span>
                  {"★".repeat(5 - value)}
                </span>
              </span>

              & up
            </label>
          ))}
        </fieldset>

        {/* Availability */}
        <fieldset>
          <legend>Availability</legend>

          <label>
            <input
              type="radio"
              name="availability"
              checked={!availability}
              onChange={() =>
                setAvailability("")
              }
            />

            All Products
          </label>

          <label>
            <input
              type="radio"
              name="availability"
              checked={
                availability === "in_stock"
              }
              onChange={() =>
                setAvailability("in_stock")
              }
            />

            In Stock
          </label>

          <label>
            <input
              type="radio"
              name="availability"
              checked={
                availability ===
                "out_of_stock"
              }
              onChange={() =>
                setAvailability(
                  "out_of_stock"
                )
              }
            />

            Out of Stock
          </label>
        </fieldset>

        {/* Material */}
        <fieldset>
          <legend>Material</legend>

          {materials.map((item) => (
            <label key={item}>
              <input
                type="radio"
                name="material"
                checked={
                  material === item
                }
                onChange={() =>
                  setMaterial(item)
                }
              />

              {item}
            </label>
          ))}
        </fieldset>

        {/* Buttons */}
        <div className="filter-actions">
          <button
            type="submit"
            className="apply-button"
          >
            Apply Filters
          </button>

          <button
            type="button"
            className="clear-button"
            onClick={clearFilters}
          >
            Clear All
          </button>
        </div>
      </form>
    );
  }

  return (
    <>
      <Header />

      <main className="shop-page">

        {/* =========================
            SHOP INTRO
        ========================== */}
        <div className="shop-intro">

          <nav
            className="breadcrumb"
            aria-label="Breadcrumb"
          >
            <Link to="/">Home</Link>

            <span>/</span>

            <span>Shop</span>
          </nav>

          <p className="section-kicker">
            Handmade, thoughtfully chosen
          </p>

          <h1>
            Explore Our{" "}
            <span>Crafts</span>
          </h1>

          <p>
            Discover handmade pieces crafted
            with care, character and creativity.
          </p>
        </div>

        {/* =========================
            MOBILE CONTROLS
        ========================== */}
        <div className="mobile-shop-controls">

          <button
            type="button"
            onClick={() =>
              setFiltersOpen(true)
            }
          >
            <i className="bx bx-filter-alt" />

            Filter
          </button>

          <label>
            <span>Sort</span>

            <select
              value={sort}
              onChange={updateSort}
            >
              {sortOptions.map((option) => (
                <option
                  value={option.value}
                  key={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* =========================
            SHOP LAYOUT
        ========================== */}
        <div className="shop-layout">

          {/* SIDEBAR */}
          <aside
            className={`shop-sidebar ${
              filtersOpen ? "is-open" : ""
            }`}
          >
            <div
              className="mobile-filter-backdrop"
              onClick={() =>
                setFiltersOpen(false)
              }
            />

            {renderFilters()}
          </aside>

          {/* RESULTS */}
          <section
            className="shop-results"
            aria-live="polite"
          >

            {/* =========================
                RESULTS TOOLBAR
            ========================== */}
            <div className="results-toolbar">

              <span>
                {loading
                  ? "Finding your crafts..."
                  : `Showing ${
                      visibleProducts.length
                    } ${
                      visibleProducts.length === 1
                        ? "product"
                        : "products"
                    }`}
              </span>

              <label>
                Sort by{" "}

                <select
                  value={sort}
                  onChange={updateSort}
                >
                  {sortOptions.map(
                    (option) => (
                      <option
                        value={option.value}
                        key={option.value}
                      >
                        {option.label}
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>

            {/* =========================
                LOADING
            ========================== */}
            {loading && (
              <div className="shop-products">

                {[1, 2, 3, 4, 5, 6, 7, 8].map(
                  (item) => (
                    <div
                      className="product-skeleton"
                      key={item}
                    >
                      <div />

                      <span />

                      <span />

                      <b />
                    </div>
                  )
                )}
              </div>
            )}

            {/* =========================
                ERROR
            ========================== */}
            {!loading && error && (
              <div className="shop-message error-message">

                <i className="bx bx-error-circle" />

                <h2>
                  Something went wrong
                </h2>

                <p>{error}</p>

                <button
                  type="button"
                  onClick={load}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* =========================
                NO PRODUCTS
            ========================== */}
            {!loading &&
              !error &&
              !visibleProducts.length && (
                <div className="shop-message">

                  <i className="bx bx-search-alt" />

                  <h2>
                    No crafts found
                  </h2>

                  <p>
                    Try changing your filters
                    or search term.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              )}

            {/* =========================
                PRODUCTS
            ========================== */}
            {!loading &&
              !error &&
              visibleProducts.length > 0 && (
                <div className="shop-products">

                  {visibleProducts.map(
                    (product) => {

                      const isBestSeller =
                        bestSellerIds.has(
                          product._id
                        );

                      const productRating =
                        Number(
                          product.averageRating ||
                            product.rating ||
                            0
                        );

                      const reviewCount =
                        Number(
                          product.reviewCount ||
                            product.reviewsCount ||
                            product.reviews?.length ||
                            0
                        );

                      const stock =
                        Number(
                          product.stock || 0
                        );

                      return (
                        <div
                          className="shop-product-item"
                          key={product._id}
                          onClick={() =>
                            handleProductClick(
                              product
                            )
                          }
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (
                              event.key ===
                                "Enter" ||
                              event.key ===
                                " "
                            ) {
                              handleProductClick(
                                product
                              );
                            }
                          }}
                        >

                          <ProductCard
                            product={product}

                            img={imageUrl(
                              product.imageUrl ||
                                product.images?.[0]
                            )}

                            title={
                              product.name
                            }

                            price={
                              product.price
                            }

                            rating={
                              productRating
                            }

                            reviewCount={
                              reviewCount
                            }

                            tag={
                              product.tag ||
                              (isBestSeller
                                ? "Best Seller"
                                : null)
                            }

                            stock={stock}
                          />
                        </div>
                      );
                    }
                  )}
                </div>
              )}

            {/* =========================
                PAGINATION
            ========================== */}
            {!loading &&
              !error &&
              visibleProducts.length > 0 && (
                <nav
                  className="pagination"
                  aria-label="Product pagination"
                >
                  <button
                    type="button"
                    disabled
                  >
                    <i className="bx bx-chevron-left" />

                    Previous
                  </button>

                  <button
                    type="button"
                    className="active"
                  >
                    1
                  </button>

                  <button
                    type="button"
                    disabled
                  >
                    Next

                    <i className="bx bx-chevron-right" />
                  </button>
                </nav>
              )}

          </section>
        </div>
      </main>
    </>
  );
}

export default ShopPage;