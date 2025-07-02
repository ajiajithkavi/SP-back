'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new columns to users table
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    });

    await queryInterface.addColumn('users', 'last_login', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // First, update any existing roles to valid enum values
    await queryInterface.sequelize.query(`
      UPDATE users 
      SET role = 'user' 
      WHERE role NOT IN ('user', 'admin', 'ecommerce_admin', 'grocery_admin', 'taxi_admin', 'hotel_admin', 'restaurant_admin')
    `);

    // Update role enum to include new role types
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('user', 'admin', 'ecommerce_admin', 'grocery_admin', 'taxi_admin', 'hotel_admin', 'restaurant_admin'),
      defaultValue: 'user',
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove added columns if they exist
    const table = await queryInterface.describeTable('users');
    if (table.status) {
      await queryInterface.removeColumn('users', 'status');
    }
    if (table.last_login) {
      await queryInterface.removeColumn('users', 'last_login');
    }

    // First, update any roles back to basic types
    await queryInterface.sequelize.query(`
      UPDATE users 
      SET role = 'user' 
      WHERE role NOT IN ('user', 'admin')
    `);

    // Revert role enum to original
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('user', 'admin'),
      defaultValue: 'user',
      allowNull: false
    });
  }
}; 