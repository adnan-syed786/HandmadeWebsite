const express = require("express");
const fetchuser = require("../Middleware/fetchuser");
const isAdmin = require("../Middleware/isAdmin");
const Order = require("../Models/Order");
const Product = require("../Models/Product");
const User = require("../Models/User");

const router = express.Router();

// GET /api/admin/stats - basic dashboard stats
router.get("/stats", fetchuser, isAdmin, async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, totalSalesAgg] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;
    res.json({ totalUsers, totalProducts, totalOrders, totalSales });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/admin/orders - list all orders
router.get("/orders", fetchuser, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PATCH /api/admin/orders/:id/status - update status
router.patch("/orders/:id/status", fetchuser, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Order not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/admin/users - list users
router.get("/users", fetchuser, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
