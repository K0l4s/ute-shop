import express from "express";
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";

const router = express.Router();

// Lấy hồ sơ người dùng
router.get('/profile', authenticateJWT, getUserProfile);

// Cập nhật hồ sơ người dùng
router.put('/profile/edit', authenticateJWT, updateUserProfile);

export default router;
