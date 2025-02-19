import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ProductsView from '@/views/ProductsView.vue';
import CartView from '@/views/CartView.vue';
import ContactView from '@/views/ContactView.vue';
import ProductDetailView from '@/views/ProductDetailView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/shop', component: ProductsView },
  { path: '/cart', component: CartView },
  { path: '/contacto', component: ContactView },
  { path: '/product/:id', component: ProductDetailView, props: true }, // ✅ Ruta dinámica para cada producto
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition; // Si el usuario usa el botón "atrás", vuelve a la posición guardada
    } else {
      return { top: 0, behavior: 'smooth' }; // Siempre sube al inicio con desplazamiento suave
    }
  }
});

export default router;
