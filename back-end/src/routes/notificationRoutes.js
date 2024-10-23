const express = require("express");
const { getAllNotificationsController } = require("../controllers/notificationController");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/all", authenticateJWT, getAllNotificationsController);

module.exports = router;