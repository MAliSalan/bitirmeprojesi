<template>
    <div class="login-page">
      <div class="login-container">
        <h1 class="login-title">Giriş Yap</h1>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="email" class="form-label">E-posta</label>
            <input v-model="email" type="email" id="email" class="form-input" placeholder="E-posta adresinizi girin" required />
          </div>
          <div class="form-group">
            <label for="password" class="form-label">Şifre</label>
            <input v-model="password" type="password" id="password" class="form-input" placeholder="Şifrenizi girin" required />
          </div>
          <button type="submit" class="submit-button">Giriş Yap</button>
        </form>
        <p class="register-link">Hesabınız yok mu? <router-link to="/register">Kayıt Ol</router-link></p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        email: "",
        password: "",
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post("http://localhost:5000/api/auth/restaurantlogin", {
            email: this.email,
            password: this.password,
          });
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userType", "restaurant");
          alert("Giriş başarılı!");
          this.$router.push("/");
        } catch (error) {
          alert("Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.");
          console.error(error);
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
  </style>
  