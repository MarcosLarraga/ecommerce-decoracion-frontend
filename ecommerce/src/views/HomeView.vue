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
    <!-- Hero Section-->
    <v-row no-gutters class="home__hero">
      <v-col cols="12">
        <v-img
          src="/fotos/fotoHero.jpg"
          alt="Nueva colección"
          class="home__hero-bg"
          cover
        />
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
          <v-card-text class="home__category-text">
            {{ category.name }}
          </v-card-text>
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
    padding: 0 !important;
    margin: 0 !important;

    @media (min-width: $breakpoint-md) {
      height: 70vh;
    }

    &-bg {
      width: 100vw;
      height: 100%;
      object-fit: cover;
      object-position: center center;
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

    &:hover {
      transform: scale(1.05);
    }
  }

  &__category-image {
    width: 100%;
    height: 100%;
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
