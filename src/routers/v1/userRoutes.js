const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  validateUserOTP,
  sendVerificationOTP,
  updateUserToken,
} = require("../../controllers/v1/userController");
const validateToken = require("../../middleware/v1/validateTokenHandler");
const checkUserIsActive = require("../../middleware/v1/userIsActiveHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);
router.post("/resend-verification-email", validateToken, sendVerificationOTP);
router.post("/verify-otp-token", validateToken, validateUserOTP);
router.put("/update-user-token", validateToken, updateUserToken);

module.exports = router;