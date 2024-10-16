const orderService = require('../services/orderService.js');

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

module.exports = {
  placeOrder,
  getAllOrdersByUser
};
