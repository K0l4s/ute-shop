const express = require("express");
const { getDashboard } = require("../controllers/analystController");
const { authenticateJWT } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get('/dashboard',authenticateJWT, getDashboard);


module.exports = router;
