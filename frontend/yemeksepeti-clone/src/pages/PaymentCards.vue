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
        <li @click="navigateTo('profile')">Profil Bilgileri</li>
        <li @click="navigateTo('addresses')">Adreslerim</li>
        <li class="active">Ödeme Kartlarım</li>
        <li @click="navigateTo('balance')">Bakiye Yükle</li>
        <li @click="navigateTo('myreservations2')">Rezervasyonlarım</li>
        <li @click="navigateTo('orders')">Siparişlerim</li>
      </ul>
    </aside>

   
    <section class="profile-content">
      <h1>Ödeme Kartlarım</h1>
      <div v-if="successMessage" class="alert success-alert">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert error-alert">
        {{ errorMessage }}
      </div>
      <div v-if="paymentCards.length === 0" class="alert">
        Henüz kredi kartı eklenmemiş.
      </div>
      <ul v-else class="card-list">
        <li v-for="card in paymentCards" :key="card.id" class="card-item">
          <div class="card">
            <div class="card-header">
              <h3>{{ card.card_holder_name }}</h3>
            </div>
            <div class="card-body">
              <p class="card-number">**** **** **** {{ card.card_number.slice(-4) }}</p>
              <p>Son Kullanım: {{ card.expiration_date }}</p>
            </div>
            <div class="card-actions">
              <button @click="editCard(card)" class="btn edit-btn">Düzenle</button>
              <button @click="deleteCard(card.id)" class="btn delete-btn">Sil</button>
            </div>
          </div>
        </li>
      </ul>

      <div class="add-card-button">
      <button class="btn save-btn" @click="toggleForm(true)">Yeni Kart Ekle</button>
    </div>

      <form v-if="showForm" @submit.prevent="addOrUpdateCard" class="card-form">
        <h2 v-if="editingCard">Kartı Düzenle</h2>
        <h2 v-else>Yeni Kart Ekle</h2>
        <div class="form-group">
          <label for="card_holder_name">Kart Sahibinin Adı</label>
          <input
            type="text"
            id="card_holder_name"
            v-model="newCard.card_holder_name"
            required
          />
        </div>
        <div class="form-group">
          <label for="card_number">Kart Numarası</label>
          <input
            type="text"
            id="card_number"
            v-model="newCard.card_number"
            @input="formatCardNumber"
            maxlength="19"
            required
          />
        </div>
        <div class="form-group">
          <label for="expiration_date">Son Kullanım Tarihi (AA/YY)</label>
          <input
            type="text"
            id="expiration_date"
            v-model="newCard.expiration_date"
            @input="formatExpirationDate"
            required
          />
          <small v-if="isInvalidDate" class="error">
            Geçersiz Tarih
          </small>
        </div>
        <div class="form-group">
          <label for="cvv">CVV</label>
          <input type="text" id="cvv" v-model="newCard.cvv" maxlength="3" required />
        </div>
        <button
          type="submit"
          class="btn save-btn"
          :disabled="isInvalidDate"
        >
          {{ editingCard ? "Değişiklikleri Kaydet" : "Kart Ekle" }}
        </button>
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
      newCard: {
        card_holder_name: "",
        card_number: "",
        expiration_date: "",
        cvv: "",
      },
      editingCard: null,
      successMessage: "",
      errorMessage: "",
      isInvalidDate: false,
      showForm: false,
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
        this.errorMessage = "Kredi kartları yüklenemedi.";
        console.error(error);
      }
    },
    formatCardNumber() {
      const value = this.newCard.card_number.replace(/\D/g, "");
      this.newCard.card_number = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    },
    formatExpirationDate() {
      const value = this.newCard.expiration_date.replace(/\D/g, ""); 
      if (value.length <= 2) {
        this.newCard.expiration_date = value;
      } else {
        this.newCard.expiration_date = value.slice(0, 2) + "/" + value.slice(2, 4);
      }
      this.validateExpirationDate();
    },
    validateExpirationDate() {
      const [month, year] = this.newCard.expiration_date.split("/");
      const now = new Date();
      const currentYear = now.getFullYear() % 100; 
      const currentMonth = now.getMonth() + 1;

      if (
        !month ||
        !year ||
        month < 1 ||
        month > 12 ||
        year < currentYear ||
        (year == currentYear && month < currentMonth)
      ) {
        this.isInvalidDate = true;
      } else {
        this.isInvalidDate = false;
      }
    },
    async addOrUpdateCard() {
      if (this.editingCard) {
        try {
          const response = await axios.put(
            `http://localhost:5000/api/payment-cards/${this.editingCard.id}`,
            this.newCard,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          const index = this.paymentCards.findIndex(
            (card) => card.id === this.editingCard.id
          );
          this.paymentCards.splice(index, 1, response.data);
          this.successMessage = "Kart başarıyla güncellendi!";
          this.errorMessage = "";
        } catch (error) {
          this.errorMessage = "Kart güncellenemedi.";
        }
      } else {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/payment-cards",
            this.newCard,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          this.paymentCards.push(response.data);
          this.successMessage = "Kart başarıyla eklendi!";
          this.errorMessage = "";
        } catch (error) {
          this.errorMessage = "Kart eklenemedi.";
        }
      }
      this.resetForm();
      this.showForm = false;
    },
    toggleForm(show) {
      this.showForm = show;
      this.resetForm();
    },
    async deleteCard(id) {
      try {
        await axios.delete(`http://localhost:5000/api/payment-cards/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.paymentCards = this.paymentCards.filter((card) => card.id !== id);
        this.successMessage = "Kart başarıyla silindi!";
      } catch (error) {
        this.errorMessage = "Kart silinemedi.";
      }
    },
    editCard(card) {
      this.editingCard = card;
      this.newCard = { ...card };
      this.showForm = true;
    },
    resetForm() {
      this.newCard = {
        card_holder_name: "",
        card_number: "",
        expiration_date: "",
        cvv: "",
      };
      this.editingCard = null;
      setTimeout(() => (this.successMessage = ""), 3000);
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






<<style>
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

.menu li.active {
  background-color: #007bff;
  color: white;
}


.profile-content {
  width: 70%;
  padding: 30px;
}

.profile-content h1 {
  margin-bottom: 20px;
  font-size: 24px;
}

.alert {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  border-radius: 5px;
}

.success-alert {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.error-alert {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card-item {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border-radius: 10px;
  padding: 15px;
  width: calc(33.333% - 20px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.card-header {
  font-size: 1.2rem;
  font-weight: bold;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.card-number {
  font-size: 1.1rem;
  letter-spacing: 2px;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.btn:hover {
  background-color: #0056b3;
}

.delete-btn {
  background-color: #d9534f;
}

.delete-btn:hover {
  background-color: #c82333;
}

.edit-btn {
  background-color: #28a745;
}

.edit-btn:hover {
  background-color: #218838;
}

.save-btn {
  background-color: #28a745;
  margin-top: 15px;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
}

.save-btn:hover {
  background-color: #218838;
}

.card-form {
  margin-top: 20px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
  font-size: 14px;
}

.error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

</style>>

