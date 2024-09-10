'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Token.init({
    token: DataTypes.STRING,
    tokenType: {
      type: DataTypes.ENUM(TokenType.BEARER),
      allowNull: false,
      defaultValue: TokenType.BEARER
    },
    revoked: DataTypes.BOOLEAN,
    expired: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Token',
  });
  return Token;
};