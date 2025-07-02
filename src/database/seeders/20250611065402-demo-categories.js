'use strict';

const { Op } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, check if categories already exist
    const existingCategories = await queryInterface.sequelize.query(
      'SELECT id FROM categories LIMIT 1',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // If categories already exist, skip seeding
    if (existingCategories && existingCategories.length > 0) {
      console.log('Categories already exist, skipping seeding');
      return;
    }

    // First, create parent categories
    await queryInterface.bulkInsert('categories', [
      {
        id: 1,
        name: 'Electronics',
        description: 'Electronic devices and accessories',
        slug: 'electronics',
        status: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'Clothing',
        description: 'Fashion and apparel',
        slug: 'clothing',
        status: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Then, create child categories
    await queryInterface.bulkInsert('categories', [
      {
        id: 99, // ✅ NEW category
        name: 'Home Appliances',
        description: 'Appliances for home use',
        slug: 'home-appliances',
        status: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Home Appliances subcategories
      {
        name: 'Refrigerators',
        description: 'All types of refrigerators',
        slug: 'refrigerators',
        status: true,
        parent_id: 99,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Washing Machines',
        description: 'All types of washing machines',
        slug: 'washing-machines',
        status: true,
        parent_id: 99,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Air Conditioners & Coolers',
        description: 'Air conditioners and coolers',
        slug: 'air-conditioners-coolers',
        status: true,
        parent_id: 99,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Kitchen Appliances',
        description: 'Kitchen appliances',
        slug: 'kitchen-appliances',
        status: true,
        parent_id: 99,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Televisions',
        description: 'All types of televisions',
        slug: 'televisions',
        status: true,
        parent_id: 99,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Fans & Other appliances',
        description: 'Fans and other appliances',
        slug: 'fans-other',
        status: true,
        parent_id: 99,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        name: 'Men\'s Clothing',
        description: 'Men\'s fashion and apparel',
        slug: 'mens-clothing',
        status: true,
        parent_id: 2, // Clothing
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        name: 'Women\'s Clothing',
        description: 'Women\'s fashion and apparel',
        slug: 'womens-clothing',
        status: true,
        parent_id: 2, // Clothing
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // First, set all parent_id to NULL
    await queryInterface.bulkUpdate('categories', 
      { parent_id: null },
      { parent_id: { [Op.ne]: null } }
    );
    
    // Only delete the demo data, not all categories
    await queryInterface.bulkDelete('categories', {
      id: {
        [Sequelize.Op.in]: [1, 2, 3, 4, 5, 6] // Only delete the demo categories
      }
    });
  }
};
