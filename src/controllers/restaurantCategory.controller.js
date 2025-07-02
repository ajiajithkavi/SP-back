const { RestaurantCategory } = require('../models');
const { processImage } = require('../utils/imageProcessor');

module.exports = {
  // List all categories
  async getAll(req, res) {
    try {
      const categories = await RestaurantCategory.findAll();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
    }
  },

  // Get category by ID
  async getById(req, res) {
    try {
      const category = await RestaurantCategory.findByPk(req.params.id);
      if (!category) return res.status(404).json({ error: 'Category not found' });
      res.json(category);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch category', details: err.message });
    }
  },

  // Create category
  async create(req, res) {
    try {
      const { name, description, status } = req.body;
      
      // Handle image upload
      let imagePath = null;
      if (req.file) {
        const processedImage = await processImage(req.file, {}, 'restaurant_categories');
        imagePath = `/uploads/restaurant_categories/${processedImage.filename}`;
      }

      const category = await RestaurantCategory.create({ 
        name, 
        description, 
        image: imagePath,
        status: status === 'true' || status === true
      });
      
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ error: 'Failed to create category', details: err.message });
    }
  },

  // Update category
  async update(req, res) {
    try {
      const { name, description, status } = req.body;
      const category = await RestaurantCategory.findByPk(req.params.id);
      
      if (!category) return res.status(404).json({ error: 'Category not found' });
      
      // Handle image upload
      let imagePath = category.image; // Keep existing image if no new one
      if (req.file) {
        const processedImage = await processImage(req.file, {}, 'restaurant_categories');
        imagePath = `/uploads/restaurant_categories/${processedImage.filename}`;
      }

      await category.update({ 
        name, 
        description, 
        image: imagePath,
        status: status === 'true' || status === true
      });
      
      res.json(category);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update category', details: err.message });
    }
  },

  // Delete category
  async delete(req, res) {
    try {
      const category = await RestaurantCategory.findByPk(req.params.id);
      if (!category) return res.status(404).json({ error: 'Category not found' });
      await category.destroy();
      res.json({ message: 'Category deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete category', details: err.message });
    }
  }
}; 