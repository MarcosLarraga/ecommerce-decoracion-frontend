<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '@/stores/productsStore';
import { useCategoriesStore } from '@/stores/categoriesStore';
import ProductCard from '@/components/ProductCard.vue';

const productsStore = useProductsStore();
const categoriesStore = useCategoriesStore();
const route = useRoute();

// Estado para la categoría seleccionada (por defecto "Todas")
const selectedCategory = ref<string>('Todas');

// Cargar productos y categorías al montar la vista
onMounted(async () => {
  await productsStore.fetchProducts();
  await categoriesStore.fetchCategories();

  // Si venimos desde una categoría en Home, la seleccionamos
  if (route.query.category) {
    selectedCategory.value = String(route.query.category);
  }
});

// Computed para filtrar productos según la categoría seleccionada
const filteredProducts = computed(() => {
  if (!selectedCategory.value || selectedCategory.value === 'Todas') {
    return productsStore.allProducts;
  }

  // Buscar el ID de la categoría seleccionada
  const selectedCategoryObject = categoriesStore.allCategories.find(
    (category) => category.name === selectedCategory.value
  );

  if (!selectedCategoryObject) {
    console.warn("No se encontró la categoría seleccionada:", selectedCategory.value);
    return productsStore.allProducts;
  }

  console.log("Filtrando productos por categoría ID:", selectedCategoryObject.id);

  // Filtrar productos por categoriaId
  return productsStore.allProducts.filter(
    (product) => product.categoriaId === selectedCategoryObject.id
  );
});
</script>

<template>
  <v-container>
    <h1 class="section-title">Productos</h1>

    <!-- Filtro de categorías -->
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedCategory"
          :items="['Todas', ...categoriesStore.allCategories.map(c => c.name)]"
          label="Filtrar por categoría"
          outlined
        />
      </v-col>
    </v-row>

    <!-- Lista de productos -->
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="3"
        v-for="product in filteredProducts"
        :key="product.id"
      >
        <ProductCard :product="product" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.section-title {
  text-align: center;
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
