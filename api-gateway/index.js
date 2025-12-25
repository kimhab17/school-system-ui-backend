const express = require("express");
const axios = require("axios");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Parse JSON only for auth
app.use("/auth", express.json());

// ================= ENV =================
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const EXAM_SERVICE_URL = process.env.EXAM_SERVICE_URL;
const HOMEWORK_SERVICE_URL = process.env.HOMEWORK_SERVICE_URL;

if (!AUTH_SERVICE_URL || !EXAM_SERVICE_URL || !HOMEWORK_SERVICE_URL) {
  console.error("❌ Missing service URLs in environment variables");
  process.exit(1);
}

// ================= AUTH =================
app.use("/auth", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${AUTH_SERVICE_URL}${req.originalUrl}`, // 👈 IMPORTANT
      data: req.body,
      headers: {
        authorization: req.headers.authorization || "",
      },
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("AUTH GATEWAY ERROR:", err.message);
    res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || err.message,
    });
  }
});

// ================= EXAM =================
app.use(
  "/exam",
  createProxyMiddleware({
    target: EXAM_SERVICE_URL,
    changeOrigin: true,
  })
);

// ================= HOMEWORK =================
app.use(
  "/homework",
  createProxyMiddleware({
    target: HOMEWORK_SERVICE_URL,
    changeOrigin: true,
  })
);

// ================= SERVER =================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
