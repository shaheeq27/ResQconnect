const express = require("express");

const router = express.Router();

const {
  register,
  login,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");

// Register
router.post("/register", register);

// Login
router.post("/login", login);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;
