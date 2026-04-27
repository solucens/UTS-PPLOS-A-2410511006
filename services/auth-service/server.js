const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");

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

// TEST
app.get("/", (req, res) => {
  res.json({ message: "Auth service jalan" });
});

app.listen(PORT, () => {
  console.log(`Auth service running on ${PORT}`);
});