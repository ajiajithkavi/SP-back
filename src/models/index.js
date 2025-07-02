const Sequelize = require('sequelize');
const sequelize = require('../config/database');

// Classic models
const User = require('./User');
const UserProfile = require('./UserProfile');
const Category = require('./Category');
const Product = require('./Product');
const ProductVariation = require('./ProductVariation');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const OTP = require('./otp.model');
const GroceryOrder = require('./grocery_order')(sequelize, Sequelize.DataTypes);
const GroceryOrderItem = require('./grocery_order_item')(sequelize, Sequelize.DataTypes);

// Factory models — initialize with sequelize
const RestaurantCategory = require('./restaurantcategory')(sequelize, Sequelize.DataTypes);
const Restaurant = require('./restaurant')(sequelize, Sequelize.DataTypes);
const Dish = require('./dish')(sequelize, Sequelize.DataTypes);
const TaxiDriver = require('./taxidriver')(sequelize, Sequelize.DataTypes);
const TaxiVehicle = require('./taxivehicle')(sequelize, Sequelize.DataTypes);
const TaxiRide = require('./taxiride')(sequelize, Sequelize.DataTypes);
const Hotel = require('./hotel')(sequelize, Sequelize.DataTypes);
const Room = require('./room')(sequelize, Sequelize.DataTypes);
const Booking = require('./booking')(sequelize, Sequelize.DataTypes);
const ProductAttribute = require('./ProductAttribute')(sequelize, Sequelize.DataTypes);
const GCartItem = require('./gcart_items')(sequelize, Sequelize.DataTypes);
const Gwhishlist = require('./gwhishlist')(sequelize, Sequelize.DataTypes);
const Role = require('./Role');
const Staff = require('./Staff');

// --- Associations ---

// User ↔ UserProfile
User.hasOne(UserProfile, { foreignKey: 'user_id', as: 'profile', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
UserProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// GCartItem & Gwhishlist
User.hasMany(GCartItem, { foreignKey: 'user_id', as: 'gcartItems', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
GCartItem.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User.hasMany(Gwhishlist, { foreignKey: 'user_id', as: 'gwishlistItems', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Gwhishlist.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });


// Add these associations:
GroceryOrder.hasMany(GroceryOrderItem, { foreignKey: 'order_id', as: 'items' });
GroceryOrderItem.belongsTo(GroceryOrder, { foreignKey: 'order_id', as: 'order' });

User.hasMany(GroceryOrder, { foreignKey: 'user_id', as: 'groceryOrders' });
GroceryOrder.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Category self-reference (subcategories/parent for admin panel)
Category.hasMany(Category, { as: 'subcategories', foreignKey: 'parent_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
// Category self-reference (childCategories/parentCategory for new code)
Category.hasMany(Category, { as: 'childCategories', foreignKey: 'parent_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
Category.belongsTo(Category, { as: 'parentCategory', foreignKey: 'parent_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

// Category ↔ Product
Category.hasMany(Product, { as: 'categoryProducts', foreignKey: 'category_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Product.belongsTo(Category, { as: 'category', foreignKey: 'category_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Product ↔ Brand
Product.belongsTo(require('./Brand'), { foreignKey: 'brand_id', as: 'brand' });

// Product ↔ ProductVariation
Product.hasMany(ProductVariation, { as: 'productVariations', foreignKey: 'product_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
ProductVariation.belongsTo(Product, { as: 'baseProduct', foreignKey: 'product_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Product ↔ ProductAttribute
Product.hasMany(ProductAttribute, { as: 'attributes', foreignKey: 'product_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
ProductAttribute.belongsTo(Product, { foreignKey: 'product_id', as: 'product', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Cart ↔ CartItems
User.hasMany(Cart, { foreignKey: 'user_id', as: 'carts', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
CartItem.belongsTo(ProductVariation, { foreignKey: 'variation_id', as: 'variation', onDelete: 'SET NULL', onUpdate: 'CASCADE' });

// Order ↔ OrderItems
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product', onDelete: 'NO ACTION', onUpdate: 'CASCADE' });
OrderItem.belongsTo(ProductVariation, { foreignKey: 'variation_id', as: 'variation', onDelete: 'NO ACTION', onUpdate: 'CASCADE' });

// Restaurant / Taxi / Hotel / etc.
if (RestaurantCategory.associate) RestaurantCategory.associate({ Restaurant });
if (Restaurant.associate) Restaurant.associate({ RestaurantCategory, Dish });
if (Dish.associate) Dish.associate({ Restaurant });
if (TaxiDriver.associate) TaxiDriver.associate({ TaxiVehicle, TaxiRide });
if (TaxiVehicle.associate) TaxiVehicle.associate({ TaxiDriver, TaxiRide });
if (TaxiRide.associate) TaxiRide.associate({ TaxiDriver, TaxiVehicle, User });
if (ProductAttribute.associate) ProductAttribute.associate({ Product }); // optional if logic needed

// OTPs
User.hasMany(OTP, { foreignKey: 'user_id', as: 'otps', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
OTP.belongsTo(User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

// Register associations for User and Staff
if (User.associate) User.associate({ Staff });
if (Staff.associate) Staff.associate({ User });

// Export all models
module.exports = {
  sequelize,
  User,
  UserProfile,
  Category,
  Product,
  ProductVariation,
  Cart,
  CartItem,
  Order,
  OrderItem,
  OTP,
  RestaurantCategory,
  Restaurant,
  Dish,
  TaxiDriver,
  TaxiVehicle,
  TaxiRide,
  Hotel,
  Room,
  Booking,
  GroceryOrder,
  GroceryOrderItem,
  GCartItem,
  Gwhishlist,
  ProductAttribute,
  Role,
  Staff
};
