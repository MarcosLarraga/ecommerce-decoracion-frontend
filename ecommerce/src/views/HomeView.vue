<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useProductsStore } from '@/stores/productsStore';
import { useCategoriesStore } from '@/stores/categoriesStore';
import ProductCard from '@/components/ProductCard.vue';

const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();

onMounted(async () => {
  await productsStore.fetchProducts(); // Carga los productos y selecciona aleatoriamente 4
  await categoriesStore.fetchCategories();
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
        :key="category.id"
      >
        <v-card @click="filterByCategory(category.id)" class="home__category">
          <div class="home__category-title">
            {{ category.nombre }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Productos Aleatorios -->
    <v-container>
      <h2 class="section-title">Productos Destacados</h2>
      <v-row>
        <v-col
          cols="6"
          md="3"
          v-for="product in productsStore.randomProducts"
          :key="product.id"
        >
          <ProductCard :producto="product" />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
<style scoped>
.home {
  padding: 0;
  margin: 0;

  &__hero {
    width: 100vw;
    height: 40vh;
    overflow: hidden;
    position: relative;
  }

  &__categories {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
  }

  &__category {
    height: 300px;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
  }

  &__category:hover {
    transform: scale(1.05);
  }

  &__category-title {
    background-color: white;
    color: black;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    padding: 12px 0;
  }
}

.section-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
