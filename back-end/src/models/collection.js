'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Collection extends Model {
    static associate(models) {
      Collection.belongsTo(models.Book, {
        foreignKey: 'book_id'
      });
      Collection.hasMany(models.Collection_Book, {
        foreignKey: 'collection_id',
        as: 'collection_books'
      });
    }
  }

  Collection.init({
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    wallpaper_img: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Collection',
    timestamps: false
  });

  return Collection;
};
