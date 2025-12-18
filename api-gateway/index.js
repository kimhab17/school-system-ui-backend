const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔹 Auth Service URL (Docker-friendly)
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://auth-service:4001";

// 🔹 AUTH ROUTES
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
