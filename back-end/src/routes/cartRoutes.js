const express = require("express");
const { addToCartController, updateCartItemController, removeFromCartController, getUserCartController, increaseQuantityController, decreaseQuantityController } = require("../controllers/cartController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

const router = express.Router();

// Thêm sản phẩm vào giỏ hàng
router.post('/add', authenticateJWT, addToCartController);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/update', authenticateJWT, updateCartItemController);

// Xóa sản phẩm khỏi giỏ hàng
router.post('/remove', authenticateJWT, removeFromCartController);

// Lấy giỏ hàng của người dùng
router.get('/all', authenticateJWT, getUserCartController);

// Tăng sản phẩm trong giỏ hàng
router.post('/inc', authenticateJWT, increaseQuantityController);

// Giamr sản phẩm trong giỏ hàng
router.post('/dec', authenticateJWT, decreaseQuantityController);

module.exports = router;   