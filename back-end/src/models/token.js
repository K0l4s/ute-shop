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
  expired: DataTypes.BOOLEAN,
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // References the Users table
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

export default Token;
