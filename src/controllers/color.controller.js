const Color = require('../models/Color');

// Get all colors
exports.getAllColors = async (req, res) => {
  try {
    const colors = await Color.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(colors);
  } catch (error) {
    console.error('Error fetching colors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching colors',
      error: error.message
    });
  }
};

// Get color by ID
exports.getColorById = async (req, res) => {
  try {
    const color = await Color.findByPk(req.params.id);
    if (!color) {
      return res.status(404).json({
        success: false,
        message: 'Color not found'
      });
    }
    res.json(color);
  } catch (error) {
    console.error('Error fetching color:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching color',
      error: error.message
    });
  }
};

// Create color
exports.createColor = async (req, res) => {
  try {
    const { color_name, color_code } = req.body;

    const color = await Color.create({
      color_name,
      color_code
    });

    res.status(201).json({
      success: true,
      message: 'Color created successfully',
      data: color
    });
  } catch (error) {
    console.error('Error creating color:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating color',
      error: error.message
    });
  }
};

// Update color
exports.updateColor = async (req, res) => {
  try {
    const color = await Color.findByPk(req.params.id);
    if (!color) {
      return res.status(404).json({
        success: false,
        message: 'Color not found'
      });
    }

    const { color_name, color_code } = req.body;

    await color.update({
      color_name: color_name || color.color_name,
      color_code: color_code || color.color_code
    });

    res.json({
      success: true,
      message: 'Color updated successfully',
      data: color
    });
  } catch (error) {
    console.error('Error updating color:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating color',
      error: error.message
    });
  }
};

// Delete color
exports.deleteColor = async (req, res) => {
  try {
    const color = await Color.findByPk(req.params.id);
    if (!color) {
      return res.status(404).json({
        success: false,
        message: 'Color not found'
      });
    }

    await color.destroy();

    res.json({
      success: true,
      message: 'Color deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting color:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting color',
      error: error.message
    });
  }
};

// Bulk delete colors
exports.bulkDeleteColors = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of color IDs'
      });
    }

    await Color.destroy({
      where: {
        id: ids
      }
    });

    res.json({
      success: true,
      message: 'Colors deleted successfully'
    });
  } catch (error) {
    console.error('Error bulk deleting colors:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk deleting colors',
      error: error.message
    });
  }
}; 