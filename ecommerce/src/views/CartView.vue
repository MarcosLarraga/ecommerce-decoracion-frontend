<template>
    <v-container>
      <h1>Carrito de Compras</h1>
      <v-list>
        <v-list-item v-for="product in cartStore.items" :key="product.id">
          <v-list-item-content>
            <v-list-item-title>{{ product.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ product.price }} €</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-container>
  </template>
  
  <script setup>
  
  const cartStore = useCartStore();
  </script>
  
  <style scoped lang="scss">
  @use '@/styles/variables' as *;  </style>