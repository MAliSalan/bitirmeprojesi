<template>
  <div class="cart-page">
    <h1>Sepetiniz</h1>

    <div v-if="cartItems.length === 0" class="empty-cart">
      <p>Sepetinizde ürün bulunmamaktadır.</p>
    </div>

    <div v-else class="cart-container">
      <ul class="cart-item-list">
        <li v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="item.menuItem.image_url || '/placeholder.jpg'" alt="Ürün Görseli" />
          <div class="cart-item-info">
            <h3>{{ item.menuItem.name }}</h3>
            <p>{{ item.menuItem.price }}₺ x {{ item.quantity }}</p>
          </div>
          <div class="cart-item-actions">
            <button @click="removeItem(item.id)" class="btn remove-btn">Sepetten Çıkar</button>
          </div>
        </li>
      </ul>

      <div class="cart-summary">
        <h2>Toplam: {{ totalAmount }}₺</h2>

        <div class="payment-section">
          <label>
            <input type="radio" value="balance" v-model="paymentMethod" /> Bakiyeden Kullan
          </label>
          <label>
            <input type="radio" value="card" v-model="paymentMethod" /> Kredi Kartı
          </label>

          <div v-if="paymentMethod === 'card'" class="card-selection">
            <label for="selectedCard">Kredi Kartı Seç:</label>
            <select v-model="selectedCard" id="selectedCard">
              <option v-for="card in cards" :key="card.id" :value="card.id">
                {{ card.card_holder_name }} - {{ card.card_number.slice(-4) }}
              </option>
            </select>
          </div>
        </div>

        <div class="address-section">
          <label for="selectedAddress">Adres Seç:</label>
          <select v-model="selectedAddress" id="selectedAddress">
            <option v-for="address in addresses" :key="address.id" :value="address.id">
              {{ address.name }} - {{ address.details }}
            </option>
          </select>
        </div>

        <button @click="placeOrder" class="btn order-btn">Siparişi Tamamla</button>
        <p v-if="successMessage" class="message success-message">{{ successMessage }}</p>
        <p v-if="errorMessage" class="message error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userBalance: 0,
      cartItems: [],
      cards: [],
      addresses: [],
      paymentMethod: "",
      selectedCard: null,
      selectedAddress: null,
      successMessage: "",
      errorMessage: "",
    };
  },
  computed: {
    totalAmount() {
      return this.cartItems.reduce(
        (total, item) => total + item.menuItem.price * item.quantity,
        0
      );
    },
  },
  methods: {
    async fetchCartItems() {
      try {
        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.cartItems = response.data;
      } catch (error) {
        console.error("Sepet verileri alınamadı:", error);
        this.errorMessage = "Sepet verileri alınamadı.";
      }
    },
    async fetchCards() {
      try {
        const response = await axios.get("http://localhost:5000/api/payment-cards", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.cards = response.data;
      } catch (error) {
        console.error("Kart verileri yüklenemedi:", error);
      }
    },
    async fetchAddresses() {
      try {
        const response = await axios.get("http://localhost:5000/api/addresses", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.addresses = response.data;
      } catch (error) {
        console.error("Adres verileri yüklenemedi:", error);
      }
    },
    async removeItem(id) {
      try {
        await axios.delete(`http://localhost:5000/api/cart/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.cartItems = this.cartItems.filter((item) => item.id !== id);
      } catch (error) {
        console.error("Ürün sepetten çıkarılamadı:", error);
      }
    },
    async placeOrder() {
  if (!this.selectedAddress || (this.paymentMethod === "card" && !this.selectedCard)) {
    this.errorMessage = "Lütfen tüm seçimleri tamamlayın.";
    return;
  }

  try {
    const orderTotal = this.cartItems.reduce((total, item) => total + item.menuItem.price, 0); // Toplam tutarı hesapla

    const requestBody = {
      address_id: this.selectedAddress,
      restaurant_id: this.cartItems[0]?.menuItem.restaurant_id,
      payment_method: this.paymentMethod,
      use_balance: this.paymentMethod === "balance",
    };

    const response = await axios.post("http://localhost:5000/api/orders", requestBody, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    this.successMessage = "Sipariş başarıyla oluşturuldu.";
    this.errorMessage = "";

    if (this.paymentMethod === "balance") {
      this.userBalance -= orderTotal; 
    }

    setTimeout(() => {
      this.cartItems = [];
      this.successMessage = ""; 
    }, 5000);
  } catch (error) {
    if (this.paymentMethod === "balance" && error.response?.data?.error === "Yetersiz bakiye.") {
      this.errorMessage = "Yetersiz bakiye.";
    } else {
      this.errorMessage = "Sipariş oluşturulamadı.";
    }
    this.successMessage = "";
  }
},
  },
  created() {
    this.fetchCartItems();
    this.fetchCards();
    this.fetchAddresses();
  },
};
</script>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
}
h1 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 20px;
}
.empty-cart {
  text-align: center;
  color: #888;
  font-size: 1.2rem;
}
.cart-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.cart-item-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.cart-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  gap: 20px;
}
.cart-item img {
  width: 80px;
  height: 80px;
  border-radius: 5px;
  object-fit: cover;
}
.cart-item-info {
  flex-grow: 1;
}
.cart-item-actions {
  display: flex;
  gap: 10px;
}
.btn {
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.remove-btn {
  background-color: #e74c3c;
  color: #fff;
}
.remove-btn:hover {
  background-color: #c0392b;
}
.order-btn {
  background-color: #2ecc71;
  color: white;
  width: 100%;
  padding: 15px 20px;
}
.order-btn:hover {
  background-color: #27ae60;
}
.message {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 15px;
}
.success-message {
  color: #27ae60;
}
.error-message {
  color: #e74c3c;
}
</style>
