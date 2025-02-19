<template>
  <div class="product-card">
    <router-link :to="`/product/${producto.id}`" class="product-card__content">
      <!-- Imagen del producto -->
      <div class="product-card__image-wrapper">
        <img :src="producto.urlImagen" alt="Imagen del producto" class="product-card__image" />
      </div>

      <!-- Contenido de la tarjeta -->
      <div class="product-card__info">
        <h3 class="product-card__title">{{ producto.nombre }}</h3>
        <p class="product-card__price">{{ producto.precio }} €</p>
      </div>
    </router-link>

    <!-- Botón de añadir al carrito (dentro de la tarjeta, pero separado del `router-link`) -->
    <button class="product-card__cart-btn" @click="addToCart">
      <font-awesome-icon :icon="faShoppingCart" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const cartStore = useCartStore();

const props = defineProps({
  producto: Object,
});

const addToCart = (event: Event) => {
  event.stopPropagation(); // ✅ Evita que el clic en el botón active el `router-link`
  if (props.producto) {
    cartStore.addToCart({
      id: props.producto.id,
      name: props.producto.nombre,
      price: props.producto.precio,
      image: props.producto.urlImagen,
    });
    console.log('🛒 Producto añadido al carrito:', cartStore.cart);
  }
};
</script>
<style lang="scss" scoped>
@use '@/styles/variables' as *;

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: auto;
  
}

.product-card {
  width: 100%;
  max-width: 220px;
  min-height: 320px;
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
  margin: auto;
  margin-bottom: 20px;
  position: relative;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  }

  &__content {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  &__image-wrapper {
    width: 100%;
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__info {
    padding: $spacing-xs;
  }

  &__title {
    font-size: $font-size-small;
    font-weight: bold;
    color: $text-color;
    text-decoration: none; /* 🔥 Quitar subrayado */
  }

  &__price {
    font-size: $font-size-base;
    color: $primary-color;
    font-weight: bold;
    margin-top: $spacing-xs;
  }

  /* 📌 Botón de carrito con mejor posición */
  &__cart-btn {
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
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    color: white;
    position: absolute;
    bottom: 15px; /* 📌 Más arriba */
    right: 15px;

    &:hover {
      opacity: 0.85;
    }
  }
}

/* 📱 **RESPONSIVE: DOS TARJETAS POR FILA EN MÓVIL** */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .product-card {
    max-width: 100%;
  }

  .product-card__image-wrapper {
    height: 140px;
  }
}

/* 📌 **Títulos más grandes** */
.section-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 32px;
}
</style>