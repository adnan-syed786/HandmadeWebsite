const express = require("express");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../Middleware/fetchuser");
const isAdmin = require("../Middleware/isAdmin");
const Product = require("../Models/Product");
const {
  uploadProductImages,
  storedImagePath,
  removeStoredImage,
} = require("../Middleware/productUpload");

const router = express.Router();

// GET /api/products - list with search/filter/sort
router.get("/", async (req, res) => {
  try {
    const { q, category, sort, minPrice, maxPrice, limit } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: "i" };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Product.find(filter);

    if (sort === "price_asc") query = query.sort({ price: 1 });
    else if (sort === "price_desc") query = query.sort({ price: -1 });
    else if (sort === "rating_desc") query = query.sort({ averageRating: -1 });

    if (limit) {
      const lim = parseInt(limit, 10);
      if (!isNaN(lim) && lim > 0) query = query.limit(lim);
    }
    const products = await query.exec();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/products/:id - single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "reviews.user",
      "name"
    );
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/products - create (admin)
router.post(
  "/",
  fetchuser,
  isAdmin,
  uploadProductImages,
  [
    body("name").isLength({ min: 2 }),
    body("description").isLength({ min: 5 }),
    body("price").isFloat({ gt: 0 }),
    body("category").isString(),
    body("stock").isInt({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      if (!req.files?.length) {
        return res.status(400).json({ error: "Please select at least one image." });
      }
      const images = req.files.map(storedImagePath);
      const product = await Product.create({
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        category: req.body.category,
        stock: Number(req.body.stock),
        imageUrl: images[0],
        images,
      });
      res.status(201).json(product);
    } catch (err) {
      req.files?.forEach((file) => removeStoredImage(storedImagePath(file)));
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// PUT /api/products/:id - update (admin)
router.put("/:id", fetchuser, isAdmin, uploadProductImages, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.files?.forEach((file) => removeStoredImage(storedImagePath(file)));
      return res.status(404).json({ error: "Product not found" });
    }

    const isMultipart = req.is("multipart/form-data");
    const keepImages = isMultipart
      ? JSON.parse(req.body.keepImages || "[]")
      : product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : [];
    const newImages = (req.files || []).map(storedImagePath);
    const images = [...keepImages, ...newImages];
    if (images.length > 5) {
      newImages.forEach(removeStoredImage);
      return res.status(400).json({ error: "You can keep or upload a maximum of 5 images." });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      stock: Number(req.body.stock),
      imageUrl: images[0] || "",
      images,
    }, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    if (isMultipart) {
      const removedImages = (product.images || []).filter((image) => !keepImages.includes(image));
      removedImages.forEach(removeStoredImage);
    }
    res.json(updated);
  } catch (err) {
    req.files?.forEach((file) => removeStoredImage(storedImagePath(file)));
    console.error(err);
    if (err instanceof SyntaxError) return res.status(400).json({ error: "Invalid image selection." });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /api/products/:id - delete (admin)
router.delete("/:id", fetchuser, isAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/products/:id/reviews - add review (authenticated)
router.post(
  "/:id/reviews",
  fetchuser,
  [body("rating").isInt({ min: 1, max: 5 }), body("comment").optional().isString()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ error: "Product not found" });

      // prevent duplicate review by same user
      const already = product.reviews.find(
        (r) => r.user.toString() === req.user.id
      );
      if (already) return res.status(400).json({ error: "Already reviewed" });

      product.reviews.push({ user: req.user.id, rating: req.body.rating, comment: req.body.comment || "" });
      product.recalculateRating();
      await product.save();
      const populated = await product.populate("reviews.user", "name");
      res.status(201).json(populated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
