<template>
    <div class="product-detail">
      <div class="product-detail__container">
        <div class="product-detail__image-wrapper">
          <img :src="product?.urlImagen" :alt="product?.nombre" class="product-detail__image" />
        </div>
  
        <div class="product-detail__info">
          <h1 class="product-detail__title">{{ product?.nombre }}</h1>
          <p class="product-detail__price">{{ product?.precio }} €</p>
          <p class="product-detail__description">{{ product?.descripcion }}</p>
          <button class="product-detail__cart-btn" @click="addToCart">Añadir al Carrito</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import { useCartStore } from '@/stores/cartStore';
  
  const route = useRoute();
  const cartStore = useCartStore();
  const product = ref(null);
  
  onMounted(async () => {
    try {
      const response = await axios.get(`http://localhost:5162/api/Producto/${route.params.id}`);
      product.value = response.data;
    } catch (error) {
      console.error("Error al obtener el producto:", error);
    }
  });
  
  const addToCart = () => {
    if (product.value) {
      cartStore.addToCart({
        id: product.value.id,
        name: product.value.nombre,
        price: product.value.precio,
        image: product.value.urlImagen
      });
    }
  };
  </script>
  
  
  <style lang="scss" scoped>
  @use '@/styles/variables' as *;
  
  .product-detail {
    width: 90%;
    max-width: 1000px;
    margin: 100px auto;
    padding: $spacing-md;
  
    &__container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: $spacing-lg;
    }
  
    &__image-wrapper {
      flex: 1;
      max-width: 400px;
    }
  
    &__image {
      width: 100%;
      border-radius: $border-radius;
      object-fit: cover;
    }
  
    &__info {
      flex: 1;
      max-width: 500px;
      text-align: left;
    }
  
    &__title {
      font-size: 2rem;
      font-weight: bold;
    }
  
    &__price {
      font-size: 1.5rem;
      color: $primary-color;
    }
  
    &__description {
      font-size: 1.1rem;
      margin-top: $spacing-md;
    }
  
    &__cart-btn {
      background-color: $primary-color;
      color: white;
      padding: $spacing-sm $spacing-md;
      font-size: 1rem;
      cursor: pointer;
      border: none;
      border-radius: $border-radius;
      transition: background-color 0.3s ease;
  
      &:hover {
        opacity: 0.85;
      }
    }
  }
  
  // Estilos para las reseñas
  .product-reviews {
    margin-top: $spacing-lg;
  
    h2 {
      font-size: 1.8rem;
      margin-bottom: $spacing-md;
    }
  
    .review {
      background-color: #f9f9f9;
      padding: $spacing-sm;
      margin-bottom: $spacing-sm;
      border-radius: $border-radius;
  
      &__author {
        font-weight: bold;
      }
  
      &__comment {
        font-size: 1rem;
        margin-top: $spacing-xs;
      }
    }
  }
  </style>
  