const express = require('express');
const { encodeCartData, decodeCartData, reserveStock, releaseStock, checkStockAndVoucherAvailability } = require('../controllers/checkoutController');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const router = express.Router();

// Route mã hóa giỏ hàng
router.post('/encode-cart', authenticateJWT, encodeCartData);

// Route giải mã giỏ hàng
router.get('/decode-cart', authenticateJWT, decodeCartData);
router.post('/reserve', authenticateJWT, reserveStock);
router.post('/release', authenticateJWT, releaseStock);
router.post('/checkStock', checkStockAndVoucherAvailability);
module.exports = router;
