<template>
  <div class="pedido-detalle">
    <h1 class="pedido-detalle__title">Detalles del Pedido</h1>

    <div v-if="loading" class="pedido-detalle__loading">
      <div class="spinner"></div>
      <p>Cargando detalles del pedido...</p>
    </div>

    <!-- Datos del Pedido -->
    <div class="pedido-detalle__info" v-else-if="detallePedidoStore.detallesPedido.length > 0 && detallePedidoStore.usuario">
      <p><strong>ID del Pedido:</strong> {{ detallePedidoStore.detallesPedido[0].pedido.id }}</p>
      <p><strong>Fecha:</strong> {{ new Date(detallePedidoStore.detallesPedido[0].pedido.fechaPedido).toLocaleString() }}</p>
      <p><strong>Total:</strong> {{ detallePedidoStore.detallesPedido[0].pedido.total.toFixed(2) }} €</p>
      <p><strong>Estado:</strong> <span class="pedido-detalle__estado">{{ detallePedidoStore.detallesPedido[0].pedido.estado || 'Pendiente' }}</span></p>

      <!-- Datos del Usuario -->
      <h2 class="pedido-detalle__subtitle">Datos del Usuario</h2>
      <p><strong>Nombre:</strong> {{ detallePedidoStore.usuario.nombre }}</p>
      <p><strong>Correo:</strong> {{ detallePedidoStore.usuario.email }}</p>
      <p><strong>Teléfono:</strong> {{ detallePedidoStore.usuario.telefono }}</p>
      <p><strong>Dirección:</strong> {{ detallePedidoStore.usuario.direccion }}</p>
    </div>

    <div v-else class="pedido-detalle__error">
      <p>No se encontraron detalles para este pedido.</p>
      <router-link to="/" class="pedido-detalle__back-btn">Volver a la tienda</router-link>
    </div>

    <!-- Lista de Productos -->
    <h2 class="pedido-detalle__subtitle" v-if="!loading && detallePedidoStore.detallesPedido.length > 0">Productos</h2>
    <div class="pedido-detalle__items" v-if="!loading && detallePedidoStore.detallesPedido.length > 0">
      <div class="pedido-detalle__item" v-for="item in detallePedidoStore.detallesPedido" :key="item.id">
        <p><strong>Producto:</strong> {{ item.producto.nombre }}</p>
        <p><strong>Categoría:</strong> {{ item.producto.categoria.nombre }}</p>
        <p><strong>Cantidad:</strong> {{ item.cantidad }}</p>
        <p><strong>Precio Unitario:</strong> {{ item.precioUnitario.toFixed(2) }} €</p>
      </div>
    </div>

    <!-- Botón para volver a mis pedidos -->
    <div class="pedido-detalle__actions" v-if="!loading && detallePedidoStore.detallesPedido.length > 0">
      <router-link to="/mi-cuenta" class="pedido-detalle__back-btn">
        Volver a mis pedidos
      </router-link>
    </div>
  </div>
</template>



<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDetallePedidoStore } from '@/stores/detallePedidoStore';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';

const detallePedidoStore = useDetallePedidoStore();
const route = useRoute();
const pedidoId = Number(route.params.id);
const toast = useToast();
const loading = ref(true);
const enviandoCorreo = ref(false);

onMounted(async () => {
  try {
    await detallePedidoStore.fetchDetallesPedido(pedidoId);
  } catch (error) {
    console.error("Error al cargar los detalles del pedido:", error);
    toast.error("No se pudieron cargar los detalles del pedido");
  } finally {
    loading.value = false;
  }
});


const enviarCorreoConfirmacion = async () => {
  if (!detallePedidoStore.detallesPedido.length) {
    toast.error("No hay información suficiente para enviar el correo");
    return;
  }
  
  enviandoCorreo.value = true;
  
  try {
    await axios.post(`http://localhost:5162/api/Pedido/enviar-confirmacion/${pedidoId}`);
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
@use '@/styles/variables' as *;

.pedido-detalle {
  width: 100%;
  max-width: 1000px;
  margin: 2rem auto;
  padding: $spacing-md;
  background-color: $background-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  color: $text-color;
  font-family: $font-family-secondary;

  @media (min-width: $breakpoint-sm) {
    padding: $spacing-lg;
    margin: 3rem auto;
  }

  @media (min-width: $breakpoint-md) {
    padding: $spacing-xl;
    margin: 4rem auto;
  }

  &__title {
    font-family: $font-family-primary;
    font-size: $font-size-xl;
    margin-bottom: $spacing-lg;
    color: $primary-color;
    text-align: center;
    font-weight: 700;
    
    @media (min-width: $breakpoint-md) {
      font-size: $font-size-xxl;
      margin-bottom: $spacing-xl;
    }
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-xl 0;
    
    p {
      margin-top: $spacing-md;
      font-size: $font-size-base;
      color: $text-color-secondary;
    }
  }

  &__error {
    text-align: center;
    padding: $spacing-xl 0;
    
    p {
      color: $error-color;
      font-size: $font-size-large;
      margin-bottom: $spacing-md;
    }
  }

  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border-left-color: $primary-color;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  &__info {
    background-color: $secondary-color;
    color: $background-color;
    border-radius: $border-radius;
    padding: $spacing-lg;
    margin-bottom: $spacing-lg;
    box-shadow: $box-shadow;
    
    p {
      margin: $spacing-xs 0;
      font-size: $font-size-base;
      line-height: $line-height-base;
      
      strong {
        color: $primary-color;
        font-weight: 600;
      }
    }
  }

  &__subtitle {
    font-family: $font-family-primary;
    font-size: $font-size-large;
    margin: $spacing-xl 0 $spacing-md;
    color: $primary-color;
    font-weight: 600;
    border-bottom: 2px solid $tertiary-color;
    padding-bottom: $spacing-xs;
  }

  &__items {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
    
    @media (min-width: $breakpoint-md) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__item {
    background-color: $tertiary-color;
    border-radius: $border-radius;
    padding: $spacing-lg;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: transform $transition-fast, box-shadow $transition-fast;
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }
    
    p {
      margin: $spacing-xs 0;
      font-size: $font-size-base;
      
      strong {
        color: $primary-color;
        font-weight: 600;
      }
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: $spacing-xl;
    gap: $spacing-md;
    
    @media (min-width: $breakpoint-sm) {
      flex-direction: row;
      justify-content: center;
    }
  }

  &__email-btn {
    background-color: $primary-color;
    color: $button-text-color;
    border: none;
    padding: $spacing-md $spacing-lg;
    border-radius: $button-radius;
    font-size: $font-size-base;
    font-weight: 600;
    cursor: pointer;
    transition: background-color $transition-normal, transform $transition-fast;
    box-shadow: $button-shadow;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 200px;
    
    &:hover:not(:disabled) {
      background-color: $primary-color-hover;
      transform: translateY(-2px);
      box-shadow: $button-hover-shadow;
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
    
    &:disabled {
      background-color: $text-color-secondary;
      cursor: not-allowed;
    }
  }

  &__back-btn {
    color: $primary-color;
    text-decoration: none;
    font-weight: 600;
    font-size: $font-size-base;
    transition: color $transition-fast;
    display: inline-flex;
    align-items: center;
    
    &::before {
      content: '←';
      margin-right: $spacing-xs;
    }
    
    &:hover {
      color: $primary-color-hover;
      text-decoration: underline;
    }
  }
}

</style>
