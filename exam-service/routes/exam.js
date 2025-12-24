const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam"); // ✅ FIX
const auth = require("../middleware/auth");
const ExamSubmission = require("../models/ExamSubmission");

// CREATE EXAM (from token)
router.post("/create", auth, async (req, res) => {
  try {
    const teacherId = req.user.id;

    const exam = await Exam.create({
      title: req.body.title,
      subject: req.body.subject,
      className: req.body.className,
      date: req.body.date,
      duration: req.body.duration,
      totalMarks: req.body.totalMarks,
      type: req.body.type,
      teacherId,
    });

    res.json({
      success: true,
      data: exam,
    });
  } catch (err) {
    console.error("Create exam error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// GET exams of logged-in teacher
router.get("/teacher", auth, async (req, res) => {
  try {
    const exams = await Exam.find({ teacherId: req.user.id });
    res.json({ success: true, data: exams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET ALL exams (for students)
router.get("/", auth, async (req, res) => {
  try {
    const exams = await Exam.find();
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

/* --------------------------------------------------
   📝 SUBMIT EXAM (STUDENT ONLY)
-------------------------------------------------- */
router.post("/submit", auth, async (req, res) => {
  // 🔴 THIS WAS FAILING BEFORE
  if (req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Only students can submit exam",
    });
  }

  // ✅ Example submit logic
  res.json({
    success: true,
    message: "Exam submitted successfully",
  });
});

module.exports = router;
