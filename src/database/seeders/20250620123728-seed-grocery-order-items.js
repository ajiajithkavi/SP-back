'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('grocery_order_items', [
      {
        order_id: 1,
        grocery_id: 1,
        quantity: 2,
        original_price: 100.00,
        discounted_price: 75.00,
        name: 'Basmati Rice 5kg',
        image: 'rice5kg.jpg',
        category: 'Grains',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('grocery_order_items', null, {});
  }
};
