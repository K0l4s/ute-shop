'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Author extends Model {
    static associate(models) {
      Author.hasMany(models.Book, {
        foreignKey: 'author_id',
        as: 'books'
      });
    }
  }

  Author.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Author',
    timestamps: false
  });

  return Author;
};
