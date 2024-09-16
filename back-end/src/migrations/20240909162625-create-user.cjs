'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Use dynamic import to load the module
    const Role = (await import('../enums/role.js')).default;
    
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullname: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      birthday: {
        type: Sequelize.DATE
      },
      avatar_url: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.BOOLEAN
      },
      code: {
        type: Sequelize.INTEGER
      },
      role: {
        type: Sequelize.ENUM(Role.CUSTOMER, Role.ADMIN),
        allowNull: false,
        defaultValue: Role.CUSTOMER,
      },
    }, {
      timestamps: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};