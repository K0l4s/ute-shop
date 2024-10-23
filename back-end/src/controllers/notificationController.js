const { getAllNotifications } = require("../services/notificationService");

const getAllNotificationsController = async (req, res) => {
  try {
    const notifications = await getAllNotifications(req.user.id);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getAllNotificationsController
}