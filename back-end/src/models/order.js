const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      Order.hasMany(models.Detail_Order, {
        foreignKey: 'order_id',
        as: 'orderDetails',
        onDelete: 'CASCADE'
      });

      Order.belongsTo(models.Discount, {
        foreignKey: 'discount_id',
        as: 'discount'
      });

      Order.belongsTo(models.Freeship, {
        foreignKey: 'freeship_id',
        as: 'freeship'
      });
    }
  }
  Order.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      allowNull: false
    },
    discount_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Discounts',
        key: 'id'
      },
      allowNull: true
    },
    freeship_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Freeships',
        key: 'id'
      },
      allowNull: true
    },
    total_price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    shipping_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    shipping_method: {
      type: DataTypes.ENUM('STANDARD', 'EXPRESS'),
      allowNull: false,
      defaultValue: 'STANDARD'
    },
    shipping_fee: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Order',
    timestamps: false
  });
  return Order;
};