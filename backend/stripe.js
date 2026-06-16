const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

// تحقق إن المفتاح موجود
console.log("STRIPE KEY EXISTS:", !!process.env.STRIPE_SECRET_KEY);

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    console.log("========== PAYMENT REQUEST ==========");
    console.log("BODY:", req.body);
    console.log("AMOUNT:", amount);
    console.log("TYPE:", typeof amount);
    console.log("KEY EXISTS:", !!process.env.STRIPE_SECRET_KEY);

    if (!amount) {
      return res.status(400).json({
        error: "Amount is required",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log("PAYMENT INTENT CREATED");
    console.log("ID:", paymentIntent.id);

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    console.error("========== STRIPE ERROR ==========");
    console.error("MESSAGE:", err.message);
    console.error("TYPE:", err.type);
    console.error("CODE:", err.code);
    console.error(err);

    res.status(500).json({
      error: err.message,
      type: err.type,
      code: err.code,
    });
  }
});

module.exports = router;