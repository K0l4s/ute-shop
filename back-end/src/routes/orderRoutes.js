const express = require('express');

const { placeOrder,getAllOrdersByUser,getOrder  } = require('../controllers/orderController.js');

const { authenticateJWT } = require("../middlewares/authMiddleware.js");

const router = express.Router();

router.post('/place', authenticateJWT, placeOrder);
router.get('/all', authenticateJWT, getAllOrdersByUser);
router.get('/get/:id', authenticateJWT, getOrder);
module.exports = router;