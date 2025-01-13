const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");
const PaymentCard = require("../models/PaymentCard");

// Kullanıcının ödeme kartlarını getir
router.get("/", authenticateToken, async (req, res) => {
  try {
    const cards = await PaymentCard.findAll({ where: { user_id: req.user.id } });
    res.json(cards);
  } catch (error) {
    console.error("Kartlar yüklenemedi:", error);
    res.status(500).json({ error: "Kartlar yüklenemedi." });
  }
});

// Yeni kart ekle
router.post("/", authenticateToken, async (req, res) => {
  const { card_holder_name, card_number, expiration_date, cvv } = req.body;
  try {
    const newCard = await PaymentCard.create({
      user_id: req.user.id,
      card_holder_name,
      card_number,
      expiration_date,
      cvv,
    });
    res.status(201).json(newCard);
  } catch (error) {
    console.error("Kart eklenemedi:", error);
    res.status(500).json({ error: "Kart eklenemedi." });
  }
});

// Kartı güncelle
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { card_holder_name, card_number, expiration_date, cvv } = req.body;
  try {
    const card = await PaymentCard.findOne({ where: { id, user_id: req.user.id } });
    if (!card) {
      return res.status(404).json({ error: "Kart bulunamadı." });
    }
    card.card_holder_name = card_holder_name;
    card.card_number = card_number;
    card.expiration_date = expiration_date;
    card.cvv = cvv;
    await card.save();
    res.json(card);
  } catch (error) {
    console.error("Kart güncellenemedi:", error);
    res.status(500).json({ error: "Kart güncellenemedi." });
  }
});

// Kartı sil
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const card = await PaymentCard.findOne({ where: { id, user_id: req.user.id } });
    if (!card) {
      return res.status(404).json({ error: "Kart bulunamadı." });
    }
    await card.destroy();
    res.json({ message: "Kart başarıyla silindi." });
  } catch (error) {
    console.error("Kart silinemedi:", error);
    res.status(500).json({ error: "Kart silinemedi." });
  }
});

module.exports = router;
