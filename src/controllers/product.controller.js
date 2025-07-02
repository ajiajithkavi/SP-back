const Product = require('../models/Product');
const ProductVariation = require('../models/ProductVariation');
const Brand = require('../models/Brand');
const Category = require('../models/Category');
const Size = require('../models/Size');
const Color = require('../models/Color');
const Unit = require('../models/Unit');
const { processImage } = require('../utils/imageProcessor');
const path = require('path');
const fs = require('fs').promises;
const { ProductAttribute } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Brand, as: 'brand' },
        { model: Category, as: 'category' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Brand, as: 'brand' },
        { model: Category, as: 'category' }
      ]
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, brand_id, category_id, slug, sku, sale_price, stock, status, meta_title, meta_description } = req.body;
    let imagePath = null;

    // Process image if uploaded
    if (req.file) {
      const processedImage = await processImage(req.file, {}, 'products');
      imagePath = `/uploads/products/${processedImage.filename}`;
    }

    const product = await Product.create({
      name,
      description,
      slug,
      sku,
      price,
      sale_price,
      stock,
      category_id,
      brand_id,
      photo: imagePath,
      featured_image: imagePath, // Assuming photo is the featured image
      status: status === 'true' || status === true,
      meta_title,
      meta_description,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { name, description, price, brand_id, category_id, slug, sku, sale_price, stock, status, meta_title, meta_description } = req.body;
    let processedImagePath = product.photo;

    // Process new image if uploaded
    if (req.file) {
      // Delete old image if exists
      if (product.photo) {
        const oldImagePath = path.join(__dirname, '..', '..', 'uploads', product.photo.replace('/uploads/', ''));
        try {
          if (require('fs').existsSync(oldImagePath)) {
            await fs.unlink(oldImagePath);
          }
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      const processedImage = await processImage(req.file, {}, 'products');
      processedImagePath = `/uploads/products/${processedImage.filename}`;
    }

    await product.update({
      name: name || product.name,
      description: description || product.description,
      slug: slug || product.slug,
      sku: sku || product.sku,
      price: price || product.price,
      sale_price: sale_price || product.sale_price,
      stock: stock || product.stock,
      brand_id: brand_id || product.brand_id,
      category_id: category_id || product.category_id,
      photo: processedImagePath,
      featured_image: processedImagePath,
      status: typeof status !== 'undefined' ? (String(status) === 'true') : product.status,
      meta_title: meta_title || product.meta_title,
      meta_description: meta_description || product.meta_description
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete product image if exists
    if (product.photo) {
      const imagePath = path.join(__dirname, '..', '..', 'uploads', product.photo.replace('/uploads/', ''));
      try {
        if (require('fs').existsSync(imagePath)) {
          await fs.unlink(imagePath);
        }
      } catch (error) {
        console.error('Error deleting product image:', error);
      }
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// Bulk delete products
exports.bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of product IDs'
      });
    }

    // Find all products to get their image paths
    const products = await Product.findAll({
      where: {
        id: ids
      }
    });

    // Delete product images
    for (const product of products) {
      if (product.photo) {
        const imagePath = path.join(__dirname, '..', '..', 'uploads', product.photo.replace('/uploads/', ''));
        try {
          if (require('fs').existsSync(imagePath)) {
            await fs.unlink(imagePath);
          }
        } catch (error) {
          console.error(`Error deleting image for product ${product.id}:`, error);
        }
      }
    }

    // Delete products from database
    await Product.destroy({
      where: {
        id: ids
      }
    });

    res.json({
      success: true,
      message: 'Products deleted successfully'
    });
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk deleting products',
      error: error.message
    });
  }
};

// Get product variation by ID
exports.getProductVariationById = async (req, res) => {
  try {
    const variation = await ProductVariation.findByPk(req.params.id, {
      include: [
        { model: Product, as: 'product' },
        { model: Size, as: 'size' },
        { model: Color, as: 'color' },
        { model: Unit, as: 'unit' }
      ]
    });
    if (!variation) {
      return res.status(404).json({
        success: false,
        message: 'Product variation not found'
      });
    }
    res.json(variation);
  } catch (error) {
    console.error('Error fetching product variation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product variation',
      error: error.message
    });
  }
};

// Get all product variations
exports.getAllProductVariations = async (req, res) => {
  try {
    const variations = await ProductVariation.findAll({
      include: [
        { model: Product, as: 'product' },
        { model: Size, as: 'size' },
        { model: Color, as: 'color' },
        { model: Unit, as: 'unit' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(variations);
  } catch (error) {
    console.error('Error fetching product variations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product variations',
      error: error.message
    });
  }
};

// Create product variation
exports.createProductVariation = async (req, res) => {
  try {
    const { product_id, size_id, color_id, unit_id, price, stock, sku } = req.body;

    const variation = await ProductVariation.create({
      product_id,
      size_id,
      color_id,
      unit_id,
      price,
      stock,
      sku
    });

    res.status(201).json({
      success: true,
      message: 'Product variation created successfully',
      data: variation
    });
  } catch (error) {
    console.error('Error creating product variation:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product variation',
      error: error.message
    });
  }
};

// Update product variation
exports.updateProductVariation = async (req, res) => {
  try {
    const variation = await ProductVariation.findByPk(req.params.id);
    if (!variation) {
      return res.status(404).json({
        success: false,
        message: 'Product variation not found'
      });
    }

    const { product_id, size_id, color_id, unit_id, price, stock, sku } = req.body;

    await variation.update({
      product_id: product_id || variation.product_id,
      size_id: size_id || variation.size_id,
      color_id: color_id || variation.color_id,
      unit_id: unit_id || variation.unit_id,
      price: price || variation.price,
      stock: stock || variation.stock,
      sku: sku || variation.sku
    });

    res.json({
      success: true,
      message: 'Product variation updated successfully',
      data: variation
    });
  } catch (error) {
    console.error('Error updating product variation:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product variation',
      error: error.message
    });
  }
};

// Delete product variation
exports.deleteProductVariation = async (req, res) => {
  try {
    const variation = await ProductVariation.findByPk(req.params.id);
    if (!variation) {
      return res.status(404).json({
        success: false,
        message: 'Product variation not found'
      });
    }

    await variation.destroy();

    res.json({
      success: true,
      message: 'Product variation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product variation:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product variation',
      error: error.message
    });
  }
};

// Bulk delete product variations
exports.bulkDeleteProductVariations = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of product variation IDs'
      });
    }

    await ProductVariation.destroy({
      where: {
        id: ids
      }
    });

    res.json({
      success: true,
      message: 'Product variations deleted successfully'
    });
  } catch (error) {
    console.error('Error bulk deleting product variations:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk deleting product variations',
      error: error.message
    });
  }
};

// Update product variation stock
exports.updateProductVariationStock = async (req, res) => {
  try {
    const variation = await ProductVariation.findByPk(req.params.id);
    if (!variation) {
      return res.status(404).json({
        success: false,
        message: 'Product variation not found'
      });
    }

    const { stock } = req.body;

    await variation.update({
      stock: stock
    });

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: variation
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating stock',
      error: error.message
    });
  }
};

// Get stock by product variation
exports.getStockByProductVariation = async (req, res) => {
  try {
    const variation = await ProductVariation.findByPk(req.params.id, {
      attributes: ['id', 'stock', 'sku']
    });
    if (!variation) {
      return res.status(404).json({
        success: false,
        message: 'Product variation not found'
      });
    }
    res.json(variation);
  } catch (error) {
    console.error('Error fetching stock:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stock',
      error: error.message
    });
  }
};

// Delete stock management
exports.deleteStockManagement = async (req, res) => {
  try {
    const variation = await ProductVariation.findByPk(req.params.id);
    if (!variation) {
      return res.status(404).json({
        success: false,
        message: 'Stock management record not found'
      });
    }

    // Reset stock to 0 instead of deleting the record
    await variation.update({
      stock: 0
    });

    res.json({
      success: true,
      message: 'Stock management record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting stock management:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting stock management',
      error: error.message
    });
  }
};

// Appliances endpoint (custom logic)
exports.getApplianceProductsWithAttributes = async (req, res) => {
  try {
    // 1. Find the parent category
    const parent = await Category.findOne({ where: { name: 'Home Appliances' } });
    if (!parent) {
      return res.status(404).json({ success: false, message: 'Home Appliances category not found' });
    }

    // 2. Find all subcategories
    const subcategories = await Category.findAll({ where: { parent_id: parent.id } });
    const subcategoryIds = subcategories.map(cat => cat.id);

    // 3. Build dynamic filters
    const {
      search,
      minPrice,
      maxPrice,
      rating,
      brand,
      sort,
      ...attributeFilters // any other query params are treated as attribute filters
    } = req.query;

    const where = { category_id: subcategoryIds };
    if (minPrice) where.price = { ...(where.price || {}), [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...(where.price || {}), [Op.lte]: parseFloat(maxPrice) };
    if (rating) where.rating = { [Op.gte]: parseFloat(rating) };
    if (brand) {
      // support comma-separated or array
      const brands = Array.isArray(brand) ? brand : String(brand).split(',');
      where['$brand.brand_name$'] = { [Op.in]: brands };
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { '$brand.brand_name$': { [Op.like]: `%${search}%` } },
        { '$attributes.attribute_value$': { [Op.like]: `%${search}%` } }
      ];
    }

    // Attribute filters (e.g., capacity=6kg)
    const attributeFilterEntries = Object.entries(attributeFilters).filter(
      ([key]) => !['search','minPrice','maxPrice','rating','brand','sort'].includes(key)
    );
    let productIds = null;
    if (attributeFilterEntries.length > 0) {
      // Find product IDs that match all attribute filters
      const matchingAttributes = await ProductAttribute.findAll({
        where: {
          [Op.or]: attributeFilterEntries.map(([name, value]) => ({
            attribute_name: name,
            attribute_value: value
          }))
        }
      });
      // Count matches per product
      const productIdCount = {};
      matchingAttributes.forEach(attr => {
        productIdCount[attr.product_id] = (productIdCount[attr.product_id] || 0) + 1;
      });
      // Only keep products that match all filters
      productIds = Object.entries(productIdCount)
        .filter(([id, count]) => count === attributeFilterEntries.length)
        .map(([id]) => Number(id));
      if (productIds.length === 0) {
        // No products match, return empty
        return res.status(200).json({ success: true, message: 'No products found', data: [] });
      }
      where.id = { [Op.in]: productIds };
    }

    // Sorting
    let order = [['createdAt', 'DESC']];
    if (sort) {
      if (sort === 'price_asc') order = [[sequelize.col('Product.price'), 'ASC']];
      else if (sort === 'price_desc') order = [[sequelize.col('Product.price'), 'DESC']];
      else if (sort === 'newest') order = [['createdAt', 'DESC']];
      // Add more as needed
    }

    // 4. Fetch products in any subcategory with filters, always include all attributes
    const appliances = await Product.findAll({
      where,
      include: [
        { model: Category, as: 'category' },
        { model: ProductAttribute, as: 'attributes' }, // Always include all attributes
        { model: require('../models/Brand'), as: 'brand' }
      ],
      order
    });

    res.status(200).json({
      success: true,
      message: 'Appliance products fetched successfully',
      data: appliances
    });
  } catch (error) {
    console.error('Error fetching appliance products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appliance products',
      error: error.message
    });
  }
};