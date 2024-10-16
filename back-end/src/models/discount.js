const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Discount extends Model {
    static associate(models) {
      // define association here
    }
  }
  Discount.init({
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    value: DataTypes.DECIMAL,
    desc: DataTypes.STRING,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Discount',
  });
  return Discount;
};