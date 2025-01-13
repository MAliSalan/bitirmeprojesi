<template>
  <div class="login-page">
    <div class="login-container">
      
      <div class="login-type">
        <button
          :class="['btn', selectedType === 'user' ? 'active' : '']"
          @click="selectType('user')"
        >
          Kullanıcı Girişi
        </button>
        <button
          :class="['btn', selectedType === 'restaurant' ? 'active' : '']"
          @click="selectType('restaurant')"
        >
          Restoran Girişi
        </button>
      </div>

      <h1 class="login-title">Giriş Yap</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email" class="form-label">E-posta</label>
          <input
            v-model="credentials.email"
            type="email"
            id="email"
            class="form-input"
            placeholder="E-posta adresinizi girin"
            required
          />
        </div>
        <div class="form-group">
          <label for="password" class="form-label">Şifre</label>
          <input
            v-model="credentials.password"
            type="password"
            id="password"
            class="form-input"
            placeholder="Şifrenizi girin"
            required
          />
        </div>
        <button type="submit" class="submit-button">Giriş Yap</button>
      </form>

      
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <p class="register-link">
        Hesabınız yok mu? <router-link to="/register">Kayıt Ol</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedType: "user", 
      credentials: {
        email: "",
        password: "",
      },
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    selectType(type) {
      this.selectedType = type;
      this.credentials = {
        email: "",
        password: "",
      }; 
      this.successMessage = "";
      this.errorMessage = "";
    },
    async handleLogin() {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/login", {
          email: this.credentials.email,
          password: this.credentials.password,
          type: this.selectedType, 
        });

        
        this.successMessage = "Başarıyla giriş yapıldı! Şimdi yönlendiriliyorsunuz...";
        this.errorMessage = "";
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userType", this.selectedType);

        
        setTimeout(() => {
          const redirectRoute =
            this.selectedType === "user" ? "/profile" : "/restaurantprofile";
          this.$router.push(redirectRoute);
        }, 5000);
      } catch (error) {
        console.error("Giriş hatası:", error);
        this.successMessage = "";
        this.errorMessage =
          error.response?.data?.error || "Giriş sırasında bir hata oluştu.";
      }
    },
  },
};
</script>

<style>

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f9;
}

.login-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
}

.login-title {
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

.login-type {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.login-type .btn {
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

.login-type .btn.active {
  background-color: #18bc9c;
  transform: scale(1.05);
}

.login-type .btn:hover {
  background-color: #0056b3;
}
</style>
