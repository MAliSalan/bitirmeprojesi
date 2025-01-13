<template>
  <div class="restaurant-profile">
    <aside class="profile-sidebar">
      <div class="profile-header">
        <img :src="restaurant.image || 'https://via.placeholder.com/100'" alt="Restaurant Logo" class="profile-picture" />
        <h2>{{ restaurant.name }}</h2>
        <p>{{ restaurant.email }}</p>
        <p class="credits">Hesap Kredisi: <strong>{{ restaurant.credits }}₺</strong></p>
      </div>
      <ul class="menu">
        <li class="active">Restoran Bilgileri</li>
        <li @click="navigateTo('addmenu')">Menü Ekle</li>
        <li @click="navigateTo('ordersmanagement')">Gelen Siparişler</li>
        <li @click="navigateTo('reservationmanagement')">Gelen Rezervasyonlar</li>
      </ul>
    </aside>

    <section class="profile-content">
      <h1>Restoran Bilgileri</h1>
      <div v-if="successMessage" class="alert success-alert">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert error-alert">
        {{ errorMessage }}
      </div>
      <form @submit.prevent="updateRestaurant">
        <div class="form-group">
          <label for="name">Restoran Adı</label>
          <input type="text" id="name" v-model="restaurant.name" />
        </div>
        <div class="form-group">
          <label for="address">Adres</label>
          <input type="text" id="address" v-model="restaurant.address" />
        </div>
        <div class="form-group">
          <label for="description">Açıklama</label>
          <textarea id="description" v-model="restaurant.description"></textarea>
        </div>
        <div class="form-group">
          <label for="email">E-posta</label>
          <input type="email" id="email" v-model="restaurant.email"  disabled/>
        </div>
        <div class="form-group">
        <label for="rating">Değerlendirme (0-5):</label>
        <input
          type="number"
          id="rating"
          v-model="restaurant.rating"
          min="0"
          max="5"
          step="0.1"
          placeholder="Örn: 4.5"
          required
        />
      </div>
        <div class="form-group">
          <label for="table_count">Koltuk Sayısı</label>
          <input type="text" id="table_count" v-model="restaurant.table_count" />
        </div>
        <button type="submit" class="btn save-btn">Güncelle</button>
      </form>
    </section>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      restaurant: {
        name: "",
        address: "",
        description: "",
        email: "",
        rating: 0,
        table_count: 0,
        credits: 0,
      },
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async fetchRestaurant() {
      try {
      const response = await axios.get("http://localhost:5000/api/restaurantProfile/info", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      this.restaurant = response.data;
    } catch (error) {
      console.error("Restoran bilgileri alınamadı:", error);
      this.errorMessage = "Restoran bilgileri alınamadı.";
    }
    },
    async updateRestaurant() {
      try {
        await axios.put(
          `http://localhost:5000/api/restaurantProfile/info`,
          this.restaurant,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        this.successMessage = "Restoran bilgileri başarıyla güncellendi.";
        this.errorMessage = "";
      } catch (error) {
        this.errorMessage = "Restoran bilgileri güncellenemedi.";
        console.error(error);
      }
    },
    navigateTo(page) {
      this.$router.push(`/${page}`);
    },
  },
  created() {
    this.fetchRestaurant();
  },
};
</script>
<style>
.restaurant-profile {
  display: flex;
  max-width: 1200px;
  margin: 30px auto;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}


.profile-sidebar {
  width: 30%;
  background-color: #ffffff;
  padding: 20px;
  border-right: 1px solid #ddd;
}

.profile-header {
  text-align: center;
  margin-bottom: 20px;
}

.profile-header h2 {
  font-size: 24px;
  margin: 10px 0;
}

.profile-sidebar .menu {
  list-style: none;
  padding: 0;
}

.profile-sidebar .menu li {
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: #f0f0f0;
  text-align: center;
  transition: background-color 0.3s ease;
}

.profile-sidebar .menu li:hover {
  background-color: #e0e0e0;
}


.profile-content {
  width: 70%;
  padding: 30px;
}

.profile-content h1 {
  margin-bottom: 20px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.btn {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.btn:hover {
  background-color: #0056b3;
}

.profile-content .form-group textarea {
  resize: none;
  height: 100px;
}

.alert {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
}

.success-alert {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.error-alert {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
</style>