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
      <!-- Resumen de estadísticas -->
      <div class="dashboard-stats">
        <div class="dashboard-stat">
          <h3>Usuarios</h3>
          <p class="dashboard-stat__value">{{ stats.users }}</p>
        </div>
        <div class="dashboard-stat">
          <h3>Productos</h3>
          <p class="dashboard-stat__value">{{ stats.products }}</p>
        </div>
        <div class="dashboard-stat">
          <h3>Pedidos</h3>
          <p class="dashboard-stat__value">{{ stats.orders }}</p>
        </div>
        <div class="dashboard-stat">
          <h3>Ingresos</h3>
          <p class="dashboard-stat__value">{{ formatCurrency(stats.revenue) }}</p>
        </div>
      </div>
      
      <!-- Contenido adicional aquí -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const loading = ref(true);
const error = ref('');
const stats = ref({
  users: 0,
  products: 0,
  orders: 0,
  revenue: 0
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
      const response = await axios.get('/api/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      stats.value = response.data;
    } catch (apiError) {
      console.warn("Error al obtener datos reales, usando datos de ejemplo:", apiError);
      
      // Si falla, usar datos de ejemplo para depuración
      // Esto te permite ver el dashboard aunque la API no funcione
      stats.value = {
        users: 120,
        products: 45,
        orders: 67,
        revenue: 12450.75
      };
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

.admin-dashboard {
  &__title {
    margin-bottom: 2rem;
    font-size: 1.8rem;
    color: $text-color;
  }
  
  &__loading, &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    
    .spinner {
      width: 40px;
      height: 40px;
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
  
  &__error {
    p {
      color: #dc3545;
      margin-bottom: 1rem;
    }
  }
  
  &__retry {
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
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.dashboard-stat {
  background-color: white;
  padding: 1.5rem;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  text-align: center;
  
  h3 {
    font-size: 1rem;
    color: $text-color;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  &__value {
    font-size: 1.8rem;
    font-weight: bold;
    color: $secondary-color;
  }
}
</style>