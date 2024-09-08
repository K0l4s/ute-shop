import express from "express";
import { register, login } from "../controllers/authController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

export default router;