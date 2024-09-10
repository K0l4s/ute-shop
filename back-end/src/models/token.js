import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/configdb.js';
import TokenType from '../enums/tokenType.js';

class Token extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
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
  expired: DataTypes.BOOLEAN
}, {
  sequelize,
  modelName: 'Token',
});

export default Token;
