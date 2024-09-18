import sequelize from '../config/configdb.js';
import { Model, DataTypes } from 'sequelize';
import Role from '../enums/role.js';

class User extends Model {
  static associate(models) {
    User.hasMany(models.Token, { foreignKey: 'userId', as: 'tokens' });
  }
}

User.init({
  firstname: DataTypes.STRING,
  lastname: DataTypes.STRING,
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
  timestamps: false,
});

export default User;
