const express = require("express");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const { getUserWallet, addBalanceToWallet } = require("../controllers/walletController");

const router = express.Router();

router.get("/", authenticateJWT, getUserWallet);
router.put("/add", authenticateJWT, addBalanceToWallet);
module.exports = router;
