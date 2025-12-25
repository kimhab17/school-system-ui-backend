const express = require("express");
const axios = require("axios");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// ✅ Parse JSON ONLY for auth
app.use("/auth", express.json());

// ================= ENV =================
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "https://auth-service.onrender.com";

const EXAM_SERVICE_URL =
  process.env.EXAM_SERVICE_URL || "https://exam-service.onrender.com";

const HOMEWORK_SERVICE_URL =
  process.env.HOMEWORK_SERVICE_URL || "https://homework-service.onrender.com";

// ================= AUTH =================
app.use("/auth", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${AUTH_SERVICE_URL}/auth${req.originalUrl.replace("/auth", "")}`,
      data: req.body,
      headers: {
        authorization: req.headers.authorization || "",
      },
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Gateway error:", err.message);

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
    pathRewrite: {
      "^/exam": "/exam",
    },
    onProxyReq: (proxyReq, req) => {
      if (req.headers.authorization) {
        proxyReq.setHeader("authorization", req.headers.authorization);
      }
    },
  })
);

// ================= HOMEWORK =================
app.use(
  "/homework",
  createProxyMiddleware({
    target: HOMEWORK_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/homework": "/homework",
    },
    onProxyReq: (proxyReq, req) => {
      if (req.headers.authorization) {
        proxyReq.setHeader("authorization", req.headers.authorization);
      }
    },
  })
);

// ================= SERVER =================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
