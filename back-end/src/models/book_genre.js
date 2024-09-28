'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Book_Genre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book_Genre.init({
    bookId: DataTypes.INTEGER,
    genreId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book_Genre',
    timestamps: false,
  });
  return Book_Genre;
};