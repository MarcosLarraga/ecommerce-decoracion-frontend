import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ProductsView from '@/views/ProductsView.vue';
import CartView from '@/views/CartView.vue';


const routes = [
  { path: '/', component: HomeView },
  { path: '/productos', component: ProductsView },
  { path: '/carrito', component: CartView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;