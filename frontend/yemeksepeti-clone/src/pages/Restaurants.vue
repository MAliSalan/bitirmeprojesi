<template>
  <div class="restaurants">
    <h1>Restoranlar</h1>
    <div v-if="loading" class="loading">Restoranlar yükleniyor...</div>
    <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-else>
      <div class="restaurant-list">
        <div
          v-for="restaurant in restaurants"
          :key="restaurant.id"
          class="restaurant-card"
        >
          <h2>{{ restaurant.name }}</h2>
          <p><strong>Adres:</strong> {{ restaurant.address || "Adres bilgisi yok." }}</p>
          <p><strong>Açıklama:</strong> {{ restaurant.description || "Açıklama yok." }}</p>
          <p><strong>Değerlendirme:</strong> {{ restaurant.rating }}/5</p>
          <button @click="viewDetails(restaurant.id)">Detayları Gör</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      restaurants: [],
      loading: true,
      errorMessage: "",
    };
  },
  async created() {
    try {
      const response = await axios.get("http://localhost:5000/api/restaurants");
      this.restaurants = response.data;
    } catch (error) {
      console.error("Restoranlar alınamadı:", error);
      this.errorMessage =
        "Restoranlar yüklenirken bir hata oluştu: " +
        (error.response?.data?.error || "Bilinmeyen bir hata.");
    } finally {
      this.loading = false;
    }
  },
  methods: {
    viewDetails(id) {
      this.$router.push(`/restaurants/${id}`);
    },
  },
};
</script>

<style>

.restaurants {
  max-width: 1200px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
  font-family: 'Arial', sans-serif;
  color: #2c3e50;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #34495e;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-bottom: 2px solid #18bc9c;
  display: inline-block;
  padding-bottom: 10px;
}

.loading {
  color: #18bc9c;
  font-weight: bold;
  font-size: 1.2rem;
}

.error-message {
  color: #e74c3c;
  font-weight: bold;
  font-size: 1.2rem;
}


.restaurant-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  padding: 20px;
}

.restaurant-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: left;
  border: 2px solid #f0f0f0;
}

.restaurant-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border-color: #18bc9c;
}

.restaurant-card h2 {
  font-size: 1.8rem;
  color: #34495e;
  margin-bottom: 15px;
  text-transform: capitalize;
}

.restaurant-card p {
  margin: 8px 0;
  color: #7f8c8d;
  font-size: 1rem;
}

button {
  margin-top: 15px;
  padding: 12px 25px;
  background-color: #18bc9c;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;
}

button:hover {
  background-color: #16a085;
  transform: scale(1.05);
}

button:active {
  background-color: #128a72;
}
</style>
