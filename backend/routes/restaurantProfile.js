const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const Restaurant = require("../models/Restaurant");

// Restoran bilgilerini al
router.get("/info", authenticateToken, async (req, res) => {
  try {
    res.json(req.restaurant); 
  } catch (error) {
    console.error("Restoran bilgileri alınamadı:", error);
    res.status(500).json({ error: "Restoran bilgileri alınamadı." });
  }
});

// Restoran bilgilerini güncelle
router.put("/info", authenticateToken, async (req, res) => {
  const { name, address,email,rating ,table_count} = req.body;

  try {
    const restaurant = req.restaurant; 

    await restaurant.update({ name, address,email,rating ,table_count});
    res.json({ message: "Restoran bilgileri başarıyla güncellendi.", restaurant });
  } catch (error) {
    console.error("Restoran bilgileri güncellenemedi:", error);
    res.status(500).json({ error: "Restoran bilgileri güncellenemedi." });
  }
});

module.exports = router;
