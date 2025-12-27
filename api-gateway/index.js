const axios = require("axios");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

/* 🔥 FIX #1: parse JSON globally */
app.use(express.json());

// ================= ENV =================
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const EXAM_SERVICE_URL = process.env.EXAM_SERVICE_URL;
const HOMEWORK_SERVICE_URL = process.env.HOMEWORK_SERVICE_URL;

if (!AUTH_SERVICE_URL || !EXAM_SERVICE_URL || !HOMEWORK_SERVICE_URL) {
  console.error("❌ Missing service URLs in environment variables");
  process.exit(1);
}

// ================= AUTH (AXIOS) =================
app.use(
  "/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      if (req.headers.authorization) {
        proxyReq.setHeader("Authorization", req.headers.authorization);
      }
    },
    onError: (err, req, res) => {
      console.error("AUTH PROXY ERROR:", err.message);
      res
        .status(502)
        .json({ success: false, message: "Auth service unavailable" });
    },
  })
);
// ================= EXAM =================
app.use(
  "/exam",
  createProxyMiddleware({
    target: EXAM_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      if (req.headers.authorization) {
        proxyReq.setHeader("Authorization", req.headers.authorization);
      }
    },
    onError: (err, req, res) => {
      console.error("EXAM PROXY ERROR:", err.message);
      res
        .status(502)
        .json({ success: false, message: "Exam service unavailable" });
    },
  })
);

// ================= HOMEWORK =================
app.use(
  "/homework",
  createProxyMiddleware({
    target: HOMEWORK_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      if (req.headers.authorization) {
        proxyReq.setHeader("Authorization", req.headers.authorization);
      }
    },
    onError: (err, req, res) => {
      console.error("HOMEWORK PROXY ERROR:", err.message);
      res
        .status(502)
        .json({ success: false, message: "Homework service unavailable" });
    },
  })
);

// ================= SERVER =================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
