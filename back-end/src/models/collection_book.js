'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Collection_Book extends Model {
    static associate(models) {
      Collection_Book.belongsTo(models.Collection, {
        foreignKey: 'collection_id',
        as: 'collection'
      });
      Collection_Book.belongsTo(models.Book, {
        foreignKey: 'book_id',
        as: 'book'
      });
    }
  }

  Collection_Book.init({
    collection_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Collections',
        key: 'id'
      }
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Books',
        key: 'id'
      }
    },
  }, {
    sequelize,
    modelName: 'Collection_Book',
    timestamps: false
  });

  return Collection_Book;
};
