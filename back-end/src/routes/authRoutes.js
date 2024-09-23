import express from "express";
import { register, login, confirm, logout, checkAuth } from "../controllers/authController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/confirm', confirm);
router.post('/logout', logout);
router.get('/check', authenticateJWT, checkAuth);
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

export default router;