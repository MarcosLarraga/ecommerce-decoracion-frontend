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
      item-title="nombre"
      item-value="id"
      @update:search-input="onSearchInput"
      @change="onSelectItem"
      @keydown.enter.prevent="onEnter"
    >
      <template v-slot:item="{ props, item }">
        <v-list-item v-bind="props">
          <v-list-item-content>
            <v-list-item-title>{{ item.raw.nombre }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.raw.precio | currency }}</v-list-item-subtitle>
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
import { ref, computed } from 'vue';
import { useProductsStore } from '@/stores/productsStore';
import { useRouter } from 'vue-router';
import debounce from 'lodash/debounce';

const router = useRouter();
const store = useProductsStore();

const searchQuery = ref('');
const selectedItem = ref(null);

const isLoading = computed(() => store.loading);
const filteredItems = computed(() => store.allProducts);

const onSearchInput = debounce(async (query: string) => {
  searchQuery.value = query;
  if (!query) {
    store.allProducts = [];
    return;
  }
  await store.searchProducts(query);
}, 300);

const redirectToProductsPage = (query: string) => {
  router.push({
    name: 'Products',
    query: { search: query }
  });
};

const onSelectItem = (value: any) => {
  if (value && value.nombre) {
    redirectToProductsPage(value.nombre);
  }
};

const onEnter = () => {
  if (searchQuery.value) {
    redirectToProductsPage(searchQuery.value);
  }
};
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
