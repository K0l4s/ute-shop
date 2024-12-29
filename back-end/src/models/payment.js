const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order'
      });
      Payment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  Payment.init({
    order_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    payment_date: {
      type: DataTypes.DATE,
    },
    payment_method: {
      type: DataTypes.ENUM('COD', 'VNPAY'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'COMPLETED', 'FAILED'),
      allowNull: false
    },
    transaction_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'Payments',
    timestamps: false
  });
  return Payment;
};