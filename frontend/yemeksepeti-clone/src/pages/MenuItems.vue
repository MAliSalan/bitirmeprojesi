<template>
    <div class="menu-items">
      <h1>Menülerim</h1>
      <div v-if="successMessage" class="alert success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="alert error">{{ errorMessage }}</div>
  
      <div class="menu-grid">
        <div v-for="item in menuItems" :key="item.id" class="menu-card">
          <img :src="item.image_url" alt="Menu Item" class="menu-image" />
          <h2>{{ item.name }}</h2>
          <p class="description">{{ item.description }}</p>
          <p class="price">{{ item.price }}₺</p>
          <button @click="editItem(item)" class="btn update">Bilgi Güncelle</button>
          <button @click="deleteItem(item.id)" class="btn delete">Kaldır</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        menuItems: [],
        successMessage: "",
        errorMessage: "",
      };
    },
    methods: {
      async fetchMenuItems() {
        try {
          const response = await axios.get("http://localhost:5000/api/menu", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          this.menuItems = response.data;
        } catch (error) {
          console.error("Menü öğeleri yüklenemedi:", error);
          this.errorMessage = "Menü öğeleri yüklenemedi.";
        }
      },
      async deleteItem(id) {
        try {
          await axios.delete(`http://localhost:5000/api/menu/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          this.menuItems = this.menuItems.filter((item) => item.id !== id);
          this.successMessage = "Menü öğesi başarıyla kaldırıldı!";
        } catch (error) {
          console.error("Menü öğesi silinemedi:", error);
          this.errorMessage = "Menü öğesi silinemedi.";
        }
      },
      editItem(item) {
       
        alert(`Bilgi güncelle: ${item.name}`);
      },
    },
    created() {
      this.fetchMenuItems();
    },
  };
  </script>
  
  <style>
  .my-menu {
  max-width: 1200px;
  margin: 30px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.my-menu h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.menu-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 20px;
}

.menu-item div {
  flex: 1;
}

.menu-item h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.menu-item p {
  margin: 5px 0 0;
  font-size: 16px;
  color: #555;
}

.actions {
  display: flex;
  gap: 10px;
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

.delete-btn {
  background-color: #dc3545;
}

.delete-btn:hover {
  background-color: #c82333;
}

.save-btn {
  background-color: #28a745;
}

.save-btn:hover {
  background-color: #218838;
}
  </style>
  