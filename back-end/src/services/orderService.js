const db = require('../models');
const Order = db.Order;
const Detail_Order = db.Detail_Order;
const Book = db.Book;
const Payment = db.Payment;

const createOrder = async (userId, orderData, transaction) => {
  try {
    const { total_price, shipping_address, shipping_method, shipping_fee, payment_method, orderItems } = orderData;

    const newOrder = await Order.create({
      user_id: userId,
      total_price: total_price,
      shipping_address: shipping_address,
      shipping_method: shipping_method,
      shipping_fee: shipping_fee,
      status: 'PENDING', // Đơn hàng mới tạo sẽ có trạng thái mặc định là PENDING
    }, {transaction});

    // Thêm chi tiết đơn hàng
    for (const item of orderItems) {
      // Kiểm tra stock của sách
      const book = await Book.findByPk(item.book_id);
      if (!book || book.stock < item.quantity) {
        throw new Error(`Book with ID ${item.book_id} is out of stock or does not exist`);
      }

      // Cập nhật stock
      await book.update({ stock: book.stock - item.quantity });

      // Thêm chi tiết đơn hàng vào bảng Detail_Order
      await Detail_Order.create({
        order_id: newOrder.id,
        book_id: item.book_id,
        quantity: item.quantity,
        price: item.unit_price
      }, {transaction});
    }

    let payment_date = null;
    if (payment_method === 'VNPAY') {
      payment_date = new Date();
    }

    // Tạo payment (COD hoặc VNPAY)
    const newPayment = await Payment.create({
      order_id: newOrder.id,
      user_id: userId,
      amount: total_price,
      payment_date: payment_date,
      payment_method, // COD hoặc VNPAY
      status: 'PENDING'
    }, {transaction});

    return { newOrder, newPayment };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOrderById = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId, {
      include: [
      {
        model: Detail_Order,
        as: 'orderDetails',
        include: {
          model: Book,
          as: 'book'
        }
      }
      ],
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    return {
      order_id: order.id,
      total_price: order.total_price,
      receive: order.userId,
      order_date: order.order_date,
      orderDetails: order.orderDetails.map((detail) => ({
        title: detail.book.title,
        cover_img_url: detail.book.cover_img_url,
        quantity: detail.quantity,
        price: detail.price
      })),
    };
  } catch (error) {
    throw new Error(error.message);
  }
}
const getOrdersByUserId = async (id) => {
  try {
    const orders = await Order.findAll({
    });
    if(!orders) {
      throw new Error('No orders found');
    }
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
}
module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUserId
};