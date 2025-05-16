<!-- AdminLayout.vue -->
<template>
  <div class="admin-layout">
    <!-- Overlay para cerrar el menú en móvil -->
    <div v-if="isMobileMenuOpen" class="admin-sidebar-overlay" @click="toggleMobileMenu"></div>

    <!-- Header móvil -->
    <header class="admin-header-mobile">
      <button class="admin-header-mobile__menu-btn" @click="toggleMobileMenu">
        <span class="hamburger-icon">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </span>
      </button>
      <h1 class="admin-header-mobile__title">Panel Admin</h1>
      <div class="admin-header-mobile__user">
        <i class="fas fa-user-circle"></i>
      </div>
    </header>

    <!-- Sidebar de administración -->
    <div class="admin-sidebar" :class="{ 'active': isMobileMenuOpen }">
      <div class="admin-sidebar__header">
        <h1 class="admin-sidebar__title">Panel Admin</h1>
        <button class="admin-sidebar__close" @click="toggleMobileMenu">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <nav class="admin-sidebar__nav">
        <router-link to="/admin" custom v-slot="{ href, navigate, isExactActive }">
          <a :href="href" @click="navigate; closeMobileMenuIfOpen()" class="admin-sidebar__link"
            :class="{ 'active': isExactActive }">
            <i class="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </a>
        </router-link>

        <router-link to="/admin/products" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate; closeMobileMenuIfOpen()" class="admin-sidebar__link"
            :class="{ 'active': isActive }">
            <i class="fas fa-box"></i>
            <span>Productos</span>
          </a>
        </router-link>

        <router-link to="/admin/orders" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate; closeMobileMenuIfOpen()" class="admin-sidebar__link"
            :class="{ 'active': isActive }">
            <i class="fas fa-shopping-cart"></i>
            <span>Pedidos</span>
          </a>
        </router-link>

        <router-link to="/admin/users" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate; closeMobileMenuIfOpen()" class="admin-sidebar__link"
            :class="{ 'active': isActive }">
            <i class="fas fa-users"></i>
            <span>Usuarios</span>
          </a>
        </router-link>

        <router-link to="/admin/providers" custom v-slot="{ href, navigate, isActive }">
          <a :href="href" @click="navigate; closeMobileMenuIfOpen()" class="admin-sidebar__link"
            :class="{ 'active': isActive }">
            <i class="fas fa-truck"></i>
            <span>Proveedores</span>
          </a>
        </router-link>
      </nav>

      <div class="admin-sidebar__footer">
        <button class="admin-sidebar__logout" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="admin-main">
      <!-- Header con info del usuario (escritorio) -->
      <header class="admin-header">
        <div class="admin-header__user">
          <span class="admin-header__welcome">Bienvenido,</span>
          <span class="admin-header__name">{{ userDisplayName }}</span>
        </div>
      </header>

      <!-- Estado de carga -->
      <div v-if="loading" class="admin-loading">
        <div class="spinner"></div>
        <p>Cargando...</p>
      </div>

      <!-- Contenido de las vistas hijas -->
      <div v-else class="admin-content">
        <router-view v-if="!error"></router-view>

        <!-- Mensaje de error -->
        <div v-if="error" class="admin-error">
          <i class="fas fa-exclamation-triangle"></i>
          <h2>Error</h2>
          <p>{{ error }}</p>
          <button @click="retry" class="admin-button">Reintentar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useAdminStore } from '@/stores/adminStore';

const router = useRouter();
const userStore = useUserStore();
const adminStore = useAdminStore();

const loading = ref(true);
const error = ref<string | null>(null);
const isMobileMenuOpen = ref(false);
const windowWidth = ref(window.innerWidth);

// Nombre de usuario a mostrar
const userDisplayName = computed(() => {
  return userStore.displayName || 'Administrador';
});

// Inicializar datos del admin
const initializeAdmin = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Verificar autenticación
    if (!userStore.isAuthenticated) {
      console.error("Usuario no autenticado");
      router.push('/admin-login');
      return;
    }

    // Verificar si es admin
    if (!userStore.isAdmin) {
      console.error("Usuario no es administrador");
      router.push('/unauthorized');
      return;
    }

    // Pasar el token al adminStore
    adminStore.setAuthToken(userStore.token);

    // Cargar datos iniciales básicos
    await adminStore.fetchAllCategories();

    console.log("Panel de administración cargado correctamente");
  } catch (err: any) {
    console.error("Error al inicializar panel de administración:", err);
    error.value = err.message || "Ocurrió un error al cargar el panel de administración";
  } finally {
    loading.value = false;
  }
};

// Reintentar carga
const retry = async () => {
  await initializeAdmin();
};

// Cerrar sesión
const logout = () => {
  userStore.logout();
  router.push('/admin-login');
};

// Manejar el menú móvil
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;

  // Prevenir el scroll cuando el menú está abierto
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeMobileMenuIfOpen = () => {
  if (windowWidth.value < 992 && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false;
    document.body.style.overflow = '';
  }
};

// Manejar el cambio de tamaño de ventana
const handleResize = () => {
  windowWidth.value = window.innerWidth;

  // Si la pantalla es grande, cerrar el menú móvil
  if (windowWidth.value >= 992 && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false;
    document.body.style.overflow = '';
  }
};

// Inicializar al montar
onMounted(async () => {
  console.log("AdminLayout montado");
  window.addEventListener('resize', handleResize);
  await initializeAdmin();
});

// Limpiar al desmontar
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  document.body.style.overflow = ''; // Restaurar overflow
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.admin-layout {
  position: relative;
  min-height: 100vh;
  background-color: #f5f7fb;
  display: flex;
  flex-direction: column;

  @media (min-width: $breakpoint-md) {
    flex-direction: row;
  }
}

// Header móvil (visible solo en móviles)
.admin-header-mobile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: $spacing-sm $spacing-md;
  background-color: $secondary-color;
  color: white;
  z-index: 100;

  @media (min-width: $breakpoint-md) {
    display: none;
  }

  &__menu-btn {
    background: none;
    border: none;
    color: white;
    padding: $spacing-sm;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: $border-radius;

    .hamburger-icon {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 20px;
      height: 16px;
    }

    .hamburger-line {
      display: block;
      width: 100%;
      height: 2px;
      background-color: white;
      border-radius: 2px;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }

  &__title {
    font-size: $font-size-large;
    margin: 0;
    font-weight: $font-weight-semibold;
  }

  &__user {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 24px;
    }
  }
}

// Overlay para el menú móvil
.admin-sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 900;
  display: block;

  @media (min-width: $breakpoint-md) {
    display: none;
  }
}

// Sidebar
.admin-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 80%;
  max-width: 300px;
  background-color: $secondary-color;
  color: white;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transform: translateX(-100%);
  transition: transform 0.3s ease;

  &.active {
    transform: translateX(0);
  }

  @media (min-width: $breakpoint-md) {
    position: static;
    width: 250px;
    transform: translateX(0);
    z-index: 10;
  }

  &__header {
    padding: $spacing-md;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (min-width: $breakpoint-md) {
      padding: 1.5rem;
    }
  }

  &__title {
    font-size: $font-size-large;
    margin: 0;
    font-weight: $font-weight-semibold;

    @media (min-width: $breakpoint-md) {
      font-size: 1.5rem;
    }
  }

  &__close {
    display: block;
    background: none;
    border: none;
    color: white;
    font-size: $font-size-large;
    cursor: pointer;

    @media (min-width: $breakpoint-md) {
      display: none;
    }
  }

  &__nav {
    flex: 1;
    padding: $spacing-md 0;
    overflow-y: auto;

    @media (min-width: $breakpoint-md) {
      padding: 1rem 0;
    }
  }

  &__link {
    display: flex;
    align-items: center;
    padding: $spacing-sm $spacing-md;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.3s ease;

    @media (min-width: $breakpoint-md) {
      padding: 0.75rem 1.5rem;
    }

    i {
      margin-right: $spacing-md;
      font-size: 1.1rem;
      width: 20px;
      text-align: center;
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
      border-left: 4px solid white;
    }
  }

  &__footer {
    padding: $spacing-md;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    @media (min-width: $breakpoint-md) {
      padding: 1rem;
    }
  }

  &__logout {
    display: flex;
    align-items: center;
    width: 100%;
    padding: $spacing-sm;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    transition: background-color 0.3s ease;

    @media (min-width: $breakpoint-md) {
      padding: 0.75rem;
    }

    i {
      margin-right: $spacing-md;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}

// Contenido principal
.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

// Header escritorio
.admin-header {
  display: none;

  @media (min-width: $breakpoint-md) {
    height: 60px;
    background-color: white;
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 $spacing-lg;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  &__user {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }

  &__welcome {
    font-weight: $font-weight-regular;
    color: $text-color-secondary;
  }

  &__name {
    font-weight: $font-weight-semibold;
    color: $text-color;
  }
}

// Contenido
.admin-content {
  flex: 1;
  padding: $spacing-md;
  overflow-y: auto;

  @media (min-width: $breakpoint-md) {
    padding: 1.5rem;
  }
}

// Loading
.admin-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-lg;

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba($secondary-color, 0.3);
    border-radius: 50%;
    border-top-color: $secondary-color;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: $spacing-md;

    @media (min-width: $breakpoint-md) {
      width: 50px;
      height: 50px;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}

// Error
.admin-error {
  padding: $spacing-lg;
  text-align: center;
  background-color: white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  max-width: 500px;
  margin: $spacing-lg auto;

  i {
    font-size: 2.5rem;
    color: $error-color;
    margin-bottom: $spacing-md;

    @media (min-width: $breakpoint-md) {
      font-size: 3rem;
    }
  }

  h2 {
    margin-bottom: $spacing-md;
    color: $error-color;
  }

  p {
    margin-bottom: $spacing-lg;
    color: $text-color;
  }
}

// Botón
.admin-button {
  padding: $spacing-xs $spacing-md;
  background-color: $secondary-color;
  color: white;
  border: none;
  border-radius: $border-radius;
  cursor: pointer;
  font-size: $font-size-small;

  @media (min-width: $breakpoint-md) {
    padding: 0.5rem 1rem;
    font-size: $font-size-base;
  }

  &:hover {
    background-color: $secondary-color-hover;
  }
}
</style>