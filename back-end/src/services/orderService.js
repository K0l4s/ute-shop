const db = require('../models');
const Order = db.Order;
const Detail_Order = db.Detail_Order;
const Book = db.Book;

const createOrder = async (userId, orderData) => {
  try {
    const newOrder = await Order.create({
      user_id: userId,
      total_price: orderData.total_price,
      shipping_address: orderData.shipping_address,
      status: 'PENDING', // Đơn hàng mới tạo sẽ có trạng thái mặc định là PENDING
    });

    // Thêm chi tiết đơn hàng
    for (const item of orderData.orderItems) {
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

    return newOrder;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createOrder,
};
