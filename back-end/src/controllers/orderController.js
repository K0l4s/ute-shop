const orderService = require('../services/orderService.js');
const userService = require('../services/userService.js');
const Role = require('../enums/role.js');
const orderStatus = require('../enums/orderStatus.js');

const placeOrder = async (req, res) => {
  const userId = req.user.id;
  const orderData = req.body;
  const wss = req.wss;

  try {
    // Gọi service để tạo đơn hàng mới
    const { newOrder, newPayment } = await orderService.createOrder(userId, orderData, null, wss);
    res.status(201).json({ message: 'Order created successfully', order: newOrder, payment: newPayment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getOrder = async (req, res) => {
  const orderId = req.params.id;
  
  try {
    const order = await orderService.getOrderById(orderId);
    res.status(200).json(order);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const getAllOrdersByUser = async (req, res) => {
  const userId = req.user.id;
  const status = req.query.status || 'ALL';
  const limit = parseInt(req.query.limit) || 5;
  const offset = parseInt(req.query.offset) || 0;

  try {
    // Gọi service để lấy danh sách đơn hàng của user
    const orders = await orderService.getOrdersByUserId(userId, status, limit, offset);
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const getAllOrdersController = async (req, res) => {
  try {
    const userToken = req.user;
    const user = await userService.getUserById(userToken.id);
    if (user.role !== Role.ADMIN) {
      throw new Error('You do not have permission to perform this action');
    }
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const getOrderDetailController = async (req, res) => {
  const orderId = req.params.id;

  try {
    const orderDetail = await orderService.getOrderDetailById(orderId);
    res.status(200).json(orderDetail);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

const updateOrderController = async (req, res) => {
  const orderId = req.params.id;
  const status = req.body;
  const wss = req.wss;
  console.log(status);
  const user = req.user;
  const userDetail = await userService.getUserById(user.id);
  try {
    if(!status) {
      throw new Error('Status is required');
    }
    if(userDetail.role!==Role.ADMIN && (
      status === orderStatus.CONFIRMED ||
       status === orderStatus.PROCESSING ||
        status === orderStatus.SHIPPED ||
         status === orderStatus.DELIVERED 
    )) {
      throw new Error('You do not have permission to perform this action');
    }
    const updatedOrder = await orderService.updateOrder(orderId, status.status,user.id, wss);
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const updateMultipleOrderStatusController = async (req, res) => {
  const ordersId = req.body;
  const user = req.user;
  const userDetail = await userService.getUserById(user.id);
  try {
    if(userDetail.role!==Role.ADMIN) {
      throw new Error('You do not have permission to perform this action');
    }
    const updatedOrders = await orderService.updateMultipleOrderStatus(ordersId,userDetail.id);
    res.status(200).json(updatedOrders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const searchOrdersByUserController = async (req, res) => {
  const userId = req.user.id;
  const status = req.query.status || 'ALL';
  const searchQuery = req.query.searchQuery || '';

  try {
    const orders = await orderService.searchOrdersByUserId(userId, status, searchQuery);
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const getDetailOrderByUserController = async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;
  try {
    const order = await orderService.getDetailOrderByUser(userId, orderId);
    res.status(200).json({message: "sucess", data: order});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  placeOrder,
  getOrder,
  getAllOrdersByUser,
  getAllOrdersController,
  updateOrderController,
  updateMultipleOrderStatusController,
  searchOrdersByUserController,
  getDetailOrderByUserController,
  getOrderDetailController
};