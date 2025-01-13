<template>
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
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        reservations: [],
        successMessage: "",
        errorMessage: "",
      };
    },
    methods: {
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
    },
    created() {
      this.fetchReservations();
    },
  };
  </script>
  
  <style scoped>
  .reservation-management {
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
  .empty-reservations {
    text-align: center;
    font-size: 1.2rem;
    color: #888;
  }
  .reservations-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .reservation-card {
    padding: 15px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  .reservation-info {
    margin-bottom: 10px;
  }
  .reservation-actions {
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
  .confirmed-message {
    color: #2ecc71;
    font-weight: bold;
  }
  .rejected-message {
    color: #e74c3c;
    font-weight: bold;
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
  