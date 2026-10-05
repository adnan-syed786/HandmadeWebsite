const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: Object, required: true },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "cod"],
      default: "card",
    },
    paymentId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
