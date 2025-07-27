'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    static associate(models) {
      Wallet.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Wallet.init({
    userId: DataTypes.INTEGER,
    coins: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Wallet',
    tableName: 'Wallets',
    timestamps: false
  });
  return Wallet;
};