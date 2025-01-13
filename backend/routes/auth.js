const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const router = express.Router();
const SECRET_KEY = "YOUR_SECRET_KEY";

// kullanıcı kayıt işlemi

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, phone_number } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone_number,
    });

    res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu", user });
  } catch (error) {
    console.error("Kayıt işlemi sırasında bir hata oluştu:", error); // Hata detayını logla
    res.status(500).json({ error: "Kayıt sırasında bir hata oluştu." });
  }
});
// kullanıcı ve restoran giriş işlemi

router.post("/login", async (req, res) => {
  const { email, password, type } = req.body;

  try {
    if (!type || !["user", "restaurant"].includes(type)) {
      return res.status(400).json({ error: "Geçersiz giriş türü." });
    }

    const Model = type === "user" ? User : Restaurant;

    const userOrRestaurant = await Model.findOne({ where: { email } });
    if (!userOrRestaurant) {
      return res.status(404).json({ error: "Kullanıcı veya restoran bulunamadı." });
    }

    const isPasswordValid = await bcrypt.compare(password, userOrRestaurant.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Hatalı şifre." });
    }

    const token = jwt.sign(
      { id: userOrRestaurant.id, email: userOrRestaurant.email, type },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token, type });
  } catch (error) {
    console.error("Giriş sırasında bir hata oluştu:", error);
    res.status(500).json({ error: "Giriş işlemi başarısız." });
  }
});


module.exports = router;
