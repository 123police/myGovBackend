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
    origin: "*",
  })
);

router.post("/login", login);

router.post("/forgotPassword", forgotPassword);

router.get("/admin/users", getAllUsers);

module.exports = router;

