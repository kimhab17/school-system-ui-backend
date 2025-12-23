const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const JWT_SECRET = "school_secret_key"; // for university project

/* --------------------------------------------------
   🔐 AUTH MIDDLEWARE (VERIFY TOKEN)
-------------------------------------------------- */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1]; // Bearer TOKEN

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/* --------------------------------------------------
   📸 MULTER CONFIG (UPLOAD PROFILE IMAGE)
-------------------------------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* --------------------------------------------------
   📝 REGISTER
-------------------------------------------------- */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, className } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      // ✅ only student has className
      className: role === "student" ? className : null,
    });

    await user.save();

    res.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

/* --------------------------------------------------
   🔑 LOGIN
-------------------------------------------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        // ✅ ADD THIS
        className: user.className,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* --------------------------------------------------
   👤 GET PROFILE (BY TOKEN)
   GET /auth/profile
-------------------------------------------------- */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔴 DEBUG (សំខាន់)
    console.log("PROFILE USER:", user);

    res.json(user); // ⬅️ return user DIRECTLY
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* --------------------------------------------------
   📤 UPLOAD PROFILE IMAGE
   POST /auth/upload-profile
-------------------------------------------------- */
router.post("/upload-profile", upload.single("image"), async (req, res) => {
  try {
    const { email } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { profileImage: req.file.path },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Profile image uploaded successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
