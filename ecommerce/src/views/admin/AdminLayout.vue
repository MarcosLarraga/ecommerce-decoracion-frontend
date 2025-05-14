<!-- AdminLayout.vue -->
<template>
  <div class="admin-layout">
    <!-- Sidebar de administración -->
    <div class="admin-sidebar">
      <div class="admin-sidebar__header">
        <h1 class="admin-sidebar__title">Panel Admin</h1>
      </div>
      
      <nav class="admin-sidebar__nav">
        <router-link to="/admin" class="admin-sidebar__link" exact>
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/admin/products" class="admin-sidebar__link">
          <i class="fas fa-box"></i>
          <span>Productos</span>
        </router-link>
        <router-link to="/admin/orders" class="admin-sidebar__link">
          <i class="fas fa-shopping-cart"></i>
          <span>Pedidos</span>
        </router-link>
        <router-link to="/admin/users" class="admin-sidebar__link">
          <i class="fas fa-users"></i>
          <span>Usuarios</span>
        </router-link>
        <router-link to="/admin/providers" class="admin-sidebar__link">
          <i class="fas fa-truck"></i>
          <span>Proveedores</span>
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
      <!-- Header con info del usuario -->
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useAdminStore } from '@/stores/adminStore';

const router = useRouter();
const userStore = useUserStore();
const adminStore = useAdminStore();

const loading = ref(true);
const error = ref<string | null>(null);

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

// Inicializar al montar
onMounted(async () => {
  console.log("AdminLayout montado");
  await initializeAdmin();
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fb;
}

.admin-sidebar {
  width: 250px;
  background-color: $secondary-color;
  color: white;
  display: flex;
  flex-direction: column;
  
  &__header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  
  &__title {
    font-size: 1.5rem;
    margin: 0;
    font-weight: 600;
  }
  
  &__nav {
    flex: 1;
    padding: 1rem 0;
  }
  
  &__link {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    color: rgba(255,255,255,0.8);
    text-decoration: none;
    transition: all 0.3s ease;
    
    i {
      margin-right: 0.75rem;
      font-size: 1.1rem;
      width: 20px;
      text-align: center;
    }
    
    &:hover, &.router-link-active {
      background-color: rgba(255,255,255,0.1);
      color: white;
    }
    
    &.router-link-active {
      border-left: 4px solid white;
    }
  }
  
  &__footer {
    padding: 1rem;
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  
  &__logout {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem;
    background-color: rgba(255,255,255,0.1);
    color: white;
    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    transition: background-color 0.3s ease;
    
    i {
      margin-right: 0.75rem;
    }
    
    &:hover {
      background-color: rgba(255,255,255,0.2);
    }
  }
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-header {
  height: 60px;
  background-color: white;
  border-bottom: 1px solid $border-color;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  
  &__user {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  &__welcome {
    font-weight: 400;
    color: $text-color-secondary;
  }
  
  &__name {
    font-weight: 600;
    color: $text-color;
  }
}

.admin-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.admin-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba($secondary-color, 0.3);
    border-radius: 50%;
    border-top-color: $secondary-color;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
}

.admin-error {
  padding: 2rem;
  text-align: center;
  background-color: white;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  max-width: 500px;
  margin: 2rem auto;
  
  i {
    font-size: 3rem;
    color: #dc3545;
    margin-bottom: 1rem;
  }
  
  h2 {
    margin-bottom: 1rem;
    color: #dc3545;
  }
  
  p {
    margin-bottom: 1.5rem;
    color: $text-color;
  }
}

.admin-button {
  padding: 0.5rem 1rem;
  background-color: $secondary-color;
  color: white;
  border: none;
  border-radius: $border-radius;
  cursor: pointer;
  
  &:hover {
    background-color: darken($secondary-color, 10%);
  }
}
</style>