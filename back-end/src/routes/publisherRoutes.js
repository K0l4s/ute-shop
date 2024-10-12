const express = require("express");
const { getPublishersController } = require("../controllers/publisherController");

const router = express.Router();

// Endpoint để tìm kiếm và lọc sách với phân trang
router.get("/all", getPublishersController);

module.exports = router;