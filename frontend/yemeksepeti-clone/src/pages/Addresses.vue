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
        <li class="active">Adreslerim</li>
        <li @click="navigateTo('payment-cards')">Ödeme Kartlarım</li>
        <li @click="navigateTo('balance')">Bakiye Yükle</li>
        <li @click="navigateTo('myreservations2')">Rezervasyonlarım</li>
        <li @click="navigateTo('orders')">Siparişlerim</li>
      </ul>
    </aside>

   
    <section class="profile-content">
      <h1>Adreslerim</h1>
      <div v-if="successMessage" class="alert success-alert">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert error-alert">
        {{ errorMessage }}
      </div>
      <div v-if="addresses.length === 0" class="alert">
        Henüz adres eklenmemiş.
      </div>
      <ul v-else>
        <li v-for="address in addresses" :key="address.id" class="address-item">
          <p><strong>{{ address.name }}</strong></p>
          <p>{{ address.address_line }}</p>
          <p>{{ address.city }}, {{ address.postal_code }}</p>
          <p v-if="address.phone_number">Telefon: {{ address.phone_number }}</p>
          <button @click="editAddress(address)" class="btn edit-btn">Düzenle</button>
          <button @click="deleteAddress(address.id)" class="btn delete-btn">Sil</button>
        </li>
      </ul>
      <form @submit.prevent="addOrUpdateAddress">
        <h2 v-if="editingAddress">Adresi Düzenle</h2>
        <h2 v-else>Yeni Adres Ekle</h2>
        <div class="form-group">
          <label for="name">Adres Adı</label>
          <input type="text" id="name" v-model="newAddress.name" required />
        </div>
        <div class="form-group">
          <label for="address_line">Adres</label>
          <input type="text" id="address_line" v-model="newAddress.address_line" required />
        </div>
        <div class="form-group">
          <label for="city">Şehir</label>
          <input type="text" id="city" v-model="newAddress.city" required />
        </div>
        <div class="form-group">
          <label for="postal_code">Posta Kodu</label>
          <input type="text" id="postal_code" v-model="newAddress.postal_code" required />
        </div>
        <div class="form-group">
          <label for="phone_number">Telefon</label>
          <input type="text" id="phone_number" v-model="newAddress.phone_number" />
        </div>
        <button type="submit" class="btn save-btn">
          {{ editingAddress ? "Değişiklikleri Kaydet" : "Adres Ekle" }}
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
      addresses: [],
      newAddress: {
        name: "",
        address_line: "",
        city: "",
        postal_code: "",
        phone_number: "",
      },
      editingAddress: null,
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
    async fetchAddresses() {
      try {
        const response = await axios.get("http://localhost:5000/api/addresses", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.addresses = response.data;
      } catch (error) {
        this.errorMessage = "Adresler yüklenemedi.";
        console.error(error);
      }
    },
    async addOrUpdateAddress() {
    if (this.editingAddress) {
      
      try {
        const response = await axios.put(
          `http://localhost:5000/api/addresses/${this.editingAddress.id}`,
          this.newAddress,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        
        const index = this.addresses.findIndex(
          (address) => address.id === this.editingAddress.id
        );
        this.addresses.splice(index, 1, response.data);

        this.successMessage = "Adres başarıyla güncellendi!";
        this.errorMessage = "";
      } catch (error) {
        console.error("Adres güncellenemedi:", error);
        this.errorMessage = "Adres güncellenemedi.";
        this.successMessage = "";
      }
    } else {
      
      try {
        const response = await axios.post(
          "http://localhost:5000/api/addresses",
          this.newAddress,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        this.addresses.push(response.data);
        this.successMessage = "Adres başarıyla eklendi!";
        this.errorMessage = "";
      } catch (error) {
        console.error("Adres eklenemedi:", error);
        this.errorMessage = "Adres eklenemedi.";
        this.successMessage = "";
      }
    }
    this.resetForm();
  },
    async deleteAddress(id) {
      try {
        await axios.delete(`http://localhost:5000/api/addresses/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.addresses = this.addresses.filter((address) => address.id !== id);
        this.successMessage = "Adres başarıyla silindi!";
      } catch (error) {
        this.errorMessage = "Adres silinemedi.";
        console.error(error);
      }
    },
    editAddress(address) {
      this.editingAddress = address;
      this.newAddress = { ...address };
    },
    resetForm() {
      this.newAddress = {
        name: "",
        address_line: "",
        city: "",
        postal_code: "",
        phone_number: "",
      };
      this.editingAddress = null;
      setTimeout(() => (this.successMessage = ""), 3000);
    },
    navigateTo(page) {
      this.$router.push(`/${page}`);
    },
  },
  created() {
    this.fetchUserData();
    this.fetchAddresses();
  },
};
</script>




<style scoped>

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

.menu li.active,
.menu li:hover {
  background-color: #f0f0f0;
  font-weight: bold;
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
  margin-bottom: 15px;
  border-radius: 5px;
  font-size: 14px;
  text-align: center;
}

.success-alert {
  background-color: #d4edda;
  color: #155724;
}

.error-alert {
  background-color: #f8d7da;
  color: #721c24;
}

.address-item {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  position: relative;
}

.address-item p {
  margin: 5px 0;
}

.btn {
  padding: 10px 15px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s;
}

.edit-btn {
  background-color: #28a745;
}

.delete-btn {
  background-color: #dc3545;
}

.save-btn {
  width: 100%;
  background-color: #007bff;
}

.cancel-btn {
  background-color: #6c757d;
  margin-top: 10px;
}

.cancel-btn:hover,
.edit-btn:hover,
.delete-btn:hover,
.save-btn:hover {
  opacity: 0.8;
}
.delete-btn:hover {
  background-color: #c9302c;
}

.edit-btn:hover {
  background-color: #0056b3;
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
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0056b3;
}

.save-btn {
  margin-top: 15px;
  width: 100%;
}

.save-btn:hover {
  background-color: #0056b3;
}
</style>
