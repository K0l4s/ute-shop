const express = require("express");
const { getDashboard } = require("../controllers/analystController");

const router = express.Router();

router.get('/dashboard', getDashboard);


module.exports = router;
