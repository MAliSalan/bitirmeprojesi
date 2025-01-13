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
        <div class="reservation-management">
      <h1>Gelen Rezervasyonlar</h1>
      <div v-if="reservations.length === 0" class="empty-reservations">
        <p>Henüz bir rezervasyon alınmamış.</p>
      </div>
      <div v-else class="reservations-container">
        <div v-for="reservation in reservations" :key="reservation.id" class="reservation-card">
          <div class="reservation-info">
            <h3>Rezervasyon ID: {{ reservation.id }}</h3>
            <p>Müşteri: {{ reservation.customer_name }}</p>
            <p>Masa Numarası: {{ reservation.table_number }}</p>
            <p>Tarih ve Saat: {{ new Date(reservation.reservation_time).toLocaleString() }}</p>
            <p>Durum: {{ reservation.status }}</p>
          </div>
          <div class="reservation-actions" v-if="reservation.status === 'pending'">
            <button @click="confirmReservation(reservation.id)" class="btn confirm-btn">Onayla</button>
            <button @click="rejectReservation(reservation.id)" class="btn reject-btn">Reddet</button>
          </div>
          <div class="reservation-actions" v-else-if="reservation.status === 'confirmed'">
            <p class="confirmed-message">Rezervasyon Onaylandı</p>
          </div>
          <div class="reservation-actions" v-else-if="reservation.status === 'rejected'">
            <p class="rejected-message">Rezervasyon Reddedildi</p>
          </div>
        </div>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
    </section>
    </div>
  </template>
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        reservations: [],
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
      async fetchReservations() {
        try {
          const response = await axios.get("http://localhost:5000/api/reservations/restaurant", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          this.reservations = response.data;
        } catch (error) {
          console.error("Rezervasyonlar yüklenemedi:", error);
          this.errorMessage = "Rezervasyonlar yüklenemedi.";
        }
      },
      async confirmReservation(reservationId) {
        try {
          await axios.put(
            `http://localhost:5000/api/reservations/${reservationId}/confirm`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          this.successMessage = "Rezervasyon onaylandı!";
          this.fetchReservations();
        } catch (error) {
          console.error("Rezervasyon onaylanamadı:", error);
          this.errorMessage = "Rezervasyon onaylanamadı.";
        }
      },
      async rejectReservation(reservationId) {
        try {
          await axios.put(
            `http://localhost:5000/api/reservations/${reservationId}/reject`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          this.successMessage = "Rezervasyon reddedildi.";
          this.fetchReservations();
        } catch (error) {
          console.error("Rezervasyon reddedilemedi:", error);
          this.errorMessage = "Rezervasyon reddedilemedi.";
        }
      },
      navigateTo(page) {
        this.$router.push(`/${page}`);
      },
    },
    created() {
      this.fetchRestaurant();
      this.fetchReservations();
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
   width: 25%;
   background-color: #ffffff;
   padding: 20px;
   border-right: 1px solid #ddd;
   flex-shrink: 0;
 }
 
 .profile-header {
   text-align: center;
   margin-bottom: 20px;
 }
 
 .profile-header h2 {
   font-size: 18px;
   margin: 10px 0;
 }
 
 .profile-sidebar .menu {
   list-style: none;
   padding: 0;
 }
 
 .profile-sidebar .menu li {
   padding: 8px 10px;
   cursor: pointer;
   border-radius: 5px;
   margin-bottom: 8px;
   background-color: #f0f0f0;
   text-align: center;
   transition: background-color 0.3s ease;
 }
 
 .profile-sidebar .menu li:hover {
   background-color: #e0e0e0;
 }
 
 .profile-sidebar .menu li.active {
   background-color: #007bff;
   color: white;
 }
 
 
 .profile-content {
   width: 75%;
   padding: 20px;
 }
 
 h1 {
   text-align: center;
   margin-bottom: 15px;
   font-size: 18px;
 }
 
 .reservations-container {
   display: grid;
   grid-template-columns: repeat(3, 1fr);
   gap: 15px;
 }
 
 .reservation-card {
   padding: 10px;
   background: white;
   border-radius: 8px;
   box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
   font-size: 12px;
 }
 
 .reservation-info {
   margin-bottom: 10px;
 }
 
 .reservation-info h3 {
   font-size: 14px;
   margin-bottom: 5px;
 }
 
 .reservation-info p {
   font-size: 12px;
   margin: 3px 0;
 }
 
 .reservation-actions {
   display: flex;
   justify-content: space-between;
 }
 
 .btn {
   background-color: #007bff;
   color: white;
   padding: 5px 10px;
   border: none;
   border-radius: 5px;
   font-size: 12px;
   cursor: pointer;
 }
 
 .btn:hover {
   background-color: #0056b3;
 }
 
 .confirm-btn {
   background: #2ecc71;
 }
 
 .reject-btn {
   background: #e74c3c;
 }
 
 .confirmed-message {
   color: #2ecc71;
   font-weight: bold;
   font-size: 12px;
 }
 
 .rejected-message {
   color: #e74c3c;
   font-weight: bold;
   font-size: 12px;
 }
 
 .error-message {
   color: red;
   text-align: center;
   margin-top: 10px;
   font-size: 12px;
 }
 
 .success-message {
   color: green;
   text-align: center;
   margin-top: 10px;
   font-size: 12px;
 }
 </style>
 