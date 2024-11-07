const express = require("express");
const { getPublishersController,createPublisherController } = require("../controllers/publisherController");

const router = express.Router();

// Endpoint để tìm kiếm và lọc sách với phân trang
router.get("/all", getPublishersController);
router.post("/", createPublisherController);
module.exports = router;