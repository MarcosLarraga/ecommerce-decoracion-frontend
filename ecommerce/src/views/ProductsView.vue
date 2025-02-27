<template>
  <div class="shop">
    <h1 class="shop__title">Productos</h1>

    <!-- Filtro de categorías -->
    <div class="shop__filter">
      <label for="categorySelect" class="shop__filter-label">
        Filtrar por categoría:
      </label>
      <select
        id="categorySelect"
        v-model="selectedCategory"
        class="shop__filter-select"
      >
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

    <!-- si no hay productos encontrados -->
    <p v-if="filteredProducts.length === 0" class="no-results">
      No se encontraron productos de "<strong>{{ route.query.search }}</strong>"
    </p>

    <!-- Lista de productos -->
    <div v-else class="products-grid">
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

// Categoría seleccionada
const selectedCategory = ref<string>('Todas');

// Al montar el componente, cargamos categorías y verificamos búsqueda
onMounted(async () => {
  await categoriesStore.fetchCategories();

  const searchParam = route.query.search ? String(route.query.search) : '';
  if (searchParam) {
    await productsStore.searchProducts(searchParam);
  } else {
    await productsStore.fetchProducts();
  }

  if (route.query.category) {
    selectedCategory.value = String(route.query.category);
  }
});

// Detectar cambios en la URL para actualizar la búsqueda y categoría
watch(
  () => route.query.search,
  async (newSearch) => {
    if (newSearch) {
      await productsStore.searchProducts(String(newSearch));
    } else {
      await productsStore.fetchProducts();
    }
  }
);

watch(
  () => route.query.category,
  (newCategory) => {
    if (newCategory) {
      selectedCategory.value = String(newCategory);
    } else {
      selectedCategory.value = 'Todas';
    }
  }
);

// Computed: filtra los productos según la categoría seleccionada y los mezcla
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
  return products;
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

/* Ajuste del espacio superior */
.shop {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-md;
  text-align: center;
  margin-top: 50px; /* ✅ Separación equilibrada */
}

/* ✅ Estilos del mensaje de "sin resultados" */
.no-results {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff0000; /* Rojo para destacar */
  margin-top: 20px;
}

/* Estilo del título */
.shop__title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: $spacing-md;
  margin-top: 0 !important;
}

/* Estilos para el filtro de categorías */
.shop__filter {
  margin-bottom: 60px;
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
