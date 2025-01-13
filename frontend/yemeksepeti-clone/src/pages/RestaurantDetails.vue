<template>
  <div class="restaurant-details2">
    <h1 class="restaurant-title">{{ restaurant.name }}</h1>
    <p class="restaurant-description">{{ restaurant.description }}</p>
    <h2 class="menu-title">Menü</h2>
    <div v-if="menuItems.length === 0" class="no-menu">
      <p>Bu restoranın henüz bir menüsü yok.</p>
    </div>
    <div class="menu-container2">
      <div v-for="item in menuItems" :key="item.id" class="menu-item2">
        <img :src="item.image_url || '/placeholder.jpg'" alt="Menu item image" class="menu-item-image" />
        <div class="menu-item-content">
          <h3 class="menu-item-title">{{ item.name }}</h3>
          <p class="menu-item-price">{{ item.price }}₺</p>
          <div class="menu-actions2">
            <label for="quantity" class="quantity-label">Adet:</label>
            <input type="number" v-model.number="item.quantity" min="1" class="quantity-input" />
            <button @click="addToCart(item)" class="add-to-cart-button">Sepete Ekle</button>
          </div>
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
      restaurant: {},
      menuItems: [],
    };
  },
  methods: {
    async fetchRestaurantDetails() {
      const restaurantId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:5000/api/restaurants/${restaurantId}`);
        this.restaurant = response.data;
      } catch (error) {
        console.error("Restoran detayları yüklenemedi:", error);
      }
    },
    async fetchMenuItems() {
      const restaurantId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:5000/api/menu/${restaurantId}`);
        this.menuItems = response.data.map((item) => ({
          ...item,
          quantity: 1, 
        }));
      } catch (error) {
        console.error("Menü öğeleri yüklenemedi:", error);
      }
    },
    async addToCart(item) {
        const restaurantId = this.$route.params.id;
        const cartData = {
          menu_item_id: item.id,
          quantity: item.quantity,
          restaurant_id: restaurantId,
          price: item.price,
        };

        axios.post("http://localhost:5000/api/cart", cartData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(() => {
          alert(`${item.quantity} adet ${item.name} sepete eklendi!`);
        })
        .catch((error) => {
          console.error("Ürün sepete eklenemedi:", error);
          alert("Ürün sepete eklenemedi.");
        });
      },

  },
  created() {
    this.fetchRestaurantDetails();
    this.fetchMenuItems();
  },
};
</script>

<style scoped>
.restaurant-details2 {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f7f9fc;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.restaurant-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}
.restaurant-description {
  font-size: 1.2rem;
  color: #555;
  text-align: center;
  margin-bottom: 20px;
}
.menu-title {
  font-size: 2rem;
  color: #222;
  margin-bottom: 20px;
  text-align: center;
}
.no-menu {
  text-align: center;
  color: #888;
  font-size: 1.2rem;
}
.menu-container2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
.menu-item2 {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
}
.menu-item2:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.menu-item-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.menu-item-content {
  padding: 15px;
  text-align: center;
}
.menu-item-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}
.menu-item-price {
  font-size: 1.2rem;
  color: #28a745;
  margin-bottom: 20px;
  font-weight: bold;
}
.menu-actions2 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.quantity-label {
  font-size: 1rem;
  color: #555;
}
.quantity-input {
  width: 50px;
  padding: 5px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}
.add-to-cart-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}
.add-to-cart-button:hover {
  background-color: #0056b3;
}
</style>
