const express = require("express");
const Restaurant = require("../models/Restaurant");
const SECRET_KEY = "qoakmsdkasmdkaskdkm32984kmaskdmad";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

router.get("/info", authenticateToken, async (req, res) => {
  try {
    const restaurantId = req.user.id; 
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restoran bulunamadı." });
    }

    res.json({
      name: restaurant.name,
      description: restaurant.description,
      email: restaurant.email,
      address: restaurant.address,
      credits: restaurant.credits,
      rating: restaurant.rating,
      table_count: restaurant.table_count,
      image: restaurant.image,
    });
  } catch (error) {
    console.error("Restoran bilgileri alınırken hata oluştu:", error);
    res.status(500).json({ message: "Bir hata oluştu." });
  }
});




// Tüm restoranları listele
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restoran bulunamadı." });
    }
    res.json(restaurant);
  } catch (error) {
    console.error("Restoran detayları yüklenemedi:", error);
    res.status(500).json({ error: "Restoran detayları yüklenemedi." });
  }
});
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (error) {
    console.error("Restoranlar yüklenemedi:", error);
    res.status(500).json({ error: "Restoranlar yüklenemedi." });
  }
});

// Yeni restoran ekle
router.post("/", async (req, res) => {
  const { name, address, email, password,description, rating, table_count } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!name || !table_count || table_count <= 0) {
      return res.status(400).json({ error: "Ad ve geçerli bir masa sayısı zorunludur." });
    }

    const newRestaurant = await Restaurant.create({
      name,
      address,
      email,
      password: hashedPassword,
      description,
      rating: rating || 0,
      table_count,
    });

    res.status(201).json({ message: "Restoran başarıyla oluşturuldu.", restaurant: newRestaurant });
  } catch (error) {
    console.error("Restoran eklenirken hata:", error);
    res.status(500).json({ error: "Restoran eklenemedi." });
  }
});

module.exports = router;
