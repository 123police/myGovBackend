const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  test,
  CreateIndividualAccount,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
  updateUser,
  logout,
} = require("../controllers/authController");

// MIDLEWARE

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

router.get("/", test);

router.post("/CreateIndividualAccount", CreateIndividualAccount);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.post("/forgotPassword", forgotPassword);
router.post("/ResetPassword/:id/:token", resetPassword);
router.post("/updateUser", updateUser);
router.get("/logout", logout);

module.exports = router;
