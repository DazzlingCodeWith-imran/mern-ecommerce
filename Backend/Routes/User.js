const express = require("express");
const {
  registerUser,
  registerAdmin,
  loginUser,
  logoutUser,
  verifyOtp,
  checkAuth,
  getProfile,
  updateProfile,
} = require("../controllers/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/admin/register", registerAdmin); // New admin register route
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verify-otp", verifyOtp);
router.get("/check-auth", authMiddleware, checkAuth);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;