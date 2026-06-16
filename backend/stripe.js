router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  console.log("AMOUNT RECEIVED:", amount);
  console.log("KEY EXISTS:", !!process.env.STRIPE_SECRET_KEY);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    console.log("PAYMENT INTENT CREATED");

    res.json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (err) {
    console.error("FULL STRIPE ERROR:");
    console.error(err);

    res.status(500).json({
      message: err.message,
      type: err.type,
      code: err.code
    });
  }
});