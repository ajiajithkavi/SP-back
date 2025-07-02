'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('grocery_orders', [
      {
        user_id: 1,
        total_amount: 150.00,
        status: 'pending',
        payment_status: 'pending',
        shipping_address: '123 Example Street, Chennai',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('grocery_orders', null, {});
  }
};

