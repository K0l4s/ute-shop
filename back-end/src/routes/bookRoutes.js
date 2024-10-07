const express = require('express');
const { searchBooksByTitleController,getBookDetailByIdController,getTop10Books } = require('../controllers/bookController');

const router = express.Router();

// Route tìm kiếm sách theo tên
router.get('/search', searchBooksByTitleController);
router.get('/:id', getBookDetailByIdController);
router.get('/top/10', getTop10Books);
module.exports = router;
