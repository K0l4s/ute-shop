'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserFreeships', {
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        primaryKey: true
      },
      freeship_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Freeships', key: 'id' },
        onDelete: 'CASCADE',
        primaryKey: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserFreeships');
  }
};
