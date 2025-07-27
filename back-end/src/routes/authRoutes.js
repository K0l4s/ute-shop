const express = require("express");
const { register, login, confirm, logout, checkAuth, forgotPsswd, resetPsswd, changePwd, googleAuth, googleCallback, linkGoogle, unlinkGoogle } = require("../controllers/authController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

const router = express.Router();

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.post('/link-google', authenticateJWT, linkGoogle);
router.delete('/unlink-google', authenticateJWT, unlinkGoogle);

router.post('/register', register);
router.post('/login', login);
router.post('/confirm', confirm);
router.post('/logout', logout);
router.post('/forgot-password', forgotPsswd);
router.post('/reset-password', resetPsswd);
router.get('/check', authenticateJWT, checkAuth);
router.put('/change-password', authenticateJWT, changePwd);
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
