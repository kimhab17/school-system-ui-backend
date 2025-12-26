// 🔹 MongoDB Connection (Docker-friendly)
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Auth DB connected"))
  .catch((err) => console.error(err));
// 🔹 Routes
app.use("/auth", authRoutes);
app.use("/uploads", express.static("uploads"));

// 🔹 Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Auth service running on", PORT);
});
