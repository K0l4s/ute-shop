const express = require('express');
const router = express.Router();
const { getBookReviewsController } = require('../controllers/reviewController');

router.get('/book/:bookId', getBookReviewsController);

module.exports = router;