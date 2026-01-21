const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const qs = require("qs");
require("dotenv").config()

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Health check
const PORT = process.env.PORT;
async function verifyGoogleIdToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: '317999867006-c1chqsld8au82q2ai256mtj63ugav98p.apps.googleusercontent.com', // MUST match
  });
  const payload = ticket.getPayload();
  console.log(payload, 'pppppppppppp')
  return {
    googleId: payload.sub,           // unique Google user ID
    email: payload.email,
    emailVerified: payload.email_verified,
    name: payload.name,
    picture: payload.picture,
    givenName: payload.given_name,
    familyName: payload.family_name,
  };
}
app.get("/api/auth/authorize", async (req, res) => {
  const { code } = req.query;
  // const response = await fetch("https://oauth2.googleapis.com/token", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //   body: new URLSearchParams({
  //     client_id: process.env.GOOGLE_CLIENT_ID,
  //     client_secret: process.env.GOOGLE_CLIENT_SECRET,
  //     redirect_uri: process.env.REDIRECT_URI,
  //     grant_type: "authorization_code",
  //     code: code,
  //   }),
  // });
  // const data = await response.json();
  // console.log(JSON.stringify(data), "DATA>>>>>>>>>>");
  // const user = await verifyGoogleIdToken(data.id_token);
  // console.log(user.emailVerified);
  // if (user.emailVerified) {
  //   const redirectUrl = `http://10.40.0.105:8081/api/auth/callback?id_token=${data.id_token}`;
  //   return res.redirect(302, redirectUrl);
  // }
  res.send(code, "Backend running ✅");
});

app.get("/", async (req, res) => {
  res.send("Test >>>>>>");
});
app.listen(PORT, () => {
  try {
    console.log("🔓 HTTP backend running http://localhostsss:" + PORT);
  } catch (error) {
    console.error("Error starting server:", error);
  }
});
