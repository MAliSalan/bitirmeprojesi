<template>
  <div class="register-page">
    <div class="register-container">
      
      <div class="register-type">
        <button
          :class="['btn', selectedType === 'user' ? 'active' : '']"
          @click="selectType('user')"
        >
          Kullanıcı Kaydı
        </button>
        <button
          :class="['btn', selectedType === 'restaurant' ? 'active' : '']"
          @click="selectType('restaurant')"
        >
          Restoran Kaydı
        </button>
      </div>

      <h1 class="register-title">
        {{ selectedType === 'user' ? 'Kullanıcı Kaydı' : 'Restoran Kaydı' }}
      </h1>

      <form @submit.prevent="handleRegister">
        
        <div v-if="selectedType === 'user'">
          <div class="form-group">
            <label for="first_name" class="form-label">Ad</label>
            <input v-model="user.first_name" type="text" id="first_name" class="form-input" required />
          </div>
          <div class="form-group">
            <label for="last_name" class="form-label">Soyad</label>
            <input v-model="user.last_name" type="text" id="last_name" class="form-input" required />
          </div>
          <div class="form-group">
            <label for="email" class="form-label">E-posta</label>
            <input v-model="user.email" type="email" id="email" class="form-input" required />
          </div>
          <div class="form-group">
            <label for="password" class="form-label">Şifre</label>
            <input v-model="user.password" type="password" id="password" class="form-input" required />
          </div>
          <div class="form-group">
            <label for="phone_number" class="form-label">Telefon Numarası</label>
            <input v-model="user.phone_number" type="text" id="phone_number" class="form-input" required />
          </div>
        </div>

        
        <div v-if="selectedType === 'restaurant'">
          <div class="form-group">
            <label for="name" class="form-label">Restoran Adı</label>
            <input v-model="restaurant.name" type="text" id="name" class="form-input" required />
          </div>
          <div class="form-group">
            <label for="address" class="form-label">Adres</label>
            <input v-model="restaurant.address" type="text" id="address" class="form-input" />
          </div>
          <div class="form-group">
            <label for="email" class="form-label">E-posta</label>
            <input v-model="restaurant.email" type="email" id="email" class="form-input" required />
          </div>
          <div class="form-group">
            <label for="password" class="form-label">Şifre</label>
            <input v-model="restaurant.password" type="password" id="password" class="form-input" required />
          </div>
          <div class="form-group">
            <label for="description" class="form-label">Açıklama</label>
            <textarea
              v-model="restaurant.description"
              id="description"
              class="form-input"
              placeholder="Restoran hakkında kısa bir açıklama girin"
            ></textarea>
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
            <label for="table_count" class="form-label">Masa Sayısı</label>
            <input v-model="restaurant.table_count" type="number" id="table_count" class="form-input" min="1" required />
          </div>
        </div>

        <button type="submit" class="submit-button">Kaydet</button>
      </form>

      
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedType: "user", 
      user: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone_number: "",
      },
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
    selectType(type) {
      this.selectedType = type;
      this.successMessage = "";
      this.errorMessage = "";
    },
    async handleRegister() {
      try {
        const endpoint =
          this.selectedType === "user"
            ? "http://localhost:5000/api/auth/register"
            : "http://localhost:5000/api/restaurants";

        const payload = this.selectedType === "user" ? this.user : this.restaurant;

        await axios.post(endpoint, payload);

        this.successMessage =
          this.selectedType === "user"
            ? "Kullanıcı başarıyla kaydedildi!"
            : "Restoran başarıyla kaydedildi!";
        this.errorMessage = "";

        
        this.user = {
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          phone_number: "",
        };
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
        this.errorMessage =
          error.response?.data?.error || "Kayıt sırasında bir hata oluştu.";
        this.successMessage = "";
      }
    },
  },
};
</script>



<style>

.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f9;
}

.register-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
}

.register-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
  display: block;
}

.form-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}


.success-message {
  color: #18bc9c;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
}

.error-message {
  color: #e74c3c;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #555;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

.register-type {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.register-type .btn {
  flex: 1;
  margin: 0 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s, transform 0.3s;
}

.register-type .btn.active {
  background-color: #18bc9c;
  transform: scale(1.05);
}

.register-type .btn:hover {
  background-color: #0056b3;
}
</style>