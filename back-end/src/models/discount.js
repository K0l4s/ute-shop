const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Discount extends Model {
    static associate(models) {
      Discount.belongsToMany(models.User, { through: 'UserDiscounts', as: 'users' });
    }
  }
  Discount.init({
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    discount_val: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    discount_perc: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    min_order_val: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    desc: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Discount',
    tableName: 'Discounts',
  });
  return Discount;
};