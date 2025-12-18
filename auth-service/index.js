const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());

// 🔹 MongoDB Connection (Docker-friendly)
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://mongo:27017/school";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// 🔹 Routes
app.use("/auth", authRoutes);

// 🔹 Server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🚀 Auth Service running on port ${PORT}`);
});

