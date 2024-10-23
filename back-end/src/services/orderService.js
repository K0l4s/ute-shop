const db = require('../models');
const Order = db.Order;
const Detail_Order = db.Detail_Order;
const Book = db.Book;
const Payment = db.Payment;
const Notification = db.Notification;

// Hàm WebSocket để gửi thông báo
const sendNotificationToClient = (wss, userId, message) => {
  if (!wss || !wss.clients) {
    console.error('WebSocket server is not initialized');
    return;
  }

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client.userId === userId) {
      client.send(JSON.stringify({ message }));
    }
  });
};

const createOrder = async (userId, orderData, transaction, wss) => {
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
      // await book.update({ stock: book.stock - item.quantity });

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

    // Tạo một thông báo mới trong database
  
    if (payment_method === "COD") {
      const newNotification = await Notification.create({
        user_id: userId,
        order_id: newOrder.id? newOrder.id : null,
        message: `Đơn hàng #${newOrder.id} của bạn đã được đặt thành công và đang chờ xử lý.`,
        type: 'ORDER_UPDATE',
        createdAt: new Date(),
        is_read: false
      }, { transaction });
      // Gửi thông báo qua WebSocket
      sendNotificationToClient(wss, userId, newNotification.message);
    }

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
      where: { user_id: id },
      include: [
      {
        model: Detail_Order,
        as: 'orderDetails',
        include: {
          model: Book,
          as: 'book'
        },
      }
      ],
      order: [['order_date', 'DESC']]
    });
    if(!orders) {
      throw new Error('No orders found');
    }
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
}
const getAllOrders = async () => {
  try {
    const orders = await Order.findAll({
      include: [
      {
        model: Detail_Order,
        as: 'orderDetails',
        include: {
          model: Book,
          as: 'book'
        },
      }
      ],
      order: [['order_date', 'DESC']]
    });
    if(!orders) {
      throw new Error('No orders found');
    }
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
}
const shipOrder = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    if(order.status == 'PENDING') {
      throw new Error(`Order with ID ${orderId} has not been confirmed yet`);
    }
    if(order.status == 'SHIPPED') {
      throw new Error(`Order with ID ${orderId} has been shipped`);
    }
    if(order.status == 'CANCELLED') {
      throw new Error(`Order with ID ${orderId} has been cancelled`);
    }
    if (order.status !== 'PROCESSING') {
      throw new Error(`Order with ID ${orderId} has been processed`);
    }

    await order.update({ status: 'SHIPPED' });

    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};
const cancelOrder = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    if(order.status == 'PENDING') {
      throw new Error(`Order with ID ${orderId} has not been confirmed yet`);
    }
    if(order.status == 'CANCELLED') {
      throw new Error(`Order with ID ${orderId} has been cancelled yet`);
    }
    if(order.status == 'SHIPPED') {
      throw new Error(`Order with ID ${orderId} has been shipped`);
    }
    if (order.status !== 'PROCESSING') {
      throw new Error(`Order with ID ${orderId} has been processed`);
    }

    await order.update({ status: 'CANCELLED' });

    return order;
  } catch (error) {
    throw new Error(error.message);
  }
}
module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  getAllOrders,
  shipOrder
};