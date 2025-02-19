<template>
  <div class="cart">
    <h1 class="cart__title">Mi Carrito</h1>

    <div v-if="cartStore.cart.length === 0" class="cart__empty">
      <p>Tu carrito está vacío.</p>
    </div>

    <div v-else>
      <div class="cart__items">
        <div class="cart__item" v-for="item in cartStore.cart" :key="item.id">
          <img :src="item.image" :alt="item.name" class="cart__item-image" />
          <div class="cart__item-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.price.toFixed(2) }} €</p>
            <p>Cantidad: {{ item.quantity }}</p>
          </div>
          <button class="cart__remove-btn" @click="cartStore.removeFromCart(item.id)">
            Quitar
          </button>
        </div>
      </div>

      <div class="cart__total">
        <h2>Total: {{ cartStore.cartTotal.toFixed(2) }} €</h2>
        <button class="cart__checkout-btn">Finalizar Compra</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore';
const cartStore = useCartStore();
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.cart {
  width: 90%;
  max-width: 800px;
  margin: 100px auto;
  background-color: #fff; // Fondo claro para el contenedor principal
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;

  &__title {
    font-size: 2rem;
    margin-bottom: 20px;
    color: $text-color;
  }

  &__empty {
    font-size: 1.2rem;
    color: $text-color;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f2f2f2; // Color gris claro en vez de lighten()
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
  }

  &__item-image {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 5px;
  }

  &__item-info {
    flex-grow: 1;
    text-align: left;
    padding-left: 15px;

    h3 {
      margin: 0 0 5px;
      color: $text-color;
      font-size: 1.1rem;
    }

    p {
      margin: 0;
      color: $text-color;
    }
  }

  &__remove-btn {
    background-color: $primary-color;
    color: #fff;
    border: none;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 4px;
    font-weight: 500;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: $primary-color;
    }
  }

  &__total {
    margin-top: 30px;
    text-align: right;

    h2 {
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: $text-color;
    }
  }

  &__checkout-btn {
    background-color: $primary-color;
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 4px;
    font-weight: 600;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: $primary-color;
    }
  }
}
</style>

