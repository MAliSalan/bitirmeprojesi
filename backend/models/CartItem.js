const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const MenuItem = require("./MenuItem");
const CartItem = sequelize.define("cart_items", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  menu_item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  restaurant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }, 
},
{
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });

  CartItem.belongsTo(MenuItem, {
    foreignKey: "menu_item_id",
    as: "menuItem", 
  });
  

module.exports = CartItem;
