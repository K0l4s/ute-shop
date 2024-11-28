const express = require('express');

const { placeOrder,getAllOrdersByUser,getOrder, getAllOrdersController, updateOrderController,updateMultipleOrderStatusController, searchOrdersByUserController, getDetailOrderByUserController, getOrderDetailController  } = require('../controllers/orderController.js');

const { authenticateJWT } = require("../middlewares/authMiddleware.js");

const router = express.Router();
router.get('/', authenticateJWT, getAllOrdersController);
router.post('/place', authenticateJWT, placeOrder);
router.get('/all', authenticateJWT, getAllOrdersByUser);
router.get('/get/:id', authenticateJWT, getOrder);
router.put('/status/:id', authenticateJWT, updateOrderController);
router.post('/multi/status',authenticateJWT,updateMultipleOrderStatusController);
router.get('/search', authenticateJWT, searchOrdersByUserController);
router.get('/detail/:id', authenticateJWT, getDetailOrderByUserController);
router.get('/detail_order/:id',authenticateJWT,getOrderDetailController);
module.exports = router;