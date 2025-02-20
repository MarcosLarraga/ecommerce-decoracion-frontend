<template>
  <div class="cart">
    <h1 class="cart__title">Mi Carrito</h1>

    <div v-if="cartStore.cart.length === 0" class="cart__empty">
      <p class="cart__empty-message">Tu carrito está vacío.</p>
    </div>

    <div v-else class="cart__container">
      <div class="cart__items">
        <div class="cart__item" v-for="item in cartStore.cart" :key="item.id">
          <img :src="item.image" :alt="item.name" class="cart__item-image" />
          <div class="cart__item-info">
            <h3 class="cart__item-name">{{ item.name }}</h3>
            <p class="cart__item-price">{{ item.price.toFixed(2) }} €</p>
            <div class="cart__quantity">
              <button class="cart__quantity-btn" @click="decreaseQuantity(item)">-</button>
              <span class="cart__quantity-number">{{ item.quantity }}</span>
              <button class="cart__quantity-btn" @click="increaseQuantity(item)">+</button>
            </div>
          </div>
          <button class="cart__remove-btn" @click="cartStore.removeFromCart(item.id)">Quitar</button>
        </div>
      </div>

      <div class="cart__total">
        <h2 class="cart__total-title">Total: {{ cartStore.cartTotal.toFixed(2) }} €</h2>
        <button class="cart__checkout-btn">Finalizar Compra</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore';

const cartStore = useCartStore();

const increaseQuantity = (item: any) => {
  cartStore.increaseQuantity(item.id);
};

const decreaseQuantity = (item: any) => {
  cartStore.decreaseQuantity(item.id);
};

</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.cart {
  width: 90%;
  max-width: 800px;
  margin: 140px auto;
  padding: $spacing-md;
  background-color: $background-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;

  &__title {
    font-size: 2rem;
    margin-bottom: $spacing-md;
    color: $text-color;
    text-align: center;
  }

  &__empty {
    text-align: center;
    font-size: 1.2rem;
    color: $text-color;
  }

  &__container {
    display: flex;
    flex-direction: column;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f2f2f2;
    border-radius: $border-radius;
    padding: $spacing-sm;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
  }

  &__item-image {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: $border-radius;
  }

  &__item-info {
    flex-grow: 1;
    padding-left: $spacing-sm;

    &-name {
      font-size: $font-size-base;
      font-weight: bold;
    }

    &-price {
      font-size: $font-size-small;
      color: $text-color;
    }
  }

  &__quantity {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }

  &__quantity-btn {
    background-color: $primary-color;
    color: #fff;
    border: none;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 4px;
    font-weight: 500;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: #04893e; // Color manualmente más oscuro
    }
  }

  &__quantity-number {
    font-size: $font-size-base;
    font-weight: bold;
  }

  &__remove-btn {
    background-color: red;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #c10000; // Color manualmente más oscuro
    }
  }

  &__total {
    text-align: right;
    margin-top: $spacing-md;

    &-title {
      font-size: 1.5rem;
      font-weight: bold;
    }
  }

  &__checkout-btn {
    background-color: $primary-color;
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 1rem;
    border-radius: $border-radius;
    cursor: pointer;
    font-weight: bold;

    &:hover {
      background-color: #04893e; // Color manualmente más oscuro
    }
  }
}
</style>
