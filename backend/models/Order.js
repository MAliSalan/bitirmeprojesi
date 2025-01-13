const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const OrderItem = require("./OrderItem");
const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  restaurant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "rejected", "completed"),
    defaultValue: "pending",
  },
  payment_method: {
    type: DataTypes.ENUM("card", "balance"),
    allowNull: false,
  },
  address_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "orders",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});


module.exports = Order;
