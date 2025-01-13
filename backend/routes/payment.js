const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const User = require("../models/User");
// Bakiyeyi güncelle
router.post("/load-balance", authenticateToken, async (req, res) => {
  const { card_id, amount } = req.body;

  if (!card_id || !amount || amount <= 0) {
    return res.status(400).json({ error: "Geçerli bir kart ve tutar girin." });
  }

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    
    user.credits += parseFloat(amount);
    await user.save();

    return res.json({ message: "Bakiye başarıyla yüklendi.", new_balance: user.credits });
  } catch (error) {
    console.error("Bakiye yüklenirken hata oluştu:", error);
    return res.status(500).json({ error: "Bakiye yüklenemedi." });
  }
});

module.exports = router;
