const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const qs = require("qs");
const { LOCAL_REDIRECT_URI } = require("./constant");
const Stripe = require('stripe')
require("dotenv").config()

const app = express();
app.use(cors());
app.use(express.json());
// ✅ Health check


app.get("/api/auth/authorize", async (req, res) => {
    return res.redirect(302, LOCAL_REDIRECT_URI + "?code=" + req.query.code);
});

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const amount = 1099;
  console.log(amount,'amountmmmmmmmmmmmmmmmmm')
  const stripe = new Stripe(process.env.EXPO_PUBLIC_SECRET_KEY);
  console.log(stripe,'stripeeeeeeeeeeeeeeeeeeeeee')
  const customer = await stripe.customers.create();
  console.log(customer,'ffffffffffffffffffffffffff')
  const customerSession = await stripe.customerSessions.create({
    customer: customer.id,
    components: {
      mobile_payment_element: {
        enabled: true,
        features: {
          payment_method_save: 'enabled',
          payment_method_redisplay: 'enabled',
          payment_method_remove: 'enabled'
        }
      },
    },
  });
  console.log(customerSession,'ccccccccccccccccccccccccccccccccc')
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'gbp',
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });
  console.log(paymentIntent,'ppppppppppppppppppppppppppppppp')
  res.send("Test >>>>>>");
  // res.json({
  //   paymentIntent: paymentIntent.client_secret,
  //   customerSessionClientSecret: customerSession.client_secret,
  //   customer: customer.id,
  //   publishableKey: process.env.publishableKey,
  // });
});

app.get("/", async (req, res) => {
  res.send("Test >>>>>>");
});



// 🔴 PUT YOUR GOOGLE WEB CLIENT ID HERE

// const options = {
//   key: fs.readFileSync("localhost+1-key.pem"),
//   cert: fs.readFileSync("localhost+1.pem"),
// };

// https.createServer(options, app).listen(3000, () => {
//   console.log("🔐 HTTPS backend running https://localhost:3000");
// });
//module.exports = app;
app.listen(3000, () => {
  try {
    console.log("🔓 HTTP backend running http://localhost:3000");
    console.log(`Using Redirect URI: ${process.env.EXPO_PUBLIC_PUBLISHABLE_KEY}`);
  } catch (error) {
    console.error("Error starting server:", error);
  }
});
