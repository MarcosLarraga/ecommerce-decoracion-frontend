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
            <h3 class="cart__item-name">{{ item.name }}</h3>
            <p class="cart__item-price">{{ item.price.toFixed(2) }} €</p>
            <p class="cart__item-quantity">Cantidad: {{ item.quantity }}</p>
          </div>
          <button class="cart__item-remove-btn" @click="cartStore.removeFromCart(item.id)">
            Quitar
          </button>
        </div>
      </div>

      <div class="cart__total">
        <h2 class="cart__total-price">Total: {{ cartStore.cartTotal.toFixed(2) }} €</h2>
        <button class="cart__total-checkout-btn" @click="irAConfirmacion">
          Continuar con el pedido
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const router = useRouter();

const irAConfirmacion = () => {
  router.push("/pedido-confirmacion");
};
</script>

<style lang="scss" scoped>

@use '@/styles/variables' as *;

.cart {
  width: 90%;
  max-width: 600px;
  margin: 80px auto;
  background-color: $background-color;
  padding: $spacing-md;
  border-radius: $border-radius;
  box-shadow: $box-shadow;

  &__title {
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: $spacing-lg;
    color: $text-color;
    font-family: $font-family-primary;
  }

  &__empty {
    text-align: center;
    font-size: $font-size-large;
    padding: $spacing-md;
    color: $text-color;
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
    background: #f8f8f8;
    padding: $spacing-md;
    border-radius: $border-radius;

    &-image {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: $border-radius;
    }

    &-info {
      flex-grow: 1;
      padding-left: $spacing-sm;
    }

    &-name {
      font-size: $font-size-base;
      font-weight: bold;
      color: $text-color;
      font-family: $font-family-primary;
    }

    &-price {
      font-size: $font-size-small;
      color: $primary-color;
    }

    &-quantity {
      font-size: $font-size-small;
      color: $secondary-color;
    }

    &-remove-btn {
      background-color: red;
      color: white;
      padding: $spacing-sm $spacing-md;
      border: none;
      border-radius: $form-button-radius;
      cursor: pointer;
      font-size: $font-size-small;
      transition: background-color 0.2s ease-in-out;
      box-shadow: $form-button-shadow;

      &:hover {
        background-color: darkred;
      }
    }
  }

  &__total {
    text-align: right;
    margin-top: $spacing-lg;

    &-price {
      font-size: 1.5rem;
      font-weight: bold;
      color: $text-color;
      font-family: $font-family-primary;
    }

    &-checkout-btn {
      display: block;
      width: 100%;
      background-color: $primary-color;
      color: white;
      padding: $spacing-md;
      border-radius: $form-button-radius;
      font-size: $font-size-base;
      font-weight: bold;
      cursor: pointer;
      border: none;
      transition: background-color 0.2s ease-in-out;
      box-shadow: $form-button-shadow;

      &:hover {
        background-color: $primary-color-hover;
      }
    }
  }
}

/* 🔹 Media Queries */
@media (min-width: $breakpoint-sm) {
  .cart {
    max-width: 700px;
    padding: $spacing-lg;

    &__item {
      padding: $spacing-lg;

      &-image {
        width: 70px;
        height: 70px;
      }

      &-name {
        font-size: 1.2rem;
      }

      &-price,
      &-quantity {
        font-size: 1rem;
      }

      &-remove-btn {
        font-size: 1rem;
      }
    }
  }
}

@media (min-width: $breakpoint-md) {
  .cart {
    max-width: 800px;

    &__total {
      &-price {
        font-size: 1.8rem;
      }

      &-checkout-btn {
        font-size: 1.2rem;
      }
    }
  }
}

@media (min-width: $breakpoint-lg) {
  .cart {
    max-width: 900px;
  }
}

</style>
