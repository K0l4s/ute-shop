'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Publisher extends Model {
    static associate(models) {
      Publisher.hasMany(models.Book, {
        foreignKey: 'publisher_id', as: 'books'
      });
    }
  }

  Publisher.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Publisher',
    timestamps: false
  });

  return Publisher;
};
