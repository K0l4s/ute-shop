const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Image.belongsTo(models.Book, {
        foreignKey: 'book_id'
      });
    }
  }
  Image.init({
    url: DataTypes.STRING,
    book_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Books',
        key: 'id'
      }
    }
  },
    {
      sequelize,
      modelName: 'Image',
      timestamps: false
    });
  return Image;
};