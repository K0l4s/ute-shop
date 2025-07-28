'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Categories', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL of the category image'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Categories', 'image_url');
  }
};
