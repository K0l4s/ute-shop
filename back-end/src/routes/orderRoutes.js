const express = require('express');
const { placeOrder, getOrder } = require('../controllers/orderController.js');
const { authenticateJWT } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post('/place', authenticateJWT, placeOrder);
router.get('/get/:id', authenticateJWT, getOrder);

module.exports = router;