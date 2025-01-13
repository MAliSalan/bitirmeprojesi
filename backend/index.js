const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize } = require("./config/database");

// Route dosyaları
const menuRoutes = require("./routes/menu");
const authRoutes = require("./routes/auth");
const restaurantRoutes = require("./routes/restaurants");
const reservationRoutes = require("./routes/reservations");
const profileRoutes = require("./routes/profile");
const addressRoutes = require("./routes/addresses");
const paymentCardRoutes = require("./routes/paymentCards");
const restaurantProfileRoutes = require("./routes/restaurantProfile");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");
const paymentRoutes = require("./routes/payment");

// Model dosyaları
const User = require("./models/User");
const Reservation = require("./models/Reservation");
const Restaurant = require("./models/Restaurant");
const Address = require("./models/Address");
const PaymentCard = require("./models/PaymentCard");
const MenuItem = require("./models/MenuItem");
const Order = require("./models/Order");
const OrderItem = require("./models/OrderItem");
const CartItem = require("./models/CartItem");


// Express uygulaması
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Veritabanı ilişkileri
Restaurant.hasMany(Reservation, { foreignKey: "restaurant_id" });
Reservation.belongsTo(Restaurant, { foreignKey: "restaurant_id" });

User.hasMany(Address, { foreignKey: "user_id" });
Address.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(PaymentCard, { foreignKey: "user_id" });
PaymentCard.belongsTo(User, { foreignKey: "user_id" });

Restaurant.hasMany(MenuItem, { foreignKey: "restaurant_id" });
MenuItem.belongsTo(Restaurant, { foreignKey: "restaurant_id" });

Order.belongsTo(Restaurant, { foreignKey: "restaurant_id" });
Order.belongsTo(User, { foreignKey: "user_id" });


Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

MenuItem.hasMany(OrderItem, { foreignKey: "menu_item_id" });
OrderItem.belongsTo(MenuItem, { foreignKey: "menu_item_id" });


User.hasMany(CartItem, { foreignKey: "user_id" });
CartItem.belongsTo(User, { foreignKey: "user_id" });

MenuItem.hasMany(CartItem, { foreignKey: "menu_item_id" });
CartItem.belongsTo(MenuItem, { foreignKey: "menu_item_id" });

Order.hasMany(OrderItem, {
  as: "orderItems", 
  foreignKey: "order_id",
});

Order.belongsTo(Restaurant, {
  as: "restaurant",
  foreignKey: "restaurant_id",
});

OrderItem.belongsTo(Order, {
  as: "order",
  foreignKey: "order_id",
});

OrderItem.belongsTo(MenuItem, {
  as: "menu_item",
  foreignKey: "menu_item_id",
});
MenuItem.hasMany(OrderItem, {
  as: "orderItems",
  foreignKey: "menu_item_id",
});


// Rotaları bağlama
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/payment-cards", paymentCardRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/restaurantProfile", restaurantProfileRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
// veritabanı çalışmasını kontrol et localhost:5000
app.get("/", (req, res) => {
  res.send("Veritabanı Backend Çalışıyor!");
});


// Sunucuyu başlat
const PORT = 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Veritabanı bağlantısı başarılı!");
  } catch (error) {
    console.error("Veritabanı bağlantısı başarısız:", error);
  }
  console.log(`Server running on http://localhost:${PORT}`);
});
