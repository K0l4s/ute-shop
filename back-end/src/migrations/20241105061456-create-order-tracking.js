'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderTrackings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Orders',
          key: 'id',
        },
      },
      confirmedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      processedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      deliveredAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      shippedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      canceledAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      returnedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }, {
      timestamps: false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderTrackings');
  }
};