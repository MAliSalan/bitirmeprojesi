<template>
  <div class="reservations-modern">
    <h1>Rezervasyon Yap</h1>

    
    <div class="form-group-modern">
      <label for="restaurant">Restoran Seç:</label>
      <select id="restaurant" v-model="selectedRestaurant" @change="fetchRestaurantDetails">
        <option v-for="restaurant in restaurants" :key="restaurant.id" :value="restaurant">
          {{ restaurant.name }}
        </option>
      </select>
    </div>

    
    <div v-if="selectedRestaurant" class="restaurant-info-modern">
      <p><strong>Seçilen Restoran:</strong> {{ selectedRestaurant.name }}</p>
      <p><strong>Masa Sayısı:</strong> {{ selectedRestaurant.table_count }}</p>
    </div>

    
    <div class="table-selection-modern" v-if="selectedRestaurant && selectedRestaurant.table_count > 0">
      <p><strong>Masa Seçimi:</strong></p>
      <div class="tables-modern">
        <div
          v-for="n in selectedRestaurant.table_count"
          :key="n"
          :class="['table-modern', reservation.table_number === n ? 'selected' : '', isTableUnavailable(n) ? 'unavailable' : '']"
          @click="!isTableUnavailable(n) && selectTable(n)"
        >
          Masa {{ n }}
        </div>
      </div>
    </div>

    
    <div class="form-group-modern">
      <label for="reservation_time">Rezervasyon Tarihi ve Saati:</label>
      <input type="datetime-local" id="reservation_time" v-model="reservation.reservation_time" @change="checkUnavailableTables" required />
    </div>

    
    <button @click="makeReservation" class="btn-modern">Rezervasyon Yap</button>

    
    <p v-if="successMessage" class="success-message-modern">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-message-modern">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      restaurants: [],
      selectedRestaurant: null,
      reservation: {
        restaurant_id: null,
        table_number: null,
        reservation_time: "",
      },
      unavailableTables: [],
      successMessage: "",
      errorMessage: "",
    };
  },
  async created() {
    try {
      const response = await axios.get("http://localhost:5000/api/restaurants");
      this.restaurants = response.data;
    } catch (error) {
      console.error("Restoranlar yüklenemedi:", error);
      this.errorMessage = "Restoranlar yüklenemedi.";
    }
  },
  methods: {
    fetchRestaurantDetails() {
      if (this.selectedRestaurant) {
        this.reservation.restaurant_id = this.selectedRestaurant.id;
        this.reservation.table_number = null;
        this.unavailableTables = [];
      }
    },
    async checkUnavailableTables() {
      if (this.selectedRestaurant && this.reservation.reservation_time) {
        try {
          const response = await axios.post("http://localhost:5000/api/reservations/unavailable", {
            restaurant_id: this.selectedRestaurant.id,
            reservation_time: this.reservation.reservation_time,
            time_range: 120,
          });
          this.unavailableTables = response.data.unavailableTables;
        } catch (error) {
          console.error("Masa uygunluk kontrolü hatası:", error);
        }
      }
    },
    isTableUnavailable(tableNumber) {
      return this.unavailableTables.includes(tableNumber);
    },
    selectTable(tableNumber) {
      this.reservation.table_number = tableNumber;
    },
    async makeReservation() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.errorMessage = "Rezervasyon yapabilmek için giriş yapmalısınız.";
          return;
        }

        await axios.post("http://localhost:5000/api/reservations", this.reservation, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.successMessage = "Rezervasyon başarıyla yapıldı!";
        this.errorMessage = "";
        this.reservation = {
          restaurant_id: null,
          table_number: null,
          reservation_time: "",
        };
      } catch (error) {
        console.error("Rezervasyon hatası:", error);
        this.errorMessage = error.response?.data?.error || "Rezervasyon sırasında bir hata oluştu.";
        this.successMessage = "";
      }
    },
  },
};
</script>

<style scoped>
.reservations-modern {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fefefe;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #2c3e50;
}


.form-group-modern {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #34495e;
}

select,
input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

select:focus,
input:focus {
  border-color: #0984e3;
  outline: none;
}


.tables-modern {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  margin-top: 15px;
}

.table-modern {
  background-color: #74b9ff;
  color: white;
  padding: 12px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: transform 0.2s, background-color 0.3s;
}

.table-modern:hover {
  background-color: #0984e3;
  transform: scale(1.05);
}

.table-modern.selected {
  background-color: #00cec9;
}

.table-modern.unavailable {
  background-color: #d63031;
  cursor: not-allowed;
}


.btn-modern {
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  background-color: #00cec9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-modern:hover {
  background-color: #00b894;
}

.success-message-modern {
  color: #00cec9;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
}

.error-message-modern {
  color: #d63031;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
}

</style>
