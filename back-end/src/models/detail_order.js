const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Detail_Order extends Model {
    static associate(models) {
      Detail_Order.belongsTo(models.Order, {
        foreignKey: 'order_id',
        as: 'order'
      });

      Detail_Order.belongsTo(models.Book, {
        foreignKey: 'book_id',
        as: 'book'
      });
    }
  }
  Detail_Order.init({
    order_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Orders',
        key: 'id'
      },
      allowNull: false
    },
    book_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Books',
        key: 'id'
      },
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Detail_Order',
    tableName: 'Detail_Orders',
    timestamps: false
  });
  return Detail_Order;
};