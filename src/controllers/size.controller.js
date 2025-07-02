const Size = require('../models/Size');

// Get all sizes
exports.getAllSizes = async (req, res) => {
  try {
    const sizes = await Size.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(sizes);
  } catch (error) {
    console.error('Error fetching sizes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sizes',
      error: error.message
    });
  }
};

// Get size by ID
exports.getSizeById = async (req, res) => {
  try {
    const size = await Size.findByPk(req.params.id);
    if (!size) {
      return res.status(404).json({
        success: false,
        message: 'Size not found'
      });
    }
    res.json(size);
  } catch (error) {
    console.error('Error fetching size:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching size',
      error: error.message
    });
  }
};

// Create size
exports.createSize = async (req, res) => {
  try {
    const { size_name } = req.body;

    const size = await Size.create({
      size_name
    });

    res.status(201).json({
      success: true,
      message: 'Size created successfully',
      data: size
    });
  } catch (error) {
    console.error('Error creating size:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating size',
      error: error.message
    });
  }
};

// Update size
exports.updateSize = async (req, res) => {
  try {
    const size = await Size.findByPk(req.params.id);
    if (!size) {
      return res.status(404).json({
        success: false,
        message: 'Size not found'
      });
    }

    const { size_name } = req.body;

    await size.update({
      size_name: size_name || size.size_name
    });

    res.json({
      success: true,
      message: 'Size updated successfully',
      data: size
    });
  } catch (error) {
    console.error('Error updating size:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating size',
      error: error.message
    });
  }
};

// Delete size
exports.deleteSize = async (req, res) => {
  try {
    const size = await Size.findByPk(req.params.id);
    if (!size) {
      return res.status(404).json({
        success: false,
        message: 'Size not found'
      });
    }

    await size.destroy();

    res.json({
      success: true,
      message: 'Size deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting size:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting size',
      error: error.message
    });
  }
};

// Bulk delete sizes
exports.bulkDeleteSizes = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of size IDs'
      });
    }

    await Size.destroy({
      where: {
        id: ids
      }
    });

    res.json({
      success: true,
      message: 'Sizes deleted successfully'
    });
  } catch (error) {
    console.error('Error bulk deleting sizes:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk deleting sizes',
      error: error.message
    });
  }
}; 