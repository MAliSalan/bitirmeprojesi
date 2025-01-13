const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User"); // Kullanıcı modelini ilişki için import ediyoruz

const Address = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, 
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    address_line: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "addresses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

User.hasMany(Address, { foreignKey: "user_id" });
Address.belongsTo(User, { foreignKey: "user_id" });

module.exports = Address;
