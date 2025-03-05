<template>
  <div class="search">
    <v-autocomplete
      v-model="selectedItem"
      :items="filteredItems"
      :loading="isLoading"
      :search-input.sync="searchQuery"
      placeholder="Buscar productos..."
      variant="plain"
      density="compact"
      hide-details
      class="search__field"
      prepend-inner-icon="mdi-magnify"
      dark
      return-object
      item-title="nombre"
      @update:search-input="onSearchInput"
      @keydown.enter.prevent="onEnter"
    >
      <template v-slot:item="{ props, item }">
        <v-list-item v-bind="props">
          <v-list-item-content>
            <v-list-item-title>{{ item.raw.nombre }}</v-list-item-title>
            <v-list-item-subtitle>{{ formatCurrency(item.raw.precio) }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-img
            :src="item.raw.urlImagen"
            max-width="50"
            max-height="50"
            class="rounded-img"
          ></v-img>
        </v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useProductsStore } from '@/stores/productsStore';
import { useRouter } from 'vue-router';
import debounce from 'lodash/debounce';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(value);
}

const router = useRouter();
const store = useProductsStore();

const searchQuery = ref('');
const selectedItem = ref(null);

const isLoading = computed(() => store.loading);
const filteredItems = computed(() => store.allProducts);

const onSearchInput = debounce(async (query: string) => {
  searchQuery.value = query.trim();
  if (!searchQuery.value) {
    await store.fetchProducts();
    return;
  }
  await store.searchProducts(searchQuery.value);
}, 300);

const redirectToProductDetail = (id: number) => {
  console.log('Redirigiendo a producto con ID:', id);
  // Forzamos la recarga completa de la página
  window.location.href = `/product/${id}`;
};

const onEnter = () => {
  console.log('Enter presionado. searchQuery:', searchQuery.value);
  if (!searchQuery.value) return;
  const matchedProduct = store.allProducts.find((item) =>
    item.raw.nombre.toLowerCase() === searchQuery.value.toLowerCase()
  );
  if (matchedProduct && matchedProduct.raw.id) {
    redirectToProductDetail(matchedProduct.raw.id);
  } else {
    router.push({
      name: 'Products',
      query: { search: searchQuery.value }
    });
  }
};

watch(selectedItem, (value) => {
  console.log('Cambio en selectedItem:', value);
  if (value && typeof value === 'object') {
    const productId = value.raw ? value.raw.id : value.id;
    if (productId) {
      redirectToProductDetail(productId);
    } else {
      console.warn('Producto seleccionado no tiene id:', value);
    }
  }
});

onMounted(() => {
  if (store.allProducts.length === 0) {
    store.fetchProducts();
  }
});
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.search {
  width: 100%;
  max-width: 300px;
}

.search__field {
  border-bottom: 1px solid #000000 !important;
  border-radius: 0;
}

.rounded-img {
  border-radius: 8px;
}

:deep(.v-field__input) {
  padding-top: 0;
  padding-bottom: 0;
  min-height: 32px;
  color: #000000 !important;
}

:deep(.mdi-magnify) {
  color: #000000 !important;
}

@media (min-width: 768px) {
  .search {
    width: 250px;
  }
}

@media (min-width: 1024px) {
  .search {
    width: 200px;
  }
}
</style>
