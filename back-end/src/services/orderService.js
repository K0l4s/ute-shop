const db = require('../models');
const Order = db.Order;
const Detail_Order = db.Detail_Order;
const Book = db.Book;
const Payment = db.Payment;

const createOrder = async (userId, orderData) => {
  try {
    const { total_price, shipping_address, shipping_method, payment_method, orderItems } = orderData;

    const newOrder = await Order.create({
      user_id: userId,
      total_price: total_price,
      shipping_address: shipping_address,
      shipping_method: shipping_method,
      status: 'PENDING', // Đơn hàng mới tạo sẽ có trạng thái mặc định là PENDING
    });

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
      });
    }

    // Tạo payment (COD hoặc VNPAY)
    const newPayment = await Payment.create({
      order_id: newOrder.id,
      user_id: userId,
      amount: total_price,
      payment_method, // COD hoặc VNPAY
      status: 'PENDING'
    });

    return { newOrder, newPayment };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createOrder,
};
