const db = require('../models');
const Wallet = db.Wallet;
const User = db.User;

const getWallet = async (userId) => {
  try {
    const wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    return wallet;
  } catch (error) {
    throw new Error(`Failed to retrieve wallet: ${error.message}`);
  }
};


const addBalance = async (userId, amount) => {
  try {
    const wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    wallet.coins += amount;
    await wallet.save();
    return wallet;
  } catch (error) {
    throw new Error(`Failed to add balance to wallet: ${error.message}`);
  }
};

const createWallet = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const wallet = await Wallet.create({ userId });
    return wallet;
  } catch (error) {
    throw new Error(`Failed to create wallet: ${error.message}`);
  }
};

module.exports = {
  getWallet,
  addBalance,
  createWallet
}