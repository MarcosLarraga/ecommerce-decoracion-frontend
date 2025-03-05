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
        <v-list-item v-bind="props" class="search-item">
          <div class="search-item__content">
            <v-list-item-title>{{ item.raw.nombre }}</v-list-item-title>
            <v-list-item-subtitle>{{ formatCurrency(item.raw.precio) }}</v-list-item-subtitle>
          </div>
          <v-img
            :src="item.raw.urlImagen"
            width="50"
            height="50"
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
  background-color: rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s ease;

  &:hover, &:focus-within {
    background-color: rgba(255, 255, 255, 0.2);
  }
}

.rounded-img {
  border-radius: 8px;
  margin-left: 16px;
  object-fit: cover;
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

:deep(.v-autocomplete__content) {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

:deep(.v-list-item) {
  padding: 8px 16px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

:deep(.v-list-item__content) {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

:deep(.v-list-item-title) {
  font-weight: 500;
  margin-bottom: 4px;
}

:deep(.v-list-item-subtitle) {
  font-size: 0.85em;
  color: rgba(0, 0, 0, 0.6);
}

@media (min-width: 768px) {
  .search {
    width: 300px;
  }
}

@media (min-width: 1024px) {
  .search {
    width: 350px;
  }
}
</style>
