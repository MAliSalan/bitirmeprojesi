<template>
  <nav class="navbar">
    <div class="container">
      <a href="/" class="logo">YemekProjem</a>
      <ul class="nav-links">
        <li><a href="/">Ana Sayfa</a></li>
        <li><a href="/restaurants">Restoranlar</a></li>
        <li><a href="/reservations">Rezervasyon Ekle</a></li>
        <li v-if="!isUserLoggedIn && !isRestaurantLoggedIn"><a href="/login">Giriş Yap</a></li>
        <li v-if="!isUserLoggedIn && !isRestaurantLoggedIn"><a href="/register">Kayıt Ol</a></li>
        <li v-if="isUserLoggedIn"><a href="/cart">Sepetim</a></li>
        <li v-if="isUserLoggedIn"><a href="/profile">Profil</a></li>
        <li v-if="isRestaurantLoggedIn"><a href="/restaurantprofile">Restoran Profil</a></li>
        <li v-if="isUserLoggedIn || isRestaurantLoggedIn"><a href="/logout" @click.prevent="logout">Çıkış Yap</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isUserLoggedIn: false,
      isRestaurantLoggedIn: false,
    };
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType"); // 'user' veya 'restaurant'
      if (token) {
        if (userType === 'user') {
          this.isUserLoggedIn = true;
          this.isRestaurantLoggedIn = false;
        } else if (userType === 'restaurant') {
          this.isUserLoggedIn = false;
          this.isRestaurantLoggedIn = true;
        }
      } else {
        this.isUserLoggedIn = false;
        this.isRestaurantLoggedIn = false;
      }
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      this.isUserLoggedIn = false;
      this.isRestaurantLoggedIn = false;
      this.$router.push("/");
    },
  },
  created() {
    this.checkLoginStatus();
  },
};
</script>

<style>
.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar .logo {
  font-size: 28px;
  font-weight: bold;
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.navbar .logo:hover {
  color: #18bc9c;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
}

.nav-links li {
  text-decoration: none;
}

.nav-links a {
  text-decoration: none;
  font-size: 16px;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  transition: background-color 0.3s, color 0.3s;
}

.nav-links a:hover {
  background-color: #18bc9c;
  color: white;
}

.nav-links .active {
  background-color: #18bc9c;
  color: white;
}
</style>
