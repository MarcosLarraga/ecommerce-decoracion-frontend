// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProductsView from '@/views/ProductsView.vue'
import ContactView from '@/views/ContactView.vue'
import LoginView from '@/views/LoginView.vue'

// Importamos el store para usarlo en el guard
import { useUserStore } from '@/stores/userStore'

// Zona privada: por ejemplo, un Panel de administración
import AdminView from '@/views/AdminView.vue'

const routes = [
  // Zonas públicas
  { path: '/', component: HomeView },
  { path: '/productos', component: ProductsView },
  { path: '/contacto', component: ContactView },
  { path: '/login', component: LoginView },

  // Zona privada: SOLO admin
  {
    path: '/admin',
    component: AdminView,
    meta: { requiresAuth: true, requiredRole: 'admin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const userStore = useUserStore()

  // 1) Si la ruta requiere estar logueado y NO lo está, redirige a /login
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return '/login'
  }

  // 2) Si la ruta requiere un rol concreto (por ejemplo, 'admin')
  if (to.meta.requiredRole) {
    const userRole = userStore.role
    // Si el rol del usuario NO coincide con el rol requerido
    if (userRole.value !== to.meta.requiredRole) {
      // Podrías redirigir a una página de "acceso denegado" o a home
      return '/'
    }
  }
})

export default router
