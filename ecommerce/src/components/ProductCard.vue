<template>
  <v-card class="product-card" :to="`/product/${producto.id}`" elevation="4">
    <v-img :src="producto.urlImagen" alt="Imagen del producto" class="product-card__image" />
    <v-card-title class="product-card__title">{{ producto.nombre }}</v-card-title>
    <v-card-subtitle class="product-card__price">{{ producto.precio | currency }}</v-card-subtitle>
    <v-card-actions>
      <v-btn
        color="primary"
        @click="addToCart"
        class="product-card__add-to-cart-btn"
      >
        Añadir al carrito
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  producto: Object, // Recibe el producto como prop
});

const addToCart = () => {
  console.log('Producto añadido al carrito', props.producto);
};
</script>

<style scoped>
.product-card {
  max-width: 300px;
  margin: 10px;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.product-card__image {
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
}

.product-card__title {
  font-weight: bold;
  font-size: 1.2rem;
  margin: 10px 0;
}

.product-card__price {
  font-size: 1.1rem;
  color: #4caf50;
}

.product-card__add-to-cart-btn {
  width: 100%;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
}
</style>
