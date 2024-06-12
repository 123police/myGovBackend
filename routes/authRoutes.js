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

const corsOptions = {
  origin: "https://my-gov-client.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use("/api", require("./routes/authRoutes"));

// Apply CORS middleware
router.use(cors(corsOptions));

router.post("/login", login);

router.post("/forgotPassword", forgotPassword);

router.get("/admin/users", getAllUsers);

module.exports = router;
