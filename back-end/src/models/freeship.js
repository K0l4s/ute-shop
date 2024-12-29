'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Freeship extends Model {
    static associate(models) {
      Freeship.belongsToMany(models.User, { through: 'UserFreeships', as: 'users' });
    }
  }
  Freeship.init({
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
    modelName: 'Freeship',
    tableName: 'Freeships',
  });
  return Freeship;
};