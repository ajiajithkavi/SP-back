const { Category } = require('../models');
const { processImage } = require('../utils/imageProcessor');
const path = require('path');
const slugify = require('slugify');
const fs = require('fs');
const db = require('../config/database');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Category,
          as: 'subcategories',
          include: [
            {
              model: Category,
              as: 'subcategories'
            }
          ]
        }
      ],
      where: {
        parent_id: null
      }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'subcategories',
          include: [
            {
              model: Category,
              as: 'subcategories'
            }
          ]
        }
      ]
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, parent_id, status, meta_title, meta_description } = req.body;
    let imagePath = null;

    if (req.file) {
      const processedImage = await processImage(req.file, {
        width: 800,
        height: 800,
        quality: 85,
        format: 'jpeg'
      }, 'categories');
      // Use the web-accessible URL path
      imagePath = `/uploads/categories/${processedImage.filename}`;
    }

    const category = await Category.create({
      name,
      description,
      slug: slugify(name, { lower: true }),
      image: imagePath,
      status: typeof status !== 'undefined' ? (String(status) === 'true') : true,
      parent_id: parent_id || null,
      meta_title,
      meta_description
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Category creation error:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors ? error.errors.map(e => e.message) : [error.message]
      });
    }
    return res.status(500).json({
      message: 'An unexpected error occurred while creating the category.',
      error: error.message
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, description, parent_id, status, meta_title, meta_description } = req.body;
    let imagePath = category.image;

    if (req.file) {
      // Delete old image if it exists
      if (category.image) {
        const oldImagePath = path.join(__dirname, '..', '..', 'uploads', category.image.replace('/uploads/', ''));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      const processedImage = await processImage(req.file, {
        width: 800,
        height: 800,
        quality: 85,
        format: 'jpeg'
      }, 'categories');
      // Use the web-accessible URL path
      imagePath = `/uploads/categories/${processedImage.filename}`;
    }

    // Explicitly handle boolean conversion for status
    const newStatus = typeof status !== 'undefined' ? (String(status) === 'true') : category.status;

    await category.update({
      name: name || category.name,
      description: description || category.description,
      slug: name ? slugify(name, { lower: true }) : category.slug,
      image: imagePath,
      status: newStatus,
      parent_id: parent_id || category.parent_id,
      meta_title: meta_title || category.meta_title,
      meta_description: meta_description || category.meta_description
    });

    res.json(category);
  } catch (error) {
    console.error('Category update error:', error);
    res.status(500).json({ 
        message: 'An unexpected error occurred while updating the category.',
        error: error.message 
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    console.log('Attempting to delete category:', req.params.id);
    
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'subcategories'
        }
      ]
    });
    
    if (!category) {
      console.log('Category not found:', req.params.id);
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has subcategories
    if (category.subcategories && category.subcategories.length > 0) {
      console.log('Category has subcategories:', category.subcategories.length);
      return res.status(400).json({
        message: 'Cannot delete category with subcategories. Please delete or reassign subcategories first.'
      });
    }

    // Check if category has associated products using raw query
    try {
      const [products] = await db.query(
        'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
        {
          replacements: [req.params.id],
          type: db.QueryTypes.SELECT
        }
      );

      console.log('Products count:', products.count);

      if (products.count > 0) {
        return res.status(400).json({
          message: 'Cannot delete category with associated products. Please delete or reassign products first.'
        });
      }
    } catch (queryError) {
      console.error('Error checking products:', queryError);
      // If products table doesn't exist or other DB error, continue with deletion
    }

    // Delete category image if exists
    if (category.image) {
      const imagePath = path.join(__dirname, '..', '..', 'uploads', category.image.replace('/uploads/', ''));
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log('Category image deleted:', imagePath);
        } catch (unlinkError) {
          console.error('Error deleting image file:', unlinkError);
          // Continue with category deletion even if image deletion fails
        }
      }
    }

    await category.destroy();
    console.log('Category deleted successfully:', req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        message: 'Cannot delete category because it has associated items. Please remove these associations first.'
      });
    }

    // Send more detailed error information
    res.status(500).json({ 
      message: 'Failed to delete category: ' + error.message,
      error: {
        name: error.name,
        details: error.original ? error.original.message : error.message
      }
    });
  }
};

// Toggle category status
exports.toggleStatus = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.status = category.status === 'active' ? 'inactive' : 'active';
    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 