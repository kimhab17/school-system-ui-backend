require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const examRoutes = require("./routes/exam");
const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Exam DB connected"))
  .catch((err) => console.error(err));

app.use("/exam", examRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Service running on", PORT);
});
