
import { createRouter, createWebHistory } from "vue-router";
import Profile from "./pages/Profile.vue";
import RestaurantProfile from "./pages/RestaurantProfile.vue";
import Register from "./pages/Register.vue";
import Login from "./pages/Login.vue";
import RestaurantLogin from "./pages/RestaurantLogin.vue";
import Home from "./pages/Home.vue";
import Restaurants from "./pages/Restaurants.vue";
import Reservations from "./pages/Reservations.vue";
import AddRestaurant from "./pages/AddRestaurant.vue";
import MyReservations from "./pages/MyReservations.vue";
import MyReservations2 from "./pages/MyReservations2.vue";
import RestaurantDetails from "./pages/RestaurantDetails.vue";
import MenuItems from "./pages/MenuItems.vue";
import Addresses from "./pages/Addresses.vue";
import PaymentCard from "./pages/PaymentCards.vue";
import addmenu from "./pages/addmenu.vue";
import cart from "./pages/cart.vue";
import OrdersManagement from "./pages/OrdersManagement2.vue";
import ReservationManagement from "./pages/ReservationManagement2.vue";
import orders from "./pages/orders2.vue";
import Balance from "./pages/Balance.vue";


const routes = [
  {path: "/balance", component: Balance},
  {path: "/orders", component: orders},
  {path: "/reservationmanagement", component: ReservationManagement},
  {path: "/ordersmanagement", component: OrdersManagement},
  {path: "/cart", component: cart},
  {path: "/addmenu", component: addmenu},
  {path: "/menu", component: MenuItems},
  { path: "/addresses", component: Addresses },
  { path: "/payment-cards", component: PaymentCard },
  { path: "/profile", component: Profile },
  { path: "/restaurantprofile", component: RestaurantProfile },
  { path: "/AddRestaurant", component: AddRestaurant },
  { path: "/MyReservations", component: MyReservations },
  { path: "/MyReservations2", component: MyReservations2 },
  { path: "/restaurants/:id", component: RestaurantDetails }, 
  { path: "/register", component: Register },
  { path: "/login", component: Login },
  { path: "/restaurantlogin", component: RestaurantLogin },
  { path: "/", component: Home },
  { path: "/restaurants", component: Restaurants },
  { path: "/reservations", component: Reservations },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
