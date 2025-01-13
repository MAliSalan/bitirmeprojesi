const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const User = require("../models/User");

// Kullanıcı profil bilgilerini çekme
router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["first_name", "last_name", "email", "phone_number", "credits"],
    });

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    res.json(user);
  } catch (error) {
    console.error("Profil bilgileri yüklenemedi:", error);
    res.status(500).json({ error: "Profil bilgileri yüklenemedi." });
  }
});

// Kullanıcı profil bilgilerini güncelleme
router.put("/", authenticateToken, async (req, res) => {
  const { first_name, last_name, phone_number } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.phone_number = phone_number || user.phone_number;

    await user.save();

    res.json({ message: "Profil başarıyla güncellendi.", user });
  } catch (error) {
    console.error("Profil güncellenemedi:", error);
    res.status(500).json({ error: "Profil güncellenemedi." });
  }
});

module.exports = router;
