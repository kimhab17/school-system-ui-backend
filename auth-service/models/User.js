const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["teacher", "student", "admin"],
      default: "student",
    },
    // ✅ ADD THIS
    className: {
      type: String,
      default: null, // teacher/admin = null
    },
    profileImage: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
