'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.Bill, {
        foreignKey: 'bill_id'
      });
      Order.belongsTo(models.Book, {
        foreignKey: 'book_id',
        targetKey: 'id'
      });
      Order.belongsTo(models.Voucher, {
        foreignKey: 'voucher_id'
      });
    }
  }
  Order.init({
    quantity: DataTypes.INTEGER,
    bill_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Bill',
        key: 'id'
      }
    },
    book_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Books',
        key: 'id'
      }
    },
    voucher_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Voucher',
        key: 'id'
      }
    }
    
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};