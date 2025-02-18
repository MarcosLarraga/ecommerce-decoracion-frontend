<template>
  <div class="product-card">
    <!-- Imagen del producto -->
    <div class="product-card__image-wrapper">
      <img :src="producto.urlImagen" alt="Imagen del producto" class="product-card__image" />
    </div>

    <!-- Contenido de la tarjeta -->
    <div class="product-card__info">
      <h3 class="product-card__title">{{ producto.nombre }}</h3>
      <p class="product-card__price">{{ producto.precio }} €</p>
    </div>

    <!-- Botón de añadir al carrito -->
    <button class="product-card__cart-btn" @click="addToCart">
      <font-awesome-icon :icon="faShoppingCart" />
    </button>

  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const props = defineProps({
  producto: Object, // Recibe el producto como prop
});

const addToCart = () => {
  console.log('🛒 Producto añadido al carrito:', props.producto);
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.product-card {
  width: 100%;
  max-width: 220px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-radius: $border-radius;
  background-color: #ffffff;
  border: 1px solid #dddddd;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: $spacing-xs;
  margin: $spacing-sm;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  }
}

.product-card__image-wrapper {
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: contain; // ✅ Las imágenes no se cortan
}

.product-card__info {
  padding: $spacing-xs;
}

.product-card__title {
  font-size: $font-size-small;
  font-weight: bold;
  color: $text-color;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 3.6em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-card__price {
  font-size: $font-size-base;
  color: $primary-color;
  font-weight: bold;
  margin-top: $spacing-xs;
}

.product-card__cart-btn {
  background-color: $primary-color;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s ease;
  margin-top: $spacing-xs;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  color: white; // ✅ El icono se ve blanco sin necesidad de filtros

  &:hover {
    opacity: 0.85;
  }
}

@media (max-width: $breakpoint-md) {
  .product-card {
    max-width: 100%;
  }

  .product-card__image-wrapper {
    height: 160px;
  }

  .product-card__title {
    font-size: $font-size-small;
    max-height: none;
    -webkit-line-clamp: unset;
  }

  .product-card__price {
    font-size: $font-size-small;
  }
}
</style>
