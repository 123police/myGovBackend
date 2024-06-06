const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  test,
  login,
  forgotPassword,
  getAllUsers,
} = require("../controllers/authController");

// MIDLEWARE

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

router.get("/", test);

router.post("/login", login);

router.post("/forgotPassword", forgotPassword);

router.get("/admin/users", getAllUsers);

module.exports = router;
