<!-- AdminDashboard.vue -->
<template>
  <div class="admin-dashboard">
    <h1 class="admin-dashboard__title">Dashboard</h1>
    
    <!-- Estado de carga -->
    <div v-if="loading" class="admin-dashboard__loading">
      <div class="spinner"></div>
      <p>Cargando datos...</p>
    </div>
    
    <!-- Error -->
    <div v-else-if="error" class="admin-dashboard__error">
      <p>{{ error }}</p>
      <button @click="loadDashboardData" class="admin-dashboard__retry">Reintentar</button>
    </div>
    
    <!-- Contenido del dashboard -->
    <div v-else class="admin-dashboard__content">
      <!-- Fecha de actualización -->
      <p class="admin-dashboard__last-updated">Última actualización: {{ formattedUpdateTime }}</p>
      
      <!-- Resumen de estadísticas -->
      <div class="dashboard-stats">
        <div class="dashboard-stat">
          <div class="dashboard-stat__icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="dashboard-stat__info">
            <h3>Usuarios</h3>
            <p class="dashboard-stat__value">{{ stats.users }}</p>
          </div>
        </div>
        
        <div class="dashboard-stat">
          <div class="dashboard-stat__icon">
            <i class="fas fa-box"></i>
          </div>
          <div class="dashboard-stat__info">
            <h3>Productos</h3>
            <p class="dashboard-stat__value">{{ stats.products }}</p>
          </div>
        </div>
        
        <div class="dashboard-stat">
          <div class="dashboard-stat__icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="dashboard-stat__info">
            <h3>Pedidos</h3>
            <p class="dashboard-stat__value">{{ stats.orders }}</p>
          </div>
        </div>
        
        <div class="dashboard-stat">
          <div class="dashboard-stat__icon">
            <i class="fas fa-euro-sign"></i>
          </div>
          <div class="dashboard-stat__info">
            <h3>Ingresos</h3>
            <p class="dashboard-stat__value">{{ formatCurrency(stats.revenue) }}</p>
          </div>
        </div>
      </div>
      
      <!-- Secciones adicionales del dashboard -->
      <div class="dashboard-sections">
        <!-- Ventas recientes -->
        <div class="dashboard-section">
          <h2 class="dashboard-section__title">Ventas recientes</h2>
          <div class="dashboard-section__content">
            <!-- Aquí irían las ventas recientes -->
            <div class="placeholder-content">
              <p>Información de ventas recientes se mostrará aquí</p>
            </div>
          </div>
        </div>
        
        <!-- Productos más vendidos -->
        <div class="dashboard-section">
          <h2 class="dashboard-section__title">Productos más vendidos</h2>
          <div class="dashboard-section__content">
            <!-- Aquí irían los productos más vendidos -->
            <div class="placeholder-content">
              <p>Los productos más vendidos aparecerán aquí</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const loading = ref(true);
const error = ref('');
const lastUpdateTime = ref(new Date());
const stats = ref({
  users: 0,
  products: 0,
  orders: 0,
  revenue: 0
});

// Fecha formateada
const formattedUpdateTime = computed(() => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(lastUpdateTime.value);
});

// Formatear moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(value);
};

// Cargar datos del dashboard
const loadDashboardData = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // Primero intentar con una API real
    const token = userStore.token;
    
    if (!token) {
      throw new Error("No hay token de autenticación");
    }
    
    try {
      // Aquí harías una petición real a tu API
      const response = await axios.get('/api/Dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Ajustamos los datos al formato que espera nuestro componente
      const data = response.data;
      stats.value = {
        users: data.totalUsuarios || 0,
        products: data.totalProductos || 0,
        orders: data.totalPedidos || 0,
        revenue: data.ventasTotales || 0
      };
      
      // Actualizar hora de actualización
      lastUpdateTime.value = new Date();
    } catch (apiError) {
      console.warn("Error al obtener datos reales, usando datos de ejemplo:", apiError);
      
      // Si falla, usar datos de ejemplo para depuración
      stats.value = {
        users: 120,
        products: 45,
        orders: 67,
        revenue: 12450.75
      };
      
      // Actualizar hora de actualización
      lastUpdateTime.value = new Date();
    }
  } catch (err: any) {
    console.error("Error al cargar datos del dashboard:", err);
    error.value = err.message || "Error al cargar los datos del dashboard";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  console.log("AdminDashboard montado");
  await loadDashboardData();
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as m;
@use "sass:math";

.admin-dashboard {
  padding: $padding-sm;
  font-family: $font-family-secondary;
  
  @include m.media-sm {
    padding: $padding-md;
  }
  
  @include m.media-md {
    padding: $admin-content-padding;
  }
  
  &__title {
    margin-bottom: $spacing-md;
    font-size: $admin-section-title-size;
    color: $text-color;
    font-family: $font-family-primary;
    
    @include m.media-md {
      margin-bottom: $admin-header-margin-bottom;
    }
  }
  
  &__last-updated {
    font-size: $font-size-small;
    color: $text-color-secondary;
    margin-bottom: $spacing-md;
    text-align: right;
  }
  
  &__loading, &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    
    @include m.media-md {
      min-height: 300px;
    }
    
    .spinner {
      width: calc($admin-table-spinner-size * 0.5);
      height: calc($admin-table-spinner-size * 0.5);
      border: $border-width solid rgba($primary-color, $opacity-light);
      border-radius: $border-radius-circle;
      border-top-color: $primary-color;
      animation: spin $duration-normal linear infinite;
      margin-bottom: $spacing-md;
      
      @include m.media-md {
        width: $admin-table-spinner-size;
        height: $admin-table-spinner-size;
        border-width: $border-width-md;
      }
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  }
  
  &__error {
    p {
      color: $error-color;
      margin-bottom: $spacing-md;
      text-align: center;
    }
  }
  
  &__retry {
    @include m.adminButton;
  }
  
  &__content {
    margin-bottom: $admin-section-margin;
  }
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  
  @include m.media-xs {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include m.media-md {
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-lg;
    margin-bottom: $admin-section-margin;
  }
}

.dashboard-stat {
  background-color: $background-color;
  border-radius: $border-radius-lg;
  box-shadow: $box-shadow;
  padding: $admin-card-padding;
  border: $admin-card-border;
  display: flex;
  align-items: center;
  
  /* Evitar errores "mixed-decls" usando '& {}' */
  & {
    margin-bottom: 0;
  }
  
  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: $border-radius-circle;
    background-color: rgba($primary-color, $opacity-light);
    margin-right: $spacing-md;
    color: $primary-color;
    font-size: $font-size-large;
    
    @include m.media-md {
      width: 50px;
      height: 50px;
      font-size: $font-size-xl;
    }
  }
  
  &__info {
    flex: 1;
  }
  
  h3 {
    font-size: $font-size-small;
    color: $text-color-secondary;
    margin-bottom: $spacing-xs;
    font-weight: $font-weight-medium;
    
    @include m.media-md {
      font-size: $font-size-base;
      margin-bottom: $spacing-sm;
    }
  }
  
  &__value {
    font-size: $font-size-large;
    font-weight: $font-weight-bold;
    color: $secondary-color;
    margin: 0;
    
    @include m.media-md {
      font-size: $font-size-xl;
    }
  }
}

.dashboard-sections {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-lg;
  
  @include m.media-md {
    grid-template-columns: repeat(2, 1fr);
  }
}

.dashboard-section {
  background-color: $background-color;
  border-radius: $border-radius-lg;
  box-shadow: $box-shadow;
  padding: $admin-card-padding;
  border: $admin-card-border;
  overflow: hidden;
  
  /* Evitar errores "mixed-decls" usando '& {}' */
  & {
    margin-bottom: 0;
  }
  
  &__title {
    font-size: $admin-section-subtitle-size;
    font-weight: $font-weight-medium;
    color: $text-color;
    margin: 0;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $admin-divider-color;
    margin-bottom: $spacing-md;
  }
  
  &__content {
    min-height: 200px;
  }
}

.placeholder-content {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $admin-filter-bg;
  border-radius: $border-radius;
  padding: $spacing-lg;
  text-align: center;
  height: 100%;
  min-height: 150px;
  
  p {
    color: $admin-empty-msg-color;
    margin: 0;
  }
}
</style>