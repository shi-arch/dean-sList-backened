const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Health check

function mobileOnlyRedirect(req, res, next) {
  const userAgent = req.headers["user-agent"] || "";
  console.log("User-Agent:>>>>", userAgent);
  const isMobile =
    /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(userAgent);

  if (isMobile) {
    return res.redirect(302, "http://10.38.255.119:8081");
  }

  // Web users continue normally
  next();
}
app.get("/api/auth/authorize", (req, res) => {
    console.log(req.body, "Health check");
    res.redirect("exp://10.38.255.119:8081");
  res.send("Backend running ✅");
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

app.listen(3000, () => {
  console.log("Backend running http://localhost:3000");
});
