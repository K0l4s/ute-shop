const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class OrderTracking extends Model {
    static associate(models) {
      OrderTracking.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order'
      });
    }
  }
  OrderTracking.init({
    order_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Orders',
        key: 'id',
      },
      allowNull: false
    },
    confirmedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    shippedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    canceledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    returnedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'OrderTracking',
    timestamps: false
  });
  return OrderTracking;
};