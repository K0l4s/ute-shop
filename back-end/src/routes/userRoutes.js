const express = require("express");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const { getUserProfile, updateUserProfile, updateUserLocation } = require("../controllers/userController");
const upload = require("../config/multerConfig");

const router = express.Router();

// Lấy hồ sơ người dùng
router.get('/profile', authenticateJWT, getUserProfile);

// Cập nhật hồ sơ người dùng
router.put('/profile/edit', authenticateJWT, upload.single('avatar_url'), updateUserProfile);
router.put('/profile/location/edit', authenticateJWT, updateUserLocation);

module.exports = router;
