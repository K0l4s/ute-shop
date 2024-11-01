const express = require("express");
const { getBooksController, getBookDetailByIdController,getTop10Books, createBookController } = require("../controllers/bookController");
const multer = require('multer');
const upload = multer();
const router = express.Router();
// Endpoint để tìm kiếm và lọc sách với phân trang
router.get("/search", getBooksController);
// Endpoint để lấy chi tiết sách
router.get("/:id", getBookDetailByIdController);
router.get('/top/10', getTop10Books);
router.post('/create',upload.single('cover_img_url'),createBookController);
module.exports = router;