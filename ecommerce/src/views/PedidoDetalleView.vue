<template>
  <div class="pedido-detalle">
    <div class="pedido-detalle__container">
      <!-- Header simple -->
      <div class="pedido-detalle__header">
        <h1 class="pedido-detalle__title">Mi Pedido #{{ pedidoId }}</h1>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="pedido-detalle__loading">
        <div class="spinner"></div>
        <p>Cargando detalles...</p>
      </div>

      <!-- Contenido principal -->
      <div v-else-if="pedido && usuario" class="pedido-detalle__content">
        
        <!-- Información del pedido -->
        <div class="pedido-info">
          <div class="pedido-info__status">
            <span class="status-badge">{{ pedido.estado || 'Procesando' }}</span>
          </div>
          
          <div class="pedido-info__details">
            <div class="detail-item">
              <span class="label">Fecha:</span>
              <span class="value">{{ formatDate(pedido.fechaPedido) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Total:</span>
              <span class="value total">{{ formatCurrency(pedido.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Datos de envío -->
        <div class="envio-info">
          <h3 class="section-title">Datos de envío</h3>
          <div class="envio-details">
            <p><strong>{{ usuario.nombre }}</strong></p>
            <p>{{ usuario.email }}</p>
            <p v-if="usuario.telefono">{{ usuario.telefono }}</p>
            <p v-if="usuario.direccion">{{ usuario.direccion }}</p>
            <p v-else class="no-direccion">⚠️ No hay dirección de envío registrada</p>
          </div>
        </div>

        <!-- Lista de productos -->
        <div class="productos-lista" v-if="detallesPedido.length > 0">
          <h3 class="section-title">Productos ({{ detallesPedido.length }})</h3>
          
          <div class="producto-item" v-for="item in detallesPedido" :key="item.id">
            <div class="producto-info">
              <h4 class="producto-nombre">{{ item.producto?.nombre || 'Producto no disponible' }}</h4>
              <p class="producto-categoria">{{ item.producto?.categoria?.nombre || 'Sin categoría' }}</p>
            </div>
            <div class="producto-precio">
              <div class="cantidad">x{{ item.cantidad }}</div>
              <div class="precio">{{ formatCurrency(item.precioUnitario) }}</div>
              <div class="subtotal">{{ formatCurrency(item.cantidad * item.precioUnitario) }}</div>
            </div>
          </div>

          <!-- Total final -->
          <div class="total-final">
            <span class="total-label">Total del pedido:</span>
            <span class="total-amount">{{ formatCurrency(pedido.total) }}</span>
          </div>
        </div>

        <!-- Acciones -->
        <div class="acciones">
          <button 
            @click="enviarCorreoConfirmacion" 
            class="btn btn-primary"
            :disabled="enviandoCorreo">
            {{ enviandoCorreo ? 'Enviando...' : 'Reenviar confirmación' }}
          </button>
          
          <router-link to="/mi-cuenta" class="btn btn-secondary">
            ← Volver a mis pedidos
          </router-link>
        </div>
      </div>

      <!-- Error -->
      <div v-else class="pedido-detalle__error">
        <h3>Pedido no encontrado</h3>
        <p>No pudimos encontrar la información de este pedido.</p>
        <router-link to="/" class="btn btn-primary">Ir a la tienda</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useDetallePedidoStore } from '../stores/detallePedidoStore';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';

const detallePedidoStore = useDetallePedidoStore();
const route = useRoute();
const pedidoId = Number(route.params.id);
const toast = useToast();
const loading = ref(true);
const enviandoCorreo = ref(false);

// Computed properties para acceder a los datos del store
const pedido = computed(() => detallePedidoStore.pedido);
const usuario = computed(() => detallePedidoStore.usuario);
const detallesPedido = computed(() => detallePedidoStore.detallesPedido);

// Formatear fecha
const formatDate = (dateString: string | Date) => {
  if (!dateString) return 'Fecha no disponible';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Formatear moneda
const formatCurrency = (amount: number) => {
  if (amount === undefined || amount === null) return '0,00 €';
  return `${amount.toFixed(2)} €`;
};

onMounted(async () => {
  try {
    await detallePedidoStore.fetchPedidoById(pedidoId);
    
    if (detallesPedido.value.length === 0 && pedido.value) {
      await detallePedidoStore.fetchDetallesPedido(pedidoId);
    }
    
    if (!usuario.value && pedido.value?.usuarioId) {
      await detallePedidoStore.fetchUsuarioByPedidoId(pedido.value.usuarioId);
    }
  } catch (error) {
    console.error("Error al cargar los detalles del pedido:", error);
    toast.error("No se pudieron cargar los detalles del pedido");
  } finally {
    loading.value = false;
  }
});

const enviarCorreoConfirmacion = async () => {
  if (!pedido.value) {
    toast.error("No hay información suficiente para enviar el correo");
    return;
  }
  
  enviandoCorreo.value = true;
  
  try {
    await detallePedidoStore.enviarCorreoConfirmacion(pedidoId);
    toast.success("Te hemos enviado al correo toda la información de tu pedido.");
  } catch (error) {
    console.error("Error al enviar correo:", error);
    toast.error("No se pudo enviar el correo de confirmación");
  } finally {
    enviandoCorreo.value = false;
  }
};
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

.pedido-detalle {
  min-height: 100vh;
  background-color: $tertiary-color;
  padding: $spacing-md;

  @media (min-width: $breakpoint-md) {
    padding: $spacing-lg;
  }

  &__container {
    max-width: 800px;
    margin: 0 auto;
  }

  &__header {
    text-align: center;
    margin-bottom: $spacing-xl;
  }

  &__title {
    font-family: $font-family-primary;
    font-size: $font-size-xl;
    color: $text-color;
    margin: 0;
    font-weight: $font-weight-semibold;

    @media (min-width: $breakpoint-md) {
      font-size: $font-size-xxl;
    }
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-xxl 0;
    background: white;
    border-radius: $border-radius-lg;
    
    .spinner {
      border: 3px solid $tertiary-color;
      border-top: 3px solid $primary-color;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: $spacing-md;
    }
    
    p {
      color: $text-color-secondary;
      margin: 0;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  &__error {
    text-align: center;
    background: white;
    padding: $spacing-xxl;
    border-radius: $border-radius-lg;
    
    h3 {
      color: $error-color;
      margin-bottom: $spacing-md;
    }
    
    p {
      color: $text-color-secondary;
      margin-bottom: $spacing-lg;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// Card básica para secciones
.pedido-info, .envio-info, .productos-lista {
  background: white;
  border-radius: $border-radius-lg;
  padding: $spacing-lg;
  box-shadow: $box-shadow-sm;
}

// Información del pedido
.pedido-info {
  &__status {
    text-align: center;
    margin-bottom: $spacing-lg;
    
    .status-badge {
      background: $success-color;
      color: white;
      padding: $spacing-sm $spacing-lg;
      border-radius: $border-radius-pill;
      font-weight: $font-weight-semibold;
      font-size: $font-size-base;
    }
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    @media (min-width: $breakpoint-sm) {
      flex-direction: row;
      justify-content: space-around;
    }

    .detail-item {
      text-align: center;
      
      .label {
        display: block;
        color: $text-color-secondary;
        font-size: $font-size-small;
        margin-bottom: $spacing-xs;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .value {
        display: block;
        font-weight: $font-weight-semibold;
        font-size: $font-size-large;
        
        &.total {
          color: $primary-color;
          font-size: $font-size-xl;
          font-weight: $font-weight-bold;
        }
      }
    }
  }
}

// Información de envío
.envio-info {
  .envio-details {
    p {
      margin: $spacing-xs 0;
      line-height: 1.5;
      
      &.no-direccion {
        color: $warning-color;
        font-weight: $font-weight-medium;
        background: rgba($warning-color, 0.1);
        padding: $spacing-sm;
        border-radius: $border-radius-sm;
      }
    }
  }
}

// Títulos de sección
.section-title {
  margin: 0 0 $spacing-md;
  font-size: $font-size-large;
  font-weight: $font-weight-semibold;
  color: $text-color;
  border-bottom: 2px solid $tertiary-color;
  padding-bottom: $spacing-sm;
}

// Lista de productos
.productos-lista {
  .producto-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: $spacing-md 0;
    border-bottom: 1px solid $tertiary-color;
    
    &:last-child {
      border-bottom: none;
    }

    @media (max-width: $breakpoint-xs) {
      flex-direction: column;
      gap: $spacing-sm;
    }
  }

  .producto-info {
    flex: 1;
    
    .producto-nombre {
      margin: 0 0 $spacing-xs;
      font-size: $font-size-base;
      font-weight: $font-weight-semibold;
      color: $text-color;
      line-height: 1.3;
    }
    
    .producto-categoria {
      margin: 0;
      color: $text-color-secondary;
      font-size: $font-size-small;
    }
  }

  .producto-precio {
    text-align: right;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    
    @media (max-width: $breakpoint-xs) {
      text-align: left;
      flex-direction: row;
      justify-content: space-between;
    }
    
    .cantidad {
      background: $secondary-color;
      color: white;
      padding: 2px $spacing-sm;
      border-radius: $border-radius-sm;
      font-size: $font-size-small;
      align-self: flex-end;
      
      @media (max-width: $breakpoint-xs) {
        align-self: flex-start;
      }
    }
    
    .precio {
      color: $text-color-secondary;
      font-size: $font-size-small;
    }
    
    .subtotal {
      font-weight: $font-weight-bold;
      color: $primary-color;
    }
  }
  
  .total-final {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: $spacing-lg;
    padding-top: $spacing-lg;
    border-top: 2px solid $primary-color;
    
    .total-label {
      font-size: $font-size-large;
      font-weight: $font-weight-semibold;
      color: $text-color;
    }
    
    .total-amount {
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      color: $primary-color;
    }
  }
}

// Acciones
.acciones {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  background: white;
  padding: $spacing-lg;
  border-radius: $border-radius-lg;
  box-shadow: $box-shadow-sm;

  @media (min-width: $breakpoint-sm) {
    flex-direction: row;
    justify-content: center;
  }
}

// Botones simples
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-md $spacing-lg;
  border: none;
  border-radius: $border-radius-md;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  text-decoration: none;
  cursor: pointer;
  transition: all $transition-fast;
  font-family: $font-family-secondary;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.btn-primary {
    background-color: $primary-color;
    color: white;

    &:hover:not(:disabled) {
      background-color: $primary-color-hover;
    }
  }

  &.btn-secondary {
    background-color: white;
    color: $primary-color;
    border: 1px solid $primary-color;

    &:hover {
      background-color: $primary-color;
      color: white;
    }
  }
}

// Responsive
@media (max-width: $breakpoint-sm) {
  .pedido-detalle {
    padding: $spacing-sm;

    &__container {
      margin: 0;
    }
    
    .pedido-info, .envio-info, .productos-lista, .acciones {
      padding: $spacing-md;
    }
  }
}
</style>