const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    imageUrl: { type: String, default: "" },
    images: { type: [String], default: [] },
    reviews: [ReviewSchema],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.methods.recalculateRating = function () {
  if (!this.reviews || this.reviews.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
  }
};

module.exports = mongoose.model("Product", ProductSchema);
