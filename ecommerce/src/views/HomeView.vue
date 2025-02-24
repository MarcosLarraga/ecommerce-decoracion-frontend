<template>
  <div class="home">
    <!-- Carrusel (reemplaza la hero section) -->
    <v-carousel
      height="600"
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
      <div class="categories-grid">
        <div 
          class="category-card"
          v-for="category in categoriesStore.allCategories" 
          :key="category.id"
          @click="goToCategory(category.name)"
        >
          <img
            :src="category.image || '/fotos/default.jpg'"
            :alt="category.name"
            class="category-card__image"
          />
          <div class="category-card__title">{{ category.name }}</div>
        </div>
      </div>
    </section>

    <!-- Productos Destacados -->
    <section class="home__products">
      <h2 class="section-title">Productos Destacados</h2>
      <div class="products-grid">
        <ProductCard
          v-for="product in productsStore.randomProducts"
          :key="product.id"
          :producto="product"
        />
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
  { image: '/fotos/carrusel3.jpg', text: 'Dale vida a tu hogar con un toque único' },
  { image: '/fotos/carrusel1.jpg', text: 'Pequeños detalles con un gran impacto' },
  { image: '/fotos/carrusel4.jpg', text: 'Confort y elegancia en cada rincón' },
  { image: '/fotos/carrusel2.jpg', text: 'Transforma tu espacio en un hogar acogedor' },
  { image: '/fotos/carrusel5.jpg', text: 'Encuentra la inspiración que necesitas' },
]);

// Cargar categorías y productos destacados
onMounted(async () => {
  await categoriesStore.fetchCategories();
  await productsStore.fetchProducts();
  console.log('Categorías cargadas:', categoriesStore.allCategories);
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

  /* Sección de categorías */
  &__categories {
    width: 100%;
    margin: 0;
    padding: 0;

    .categories-grid {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      margin: 0;
      padding: 0;
      gap: 0;
    }

    .category-card {
      flex: 0 0 calc(100% / 3);
      position: relative;
      overflow: hidden;
      cursor: pointer;

      &__image {
        width: 100%;
        height: 600px; /* Ajusta la altura a tu gusto */
        object-fit: cover;
        display: block;
      }

      &__title {
        position: absolute;
        top: 1rem; /* Ubicado en la parte superior */
        left: 50%;
        transform: translateX(-50%);
        /* Se removió el fondo oscuro */
        background-color: transparent;
        color: #fff;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: bold;
        text-align: center;
        font-size: 1.2rem;
      }
    }
  }
}

/* Productos Destacados */
.home__products {
  padding: 16px;
}

/* Títulos más grandes (se mantiene para Productos Destacados) */
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
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.8);
}

/* Grid de productos destacados */
.products-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}
</style>
