'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDiscount extends Model {
    static associate(models) {}
  }
  UserDiscount.init({}, {
    sequelize,
    modelName: 'UserDiscount',
    tableName: 'UserDiscounts',
    timestamps: false,
  });
  return UserDiscount;
};
