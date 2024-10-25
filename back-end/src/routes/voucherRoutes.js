const express = require("express");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const { createDiscountController, getAllDiscountsController, getDiscountByCodeController, updateDiscountController, deleteDiscountController} = require("../controllers/voucherController");

const router = express.Router();

// Tạo mới một discount
router.post('/discounts/create', authenticateJWT, createDiscountController);

// Lấy tất cả discount
router.get('/discounts/all', authenticateJWT, getAllDiscountsController);

// Lấy discount theo code
router.get('/discounts/:code', authenticateJWT, getDiscountByCodeController);

// Cập nhật discount theo ID
router.put('/discounts/update/:id', authenticateJWT, updateDiscountController);

// Xóa discount theo ID
router.delete('/discounts/delete/:id', authenticateJWT, deleteDiscountController);

module.exports = router;