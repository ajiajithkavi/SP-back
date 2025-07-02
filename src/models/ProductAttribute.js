// models/ProductAttribute.js

const ProductAttribute = (sequelize, DataTypes) => {
  const ProductAttribute = sequelize.define('ProductAttribute', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    attribute_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    attribute_value: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'product_attributes',
    timestamps: false,
    underscored: true,
    engine: 'InnoDB',
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  });

  // Do NOT define any associations here. All associations are set in models/index.js

  return ProductAttribute;
};

module.exports = ProductAttribute;
