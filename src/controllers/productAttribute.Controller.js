const { ProductAttribute } = require('../models');

exports.create = async (req, res) => {
  try {
    const { product_id, attribute_name, attribute_value } = req.body;
    const attribute = await ProductAttribute.create({ product_id, attribute_name, attribute_value });
    res.status(201).json(attribute);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const attributes = await ProductAttribute.findAll({ where: { product_id } });
    res.json(attributes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ProductAttribute.update(req.body, { where: { id } });
    res.json({ message: 'Updated', updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductAttribute.destroy({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
