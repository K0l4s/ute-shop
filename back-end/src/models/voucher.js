'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Voucher.hasMany(models.Order, {
        foreignKey: 'voucher_id'
      });
    }
  }
  Voucher.init({
    name: DataTypes.STRING,
    salePercent: DataTypes.DOUBLE,
    expiryDate: DataTypes.DATE,
    amount: DataTypes.INTEGER,
    voucherType: DataTypes.ENUM('DATE','AMOUNT','NONE','ALL'),
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    modelName: 'Voucher',
  });
  return Voucher;
};