const express = require('express');
const { encodeCartData, decodeCartData } = require('../controllers/checkoutController');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route mã hóa giỏ hàng
router.post('/encode-cart', authenticateJWT, encodeCartData);

// Route giải mã giỏ hàng
router.get('/decode-cart', authenticateJWT, decodeCartData);

module.exports = router;
