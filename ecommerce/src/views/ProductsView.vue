<template>
  <div class="shop">
    <h1 class="shop__title">Productos</h1>

    <!-- Filtro de categorías -->
    <div class="shop__filter">
      <label for="categorySelect" class="shop__filter-label">
        Filtrar por categoría:
      </label>
      <select id="categorySelect" v-model="selectedCategory" class="shop__filter-select">
        <option value="Todas">Todas</option>
        <option
          v-for="category in categoriesStore.allCategories"
          :key="category.id"
          :value="category.name"
        >
          {{ category.name }}
        </option>
      </select>
    </div>

    <!-- Lista de productos -->
    <div class="products-grid">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :producto="product"
      />
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

const selectedCategory = ref<string>('Todas');

onMounted(async () => {
  await productsStore.fetchProducts();
  await categoriesStore.fetchCategories();

  if (route.query.category) {
    selectedCategory.value = String(route.query.category);
  }
});

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

/* Estilos para el bloque principal */
.shop {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-md;
  text-align: center;
  margin-top: 10%;

  &__title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: $spacing-md;
  }

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
      width: 100%;
      max-width: 250px;
      background: white;
    }
  }
}

/* Grid de productos */
.products-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: $spacing-md;
  justify-items: center;
}

/* Media query para pantallas medianas */
@media (min-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}
</style>
