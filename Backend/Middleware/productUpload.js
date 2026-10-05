const fs = require("fs");
const path = require("path");
const multer = require("multer");
const crypto = require("crypto");

const uploadDirectory = path.join(__dirname, "..", "uploads", "products");
fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `product-${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`);
  },
});

const fileFilter = (_req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();
  if (!allowedMimeTypes.has(file.mimetype) || !allowedExtensions.has(extension)) {
    return callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only JPG, PNG and WEBP images are supported."));
  }
  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
});

function uploadProductImages(req, res, next) {
  upload.array("images", 5)(req, res, (error) => {
    if (!error) return next();

    if (req.files?.length) {
      req.files.forEach((file) => fs.unlink(file.path, () => {}));
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "Each image must be smaller than 5MB." });
      }
      if (error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ error: error.message || "You can upload a maximum of 5 images." });
      }
    }

    return res.status(400).json({ error: "Unable to upload product images." });
  });
}

function storedImagePath(file) {
  return `/uploads/products/${file.filename}`;
}

function removeStoredImage(imagePath) {
  if (!imagePath || !imagePath.startsWith("/uploads/products/")) return;
  const filename = path.basename(imagePath);
  fs.unlink(path.join(uploadDirectory, filename), () => {});
}

module.exports = { uploadProductImages, storedImagePath, removeStoredImage };
