const express = require("express");
const router = express.Router();
const { login, forgotPassword, getAllUsers } = require("../controllers/authController");

// Define routes
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.get("/admin/users", getAllUsers);

module.exports = router;
