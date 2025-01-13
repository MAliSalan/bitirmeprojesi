const express = require("express");
const router = express.Router();
const Address = require("../models/Address");
const authenticateToken = require("../middleware/authenticateToken");


router.post("/", authenticateToken, async (req, res) => {
  const { name, address_line, city, postal_code, phone_number } = req.body;

  try {
    const address = await Address.create({
      user_id: req.user.id, 
      name,
      address_line,
      city,
      postal_code,
      phone_number,
    });

    res.status(201).json(address); 
  } catch (error) {
    console.error("Adres eklenemedi:", error);
    res.status(500).json({ error: "Adres eklenemedi." });
  }
});
// Tüm Adresleri Getir
router.get("/", authenticateToken, async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { user_id: req.user.id }, 
    });

    if (addresses.length === 0) {
      return res.status(404).json({ message: "Henüz adres eklenmemiş." });
    }

    res.json(addresses);
  } catch (error) {
    console.error("Adresler yüklenemedi:", error);
    res.status(500).json({ error: "Adresler yüklenemedi." });
  }
});
// Adres Güncelle
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, address_line, city, postal_code, phone_number } = req.body;

  try {
    
    const address = await Address.findOne({
      where: { id, user_id: req.user.id },
    });

    if (!address) {
      return res.status(404).json({ error: "Adres bulunamadı." });
    }

    
    address.name = name || address.name;
    address.address_line = address_line || address.address_line;
    address.city = city || address.city;
    address.postal_code = postal_code || address.postal_code;
    address.phone_number = phone_number || address.phone_number;

    await address.save();
    res.json(address);
  } catch (error) {
    console.error("Adres güncellenemedi:", error);
    res.status(500).json({ error: "Adres güncellenemedi." });
  }
});

// Adres Sil
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    
    const address = await Address.findOne({
      where: { id, user_id: req.user.id },
    });

    if (!address) {
      return res.status(404).json({ error: "Adres bulunamadı." });
    }

    await address.destroy();
    res.json({ message: "Adres başarıyla silindi." });
  } catch (error) {
    console.error("Adres silinemedi:", error);
    res.status(500).json({ error: "Adres silinemedi." });
  }
});

module.exports = router;
