const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const { LOCAL_REDIRECT_URI } = require("./constant");
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
  return res.redirect(302, `${LOCAL_REDIRECT_URI}?code=${req.query.code}`);
});

// ✅ Stripe Payment Sheet
app.post("/payment-sheet", async (req, res) => {
  try {
    const stripe = new Stripe("sk_test_51SuZh6P8Eeo4sP2u8a5iFaK1k0NKbnjUBIejCxXvbOrffPyEtd1sXroSfN35DL5O0lPGiD1WjbPsKNDB9GtYj30800kStqWD13");
    console.log("Stripe initialized");
    const amount = req.body.amount;

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
