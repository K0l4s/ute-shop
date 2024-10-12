const express = require("express");
const { getBooksController, getBookDetailByIdController } = require("../controllers/bookController");
const router = express.Router();

// Endpoint để tìm kiếm và lọc sách với phân trang
router.get("/search", getBooksController);

// Endpoint để lấy chi tiết sách
router.get("/:id", getBookDetailByIdController);

module.exports = router;