const mongoose = require("mongoose");

const examSubmissionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: {
      type: String, // simple text (can expand later)
      required: true,
    },
    score: {
      type: Number,
      default: null, // teacher will grade later
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExamSubmission", examSubmissionSchema);
