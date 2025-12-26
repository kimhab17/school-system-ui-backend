const express = require("express");
const router = express.Router();
const Homework = require("../models/Homework");
const auth = require("../middleware/auth");

const HomeworkSubmission = require("../models/HomeworkSubmission");

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

/**
 * STUDENT SUBMIT HOMEWORK
 */
router.post("/submit", auth, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can submit homework",
      });
    }

    const { homeworkId, answerText } = req.body;

    if (!homeworkId || !answerText) {
      return res.status(400).json({
        success: false,
        message: "homeworkId and answerText are required",
      });
    }

    const submission = await HomeworkSubmission.create({
      homeworkId,
      studentId: req.user.id,
      answerText,
    });

    res.json({
      success: true,
      message: "Homework submitted successfully",
      data: submission,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ✅ GET ALL HOMEWORK (for students)
router.get("/", auth, async (req, res) => {
  try {
    const homework = await Homework.find().sort({ createdAt: -1 });

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
