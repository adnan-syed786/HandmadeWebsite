import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { apiUrl } from "../../config/api";
import { imageUrl } from "../../config/image";
import "./AdminPage.css";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export default function EditProduct() {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const previewUrls = useRef(new Set());
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", stock: "" });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => () => {
    previewUrls.current.forEach((preview) => URL.revokeObjectURL(preview));
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(apiUrl(`/api/products/${id}`));
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load product");
        if (!active) return;
        const existing = Array.isArray(data.images) && data.images.length ? data.images : data.imageUrl ? [data.imageUrl] : [];
        setForm({ name: data.name || "", description: data.description || "", price: data.price ?? "", category: data.category || "", stock: data.stock ?? "" });
        setImages(existing.slice(0, MAX_IMAGES).map((url) => ({ url, preview: imageUrl(url), file: null })));
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  function addImages(fileList) {
    setError("");
    const selected = Array.from(fileList || []);
    const currentKeys = new Set(images.filter(({ file }) => file).map(({ file }) => `${file.name}-${file.size}-${file.lastModified}`));
    const valid = [];
    for (const file of selected) {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      if (!acceptedTypes.has(file.type)) { setError("Only JPG, PNG and WEBP images are supported."); continue; }
      if (file.size > MAX_FILE_SIZE) { setError("Each image must be smaller than 5MB."); continue; }
      if (currentKeys.has(key)) continue;
      currentKeys.add(key);
      valid.push(file);
    }
    const available = MAX_IMAGES - images.length;
    if (valid.length > available) setError("You can keep or upload a maximum of 5 images.");
    const nextImages = valid.slice(0, Math.max(available, 0)).map((file) => {
      const preview = URL.createObjectURL(file);
      previewUrls.current.add(preview);
      return { file, preview, url: "" };
    });
    setImages((current) => [...current, ...nextImages]);
  }

  function removeImage(index) {
    setImages((current) => {
      const removed = current[index];
      if (removed?.file && removed.preview) {
        URL.revokeObjectURL(removed.preview);
        previewUrls.current.delete(removed.preview);
      }
      return current.filter((_image, imageIndex) => imageIndex !== index);
    });
  }

  function moveImage(index, direction) {
    setImages((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const reordered = [...current];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      return reordered;
    });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("keepImages", JSON.stringify(images.filter(({ file }) => !file).map(({ url }) => url)));
      images.filter(({ file }) => file).forEach(({ file }) => formData.append("images", file));

      const res = await fetch(apiUrl(`/api/products/${id}`), { method: "PUT", headers: { authToken: token }, body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setSuccess("Product updated successfully.");
      setTimeout(() => navigate("/admin/products"), 700);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="admin-page-shell"><Header /><main className="admin-page-container"><div className="admin-loading-block">Loading product...</div></main><Footer /></div>;

  return (
    <div className="admin-page-shell">
      <Header />
      <main className="admin-page-container">
        <div className="admin-page-header"><div><span className="admin-kicker">Catalogue</span><h1>Edit product</h1><p>Refine the details, imagery and inventory for this listing.</p></div><Link className="admin-secondary-btn" to="/admin/products">← Back to products</Link></div>
        {error && <div className="admin-alert-box" role="alert">{error}</div>}
        {success && <div className="admin-success-box" role="status">{success}</div>}
        <form onSubmit={submit} className="admin-form-layout">
          <section className="admin-card admin-form-card">
            <span className="admin-kicker">Product details</span><h2>Update listing</h2><p>Keep the information accurate so your catalogue stays easy to manage.</p>
            <div className="admin-form-grid">
              <div className="admin-field full"><label htmlFor="edit-product-name">Product name</label><input id="edit-product-name" required value={form.name} onChange={update("name")} /></div>
              <div className="admin-field full"><label htmlFor="edit-product-description">Description</label><textarea id="edit-product-description" required value={form.description} onChange={update("description")} /></div>
              <div className="admin-field"><label htmlFor="edit-product-category">Category</label><input id="edit-product-category" required value={form.category} onChange={update("category")} /></div>
              <div className="admin-field"><label htmlFor="edit-product-price">Price (₹)</label><input id="edit-product-price" required min="0.01" step="0.01" type="number" value={form.price} onChange={update("price")} /></div>
              <div className="admin-field"><label htmlFor="edit-product-stock">Stock</label><input id="edit-product-stock" min="0" type="number" value={form.stock} onChange={update("stock")} /></div>
            </div>
            <div className="admin-image-uploader">
              <div className="admin-upload-heading"><div><span className="admin-kicker">Product gallery</span><h3>Product images</h3></div><strong>{images.length} / {MAX_IMAGES}</strong></div>
              <input ref={inputRef} className="admin-file-input" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" multiple onChange={(event) => { addImages(event.target.files); event.target.value = ""; }} />
              <button type="button" className={`admin-dropzone ${dragging ? "is-dragging" : ""}`} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); addImages(event.dataTransfer.files); }}><span className="admin-upload-icon">＋</span><strong>Add more product images</strong><small>Drop files here or click to browse</small><em>JPG, PNG or WEBP · Maximum 5MB each</em></button>
              {images.length > 0 && <div className="admin-image-grid">{images.map((image, index) => <article className={`admin-image-tile ${index === 0 ? "is-main" : ""}`} key={image.file ? `${image.file.name}-${image.file.lastModified}` : image.url}><img src={image.preview} alt={`Product view ${index + 1}`} /><div className="admin-image-tile-footer"><span>{index === 0 ? "Main image" : `View ${index + 1}`}</span><button type="button" onClick={() => removeImage(index)}>Remove</button></div><div className="admin-image-tile-actions"><button type="button" disabled={index === 0} onClick={() => moveImage(index, -1)} aria-label="Move image left">←</button><button type="button" disabled={index === images.length - 1} onClick={() => moveImage(index, 1)} aria-label="Move image right">→</button></div></article>)}</div>}
              <small className="admin-upload-note">Remove an image only when you want it deleted. The first image is the main product image.</small>
            </div>
            <div className="admin-form-actions"><Link className="admin-secondary-btn" to="/admin/products">Cancel</Link><button className="admin-primary-btn" type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes ↗"}</button></div>
          </section>
          <aside className="admin-card admin-preview"><span className="admin-kicker">Preview</span><h3>{form.name || "Product"}</h3>{images[0] ? <img className="admin-preview-image" src={images[0].preview} alt={form.name} /> : <div className="admin-preview-empty"><span>＋</span><span>No main image available.</span></div>}<p>{form.category || "Category"} · {form.stock || 0} in stock</p></aside>
        </form>
      </main>
      <Footer />
    </div>
  );
}
