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
        <h1>Gelen Siparişler</h1>
      <div v-if="orders.length === 0" class="empty-orders">
        <p>Henüz bir sipariş alınmamış.</p>
      </div>
      <div v-else class="orders-container">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-info">
            <h3>Sipariş ID: {{ order.id }}</h3>
            <p>Toplam Tutar: {{ order.total_price }}₺</p>
            <p>Durum: {{ order.status }}</p>
          </div>
          <div class="order-actions" v-if="order.status === 'pending'">
            <button @click="confirmOrder(order.id)" class="btn confirm-btn">Onayla</button>
            <button @click="rejectOrder(order.id)" class="btn reject-btn">Reddet</button>
          </div>
          <div class="order-actions" v-else-if="order.status === 'confirmed'">
            <button @click="completeOrder(order.id)" class="btn complete-btn">Tamamla</button>
          </div>
        </div>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
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
        orders: [],
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
      async fetchOrders() {
        try {
          const response = await axios.get("http://localhost:5000/api/orders/restaurant", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          this.orders = response.data;
        } catch (error) {
          console.error("Siparişler yüklenemedi:", error);
          this.errorMessage = "Siparişler yüklenemedi.";
        }
      },
      async confirmOrder(orderId) {
        try {
          await axios.put(
            `http://localhost:5000/api/orders/${orderId}/confirm`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          this.successMessage = "Sipariş onaylandı!";
          this.fetchOrders();
        } catch (error) {
          console.error("Sipariş onaylanamadı:", error);
          this.errorMessage = "Sipariş onaylanamadı.";
        }
      },
      async completeOrder(orderId) {
        try {
          await axios.put(
            `http://localhost:5000/api/orders/${orderId}/complete`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          this.successMessage = "Sipariş tamamlandı!";
          this.fetchOrders();
        } catch (error) {
          console.error("Sipariş tamamlanamadı:", error);
          this.errorMessage = "Sipariş tamamlanamadı.";
        }
      },
      async rejectOrder(orderId) {
        try {
          await axios.put(
            `http://localhost:5000/api/orders/${orderId}/reject`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          this.successMessage = "Sipariş reddedildi.";
          this.fetchOrders();
        } catch (error) {
          console.error("Sipariş reddedilemedi:", error);
          this.errorMessage = "Sipariş reddedilemedi.";
        }
      },
      navigateTo(page) {
        this.$router.push(`/${page}`);
      },
    },
    created() {
      this.fetchRestaurant();
      this.fetchOrders();
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
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.orders-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.order-card {
  padding: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
}

.order-info {
  margin-bottom: 10px;
  text-align: center;
}

.order-actions {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.btn {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  font-size: 0.8rem;
  cursor: pointer;
}

.confirm-btn {
  background: #2ecc71;
  color: white;
}

.reject-btn {
  background: #e74c3c;
  color: white;
}

.complete-btn {
  background: #3498db;
  color: white;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.success-message {
  color: green;
  text-align: center;
  margin-top: 10px;
}
</style>
