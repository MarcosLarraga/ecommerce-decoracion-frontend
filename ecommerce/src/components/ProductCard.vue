<template>
  <div class="product-card">
    <router-link :to="`/product/${producto.id}`" class="product-card__content">
      <div class="product-card__image-wrapper">
        <img
          :src="producto.urlImagen"
          alt="Imagen del producto"
          class="product-card__image"
        />
        <div class="product-card__overlay">
          <span class="product-card__view">Ver</span>
        </div>
      </div>
      <div class="product-card__info">
        <h3 class="product-card__title">{{ producto.nombre }}</h3>
        <p class="product-card__price">{{ producto.precio.toFixed(2) }} €</p>
      </div>
    </router-link>
    <button
      class="product-card__cart-btn"
      @click="addToCart($event)"
      :disabled="isAddingToCart"
    >
      <font-awesome-icon
        :icon="isAddingToCart ? faSpinner : faShoppingCart"
        :spin="isAddingToCart"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { useCartStore } from '../stores/cartStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faShoppingCart, faSpinner } from '@fortawesome/free-solid-svg-icons';

const props = defineProps({
  producto: Object,
});

const cartStore = useCartStore();
const isAddingToCart = ref(false);

const addToCart = async (event: Event) => {
  event.stopPropagation();
  if (props.producto) {
    isAddingToCart.value = true;
    
    try {
      cartStore.addToCart({
        id: props.producto.id,
        name: props.producto.nombre,
        price: props.producto.precio,
        image: props.producto.urlImagen,
      });
    } finally {
      setTimeout(() => {
        isAddingToCart.value = false;
      }, 500);
    }
  }
};
</script>

<style lang="scss" scoped>
@use '../styles/variables' as *;

// Enfoque Mobile-first
.product-card {
  position: relative;
  background-color: $background-color;
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  overflow: hidden;
  transition: transform $transition-fast, box-shadow $transition-fast;
  display: flex;
  flex-direction: column;
  
  /* Dimensiones para móvil primero */
  width: 160px;
  height: 260px; /* Altura reducida */
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: $box-shadow-lg;
    
    .product-card__overlay {
      opacity: 1;
    }
    
    .product-card__image {
      transform: scale(1.05);
    }
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    flex: 1;
    text-decoration: none;
    color: inherit;
  }
  
  &__image-wrapper {
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    width: 100%;
    height: 150px; /* Altura fija para la imagen */
    background-color: #f5f5f5;
  }
  
  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform $transition-normal;
    padding: 8px;
  }
  
  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity $transition-normal;
  }
  
  &__view {
    background-color: $background-color;
    color: $text-color;
    padding: 6px 12px;
    border-radius: $border-radius-sm;
    font-weight: 500;
    font-size: 12px;
    transform: translateY(5px);
    transition: transform $transition-normal, background-color $transition-fast;
    
    .product-card:hover & {
      transform: translateY(0);
    }
    
    &:hover {
      background-color: $primary-color;
      color: $button-text-color;
    }
  }
  
  &__info {
    padding: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 80px; /* Altura reducida para la sección de información */
  }
  
  &__title {
    font-family: $font-family-primary;
    font-size: 13px;
    font-weight: 600;
    margin: 0 0 5px;
    color: $text-color;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 2.6em;
  }
  
  &__price {
    font-size: 14px;
    font-weight: 700;
    color: $primary-color;
    margin: 5px 0 0;
  }
  
  &__cart-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    border-radius: $border-radius-circle;
    background-color: $primary-color;
    color: $button-text-color;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color $transition-fast, transform $transition-fast;
    font-size: 12px;
    
    &:hover:not(:disabled) {
      background-color: $primary-color-hover;
      transform: scale(1.1);
    }
    
    &:disabled {
      background-color: $text-color-secondary;
      cursor: not-allowed;
    }
  }
}

// Media queries para pantallas más grandes (enfoque mobile-first)
@media (min-width: $breakpoint-sm) {
  .product-card {
    width: 180px;
    height: 280px;
    
    &__title {
      font-size: 14px;
    }
    
    &__price {
      font-size: 15px;
    }
    
    &__cart-btn {
      width: 32px;
      height: 32px;
      font-size: 14px;
    }
  }
}

@media (min-width: $breakpoint-md) {
  .product-card {
    width: 200px;
    height: 300px;
    
    &__image-wrapper {
      height: 160px;
    }
    
    &__info {
      padding: $spacing-md;
      height: 90px;
    }
    
    &__title {
      font-size: $font-size-small;
    }
    
    &__price {
      font-size: $font-size-base;
    }
  }
}

@media (min-width: $breakpoint-lg) {
  .product-card {
    width: 220px;
    height: 310px;
  }
}
</style>