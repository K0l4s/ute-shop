const db = require('../models');
const Notification = db.Notification;

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

module.exports = {
  getAllNotifications
}