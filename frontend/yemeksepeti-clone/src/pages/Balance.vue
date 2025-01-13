<template>
    <div class="balance-page">
      
      <aside class="profile-sidebar">
        <div class="profile-header">
          <img :src="user.image || 'https://via.placeholder.com/100'" alt="Profile" class="profile-picture" />
          <h2>{{ user.first_name }} {{ user.last_name }}</h2>
          <p>{{ user.email }}</p>
          <p class="credits">Hesap Kredisi: <strong>{{ user.credits }}₺</strong></p>
        </div>
        <ul class="menu">
          <li @click="navigateTo('profile')">Profil Bilgileri</li>
          <li @click="navigateTo('addresses')">Adreslerim</li>
          <li @click="navigateTo('payment-cards')">Ödeme Kartlarım</li>
          <li class="active">Bakiye Yükle</li>
          <li @click="navigateTo('myreservations2')">Rezervasyonlarım</li>
          <li @click="navigateTo('orders')">Siparişlerim</li>
        </ul>
      </aside>
  
      
      <section class="profile-content">
        <h1>Bakiye Yükle</h1>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  
        <form @submit.prevent="loadBalance" class="balance-form">
          <div class="form-group">
            <label for="selectedCard">Kart Seç</label>
            <select v-model="selectedCard" id="selectedCard">
              <option value="" disabled>Kart Seçiniz</option>
              <option v-for="card in paymentCards" :key="card.id" :value="card.id">
                {{ card.card_holder_name }} - **** **** **** {{ card.card_number.slice(-4) }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="amount">Yüklenecek Tutar</label>
            <input
              type="number"
              id="amount"
              v-model.number="amount"
              min="1"
              placeholder="Tutarı Giriniz"
            />
          </div>
          <button type="submit" class="btn save-btn">Bakiye Yükle</button>
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
          credits: 0,
          image: "",
        },
        paymentCards: [],
        selectedCard: null,
        amount: null,
        successMessage: "",
        errorMessage: "",
      };
    },
    methods: {
      async fetchUserData() {
        try {
          const response = await axios.get("http://localhost:5000/api/profile", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          this.user = response.data;
        } catch (error) {
          console.error("Kullanıcı bilgileri yüklenemedi:", error);
        }
      },
      async fetchPaymentCards() {
        try {
          const response = await axios.get("http://localhost:5000/api/payment-cards", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          this.paymentCards = response.data;
        } catch (error) {
          console.error("Kart verileri yüklenemedi:", error);
        }
      },
      async loadBalance() {
        if (!this.selectedCard) {
          this.errorMessage = "Kart seçmelisiniz.";
          return;
        }
        if (!this.amount || this.amount <= 0) {
          this.errorMessage = "Geçerli bir tutar yazmalısınız.";
          return;
        }
  
        try {
          const response = await axios.post(
            "http://localhost:5000/api/payment/load-balance",
            { card_id: this.selectedCard, amount: this.amount },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          this.successMessage = "Bakiye başarıyla yüklendi!";
          this.errorMessage = "";
  
          
          this.user.credits += this.amount;
  
          
          setTimeout(() => (this.successMessage = ""), 2000);
        } catch (error) {
          console.error("Bakiye yüklenemedi:", error);
          this.errorMessage = "Bakiye yüklenemedi.";
          this.successMessage = "";

          setTimeout(() => (this.errorMessage = ""), 2000);
        }
      },
      navigateTo(page) {
        this.$router.push(`/${page}`);
      },
    },
    created() {
      this.fetchUserData();
      this.fetchPaymentCards();
    },
  };
  </script>
  
  <style scoped>
  
  .balance-page {
    display: flex;
    max-width: 1200px;
    margin: 30px auto;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  
  </style>
  