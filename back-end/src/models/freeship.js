'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Freeship extends Model {
    static associate(models) {
      // define association here
    }
  }
  Freeship.init({
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
    modelName: 'Freeship',
  });
  return Freeship;
};