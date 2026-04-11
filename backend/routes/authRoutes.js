const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// Signup
router.post("/signup", signup);

// Login
router.post("/login", login);

// Forgot Password
router.post("/forgot-password", forgotPassword);


router.post("/reset-password", resetPassword);


module.exports = router;
