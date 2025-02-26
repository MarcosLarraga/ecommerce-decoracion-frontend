<template>
  <div class="pedido-detalle">
    <h1 class="pedido-detalle__title">Detalles del Pedido</h1>

    <!-- Datos del Pedido -->
    <div class="pedido-detalle__info" v-if="detallePedidoStore.detallesPedido.length > 0 && detallePedidoStore.usuario">
      <p><strong>ID del Pedido:</strong> {{ detallePedidoStore.detallesPedido[0].pedido.id }}</p>
      <p><strong>Fecha:</strong> {{ new Date(detallePedidoStore.detallesPedido[0].pedido.fechaPedido).toLocaleString() }}</p>
      <p><strong>Total:</strong> {{ detallePedidoStore.detallesPedido[0].pedido.total.toFixed(2) }} €</p>

      <!-- Datos del Usuario -->
      <h2 class="pedido-detalle__subtitle">Datos del Usuario</h2>
      <p><strong>Nombre:</strong> {{ detallePedidoStore.usuario.nombre }}</p>
      <p><strong>Correo:</strong> {{ detallePedidoStore.usuario.email }}</p>
      <p><strong>Teléfono:</strong> {{ detallePedidoStore.usuario.telefono }}</p>
      <p><strong>Dirección:</strong> {{ detallePedidoStore.usuario.direccion }}</p>
    </div>

    <!-- Lista de Productos -->
    <h2 class="pedido-detalle__subtitle">Productos</h2>
    <div class="pedido-detalle__items" v-if="detallePedidoStore.detallesPedido.length > 0">
      <div class="pedido-detalle__item" v-for="item in detallePedidoStore.detallesPedido" :key="item.id">
        <p><strong>Producto:</strong> {{ item.producto.nombre }}</p>
        <p><strong>Categoría:</strong> {{ item.producto.categoria.nombre }}</p>
        <p><strong>Cantidad:</strong> {{ item.cantidad }}</p>
        <p><strong>Precio Unitario:</strong> {{ item.precioUnitario.toFixed(2) }} €</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDetallePedidoStore } from '@/stores/detallePedidoStore';
import { useRoute } from 'vue-router';

const detallePedidoStore = useDetallePedidoStore();
const route = useRoute();
const pedidoId = Number(route.params.id);

onMounted(async () => {
  await detallePedidoStore.fetchDetallesPedido(pedidoId);
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.pedido-detalle {
  width: 90%;
  max-width: 800px;
  margin: 50px auto;
  background-color: $background-color;
  padding: 20px;
  border-radius: 8px;
  box-shadow: $box-shadow;
  color: $text-color;

  &__title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 20px;
    color: $primary-color;
  }

  &__info {
    font-size: 1rem;
    padding: 10px;
    background: #222;
    border-radius: 8px;
    margin-bottom: 20px;
    color: white;
  }

  &__subtitle {
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 20px;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__item {
    background: #f8f8f8;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid $color-borde;
  }
}
</style>
