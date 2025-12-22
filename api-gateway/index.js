const express = require("express");
const axios = require("axios");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// ✅ Parse JSON ONLY for auth routes
app.use("/auth", express.json());

// 🔹 Auth Service URL
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://auth-service:4001";

// 🔹 AUTH ROUTES (unchanged)
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

// ✅ EXAM ROUTES → DO NOT parse JSON here
app.use(
  "/exam",
  createProxyMiddleware({
    target: "http://exam-service:4002/exam",
    changeOrigin: true,
  })
);

// homework
/* ✅ HOMEWORK */
app.use(
  "/homework",
  createProxyMiddleware({
    target: "http://homework-service:4003/homework",
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      if (req.headers.authorization) {
        proxyReq.setHeader("authorization", req.headers.authorization);
      }
    },
  })
);

app.use(
  "/homework",
  createProxyMiddleware({
    target: "http://homework-service:4003/homework/*",
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      if (req.headers.authorization) {
        proxyReq.setHeader("authorization", req.headers.authorization);
      }
    },
  })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
