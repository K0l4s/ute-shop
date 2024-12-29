'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserFreeship extends Model {
    static associate(models) {}
  }
  UserFreeship.init({}, {
    sequelize,
    modelName: 'UserFreeship',
    tableName: 'UserFreeships',
    timestamps: false,
  });
  return UserFreeship;
};
