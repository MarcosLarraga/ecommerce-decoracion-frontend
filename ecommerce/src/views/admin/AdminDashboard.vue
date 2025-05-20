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
        <!-- Ventas mensuales -->
        <div class="dashboard-section">
          <h2 class="dashboard-section__title">Ventas mensuales</h2>
          <div class="dashboard-section__content">
            <div v-if="ventasMensuales.length > 0" class="monthly-sales">
              <div v-for="(venta, index) in ventasMensuales" :key="index" class="monthly-sale">
                <div class="monthly-sale__month">{{ venta.mes }}</div>
                <div class="monthly-sale__amount">{{ formatCurrency(venta.total) }}</div>
                <div class="monthly-sale__bar-container">
                  <div class="monthly-sale__bar" :style="{ width: getMonthlyPercentage(venta.total) + '%' }"></div>
                </div>
              </div>
            </div>
            <div v-else class="empty-placeholder">
              <i class="fas fa-chart-line"></i>
              <p>No hay datos de ventas mensuales</p>
            </div>
          </div>
        </div>
        
        <!-- Productos más vendidos -->
        <div class="dashboard-section">
          <h2 class="dashboard-section__title">Productos más vendidos</h2>
          <div class="dashboard-section__content">
            <div v-if="topProducts.length > 0" class="top-products">
              <div v-for="product in topProducts" :key="product.productoId" class="top-product">
                <div class="top-product__image">
                  <img v-if="product.urlImagen" :src="product.urlImagen" :alt="product.nombre">
                  <div v-else class="top-product__image-placeholder">
                    <i class="fas fa-box"></i>
                  </div>
                </div>
                <div class="top-product__details">
                  <div class="top-product__name">{{ product.nombre }}</div>
                  <div class="top-product__price">{{ formatCurrency(product.totalVendido / product.cantidadVendida) }}</div>
                  <div class="top-product__sold">
                    <span class="top-product__sold-count">{{ product.cantidadVendida }}</span> unidades vendidas
                  </div>
                </div>
                <div class="top-product__percentage">
                  <div class="top-product__bar" :style="{ width: getPercentage(product.cantidadVendida) + '%' }"></div>
                </div>
              </div>
            </div>
            <div v-else class="empty-placeholder">
              <i class="fas fa-chart-bar"></i>
              <p>No hay datos de ventas disponibles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useDashboardStore } from '@/stores/dashboardStore';

const dashboardStore = useDashboardStore();

const error = computed(() => dashboardStore.error);
const loading = computed(() => dashboardStore.loading);
const stats = computed(() => dashboardStore.getStats);
const topProducts = computed(() => dashboardStore.getProductosMasVendidos);
const ventasMensuales = computed(() => dashboardStore.getVentasMensuales);

// Formatear fecha
const formattedUpdateTime = computed(() => {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dashboardStore.getLastUpdateTime);
});

// Formatear moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(value);
};

// Calcular porcentaje para la barra visual de productos
const getPercentage = (vendidos: number) => {
  if (topProducts.value.length === 0) return 0;
  const maxVendidos = Math.max(...topProducts.value.map(p => p.cantidadVendida));
  if (maxVendidos === 0) return 0;
  return (vendidos / maxVendidos) * 100;
};

// Calcular porcentaje para la barra visual de ventas mensuales
const getMonthlyPercentage = (total: number) => {
  if (ventasMensuales.value.length === 0) return 0;
  const maxVenta = Math.max(...ventasMensuales.value.map(v => v.total));
  if (maxVenta === 0) return 0;
  return (total / maxVenta) * 100;
};

// Cargar datos para el dashboard
const loadDashboardData = async () => {
  try {
    await dashboardStore.fetchDashboardData();
  } catch (err: any) {
    console.error("Error al cargar datos del dashboard:", err);
  }
};

onMounted(async () => {
  await loadDashboardData();
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as m;

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
      width: 40px;
      height: 40px;
      border: $border-width solid rgba($primary-color, $opacity-light);
      border-radius: $border-radius-circle;
      border-top-color: $primary-color;
      animation: spin $duration-normal linear infinite;
      margin-bottom: $spacing-md;
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
    min-height: 300px;
  }
}

.monthly-sales {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.monthly-sale {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm;
  border-radius: $border-radius;
  background-color: rgba($tertiary-color, 0.3);
  
  &:hover {
    background-color: rgba($tertiary-color, 0.5);
  }
  
  &__month {
    width: 80px;
    font-weight: $font-weight-semibold;
    color: $text-color;
  }
  
  &__amount {
    width: 100px;
    text-align: right;
    font-weight: $font-weight-semibold;
    color: $primary-color;
  }
  
  &__bar-container {
    flex: 1;
    height: 8px;
    background-color: rgba($primary-color, 0.1);
    border-radius: $border-radius-pill;
    overflow: hidden;
  }
  
  &__bar {
    height: 100%;
    background-color: $primary-color;
    border-radius: $border-radius-pill;
  }
}

// Estilos para productos más vendidos
.top-products {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.top-product {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm;
  border-radius: $border-radius;
  background-color: rgba($tertiary-color, 0.3);
  transition: transform $transition-fast, box-shadow $transition-fast;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: $box-shadow-sm;
    background-color: rgba($tertiary-color, 0.5);
  }
  
  &__image {
    width: 50px;
    height: 50px;
    border-radius: $border-radius-sm;
    overflow: hidden;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid $border-color;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    &-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $text-color-secondary;
    }
  }
  
  &__details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }
  
  &__name {
    font-weight: $font-weight-semibold;
    color: $text-color;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
    
    @include m.media-sm {
      max-width: 250px;
    }
  }
  
  &__price {
    color: $text-color-secondary;
    font-size: $font-size-small;
  }
  
  &__sold {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-small;
    color: $text-color-tertiary;
  }
  
  &__sold-count {
    color: $primary-color;
    font-weight: $font-weight-semibold;
  }
  
  &__percentage {
    width: 60px;
    height: 8px;
    background-color: rgba($primary-color, 0.1);
    border-radius: $border-radius-pill;
    overflow: hidden;
    
    @include m.media-sm {
      width: 80px;
    }
  }
  
  &__bar {
    height: 100%;
    background-color: $primary-color;
    border-radius: $border-radius-pill;
  }
}

// Placeholder cuando no hay datos
.empty-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  color: $text-color-tertiary;
  
  i {
    font-size: 40px;
    margin-bottom: $spacing-md;
    opacity: 0.5;
  }
  
  p {
    font-size: $font-size-small;
  }
}
</style>