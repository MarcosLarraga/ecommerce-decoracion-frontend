<template>
  <div class="shop">
    <h1 class="shop__title">Productos</h1>

    <!-- Filtro de categorías -->
    <div class="shop__filter">
      <label for="categorySelect" class="shop__filter-label">Filtrar por categoría:</label>
      <select id="categorySelect" v-model="selectedCategory" class="shop__filter-select">
        <option value="Todas">Todas</option>
        <option v-for="category in categoriesStore.allCategories" :key="category.id" :value="category.name">
          {{ category.name }}
        </option>
      </select>
    </div>

    <!-- Lista de productos -->
    <div class="products-grid">
      <ProductCard v-for="product in filteredProducts" :key="product.id" :producto="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '@/stores/productsStore';
import { useCategoriesStore } from '@/stores/categoriesStore';
import ProductCard from '@/components/ProductCard.vue';

const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();
const route = useRoute();

// Estado para la categoría seleccionada
const selectedCategory = ref<string>('Todas');

// Cargar productos y categorías al montar la vista
onMounted(async () => {
  await productsStore.fetchProducts();
  await categoriesStore.fetchCategories();

  // Si la URL tiene una categoría en la query, seleccionarla automáticamente
  if (route.query.category) {
    selectedCategory.value = String(route.query.category);
  }
});

// Escuchar cambios en la URL y actualizar el filtro si la categoría cambia
watch(() => route.query.category, (newCategory) => {
  if (newCategory) {
    selectedCategory.value = String(newCategory);
  }
});

// Función para mezclar productos aleatoriamente
const shuffleArray = (array: any[]) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

// Computed para filtrar productos según la categoría seleccionada y mezclarlos
const filteredProducts = computed(() => {
  let products = productsStore.allProducts;

  if (selectedCategory.value !== 'Todas') {
    const selectedCategoryObject = categoriesStore.allCategories.find(
      (category) => category.name === selectedCategory.value
    );

    if (selectedCategoryObject) {
      products = products.filter(
        (product) => product.categoriaId === selectedCategoryObject.id
      );
    }
  }

  return shuffleArray(products);
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

/* 📌 Diseño General */
.shop {
  width: 100%;
  max-width: 1200px;
  padding: $spacing-md;
  text-align: center;

  &__title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: $spacing-md;
  }

  /* 📌 Filtro de categorías */
  &__filter {
    margin-bottom: $spacing-md;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;

    &-label {
      font-size: $font-size-base;
      font-weight: bold;
    }

    &-select {
      padding: $spacing-xs;
      font-size: $font-size-base;
      border: 1px solid $border-color;
      border-radius: $border-radius;
      cursor: pointer;
      width: 250px;
      background: white;
    }
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
