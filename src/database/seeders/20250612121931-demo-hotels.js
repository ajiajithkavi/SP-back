'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('hotels', [
      {
        id: 1,
        name: 'Grand Hotel',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        description: 'Luxury hotel in downtown',
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Seaside Resort',
        address: '456 Ocean Dr',
        city: 'Miami',
        state: 'FL',
        country: 'USA',
        description: 'Beachfront resort with ocean views',
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('hotels', null, {});
  }
}; 