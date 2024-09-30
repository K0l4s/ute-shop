const express = require('express');
const { searchBooksByTitleController,getBookDetailByIdController } = require('../controllers/bookController');

const router = express.Router();

// Route tìm kiếm sách theo tên
router.get('/search', searchBooksByTitleController);
router.get('/:id', getBookDetailByIdController);
module.exports = router;
