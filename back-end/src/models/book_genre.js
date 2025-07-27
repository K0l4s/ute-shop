const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Book_Genre extends Model {
    static associate(models) {
      // Define associations here if needed
      // Book_Genre.hasMany(models.Book, {
      //   foreignKey: 'bookId',
      //   as: 'books'
      // });
      // Book_Genre.hasMany(models.Genre, {
      //   foreignKey: 'genreId',
      //   as: 'genres'
      // });
    }
  }

  Book_Genre.init({
    bookId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Books',
        key: 'id'
      }
    },
    genreId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Genres',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Book_Genre',
    tableName: 'Book_Genres',
    timestamps: false
  });

  return Book_Genre;
};
