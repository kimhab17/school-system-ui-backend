const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    title: String,
    subject: String,
    className: String,
    date: String,
    duration: Number,
    totalMarks: Number,
    teacherId: String,
  },
  { timestamps: true }
);

// Test hahahahahahaha

module.exports = mongoose.model("Exam", examSchema);
