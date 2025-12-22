const mongoose = require("mongoose");

const homeworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    description: { type: String },
    dueDate: { type: String, required: true },
    type: {
      type: String,
      enum: ["assignment", "practice", "project"],
      default: "assignment",
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Homework", homeworkSchema);
