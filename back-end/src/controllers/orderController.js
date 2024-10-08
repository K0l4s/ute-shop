const orderService = require('../services/orderService.js');

const placeOrder = async (req, res) => {
  const userId = req.user.id;
  const orderData = req.body;

  try {
    // Gọi service để tạo đơn hàng mới
    const newOrder = await orderService.createOrder(userId, orderData);
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  placeOrder,
};
