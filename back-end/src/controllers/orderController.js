const orderService = require('../services/orderService.js');
const userService = require('../services/userService.js');
const Role = require('../enums/role.js');
const placeOrder = async (req, res) => {
  const userId = req.user.id;
  const orderData = req.body;

  try {
    // Gọi service để tạo đơn hàng mới
    const { newOrder, newPayment } = await orderService.createOrder(userId, orderData);
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

  try {
    // Gọi service để lấy danh sách đơn hàng của user
    const orders = await orderService.getOrdersByUserId(userId);
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

module.exports = {
  placeOrder,
  getOrder,
  getAllOrdersByUser,
  getAllOrdersController
};