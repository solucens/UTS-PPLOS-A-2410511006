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
    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET,
      { expiresIn: "15m" }
    );

    return res.json({
      message: "Login berhasil",
      token
    });
  }

  return res.status(401).json({
    message: "Email atau password salah"
  });
});

// TEST
app.get("/", (req, res) => {
  res.json({ message: "Auth service jalan" });
});

app.listen(PORT, () => {
  console.log(`Auth service running on ${PORT}`);
});