<script setup lang="ts">
import { onMounted } from 'vue';
import { useProductsStore } from '@/stores/productsStore';
import { useCategoriesStore } from '@/stores/categoriesStore';
import ProductCard from '@/components/ProductCard.vue';

const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();

onMounted(async () => {
  await productsStore.fetchProducts();
  await categoriesStore.fetchCategories();
  console.log('Productos después de fetch:', productsStore.allProducts);
});
</script>

<template>
  <v-container fluid class="home">
    <!-- Hero Section -->
    <v-row no-gutters class="home__hero">
      <v-col cols="12" class="home__hero-container">
        <v-img
          src="/fotos/fotoHero1.jpg"
          alt="Nueva colección"
          class="home__hero-bg"
          cover
        />
        <!-- Texto de Bienvenida -->
        <div class="home__hero-text">
          <h1>Descubre los mejores complementos para tu hogar</h1>
        </div>
      </v-col>
    </v-row>

    <!-- Categorías -->
    <v-row justify="center" class="home__categories">
      <v-col cols="12">
        <h2 class="section-title">Categorías</h2>
      </v-col>
      <v-col
        cols="12"
        sm="4"
        v-for="category in categoriesStore.allCategories"
        :key="category.name"
      >
        <v-card class="home__category">
          <v-img :src="category.image" :alt="category.name" cover class="home__category-image" />
          <div class="home__category-title">
            {{ category.name }}
          </div>
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
          v-for="product in (productsStore.allProducts.length ? productsStore.allProducts : productsStore.defaultProducts)"
          :key="product.id"
        >
          <ProductCard :product="product" />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.home {
  padding: 0;
  margin: 0;

  &__hero {
    width: 100vw;
    height: 40vh;
    overflow: hidden;
    position: relative;

    @media (min-width: $breakpoint-md) {
      height: 70vh;
    }

    &-container {
      position: relative;
    }

    &-bg {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
    }

    &-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: black; // Texto en negro
      font-weight: bold;
      width: 80%;
      max-width: 600px;

      h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }

      p {
        font-size: 1.5rem;
      }

      @media (max-width: 768px) {
        width: 90%;

        h1 {
          font-size: 2rem;
        }

        p {
          font-size: 1.2rem;
        }
      }
    }
  }

  &__categories {
    display: flex;
    justify-content: center;
    gap: $spacing-md;
    margin-bottom: $spacing-xl;
  }

  &__category {
    height: 300px;
    text-align: center;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
    position: relative;
    display: flex;
    flex-direction: column;

    &:hover {
      transform: scale(1.05);
    }
  }

  &__category-image {
    width: 100%;
    height: 80%;
    object-fit: cover;
    flex-grow: 1;
  }

  &__category-title {
    background-color: white;
    color: black;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    padding: 12px 0;
    width: 100%;
    flex-shrink: 0;
  }
}

.section-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: $spacing-lg;
}
</style>
