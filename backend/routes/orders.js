const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const CartItem = require("../models/cartItem");
const MenuItem = require("../models/menuItem");
const User = require("../models/user");
const Restaurant = require("../models/restaurant");
const authenticateToken = require("../middleware/authenticateToken");

// Sipariş oluştur
router.post("/", authenticateToken, async (req, res) => {
    const { address_id, payment_method, use_balance } = req.body;
  
    try {
      const userId = req.user.id;
  
      // Kullanıcının sepetindeki ürünleri al
      const cartItems = await CartItem.findAll({
        where: { user_id: userId },
        include: [
          {
            model: MenuItem,
            as: "menuItem",
          },
        ],
      });
  
      if (!cartItems.length) {
        return res.status(400).json({ error: "Sepetinizde ürün bulunmamaktadır." });
      }
  
      const restaurantId = cartItems[0].menuItem.restaurant_id;
      const isSameRestaurant = cartItems.every(
        (item) => item.menuItem.restaurant_id === restaurantId
      );
  
      if (!isSameRestaurant) {
        return res
          .status(400)
          .json({ error: "Tüm ürünler aynı restorandan olmalıdır." });
      }
  
      let totalAmount = 0;
      const orderItemsData = [];
      for (const cartItem of cartItems) {
        const menuItem = cartItem.menuItem;
        if (!menuItem) {
          return res.status(400).json({ error: "Geçersiz ürün sepetinizde mevcut." });
        }
        totalAmount += menuItem.price * cartItem.quantity;
  
        // Sipariş öğeleri için verileri hazırlama
        orderItemsData.push({
          menu_item_id: menuItem.id,
          quantity: cartItem.quantity,
          price: menuItem.price,
        });
      }
  
      if (use_balance) {
        const user = await User.findByPk(userId);
        if (!user || user.credits < totalAmount) {
          return res.status(400).json({ error: "Yetersiz bakiye." });
        }
        user.credits -= totalAmount;
        await user.save();
      }
  
      // Sipariş oluşturma
      const order = await Order.create({
        user_id: userId,
        address_id,
        total_price: totalAmount,
        status: "pending", // Varsayılan durum
        payment_method: use_balance ? "balance" : payment_method,
        restaurant_id: restaurantId, // Restaurant ID sepetten alındı
      });
  
      // Sipariş öğelerini kaydetme
      for (const item of orderItemsData) {
        await OrderItem.create({
          order_id: order.id,
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price: item.price,
        });
      }
  
      // Sepeti temizle
      await CartItem.destroy({ where: { user_id: userId } });
  
      res.status(201).json({ message: "Sipariş başarıyla oluşturuldu.", order });
    } catch (error) {
      console.error("Sipariş oluşturulamadı:", error);
      res.status(500).json({ error: "Sipariş oluşturulamadı." });
    }
  });
  
  // Kullanıcının siparişlerini getir
  router.get("/", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const orders = await Order.findAll({
        where: { user_id: userId },
        include: [
          {
            model: OrderItem,
            as: "orderItems",
            include: [
              {
                model: MenuItem,
                as: "menuItem",
              },
            ],
          },
        ],
      });
      res.status(200).json(orders);
    } catch (error) {
      console.error("Siparişler alınamadı:", error);
      res.status(500).json({ error: "Siparişler alınamadı." });
    }
  });
  router.get("/restaurant", authenticateToken, async (req, res) => {
    try {
      const restaurantId = req.restaurant.id;
      const orders = await Order.findAll({ where: { restaurant_id: restaurantId } });
      res.json(orders);
    } catch (error) {
      console.error("Siparişler yüklenemedi:", error);
      res.status(500).json({ error: "Siparişler yüklenemedi." });
    }
  });
  
// Sipariş durumunu güncelle
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: "Sipariş bulunamadı." });
    }

    
    order.status = status;

    if (status === "confirmed") {
      const restaurant = await Restaurant.findByPk(order.restaurant_id);
      restaurant.credits += order.total_price;
      await restaurant.save();
    } else if (status === "rejected") {
      const user = await User.findByPk(order.user_id);
      user.credits += order.total_price;
      await user.save();
    }

    await order.save();
    res.json({ message: "Sipariş durumu güncellendi.", order });
  } catch (error) {
    console.error("Sipariş durumu güncellenemedi:", error);
    res.status(500).json({ error: "Sipariş durumu güncellenemedi." });
  }
});
  
  router.put("/:id/confirm", authenticateToken, async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order || order.restaurant_id !== req.restaurant.id) {
        return res.status(403).json({ error: "Erişim izni yok." });
      }
      order.status = "confirmed";
      await order.save();
      res.json(order);
    } catch (error) {
      console.error("Sipariş onaylanamadı:", error);
      res.status(500).json({ error: "Sipariş onaylanamadı." });
    }
  });
  
  router.put("/:id/complete", authenticateToken, async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order || order.restaurant_id !== req.restaurant.id) {
        return res.status(403).json({ error: "Erişim izni yok." });
      }
      order.status = "completed";
      await order.save();
      const restaurant = await Restaurant.findByPk(order.restaurant_id);
      restaurant.credits += order.total_price;
      await restaurant.save();
      res.json(order);
    } catch (error) {
      console.error("Sipariş tamamlanamadı:", error);
      res.status(500).json({ error: "Sipariş tamamlanamadı." });
    }
  });
  
  router.put("/:id/reject", authenticateToken, async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order || order.restaurant_id !== req.restaurant.id) {
        return res.status(403).json({ error: "Erişim izni yok." });
      }
      order.status = "rejected";
      await order.save();
      const user = await User.findByPk(order.user_id);
      user.balance += order.total_price;
      await user.save();
      res.json(order);
    } catch (error) {
      console.error("Sipariş reddedilemedi:", error);
      res.status(500).json({ error: "Sipariş reddedilemedi." });
    }
  });


  router.get("/user", authenticateToken, async (req, res) => {
    try {
      const user_id = req.user.id;
      const orders = await Order.findAll({ where: { user_id: user_id },
       });
      res.json(orders);
    } catch (error) {
      console.error("Siparişler yüklenemedi:", error);
      res.status(500).json({ error: "Siparişler yüklenemedi." });
    }
  });
  
module.exports = router;
