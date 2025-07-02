// module.exports = (sequelize, DataTypes) => {
//   const GCartItem = sequelize.define('GCartItem', {
//     id: {
//       type: DataTypes.BIGINT.UNSIGNED,
//       autoIncrement: true,
//       primaryKey: true
//     },
//     user_id: {
//       type: DataTypes.BIGINT.UNSIGNED,
//       allowNull: false
//     },
//     grocery_id: {
//       type: DataTypes.BIGINT.UNSIGNED,
//       allowNull: false
//     },
//     name: DataTypes.STRING,
//     image: DataTypes.STRING,
//     category: DataTypes.STRING,
//     original_price: DataTypes.DECIMAL(10, 2),
//     discounted_price: DataTypes.DECIMAL(10, 2),
//     quantity: {
//       type: DataTypes.INTEGER,
//       defaultValue: 1,
//       allowNull: false
//     }
//   }, {
//     tableName: 'gcart_items',
//     underscored: true,
//     timestamps: true
//   });

//   return GCartItem;
// };
module.exports = (sequelize, DataTypes) => {
  const GCartItem = sequelize.define('GCartItem', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    grocery_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    original_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    discounted_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    tableName: 'gcart_items',
    underscored: true,         // Ensures snake_case in DB columns
    timestamps: true           // Adds `created_at` and `updated_at`
  });

  return GCartItem;
};
