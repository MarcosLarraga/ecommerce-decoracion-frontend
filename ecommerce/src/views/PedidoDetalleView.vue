<template>
  <div class="pedido-detalle">
    <div class="pedido-detalle__container">
      <!-- Header del ticket -->
      <div class="pedido-detalle__header">
        <h1 class="pedido-detalle__title">Detalle del Pedido #{{ pedidoId }}</h1>
        <div class="pedido-detalle__subtitle">Gracias por tu compra</div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="pedido-detalle__loading">
        <div class="spinner"></div>
        <p>Cargando información del pedido...</p>
      </div>

      <!-- Contenido principal -->
      <div v-else-if="pedido && usuario" class="pedido-detalle__content">
        
        <!-- Información del pedido - Estilo ticket -->
        <div class="pedido-info">
          <!-- Bordes perforados -->
          <div class="ticket-perforation ticket-perforation--top"></div>
          
          <div class="pedido-info__status">
            <span class="status-badge">{{ pedido.estado || 'Procesando' }}</span>
            <div class="status-details">
              <span class="status-date">{{ formatDate(pedido.fechaPedido) }}</span>
            </div>
          </div>
          
          <div class="pedido-info__details">
            <div class="detail-item detail-item--fecha">
              <div class="detail-icon">📅</div>
              <div class="detail-content">
                <span class="label">Fecha del pedido</span>
                <span class="value">{{ formatDate(pedido.fechaPedido) }}</span>
              </div>
            </div>
            <div class="detail-item detail-item--total">
              <div class="detail-icon">💰</div>
              <div class="detail-content">
                <span class="label">Importe total</span>
                <span class="value total">{{ formatCurrency(pedido.total) }}</span>
              </div>
            </div>
          </div>

          <div class="ticket-perforation ticket-perforation--bottom"></div>
        </div>

        <!-- Datos de envío -->
        <div class="envio-info">
          <h3 class="section-title">
            <span class="section-icon">🚚</span>
            Información de envío
          </h3>
          <div class="envio-details">
            <div class="envio-item">
              <span class="envio-label">Destinatario:</span>
              <span class="envio-value">{{ usuario.nombre }}</span>
            </div>
            <div class="envio-item">
              <span class="envio-label">Email:</span>
              <span class="envio-value">{{ usuario.email }}</span>
            </div>
            <div class="envio-item" v-if="usuario.telefono">
              <span class="envio-label">Teléfono:</span>
              <span class="envio-value">{{ usuario.telefono }}</span>
            </div>
            <div class="envio-item">
              <span class="envio-label">Dirección:</span>
              <span class="envio-value" v-if="usuario.direccion">{{ usuario.direccion }}</span>
              <span class="envio-value envio-value--warning" v-else>
                ⚠️ No hay dirección de envío registrada
              </span>
            </div>
          </div>
        </div>

        <!-- Lista de productos -->
        <div class="productos-lista" v-if="detallesPedido.length > 0">
          <div class="productos-header">
            <h3 class="section-title">
              <span class="section-icon">🛍️</span>
              Productos ({{ detallesPedido.length }})
            </h3>
          </div>
          
          <div class="productos-container">
            <div class="producto-item" v-for="(item, index) in detallesPedido" :key="item.id">
              <div class="producto-numero">{{ index + 1 }}</div>
              <div class="producto-info">
                <h4 class="producto-nombre">{{ item.producto?.nombre || 'Producto no disponible' }}</h4>
                <p class="producto-categoria">
                  <span class="categoria-tag">{{ item.producto?.categoria?.nombre || 'Sin categoría' }}</span>
                </p>
              </div>
              <div class="producto-precio">
                <div class="precio-detalle">
                  <span class="cantidad-badge">{{ item.cantidad }}x</span>
                  <span class="precio-unitario">{{ formatCurrency(item.precioUnitario) }}</span>
                </div>
                <div class="subtotal">{{ formatCurrency(item.cantidad * item.precioUnitario) }}</div>
              </div>
            </div>

            <!-- Línea separadora -->
            <div class="productos-separator"></div>

            <!-- Total final -->
            <div class="total-final">
              <div class="total-content">
                <span class="total-label">Total del pedido:</span>
                <span class="total-amount">{{ formatCurrency(pedido.total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="acciones">
          <button 
            @click="enviarCorreoConfirmacion" 
            class="btn btn-primary"
            :disabled="enviandoCorreo">
            <span class="btn-icon">📧</span>
            {{ enviandoCorreo ? 'Enviando...' : 'Reenviar confirmación' }}
          </button>
          
          <router-link to="/mi-cuenta" class="btn btn-secondary">
            <span class="btn-icon">←</span>
            Volver a mis pedidos
          </router-link>
        </div>
      </div>

      <!-- Error -->
      <div v-else class="pedido-detalle__error">
        <div class="error-icon">❌</div>
        <h3>Pedido no encontrado</h3>
        <p>No pudimos encontrar la información de este pedido.</p>
        <router-link to="/" class="btn btn-primary">
          <span class="btn-icon">🏠</span>
          Ir a la tienda
        </router-link>
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

// Reset y base
* {
  box-sizing: border-box;
}

.pedido-detalle {
  min-height: 100vh;
  background: linear-gradient(135deg, #f1f3f6 0%, #e8edf5 50%, #dde4ef 100%);
  padding: $spacing-lg;
  position: relative;
  font-family: $font-family-secondary;

  // Patrón de fondo sutil
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 20% 20%, rgba($primary-color, 0.04) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba($primary-color, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: $breakpoint-md) {
    padding: $spacing-md;
  }

  &__container {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  &__header {
    text-align: center;
    margin-bottom: $spacing-xl;
    background: white;
    padding: $spacing-xl;
    border-radius: $border-radius-xl;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    border: 1px solid rgba($primary-color, 0.1);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, $primary-color 0%, #059447 50%, $primary-color 100%);
    }
  }

  &__title {
    font-family: $font-family-primary;
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    color: $text-color;
    margin: 0 0 $spacing-sm;
    font-weight: $font-weight-bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  &__subtitle {
    color: $text-color-secondary;
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-xxl * 2;
    background: white;
    border-radius: $border-radius-xl;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    
    .spinner {
      border: 4px solid rgba($primary-color, 0.2);
      border-top: 4px solid $primary-color;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      animation: spin 1s linear infinite;
      margin-bottom: $spacing-lg;
    }
    
    p {
      color: $text-color-secondary;
      margin: 0;
      font-size: $font-size-large;
      font-weight: $font-weight-medium;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
  }

  &__error {
    text-align: center;
    background: white;
    padding: $spacing-xxl * 2;
    border-radius: $border-radius-xl;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border-left: 6px solid $error-color;
    
    .error-icon {
      font-size: 4rem;
      margin-bottom: $spacing-lg;
    }
    
    h3 {
      color: $error-color;
      margin-bottom: $spacing-md;
      font-size: $font-size-xl;
    }
    
    p {
      color: $text-color-secondary;
      margin-bottom: $spacing-lg;
      font-size: $font-size-base;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// Perforaciones del ticket
.ticket-perforation {
  height: 20px;
  background-image: radial-gradient(circle at 20px 10px, transparent 8px, white 8px);
  background-size: 40px 20px;
  background-repeat: repeat-x;
  position: relative;
  z-index: 2;

  &--top {
    margin-bottom: -10px;
  }

  &--bottom {
    margin-top: -10px;
  }
}

// Información principal del pedido
.pedido-info {
  background: white;
  border-radius: $border-radius-xl;
  overflow: hidden;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba($primary-color, 0.1);
  position: relative;

  &__status {
    background: linear-gradient(135deg, $primary-color 0%, #059447 100%);
    color: white;
    padding: $spacing-xl;
    text-align: center;
    position: relative;
    
    .status-badge {
      background: rgba(255, 255, 255, 0.25);
      color: white;
      padding: $spacing-sm $spacing-xl;
      border-radius: $border-radius-pill;
      font-weight: $font-weight-bold;
      font-size: $font-size-large;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: inline-flex;
      align-items: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      margin-bottom: $spacing-md;

      &::before {
        content: '✓';
        margin-right: $spacing-sm;
        font-size: 1.2em;
      }
    }

    .status-details {
      .status-date {
        font-size: $font-size-base;
        opacity: 0.9;
        font-weight: $font-weight-medium;
      }
    }
  }

  &__details {
    padding: $spacing-xl;
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-lg;
    background: linear-gradient(135deg, #fafbfc 0%, #f8f9fa 100%);

    @media (min-width: $breakpoint-md) {
      grid-template-columns: 1fr 1fr;
    }

    .detail-item {
      background: white;
      padding: $spacing-lg;
      border-radius: $border-radius-lg;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba($primary-color, 0.1);
      transition: all $transition-fast;
      display: flex;
      align-items: center;
      gap: $spacing-md;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      .detail-icon {
        font-size: 2rem;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, rgba($primary-color, 0.1) 0%, rgba($primary-color, 0.05) 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .detail-content {
        flex: 1;

        .label {
          display: block;
          color: $text-color-secondary;
          font-size: $font-size-small;
          margin-bottom: $spacing-xs;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: $font-weight-semibold;
        }
        
        .value {
          display: block;
          font-weight: $font-weight-bold;
          font-size: $font-size-large;
          color: $text-color;
          
          &.total {
            color: $primary-color;
            font-size: $font-size-xxl;
            font-weight: $font-weight-black;
          }
        }
      }
    }
  }
}

// Información de envío
.envio-info {
  background: white;
  border-radius: $border-radius-xl;
  padding: $spacing-xl;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-left: 6px solid $info-color;
  position: relative;

  .envio-details {
    background: linear-gradient(135deg, rgba($info-color, 0.05) 0%, rgba($info-color, 0.02) 100%);
    padding: $spacing-lg;
    border-radius: $border-radius-lg;
    border: 1px solid rgba($info-color, 0.2);

    .envio-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-md 0;
      border-bottom: 1px solid rgba($info-color, 0.1);

      &:last-child {
        border-bottom: none;
      }

      .envio-label {
        font-weight: $font-weight-semibold;
        color: $text-color-secondary;
        min-width: 120px;
      }

      .envio-value {
        color: $text-color;
        font-weight: $font-weight-medium;
        text-align: right;
        flex: 1;

        &--warning {
          color: $warning-color;
          font-weight: $font-weight-bold;
          background: rgba($warning-color, 0.1);
          padding: $spacing-xs $spacing-sm;
          border-radius: $border-radius-sm;
        }
      }
    }
  }
}

// Títulos de sección
.section-title {
  margin: 0 0 $spacing-lg;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $text-color;
  display: flex;
  align-items: center;
  gap: $spacing-sm;

  .section-icon {
    font-size: 1.5em;
  }
}

// Lista de productos
.productos-lista {
  background: white;
  border-radius: $border-radius-xl;
  overflow: hidden;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba($primary-color, 0.1);

  .productos-header {
    background: linear-gradient(135deg, $secondary-color 0%, #2c3e50 100%);
    color: white;
    padding: $spacing-lg $spacing-xl;

    .section-title {
      margin: 0;
      color: white;
      font-size: $font-size-large;
    }
  }

  .productos-container {
    padding: $spacing-xl;
  }

  .producto-item {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    padding: $spacing-lg 0;
    border-bottom: 2px dashed rgba($primary-color, 0.2);
    position: relative;
    transition: all $transition-fast;
    
    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: linear-gradient(135deg, rgba($primary-color, 0.02) 0%, rgba($primary-color, 0.01) 100%);
      border-radius: $border-radius-md;
      transform: translateX(4px);
      padding-left: $spacing-md;
    }

    .producto-numero {
      background: linear-gradient(135deg, $primary-color 0%, #059447 100%);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: $font-weight-bold;
      font-size: $font-size-base;
      flex-shrink: 0;
    }

    .producto-info {
      flex: 1;
      
      .producto-nombre {
        margin: 0 0 $spacing-xs;
        font-size: $font-size-base;
        font-weight: $font-weight-bold;
        color: $text-color;
        line-height: 1.4;
      }
      
      .producto-categoria {
        margin: 0;
        
        .categoria-tag {
          background: rgba($primary-color, 0.1);
          color: $primary-color;
          padding: 2px $spacing-sm;
          border-radius: $border-radius-pill;
          font-size: $font-size-small;
          font-weight: $font-weight-medium;
        }
      }
    }

    .producto-precio {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: $spacing-xs;
      min-width: 150px;
      
      .precio-detalle {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        
        .cantidad-badge {
          background: linear-gradient(135deg, $secondary-color 0%, #2c3e50 100%);
          color: white;
          padding: 4px $spacing-sm;
          border-radius: $border-radius-pill;
          font-size: $font-size-small;
          font-weight: $font-weight-bold;
        }
        
        .precio-unitario {
          color: $text-color;
          font-size: $font-size-base;
          font-weight: $font-weight-medium;
        }
      }
      
      .subtotal {
        font-weight: $font-weight-bold;
        color: $primary-color;
        font-size: $font-size-large;
      }
    }

    @media (max-width: $breakpoint-sm) {
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-md;

      .producto-precio {
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  
  .productos-separator {
    height: 3px;
    background: linear-gradient(90deg, transparent 0%, $primary-color 50%, transparent 100%);
    margin: $spacing-lg 0;
    border-radius: 2px;
  }

  .total-final {
    background: linear-gradient(135deg, rgba($primary-color, 0.1) 0%, rgba($primary-color, 0.05) 100%);
    padding: $spacing-xl;
    border-radius: $border-radius-lg;
    border: 2px solid $primary-color;
    position: relative;

    .total-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .total-label {
        font-size: $font-size-large;
        font-weight: $font-weight-bold;
        color: $text-color;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .total-amount {
        font-size: $font-size-xxl;
        font-weight: $font-weight-black;
        color: $primary-color;
        background: white;
        padding: $spacing-sm $spacing-lg;
        border-radius: $border-radius-pill;
        box-shadow: 0 4px 16px rgba($primary-color, 0.2);
        border: 2px solid $primary-color;
      }
    }

    @media (max-width: $breakpoint-sm) {
      .total-content {
        flex-direction: column;
        gap: $spacing-md;
        text-align: center;

        .total-amount {
          font-size: $font-size-xl;
        }
      }
    }
  }
}

// Acciones
.acciones {
  display: flex;
  gap: $spacing-md;
  background: white;
  padding: $spacing-xl;
  border-radius: $border-radius-xl;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  justify-content: center;

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
  }
}

// Botones mejorados
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-xl;
  border: none;
  border-radius: $border-radius-lg;
  font-size: $font-size-base;
  font-weight: $font-weight-bold;
  text-decoration: none;
  cursor: pointer;
  transition: all $transition-fast;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  min-width: 200px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  .btn-icon {
    font-size: 1.2em;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &.btn-primary {
    background: linear-gradient(135deg, $primary-color 0%, #059447 100%);
    color: white;
    box-shadow: 0 6px 20px rgba($primary-color, 0.3);

    &:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba($primary-color, 0.4);
    }
  }

  &.btn-secondary {
    background: white;
    color: $primary-color;
    border: 2px solid $primary-color;
    box-shadow: 0 4px 16px rgba($primary-color, 0.1);

    &:hover {
      background: $primary-color;
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba($primary-color, 0.3);
    }
  }
}

// Responsive adicional
@media (max-width: $breakpoint-md) {
  .pedido-detalle {
    &__header {
      padding: $spacing-lg;
    }

    .pedido-info__details {
      grid-template-columns: 1fr;
      padding: $spacing-md;
    }

    .productos-lista {
      .productos-header {
        padding: $spacing-md;
      }

      .productos-container {
        padding: $spacing-md;
      }
    }

    .envio-info,
    .acciones {
      padding: $spacing-md;
    }
  }
}

// Animaciones de entrada
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pedido-info,
.envio-info,
.productos-lista,
.acciones {
  animation: fadeInUp 0.6s ease-out;

  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.2s; }
  &:nth-child(4) { animation-delay: 0.3s; }
  &:nth-child(5) { animation-delay: 0.4s; }
}
</style>