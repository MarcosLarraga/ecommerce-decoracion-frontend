<template>
  <v-container fluid class="home">
    <!-- Hero Section -->
    <v-row no-gutters class="home__hero">
      <v-col cols="12" class="home__hero-container">
        <v-img src="/fotos/fotoHero1.jpg" alt="Nueva colección" class="home__hero-bg" cover />
        <div class="home__hero-overlay">
          <h1 class="home__hero-title">Descubre los mejores complementos para tu hogar</h1>
        </div>
      </v-col>
    </v-row>


    <!-- Categorías -->
    <v-container>
      <h2 class="section-title">Categorías</h2>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="4" lg="3" v-for="category in categoriesStore.allCategories" :key="category.id">
          <v-card class="home__category" @click="goToCategory(category.name)">
            <v-img :src="category.image" :alt="category.name" class="home__category-image" />
            <div class="home__category-title">
              {{ category.name }}
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Productos Destacados -->
    <v-container>
      <h2 class="section-title">Productos Destacados</h2>
      <v-row justify="center">
        <v-col cols="12" sm="6" md="4" lg="3" v-for="product in productsStore.randomProducts" :key="product.id">
          <ProductCard :producto="product" />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
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

// Función para navegar a la vista de productos con la categoría seleccionada
const goToCategory = (categoryName: string) => {
  router.push({ path: '/products', query: { category: categoryName } });
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

@use '@/styles/variables' as *;

.home {
  padding: 0;
  margin: 0;

  &__hero {
    width: 100vw;
    height: 55vh; // ✅ Aumentamos la altura del Hero en móviles
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    margin-top: 0; // ✅ Asegurar que esté justo debajo del navbar

    @media (min-width: $breakpoint-md) {
      height: 70vh; // ✅ Más altura en pantallas grandes
    }

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
      background: rgba(0, 0, 0, 0.6); // ✅ Fondo más oscuro para legibilidad
      padding: $spacing-sm;
      border-radius: $border-radius;
      text-align: center;
      width: 85%; // ✅ Más pequeño en móviles para que no se corte
      max-width: 600px;

      @media (min-width: $breakpoint-md) {
        padding: $spacing-md;
        width: 70%;
      }
    }

    &-title {
      font-size: $font-size-base; // ✅ Tamaño más pequeño en móviles
      font-family: $font-family-primary;
      color: $background-color;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0;

      @media (min-width: $breakpoint-md) {
        font-size: 2rem; // ✅ Tamaño más grande en pantallas grandes
      }
    }
  }

  &__categories {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
  }

  &__category {
    height: 250px;
    text-align: center;
    border-radius: $border-radius;
    box-shadow: $box-shadow;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
    cursor: pointer;
    background-color: $background-color;

    &:hover {
      transform: scale(1.05);
    }
  }

  &__category-title {
    background-color: rgba(255, 255, 255, 0.85);
    color: $text-color;
    font-size: $font-size-large;
    font-weight: bold;
    text-align: center;
    padding: $spacing-sm;
    width: 100%;
    position: absolute;
    bottom: 0;
  }

  &__category-image {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}

.section-title {
  text-align: center;
  font-size: $font-size-large;
  font-weight: bold;
  margin: $spacing-lg 0;
}

</style>
