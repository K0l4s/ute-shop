'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserFreeship extends Model {
    static associate(models) {}
  }
  UserFreeship.init({}, {
    sequelize,
    modelName: 'UserFreeship',
    timestamps: false,
  });
  return UserFreeship;
};
