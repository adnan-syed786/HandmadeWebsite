import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { apiUrl } from "../../config/api";
import "./AdminPage.css";

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
function statusTone(status) {
  const s = status?.toLowerCase();
  if (s === "delivered") return "success";
  if (s === "pending" || s === "processing") return "warning";
  if (s === "cancelled") return "danger";
  return "neutral";
}

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [updateMessage, setUpdateMessage] = useState("");
  async function load() {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/admin/orders"), {
        headers: { authToken: token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load orders");
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [token]);
  async function updateStatus(id, status) {
    try {
      const res = await fetch(apiUrl(`/api/admin/orders/${id}/status`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json", authToken: token },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }
      setUpdateMessage("Order status updated successfully.");
      setTimeout(() => setUpdateMessage(""), 2500);
      load();
    } catch (err) {
      setError(err.message);
    }
  }
  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const matchesStatus = filter === "All" || o.status === filter;
        const text =
          `${o._id} ${o.user?.name || ""} ${o.user?.email || ""}`.toLowerCase();
        return matchesStatus && text.includes(query.toLowerCase());
      }),
    [orders, filter, query],
  );
  return (
    <div className="admin-page-shell">
      <Header />
      <main className="admin-page-container">
        <div className="admin-page-header">
          <div>
            <span className="admin-kicker">Fulfilment</span>
            <h1>Orders</h1>
            <p>Review purchases and keep every handmade order moving.</p>
          </div>
        </div>
        {updateMessage && (
          <div className="admin-success-box">{updateMessage}</div>
        )}
        {error && <div className="admin-alert-box">{error}</div>}
        <div className="admin-toolbar">
          <input
            className="admin-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order ID or customer..."
          />
          <select
            className="admin-status-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <section className="admin-card admin-loading-block">
            Loading orders...
          </section>
        ) : filtered.length === 0 ? (
          <section className="admin-card admin-empty">No orders found.</section>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {filtered.map((o) => (
              <article className="admin-card admin-order" key={o._id}>
                <div className="admin-order-head">
                  <div>
                    <div className="admin-order-id">
                      Order #{String(o._id).slice(-8)}{" "}
                      <span className={`admin-chip ${statusTone(o.status)}`}>
                        {o.status || "Pending"}
                      </span>
                    </div>
                    <div className="admin-order-date">
                      Placed{" "}
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString("en-IN")
                        : "—"}
                    </div>
                  </div>
                  <div className="admin-order-tools">
                    <select
                      className="admin-status-select"
                      value={o.status || "Pending"}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                    >
                      {statuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      className="admin-secondary-btn"
                      onClick={() =>
                        setExpanded(expanded === o._id ? null : o._id)
                      }
                    >
                      {expanded === o._id ? "Hide details" : "View details"}
                    </button>
                  </div>
                </div>
                {expanded === o._id && (
                  <div className="admin-order-details">
                    <div className="admin-detail-grid">
                      <div className="admin-detail-box">
                        <h4>Customer</h4>
                        <div>
                          <strong>{o.user?.name || "N/A"}</strong>
                          <br />
                          {o.user?.email || "N/A"}
                          <br />
                          {o.shippingAddress?.phoneNumber || "N/A"}
                        </div>
                      </div>
                      <div className="admin-detail-box">
                        <h4>Shipping address</h4>
                        <div>
                          <strong>{o.shippingAddress?.name || "N/A"}</strong>
                          <br />
                          {o.shippingAddress?.address || "N/A"}
                          <br />
                          {o.shippingAddress?.city || ""}
                          {o.shippingAddress?.city ? ", " : ""}
                          {o.shippingAddress?.zipCode || ""}
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="admin-kicker">Products ordered</span>
                      {(o.products || []).map((p, i) => (
                        <div className="admin-order-item" key={i}>
                          <div className="admin-product-cell">
                            <img
                              className="admin-product-thumb"
                              src={
                                p.product?.imageUrl || "/Images/placeholder.png"
                              }
                              alt=""
                            />
                            <div>
                              <div className="admin-product-name">
                                {p.product?.name || "Product"}
                              </div>
                              <div className="admin-product-meta">
                                Quantity · {p.quantity}
                              </div>
                            </div>
                          </div>
                          <div>
                            <strong>
                              ₹
                              {Number(p.price || 0).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                              })}
                            </strong>
                            <div className="admin-product-meta">
                              Item total · ₹
                              {(
                                Number(p.price || 0) * Number(p.quantity || 0)
                              ).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="admin-order-total">
                      ₹
                      {Number(o.totalAmount || 0).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
