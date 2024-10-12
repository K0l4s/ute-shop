const express = require("express");
const { getBooksController, getBookDetailByIdController,getTop10Books } = require("../controllers/bookController");
const router = express.Router();

// Endpoint để tìm kiếm và lọc sách với phân trang
router.get("/search", getBooksController);

// Endpoint để lấy chi tiết sách
router.get("/:id", getBookDetailByIdController);
router.get('/top/10', getTop10Books);

module.exports = router;