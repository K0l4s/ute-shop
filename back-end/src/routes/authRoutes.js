const express = require("express");
const { register, login, confirm, logout, checkAuth, forgotPsswd, resetPsswd } = require("../controllers/authController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/confirm', confirm);
router.post('/logout', logout);
router.post('/forgot-password', forgotPsswd);
router.post('/reset-password', resetPsswd);
router.get('/check', authenticateJWT, checkAuth);
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
