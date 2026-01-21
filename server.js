const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const qs = require("qs");
//require("dotenv").config()

const app = express();
app.use(cors());
app.use(express.json());
// ✅ Health check


app.get("/api/auth/authorize", async (req, res) => {
    // console.log(req.body, "Health check");
    // console.log(req.query, "Query parameters");
    const { code } = req.query;  
    GOOGLE_CLIENT_ID="317999867006-c1chqsld8au82q2ai256mtj63ugav98p.apps.googleusercontent.com"
    // console.log(code_challenge, state, "CODE CHALLENGE AND STATE");
    //const token = await exchangeCodeForToken(code_challenge);
    //res.redirect("exp://10.40.0.105:8081/api/auth/token");
    return res.redirect(302, "exp://10.40.0.105:8081/api/auth/callback?code=" + code);
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
  } catch (error) {
    console.error("Error starting server:", error);
  }
});
