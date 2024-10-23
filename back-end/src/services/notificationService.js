const db = require('../models');
const Notification = db.Notification;

const getAllNotifications = async (userId) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']]
    });
    if (!notifications) {
      throw new Error('No notifications found');
    }
    return notifications;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  getAllNotifications
}