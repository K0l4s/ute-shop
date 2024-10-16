'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        

        onDelete: 'CASCADE',
        allowNull: false
      },
      bill_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Bills',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      discount_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Discounts',
          key: 'id'
        },
        allowNull: true
      },
      freeship_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Freeships',
          key: 'id'
        },
        allowNull: true
      },
      total_price: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      order_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      shipping_address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      shipping_method: {
        type: Sequelize.ENUM('STANDARD', 'EXPRESS'),
        allowNull: false,
        defaultValue: 'STANDARD'
      },
      shipping_fee: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'PENDING'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    }, {
      timestamps: false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
  }
};