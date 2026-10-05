import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { apiUrl } from "../../config/api";
import { imageUrl } from "../../config/image";
import "./AdminPage.css";

export default function ProductList() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  async function load() {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/products"));
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load products");
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function remove(id) {
    if (!window.confirm("Delete this product? This action cannot be undone."))
      return;
    try {
      const res = await fetch(apiUrl(`/api/products/${id}`), {
        method: "DELETE",
        headers: { authToken: token },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete product");
      }
      load();
    } catch (err) {
      setError(err.message);
    }
  }
  const filtered = useMemo(
    () =>
      products.filter((p) =>
        `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [products, query],
  );
  return (
    <div className="admin-page-shell">
      <Header />
      <main className="admin-page-container">
        <div className="admin-page-header">
          <div>
            <span className="admin-kicker">Catalogue</span>
            <h1>Products</h1>
            <p>{products.length} products currently in your store.</p>
          </div>
          <Link to="/admin/products/new" className="admin-primary-btn">
            + Add product
          </Link>
        </div>
        {error && <div className="admin-alert-box">{error}</div>}
        <div className="admin-toolbar">
          <input
            className="admin-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products or categories..."
          />
          <span className="admin-kicker">{filtered.length} shown</span>
        </div>
        <section className="admin-card admin-table-wrap">
          {loading ? (
            <div className="admin-loading-block">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">No products match your search.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="admin-product-cell">
                        <img
                          className="admin-product-thumb"
                          src={imageUrl(p.imageUrl || p.images?.[0])}
                          alt=""
                        />
                        <div>
                          <div className="admin-product-name">{p.name}</div>
                          <div className="admin-product-meta">
                            ID · {String(p._id).slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{p.category || "—"}</td>
                    <td>
                      ₹
                      {Number(p.price || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      <span
                        className={`admin-chip ${Number(p.stock) <= 5 ? "warning" : "success"}`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <Link
                          className="admin-secondary-btn"
                          to={`/admin/products/${p._id}`}
                        >
                          Edit
                        </Link>
                        <button
                          className="admin-danger-btn"
                          onClick={() => remove(p._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
