const { Model, DataTypes } = require('sequelize');
const Role = require('../enums/role.js');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Token, { foreignKey: 'userId', as: 'tokens' });
      User.hasMany(models.Review, { foreignKey: 'userId', as: 'reviews' });
      User.hasMany(models.Cart, { foreignKey: 'user_id', as: 'carts' });
      User.hasMany(models.Order, { foreignKey: 'user_id', as: 'orders' });
    }
  }

  User.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    province: DataTypes.STRING, // tỉnh thành / phố
    district: DataTypes.STRING, // quận / huyện
    ward: DataTypes.STRING, // xã / phường
    address: DataTypes.STRING,
    birthday: DataTypes.DATEONLY,
    gender: DataTypes.BOOLEAN,
    avatar_url: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    code: DataTypes.INTEGER,
    role: {
      type: DataTypes.ENUM(Role.CUSTOMER, Role.ADMIN),
      allowNull: false,
      defaultValue: Role.CUSTOMER
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false
  });

  return User;
};
