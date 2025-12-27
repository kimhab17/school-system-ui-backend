const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
app.use(express.json());

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const EXAM_SERVICE_URL = process.env.EXAM_SERVICE_URL;
const HOMEWORK_SERVICE_URL = process.env.HOMEWORK_SERVICE_URL;

if (!AUTH_SERVICE_URL || !EXAM_SERVICE_URL || !HOMEWORK_SERVICE_URL) {
  console.error("❌ Missing service URLs");
  process.exit(1);
}

// AUTH
app.use(
  "/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/auth": "/auth" },
  })
);

// EXAM
app.use(
  "/exam",
  createProxyMiddleware({
    target: EXAM_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/exam": "/exam" },
  })
);

// HOMEWORK
app.use(
  "/homework",
  createProxyMiddleware({
    target: HOMEWORK_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/homework": "/homework" },
  })
);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
