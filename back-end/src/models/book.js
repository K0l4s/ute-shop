'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here 
      Book.belongsTo(models.Publisher, {
        foreignKey: 'publisher_id'
      });
      Book.hasMany(models.Review, {
        foreignKey: 'book_id'
      });
      Book.belongsTo(models.Author, {
        foreignKey: 'author_id'
      });
      Book.belongsTo(models.Category, {
        foreignKey: 'category_id'
      });
      Book.hasMany(models.Collection_book, {
        foreignKey: 'book_id'
      });
      
    }
  }
  Book.init({
    ISBN: DataTypes.STRING,
    title: DataTypes.STRING,
    desc: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    salePrice: DataTypes.DECIMAL,
    year: DataTypes.DATE,
    stock: DataTypes.INTEGER,
    cover_img_url: DataTypes.STRING,
    publisher_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Publisher',
        key: 'id'
      }
    },
    author_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Author',
        key: 'id'
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Category',
        key: 'id'
      }
    },
    
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};