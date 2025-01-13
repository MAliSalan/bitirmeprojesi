<template>
    <div class="profile-page">
      <aside class="profile-sidebar">
        <div class="profile-header">
          <img :src="user.image || 'https://via.placeholder.com/100'" alt="Profile" class="profile-picture" />
          <h2>{{ user.first_name }} {{ user.last_name }}</h2>
          <p>{{ user.email }}</p>
          <p class="credits">Hesap Kredisi: <strong>{{ user.credits }}₺</strong></p>
        </div>
        <ul class="menu">
          <li @click="navigateTo('profile')" >Profil Bilgileri</li>
          <li @click="navigateTo('addresses')">Adreslerim</li>
          <li @click="navigateTo('payment-cards')">Ödeme Kartlarım</li>
          <li @click="navigateTo('balance')">Bakiye Yükle</li>
          <li @click="navigateTo('myreservations2')">Rezervasyonlarım</li>
          <li @click="navigateTo('orders')"class="active">Siparişlerim</li>
        </ul>
      </aside>
  
      <section class="profile-content">
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
      </section>
    </div>
  </template>
  
    
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        orders: [],
        user: {
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          credits: 0,
          image: "",
        },
      };
    },
    methods: {
      async fetchProfile() {
        try {
          const response = await axios.get("http://localhost:5000/api/profile", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          this.user = response.data;
        } catch (error) {
          console.error("Profil bilgileri yüklenemedi:", error);
        }
      },
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
      navigateTo(page) {
        this.$router.push(`/${page}`);
      },
    },
    created() {
      this.fetchProfile();
      this.fetchOrders();
    },
  };
  </script>
  
    
    <style>
    
    .profile-page {
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
    
    .profile-picture {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-bottom: 10px;
    }
    
    .profile-header h2 {
      font-size: 20px;
      margin: 10px 0;
    }
    
    .credits {
      color: #d9534f;
      font-weight: bold;
    }
    
    .menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .menu li {
      padding: 10px 15px;
      cursor: pointer;
      border-radius: 5px;
      margin-bottom: 10px;
      transition: background-color 0.3s;
    }
    
    .menu li:hover {
      background-color: #f0f0f0;
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
    }
    
    .btn {
      background-color: #007bff;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    
    .save-btn {
      background-color: #d9534f;
      margin-top: 15px;
    }
    
    .save-btn:hover {
      background-color: #c9302c;
    }
    </style>
    