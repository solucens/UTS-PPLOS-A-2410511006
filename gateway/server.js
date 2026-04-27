const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = 8000;
const JWT_SECRET = "rahasia_uts";

app.use(cors());

function verifyToken(req, res, next) {
  const publicPaths = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/logout"
];

  if (publicPaths.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.headers["x-user-id"] = decoded.id;
    req.headers["x-user-role"] = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
}

app.use(verifyToken);

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": ""
    }
  })
);

app.use(
  "/api/employees",
  createProxyMiddleware({
    target: "http://localhost:8080",
    changeOrigin: true,
    pathRewrite: {
      "^/api/employees": "/employees"
    }
  })
);

app.use(
  "/api/attendance",
  createProxyMiddleware({
    target: "http://localhost:3003",
    changeOrigin: true,
    pathRewrite: {
      "^/api/attendance": "/attendance"
    }
  })
);

app.use(
  "/api/leaves",
  createProxyMiddleware({
    target: "http://localhost:3003",
    changeOrigin: true,
    pathRewrite: {
      "^/api/leaves": "/leaves"
    }
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "API Gateway Sistem Kepegawaian & Absensi berjalan"
  });
});

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
