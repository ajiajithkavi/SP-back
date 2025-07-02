'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('brands', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      brand_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      photo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add brand_id to products table
    await queryInterface.addColumn('products', 'brand_id', {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'brands',
        key: 'id'
      },
      after: 'category_id'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove brand_id from products table
    await queryInterface.removeColumn('products', 'brand_id');
    
    // Drop brands table
    await queryInterface.dropTable('brands');
  }
}; 