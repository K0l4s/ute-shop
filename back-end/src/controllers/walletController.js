const { getWallet, addBalance, createWallet } = require("../services/walletService");

const getUserWallet = async (req, res) => {
  const userId = req.user.id;
  try {
    const wallet = await getWallet(userId);
    res.status(200).json({
      message: "Success",
      data: wallet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addBalanceToWallet = async (req, res) => {
  const userId = req.user.id;
  const amount = req.body.amount;

  try {
    const data = await addBalance(userId, amount);
    res.status(200).json({
      message: "Success",
      data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createNewWallet = async (req, res) => {
  const userId = req.user.id;
  try {
    const wallet = await createWallet(userId);
    res.status(200).json({
      message: "Success",
      data: wallet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserWallet,
  addBalanceToWallet,
  createNewWallet
}