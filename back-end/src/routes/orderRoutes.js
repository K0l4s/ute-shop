const express = require('express');
const { placeOrder,getAllOrdersByUser } = require('../controllers/orderController.js');
const { authenticateJWT } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post('/place', authenticateJWT, placeOrder);
router.get('/all', authenticateJWT, getAllOrdersByUser);

module.exports = router;