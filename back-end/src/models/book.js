'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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