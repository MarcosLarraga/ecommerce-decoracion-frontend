<template>
  <v-card class="product-card">
    <!-- Imagen del producto -->
    <v-img :src="producto.urlImagen" alt="Imagen del producto" class="product-card__image" />

    <!-- Contenido de la tarjeta -->
    <v-card-title class="product-card__title">
      {{ producto.nombre }}
    </v-card-title>

    <v-card-subtitle class="product-card__price">
      {{ producto.precio }} €
    </v-card-subtitle>

    <!-- Botón de añadir al carrito -->
    <v-card-actions class="product-card__actions">
      <v-btn icon class="product-card__cart-btn" @click="addToCart">
        <v-icon>mdi-cart</v-icon>
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
  console.log('🛒 Producto añadido al carrito:', props.producto);
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.product-card {
  width: 100%;  // ✅ Ocupará todo el ancho en mobile
  max-width: 250px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  background-color: $background-color;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin: $spacing-md auto;  // ✅ Centrado automático en mobile

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
}


.product-card__image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.product-card__title {
  font-size: $font-size-small;
  font-weight: bold;
  padding: $spacing-xs;
  color: $text-color;
  white-space: normal; // ✅ Permite que el texto pase a otra línea
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 3.6em; // ✅ Controla el tamaño del título
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-card__price {
  font-size: $font-size-base;
  color: $primary-color;
  font-weight: bold;
}

.product-card__actions {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: auto;
  padding-bottom: $spacing-xs;
}

.product-card__cart-btn {
  background-color: $primary-color;
  color: $background-color;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
}

@media (max-width: $breakpoint-md) {
  .product-card {
    max-width: 100%;
  }

  .product-card__image {
    height: 150px;
  }

  .product-card__title {
    font-size: $font-size-small;
    max-height: none; // ✅ Permite mostrar todo el texto en móviles
    -webkit-line-clamp: unset;
  }

  .product-card__price {
    font-size: $font-size-small;
  }
}
</style>
