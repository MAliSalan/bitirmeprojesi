<template>
  <div class="home">
    <section class="hero">
      <h1>YemekProjem'e Hoş Geldiniz!</h1>
      <p>En iyi restoranları keşfedin, rezervasyon yapın ve lezzetli yemeklerin tadını çıkarın.</p>
      <router-link to="/restaurants" class="cta-button">Restoranları Keşfet</router-link>
    </section>

    <section class="features">
      <a href="/restaurants">
      <div class="feature">
        <img src="https://via.placeholder.com/150" alt="Restoranlar">
        <h2>En İyi Restoranlar</h2>
        <p>Sizler için seçilmiş en iyi restoranları keşfedin.</p>
      </div></a>
      <a href="/reservations">
      <div class="feature">
        <img src="https://via.placeholder.com/150" alt="Rezervasyon">
        <h2>Kolay Rezervasyon</h2>
        <p>Hızlı ve kolay bir şekilde rezervasyon yapın.</p>
      </div></a>
      <div class="feature">
        <img src="https://via.placeholder.com/150" alt="Yemek Siparişi">
        <h2>Lezzetli Yemekler</h2>
        <p>Sipariş verin, en lezzetli yemekler ayağınıza gelsin.</p>
      </div>
    </section>

    <section class="extra">
      <h2>Online Yemek Siparişi ve Rezervasyon</h2>
      <p>YemekProjem, yemek siparişi ve restoran rezervasyonu için en hızlı ve güvenilir platformdur. İster dışarıda yemek yemeyi tercih edin, ister evde lezzetli bir yemek sipariş edin, YemekProjem her zaman yanınızda!</p>
      <div class="extra-features">
        <div class="extra-feature">
          <h3>Hızlı Teslimat</h3>
          <p>Siparişleriniz en hızlı şekilde kapınıza gelsin.</p>
        </div>
        <div class="extra-feature">
          <h3>Geniş Seçenekler</h3>
          <p>Çeşitli mutfaklardan yüzlerce restoranı keşfedin.</p>
        </div>
        <div class="extra-feature">
          <h3>Kolay Ödeme</h3>
          <p>Güvenli ve kolay ödeme seçenekleri ile rahat edin.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {};
</script>

<style>
.home {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.hero {
  text-align: center;
  padding: 50px 20px;
  background: linear-gradient(135deg, #18bc9c, #2c3e50);
  color: white;
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 15px;
  font-weight: bold;
  text-transform: uppercase;
}

.hero p {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.hero .cta-button {
  background-color: #ffc107;
  color: #000;
  padding: 15px 30px;
  text-decoration: none;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.5rem;
  transition: background-color 0.3s, transform 0.3s;
}

.hero .cta-button:hover {
  background-color: #e0a800;
  transform: scale(1.05);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 30px;
  text-align: center;
}

.feature {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.feature img {
  width: 120px;
  height: 120px;
  margin-bottom: 15px;
  border-radius: 50%;
  border: 4px solid #18bc9c;
}

.feature h2 {
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #34495e;
}

.feature p {
  font-size: 1rem;
  color: #555;
}

.extra {
  margin-top: 50px;
  text-align: center;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.extra h2 {
  font-size: 2rem;
  margin-bottom: 15px;
  color: #18bc9c;
  text-transform: uppercase;
}

.extra p {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 30px;
}

.extra-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.extra-feature {
  text-align: center;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.extra-feature h3 {
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 10px;
}

.extra-feature p {
  font-size: 1rem;
  color: #555;
}
</style>
