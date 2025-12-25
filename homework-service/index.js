const express = require("express");
const mongoose = require("mongoose");
const homeworkRoutes = require("./routes/homework");

const app = express();
app.use(express.json());
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Homework DB connected"))
  .catch((err) => console.error(err));

app.use("/homework", homeworkRoutes);

const PORT = 4003;
app.listen(PORT, () => console.log(`Homework service running on port ${PORT}`));
