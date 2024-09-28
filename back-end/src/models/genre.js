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
      // Nhiều-nhiều giữa Genre và Book qua bảng book_genre
      Genre.belongsToMany(models.Book, {
        through: models.book_genre, // Bảng trung gian
        foreignKey: 'genreId',
        otherKey: 'bookId',
      })
    }
  }
  Genre.init({
    name: DataTypes.STRING,
    desc: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Genre',
    timestamps: false,
  });
  return Genre;
};