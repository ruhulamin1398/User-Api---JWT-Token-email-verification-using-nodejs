const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const checkUserIsActive = require("../middleware/userIsActiveHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", checkUserIsActive,loginUser);

router.get("/current", validateToken, currentUser);

module.exports = router;