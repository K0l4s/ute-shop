const express = require("express");
const { getPublishersController,createPublisherController, updatePublisherController } = require("../controllers/publisherController");

const router = express.Router();

// Endpoint để tìm kiếm và lọc sách với phân trang
router.get("/all", getPublishersController);
router.post("/", createPublisherController);
router.put("/", updatePublisherController);
module.exports = router;