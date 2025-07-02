'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('rooms', [
      {
        id: 1,
        hotel_id: 1,
        room_number: '101',
        type: 'Standard',
        price: 100.00,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        hotel_id: 1,
        room_number: '102',
        type: 'Deluxe',
        price: 150.00,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        hotel_id: 2,
        room_number: '201',
        type: 'Suite',
        price: 200.00,
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('rooms', null, {});
  }
}; 