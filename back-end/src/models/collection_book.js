'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Collection_Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Collection_Book.belongsTo(models.Collection, {
        foreignKey: 'collection_id'
      });
      Collection_Book.belongsTo(models.Book, {
        foreignKey: 'book_id'
      });
    }
  }
  Collection_Book.init({
    Collection_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Collection',
        key: 'id'
      }
    },
    Book_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Book',
        key: 'id'
      }
    },
  }, {
    sequelize,
    modelName: 'Collection_Book',
  });
  return Collection_Book;
};