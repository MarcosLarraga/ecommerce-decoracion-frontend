<template>
    <v-card class="product-card">
      <v-img :src="product.image" :alt="product.name" height="200"></v-img>
      <v-card-title class="product-card__title">{{ product.name }}</v-card-title>
      <v-card-subtitle class="product-card__price">{{ product.price }} €</v-card-subtitle>
      <v-card-actions>
        <v-btn color="primary">Añadir al carrito</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup>
  defineProps(['product']);
  </script>
  
  <style scoped lang="scss">
  @import '@/styles/variables';

.product-card {
  background: $background-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  padding: $spacing-md;
  
  &__title {
    font-size: $font-size-large;
    color: $primary-color;
  }
  
  &__price {
    color: $text-color;
    font-weight: bold;
  }
}
  </style>