const db = require('../models');
const Order = db.Order;
const Detail_Order = db.Detail_Order;
const Book = db.Book;
const Category = db.Category;
const Payment = db.Payment;
const Notification = db.Notification;
const User = db.User;
const orderStatus = require('../enums/orderStatus');
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
    }, { transaction });

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
      }, { transaction });
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
    }, { transaction });

    // Tạo một thông báo mới trong database

    if (payment_method === "COD") {
      const newNotification = await Notification.create({
        user_id: userId,
        order_id: newOrder.id ? newOrder.id : null,
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
const getOrdersByUserId = async (id, status, limit, offset) => {
  try {
    const whereClause = { user_id: id };
    if (status !== 'ALL') {
      whereClause.status = status;
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: Detail_Order,
          as: 'orderDetails',
          include: {
            model: Book,
            as: 'book',
            include: {
              model: Category,
              as: 'category',
              attributes: ['name']
            }
          },
        }
      ],
      order: [['order_date', 'DESC']],
      limit: limit,
      offset: offset
    });
    if (!orders) {
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
        },
        {
          model: User,
          as: 'user'
        }

      ],
      order: [['order_date', 'DESC']]
    });
    if (!orders) {
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
    if (order.status == orderStatus.PENDING) {
      throw new Error(`Order with ID ${orderId} must be confirmed first`);
    }
    else if (order.status == orderStatus.SHIPPED) {
      throw new Error(`Order with ID ${orderId} has been shipped`);
    }
    else if (order.status == orderStatus.CANCELLED) {
      throw new Error(`Order with ID ${orderId} has been cancelled`);
    }
    else if (order.status === orderStatus.PROCESSING) {
      throw new Error(`Order with ID ${orderId} has been processed`);
    }
    else if (order.status === orderStatus.RETURNED) {
      throw new Error(`Order with ID ${orderId} has been returned`);
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
    else if (order.status == orderStatus.SHIPPED) {
      throw new Error(`Order with ID ${orderId} has been shipped`);
    }
    else if (order.status == orderStatus.CANCELLED) {
      throw new Error(`Order with ID ${orderId} has been cancelled`);
    }
    else if (order.status == orderStatus.PROCESSING) {
      throw new Error(`Order with ID ${orderId} has been processed`);
    }
    else if (order.status == orderStatus.DELIVERED) {
      throw new Error(`Order with ID ${orderId} has been delivered`);
    }
    else if (order.status == orderStatus.RETURNED) {
      throw new Error(`Order with ID ${orderId} has been returned`);
    }
    // cho phép hủy đơn trong vòng 30 phút
    const currentTime = new Date();
    const orderTime = order.order_date;
    const diff = (currentTime - orderTime) / 60000;
    if (diff > 30) {
      throw new Error('Order cannot be cancelled after 30 minutes');
    }


    await order.update({ status: 'CANCELLED' });

    return order;
  } catch (error) {
    throw new Error(error.message);
  }
}
const returnOrder = async (orderId) => {
  // đơn hàng phải delivered hoặc shipped mới được trả lại. 
  // trường hợp shipped thì được trả hàng trong vòng 7 ngày
  // trường hợp delivered thì được trả hàng trong vòng 24 giờ
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    if (order.status == orderStatus.CONFIRMED) {
      throw new Error(`Order with ID ${orderId} was confirmed`);
    }
    else if (order.status == orderStatus.CANCELLED) {
      throw new Error(`Order with ID ${orderId} has been cancelled`);
    }
    else if (order.status === orderStatus.RETURNED) {
      throw new Error(`Order with ID ${orderId} has been returned`);
    }
    else if (order.status === orderStatus.PROCESSING) {
      throw new Error(`Order with ID ${orderId} has been processed`);
    }else if (order.status === orderStatus.PENDING) {
      throw new Error(`Order with ID ${orderId} was not confirmed`);
    }

    const currentTime = new Date();
    const orderTime = order.order_date;
    const diff = (currentTime - orderTime) / 60000;
    if (diff > 7 * 24 * 60 && order.status == orderStatus.SHIPPED) {
      throw new Error('Order cannot be returned after 7 days');
    }
    else if (diff > 24 * 60 && order.status == orderStatus.DELIVERED) {
      throw new Error('Order cannot be returned after 24 hours');
    }
    await order.update({ status: 'RETURNED' });

    return order;
  }
  catch (error) {
    throw new Error(error.message);
  }
}

const confirmOrder = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    if (order.status == orderStatus.CONFIRMED) {
      throw new Error(`Order with ID ${orderId} was confirmed`);
    }
    else if (order.status == orderStatus.CANCELLED) {
      throw new Error(`Order with ID ${orderId} has been cancelled`);
    }
    else if (order.status === orderStatus.RETURNED) {
      throw new Error(`Order with ID ${orderId} has been returned`);
    }
    else if (order.status === orderStatus.PROCESSING) {
      throw new Error(`Order with ID ${orderId} has been processed`);
    }
    else if (order.status === orderStatus.DELIVERED) {
      throw new Error(`Order with ID ${orderId} has been delivered`);
    }
    await order.update({ status: 'CONFIRMED' });

    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};
const processOrder = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    else if (order.status == orderStatus.CANCELLED) {
      throw new Error(`Order with ID ${orderId} has been cancelled`);
    }
    else if (order.status === orderStatus.RETURNED) {
      throw new Error(`Order with ID ${orderId} has been returned`);
    }
    else if (order.status === orderStatus.PROCESSING) {
      throw new Error(`Order with ID ${orderId} has been processed`);
    }
    else if (order.status === orderStatus.DELIVERED) {
      throw new Error(`Order with ID ${orderId} has been delivered`);
    }
    else if (order.status === orderStatus.SHIPPED) {
      throw new Error(`Order with ID ${orderId} has been shipped`);
    }
    await order.update({ status: 'PROCESSING' });

    return order;
  } catch (error) {
    throw new Error(error.message);
  }
}
const deliverOrder = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    else if (order.status === orderStatus.CANCELLED) {
      throw new Error(`Order with ID ${orderId} has been cancelled`);
    }
    else if (order.status === orderStatus.RETURNED) {
      throw new Error(`Order with ID ${orderId} has been returned`);
    }
    else if (order.status === orderStatus.DELIVERED) {
      throw new Error(`Order with ID ${orderId} has been delivered`);
    }
    else if (order.status === orderStatus.SHIPPED) {
      throw new Error(`Order with ID ${orderId} has been shipped`);
    }
    await order.update({ status: 'DELIVERED' });

    return order;
  } catch (error) {
    throw new Error(error.message);
  }
}
const updateOrder = async (orderId, status, userId) => {
  try {
    let order = null;
    if ((status == orderStatus.CANCELLED ||
      status == orderStatus.RETURNED ||
      status == orderStatus.PENDING 
    ) && !isUser(orderId, userId)) {
      throw new Error('Invalid user');
    }
    if (status == orderStatus.CANCELLED ) {
      order = await cancelOrder(orderId);
    }
    else if (status == orderStatus.RETURNED ) {
      order = await returnOrder(orderId);
    }
    else if (status == orderStatus.CONFIRMED) {
      order = await confirmOrder(orderId);
    }
    else if (status == orderStatus.PROCESSING) {
      order = await processOrder(orderId);
    }
    else if (status == orderStatus.DELIVERED) {
      order = await deliverOrder(orderId);
    }
    else if (status == orderStatus.SHIPPED) {
      order = await shipOrder(orderId);
    }
    else {
      throw new Error('Invalid status');
    }
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
}
const isUser = async (orderId, userId) => {
  // kiểm tra user_id của order có là userId không
  const order = await Order.findByPk(orderId)
  console.log(order.user_id)
  console.log(userId)
  console.log(order.user_id === userId)
  if (order.user_id === userId) {
    return true;
  }
  return false;
}
const updateMultipleOrderStatus = async (ordersId,userId) => {
  const messages = [];
  console.log(ordersId)
    for (const orderId of ordersId.ordersId) {
      const order = await Order.findByPk(orderId);
      let updatedStatus = '';
      if (!order) {
        messages.push(`Mã đơn ${orderId} không tồn tại`);
        break;
      }
      else if(order.status == orderStatus.PENDING){
        updatedStatus = orderStatus.CONFIRMED;
      }
      else if(order.status == orderStatus.CONFIRMED){
        updatedStatus = orderStatus.PROCESSING;
      }
      else if(order.status == orderStatus.PROCESSING){
        updatedStatus = orderStatus.DELIVERED;
      }
      await updateOrder(order.id, updatedStatus, userId).then((result) => {
        messages.push(`Đơn hàng ${orderId} đã được cập nhật thành ${updatedStatus}`);
      }).catch((error) => {
        messages.push(error.message);
      });

      // messages.push(`Order with ID ${orderId} has been updated successfully`);
    }
    return messages;
}

const searchOrdersByUserId = async (userId, status, searchQuery) => {
  try {
    const whereClause = { user_id: userId };
    if (status !== 'ALL') {
      whereClause.status = status;
    }

    const orders = await Order.findAll({
      where: whereClause,
      include: [
        {
          model: Detail_Order,
          as: 'orderDetails',
          include: {
            model: Book,
            as: 'book',
            where: {
              title: {
                [db.Sequelize.Op.like]: `%${searchQuery}%`
              }
            },
            include: {
              model: Category,
              as: 'category',
              attributes: ['name']
            }
          },
        }
      ],
      order: [['order_date', 'DESC']]
    });

    if (!orders) {
      throw new Error('No orders found');
    }
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  getAllOrders,
  updateOrder,
  updateMultipleOrderStatus,
  searchOrdersByUserId
};