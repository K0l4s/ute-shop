const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      Cart.belongsTo(models.Book, {
        foreignKey: 'book_id',
        as: 'book'
      });
    }
  }
  Cart.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
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
    }
  }, {
    sequelize,
    modelName: 'Cart',
    timestamps: false
  });
  return Cart;
};