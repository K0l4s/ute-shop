const express = require('express');
const { createReviewController } = require('../controllers/reviewController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticateJWT, createReviewController);
module.exports = router;
