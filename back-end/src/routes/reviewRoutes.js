const express = require('express');
const { createReviewController, createReviewsMultipleItemsController, getBookReviewsController } = require('../controllers/reviewController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/add', authenticateJWT, createReviewController);
router.post("/add/multiple", authenticateJWT, createReviewsMultipleItemsController);
router.get("/book/:bookId", getBookReviewsController);
module.exports = router;
