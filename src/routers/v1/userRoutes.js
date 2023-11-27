const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  validateUserOTP,
  sendVerificationOTP,
} = require("../../controllers/v1/userController");
const validateToken = require("../../middleware/v1/validateTokenHandler");
const checkUserIsActive = require("../../middleware/v1/userIsActiveHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);
router.post("/send-verification-email", validateToken, sendVerificationOTP);
router.get("/verify-otp-token", validateToken, validateUserOTP);

module.exports = router;