const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { mongoose } = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");

// Database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DataBase connected"))
  .catch((err) => console.log("DataBase not connected", err));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the "public" directory
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/authRoutes"));

const port = 3001;
app.listen(port, () => console.log(`Server is running on port ${port}`));
