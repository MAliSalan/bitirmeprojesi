const express = require("express");
const router = express.Router();
const CartItem = require("../models/CartItem");
const MenuItem = require("../models/MenuItem");
const authenticateToken = require("../middleware/authenticateToken");

router.post("/", authenticateToken, async (req, res) => {
    const { menu_item_id, quantity, restaurant_id ,price} = req.body;
  
    if (!menu_item_id || !quantity || !restaurant_id, !price) {
      return res.status(400).json({ error: "Tüm alanlar gereklidir." });
    }
  
    try {
      // Kullanıcının sepete ürün eklemesi
      const cartItem = await CartItem.create({
        user_id: req.user.id, 
        menu_item_id,
        quantity,
        restaurant_id,
        price,
      });
      res.status(201).json(cartItem);
    } catch (error) {
      console.error("Ürün sepete eklenemedi:", error);
      res.status(500).json({ error: "Ürün sepete eklenemedi." });
    }
  });

// Sepeti Görüntüle
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; 

    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      include: [
        {
          model: MenuItem,
          as: "menuItem", 
          attributes: ["id", "name", "price", "image_url", "restaurant_id"], 
        },
      ],
    });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Sepet verileri alınamadı:", error);
    res.status(500).json({ error: "Sepet verileri alınamadı." });
  }
});


// Sepetten Ürün Çıkar
router.delete("/:id", authenticateToken, async (req, res) => {
  const cartItemId = req.params.id;

  try {
    const item = await CartItem.findOne({
      where: { id: cartItemId, user_id: req.user.id },
    });

    if (!item) {
      return res.status(404).json({ error: "Ürün bulunamadı." });
    }

    await item.destroy();
    res.status(200).json({ message: "Ürün sepetten çıkarıldı." });
  } catch (error) {
    console.error("Ürün sepetten çıkarılamadı:", error);
    res.status(500).json({ error: "Ürün sepetten çıkarılamadı." });
  }
});

module.exports = router;
