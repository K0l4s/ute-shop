const { parse } = require("dotenv");
const { getAllNotifications } = require("../services/notificationService");

const getAllNotificationsController = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const notifications = await getAllNotifications(req.user.id, parseInt(limit), parseInt(offset));
    res.status(200).json(notifications); 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getAllNotificationsController
}