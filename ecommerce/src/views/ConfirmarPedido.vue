<template>
  <div class="pedido">
    <h1 class="pedido__title">Confirmar Pedido</h1>

    <p><strong>Correo:</strong> {{ userStore.user.email }}</p>

    <form class="pedido__form" @submit.prevent="confirmarPedido">
      <label>Dirección:</label>
      <input v-model="direccion" type="text" required />

      <label>Teléfono:</label>
      <input v-model="telefono" type="tel" required />

      <h2 class="pedido__subtitle">Productos en el pedido</h2>
      <div class="pedido__items" v-if="cartStore.cart.length > 0">
        <div class="pedido__item" v-for="item in cartStore.cart" :key="item.id">
          <img :src="item.image" :alt="item.name" class="pedido__item-image" />
          <div class="pedido__item-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.price.toFixed(2) }} €</p>
            <p>Cantidad: {{ item.quantity }}</p>
          </div>
        </div>
      </div>

      <h2 class="pedido__total">Total: {{ cartStore.cartTotal.toFixed(2) }} €</h2>

      <button type="submit" class="pedido__confirm-btn">Confirmar Pedido</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { usePedidoStore } from '@/stores/pedidoStore';
import { useDetallePedidoStore } from '@/stores/detallePedidoStore';
import { useCartStore } from '@/stores/cartStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const pedidoStore = usePedidoStore();
const detallePedidoStore = useDetallePedidoStore();
const cartStore = useCartStore();
const router = useRouter();

const direccion = ref(userStore.user.direccion || '');
const telefono = ref(userStore.user.telefono || '');

const confirmarPedido = async () => {
  if (cartStore.cart.length === 0) {
    alert("No puedes realizar un pedido sin productos en el carrito.");
    return;
  }

  try {
    const pedidoId = await pedidoStore.crearPedidoConDetalles(userStore.user.id, cartStore.cart, cartStore.cartTotal);
    await detallePedidoStore.agregarDetallesPedido(pedidoId, cartStore.cart);

    cartStore.clearCart();
    router.push(`/pedido-detalle/${pedidoId}`);
  } catch (error) {
    console.error("Error al confirmar el pedido:", error);
    alert(error.message);
  }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.pedido {
  width: 90%;
  max-width: 700px;
  margin: 50px auto;
  background-color: $background-color;
  padding: 20px;
  border-radius: 8px;
  box-shadow: $box-shadow;
  color: $text-color;
  font-family: $font-family-secondary;

  &__title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 20px;
    color: $primary-color;
    font-family: $font-family-primary;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  label {
    font-weight: bold;
  }

  input {
    padding: 10px;
    border: 1px solid $color-borde;
    border-radius: 5px;
    font-size: 1rem;
  }

  &__items {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__item {
    display: flex;
    align-items: center;
    background: #f8f8f8;
    padding: 10px;
    border-radius: 8px;

    &-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
    }

    &-info {
      padding-left: 10px;
    }
  }

  &__total {
    font-size: 1.5rem;
    font-weight: bold;
    color: $primary-color;
    margin-top: 15px;
    text-align: right;
  }

  &__confirm-btn {
    margin-top: 20px;
    padding: 10px;
    font-size: 1.2rem;
    font-weight: bold;
    background: $primary-color;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease-in-out;

    &:hover {
      background: $color-hover-boton;
    }
  }
}

/* 🔹 Detalle del Pedido */
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
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__item {
    display: flex;
    align-items: center;
    background: #f8f8f8;
    padding: 10px;
    border-radius: 8px;

    &-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
    }

    &-info {
      padding-left: 10px;
    }
  }
}
</style>