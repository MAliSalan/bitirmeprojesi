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
          <li @click="navigateTo('profile')">Profil Bilgileri</li>
          <li @click="navigateTo('addresses')">Adreslerim</li>
          <li @click="navigateTo('payment-cards')">Ödeme Kartlarım</li>
          <li @click="navigateTo('balance')">Bakiye Yükle</li>
          <li class="active">Rezervasyonlarım</li>
          <li @click="navigateTo('orders')">Siparişlerim</li>
        </ul>
      </aside>
  
     
      <section class="profile-content">
        <h1>Rezervasyonlarım</h1>
        <div v-if="successMessage" class="alert success-alert">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert error-alert">
          {{ errorMessage }}
        </div>
        <div v-if="reservations.length === 0" class="alert">
          Henüz rezervasyon eklenmemiş.
        </div>
        <ul v-else>
            <li v-for="reservation in reservations" :key="reservation.id" class="reservation-item">
            <h2>{{ reservation.Restaurant.name }}</h2>
            <p><strong>Adres:</strong> {{ reservation.Restaurant.address }}</p>
            <p><strong>Açıklama:</strong> {{ reservation.Restaurant.description }}</p>
            <p><strong>Masa Numarası:</strong> {{ reservation.table_number }}</p>
            <p><strong>Tarih ve Saat:</strong> {{ formatDate(reservation.reservation_time) }}</p>
            <p><strong>Durum:</strong> {{ formatStatus(reservation.status) }}</p>
            <button @click="cancelReservation(reservation.id)" class="cancel-btn">
            Rezervasyonu İptal Et
            </button>
            </li>
        </ul>
        
      </section>
    </div>
  </template>
  
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        user: {
          first_name: "",
          last_name: "",
          email: "",
          credits: 0,
          image: "",
        },
        reservations: [],
        errorMessage: "",
      };
    },
    methods: {
      async fetchUserData() {
        try {
          const response = await axios.get("http://localhost:5000/api/profile", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          this.user = response.data;
        } catch (error) {
          console.error("Kullanıcı bilgileri yüklenemedi:", error);
        }
      },
      async fetchReservations() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/reservations/myreservations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.reservations = response.data;
      } catch (error) {
        console.error("Rezervasyonlar yüklenemedi:", error);
        this.errorMessage = "Rezervasyonlar yüklenemedi.";
      }
    },
    async cancelReservation(id) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/reservations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.reservations = this.reservations.filter(
          (reservation) => reservation.id !== id
        );
        alert("Rezervasyon başarıyla iptal edildi.");
      } catch (error) {
        console.error("Rezervasyon iptal edilemedi:", error);
        alert("Rezervasyon iptal edilemedi.");
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    formatStatus(status) {
      const statuses = {
        pending: "Beklemede",
        confirmed: "Onaylandı",
        cancelled: "İptal Edildi",
        completed: "Tamamlandı",
      };
      return statuses[status] || status;
    },
    navigateTo(page) {
      this.$router.push(`/${page}`);
    },
    },
    created() {
      this.fetchUserData();
      this.fetchReservations();
    },
  };
  
  </script>
  
  
  
  
  
  
  <style scoped>
  
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
    flex-shrink: 0;
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
    font-size: 18px;
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
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 5px;
    margin-bottom: 8px;
    transition: background-color 0.3s;
    text-align: center;
  }
  
  .menu li:hover {
    background-color: #f0f0f0;
  }
  
  .menu li.active {
    background-color: #f0f0f0;
    font-weight: bold;
  }
  
  
  .profile-content {
    width: 70%;
    padding: 20px;
  }
  
  .profile-content h1 {
    margin-bottom: 15px;
    font-size: 20px;
  }
  
  .alert {
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid transparent;
    border-radius: 5px;
    font-size: 14px;
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
  
  
  .reservation-item {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    font-size: 12px;
  }
  
  .reservation-item p {
    margin: 5px 0;
    font-size: 12px;
    color: #333;
  }
  
  .reservation-item h2 {
    font-size: 14px;
    margin-bottom: 8px;
  }
  
 
  .profile-content ul {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    padding: 0;
    list-style: none;
  }
  
  
  .btn {
    background-color: #007bff;
    color: white;
    padding: 5px 8px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
  }
  
  .btn:hover {
    background-color: #0056b3;
  }
  
  .cancel-btn {
    background-color: #d9534f;
  }
  
  .cancel-btn:hover {
    background-color: #c82333;
  }
  </style>
  

  
  