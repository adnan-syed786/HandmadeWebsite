import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { apiUrl } from "../../config/api";
import "./AdminPage.css";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: 0,
};

export default function AddProduct() {
  const { token } = useAuth();
  const inputRef = useRef(null);
  const previewUrls = useRef(new Set());
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(
    () => () => {
      previewUrls.current.forEach((preview) => URL.revokeObjectURL(preview));
    },
    [],
  );

  const update = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  function addImages(fileList) {
    setError("");
    const selected = Array.from(fileList || []);
    const valid = [];
    const duplicateKeys = new Set(
      images.map(
        ({ file }) => `${file.name}-${file.size}-${file.lastModified}`,
      ),
    );

    for (const file of selected) {
      const key = `${file.name}-${file.size}-${file.lastModified}`;
      if (!acceptedTypes.has(file.type)) {
        setError("Only JPG, PNG and WEBP images are supported.");
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("Each image must be smaller than 5MB.");
        continue;
      }
      if (duplicateKeys.has(key)) continue;
      duplicateKeys.add(key);
      valid.push(file);
    }

    const available = MAX_IMAGES - images.length;
    if (valid.length > available)
      setError("You can upload a maximum of 5 images.");
    const nextImages = valid.slice(0, Math.max(available, 0)).map((file) => {
      const preview = URL.createObjectURL(file);
      previewUrls.current.add(preview);
      return { file, preview };
    });
    setImages((current) => [...current, ...nextImages]);
  }

  function removeImage(index) {
    setImages((current) => {
      const removed = current[index];
      if (removed?.preview) {
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
      [reordered[index], reordered[target]] = [
        reordered[target],
        reordered[index],
      ];
      return reordered;
    });
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    addImages(event.dataTransfer.files);
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!images.length) {
      setError("Please select at least one image.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("price", form.price);
      formData.append("category", form.category.trim());
      formData.append("stock", form.stock);
      images.forEach(({ file }) => formData.append("images", file));

      const res = await fetch(apiUrl("/api/products"), {
        method: "POST",
        headers: { authToken: token },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add product");
      setSuccess("Product created successfully.");
      setForm(initialForm);
      images.forEach(({ preview }) => URL.revokeObjectURL(preview));
      previewUrls.current.clear();
      setImages([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page-shell">
      <Header />
      <main className="admin-page-container">
        <div className="admin-page-header">
          <div>
            <span className="admin-kicker">Catalogue</span>
            <h1>Add product</h1>
            <p>Create a polished listing for your handmade collection.</p>
          </div>
          <Link className="admin-secondary-btn" to="/admin/products">
            ← Back to products
          </Link>
        </div>
        {error && (
          <div className="admin-alert-box" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="admin-success-box" role="status">
            {success}
          </div>
        )}
        <form onSubmit={submit} className="admin-form-layout">
          <section className="admin-card admin-form-card">
            <span className="admin-kicker">Product details</span>
            <h2>Tell the story</h2>
            <p>
              Use clear product information so customers understand what makes
              this handmade piece special.
            </p>
            <div className="admin-form-grid">
              <div className="admin-field full">
                <label htmlFor="product-name">Product name</label>
                <input
                  id="product-name"
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="e.g. Hand-painted Clay Vase"
                />
              </div>
              <div className="admin-field full">
                <label htmlFor="product-description">Description</label>
                <textarea
                  id="product-description"
                  required
                  value={form.description}
                  onChange={update("description")}
                  placeholder="Describe materials, craftsmanship and details..."
                />
              </div>
              <div className="admin-field">
                <label htmlFor="product-category">Category</label>
                <input
                  id="product-category"
                  required
                  value={form.category}
                  onChange={update("category")}
                  placeholder="Pottery"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="product-price">Price (₹)</label>
                <input
                  id="product-price"
                  required
                  min="0.01"
                  step="0.01"
                  type="number"
                  value={form.price}
                  onChange={update("price")}
                  placeholder="1299"
                />
              </div>
              <div className="admin-field">
                <label htmlFor="product-stock">Stock</label>
                <input
                  id="product-stock"
                  min="0"
                  type="number"
                  value={form.stock}
                  onChange={update("stock")}
                />
              </div>
            </div>
            <div className="admin-image-uploader">
              <div className="admin-upload-heading">
                <div>
                  <span className="admin-kicker">Product gallery</span>
                  <h3>Product images</h3>
                </div>
                <strong>
                  {images.length} / {MAX_IMAGES}
                </strong>
              </div>
              <input
                ref={inputRef}
                className="admin-file-input"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                multiple
                onChange={(event) => {
                  addImages(event.target.files);
                  event.target.value = "";
                }}
              />
              <button
                type="button"
                className={`admin-dropzone ${dragging ? "is-dragging" : ""}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <span className="admin-upload-icon">＋</span>
                <strong>Upload product images</strong>
                <small>Drop files here or click to browse</small>
                <em>JPG, PNG or WEBP · Maximum 5MB each</em>
              </button>
              {images.length > 0 && (
                <div className="admin-image-grid">
                  {images.map((image, index) => (
                    <article
                      className={`admin-image-tile ${index === 0 ? "is-main" : ""}`}
                      key={`${image.file.name}-${image.file.lastModified}`}
                    >
                      <img
                        src={image.preview}
                        alt={`Product view ${index + 1}`}
                      />
                      <div className="admin-image-tile-footer">
                        <span>
                          {index === 0 ? "Main image" : `View ${index + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="admin-image-tile-actions">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveImage(index, -1)}
                          aria-label="Move image left"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          disabled={index === images.length - 1}
                          onClick={() => moveImage(index, 1)}
                          aria-label="Move image right"
                        >
                          →
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              <small className="admin-upload-note">
                The first image is used as the main product image. Reorder
                images with the arrows.
              </small>
            </div>
            <div className="admin-form-actions">
              <Link className="admin-secondary-btn" to="/admin/products">
                Cancel
              </Link>
              <button
                className="admin-primary-btn"
                type="submit"
                disabled={saving}
              >
                {saving ? "Creating..." : "Create product ↗"}
              </button>
            </div>
          </section>
          <aside className="admin-card admin-preview">
            <span className="admin-kicker">Preview</span>
            <h3>{form.name || "Your product"}</h3>
            {images[0] ? (
              <img
                className="admin-preview-image"
                src={images[0].preview}
                alt="Main product preview"
              />
            ) : (
              <div className="admin-preview-empty">
                <span>＋</span>
                <span>Upload images to preview your product.</span>
              </div>
            )}
            <p>
              {form.category || "Category"} ·{" "}
              {form.price
                ? `₹${Number(form.price).toLocaleString("en-IN")}`
                : "Price"}
            </p>
          </aside>
        </form>
      </main>
      <Footer />
    </div>
  );
}
