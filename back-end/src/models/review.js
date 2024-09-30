'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.Book, {
        foreignKey: 'book_id'
      });
      Review.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
    }
  }

  Review.init({
    content: DataTypes.STRING,
    star: DataTypes.INTEGER,
    book_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Books',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
    timestamps: false
  });

  return Review;
};
