'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Restaurant.belongsTo(models.RestaurantCategory, { foreignKey: 'categoryId', as: 'category' });
      Restaurant.hasMany(models.Dish, { foreignKey: 'restaurantId', as: 'dishes' });
    }
  }
  Restaurant.init({
    name: DataTypes.STRING,
    address: DataTypes.TEXT,
    categoryId: {
      type: DataTypes.INTEGER,
      field: 'category_id'
    },
    image: DataTypes.STRING,
    averageRating: {
      type: DataTypes.FLOAT,
      field: 'average_rating'
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'Restaurant',
    underscored: true
  });
  return Restaurant;
};