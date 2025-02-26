import { createRouter, createWebHistory } from 'vue-router';

// Importación de vistas
import HomeView from '@/views/HomeView.vue';
import ProductsView from '@/views/ProductsView.vue';
import CartView from '@/views/CartView.vue';
import GuiaView from '@/views/GuiaView.vue';
import ContactView from '@/views/ContactView.vue';
import ProductDetailView from '@/views/ProductDetailView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import ForgotPasswordView from '@/views/ForgotPasswordView.vue';
import ResetPasswordView from '@/views/ResetPasswordView.vue';
import ConfirmarPedido from '@/views/ConfirmarPedido.vue';
import PedidoDetalle from '@/views/PedidoDetalle.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/shop', component: ProductsView },
  { path: '/cart', component: CartView },
  { path: '/pedido-confirmacion', component: ConfirmarPedido },
  { path: '/pedido-detalle/:id', component: PedidoDetalle, props: true }, // Se añade la ruta de detalle de pedido
  { path: '/guia', component: GuiaView },
  { path: '/contacto', component: ContactView },
  { path: '/product/:id', component: ProductDetailView, props: true },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/forgot-password', component: ForgotPasswordView },
  { path: '/reset-password', component: ResetPasswordView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: 'smooth' };
  }
});

export default router;
