<template>
  <div class="product-card">
    <router-link :to="`/product/${producto.id}`" class="product-card__content">
      <div class="product-card__image-wrapper">
        <img :src="producto.urlImagen" alt="Imagen del producto" class="product-card__image" />
      </div>
      <div class="product-card__info">
        <h3 class="product-card__title">{{ producto.nombre }}</h3>
        <p class="product-card__price">{{ producto.precio }} €</p>
      </div>
    </router-link>
    <button class="product-card__cart-btn" @click="addToCart($event)">
      <font-awesome-icon :icon="faShoppingCart" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const props = defineProps({
  producto: Object,
});

const cartStore = useCartStore();

const addToCart = (event: Event) => {
  event.stopPropagation();
  if (props.producto) {
    cartStore.addToCart({
      id: props.producto.id,
      name: props.producto.nombre,
      price: props.producto.precio,
      image: props.producto.urlImagen,
    });
    console.log('Producto añadido al carrito:', cartStore.cart);
  }
};
</script>

<style lang="scss" scoped>
@use '@/styles/mixins' as *;

.product-card {
  @include productCard;
}

@include productCardResponsive;
</style>
