const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;
const SECRET = "rahasia_uts";

// user dummy
const user = {
  id: 1,
  email: "admin@mail.com",
  password: "123",
  role: "admin"
};

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === user.email && password === user.password) {

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login berhasil",
      access_token: accessToken,
      refresh_token: refreshToken
    });
  }

  return res.status(401).json({
    message: "Email atau password salah"
  });
});

app.post("/refresh", (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(401).json({ message: "Refresh token tidak ada" });
  }

  try {
    const decoded = jwt.verify(refresh_token, SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: "admin" },
      SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      access_token: newAccessToken
    });

  } catch (err) {
    return res.status(403).json({
      message: "Refresh token tidak valid"
    });
  }
});

let blacklist = [];

app.post("/logout", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];
  blacklist.push(token);

  return res.json({
    message: "Logout berhasil, token dimasukkan ke blacklist"
  });
});

require("dotenv").config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

app.get("/google", (req, res) => {
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent"
    });

  res.redirect(url);
});

app.get("/google/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ message: "Code OAuth tidak ditemukan" });
  }

  try {
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code"
    });

    const googleUser = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`
      }
    });

    const accessToken = jwt.sign(
      {
        id: 2,
        role: "pegawai",
        email: googleUser.data.email
      },
      SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: 2 },
      SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login Google berhasil",
      user: {
        name: googleUser.data.name,
        email: googleUser.data.email,
        photo: googleUser.data.picture,
        oauth_provider: "google"
      },
      access_token: accessToken,
      refresh_token: refreshToken
    });

  } catch (error) {
    return res.status(500).json({
      message: "Google OAuth gagal",
      error: error.message
    });
  }
});
// TEST
app.get("/", (req, res) => {
  res.json({ message: "Auth service jalan" });
});

app.listen(PORT, () => {
  console.log(`Auth service running on ${PORT}`);
});