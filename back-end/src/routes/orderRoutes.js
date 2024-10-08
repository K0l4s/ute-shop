const express = require('express');
const { placeOrder } = require('../controllers/orderController.js');
const { authenticateJWT } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post('/place', authenticateJWT, placeOrder);

module.exports = router;