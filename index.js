const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { mongoose } = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

// data base connection

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DataBase connected"))
  .catch((err) => console.log("DataBase not connected", err));

//   middle ware

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/", require("./routes/authRoutes"));

const port = 3001;

app.listen(port, () => console.log(`server is running on port ${port}`));
