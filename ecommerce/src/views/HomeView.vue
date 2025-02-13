<template>
  <v-container fluid class="home">
    <!-- Hero Section -->
    <v-row no-gutters>
      <v-col cols="12" class="home__hero">
        <v-img src="/fotos/vinicius-amnx-amano-17NCG_wOkMY-unsplash.jpg" alt="Nueva colección" class="home__hero-bg" cover />
        <div class="home__hero-text">
          <h1>Descubre la <br> nueva colección</h1>
        </div>
      </v-col>
    </v-row>

    <!-- Categorías -->
    <v-row justify="center" class="home__categories">
      <v-col cols="12" class="home__title">
        <h2 class="section-title">Categorías</h2>
      </v-col>
      <v-col cols="12" sm="4" v-for="category in categories" :key="category.name">
        <v-card class="home__category">
          <v-img :src="category.image" :alt="category.name" class="home__category-image" />
          <v-card-text class="home__category-text">{{ category.name }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Destacados -->
    <v-container>
      <h2 class="section-title">Destacados</h2>
      <v-row>
        <v-col
          cols="6"
          md="3"
          v-for="product in (products.length ? products : defaultProducts)"
          :key="product.id"
        >
          <ProductCard :product="product" />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductCard from '@/components/ProductCard.vue';

const categories = ref([
  { name: 'Textiles', image: '/fotos/textiles.jpg' },
  { name: 'Pinturas', image: '/fotos/pinturas.jpg' },
  { name: 'Confort', image: '/fotos/confort.jpg' }
]);

const products = ref([]);
const defaultProducts = ref([
  { id: 1, name: 'Ejemplo Producto 1', image: '/fotos/default1.jpg', price: '€19.99' },
  { id: 2, name: 'Ejemplo Producto 2', image: '/fotos/default2.jpg', price: '€29.99' },
  { id: 3, name: 'Ejemplo Producto 3', image: '/fotos/default3.jpg', price: '€39.99' },
  { id: 4, name: 'Ejemplo Producto 4', image: '/fotos/default4.jpg', price: '€49.99' }
]);

const fetchProducts = async () => {
  try {
    const response = await fetch('https://api.example.com/products'); // Reemplaza con tu API
    const data = await response.json();
    products.value = data;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

onMounted(fetchProducts);
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.home {
  padding: 0;
  margin: 0;

  &__hero {
    position: relative;
    width: 100vw;
    height: 60vh;
    overflow: hidden;

    @media (min-width: $breakpoint-md) {
      height: 100vh;
    }

    &-bg {
      width: 100vw;
      height: 100%;
      object-fit: cover;
    }

    &-text {
      position: absolute;
      top: 50%;
      left: 5%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.8);
      padding: $spacing-md;
      border-radius: $border-radius;
      font-size: 1.5rem;
      font-weight: bold;
      color: $primary-color;

      @media (min-width: $breakpoint-md) {
        left: 10%;
        font-size: 1.8rem;
      }
    }
  }

  &__title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin: $spacing-lg 0;
  }

  &__categories {
    display: flex;
    justify-content: center;
    gap: $spacing-md;
    margin-bottom: $spacing-xl;
  }

  &__category {
    text-align: center;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.05);
    }
  }

  &__category-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  &__category-text {
    font-weight: bold;
    padding-top: $spacing-sm;
  }
}

.section-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: $spacing-lg;
}
</style>
