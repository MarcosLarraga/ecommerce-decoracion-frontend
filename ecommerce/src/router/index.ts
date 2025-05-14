// router/index.ts (corregido)
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router'; // Importar como tipo
import { useUserStore } from '@/stores/userStore';

// Importación de vistas existentes
import HomeView from '../views/HomeView.vue';
import ProductsView from '../views/ProductsView.vue';
import CartView from '../views/CartView.vue';
import GuiaView from '../views/GuiaView.vue';
import ContactView from '../views/ContactView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue';
import ResetPasswordView from '../views/ResetPasswordView.vue';
import SobreNosotrosView from '../views/SobreNosotrosView.vue';
import ConfirmarPedido from '../views/ConfirmarPedidoView.vue';
import PedidoDetalle from '../views/PedidoDetalleView.vue';
import MiCuenta from '../views/MiCuentaView.vue';

// Nueva vista para login de administrador
import AdminLoginView from '../views/AdminLoginView.vue';

// Admin views
import AdminLayout from '../views/admin/AdminLayout.vue';
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import AdminUsers from '../views/admin/AdminUsers.vue';
import AdminProducts from '../views/admin/AdminProducts.vue';
import AdminOrders from '../views/admin/AdminOrders.vue';
import AdminProviders from '../views/admin/AdminProviders.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/shop', name: 'Products', component: ProductsView },
  { path: '/cart', name: 'Cart', component: CartView },
  { path: '/pedido-confirmacion', component: ConfirmarPedido },
  { path: '/pedido-detalle/:id', component: PedidoDetalle, props: true },
  { path: '/guia', name: 'Guia', component: GuiaView },
  { path: '/contacto', name: 'Contact', component: ContactView },
  { path: '/sobre-nosotros', name: 'SobreNosotros', component: SobreNosotrosView },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetailView, props: true },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/mi-cuenta', name: 'MiCuenta', component: MiCuenta, meta: { requiresAuth: true } },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPasswordView },
  { path: '/reset-password', name: 'ResetPassword', component: ResetPasswordView },
  
  // Ruta de login para administradores
  { path: '/admin-login', name: 'AdminLogin', component: AdminLoginView },
  
  // Rutas de administración
  { 
    path: '/admin', 
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'users', name: 'AdminUsers', component: AdminUsers },
      { path: 'products', name: 'AdminProducts', component: AdminProducts },
      { path: 'orders', name: 'AdminOrders', component: AdminOrders },
      { path: 'providers', name: 'AdminProviders', component: AdminProviders },
    ]
  },
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

// Navigation guards mejorados
router.beforeEach((to, from, next) => {
  console.log(`Navegando de ${from.path} a ${to.path}`);
  const userStore = useUserStore();
  
   // CORRECCIÓN: Usar isAuthenticated en lugar de isLoggedIn
  const isAuthenticated = userStore.isAuthenticated;
  const isAdmin = userStore.isAdmin;
  
  console.log(`Usuario autenticado: ${isAuthenticated}, Es admin: ${isAdmin}`);
  
  // Redirigir admins autenticados directamente al panel
  if (to.name === 'AdminLogin' && isAuthenticated && isAdmin) {
    console.log('Admin ya autenticado, redirigiendo al panel');
    return next({ path: '/admin' });
  }
  
  // Redirigir admins desde login normal al panel
  if (to.name === 'Login' && isAuthenticated && isAdmin) {
    console.log('Admin ya autenticado, redirigiendo desde login normal al panel');
    return next({ path: '/admin' });
  }
  
  // Verificar permisos de administrador
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    console.log('Ruta requiere permisos de administrador');
    
    if (!isAuthenticated) {
      console.log('No está autenticado, redirigiendo a admin-login');
      return next({ name: 'AdminLogin', query: { redirect: to.fullPath } });
    } 
    else if (!isAdmin) {
      console.log('No es admin, redirigiendo a no autorizado');
      return next({ name: 'Unauthorized' });
    } 
    else {
      console.log('Es admin y está autenticado, acceso permitido');
      return next();
    }
  }
  // Verificar autenticación normal
  else if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log('Ruta requiere autenticación');
    
    if (!isAuthenticated) {
      console.log('No está autenticado, redirigiendo a login');
      return next({ name: 'Login', query: { redirect: to.fullPath } });
    } else {
      console.log('Está autenticado, acceso permitido');
      return next();
    }
  } 
  else {
    console.log('Ruta pública, acceso permitido');
    return next();
  }
});

export default router;