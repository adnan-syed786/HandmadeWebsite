import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { apiUrl } from "../../config/api";
import "./AdminPage.css";

export default function Users() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/admin/users"), {
          headers: { authToken: token },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch users");
        if (active) setUsers(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);
  const filtered = useMemo(
    () =>
      users.filter((u) =>
        `${u.name} ${u.email} ${u.city}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [users, query],
  );
  return (
    <div className="admin-page-shell">
      <Header />
      <main className="admin-page-container">
        <div className="admin-page-header">
          <div>
            <span className="admin-kicker">Customers</span>
            <h1>User management</h1>
            <p>{users.length} customer accounts connected to your store.</p>
          </div>
        </div>
        {error && <div className="admin-alert-box">{error}</div>}
        <div className="admin-toolbar">
          <input
            className="admin-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email or city..."
          />
          <span className="admin-kicker">{filtered.length} shown</span>
        </div>
        <section className="admin-card admin-table-wrap">
          {loading ? (
            <div className="admin-loading-block">Loading customers...</div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">No customers found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="admin-user-cell">
                        <span className="admin-user-avatar">
                          {(u.name || "?").charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <div className="admin-product-name">
                            {u.name || "Unnamed"}
                          </div>
                          <div className="admin-product-meta">
                            {u.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{u.phoneNumber || "—"}</td>
                    <td>{u.city || "—"}</td>
                    <td>
                      <span
                        className={`admin-chip ${u.role === "admin" ? "warning" : "neutral"}`}
                      >
                        {u.role || "user"}
                      </span>
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
