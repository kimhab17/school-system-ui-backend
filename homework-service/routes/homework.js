const express = require("express");
const router = express.Router();
const Homework = require("../models/Homework");
const auth = require("../middleware/auth");

/**
 * CREATE HOMEWORK (Teacher)
 */
router.post("/create", auth, async (req, res) => {
  try {
    const homework = await Homework.create({
      ...req.body,
      teacherId: req.user.id,
    });

    res.json({
      success: true,
      data: homework,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * GET HOMEWORK BY TEACHER
 */
router.get("/teacher", auth, async (req, res) => {
  try {
    const homework = await Homework.find({
      teacherId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: homework,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * GET HOMEWORK BY ID
 */
router.get("/teacher", auth, async (req, res) => {
  try {
    const homework = await Homework.find({
      teacherId: req.user.id, // 👈 from JWT
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: homework,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/**
 * ✅ GET ONE HOMEWORK BY ID (ANY STRING / ObjectId)
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const homework = await Homework.findById(req.params.id);

    if (!homework) {
      return res.status(404).json({
        success: false,
        message: "Homework not found",
      });
    }

    res.json({
      success: true,
      data: homework,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
