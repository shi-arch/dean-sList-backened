const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ✅ OAuth redirect (env-based)
app.get("/api/auth/authorize", (req, res) => {
  const redirectUri = process.env.REDIRECT_URI;
  return res.redirect(302, `${redirectUri}?code=${req.query.code}`);
});

// ✅ Stripe Payment Sheet
app.post("/payment-sheet", async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log("Stripe initialized");
    const amount = 1099;

    const customer = await stripe.customers.create();

    const customerSession = await stripe.customerSessions.create({
      customer: customer.id,
      components: {
        mobile_payment_element: {
          enabled: true,
          features: {
            payment_method_save: "enabled",
            payment_method_redisplay: "enabled",
            payment_method_remove: "enabled",
          },
        },
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "gbp",
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      customerSessionClientSecret: customerSession.client_secret,
      customer: customer.id,
      publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Render-required PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
