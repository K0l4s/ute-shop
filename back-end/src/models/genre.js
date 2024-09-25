'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Genre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Many-to-Many với Book
      Genre.belongsToMany(models.Book, {
        through: 'BookGenre', // Bảng trung gian
        foreignKey: 'genreId',
        as: 'books'
      });
    }
  }
  Genre.init({
    name: DataTypes.STRING,
    desc: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Genre',
    timestamps:false
  });
  return Genre;
};