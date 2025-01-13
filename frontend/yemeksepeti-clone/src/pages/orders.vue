<template>
    <div class="user-orders">
      <h1>Siparişlerim</h1>
  
      <div v-if="orders.length === 0" class="empty-orders">
        <p>Henüz bir siparişiniz bulunmamaktadır.</p>
      </div>
  
      <div v-else class="orders-container">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <h3>Restoran: {{ order.restaurant_name }}</h3>
          <p>Toplam Tutar: {{ order.total_price }}₺</p>
          <p>Durum: 
            <span 
              :class="{
                pending: order.status === 'pending',
                confirmed: order.status === 'confirmed',
                completed: order.status === 'completed',
                rejected: order.status === 'rejected',
              }"
            >
              {{ statusText(order.status) }}
            </span>
          </p>
          <p>Sipariş Tarihi: {{ formatDate(order.created_at) }}</p>
  
          <h4>Ürünler:</h4>
          <ul class="order-items">
            <li v-for="item in order.items" :key="item.name" class="order-item">
              <img :src="item.image_url || '/placeholder.jpg'" alt="Ürün Görseli" />
              <div>
                <p>{{ item.name }}</p>
                <p>{{ item.price }}₺ x {{ item.quantity }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        orders: [],
      };
    },
    methods: {
      async fetchOrders() {
        try {
          const response = await axios.get("http://localhost:5000/api/orders/user", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          this.orders = response.data;
        } catch (error) {
          console.error("Siparişler yüklenemedi:", error);
        }
      },
      statusText(status) {
        switch (status) {
          case "pending":
            return "Onay Bekleniyor";
          case "confirmed":
            return "Onaylandı";
          case "completed":
            return "Tamamlandı";
          case "rejected":
            return "Reddedildi";
          default:
            return "Bilinmiyor";
        }
      },
      formatDate(date) {
        return new Date(date).toLocaleString("tr-TR");
      },
    },
    created() {
      this.fetchOrders();
    },
  };
  </script>
  
  <style scoped>
  .user-orders {
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
  
  .order-items {
    list-style: none;
    padding: 0;
  }
  
  .order-item {
    display: flex;
    gap: 10px;
    margin: 10px 0;
  }
  
  .order-item img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 5px;
  }
  
  .pending {
    color: orange;
  }
  
  .confirmed {
    color: green;
  }
  
  .completed {
    color: blue;
  }
  
  .rejected {
    color: red;
  }
  </style>
  