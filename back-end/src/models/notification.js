const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      
      Notification.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order',
        allowNull: true
      });
    }
  }
  Notification.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      allowNull: false
    },
    order_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Orders',
        key: 'id',
      },
      allowNull: true // if null => not order notifications
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    type: {
      type: DataTypes.ENUM('ORDER_UPDATE', 'PROMOTION', 'SYSTEM'), // Loại thông báo
      allowNull: false,
      defaultValue: 'ORDER_UPDATE'
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'Notifications',
    timestamps: false
  });
  return Notification;
};