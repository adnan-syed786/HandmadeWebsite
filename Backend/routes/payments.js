const express = require("express");
const Stripe = require("stripe");
const fetchuser = require("../Middleware/fetchuser");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET || "");

// POST /api/payments/create-payment-intent
router.post("/create-payment-intent", fetchuser, async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body; // amount in cents
    if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      metadata: { userId: req.user.id },
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Stripe error: " + err.message });
  }
});

module.exports = router;
