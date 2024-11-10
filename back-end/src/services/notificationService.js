const db = require('../models');
const Notification = db.Notification;
const WebSocket = require('ws');

const getAllNotifications = async (userId, limit, offset) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset
    });

    const unreadCount = await Notification.count({
      where: { user_id: userId, is_read: false }
    });

    if (!notifications) {
      throw new Error('No notifications found');
    }
    return {notifications, unreadCount};
  } catch (error) {
    throw new Error(error.message);
  }
}

const readAllNotifications = async (userId) => {
  try {
    const result = await Notification.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } }
    );

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Hàm để gửi thông báo qua WebSocket
const sendNotificationToClient = (wss, message) => {
  console.log('Sending notification to client:', message);
  if (!wss || !wss.clients) {
    console.error('WebSocket server is not initialized');
    return;
  }

  wss.clients.forEach(client => {
    console.log('Client userId:', client.userId);
    console.log('Message userId:', message.user_id);
    if (client.readyState === WebSocket.OPEN && client.userId == message.user_id) {
      client.send(JSON.stringify({ message }));
    }
  });
};

// Hàm để tạo thông báo mới và gửi qua WebSocket
const createAndSendOrderNotification = async (wss, userId, orderId, message) => {
  try {
    // Tạo thông báo mới trong database
    const newNotification = await Notification.create({
      user_id: userId,
      order_id: orderId,
      message: message,
      type: 'ORDER_UPDATE',
      createdAt: new Date(),
      is_read: false
    });

    // Gửi thông báo qua WebSocket
    sendNotificationToClient(wss, newNotification);

    return newNotification;
  } catch (error) {
    console.error('Error creating and sending notification:', error.message);
    throw new Error(error.message);
  }
};

module.exports = {
  getAllNotifications,
  readAllNotifications,
  sendNotificationToClient,
  createAndSendOrderNotification
}