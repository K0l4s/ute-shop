const express = require('express');

const { placeOrder,getAllOrdersByUser,getOrder, getAllOrdersController, updateOrderController,updateMultipleOrderStatusController  } = require('../controllers/orderController.js');

const { authenticateJWT } = require("../middlewares/authMiddleware.js");

const router = express.Router();
router.get('/', authenticateJWT, getAllOrdersController);
router.post('/place', authenticateJWT, placeOrder);
router.get('/all', authenticateJWT, getAllOrdersByUser);
router.get('/get/:id', authenticateJWT, getOrder);
router.put('/status/:id', authenticateJWT, updateOrderController);
router.post('/multi/status',authenticateJWT,updateMultipleOrderStatusController);
module.exports = router;