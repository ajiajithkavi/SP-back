'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('bookings', [
      {
        id: 1,
        user_id: 1,
        room_id: 1,
        check_in: new Date('2024-06-15'),
        check_out: new Date('2024-06-20'),
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        user_id: 2,
        room_id: 2,
        check_in: new Date('2024-06-16'),
        check_out: new Date('2024-06-18'),
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('bookings', null, {});
  }
}; 