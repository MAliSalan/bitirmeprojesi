const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const SECRET_KEY = "YOUR_SECRET_KEY";

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Erişim izni yok. Token gerekli." });
  }

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Geçersiz token." });
    }

    try {
      const Model = decoded.type === "user" ? User : Restaurant;
      const userOrRestaurant = await Model.findByPk(decoded.id);

      if (!userOrRestaurant) {
        return res.status(404).json({ error: "Kullanıcı veya restoran bulunamadı." });
      }

      req[decoded.type] = userOrRestaurant; // `req.user` veya `req.restaurant`
      next();
    } catch (error) {
      console.error("Token doğrulama hatası:", error);
      res.status(500).json({ error: "Token doğrulama hatası." });
    }
  });
}

module.exports = authenticateToken;
