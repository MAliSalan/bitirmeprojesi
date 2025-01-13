<template>
  <div class="my-reservations">
    <h1>Rezervasyonlarım</h1>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-if="reservations.length === 0 && !errorMessage" class="no-reservations">
      Henüz bir rezervasyonunuz yok.
    </div>

    <ul v-if="reservations.length > 0">
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
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      reservations: [],
      errorMessage: "",
    };
  },
  methods: {
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
  },
  created() {
    this.fetchReservations();
  },
};
</script>

<style>
.my-reservations {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.no-reservations {
  text-align: center;
  font-size: 18px;
  color: #666;
}

ul {
  list-style: none;
  padding: 0;
}

.reservation-item {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.reservation-item h2 {
  margin: 0 0 10px;
}

.cancel-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.cancel-btn:hover {
  background-color: #c9302c;
}

.error-message {
  color: red;
  font-weight: bold;
  text-align: center;
}
</style>
