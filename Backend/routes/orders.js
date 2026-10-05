const express = require("express");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../Middleware/fetchuser");
const Order = require("../Models/Order");
const Product = require("../Models/Product");

const router = express.Router();

// POST /api/orders - create order after successful payment
router.post(
  "/",
  fetchuser,
  [
    body("products").isArray({ min: 1 }),
    body("totalAmount").isFloat({ gt: 0 }),
    body("shippingAddress").isObject(),
    body("paymentMethod").optional().isIn(["card", "cod"]),
    body("paymentId").optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { products, totalAmount, shippingAddress, paymentMethod, paymentId } = req.body;

    try {
      // Optional: validate stock
      for (const item of products) {
        const prod = await Product.findById(item.product);
        if (!prod) return res.status(400).json({ error: "Invalid product in cart" });
        if (prod.stock < item.quantity)
          return res.status(400).json({ error: `Insufficient stock for ${prod.name}` });
      }

      const order = await Order.create({
        user: req.user.id,
        products,
        totalAmount,
        shippingAddress,
        paymentMethod: paymentMethod || "card",
        paymentId: paymentId || "",
      });

      // decrement stock
      await Promise.all(
        products.map(async (item) => {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        })
      );

      res.status(201).json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// GET /api/orders/my - current user's order history
router.get("/my", fetchuser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("products.product", "name price imageUrl")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
