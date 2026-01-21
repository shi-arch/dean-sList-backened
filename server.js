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
const port = process.env.PORT;
 
// ✅ Health check

async function exchangeCodeForToken(code) {
  try {
    const data = qs.stringify({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: 'exp://10.40.0.105:8081',
    });
    console.log(data, "DATA>>>>>>>>>>");
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(response, "response>>>>>>>>>>");

    return response.data;
  } catch (error) {
    console.error("Google token exchange failed:", {
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
}
app.get("/api/auth/authorize", async (req, res) => {
   const { code } = req.query;
    //const token = await exchangeCodeForToken(code);
    //res.redirect("exp://10.40.0.105:8081/api/auth/token");
    res.send("Backend running ✅");
});

app.get("/", async (req, res) => {
  res.send("Test >>>>>>");
});



// 🔴 PUT YOUR GOOGLE WEB CLIENT ID HERE
const GOOGLE_CLIENT_ID =
  "317999867006-c1chqsld8au82q2ai256mtj63ugav98p.apps.googleusercontent.com";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);


app.post("/auth/google", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Missing idToken" });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    res.json({
      success: true,
      user: {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      },
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid Google token",
    });
  }
});

// const options = {
//   key: fs.readFileSync("localhost+1-key.pem"),
//   cert: fs.readFileSync("localhost+1.pem"),
// };

// https.createServer(options, app).listen(3000, () => {
//   console.log("🔐 HTTPS backend running https://localhost:3000");
// });
//module.exports = app;
app.listen(port, () => {
  try {
    console.log(`🔓 HTTP backend running http://localhost:${port}`);
  } catch (error) {
    console.error("Error starting server:", error);
  }
});
