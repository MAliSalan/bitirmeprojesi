const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const MenuItem = require("./MenuItem");
const Order = require("./Order");
const OrderItem = sequelize.define("OrderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "orders",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  menu_item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "menu_items",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
},
{
  sequelize,
  modelName: "OrderItem",
  tableName: "order_items",
  timestamps: false,
},
);
OrderItem.belongsTo(MenuItem, {
  foreignKey: "menu_item_id",
  as: "menuItem",
});

module.exports = OrderItem;
