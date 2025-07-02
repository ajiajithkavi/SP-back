'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('groceries', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      original_price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      discounted_price: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      is_best_seller: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('groceries');
  }
};
