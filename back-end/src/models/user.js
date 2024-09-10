'use strict';
const {
  Model
} = require('sequelize');

const Role = require('../enums/role.js');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    fullname: DataTypes.STRING,
    address: DataTypes.STRING,
    birthday: DataTypes.DATE,
    avatar_url: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    role: {
      type: DataTypes.ENUM(Role.CUSTOMER, Role.ADMIN),
      allowNull: false,
      defaultValue: Role.CUSTOMER
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};