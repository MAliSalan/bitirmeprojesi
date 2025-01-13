<template>
    <div class="orders-management">
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
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        orders: [],
        successMessage: "",
        errorMessage: "",
      };
    },
    methods: {
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
    },
    created() {
      this.fetchOrders();
    },
  };
  </script>
  
  <style scoped>
  .orders-management {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  .empty-orders {
    text-align: center;
    font-size: 1.2rem;
    color: #888;
  }
  .orders-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .order-card {
    padding: 15px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  .order-info {
    margin-bottom: 10px;
  }
  .order-actions {
    display: flex;
    gap: 10px;
  }
  .btn {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
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
  