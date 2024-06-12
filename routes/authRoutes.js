//
const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  test,
  login,
  forgotPassword,
  getAllUsers,
} = require("../controllers/authController");

// MIDDLEWARE

router.use(
  cors({
    credentials: true,
    origin: "https://my-gov-client.vercel.app",
      allowedHeaders: ['Content-Type', 'Authorization'], 
  })
);

router.post("/login", login);

router.post("/forgotPassword", forgotPassword);

router.get("/admin/users", getAllUsers);

module.exports = router;

