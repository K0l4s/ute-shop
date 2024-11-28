const express = require('express');
const { createReviewController, createReviewsMultipleItemsController } = require('../controllers/reviewController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/add', authenticateJWT, createReviewController);
router.post("/add/multiple", authenticateJWT, createReviewsMultipleItemsController);
module.exports = router;
