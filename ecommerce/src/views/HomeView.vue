<template>
  <div class="home">
    <!-- Carrusel (reemplaza la hero section) -->
    <v-carousel
      height="400"
      show-arrows="hover"
      cycle
      hide-delimiter-background
    >
      <v-carousel-item
        v-for="(slide, i) in slides"
        :key="i"
      >
        <v-sheet height="100%">
          <img :src="slide.image" class="carousel-image" />
          <div class="carousel-text">
            <h2>{{ slide.text }}</h2>
          </div>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>

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
import { onMounted, ref } from 'vue';
import { useCategoriesStore } from '@/stores/categoriesStore';
import { useProductsStore } from '@/stores/productsStore';
import { useRouter } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';

const categoriesStore = useCategoriesStore();
const productsStore = useProductsStore();
const router = useRouter();

// Variables del carrusel con las imágenes intercambiadas y textos inspiradores
const slides = ref([
  { image: '/fotos/carrusel3.jpg', text: 'Dale vida a hogar con un toque único' },
  { image: '/fotos/carrusel1.jpg', text: 'Pequeños detalles con un gran impacto' },
  { image: '/fotos/carrusel4.jpg', text: 'Confort y elegancia en cada rincón' },
  { image: '/fotos/carrusel2.jpg', text: 'Transforma tu espacio en un hogar acogedor' },
  { image: '/fotos/carrusel5.jpg', text: 'Encuentra la inspiración que necesitas' },
]);

// Cargar categorías y productos destacados
onMounted(async () => {
  await categoriesStore.fetchCategories();
  await productsStore.fetchProducts();
  console.log("Categorías cargadas:", categoriesStore.allCategories);
});

// Función para navegar a la página de shop con la categoría seleccionada
const goToCategory = (categoryName: string) => {
  router.push({ path: '/shop', query: { category: categoryName } });
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.home {
  padding: 0;
  margin: 0;

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
  }
}

.home__products {
  padding: 16px;
}

// Títulos más grandes
.section-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 32px;
}

/* Estilos del carrusel */
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-text {
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 1.5rem;
  text-align: center;
  font-weight: bold;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.8); /* Agregado sombreado */
}
</style>
