<template>
  <div class="add-restaurant">
    <h1>Restoran Ekle</h1>
    <form @submit.prevent="addRestaurant">
      <div class="form-group">
        <label for="name">Ad:</label>
        <input type="text" id="name" v-model="restaurant.name" placeholder="Restoran Adı" required />
      </div>
      <div class="form-group">
        <label for="address">Adres:</label>
        <input type="text" id="address" v-model="restaurant.address" placeholder="Restoran Adresi" />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="restaurant.email" placeholder="Email Adresi" required />
      </div>
      <div class="form-group">
        <label for="password">Şifre:</label>
        <input type="password" id="password" v-model="restaurant.password" placeholder="Şifre" required />
      </div>
      <div class="form-group">
        <label for="description">Açıklama:</label>
        <textarea id="description" v-model="restaurant.description" placeholder="Restoran Hakkında..." rows="4"></textarea>
      </div>
      <div class="form-group">
        <label for="rating">Değerlendirme (0-5):</label>
        <input
          type="number"
          id="rating"
          v-model="restaurant.rating"
          min="0"
          max="5"
          step="0.1"
          placeholder="Örn: 4.5"
          required
        />
      </div>
      <div class="form-group">
        <label for="table_count">Masa Sayısı:</label>
        <input
          type="number"
          id="table_count"
          v-model="restaurant.table_count"
          min="1"
          placeholder="Masa Sayısı"
          required
        />
      </div>

      <button type="submit" class="btn">Ekle</button>
    </form>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
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
        email:"",
        password:"",
        description: "",
        rating: 0, 
        table_count: 1, 
      },
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async addRestaurant() {
      try {
        await axios.post("http://localhost:5000/api/restaurants", this.restaurant);

        this.successMessage = "Restoran başarıyla eklendi!";
        this.errorMessage = "";
        this.restaurant = {
          name: "",
          address: "",
          email:"",
          password:"",
          description: "",
          rating: 0,
          table_count: 1,
        };
      } catch (error) {
        console.error("Hata:", error);
        this.errorMessage = error.response?.data?.error || "Bir hata oluştu.";
        this.successMessage = "";
      }
    },
  },
};
</script>

<style>
.add-restaurant {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
  color: #2c3e50;
  text-transform: uppercase;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #34495e;
}

input,
textarea {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

textarea {
  resize: vertical;
}

input:focus,
textarea:focus {
  border-color: #18bc9c;
  outline: none;
}

.btn {
  padding: 15px 30px;
  background-color: #18bc9c;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;
}

.btn:hover {
  background-color: #16a085;
  transform: scale(1.05);
}

.success-message {
  color: #18bc9c;
  font-weight: bold;
  margin-top: 20px;
  text-align: center;
  font-size: 1.2rem;
}

.error-message {
  color: #e74c3c;
  font-weight: bold;
  margin-top: 20px;
  text-align: center;
  font-size: 1.2rem;
}
</style>
