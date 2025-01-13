const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const Reservation = require("../models/Reservation");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const { Op } = require("sequelize");

const router = express.Router();

// Tüm restoranları listele (rezervasyon için kullanılabilir)
router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (error) {
    console.error("Restoranlar yüklenemedi:", error);
    res.status(500).json({ error: "Restoranlar yüklenemedi." });
  }
});

// Kullanıcının rezervasyonlarını listele
router.get("/myreservations", authenticateToken, async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Restaurant,
          attributes: ["id", "name", "address", "description"],
        },
      ],
    });

    res.json(reservations);
  } catch (error) {
    console.error("Rezervasyonlar yüklenemedi:", error);
    res.status(500).json({ error: "Rezervasyonlar yüklenemedi." });
  }
});

// Rezervasyon yap
router.post("/", authenticateToken, async (req, res) => {
  const { restaurant_id, table_number, reservation_time } = req.body;

  try {
    if (!restaurant_id || !table_number || !reservation_time) {
      return res.status(400).json({ error: "Tüm alanlar doldurulmalıdır." });
    }

    if (isNaN(new Date(reservation_time))) {
      return res.status(400).json({ error: "Geçerli bir tarih ve saat girin." });
    }

    const restaurant = await Restaurant.findByPk(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restoran bulunamadı." });
    }

    if (table_number > restaurant.table_count || table_number <= 0) {
      return res.status(400).json({ error: "Geçersiz masa numarası." });
    }

    // Çakışan rezervasyon kontrolü (±2 saat aralığı)
    const existingReservation = await Reservation.findOne({
      where: {
        restaurant_id,
        table_number,
        reservation_time: {
          [Op.between]: [
            new Date(new Date(reservation_time).getTime() - 2 * 60 * 60 * 1000), 
            new Date(new Date(reservation_time).getTime() + 2 * 60 * 60 * 1000), 
          ],
        },
      },
    });

    if (existingReservation) {
      return res.status(400).json({ error: "Bu masa seçilen saat aralığında rezerve edilmiş." });
    }

    // Yeni rezervasyon oluştur
    const newReservation = await Reservation.create({
      user_id: req.user.id,
      restaurant_id,
      table_number,
      reservation_time,
      status: "pending",
    });

    res.status(201).json({
      message: "Rezervasyon başarıyla oluşturuldu.",
      reservation: newReservation,
    });
  } catch (error) {
    console.error("Rezervasyon oluşturulamadı:", error);
    res.status(500).json({ error: "Rezervasyon oluşturulamadı." });
  }
});


// Rezervasyonu iptal et
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findOne({ where: { id, user_id: req.user.id } });

    if (!reservation) {
      return res.status(404).json({ error: "Rezervasyon bulunamadı." });
    }

    await reservation.destroy();

    res.json({ message: "Rezervasyon başarıyla iptal edildi." });
  } catch (error) {
    console.error("Rezervasyon iptal edilemedi:", error);
    res.status(500).json({ error: "Rezervasyon iptal edilemedi." });
  }
});

router.get("/restaurant", authenticateToken, async (req, res) => {
  try {
    const restaurantId = req.restaurant.id;
    const reservations = await Reservation.findAll({ where: { restaurant_id: restaurantId } });
    res.json(reservations);
  } catch (error) {
    console.error("Rezervasyonlar yüklenemedi:", error);
    res.status(500).json({ error: "Rezervasyonlar yüklenemedi." });
  }
});

router.put("/:id/confirm", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ error: "Rezervasyon bulunamadı." });
    }
    reservation.status = "confirmed";
    await reservation.save();
    res.json({ message: "Rezervasyon onaylandı.", reservation });
  } catch (error) {
    console.error("Rezervasyon onaylanamadı:", error);
    res.status(500).json({ error: "Rezervasyon onaylanamadı." });
  }
});

router.put("/:id/reject", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ error: "Rezervasyon bulunamadı." });
    }
    reservation.status = "cancelled";
    await reservation.save();
    res.json({ message: "Rezervasyon reddedildi.", reservation });
  } catch (error) {
    console.error("Rezervasyon reddedilemedi:", error);
    res.status(500).json({ error: "Rezervasyon reddedilemedi." });
  }
});
module.exports = router;
