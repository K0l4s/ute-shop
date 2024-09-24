'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ISBN: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      desc: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DECIMAL
      },
      salePrice: {
        type: Sequelize.DECIMAL
      },
      year: {
        type: Sequelize.DATE
      },
      stock: {
        type: Sequelize.INTEGER
      },
      cover_img_url: {
        type: Sequelize.STRING
      },
      publisher_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Publishers',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Books');
  }
};