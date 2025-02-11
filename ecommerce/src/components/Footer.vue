<template>
    <v-footer class="footer">
      <v-container>
        <v-row>
          <v-col cols="12" md="4" class="footer__section">
            <h3 class="footer__title">LM Decor</h3>
            <p class="footer__text">Explora nuestra colección exclusiva de decoración para el hogar.</p>
          </v-col>
          <v-col cols="12" md="4" class="footer__section">
            <h3 class="footer__title">Enlaces Rápidos</h3>
            <ul class="footer__list">
              <li><RouterLink to="/" class="footer__link">Inicio</RouterLink></li>
              <li><RouterLink to="/productos" class="footer__link">Productos</RouterLink></li>
              <li><RouterLink to="/carrito" class="footer__link">Carrito</RouterLink></li>
              <li><RouterLink to="/about" class="footer__link">Sobre Nosotros</RouterLink></li>
            </ul>
          </v-col>
          <v-col cols="12" md="4" class="footer__section">
            <h3 class="footer__title">Contacto</h3>
            <p class="footer__text">Email: contacto@lmdecor.com</p>
            <p class="footer__text">Teléfono: +34 123 456 789</p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router';
  </script>
  
  <style scoped lang="scss">
  @use '@/styles/variables' as *;
  
  .footer {
    background-color: $background-color;
    padding: $spacing-lg 0;
    text-align: center;
    border-top: 2px solid $border-color;
    color: $text-color;
  
    &__section {
      padding: $spacing-md;
    }
  
    &__title {
      font-size: $font-size-large;
      color: $primary-color;
      margin-bottom: $spacing-sm;
    }
  
    &__text {
      font-size: $font-size-base;
    }
  
    &__list {
      list-style: none;
      padding: 0;
    }
  
    &__link {
      text-decoration: none;
      color: $secondary-color;
      font-size: $font-size-base;
      font-weight: bold;
  
      &:hover {
        color: $primary-color;
      }
    }
  }
  </style>