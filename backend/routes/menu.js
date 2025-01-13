const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");
const authenticateToken = require("../middleware/authenticateToken");

// Menüyü Getir
router.get("/:restaurant_id", async (req, res) => {
  const { restaurant_id } = req.params;

  try {
    const menuItems = await MenuItem.findAll({ where: { restaurant_id } });
    res.json(menuItems);
  } catch (error) {
    console.error("Menü öğeleri yüklenemedi:", error);
    res.status(500).json({ error: "Menü öğeleri yüklenemedi." });
  }
});

// yeni menü öğesi ekle
router.post("/", authenticateToken, async (req, res) => {
  const { name, price, description, image_url } = req.body;
  
  try {
    
    const restaurantId = req.restaurant.id;

    const newMenuItem = await MenuItem.create({
      restaurant_id: restaurantId,
      name,
      price,
      description,
      image_url,
    });

    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error("Menü öğesi eklenemedi:", error);
    res.status(500).json({ error: "Menü öğesi eklenemedi." });
  }
});

// menüyü güncelle
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, price, description, image_url } = req.body;

  try {
    const menuItem = await MenuItem.findOne({
      where: { id, restaurant_id: req.restaurant.id }, 
    });

    if (!menuItem) {
      return res.status(404).json({ error: "Menü öğesi bulunamadı." });
    }

    menuItem.name = name;
    menuItem.price = price;
    menuItem.description = description;
    menuItem.image_url = image_url;

    await menuItem.save();
    res.json(menuItem);
  } catch (error) {
    console.error("Menü öğesi güncellenemedi:", error);
    res.status(500).json({ error: "Menü öğesi güncellenemedi." });
  }
});

// menüyü sil
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const menuItem = await MenuItem.findOne({
      where: { id, restaurant_id: req.restaurant.id }, 
    });

    if (!menuItem) {
      return res.status(404).json({ error: "Menü öğesi bulunamadı." });
    }

    await menuItem.destroy();
    res.status(200).json({ message: "Menü öğesi silindi." });
  } catch (error) {
    console.error("Menü öğesi silinemedi:", error);
    res.status(500).json({ error: "Menü öğesi silinemedi." });
  }
});

module.exports = router;
