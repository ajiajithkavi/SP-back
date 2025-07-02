'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Only add product_data to order_items if it doesn't exist
    try {
      await queryInterface.addColumn('order_items', 'product_data', {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {}
      });
    } catch (err) {
      if (!err.message.includes('Duplicate column name')) throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('order_items', 'product_data');
  }
}; 