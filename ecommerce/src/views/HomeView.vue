<template>
  <v-container>
    <h1>Bienvenido a LM Decor</h1>
    <p>Explora nuestra colección de productos exclusivos para el hogar.</p>
    <v-btn color="primary" to="/productos">Ver Productos</v-btn>
  </v-container>
</template>

<script setup>
</script>

<style scoped lang="scss">
@import '@/styles/variables';

h1 {
  font-size: 2rem;
  color: $primary-color;
}
</style>