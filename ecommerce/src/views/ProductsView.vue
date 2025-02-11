<template>
  <v-container>
    <h1>Nuestros Productos</h1>
    <v-row>
      <v-col cols="12" sm="6" md="4" v-for="product in productStore.products" :key="product.id">
        <ProductCard :product="product" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProductStore } from '@/stores/productStore';
import ProductCard from '@/components/ProductCard.vue';

const productStore = useProductStore();

onMounted(() => {
  productStore.fetchProducts();
});
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;</style>
