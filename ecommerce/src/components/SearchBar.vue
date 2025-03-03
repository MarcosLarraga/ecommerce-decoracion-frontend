<template>
  <div class="search">
    <v-text-field
      v-model="searchQuery"
      @keyup.enter="goToProducts"
      placeholder="Buscar..."
      variant="plain"
      density="compact"
      hide-details
      class="search__field"
      prepend-inner-icon="mdi-magnify"
      dark
    ></v-text-field>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');

const goToProducts = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: "Products",
      query: { search: searchQuery.value }
    });
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

:deep(.v-field__input) {
  padding-top: 0;
  padding-bottom: 0;
  min-height: 32px;
  color: #000000 !important;
}

:deep(.v-field__prepend-inner) {
  padding-right: 8px;
  color: #000000 !important;
}

:deep(.v-field__field) {
  font-size: 16px;
}

:deep(.v-field__outline) {
  display: none;
}

:deep(.v-field__input input::placeholder) {
  color: #000000;
  font-weight: 400;
  opacity: 0.8;
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
