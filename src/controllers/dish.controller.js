const { Dish, Restaurant } = require('../models');
const { processImage } = require('../utils/imageProcessor');

module.exports = {
  // List all dishes (optionally filter by restaurantId)
  async getAll(req, res) {
    try {
      const where = {};
      if (req.query.restaurantId) {
        // Check if the restaurant exists
        const restaurant = await Restaurant.findByPk(req.query.restaurantId);
        if (!restaurant) {
          return res.status(404).json({ error: 'Restaurant not found' });
        }
        where.restaurantId = req.query.restaurantId;
      }
      const dishes = await Dish.findAll({
        where,
        include: [{ model: Restaurant, as: 'restaurant' }]
      });
      res.json(dishes);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch dishes', details: err.message });
    }
  },

  // Get dish by ID
  async getById(req, res) {
    try {
      const dish = await Dish.findByPk(req.params.id, {
        include: [{ model: Restaurant, as: 'restaurant' }]
      });
      if (!dish) return res.status(404).json({ error: 'Dish not found' });
      res.json(dish);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch dish', details: err.message });
    }
  },

  // Create dish
  async create(req, res) {
    try {
      console.log('=== DISH CREATE DEBUG ===');
      console.log('Request body:=====================================>', req.body);
      console.log('Request file:=====================================>', req.file);
      console.log('File details:=====================================>', req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      } : 'No file uploaded');
      
      const { name, price, description, restaurantId, status } = req.body;
      
      // Handle image upload
      let imagePath = null;
      if (req.file) {
        console.log('Processing image...');
        try {
          const processedImage = await processImage(req.file, {}, 'dishes');
          console.log('Processed image result:', processedImage);
          imagePath = `/uploads/dishes/${processedImage.filename}`;
          console.log('Final image path:', imagePath);
        } catch (imageError) {
          console.error('Image processing error:', imageError);
          return res.status(400).json({ error: 'Image processing failed', details: imageError.message });
        }
      } else {
        console.log('No image file uploaded');
      }

      console.log('Creating dish with data:', {
        name, 
        price, 
        description, 
        image: imagePath, 
        restaurantId,
        status: status === 'true' || status === true
      });

      const dish = await Dish.create({ 
        name, 
        price, 
        description, 
        image: imagePath, 
        restaurantId,
        status: status === 'true' || status === true
      });
      
      console.log('Created dish:=====================================>', dish.toJSON());
      console.log('=== END DISH CREATE DEBUG ===');
      
      res.status(201).json(dish);
    } catch (err) {
      console.error('Dish creation error:', err);
      res.status(400).json({ error: 'Failed to create dish', details: err.message });
    }
  },

  // Update dish
  async update(req, res) {
    try {
      const { name, price, description, restaurantId, status } = req.body;
      const dish = await Dish.findByPk(req.params.id);
      
      if (!dish) return res.status(404).json({ error: 'Dish not found' });
      
      // Handle image upload
      let imagePath = dish.image; // Keep existing image if no new one
      if (req.file) {
        const processedImage = await processImage(req.file, {}, 'dishes');
        imagePath = `/uploads/dishes/${processedImage.filename}`;
      }

      await dish.update({ 
        name, 
        price, 
        description, 
        image: imagePath, 
        restaurantId,
        status: status === 'true' || status === true
      });
      
      // Fetch the updated dish to ensure the latest data is returned
      const updatedDish = await Dish.findByPk(req.params.id);
      res.json({ success: true, message: 'Dish updated successfully', data: updatedDish });
    } catch (err) {
      res.status(400).json({ error: 'Failed to update dish', details: err.message });
    }
  },

  // Delete dish
  async delete(req, res) {
    try {
      const dish = await Dish.findByPk(req.params.id);
      if (!dish) return res.status(404).json({ error: 'Dish not found' });
      await dish.destroy();
      res.json({ message: 'Dish deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete dish', details: err.message });
    }
  }
}; 