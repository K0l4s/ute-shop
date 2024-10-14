const express = require("express");
const { addToCartController, updateCartItemController, removeFromCartController, getUserCartController } = require("../controllers/cartController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

const router = express.Router();

// Thêm sản phẩm vào giỏ hàng
router.post('/add', authenticateJWT, addToCartController);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.post('/update', authenticateJWT, updateCartItemController);

// Xóa sản phẩm khỏi giỏ hàng
router.post('/remove', authenticateJWT, removeFromCartController);

// Lấy giỏ hàng của người dùng
router.get('/', authenticateJWT, getUserCartController);

module.exports = router;
