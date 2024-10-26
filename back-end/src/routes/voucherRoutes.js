const express = require("express");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const { createDiscountController, getAllDiscountsController, getDiscountByCodeController, updateDiscountController, deleteDiscountController,
    createFreeshipController, getAllFreeshipsController, getFreeshipByCodeController, updateFreeshipController, deleteFreeshipController } = require("../controllers/voucherController");

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

// Tạo mới một freeship
router.post('/freeships/create', authenticateJWT, createFreeshipController);

// Lấy tất cả freeship
router.get('/freeships/all', authenticateJWT, getAllFreeshipsController);

// Lấy freeship theo code
router.get('/freeships/:code', authenticateJWT, getFreeshipByCodeController);

// Cập nhật freeship theo ID
router.put('/freeships/update/:id', authenticateJWT, updateFreeshipController);

// Xóa freeship theo ID
router.delete('/freeships/delete/:id', authenticateJWT, deleteFreeshipController);

module.exports = router;