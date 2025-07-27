const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Genre extends Model {
    static associate(models) {
      Genre.belongsToMany(models.Book, {
        through: models.Book_Genre,
        foreignKey: 'genreId',
        otherKey: 'bookId',
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
    tableName: 'Genres',
    timestamps: false
  });

  return Genre;
};
