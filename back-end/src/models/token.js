const { Model, DataTypes } = require('sequelize');
const TokenType = require('../enums/tokenType.js');

module.exports = (sequelize) => {
  class Token extends Model {
    static associate(models) {
      Token.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
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
    expired: DataTypes.BOOLEAN,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Token',
    timestamps: false
  });

  return Token;
};
