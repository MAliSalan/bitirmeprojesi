<template>
  <div class="restaurant-profile">
    
    <aside class="profile-sidebar">
      <div class="profile-header">
        <img :src="restaurant.image || 'https://via.placeholder.com/100'" alt="Restaurant" class="profile-picture" />
        <h2>{{ restaurant.name }}</h2>
        <p>{{ restaurant.email }}</p>
        <p class="credits">Hesap Kredisi: <strong>{{ restaurant.credits }}₺</strong></p>
      </div>
      <ul class="menu">
        <li @click="navigateTo('restaurantprofile')">Restoran Bilgileri</li>
        <li class="active">Menü Ekle</li>
        <li @click="navigateTo('ordersmanagement')">Gelen Siparişler</li>
        <li @click="navigateTo('reservationmanagement')">Gelen Rezervasyonlar</li>
      </ul>
    </aside>
    <section class="profile-content">
      <h1>Menü Yönetimi</h1>

      <div v-if="successMessage" class="alert success-alert">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert error-alert">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="addOrUpdateMenuItem">
        <h2 v-if="editingMenuItem">Menü Öğesini Düzenle</h2>
        <h2 v-else>Yeni Menü Öğesi Ekle</h2>
        <div class="form-group">
          <label for="name">Yemek Adı</label>
          <input type="text" v-model="menuItem.name" required />
        </div>
        <div class="form-group">
          <label for="description">Açıklama</label>
          <textarea v-model="menuItem.description"></textarea>
        </div>
        <div class="form-group">
          <label for="price">Fiyat</label>
          <input type="number" v-model="menuItem.price" required />
        </div>
        <div class="form-group">
          <label for="image_url">Fotoğraf URL</label>
          <input type="text" v-model="menuItem.image_url" />
        </div>
        <button type="submit" class="btn save-btn">
          {{ editingMenuItem ? "Değişiklikleri Kaydet" : "Menüye Ekle" }}
        </button>
      </form>

      <div class="menu-items">
        <div
          v-for="item in menuItems"
          :key="item.id"
          class="menu-item-card"
        >
          <img :src="item.image_url" alt="Yemek Görseli" class="menu-item-image" />
          <div class="menu-details">
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <p><strong>{{ item.price }}₺</strong></p>
          </div>
          <div class="menu-actions">
            <button @click="editMenuItem(item)" class="btn edit-btn">Düzenle</button>
            <button @click="deleteMenuItem(item.id)" class="btn delete-btn">Sil</button>
          </div>
        </div>
      </div>
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
        description: "",
        email: "",
        adress: "",
        credits: 0,
        rating: 0,
        table_count: 0,
        image: "",
      },
      menuItems: [],
      menuItem: { name: "", description: "", price: "", image_url: "" },
      editingMenuItem: null,
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async fetchRestaurantData() {
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
    async fetchMenuItems() {
      try {
        const restaurantId = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id;
        const response = await axios.get(`http://localhost:5000/api/menu/${restaurantId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.menuItems = response.data;
      } catch (error) {
        console.error("Menü öğeleri yüklenemedi:", error);
        this.errorMessage = "Menü öğeleri yüklenemedi.";
      }
    },
    async addOrUpdateMenuItem() {
      try {
        const restaurantId = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id;
        const endpoint = this.editingMenuItem
          ? `http://localhost:5000/api/menu/${this.editingMenuItem.id}`
          : "http://localhost:5000/api/menu";
        const method = this.editingMenuItem ? "put" : "post";
        const response = await axios[method](endpoint, { ...this.menuItem, restaurant_id: restaurantId }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (this.editingMenuItem) {
          const index = this.menuItems.findIndex((item) => item.id === this.editingMenuItem.id);
          this.menuItems.splice(index, 1, response.data);
        } else {
          this.menuItems.push(response.data);
        }

        this.successMessage = this.editingMenuItem ? "Menü öğesi güncellendi!" : "Menü öğesi eklendi!";
        this.menuItem = { name: "", description: "", price: "", image_url: "" };
        this.editingMenuItem = null;
      } catch (error) {
        console.error("Menü öğesi eklenemedi veya güncellenemedi:", error);
        this.errorMessage = "Menü öğesi eklenemedi veya güncellenemedi.";
      }
    },
    editMenuItem(item) {
      this.editingMenuItem = item;
      this.menuItem = { ...item };
    },
    async deleteMenuItem(id) {
      try {
        await axios.delete(`http://localhost:5000/api/menu/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.menuItems = this.menuItems.filter((item) => item.id !== id);
        this.successMessage = "Menü öğesi silindi.";
      } catch (error) {
        console.error("Menü öğesi silinemedi:", error);
        this.errorMessage = "Menü öğesi silinemedi.";
      }
    },
    navigateTo(route) {
      this.$router.push(`/${route}`);
    },
  },
  created() {
    this.fetchRestaurantData();
    this.fetchMenuItems();
  },
};
</script>


<style scoped>
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

.profile-sidebar .menu li.active {
  background-color: #e0e0e0;
  font-weight: bold;
}

.profile-content {
  width: 70%;
  padding: 30px;
}

.profile-content h1 {
  margin-bottom: 20px;
  font-size: 24px;
}

.menu-items {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.menu-item-card {
  padding: 15px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.menu-item-image {
  width: 100%;
  height: auto;
  border-radius: 5px;
  margin-bottom: 10px;
}

.menu-details {
  margin-bottom: 10px;
}

.menu-details h3 {
  font-size: 18px;
  margin-bottom: 5px;
}

.menu-details p {
  font-size: 16px;
  color: #28a745;
  font-weight: bold;
}

.menu-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.btn {
  flex: 1;
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.btn.edit-btn {
  background-color: #ffc107;
}

.btn.delete-btn {
  background-color: #dc3545;
}

.btn:hover {
  opacity: 0.9;
}
</style>


