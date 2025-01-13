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
        <li @click="navigateTo('profile')" class="active">Profil Bilgileri</li>
        <li @click="navigateTo('addresses')">Adreslerim</li>
        <li @click="navigateTo('payment-cards')">Ödeme Kartlarım</li>
        <li @click="navigateTo('balance')">Bakiye Yükle</li>
        <li @click="navigateTo('myreservations2')">Rezervasyonlarım</li>
        <li @click="navigateTo('orders')">Siparişlerim</li>
      </ul>
    </aside>

    <section class="profile-content">
      <h1>Profil Bilgileri</h1>
      <div v-if="successMessage" class="alert success-alert">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert error-alert">
        {{ errorMessage }}
      </div>
      <form @submit.prevent="saveProfile">
        <div class="form-group">
          <label for="first_name">Ad</label>
          <input type="text" id="first_name" v-model="user.first_name" />
        </div>
        <div class="form-group">
          <label for="last_name">Soyad</label>
          <input type="text" id="last_name" v-model="user.last_name" />
        </div>
        <div class="form-group">
          <label for="phone_number">Telefon</label>
          <input type="text" id="phone_number" v-model="user.phone_number" />
        </div>
        <div class="form-group">
          <label for="email">E-posta</label>
          <input type="email" v-model="user.email" id="email" disabled />
        </div>
        <button type="submit" class="btn save-btn">Değişiklikleri Kaydet</button>
      </form>
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
        phone_number: "",
        credits: 0,
        image: "",
      },
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async fetchProfile() {
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.user = response.data;
      } catch (error) {
        console.error("Profil bilgileri yüklenemedi:", error);
      }
    },
    async saveProfile() {
      try {
        await axios.put(
          "http://localhost:5000/api/profile",
          {
            first_name: this.user.first_name,
            last_name: this.user.last_name,
            phone_number: this.user.phone_number,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        this.successMessage = "Profil bilgileri başarıyla güncellendi.";
        this.errorMessage = "";
      } catch (error) {
        console.error("Profil güncellenemedi:", error);
      }
    },
    navigateTo(page) {
      this.$router.push(`/${page}`);
    },
  },
  created() {
    this.fetchProfile();
  },
};
</script>

  
  <style>
  
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
    font-size: 20px;
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
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 5px;
    margin-bottom: 10px;
    transition: background-color 0.3s;
  }
  
  .menu li:hover {
    background-color: #f0f0f0;
  }
  
 
  .profile-content {
    width: 70%;
    padding: 30px;
  }
  
  .profile-content h1 {
    margin-bottom: 20px;
    font-size: 24px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .btn {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .save-btn {
    background-color: #d9534f;
    margin-top: 15px;
  }
  
  .save-btn:hover {
    background-color: #c9302c;
  }
  </style>
  