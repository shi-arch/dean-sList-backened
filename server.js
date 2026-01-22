const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const qs = require("qs");
const { LOCAL_REDIRECT_URI } = require("./constant");
//require("dotenv").config()

const app = express();
app.use(cors());
app.use(express.json());
// ✅ Health check


app.get("/api/auth/authorize", async (req, res) => {
    return res.redirect(302, LOCAL_REDIRECT_URI + "?code=" + req.query.code);
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
