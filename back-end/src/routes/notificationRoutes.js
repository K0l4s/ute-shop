const express = require("express");
const { getAllNotificationsController, readAllNotificationsController } = require("../controllers/notificationController");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/all", authenticateJWT, getAllNotificationsController);
router.put("/read-all", authenticateJWT, readAllNotificationsController);
module.exports = router;