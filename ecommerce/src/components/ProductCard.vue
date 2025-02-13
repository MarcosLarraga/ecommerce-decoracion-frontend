<template>
  <v-card class="product-card">
    <v-img :src="product.image" :alt="product.name" height="200" class="product-card__image"></v-img>
    <v-card-title class="product-card__title">{{ product.name }}</v-card-title>
    <v-card-subtitle class="product-card__price">{{ product.price }}</v-card-subtitle>
    <v-card-actions class="product-card__actions">
      <v-btn class="product-card__button" icon>
        <v-icon>mdi-cart</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps(['product']);
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.product-card {
  background: #f5f5f5;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.03);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
  }

  &__image {
    border-radius: 12px;
    object-fit: cover;
  }

  &__title {
    font-size: $font-size-large;
    color: $primary-color;
    font-weight: bold;
    margin-top: $spacing-sm;
  }

  
  &__price {
    color: rgb(87, 87, 87);
    font-weight: bold;
    margin-bottom: $spacing-sm;
  }

  &__actions {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  &__button {
    width: 50px;
    height: 50px;
    background-color: $primary-color;
    color: white;
    font-weight: bold;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
    &:hover {
      background-color: #007a3d;
    }
  }
}
</style>
