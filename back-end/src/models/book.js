'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      // Many-to-Many với Genre
      Book.belongsToMany(models.Genre, {
        through: 'BookGenre', // Bảng trung gian
        foreignKey: 'bookId',
        as: 'genres'
      });
    }
  }
  Book.init({
    ISBN: DataTypes.STRING,
    title: DataTypes.STRING,
    desc: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    year: DataTypes.DATE,
    stock: DataTypes.INTEGER,
    cover_img_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};