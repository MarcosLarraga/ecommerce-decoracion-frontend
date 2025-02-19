<template>
  <div class="home">
    <!-- Hero Section -->
    <div class="home__hero">
      <img src="/fotos/fotoHero1.jpg" alt="Nueva colección" class="home__hero-bg" />
      <div class="home__hero-overlay">
        <h1 class="home__hero-title">Descubre los mejores complementos para tu hogar</h1>
      </div>
    </div>

    <!-- Categorías -->
    <section class="home__categories">
      <h2 class="section-title">Categorías</h2>
      <div class="categories-grid">
        <div class="category-card" v-for="category in categoriesStore.allCategories" :key="category.id"
          @click="goToCategory(category.name)">
          <img :src="category.image || '/fotos/default.jpg'" :alt="category.name" class="category-card__image" />
          <div class="category-card__title">{{ category.name }}</div>
        </div>
      </div>
    </section>

    <!-- Productos Destacados -->
    <section class="home__products">
      <h2 class="section-title">Productos Destacados</h2>
      <div class="products-grid">
        <ProductCard v-for="product in productsStore.randomProducts" :key="product.id" :producto="product" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCategoriesStore } from '@/stores/categoriesStore';
import { useProductsStore } from '@/stores/productsStore';
import { useRouter } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';

const categoriesStore = useCategoriesStore();
const productsStore = useProductsStore();
const router = useRouter();

// Cargar categorías y productos destacados
onMounted(async () => {
  await categoriesStore.fetchCategories();
  await productsStore.fetchProducts();
  console.log("Categorías cargadas:", categoriesStore.allCategories);
});

// Función para navegar a la página de shop con la categoría seleccionada
const goToCategory = (categoryName: string) => {
  router.push({ path: '/shop', query: { category: categoryName } }); // 🔥 Redirigir a shop con query param
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.home {
  padding: 0;
  margin: 0;

  &__hero {
    width: 100vw;
    height: 60vh;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;

    &-bg {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.6);
      padding: $spacing-md;
      border-radius: $border-radius;
      text-align: center;
      width: 90%;
      max-width: 600px;
    }

    &-title {
      font-size: 2rem;
      font-family: $font-family-primary;
      color: $background-color;
      font-weight: bold;
      text-transform: uppercase;
    }
  }

  &__categories {
    text-align: center;
    padding: 36px 0;
    width: 100%;
    margin: 0 auto;

    .categories-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 50px;
    }

    .category-card {
      position: relative;
      width: 300px;
      height: 350px;
      border-radius: $border-radius;
      overflow: hidden;
      box-shadow: $box-shadow;
      cursor: pointer;
      transition: transform 0.3s ease-in-out;

      &:hover {
        transform: scale(1.05);
      }

      &__image {
        width: 100%;
        height: 85%;
        object-fit: cover;
      }

      &__title {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 15%;
        background: rgba(255, 255, 255, 0.9);
        color: $text-color;
        font-size: 1.2rem;
        font-weight: bold;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }}


// 📌 **Títulos más grandes**
.section-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 32px;
}
</style>
