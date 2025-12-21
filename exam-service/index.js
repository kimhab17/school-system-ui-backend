const express = require("express");
const mongoose = require("mongoose");
const examRoutes = require("./routes/exam");

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Exam DB connected"));

app.use("/exam", examRoutes);

const PORT = 4002;
app.listen(PORT, () => console.log(`Exam service running on port ${PORT}`));
