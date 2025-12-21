const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");

// CREATE EXAM
router.post("/create", async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.json({
      success: true,
      message: "Exam created successfully",
      data: exam,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET EXAMS BY TEACHER
router.get("/teacher/:teacherId", async (req, res) => {
  try {
    const exams = await Exam.find({
      teacherId: req.params.teacherId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: exams,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
