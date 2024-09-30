const express = require('express');
const { searchBooksByTitleController } = require('../controllers/bookController');

const router = express.Router();

// Route tìm kiếm sách theo tên
router.get('/search', searchBooksByTitleController);

module.exports = router;
