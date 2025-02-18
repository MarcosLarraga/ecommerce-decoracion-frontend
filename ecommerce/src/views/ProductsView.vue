<template>
  <div class="shop">
    <h1 class="shop__title">Productos</h1>

    <!-- Filtro de categorías -->
    <div class="shop__filter">
      <label for="categorySelect">Filtrar por categoría:</label>
      <select id="categorySelect" v-model="selectedCategory">
        <option value="Todas">Todas</option>
        <option v-for="category in categoriesStore.allCategories" :key="category.id" :value="category.name">
          {{ category.name }}
        </option>
      </select>
    </div>

    <!-- Lista de productos -->
    <div class="shop__grid">
      <ProductCard v-for="product in filteredProducts" :key="product.id" :producto="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/productsStore';
import { useCategoriesStore } from '@/stores/categoriesStore';
import ProductCard from '@/components/ProductCard.vue';

const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();
const route = useRoute();
const router = useRouter();

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
.shop {
  width: 90%;
  max-width: 1200px;
  margin: 100px auto 0;
  text-align: center;

  &__title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 20px;
  }

  &__filter {
    margin-bottom: 20px;

    label {
      font-size: 1.2rem;
      font-weight: bold;
      margin-right: 10px;
    }

    select {
      padding: 8px;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 5px;
      cursor: pointer;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    justify-content: center;
  }
}
</style>
