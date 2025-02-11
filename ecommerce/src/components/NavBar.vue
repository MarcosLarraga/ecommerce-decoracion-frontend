<template>
    <nav class="navbar">
      <RouterLink to="/" class="navbar__link">Home</RouterLink>
      <RouterLink to="/productos" class="navbar__link">Productos</RouterLink>
      <RouterLink to="/carrito" class="navbar__link">Carrito</RouterLink>
      <RouterLink to="/about" class="navbar__link">Sobre Nosotros</RouterLink>
    </nav>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router';
  </script>
  
  <style scoped lang="scss">
@use '@/styles/variables' as *;

  
  .navbar {
    display: flex;
    justify-content: center;
    padding: 1rem;
    background-color: $background-color;
    border-bottom: 1px solid $border-color;
  }
  
  .navbar__link {
    color: $text-color;
    text-decoration: none;
    padding: 0.5rem 1rem;
    font-size: $font-size-base;
  
    &:hover {
      color: $primary-color;
    }
  }
  </style>