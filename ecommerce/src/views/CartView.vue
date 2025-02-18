<template>
  <div class="cart">
    <h1 class="cart__title">🛒 Mi Carrito</h1>

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
          <button class="cart__remove-btn" @click="cartStore.removeFromCart(item.id)">❌ Quitar</button>
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
.cart {
  width: 90%;
  max-width: 800px;
  margin: 100px auto;
  text-align: center;
}

.cart__title {
  font-size: 2rem;
  margin-bottom: 20px;
}

.cart__empty {
  font-size: 1.2rem;
  color: #666;
}

.cart__items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.cart__item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
}

.cart__item-info {
  flex-grow: 1;
  text-align: left;
  padding-left: 10px;
}

.cart__remove-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.cart__total {
  margin-top: 20px;
  font-size: 1.5rem;
}

.cart__checkout-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
}
</style>
