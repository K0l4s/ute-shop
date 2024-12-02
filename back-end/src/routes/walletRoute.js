const express = require("express");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const { getUserWallet, addBalanceToWallet, createNewWallet } = require("../controllers/walletController");

const router = express.Router();

router.get("/", authenticateJWT, getUserWallet);
router.put("/add", authenticateJWT, addBalanceToWallet);
router.post("/create", authenticateJWT, createNewWallet);
module.exports = router;
